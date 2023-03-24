import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import Select, { Option } from "react-select";
import Row from "react-bootstrap/Row";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { useLocation } from "react-router";
import Button from "react-bootstrap/Button";
// import DropdownService from "../../../services/DropdownService";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import TableContainer from "@material-ui/core/TableContainer";
import { TablePagination as Paging } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { useSelector } from "react-redux";
import { ApplicationState } from "../../redux";
import history from "../../../helpers/history";
import verticalControlUnitService from "../../../helpers/services/verticalControlUnitService";

const AddVerticalControlUnit = () => {
  const ReduxLoginInfo: any = useSelector((state: ApplicationState) => state);
  const location = useLocation<any>();
  const prevStateRef: any = React.useRef();

  const [stateId, setStateId] = useState();
  const [stateIdValues, setstateIdValues] = useState([]);
  const [districtIdValues, setdistrictIdValues] = useState([]);
  const [talukaIdValues, settalukaIdValues] = useState([]);
  const [villageList, setvillageList] = useState([]);
  const [villageCodeList, setvillageCodeList] = useState([]);
  const [verticalControlUnitList, setVerticalControlUnitList] = useState([]);

  const [initialValues, setInitialValues] = useState({
    verticalControlName: "",
    unitType: "",
    nameOfOfficer: "",
    talukaId: "",
    districtId: "",
    stateId: "",
  });

  let NoneList = [{ label: "None", value: 0 }];

  let validSchema = Yup.object().shape({
    /* villageName: Yup.string()
       .required("Village Name is required")
       .test("village name", "Village name is already exist", (value: any) => {
         const enteredValue = value ? value.toLowerCase() : "";
         let list =
           location && location.state && location.state.id
             ? villageList.filter(
                 (li: "") =>
                   li.toLowerCase() !== initialValues.verticalControlName.toLowerCase()
               )
             : villageList;
         return !list.some((item: "") => item.toLowerCase() === enteredValue);
       }),
     villageCode: Yup.string()
       .required("Village Code is required")
       .test("village code", "Village code is already exist", (value: any) => {
         const enteredValue = value ? value.toLowerCase() : "";
         let list =
           location && location.state && location.state.id
             ? villageCodeList.filter(
                 (li: "") =>
                   li.toLowerCase() !== initialValues.unitType.toLowerCase()
               )
             : villageCodeList;
         return !list.some((item: "") => item.toLowerCase() === enteredValue);
       }),*/
    talukaId: Yup.string().required("Taluka is required"),
    districtId: Yup.string().required("District is required"),
    stateId: Yup.string().required("State is required"),
  });

  const formik = useFormik({
    initialValues: {
      verticalControlName: initialValues.verticalControlName ? initialValues.verticalControlName : "",
      unitType: initialValues.unitType ? initialValues.unitType : "",
      nameOfOfficer: initialValues.nameOfOfficer ? initialValues.nameOfOfficer : "",
      talukaId: initialValues.talukaId ? initialValues.talukaId : "",
      districtId: initialValues.districtId ? initialValues.districtId : "",
      stateId: initialValues.stateId ? initialValues.stateId : "",
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: async (values) => {
      const { verticalControlName, unitType, nameOfOfficer, talukaId, districtId, stateId } =
        values;
      if (location && location.state && location.state.id) {
        const editData = {
          // ...values,
          id: location.state.id,
          //verticalControlName: `${verticalControlName} (${unitType})`,
          nameOfControlUnit: `${verticalControlName}`,
          unitType: `${unitType}`,
          nameOfOfficer: `${nameOfOfficer}`,
          stateId: stateId,
          districtId: districtId,
          talukaId: talukaId,
          facilityId: null,
          subCenterId: null,
        };
        console.log(editData);
        verticalControlUnitService.createOrUpdateVerticalControlUnit(editData);
      } else {
        const addData = {
          nameOfControlUnit: `${verticalControlName}`,
          unitType: `${unitType}`,
          nameOfOfficer: `${nameOfOfficer}`,
          stateId: stateId,
          districtId: districtId,
          talukaId: talukaId,
          facilityId: null,
          subCenterId: null,
        };
        let response = await verticalControlUnitService.createOrUpdateVerticalControlUnit(addData);
        if (response) {
          history.push('/VerticalControlUnitList');
        }
      }
    },
  });

  const stateIdList =
    stateIdValues &&
    stateIdValues.map((item: any, i: any) => {
      return { label: item.stateName, value: item.id };
    });

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  const talukaIdList =
    talukaIdValues &&
    talukaIdValues.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });

  async function getState(e: any) {
    if (e && e.value) {
      setStateId(e && e.value);
    }
  }

  // async function getDistrict(e: any) {
  //   if (e && e.value) {
  //     setStateId(e && e.value);
  //   }
  // }

  async function getStateList() {
    const stateId: any = await verticalControlUnitService.getState();
    if (stateId && stateId.data) {
      setstateIdValues(stateId.data);
    }
  }

  const getDistrictList = useCallback(() => {
    async function getData() {
      if (formik.values.stateId) {
        const response = await verticalControlUnitService.getOneDistrict(
          formik.values.stateId
        );
        if (response && response.data) {
          setdistrictIdValues(response.data);
        }
      }
    }
    getData();
  }, [formik.values.stateId]);

  const getTalukaList = useCallback(() => {
    async function getData() {
      if (formik.values.stateId && formik.values.districtId) {
        const response = await verticalControlUnitService.getOneTaluka(
          formik.values.districtId
        );
        if (response && response.data) {
          settalukaIdValues(response.data);
        }
      }
    }
    getData();
  }, [formik.values.stateId, formik.values.districtId]);

  async function getVillageList() {
    const villageList: any = await verticalControlUnitService.getVillage();
    if (villageList && villageList.data) {
      let villages = villageList.data.map((item: any, i: any) => {
        let villageName = item.villageName.split("").reverse("");
        let sliceIndex = villageName.indexOf("(");
        return villageName
          .slice(sliceIndex + 1, villageName.length)
          .reverse()
          .join("")
          .trim();
      });

      setvillageList(villages);
      const villageCodeRegex = /\(([^)]*)\)[^(]*$/;

      let villageCode = villageList.data.map((item: any, i: any) => {
        let villageCode = item.villageName.match(villageCodeRegex);
        return villageCode ? villageCode[1] : "";
      });

      setvillageCodeList(villageCode);
    }
  }

  const getOneVerticalControlUnitInfo = useCallback(() => {
    async function getData() {
      if (location && location.state && location.state.id) {
        const response = await verticalControlUnitService.getOneVerticalControlUnitInfo(location.state.id, location.state.unitType);
        if (response && response.data && response.data.length > 0) {
          console.log(response.data);
          let verticalControlName = response.data[0]?.nameOfControlUnit
            ?.split("")
            .reverse("");
          let sliceIndex = verticalControlName?.indexOf("(");
          let ExtractedverticalControlName = verticalControlName
            ?.slice(sliceIndex + 1, verticalControlName?.length)
            .reverse()
            .join("")
            .trim();

          let unitType =
            response.data[0].unitType; //?.match(/\(([^)]*)\)[^(]*$/);
          let nameOfOfficer = response.data[0].nameOfOfficer;
          console.log(unitType);
          setInitialValues((prev) => {
            return {
              ...prev,
              verticalControlName: ExtractedverticalControlName,
              unitType: unitType ? unitType : "",
              nameOfOfficer: nameOfOfficer ? nameOfOfficer : "",
              districtId: response.data[0].districtId,
              talukaId: response.data[0].talukaId,
              stateId: response.data[0].stateId,
            };
          });
        }
      }
    }
    getData();
  }, [location]);

  useEffect(() => {
    getDistrictList();
    getStateList();
    getTalukaList();
  }, [getDistrictList, getTalukaList]);

  useEffect(() => {
    getVillageList();
  }, []);

  useEffect(() => {
    getOneVerticalControlUnitInfo();
  }, [getOneVerticalControlUnitInfo]);

  return (
    <div className="content add-page">
      <div className="card">
        <div className="card-header">
          <h1 className="cardtitlenew">
            {location.state ? "" : "Add Vertical Control Unit"}
            {location.state &&
              location.state.id &&
              location.state.view &&
              "Vertical Control Unit"}
            {location.state &&
              location.state.id &&
              !location.state.view &&
              "Edit Vertical Control Unit"}
          </h1>
        </div>
        <div className="card-body">
          <FormikProvider value={formik}>
            <form
              style={{ width: "100%" }}
              onSubmit={formik.handleSubmit}
              onChange={formik.handleChange}
            >
              <fieldset
                disabled={location.state && location.state.view ? true : false}
              >
                <Row>
                  <div className="col-md-3 col-xl-3">
                    <div className="form-grp">
                      <label htmlFor="Vertical Control Unit Name" className="form-label">
                        Vertical Control Unit Name
                      </label>
                      <input
                        name="verticalControlName"
                        value={formik.values.verticalControlName}
                        type="text"
                        className={
                          formik.errors.verticalControlName &&
                            formik.touched.verticalControlName
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) =>
                          formik.setFieldValue("verticalControlName", e.target.value)
                        }
                        autoComplete="off"
                      />
                      <div className={"invalid-feedback"}>
                        {formik.errors.verticalControlName
                          ? formik.errors.verticalControlName
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-xl-3">
                    <div className="form-grp">
                      <label htmlFor="Unit Type" className="form-label">
                        Unit Type
                      </label>
                      <input
                        name="unitType"
                        value={formik.values.unitType}
                        type="text"
                        className={
                          formik.errors.unitType &&
                            formik.touched.unitType
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) =>
                          formik.setFieldValue("unitType", e.target.value)
                        }
                        autoComplete="off"
                      />
                      <div className={"invalid-feedback"}>
                        {formik.errors.unitType
                          ? formik.errors.unitType
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-xl-3">
                    <div className="form-grp">
                      <label htmlFor="Name Of Officer" className="form-label">
                        Name Of Officer
                      </label>
                      <input
                        name="nameOfOfficer"
                        value={formik.values.nameOfOfficer}
                        type="text"
                        className={
                          formik.errors.nameOfOfficer &&
                            formik.touched.nameOfOfficer
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) =>
                          formik.setFieldValue("nameOfOfficer", e.target.value)
                        }
                        autoComplete="off"
                      />
                      <div className={"invalid-feedback"}>
                        {formik.errors.nameOfOfficer
                          ? formik.errors.nameOfOfficer
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-xl-3">
                    <div className="form-grp">
                      <label htmlFor="StateId" className="form-label font-chng">
                        State
                      </label>
                      {stateIdValues && stateIdValues.length !== 0 ? (
                        <Select
                          name="stateId"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: "#ced4da",
                              fontSize: "14px",
                              color: "#212529",
                              minHeight: "35px",
                              height: "35px",
                              "&:hover": {
                                borderColor: "#ced4da",
                              },
                            }),
                            menu: (base) => ({
                              top: "100%",
                              backgroundColor: "hsl(0, 0%, 100%)",
                              borderRadius: "4",
                              boxShadow:
                                "0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)",
                              marginBottom: "8px",
                              marginTop: "8px",
                              position: "absolute",
                              width: "100%",
                              boxSizing: "border-box",
                              zIndex: "9999",
                            }),
                            placeholder: (base) => ({
                              color: "#212529",
                              fontSize: "13px",
                            }),
                            indicatorContainer: (base) => ({
                              color: "#212529",
                            }),
                          }}
                          options={stateIdList}
                          isClearable="true"
                          className={
                            formik.errors.stateId && formik.touched.stateId
                              ? "custom-select is-invalid"
                              : "custom-select"
                          }
                          value={
                            formik.values.stateId !== ""
                              ? stateIdList
                                ? stateIdList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.stateId
                                )
                                : ""
                              : ""
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              "stateId",
                              option && option.value
                            );
                            getState(option);
                          }}
                        ></Select>
                      ) : (
                        <Select
                          name="stateId"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: "#ced4da",
                              fontSize: "14px",
                              color: "#212529",
                              minHeight: "35px",
                              height: "35px",
                              "&:hover": {
                                borderColor: "#ced4da",
                              },
                            }),
                            menu: (base) => ({
                              top: "100%",
                              backgroundColor: "hsl(0, 0%, 100%)",
                              borderRadius: "4",
                              boxShadow:
                                "0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)",
                              marginBottom: "8px",
                              marginTop: "8px",
                              position: "absolute",
                              width: "100%",
                              boxSizing: "border-box",
                              zIndex: "9999",
                            }),
                            placeholder: (base) => ({
                              color: "#212529",
                              fontSize: "13px",
                            }),
                            indicatorContainer: (base) => ({
                              color: "#212529",
                            }),
                          }}
                          //options={NoneList}
                          className="custom-select"
                          options={NoneList}
                          isClearable="true"
                          value={
                            NoneList
                              ? NoneList.find(
                                (option) =>
                                  option &&
                                  option.value ===
                                  parseInt(formik.values.stateId)
                              )
                              : ""
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              "stateId",
                              option && option.value
                            );
                          }}
                        ></Select>
                      )}
                      <div className={"invalid-feedback"}>
                        {formik.errors ? formik.errors.stateId : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-xl-3">
                    <div className="form-grp">
                      <label
                        htmlFor="districtId"
                        className="form-label font-chng"
                      >
                        District
                      </label>
                      {districtIdValues && districtIdValues.length !== 0 ? (
                        <Select
                          name="districtId"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: "#ced4da",
                              fontSize: "14px",
                              color: "#212529",
                              minHeight: "35px",
                              height: "35px",
                              "&:hover": {
                                borderColor: "#ced4da",
                              },
                            }),
                            menu: (base) => ({
                              top: "100%",
                              backgroundColor: "hsl(0, 0%, 100%)",
                              borderRadius: "4",
                              boxShadow:
                                "0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)",
                              marginBottom: "8px",
                              marginTop: "8px",
                              position: "absolute",
                              width: "100%",
                              boxSizing: "border-box",
                              zIndex: "9999",
                            }),
                            placeholder: (base) => ({
                              color: "#212529",
                              fontSize: "13px",
                            }),
                            indicatorContainer: (base) => ({
                              color: "#212529",
                            }),
                          }}
                          options={districtIdList}
                          isClearable="true"
                          className={
                            formik.errors.districtId &&
                              formik.touched.districtId
                              ? "custom-select is-invalid"
                              : "custom-select"
                          }
                          value={
                            formik.values.districtId !== ""
                              ? districtIdList
                                ? districtIdList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.districtId
                                )
                                : ""
                              : ""
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              "districtId",
                              option && option.value
                            );
                            getState(option);
                          }}
                        ></Select>
                      ) : (
                        <Select
                          name="districtId"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: "#ced4da",
                              fontSize: "14px",
                              color: "#212529",
                              minHeight: "35px",
                              height: "35px",
                              "&:hover": {
                                borderColor: "#ced4da",
                              },
                            }),
                            menu: (base) => ({
                              top: "100%",
                              backgroundColor: "hsl(0, 0%, 100%)",
                              borderRadius: "4",
                              boxShadow:
                                "0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)",
                              marginBottom: "8px",
                              marginTop: "8px",
                              position: "absolute",
                              width: "100%",
                              boxSizing: "border-box",
                              zIndex: "9999",
                            }),
                            placeholder: (base) => ({
                              color: "#212529",
                              fontSize: "13px",
                            }),
                            indicatorContainer: (base) => ({
                              color: "#212529",
                            }),
                          }}
                          //options={NoneList}
                          className="custom-select"
                          options={NoneList}
                          isClearable="true"
                          value={
                            NoneList
                              ? NoneList.find(
                                (option) =>
                                  option &&
                                  option.value ===
                                  parseInt(formik.values.districtId)
                              )
                              : ""
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              "districtId",
                              option && option.value
                            );
                          }}
                        ></Select>
                      )}
                      <div className={"invalid-feedback"}>
                        {formik.errors ? formik.errors.districtId : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-xl-3">
                    <div className="form-grp">
                      <label
                        htmlFor="talukaId"
                        className="form-label font-chng"
                      >
                        Taluka
                      </label>
                      {talukaIdValues && talukaIdValues.length !== 0 ? (
                        <Select
                          name="talukaId"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: "#ced4da",
                              fontSize: "14px",
                              color: "#212529",
                              minHeight: "35px",
                              height: "35px",
                              "&:hover": {
                                borderColor: "#ced4da",
                              },
                            }),
                            menu: (base) => ({
                              top: "100%",
                              backgroundColor: "hsl(0, 0%, 100%)",
                              borderRadius: "4",
                              boxShadow:
                                "0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)",
                              marginBottom: "8px",
                              marginTop: "8px",
                              position: "absolute",
                              width: "100%",
                              boxSizing: "border-box",
                              zIndex: "9999",
                            }),
                            placeholder: (base) => ({
                              color: "#212529",
                              fontSize: "13px",
                            }),
                            indicatorContainer: (base) => ({
                              color: "#212529",
                            }),
                          }}
                          options={talukaIdList}
                          isClearable="true"
                          className={
                            formik.errors.talukaId && formik.touched.talukaId
                              ? "custom-select is-invalid"
                              : "custom-select"
                          }
                          value={
                            formik.values.talukaId !== ""
                              ? talukaIdList
                                ? talukaIdList.find(
                                  (option) =>
                                    option &&
                                    option.value === formik.values.talukaId
                                )
                                : ""
                              : ""
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              "talukaId",
                              option && option.value
                            );
                            getState(option);
                          }}
                        ></Select>
                      ) : (
                        <Select
                          name="talukaId"
                          styles={{
                            control: (base) => ({
                              ...base,
                              borderColor: "#ced4da",
                              fontSize: "14px",
                              color: "#212529",
                              minHeight: "35px",
                              height: "35px",
                              "&:hover": {
                                borderColor: "#ced4da",
                              },
                            }),
                            menu: (base) => ({
                              top: "100%",
                              backgroundColor: "hsl(0, 0%, 100%)",
                              borderRadius: "4",
                              boxShadow:
                                "0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)",
                              marginBottom: "8px",
                              marginTop: "8px",
                              position: "absolute",
                              width: "100%",
                              boxSizing: "border-box",
                              zIndex: "9999",
                            }),
                            placeholder: (base) => ({
                              color: "#212529",
                              fontSize: "13px",
                            }),
                            indicatorContainer: (base) => ({
                              color: "#212529",
                            }),
                          }}
                          //options={NoneList}
                          className="custom-select"
                          options={NoneList}
                          isClearable="true"
                          value={
                            NoneList
                              ? NoneList.find(
                                (option) =>
                                  option &&
                                  option.value ===
                                  parseInt(formik.values.talukaId)
                              )
                              : ""
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              "talukaId",
                              option && option.value
                            );
                          }}
                        ></Select>
                      )}
                      <div className={"invalid-feedback"}>
                        {formik.errors ? formik.errors.talukaId : ""}
                      </div>
                    </div>
                  </div>
                </Row>
              </fieldset>
              <Row>
                <div className="form-grp buttongrouprightend mb-4">
                  <button
                    className="btn font-chng"
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#34c38f',
                      border: '0px',
                      color: ' #ffffff',
                      textTransform: 'none',
                    }}
                    onClick={() => history.push("/VerticalControlUnitList")}
                  >
                    Cancel
                  </button>
                  {/* <button type="submit" className="btn btn-secondary">
                    Submit
                  </button> */}
                  {location && location.state && location.state.view ? (
                    ""
                  ) : (
                    <button type="submit" className="btn font-chng"
                      style={{
                        marginRight: '10px',
                        backgroundColor: '#34c38f',
                        border: '0px',
                        color: ' #ffffff',
                        textTransform: 'none',
                      }}>
                      Submit
                    </button>
                  )}
                </div>
              </Row>
            </form>
          </FormikProvider>
        </div>
      </div>
    </div>
  );
};

export default AddVerticalControlUnit;
