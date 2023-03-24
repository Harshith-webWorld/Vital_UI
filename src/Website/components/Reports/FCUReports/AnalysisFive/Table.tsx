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
        <table id='table-to-xlsnew'>
          <thead>
            {' '}
            <tr>
              <td colSpan={3}>
                No. of Cases Detected
                <br /> During the Month
              </td>
              <td colSpan={3}>
                No. of Progressive
                <br /> Filarial Cases Treated
                <br /> During the Month
              </td>
              <td colSpan={2}>D.E.C. Tab</td>
              <td colSpan={3}>
                No. of old Cases
                <br /> treated During the Month
              </td>{' '}
              <td colSpan={1}>Month</td> <td colSpan={1}>Year</td>
            </tr>
            <tr>
              <td>MF</td>
              <td>Dis.</td>
              <td>Total</td>
              <td>MF</td>
              <td>Dis.</td>
              <td>Total</td>
              <td>Consumed</td>
              <td>Bal.</td>
              <td>No.</td>
              <td>Tab.</td>
              <td>Consumed</td>
              <td></td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {reportTableData && reportTableData.length > 0 ? (
              reportTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data: any, index: any) => {
                  return (
                    <tr key={index}>
                      <td align='right'>{data.FoundMFPostve}</td>
                      <td align='right'>{data.FoundDesPostve}</td>
                      <td align='right'>{data.FoundTotPostve}</td>
                      <td align='right'></td>
                      <td align='right'></td>
                      <td align='right'></td>
                      <td align='right'>{data.noOfDECTabletsConsumed}</td>
                      <td align='right'>{data.noOfDECTabletsBal}</td>
                      <td align='right'></td>
                      <td align='right'></td>
                      <td align='right'></td>
                      <td align='right'>{data.month}</td>
                      <td align='right'>{data.year}</td>
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
      {/* // <table className="table-auto border-collapse border-gray-700 border-2">
    //   <thead>
    //     <tr className="border-gray-700 border-2">
    //       <th className="w-36 border-gray-700 border-2" colSpan={3}>
    //         No. of Cases Detected During the Month
    //       </th>
    //       <th className="w-32 border-gray-700 border-2" colSpan={3}>
    //         No. of Progressive Filarial Cases Treated During the Month
    //       </th>
    //       <th className="w-32 border-gray-700 border-2" colSpan={2}>
    //         D.E.C. Tab
    //       </th>

    //       <th className="w-32 border-gray-700 border-2" colSpan={3}>
    //         No. of old Cases treated During the Month
    //       </th>
    //     </tr>
    //     <tr>
    //       <th className="w-32 border-gray-700 border-2">M.F.</th>
    //       <th className="w-32 border-gray-700 border-2">Dis.</th>
    //       <th className="w-32 border-gray-700 border-2">Total</th>
    //       <th className="w-32 border-gray-700 border-2">M.F.</th>
    //       <th className="w-32 border-gray-700 border-2">Dis.</th>
    //       <th className="w-32 border-gray-700 border-2">Total</th>
    //       <th className="w-32 border-gray-700 border-2">Consumed</th>
    //       <th className="w-32 border-gray-700 border-2">Bal.</th>
    //       <th className="w-32 border-gray-700 border-2">No.</th>
    //       <th className="w-32 border-gray-700 border-2">Tab.</th>
    //       <th className="w-32 border-gray-700 border-2">Consumed</th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {[...Array(5)].map((index) => ( */}
      {/* //       <tr key={index}>
    //         <td className="w-32 h-4 border-gray-700 border-2"></td>
    //         <td className="w-32 border-gray-700 border-2"></td>
    //         <td className="w-32 border-gray-700 border-2"></td>
    //         <td className="w-32 border-gray-700 border-2"></td>
    //         <td className="w-32 border-gray-700 border-2"></td>
    //         <td className="w-32 border-gray-700 border-2"></td>
    //         <td className="w-32 border-gray-700 border-2"></td>
    //         <td className="w-32 border-gray-700 border-2"></td>
    //         <td className="w-32 border-gray-700 border-2"></td>
    //         <td className="w-32 border-gray-700 border-2"></td>
    //         <td className="w-32 border-gray-700 border-2"></td>
    //       </tr>
    //     ))}
    //   </tbody> */}
      {/* // </table> */}
    </div>
  );
};

export default Table;
