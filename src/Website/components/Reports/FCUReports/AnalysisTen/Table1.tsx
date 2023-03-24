import React, { useState } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { reportTableStyle, ageTextGenerator } from '../../utils';

const Table = ({
  reportTableData,
  createpdf,
  id,
  districtName,
  startMonth,
  endMonth,
  year,
  nameOfUnitName,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div>
      <TableContainer>
        <table id={id}>
          <thead>
            {' '}
            <tr>
              <td rowSpan={3}>Sr.No </td>
              <td rowSpan={3}>Taluka</td>
              <td rowSpan={3}>P.H.C</td>
              <td rowSpan={3}>Sub Center</td>
              <td rowSpan={3}>Village</td>
              <td rowSpan={3}>Patients Name</td>
              <td rowSpan={3}>Age</td>
              <td rowSpan={3}>M/F</td>
              <td rowSpan={3}>Phone No</td>
              <td rowSpan={3}>Date of Examination</td>
              <td rowSpan={3}>B.S. No.</td>
              <td rowSpan={3}>MF Count</td>
              <td colSpan={2}>Date of Treatment</td>
              <td colSpan={20}>Followup B.S. Date & Result</td>
              <td rowSpan={3}>Name of Drug Administrator</td>
              <td rowSpan={3}>Designation</td>
              <td rowSpan={3}>Phone No</td>
            </tr>
            <tr>
              <td rowSpan={2}>From</td>
              <td rowSpan={2}>To</td>
              <td colSpan={2}>I</td>
              <td colSpan={2}>II</td>
              <td colSpan={2}>III </td>
              <td colSpan={2}>IV</td>
              <td colSpan={2}>V</td>
              <td colSpan={2}>VI</td>
              <td colSpan={2}>VII</td>
              <td colSpan={2}>VIII</td>
              <td colSpan={2}>IX</td>
              <td colSpan={2}>X</td>
            </tr>
            <tr>
              <td>Date/Result</td>
              <td>Treatment start date</td>
              <td>Date/Result</td>
              <td>Treatment start date</td>
              <td>Date/Result</td>
              <td>Treatment start date</td>
              <td>Date/Result</td>
              <td>Treatment start date</td>
              <td>Date/Result</td>
              <td>Treatment start date</td>
              <td>Date/Result</td>
              <td>Treatment start date</td>
              <td>Date/Result</td>
              <td>Treatment start date</td>
              <td>Date/Result</td>
              <td>Treatment start date</td>
              <td>Date/Result</td>
              <td>Treatment start date</td>
              <td>Date/Result</td>
              <td>Treatment start date</td>
            </tr>
          </thead>

          <tbody>
            {reportTableData && reportTableData.length > 0 ? (
              reportTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data: any, index: any) => (
                  <tr>
                    <td> {index + 1}</td>
                    <td>{data.talukaName}</td>
                    <td>{data.facilityName}</td>
                    <td>{data.subCenterName}</td>
                    <td>{data.villageName}</td>
                    <td>{data.patientName}</td>
                    <td>{ageTextGenerator(data.ageYears, data.ageMonths)}</td>
                    <td>{data.gender}</td>
                    <td align='right'>{data.patientPhoneNo}</td>
                    <td align='right'>{data.dateOfExamination}</td>
                    <td></td>
                    <td></td>
                    <td align='right'>{data.dateOfTreatmentStarted}</td>
                    <td align='right'></td>
                    <td>{data.result1}</td>
                    <td align='right'>{data.TreatmentDate1}</td>
                    <td>{data.result2}</td>
                    <td align='right'>{data.TreatmentDate2}</td>
                    <td>{data.result3}</td>
                    <td align='right'>{data.TreatmentDate3}</td>
                    <td>{data.result4}</td>
                    <td align='right'>{data.TreatmentDate4}</td>
                    <td>{data.result5}</td>
                    <td align='right'>{data.TreatmentDate5}</td>
                    <td>{data.result6}</td>
                    <td align='right'>{data.TreatmentDate6}</td>
                    <td>{data.result7}</td>
                    <td align='right'>{data.TreatmentDate7}</td>
                    <td>{data.result8}</td>
                    <td align='right'>{data.TreatmentDate8}</td>
                    <td>{data.result8}</td>
                    <td align='right'>{data.TreatmentDate9}</td>
                    <td>{data.result10}</td>
                    <td align='right'>{data.TreatmentDate10}</td>
                    <td>{data.nameOfDrugAdmin}</td>
                    <td>{data.designation}</td>
                    <td align='right'>{data.phoneNoOfDrugAdmin}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: 'center', height: '100px' }}>
                  No Data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableContainer>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <Paging
          rowsPerPageOptions={[10, 25, 50, 100]}
          count={reportTableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          style={{ border: 'none' }}
        />
      </div>
    </div>
  );
};

export default Table;
