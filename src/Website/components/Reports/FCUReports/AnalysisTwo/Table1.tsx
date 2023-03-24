import React, { useState } from 'react';
import { reportTableStyle } from '../../utils';

import { Exportpdf } from '../../../../services/PdfService';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

const Table1 = ({
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
  return (
    <div className='post-tablenew font-chng cus-table'>
      <TableContainer>
        <table id='table-to-xlsnew'>
          <thead>
            {' '}
            <tr>
              <td>Name of Unit </td>
              <td rowSpan={2}>
                Target for persons
                <br /> Exam.
              </td>
              <td rowSpan={2}>
                No .of persons
                <br /> Exam.
              </td>
              <td rowSpan={2}>
                No. of Achieved
                <br /> For B.S. collection
              </td>
              <td rowSpan={2}>B.S. Exam.</td>
              <td colSpan={4}>Filaria Cases Detected</td>
              <td colSpan={3}>Rates</td>
              <td colSpan={3}>
                Treated
                <br />
                New
              </td>
              <td rowSpan={2}>% of cases Treated</td>
              <td rowSpan={2}>Population Covered</td>
              <td rowSpan={2}>
                % of Population
                <br /> Covered
              </td>
              <td colSpan={7}>Cases Remaining Un-Treated Due to</td>
            </tr>
            <tr>
              <td>
                Sub- Unit/N.C/
                <br /> A type Unit
              </td>
              <td>MF</td>
              <td>Dis.</td>
              <td>Both</td>
              <td>Total</td>
              <td>MF</td>
              <td>Dis.</td>
              <td>Total</td>
              <td>MF</td>
              <td>Dis.</td>
              <td>Total</td>
              <td>Preg</td>
              <td>Abs</td>
              <td>Migration</td>
              <td>ill</td>
              <td>Death</td>
              <td>Pan</td>
              <td>Total</td>
            </tr>
          </thead>
          <tbody>
            {reportTableData && reportTableData.length > 0 ? (
              reportTableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((data: any, index: any) => (
                  <tr key={index}>
                    <td>{data.nameOfUnit}</td>
                    <td align='right'>{data.targetForCollectionOfNBS}</td>
                    <td align='right'>{data.NoOfBSExamined}</td>
                    <td align='right'>{data.AchivedOfBSCollection}</td>
                    <td align='right'>{data.NoOfBSCollected}</td>
                    <td align='right'>{data.NoTreatedMF}</td>
                    <td align='right'>{data.NoTreatedDes}</td>
                    <td align='right'>{data.NoTreatedTot}</td>
                    <td align='right'>{data.NoTreatedTot}</td>
                    <td align='right'>{data.MFRate}</td>
                    <td align='right'>{data.DesRate}</td>
                    <td align='right'>{data.TotRate}</td>
                    <td align='right'>{data.MFRate}</td>
                    <td align='right'>{data.DesRate}</td>
                    <td align='right'>{data.TotRate}</td>
                    <td align='right'>{data.percentOfCasesTreated}</td>
                    <td align='right'>{data.populationCovered}</td>
                    <td align='right'>{data.percentOfPopulationCovered}</td>
                    <td align='right'>{data.NotTreatedP}</td>
                    <td align='right'>{data.NotTreatedAP}</td>
                    <td align='right'>{data.NotTreatedM}</td>
                    <td align='right'>{data.NotTreatedI}</td>
                    <td align='right'>{data.NotTreatedD}</td>
                    <td align='right'>{data.NotTreatedO}</td>
                    <td align='right'>{data.NotTreatedTot}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: 'center',
                    height: '100px',
                  }}>
                  No Data found
                </td>
              </tr>
            )}{' '}
            <tr>
              <td
                colSpan={7}
                style={{
                  textAlign: 'center',
                  height: '40px',
                }}></td>
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

export default Table1;
