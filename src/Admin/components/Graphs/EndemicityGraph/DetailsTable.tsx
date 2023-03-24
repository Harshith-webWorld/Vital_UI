import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import CsvDownload from 'react-json-to-csv';
import DataTable from 'react-data-table-component';
import graphservice from '../../../../helpers/services/website-barchart.service';

export default function NoOfLFCases(props) {
  const [tablelist, settablelist] = useState<any>([]);
  const columns = [
    { name: 'Patient Id', selector: 'patientId', width: '220px' },
    { name: 'Name Of Patient', selector: 'nameOfPatient', width: '200px' },
    {
      name: 'Gender',
      selector: (row: any) => <div>{row.gender === 'Female' ? 'F' : 'M'}</div>,
    },
    {
      name: 'Patient MobileNumber',
      selector: 'patientMobileNumber',
      width: '150px',
    },
    { name: 'Disease Type', selector: 'diseaseType', width: '220px' },
    { name: 'Head of Family', selector: 'headOfFamily', width: '120px' },
    { name: 'Facility Name', selector: 'facilityName', width: '220px' },
    { name: 'SubCenter Name', selector: 'subCenterName', width: '220px' },
    { name: 'District Name', selector: 'districtName', width: '120px' },
    {
      name: 'Corporation Name',
      selector: 'corporationName',
      width: '120px',
    },
    { name: 'Taluka Name', selector: 'talukaName', width: '120px' },
    { name: 'Village Name', selector: 'villageName', width: '120px' },
    { name: 'Town', selector: 'town', width: '120px' },
  ];
  async function GetLFCasesGraphDistwise() {
    const response = await graphservice.getLFCasesGraphDistwise({
      year: `${props.yearoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(',')}`,
      month: `${props.monthoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(',')}`,
      districtId: `${props.selectedId}`,
    });
    if (response && response.data) {
      settablelist(response.data);
    }
  }
  async function GetPendingApprovalMOGraphDistwise() {
    const response = await graphservice.getPendingApprovalMOGraphDistwise({
      year: `${props.yearoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(',')}`,
      month: `${props.monthoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(',')}`,
      districtId: `${props.selectedId}`,
    });
    if (response && response.data) {
      settablelist(response.data);
    }
  }
  async function GetHydroceleCasesGraphDistwise() {
    const response = await graphservice.getHydroceleCasesGraphDistwise({
      year: `${props.yearoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(',')}`,
      month: `${props.monthoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(',')}`,
      districtId: `${props.selectedId}`,
    });
    if (response && response.data) {
      settablelist(response.data);
    }
  }
  async function GetHydroceleOperatedGraphDistwise() {
    const response = await graphservice.getHydroceleOperatedGraphDistwise({
      year: `${props.yearoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(',')}`,
      month: `${props.monthoption
        .map((item: { value: any }) => {
          return item.value;
        })
        .join(',')}`,
      districtId: `${props.selectedId}`,
    });
    if (response && response.data) {
      settablelist(response.data);
    }
  }
  useEffect(() => {
    if (props.show === true) {
      props.selectedkey === 'No. Of LF Cases' && GetLFCasesGraphDistwise();
      props.selectedkey === 'No. of Hydrocele Cases' &&
        GetHydroceleCasesGraphDistwise();
      props.selectedkey === 'No of Hydrocele patients operated' &&
        GetHydroceleOperatedGraphDistwise();
      props.selectedkey ===
        'No. Of Cases Approvals by medical officer Pending' &&
        GetPendingApprovalMOGraphDistwise();
    }
  }, [
    props.show,
    props.yearoption,
    props.monthoption,
    props.selectedId,
    props.selectedkey,
  ]);
  return (
    <Modal size='xl' show={props.show} onHide={props.handleCloseModal}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-md-8'>
            <h5 className='card-title'>
              {props.selectedkey ? props.selectedkey : ''}
            </h5>
          </div>
          <div className='col-md-4 text-right'>
            <CsvDownload
              data={tablelist}
              filename='dashboard.csv'
              style={{ marginRight: '15px' }}
              className='mt-m font-chng btn btn-secondary'>
              Export Data
            </CsvDownload>
          </div>
          <div className='dash-table'>
            <DataTable
              columns={columns}
              data={tablelist}
              highlightOnHover
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 25, 50, 100]}
              paginationComponentOptions={{
                rowsPerPageText: 'Records per page:',
                rangeSeparatorText: 'out of',
              }}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
