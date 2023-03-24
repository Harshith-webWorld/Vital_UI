import React, { useState } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { reportTableStyle } from '../../utils';
import { findtotal } from '../../../../../Components/constant';

const Table = ({
  reportTableData,
  createpdf,
  id,
  districtName,
  startMonth,
  endMonth,
  year,
  facilityName,
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

  console.log(reportTableData);

  return (
    <div>
      <TableContainer>
        <table id={id}>
          <thead>
            <tr>
              <td rowSpan={2}>Sr. No.</td>
              <td>Name of Unit</td>
              <td rowSpan={2}>No.of persons Examined</td>
              <td rowSpan={2}>No.of +ve for MF</td>
              <td rowSpan={2}>MF Rate</td>
              <td rowSpan={2}>
                No.of +ve for <br /> the Disease
              </td>
              <td rowSpan={2}>Disease Rate</td>
            </tr>
            <tr>
              <td>Sub- Unit/N.C./ A type Unit</td>
            </tr>
          </thead>
          <tbody>
            {reportTableData && reportTableData.length > 0 ? (
              reportTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data: any, index: any) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.nameOfControlUnit}</td>
                    <td align='right'>{data.noOfPersonsExam}</td>
                    <td align='right'>{data.noOfPersonsMF}</td>
                    <td align='right'>{data.MFRate}</td>
                    <td align='right'>{data.noOfPersonsDes}</td>
                    <td align='right'>{data.DesRate}</td>
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
            {reportTableData && reportTableData.length > 0 && (
              <>
                <tr>
                  <td></td>
                  <td>Total</td>
                  <td align='right'>
                    {' '}
                    {findtotal(reportTableData, 'noOfPersonsExam')}
                  </td>
                  <td align='right'>
                    {' '}
                    {findtotal(reportTableData, 'noOfPersonsMF')}
                  </td>
                  <td align='right'> {findtotal(reportTableData, 'MFRate')}</td>
                  <td align='right'>
                    {' '}
                    {findtotal(reportTableData, 'noOfPersonsDes')}
                  </td>
                  <td align='right'>
                    {' '}
                    {findtotal(reportTableData, 'DesRate')}
                  </td>
                </tr>
                {/* <tr>
                  <td ></td>
                  <td >Grand Total</td>
                  <td ></td>
                  <td ></td>
                  <td ></td>
                  <td ></td>
                  <td ></td>
                </tr> */}
              </>
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
      {/* <div className="mt-10 flex items-center">
        MF Rate =
        <div className="mx-2">
          <p>Total no of person found MF positive</p>
          <p className="border"></p>
          <p>Total No person examined for MF</p>
        </div>
        x 100
      </div>
      <div className="mt-10 flex items-center">
        Disease Rate =
        <div className="mx-2">
          <p>
            Number of persons showing signs and symptoms for filarial disease
            manifestation
          </p>
          <p className="border"></p>
          <p>Total No person examined for filarial disease</p>
        </div>
        x 100
      </div> */}
    </div>
  );
};

export default Table;
