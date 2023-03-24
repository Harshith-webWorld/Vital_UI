import Table from "./Table";
import React, { useState, useEffect } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Select, { Option } from "react-select";
import { months, years } from "../utils";
import DropdownService from "../../../services/DropdownService";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

const AnalysisNine = () => {
  const prevDistrictRef: any = React.useRef();
  const [districtId, setdistrictId] = useState();
  useEffect(() => {
    getpostcontent();
    prevDistrictRef.current = districtId;
  }, []);
  let NoneList = [{ label: "None", value: 0 }];

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    months: Yup.string(),

    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required("district is required").nullable(),
    }),
  });
  const formik = useFormik({
    initialValues: { districtId: "", year: "", months: "" },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: () => {},
  });

  let [districtIdValues, setdistrictIdValues] = useState([]);

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  const YearNone = {
    label: "Unknown Year",
    value: 0,
  };

  const MonthNone = {
    label: "Unknown Month",
    value: 0,
  };

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [YearNone, ...yearList];

  let monthList = months.map((months: any, i: any) => {
    return { label: months.monthName, value: months.month };
  });
  monthList = [MonthNone, ...monthList];

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
    }
  }
  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
    }
  }

  return (
    <div className="flex flex-col p-5">
      <div className="flex mb-5">
        <Accordion style={{ width: "100%", marginBottom: 15 }}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Filter</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormikProvider value={formik}>
              <form
                style={{ width: "100%" }}
                onSubmit={formik.handleSubmit}
                onChange={formik.handleChange}
              >
                <div className="card">
                  <div className="card-body">
                    <Row className="mb-3">
                      <div className="col-md-6 col-xl-3 col-12">
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
                                districtIdList
                                  ? districtIdList.find(
                                      (option) =>
                                        option &&
                                        option.value ===
                                          formik.values.districtId
                                    )
                                  : ""
                              }
                              onChange={(option: Option) => {
                                formik.setFieldValue(
                                  "districtId",
                                  option && option.value
                                );
                                getDistrict(option);
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

                      <div className="col-md-6 col-xl-3 col-12">
                        {" "}
                        <div className="form-grp">
                          <label
                            htmlFor="email"
                            className="form-label font-chng"
                          >
                            Year
                          </label>
                          <Select
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
                            className={
                              formik.errors.year && formik.touched.year
                                ? "custom-select is-invalid"
                                : "custom-select"
                            }
                            name="year"
                            isClearable="true"
                            value={
                              yearList
                                ? yearList.find(
                                    (option: any) =>
                                      option &&
                                      option.value === formik.values.year
                                  )
                                : ""
                            }
                            options={yearList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                "year",
                                option && option.value
                              );
                            }}
                          ></Select>
                          <div className={"invalid-feedback"}>
                            {formik.errors ? formik.errors.year : ""}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 col-xl-3 col-12">
                        {" "}
                        <div className="form-grp">
                          <label
                            htmlFor="email"
                            className="form-label font-chng"
                          >
                            Month
                          </label>
                          <Select
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
                            className={
                              formik.errors.months && formik.touched.months
                                ? "custom-select is-invalid"
                                : "custom-select"
                            }
                            name="month"
                            isClearable="true"
                            value={
                              monthList
                                ? monthList.find(
                                    (option: any) =>
                                      option &&
                                      option.value === formik.values.months
                                  )
                                : ""
                            }
                            options={monthList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                "months",
                                option && option.value
                              );
                            }}
                          ></Select>
                          <div className={"invalid-feedback"}>
                            {formik.errors ? formik.errors.months : ""}
                          </div>
                        </div>
                      </div>
                      <div
                        className="col-md-6 col-xl-3 col-12"
                        style={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          variant="secondary"
                          className="mt-m font-chng"
                          type="submit"
                        >
                          Filter{" "}
                        </Button>
                      </div>
                    </Row>{" "}
                  </div>
                </div>
              </form>
            </FormikProvider>
          </AccordionDetails>
        </Accordion>
      </div>
      <h1 className="text-center text-2xl mb-5">
        Line List of MF Positive Patients
      </h1>
      <h2>Maharashtra State</h2>

      <div style={{ marginTop: "2%", marginBottom: "1%", display: "flex" }}>
        <div style={{ width: "18%", textAlign: "initial" }}>
          <b> District &hellip;&hellip;&hellip;..</b>
        </div>
        <div style={{ width: "18%", textAlign: "initial" }}>
          <b> Year &hellip;&hellip;&hellip;..</b>
        </div>
        <div style={{ width: "25%", textAlign: "initial" }}>
          <b> Month -</b>
        </div>
      </div>
      <br />
      <br />
      <Table />
      <br />
      <br />
      <select name="note_type" className="mt-5 w-80">
        <option value="1">Filaria Survey Unit</option>
        <option value="2">Filaria Control Unit</option>
        <option value="3">Research and Training Center</option>
        <option value="4">Municipal Corporation</option>
        <option value="5">Night Clinic</option>
        <option value="6">Base Line Survey</option>
        <option value="7">Additional Mf Survey</option>
        <option value="8">TAS Survey in the column No. 12</option>
      </select>
    </div>
  );
};

export default AnalysisNine;
