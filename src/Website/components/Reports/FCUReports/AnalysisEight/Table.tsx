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
            {' '}
            <tr>
              <td rowSpan={4}>
                Name of Unit
                <br /> Sub- Unit/N.C./ A type Unit
              </td>
              <td colSpan={10}>Previous Year</td>
              <td colSpan={10}>Current Year</td>
            </tr>
            <tr>
              <td colSpan={5}>During Month</td>
              <td colSpan={5}>Progress Month</td>
              <td colSpan={5}>During Month</td>
              <td colSpan={5}>Progress Month</td>
            </tr>
            <tr>
              <td>B.S.</td>
              <td>MF</td>
              <td>MF</td>
              <td>Disease</td>
              <td>Disease</td>

              <td>B.S.</td>
              <td>MF</td>
              <td>MF</td>
              <td>Disease</td>
              <td>Disease</td>

              <td>B.S.</td>
              <td>MF</td>
              <td>MF</td>
              <td rowSpan={2}>Disease Cases</td>
              <td rowSpan={2}>Disease Rate%</td>

              <td>B.S.</td>
              <td>MF</td>
              <td>MF</td>
              <td rowSpan={2}>Disease Cases</td>
              <td rowSpan={2}>Disease Rate%</td>
            </tr>
            <tr>
              <td>Exam</td>
              <td>+ve</td>
              <td>Rate</td>
              <td>Cases</td>
              <td>Rate %</td>

              <td>Exam</td>
              <td>+ve</td>
              <td>Rate %</td>
              <td>Cases</td>
              <td>Rate %</td>

              <td>Exam</td>
              <td>+ve</td>
              <td>Rate %</td>

              <td>Exam</td>
              <td>+ve</td>
              <td>Rate %</td>
            </tr>
          </thead>
          <tbody>
            {reportTableData && reportTableData.length > 0 ? (
              reportTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data: any, index: any) => {
                  return (
                    <tr key={index}>
                      <td>{data.nameOfControlUnit}</td>
                      <td align='right'>{data.BSExamDuringPrev}</td>
                      <td align='right'>{data.MFCountDuringPrev}</td>
                      <td align='right'>{data.MFRateDuringPrev}</td>
                      <td align='right'>{data.DisCountDuringPrev}</td>
                      <td align='right'>{data.DisRateDuringPrev}</td>
                      <td align='right'>{data.BSExamPrgPrev}</td>
                      <td align='right'>{data.MFCountPrgPrev}</td>
                      <td align='right'>{data.MFRatePrgPrev}</td>
                      <td align='right'>{data.DisCountPrgPrev}</td>
                      <td align='right'>{data.DisRatePrgPrev}</td>
                      <td align='right'>{data.BSExamDuringCurrent}</td>
                      <td align='right'>{data.MFCountDuringCurrent}</td>
                      <td align='right'>{data.MFRateDuringCurrent}</td>
                      <td align='right'>{data.DisCountDuringCurrent}</td>
                      <td align='right'>{data.DisRateDuringCurrent}</td>
                      <td align='right'>{data.BSExamPrgCurrent}</td>
                      <td align='right'>{data.MFCountPrgCurrent}</td>
                      <td align='right'>{data.MFRatePrgCurrent}</td>
                      <td align='right'>{data.DisCountPrgCurrent}</td>
                      <td align='right'>{data.DisRatePrgCurrent}</td>
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
