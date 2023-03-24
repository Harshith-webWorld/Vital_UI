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
import districtService from "../../../helpers/services/districtService";

const AddDistrict = () => {
  const ReduxLoginInfo: any = useSelector((state: ApplicationState) => state);
  const location = useLocation<any>();
  const prevStateRef: any = React.useRef();

  const [stateId, setStateId] = useState();
  let [stateIdValues, setstateIdValues] = useState([]);

  const [districtList, setDistrictList] = useState([]);

  const [initialValues, setInitialValues] = useState({
    districtName: "",
    districtCode: "",
    stateId: "",
  });

  useEffect(() => {
    getDistrictList();
    getStateList();
  }, []);

  let NoneList = [{ label: "None", value: 0 }];

  let validSchema = Yup.object().shape({
    districtName: Yup.string()
      .required("District Name is required")
      .test("district name", "District name is already exist", (value: any) => {
        const enteredValue = value ? value.toLowerCase() : "";
        let list =
          location && location.state && location.state.id
            ? districtList.filter(
              (li: any) =>
                li.districtName.toLowerCase() !==
                initialValues.districtName.toLowerCase()
            )
            : districtList;
        return !list.some(
          (item: any) => item.districtName.toLowerCase() === enteredValue
        );
      }),
    districtCode: Yup.string()
      .required("District code is required")
      .test("district code", "District code is already exist", (value: any) => {
        const enteredValue = value ? value.toLowerCase() : "";
        let list =
          location && location.state && location.state.id
            ? districtList.filter(
              (li: any) =>
                li.districtCode.toLowerCase() !==
                initialValues.districtCode.toLowerCase()
            )
            : districtList;
        return !list.some(
          (item: any) => item.districtCode.toLowerCase() === enteredValue
        );
      }),
  });

  const formik = useFormik({
    initialValues: {
      districtName: initialValues.districtName
        ? initialValues.districtName
        : "",
      districtCode: initialValues.districtCode
        ? initialValues.districtCode
        : "",
      stateId: initialValues.stateId ? initialValues.stateId : "",
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      const { districtName, districtCode, stateId } = values;
      if (location && location.state && location.state.id) {
        const editData = {
          id: `${location.state.id}`,
          districtName: `${districtName}`,
          districtCode: `${districtCode}`,
          stateId: `${stateId}`,
        };
        districtService.createOrUpdateDistrict(editData);
      } else {
        const addData = {
          districtName: `${districtName}`,
          districtCode: `${districtCode}`,
          stateId: `${stateId}`,
        };
        districtService.createOrUpdateDistrict(addData);
      }
    },
  });

  const stateIdList =
    stateIdValues &&
    stateIdValues.map((item: any, i: any) => {
      return { label: item.stateName, value: item.id };
    });

  async function getDistrictList() {
    const response = await districtService.getDistrict();
    if (response && response.data) {
      setDistrictList(response.data);
    }
  }

  const getOneDistrict = useCallback(() => {
    async function getData() {
      if (location && location.state && location.state.id) {
        const response = await districtService.getOneDistrict(
          location.state.id
        );
        if (response && response.data && response.data.length > 0) {
          setInitialValues((prev) => {
            return {
              ...prev,
              districtName: response.data[0].districtName,
              districtCode: response.data[0].districtCode,
              stateId: response.data[0].stateId,
            };
          });
        }
      }
    }
    getData();
  }, [location]);

  useEffect(() => {
    getOneDistrict();
  }, [getOneDistrict]);

  async function getState(e: any) {
    if (e && e.value) {
      setStateId(e && e.value);
    }
  }

  async function getStateList() {
    const stateId: any = await districtService.getState();
    if (stateId && stateId.data) {
      setstateIdValues(stateId.data);
    }
  }

  return (
    <div className="content add-page">
      <div className="card">
        <div className="card-header">
          <h1 className="cardtitlenew">
            {location.state ? "" : "Add district"}
            {location.state &&
              location.state.id &&
              location.state.view &&
              "District"}
            {location.state &&
              location.state.id &&
              !location.state.view &&
              "Edit district"}
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
                  <div className="col-md-4 col-xl-3">
                    <div className="form-grp">
                      <label htmlFor="district Name" className="form-label">
                        District Name
                      </label>
                      <input
                        name="districtName"
                        value={formik.values.districtName}
                        type="text"
                        className={
                          formik.errors.districtName &&
                            formik.touched.districtName
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) =>
                          formik.setFieldValue("districtName", e.target.value)
                        }
                      />
                      <div className={"invalid-feedback"}>
                        {formik.errors.districtName
                          ? formik.errors.districtName
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-xl-3">
                    <div className="form-grp">
                      <label htmlFor="districtCode" className="form-label">
                        District Code
                      </label>
                      <input
                        name="districtCode"
                        value={formik.values.districtCode}
                        type="text"
                        className={
                          formik.errors.districtCode &&
                            formik.touched.districtCode
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        onChange={(e) =>
                          formik.setFieldValue("districtCode", e.target.value)
                        }
                      />
                      <div className={"invalid-feedback"}>
                        {formik.errors.districtCode
                          ? formik.errors.districtCode
                          : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 col-xl-3">
                    <div className="form-grp">
                      <label htmlFor="StateId" className="form-label font-chng">
                        State
                      </label>
                      {stateIdValues && stateIdValues.length !== 0 ? (
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
                    onClick={() => history.push("/districtList")}
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

export default AddDistrict;
