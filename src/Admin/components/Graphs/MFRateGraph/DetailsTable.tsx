import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import CsvDownload from "react-json-to-csv";
import DataTable from "react-data-table-component";
import graphservice from "../../../../helpers/services/website-barchart.service";

export default function NoOfLFCases(props) {
  const [tablelist, settablelist] = useState<any>([]);
  const columns = [
    { name: "Patient Id", selector: "patientId" },
    { name: "Name Of Patient", selector: "nameOfPatient" },
    {
      name: "Gender",
      selector: (row: any) => <div>{row.gender === "Female" ? "F" : "M"}</div>,
    },
    {
      name: "Patient MobileNumber",
      selector: "patientMobileNumber",
    },
    { name: "Disease Type", selector: "diseaseType" },
    { name: "Head of Family", selector: "headOfFamily" },
    { name: "Facility Name", selector: "facilityName" },
    { name: "SubCenter Name", selector: "subCenterName" },
    { name: "District Name", selector: "districtName" },
    { name: "Corporation Name", selector: "corporationName" },
    { name: "Taluka Name", selector: "talukaName" },
    { name: "Village Name", selector: "villageName" },
    { name: "Town", selector: "town" },
  ];
  async function GetMfPositiveDistwise() {
    const response = await graphservice.getMfPositiveDistwise({
      year: `${props.yearoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(",")}`,
      month: `${props.monthoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(",")}`,
      districtId: `${props.selectedId}`,
    });
    if (response && response.data) {
      settablelist(response.data);
    }
  }
  async function GetBsCollectedDistwise() {
    const response = await graphservice.getBsCollectedDistwise({
      year: `${props.yearoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(",")}`,
      month: `${props.monthoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(",")}`,
      districtId: `${props.selectedId}`,
    });
    if (response && response.data) {
      settablelist(response.data);
    }
  }
  async function GetBsExaminedDistwise() {
    const response = await graphservice.getBsExaminedDistwise({
      year: `${props.yearoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(",")}`,
      month: `${props.monthoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(",")}`,
      districtId: `${props.selectedId}`,
    });
    if (response && response.data) {
      settablelist(response.data);
    }
  }
  async function GetMfRateDistwise() {
    const response = await graphservice.getMfRateDistwise({
      year: `${props.yearoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(",")}`,
      month: `${props.monthoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(",")}`,
      districtId: `${props.selectedId}`,
    });
    if (response && response.data) {
      settablelist(response.data);
    }
  }
  useEffect(() => {
    if (props.show === true) {
      props.selectedkey === "No. of MF Positive" && GetMfPositiveDistwise();
      props.selectedkey === "No. Of Bs examined" && GetBsExaminedDistwise();
      props.selectedkey === "MF Rate" && GetMfRateDistwise();
      props.selectedkey === "No. of BS Collected" && GetBsCollectedDistwise();
    }
  }, [
    props.show,
    props.yearoption,
    props.monthoption,
    props.selectedId,
    props.selectedkey,
  ]);
  return (
    <Modal size="xl" show={props.show} onHide={props.handleCloseModal}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-md-8">
            <h5 className="card-title">
              {props.selectedkey ? props.selectedkey : ""}
            </h5>
          </div>
          <div className="col-md-4 text-right">
            <CsvDownload
              data={tablelist}
              filename="dashboard.csv"
              style={{ marginRight: "15px" }}
              className="mt-m font-chng btn btn-secondary"
            >
              Export Data
            </CsvDownload>
          </div>
          <div className="dash-table">
            <DataTable
              columns={columns}
              data={tablelist}
              highlightOnHover
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
              paginationComponentOptions={{
                rowsPerPageText: "Records per page:",
                rangeSeparatorText: "out of",
              }}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
