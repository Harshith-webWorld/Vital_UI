import Table1 from "./Table1";
import Table2 from "./Table2";
import { useState, useEffect, useRef } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Select, { Option } from "react-select";
import { months } from "../utils";
import DropdownService from "../../../services/DropdownService";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";

const AnalysisThree = () => {
  const prevDistrictRef: any = useRef();
  const prevNFCURef: any = useRef();
  const [districtId, setdistrictId] = useState();
  const [nfcuId, setnfcuId] = useState();
  useEffect(() => {
    getpostcontent();
    getNFCUlist();
    prevDistrictRef.current = districtId;
    prevNFCURef.current = nfcuId;
  }, []);
  let NoneList = [{ label: "None", value: 0 }];

  let validSchema = Yup.object().shape({
    // year: Yup.string(),
    months: Yup.string(),

    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required("district is required").nullable(),
    }),
    nfcuId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required("nfcuId is required").nullable(),
    }),
  });
  const formik = useFormik({
    initialValues: { districtId: "", nfcuId: "", months: "" },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: () => {},
  });

  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [nfcuIdValues, setnfcuIdvalues] = useState([]);

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  const nfcuIdList =
    nfcuIdValues &&
    nfcuIdValues.map((item: any, i: any) => {
      return { label: item.nameOfControlUnit, value: item.id };
    });

  const MonthNone = {
    label: "Unknown Month",
    value: 0,
  };

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

  async function getNFCU(e: any) {
    if (e && e.value) {
      setnfcuId(e && e.value);
    }
  }

  async function getNFCUlist() {
    const unitType = "FCU";
    const nfcuId: any = await DropdownService.getNameOfUnit(unitType, 1);
    if (nfcuId && nfcuId.data && nfcuId.data.length > 0) {
      setnfcuIdvalues(nfcuId.data);
    }
  }

  return (
    <div>
      <div>
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
                            htmlFor="nfcuId"
                            className="form-label font-chng"
                          >
                            N.F.C.U
                          </label>
                          {nfcuIdValues && nfcuIdValues.length !== 0 ? (
                            <Select
                              name="nfcuId"
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
                              options={nfcuIdList}
                              isClearable="true"
                              className={
                                formik.errors.nfcuId && formik.touched.nfcuId
                                  ? "custom-select is-invalid"
                                  : "custom-select"
                              }
                              value={
                                nfcuIdList
                                  ? nfcuIdList.find(
                                      (option) =>
                                        option &&
                                        option.value === formik.values.nfcuId
                                    )
                                  : ""
                              }
                              onChange={(option: Option) => {
                                formik.setFieldValue(
                                  "nfcuId",
                                  option && option.value
                                );
                                getNFCU(option);
                              }}
                            ></Select>
                          ) : (
                            <Select
                              name="nfcuId"
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
                                          parseInt(formik.values.nfcuId)
                                    )
                                  : ""
                              }
                              onChange={(option: Option) => {
                                formik.setFieldValue(
                                  "nfcuId",
                                  option && option.value
                                );
                              }}
                            ></Select>
                          )}
                          <div className={"invalid-feedback"}>
                            {formik.errors ? formik.errors.nfcuId : ""}
                          </div>
                        </div>
                      </div>
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
      <h1>
        Progressive B.S. Collection, Target, B.S. Examiniation MF Positive &
        Report January to December
      </h1>
      <h2>Maharashtra State</h2>

      <div style={{ marginTop: "2%", marginBottom: "1%", display: "flex" }}>
        <div style={{ width: "18%", textAlign: "initial" }}>
          <b> N.F.C.U &hellip;&hellip;&hellip;..</b>
        </div>
        <div style={{ width: "18%", textAlign: "initial" }}>
          <b> District &hellip;&hellip;&hellip;..</b>
        </div>
        <div style={{ width: "25%", textAlign: "initial" }}>
          <b> Month -</b>
        </div>
      </div>
      <br />
      <br />
      <Table1 />
      <br />
      <br />
      <Table2 />
      <br />
      {/* <br />
      <div>
        MF Rate =
        <div>
          <p>Total no of person found MF positive</p>
          <p></p>
          <p>Total No person examined for MF</p>
        </div>
        x 100
      </div>
      <div>
        Disease Rate =
        <div>
          <p>
            Number of persons showing signs and symptoms for filarial disease
            manifestation
          </p>
          <p></p>
          <p>Total No person examined for filarial disease</p>
        </div>
        x 100
      </div>
    */}
    </div>
  );
};

export default AnalysisThree;
