import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import CsvDownload from 'react-json-to-csv';
import DataTable from 'react-data-table-component';
import ColumnsConfig from './ColumnsConfig'

export default function MFRatesTable(props) {

  // useEffect(() => {

  // }, [
  //   props.show,
  //   props.data
  // ]);

// const handleCloseModal = (evt: any) => {
//     console.log("evt", evt)
//   };
const formatAlertsData = (alertsData) => {
  if(!alertsData.length) return []
  return alertsData.map(item => {
    return {
      ...item,
      isTriggerEmail : item.isTriggerEmail ? "Yes" : "No",
      isTriggerSMS : item.isTriggerSMS ? "Yes" : "No",
      createdAt : new Date(item.createdAt).toLocaleDateString('en-GB')
    }
  })
}
  return (
    <Modal size='xl' show={props.show} onHide={props.handleCloseModal}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-md-8'>
            <h5 className='card-title'>
              {props.tableColumnConfig.title}
            </h5>
          </div>
          <div className='col-md-4 text-right'>
            <CsvDownload
              data={props.data}
              filename={`${props.tableColumnConfig.title}.csv`}
              style={{ backgroundColor: '#19D895', border: 'none', fontWeight: 500, color: '#FFFFFF', fontSize: 13 }}
              className='mt-m btn btn-primary'>
              Export Data
            </CsvDownload>
          </div>
          <div className='mfrt-table'>
            <DataTable
              columns={ColumnsConfig[props.tableColumnConfig.headers]}
              data={props.tableColumnConfig.headers === "Alerts" ? formatAlertsData(props.data) : props.data}
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
