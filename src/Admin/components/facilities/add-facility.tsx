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
import facilityService from "../../../helpers/services/facilityService";
import districtService from "../../../helpers/services/districtService";

const AddFacility = () => {
  const ReduxLoginInfo: any = useSelector((state: ApplicationState) => state);
  const location = useLocation<any>();
  const prevStateRef: any = React.useRef();

  const [stateId, setStateId] = useState();
  const [stateIdValues, setstateIdValues] = useState([]);
  const [districtIdValues, setdistrictIdValues] = useState([]);
  const [talukaIdValues, settalukaIdValues] = useState([]);
  const [facilityList, setFacilityList] = useState([]);

  const [initialValues, setInitialValues] = useState({
    facilityName: "",
    facilityType: "",
    talukaId: "",
    districtId: "",
    stateId: "",
  });

  let NoneList = [{ label: "None", value: 0 }];

  let validSchema = Yup.object().shape({
    facilityName: Yup.string()
      .required("Facility Name is required")
      .test("facility name", "Facility name is already exist", (value: any) => {
        const enteredValue = value ? value.toLowerCase() : "";
        let list =
          location && location.state && location.state.id
            ? facilityList.filter(
                (li: any) =>
                  li.facilityName.toLowerCase() !==
                  initialValues.facilityName.toLowerCase()
              )
            : facilityList;
        return !list.some(
          (item: any) => item.facilityName.toLowerCase() === enteredValue
        );
      }),
    facilityType: Yup.string().required("Facility Type code is required"),
    talukaId: Yup.string().required("Taluka is required"),
    districtId: Yup.string().required("District is required"),
    stateId: Yup.string().required("State is required"),
  });

  const formik = useFormik({
    initialValues: {
      facilityName: initialValues.facilityName
        ? initialValues.facilityName
        : "",
      facilityType: initialValues.facilityType
        ? initialValues.facilityType
        : "",
      talukaId: initialValues.talukaId ? initialValues.talukaId : "",
      districtId: initialValues.districtId ? initialValues.districtId : "",
      stateId: initialValues.stateId ? initialValues.stateId : "",
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      if (location && location.state && location.state.id) {
        const editData = {
          ...values,
          id: location.state.id,
          corporationId: null,
          zoneId: null,
          wardId: null,
        };
        facilityService.createOrUpdateFacility(JSON.stringify(editData));
      } else {
        const addData = {
          ...values,
          corporationId: null,
          zoneId: null,
          wardId: null,
        };
        facilityService.createOrUpdateFacility(addData);
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

  const getfacilityList = async () => {
    const response = await facilityService.getFacility();
    if (response && response.data) {
      setFacilityList(response.data);
    }
  };
  const getOneFacility = useCallback(() => {
    async function getData() {
      if (location && location.state && location.state.id) {
        const response = await facilityService.getOneFacility(
          location.state.id
        );
        if (response && response.data && response.data.length > 0) {
          setInitialValues((prev) => {
            return {
              ...prev,
              facilityName: response.data[0].facilityName,
              facilityType: response.data[0].facilityType,
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
    getOneFacility();
  }, [getOneFacility]);

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
    const stateId: any = await facilityService.getState();
    if (stateId && stateId.data) {
      setstateIdValues(stateId.data);
    }
  }

  const getDistrictList = useCallback(() => {
    async function getData() {
      if (formik.values.stateId) {
        const response = await facilityService.getOneDistrict(
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
        const response = await facilityService.getOneTaluka(
          formik.values.districtId
        );
        if (response && response.data) {
          settalukaIdValues(response.data);
        }
      }
    }
    getData();
  }, [formik.values.stateId, formik.values.districtId]);

  useEffect(() => {
    getDistrictList();
    getStateList();
    getTalukaList();
  }, [getDistrictList, getTalukaList]);

  useEffect(() => {
    getfacilityList();
  }, []);

  return (
    <div className="content add-page">
      <div className="card">
        <div className="card-header">
          <h1 className="cardtitlenew">Add Facility</h1>
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
                      <label htmlFor="district Name" className="form-label">
                        Facility Name
                      </label>
                      <input
                        name="facilityName"
                        value={formik.values.facilityName}
                        type="text"
                        className={
                          formik.errors.facilityName &&
                          formik.touched.facilityName
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) =>
                          formik.setFieldValue("facilityName", e.target.value)
                        }
                        autoComplete="off"
                      />
                      <div className={"invalid-feedback"}>
                        {formik.errors.facilityName
                          ? formik.errors.facilityName
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3 col-xl-3">
                    <div className="form-grp">
                      <label htmlFor="facilityType" className="form-label">
                        Facility type
                      </label>
                      <input
                        name="facilityType"
                        value={formik.values.facilityType}
                        type="text"
                        className={
                          formik.errors.facilityType &&
                          formik.touched.facilityType
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) =>
                          formik.setFieldValue("facilityType", e.target.value)
                        }
                      />
                      <div className={"invalid-feedback"}>
                        {formik.errors.facilityType
                          ? formik.errors.facilityType
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
                    onClick={() => history.push("/facilityList")}
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

export default AddFacility;
