import React, { useState, useEffect, useCallback } from "react";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Select, { Option } from "react-select";
import {
  months,
  years,
  genderList,
  ageGroupList,
  reportTableStyle,
  ageTextGenerator,
  monthAlphabetGenerator,
} from "../utils";
import Row from "react-bootstrap/Row";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import ReportService from "../../../services/ReportService";
import Button from "react-bootstrap/Button";
import DropdownService from "../../../services/DropdownService";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import TableContainer from "@material-ui/core/TableContainer";
import { TablePagination as Paging } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const {
  columnHeaderStyle,
  columnDataStyle,
  columnHeaderStyleLeft,
  columnHeaderStyleRight,
  columnHeaderStyleTopLeft,
  columnHeaderStyleBottomLeft,
  columnHeaderStyleTopRight,
  columnHeaderStyleBottomRight,
} = reportTableStyle;

const PatientsIneligibleForSurgery = () => {
  const [reportTableData, setreportTableData] = useState([]);
  const prevDistrictRef: any = React.useRef();
  const prevTalukaRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const [districtId, setdistrictId] = useState();
  const [talukaId, settalukaId] = useState();
  const [facilityId, setfacilityId] = useState();
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [takulaIdValues, setTalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  const [startMonth, setstartMonth] = useState("");
  const [endMonth, setendMonth] = useState("");
  const [year, setyear] = useState("");
  const [districtName, setdistrictName] = useState("");
  const [talukaName, settalukaName] = useState("");
  const [facilityName, setfacilityName] = useState("");
  const [genderName, setgenderName] = useState("");
  const [ageGroupName, setageGroupName] = useState("");

  let NoneList = [{ label: "None", value: 0 }];

  const initialFilterValue = useCallback(() => {
    return {
      districtId: "",
      year: "",
      startMonth: "",
      endMonth: "",
      taluka: "",
      facilityId: "",
      gender: "",
      age: "",
    };
  }, []);

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    districtId: Yup.string(),
    taluka: Yup.string(),
    facilityId: Yup.string(),
    gender: Yup.string(),
    age: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: "",
      year: "",
      startMonth: "",
      endMonth: "",
      taluka: "",
      facilityId: "",
      gender: "",
      age: "",
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      getPatientsineligibleforsurgery(values);
      console.log(values);
    },
    onReset: () => {
      setstartMonth("");
      setendMonth("");
      setyear("");
      setdistrictName("");
      settalukaName("");
      setfacilityName("");
      setgenderName("");
      setageGroupName("");
    },
  });

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  const talukaIdList =
    takulaIdValues &&
    takulaIdValues.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });
  const facilityIdList =
    facilityIdValues &&
    facilityIdValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [...yearList];

  let monthList = months.map((months: any, i: any) => {
    return { label: months.monthName, value: months.month };
  });
  monthList = [...monthList];

  const endMonthList = () => {
    let monthNoArray = months.map((li, index) => li.month);
    let slicedMonthArray = monthNoArray.slice(
      parseInt(formik.values.startMonth),
      monthNoArray.length
    );
    let filteredEndMonth = months.filter((months) =>
      slicedMonthArray.includes(months.month)
    );
    const endMonth = filteredEndMonth.map((months: any, i: any) => {
      return { label: months.monthName, value: months.month };
    });
    return [...endMonth];
  };

  async function getPatientsineligibleforsurgery(filterData) {
    const reportData: any = await ReportService.getPatientsineligibleforsurgery(
      filterData
    );
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
    }
  }
  console.log("reportTableData", reportTableData);
  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
    }
  }
  async function getTaluka(e: any) {
    if (e && e.value) {
      settalukaId(e && e.value);
    }
  }
  async function getfacility(e: any) {
    if (e && e.value) {
      setfacilityId(e && e.value);
    }
  }
  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
    }
  }
  const getTalukacontent = useCallback(() => {
    async function getData() {
      if (formik.values.districtId) {
        const facility: any = await DropdownService.getOneTaluka(
          formik.values.districtId
        );
        if (facility && facility.data && facility.data.length > 0) {
          setTalukaIdValues(facility.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId]);
  const getfacilitycontent = useCallback(() => {
    async function getData() {
      if (formik.values.districtId) {
        const facility: any = await DropdownService.getOneFacility(
          formik.values.districtId
        );
        if (facility && facility.data && facility.data.length > 0) {
          setfacilityIdValues(facility.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId]);
  useEffect(() => {
    const data = initialFilterValue();
    getPatientsineligibleforsurgery(data);
  }, [initialFilterValue]);
  useEffect(() => {
    getpostcontent();
    prevDistrictRef.current = districtId;
    prevTalukaRef.current = talukaId;
    prevFacilityRef.current = facilityId;
  }, []);

  useEffect(() => {
    getfacilitycontent();
    getTalukacontent();
  }, [getfacilitycontent, getTalukacontent]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createpdf = () => {
    const input = document.getElementById("table-to-xls");
    if (input) {
      html2canvas(input).then((canvas: any) => {
        var imgWidth: any = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        const imgData = canvas.toDataURL("image/png");
        var doc = new jsPDF("p", "mm");
        var position = 0;
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight + 15);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight + 15);
          heightLeft -= pageHeight;
        }
        doc.save("Patients Ineligible For Surgery.pdf");
      });
    }
  };

  return (
    <div>
      <style>{`
    td {
      padding: 6px 20px;
      white-space: nowrap;
    }
  `}</style>
      <h4 style={{ display: "flex", justifyContent: "center" }}>
        Patients Ineligible For Surgery
      </h4>
      <div>
        <Accordion
          style={{ width: "100%", marginBottom: "15px", borderRadius: "10px" }}
          classes={{
            root: `{
        MuiAccordionroot: {
          '&.MuiAccordion-root:before': {
            border: 'none',
          },
        },
      }`,
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography
              variant="subtitle1"
              component="div"
              style={{
                fontWeight: "bold",
                color: "#7f8389",
                paddingLeft: "1.3rem",
              }}
            >
              Filter By:
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormikProvider value={formik}>
              <form
                style={{ width: "100%" }}
                onSubmit={formik.handleSubmit}
                onChange={formik.handleChange}
                onReset={formik.handleReset}
              >
                <Row className="mb-3" style={{ padding: "0 20px" }}>
                  <div className="col-md-12 col-xl-4 col-12">
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
                              option ? option.value : ""
                            );
                            getDistrict(option);
                            setdistrictName(option ? option.label : "");
                            formik.setFieldValue("taluka", "");
                            formik.setFieldValue("facilityId", "");
                            setTalukaIdValues([]);
                            setfacilityIdValues([]);
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
                              option ? option.value : ""
                            );
                          }}
                        ></Select>
                      )}
                      <div className={"invalid-feedback"}>
                        {formik.errors ? formik.errors.districtId : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 col-xl-8 col-12">
                    {" "}
                    <label className="form-label font-chng">Month</label>
                    <Row>
                      <div className="col-md-1 col-xl-1 col-12">
                        <label
                          className="form-label font-chng"
                          style={{ paddingTop: "6px" }}
                        >
                          From
                        </label>
                      </div>
                      <div className="col-md-5 col-xl-5 col-12">
                        <div className="form-grp">
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
                              formik.errors.startMonth &&
                              formik.touched.startMonth
                                ? "custom-select is-invalid"
                                : "custom-select"
                            }
                            name="startMonth"
                            isClearable="true"
                            value={
                              formik.values.startMonth !== ""
                                ? monthList
                                  ? monthList.find(
                                      (option: any) =>
                                        option &&
                                        option.value ===
                                          formik.values.startMonth
                                    )
                                  : ""
                                : ""
                            }
                            options={monthList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                "startMonth",
                                option ? option.value : ""
                              );
                              formik.setFieldValue("endMonth", "");
                              setstartMonth(option ? option.label : "");
                            }}
                          ></Select>
                          <div className={"invalid-feedback"}>
                            {formik.errors ? formik.errors.startMonth : ""}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-1 col-xl-1 col-12">
                        <label
                          className="form-label font-chng"
                          style={{ paddingTop: "6px" }}
                        >
                          &nbsp;&nbsp;To
                        </label>
                      </div>
                      <div className="col-md-5 col-xl-5 col-12">
                        <div className="form-grp">
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
                              formik.errors.endMonth && formik.touched.endMonth
                                ? "custom-select is-invalid"
                                : "custom-select"
                            }
                            name="endMonth"
                            isClearable="true"
                            value={
                              formik.values.endMonth !== ""
                                ? endMonthList()
                                  ? endMonthList().find(
                                      (option: any) =>
                                        option &&
                                        option.value === formik.values.endMonth
                                    )
                                  : ""
                                : ""
                            }
                            options={
                              formik.values.startMonth
                                ? endMonthList()
                                : NoneList
                            }
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                "endMonth",
                                option ? option.value : ""
                              );
                              setendMonth(option ? option.label : "");
                            }}
                          ></Select>
                          <div className={"invalid-feedback"}>
                            {formik.errors ? formik.errors.endMonth : ""}
                          </div>
                        </div>
                      </div>
                    </Row>
                  </div>
                  <div className="col-md-6 col-xl-4 col-12">
                    <div className="form-grp">
                      <label className="form-label font-chng">Year</label>
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
                          formik.values.year !== ""
                            ? yearList
                              ? yearList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.year
                                )
                              : ""
                            : ""
                        }
                        options={yearList}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            "year",
                            option ? option.value : ""
                          );
                          setyear(option ? option.label : "");
                        }}
                      ></Select>
                      <div className={"invalid-feedback"}>
                        {formik.errors ? formik.errors.year : ""}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-xl-4 col-12">
                    <div className="form-grp">
                      <label
                        htmlFor="talukaId"
                        className="form-label font-chng"
                      >
                        Taluka
                      </label>
                      {takulaIdValues && takulaIdValues.length !== 0 ? (
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
                            formik.errors.taluka && formik.touched.taluka
                              ? "custom-select is-invalid"
                              : "custom-select"
                          }
                          value={
                            formik.values.taluka !== ""
                              ? talukaIdList
                                ? talukaIdList.find(
                                    (option) =>
                                      option &&
                                      option.value === formik.values.taluka
                                  )
                                : ""
                              : ""
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              "taluka",
                              option ? option.value : ""
                            );
                            getTaluka(option);

                            settalukaName(option ? option.label : "");
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
                          value=""
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              "taluka",
                              option ? option.value : ""
                            );
                          }}
                        ></Select>
                      )}
                      <div className={"invalid-feedback"}>
                        {formik.errors ? formik.errors.taluka : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-4 col-12">
                    <div className="form-grp">
                      <label
                        htmlFor="facilityId"
                        className="form-label font-chng"
                      >
                        Facility
                      </label>
                      {facilityIdValues && facilityIdValues.length !== 0 ? (
                        <Select
                          name="facilityId"
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
                          options={facilityIdList}
                          isClearable="true"
                          className={
                            formik.errors.facilityId &&
                            formik.touched.facilityId
                              ? "custom-select is-invalid"
                              : "custom-select"
                          }
                          value={
                            formik.values.facilityId !== ""
                              ? facilityIdList
                                ? facilityIdList.find(
                                    (option) =>
                                      option &&
                                      option.value === formik.values.facilityId
                                  )
                                : ""
                              : ""
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              "facilityId",
                              option ? option.value : ""
                            );
                            getfacility(option);
                            setfacilityName(option ? option.label : "");
                          }}
                        ></Select>
                      ) : (
                        <Select
                          name="facilityId"
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
                          value=""
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              "facilityId",
                              option ? option.value : ""
                            );
                          }}
                        ></Select>
                      )}
                      <div className={"invalid-feedback"}>
                        {formik.errors ? formik.errors.facilityId : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-4 col-12">
                    {" "}
                    <div className="form-grp">
                      <label className="form-label font-chng">Gender</label>
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
                          formik.errors.gender && formik.touched.gender
                            ? "custom-select is-invalid"
                            : "custom-select"
                        }
                        name="gender"
                        isClearable="true"
                        value={
                          formik.values.gender !== ""
                            ? genderList
                              ? genderList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.gender
                                )
                              : ""
                            : ""
                        }
                        options={genderList}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            "gender",
                            option ? option.value : ""
                          );
                          setgenderName(option ? option.label : "");
                        }}
                      ></Select>
                      <div className={"invalid-feedback"}>
                        {formik.errors ? formik.errors.gender : ""}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 col-xl-4 col-12">
                    <div className="form-grp">
                      <label className="form-label font-chng">Age</label>
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
                          formik.errors.age && formik.touched.age
                            ? "custom-select is-invalid"
                            : "custom-select"
                        }
                        name="age"
                        isClearable="true"
                        value={
                          formik.values.age !== ""
                            ? ageGroupList
                              ? ageGroupList.find(
                                  (option: any) =>
                                    option && option.value === formik.values.age
                                )
                              : ""
                            : ""
                        }
                        options={ageGroupList}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            "age",
                            option ? option.value : ""
                          );
                          setageGroupName(option ? option.label : "");
                        }}
                      ></Select>
                      <div className={"invalid-feedback"}>
                        {formik.errors ? formik.errors.age : ""}
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 col-xl-12 col-12"
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
                    <Button
                      variant="secondary"
                      className="mt-m font-chng"
                      type="reset"
                      style={{ marginLeft: "10px" }}
                    >
                      Clear{" "}
                    </Button>
                  </div>
                </Row>
              </form>
            </FormikProvider>
          </AccordionDetails>
        </Accordion>
      </div>
      <div
        style={{
          padding: "30px",
          backgroundColor: "#ffff",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            marginTop: "2%",
            marginBottom: "2%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            style={{ marginRight: "15px" }}
            className="mt-m font-chng btn btn-secondary"
            onClick={createpdf}
          >
            {" "}
            Export as PDF
          </button>
          <ReactHTMLTableToExcel
            className="mt-m font-chng btn btn-secondary"
            id="test-table-xls-button"
            table="table-to-xls"
            filename="Patients Ineligible For Surgery"
            sheet="Patients Ineligible For Surgery"
            buttonText=" Export as xsl"
          />
        </div>
        <TableContainer component={Paper}>
          <table
            style={{
              border: "none",
              width: "100%",
              borderRadius: "15px",
            }}
            id="table-to-xls"
          >
            <tr>
              <td colSpan={10} style={{ border: "0", textAlign: "start" }}>
                <b>Patients Ineligible For Surgery</b>
              </td>
            </tr>
            <tr>
              <td colSpan={2} style={{ border: "0", textAlign: "start" }}>
                <b>{districtName !== "" ? `District - ${districtName}` : ""}</b>
              </td>
              <td colSpan={1} style={{ border: "none", textAlign: "start" }}>
                <b>{startMonth !== "" ? `Month from - ${startMonth}` : ""}</b>
              </td>
              <td colSpan={1} style={{ border: "none", textAlign: "start" }}>
                <b>{endMonth !== "" ? `Month to - ${endMonth}` : ""}</b>
              </td>
              <td colSpan={2} style={{ border: "0", textAlign: "start" }}>
                <b> {year !== "" ? `Year - ${year}` : ""} </b>
              </td>
              <td colSpan={2} style={{ border: "0", textAlign: "start" }}>
                <b> {talukaName !== "" ? `Taluka - ${talukaName}` : ""} </b>
              </td>
              <td colSpan={2} style={{ border: "0", textAlign: "start" }}>
                <b>
                  {" "}
                  {facilityName !== "" ? `Facility - ${facilityName}` : ""}{" "}
                </b>
              </td>
              <td colSpan={2} style={{ border: "0", textAlign: "start" }}>
                <b> {genderName !== "" ? `Gender - ${genderName}` : ""} </b>
              </td>
              <td colSpan={2} style={{ border: "0", textAlign: "start" }}>
                <b> {ageGroupName !== "" ? `Age - ${ageGroupName}` : ""} </b>
              </td>
            </tr>
            <tbody>
              <tr>
                <td style={columnHeaderStyleLeft} rowSpan={2}>
                  Name Of Patient
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Patient ID
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Gender
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  District
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Corporation
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Taluka
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Zone
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Ward
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Village
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Facility/PHC
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Year
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Month
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Age
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Mobile No
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Adress
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Desese Type{" "}
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Grading
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Presence Of Blisters
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Duration Of Disease
                </td>
                <td style={columnHeaderStyle} colSpan={4}>
                  Details of Service Provider
                </td>
                <td style={columnHeaderStyle} rowSpan={2}>
                  Co-Morbidity Type
                </td>
                <td style={columnHeaderStyleRight} rowSpan={2}>
                  Surgery Not Possible Resasons
                </td>
              </tr>
              <tr>
                <td style={columnHeaderStyle}>Name</td>
                <td style={columnHeaderStyle}>Designation</td>
                <td style={columnHeaderStyle}>Place Of Service Given</td>
                <td style={columnHeaderStyle}>Phone Number</td>
              </tr>

              {reportTableData && reportTableData.length > 0 ? (
                reportTableData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((data: any, index) => {
                    return (
                      <tr key={`HOLL${index}`}>
                        <td style={columnDataStyle}>{data.nameOfPatient}</td>
                        <td style={columnDataStyle}>{data.patientId}</td>
                        <td style={columnDataStyle}>{data.gender}</td>
                        <td style={columnDataStyle}>{data.districtName}</td>
                        <td style={columnDataStyle}>{data.corporationName}</td>
                        <td style={columnDataStyle}>{data.talukaName}</td>
                        <td style={columnDataStyle}>{data.zoneName}</td>
                        <td style={columnDataStyle}>{data.wardName}</td>
                        <td style={columnDataStyle}>{data.villageName}</td>
                        <td style={columnDataStyle}>{data.facilityName}</td>
                        <td style={columnDataStyle} align="right">
                          {data.year !== 0 ? data.year : ""}
                        </td>
                        <td style={columnDataStyle} align="right">
                          {monthAlphabetGenerator(data.month)}
                        </td>
                        <td style={columnDataStyle}>
                          {ageTextGenerator(data.ageYears, data.ageMonths)}
                        </td>
                        <td style={columnDataStyle} align="right">
                          {data.patientMobileNumber}
                        </td>
                        <td style={columnDataStyle}>
                          {data.permanentAddressLine1}
                          {data.permanentAddressLine2},
                          {data.permanentAddressPINCode}
                        </td>
                        <td style={columnDataStyle}>{data.diseaseType}</td>
                        <td style={columnDataStyle} align="right">
                          {data.grading}
                        </td>
                        <td style={columnDataStyle}>
                          {data.isPresenceOfBlisters ? "Y" : "N"}
                        </td>
                        <td style={columnDataStyle}>
                          {ageTextGenerator(
                            data.diseaseLastedYears,
                            data.diseaseLastedMonths
                          )}
                        </td>
                        <td style={columnDataStyle}>
                          {data.serviceProviderName}
                        </td>
                        <td style={columnDataStyle}>
                          {data.serviceProviderDesignation}
                        </td>
                        <td style={columnDataStyle}>
                          {data.serviceProviderPlace}
                        </td>
                        <td style={columnDataStyle} align="right">
                          {data.serviceProviderPhone}
                        </td>
                        <td style={columnDataStyle}>{data.comorbidityType}</td>
                        <td style={columnDataStyle}>{""}</td>
                      </tr>
                    );
                  })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: "center", height: "100px" }}
                  >
                    No Data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Paging
            rowsPerPageOptions={[10, 25, 50, 100]}
            count={reportTableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ border: "none" }}
          />
        </div>
      </div>
    </div>
  );
};
export default PatientsIneligibleForSurgery;
