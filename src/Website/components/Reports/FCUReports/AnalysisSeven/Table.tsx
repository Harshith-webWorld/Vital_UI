import React, { useState } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { reportTableStyle } from '../../utils';

const Table = ({
  reportTableData,
  createpdf,
  id,
  districtName,
  month,
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
            <tr>
              <td rowSpan={2}>Sr. No.</td>
              <td>Name of Unit</td>
              <td rowSpan={2}>
                Blood Smear Collection
                <br /> During the Month
              </td>
              <td colSpan={3}>Blood Smear Exam.</td>
              <td colSpan={2}>Progressive for Exam.</td>
              <td rowSpan={2}>
                Blood Smear
                <br /> Not to be Exam.
              </td>
            </tr>
            <tr>
              <td>Sub- Unit/N.C./ A type Unit</td>
              <td>During</td>
              <td>Previous</td>
              <td>Total</td>
              <td>Collection from</td>
              <td>Exam. from</td>
            </tr>
          </thead>
          <tbody>
            {reportTableData && reportTableData.length > 0 ? (
              reportTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data: any, index: any) => {
                  return (
                    <tr key={`AS${index}`}>
                      <td>{index + 1}</td>
                      <td>{data.nameOfControlUnit}</td>
                      <td align='right'>{data.BSCommectionDuring}</td>
                      <td align='right'>{data.BSExamDuring}</td>
                      <td align='right'>{data.BSExamPrevious}</td>
                      <td align='right'>{data.BSExamTotal}</td>
                      <td align='right'>{data.CollectionFrom}</td>
                      <td align='right'>{data.ExamFrom}</td>
                      <td align='right'>{data.BSNotToBeExam}</td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td
                  colSpan={11}
                  style={{ textAlign: 'center', height: '100px' }}>
                  No Data found
                </td>
              </tr>
            )}
            {reportTableData && reportTableData.length > 0 && (
              <tr>
                <td></td>
                <td>Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
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
