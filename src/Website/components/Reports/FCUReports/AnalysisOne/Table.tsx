import React, { useState } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging } from '@material-ui/core';

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
    <div className='post-tablenew font-chng cus-table'>
      <TableContainer>
        <table id='table-to-xlsnew'>
          <thead>
            <tr>
              <td>Name of Unit </td>
              <td rowSpan={3}>
                Population Covered by
                <br /> Each NFCP Unit
              </td>
              <td rowSpan={3}>B.S.Collection</td>
              <td rowSpan={3}>Prev. Back Log</td>
              <td rowSpan={3}>Total Exam.</td>
              <td colSpan={4}>During The Month</td>
              <td colSpan={3}>Progressive</td>
            </tr>
            <tr>
              <td rowSpan={2}>
                Sub-Unit/ N.C./ A type
                <br /> Unit
              </td>
              <td rowSpan={2}>MF + Ve</td>
              <td>MF +ve</td>
              <td>Disease</td>
              <td>Disease</td>
              <td rowSpan={2}>B. S. Exam.</td>
              <td rowSpan={2}>M. F. + Ve</td>
              <td rowSpan={2}>M. F. Rate</td>
            </tr>
            <tr>
              <td>Rate %</td>
              <td>Cases</td>
              <td>Rate</td>
            </tr>
          </thead>
          <tbody>
            {reportTableData && reportTableData.length > 0 ? (
              reportTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data: any, index: any) => {
                  return data.populationCoveredByUnit !== '0' ? (
                    <tr key={index}>
                      <td>{data.nameOfUnit}</td>
                      <td align='right'>{data.populationCoveredByUnit}</td>
                      <td align='right'>{data.NoOfBSCollected}</td>
                      <td align='right'>{data.PrevBackLog}</td>
                      <td align='right'>{data.NoOfBSExamined}</td>
                      <td align='right'>{data.NoOfMFPostve}</td>
                      <td align='right'>{data.MFRate}</td>
                      <td align='right'>{data.NoOfDesPostve}</td>
                      <td align='right'>{data.DesRate}</td>
                      <td align='right'>{data.PrgBSExam}</td>
                      <td align='right'>{data.PrgMFPostve}</td>
                      <td align='right'>{data.PrgMFRate}</td>
                    </tr>
                  ) : (
                    <></>
                  );
                })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{ textAlign: 'center', height: '100px' }}>
                  No Data found
                </td>
              </tr>
            )}
            <tr>
              <td
                colSpan={7}
                style={{ textAlign: 'center', height: '40px' }}></td>
            </tr>
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
