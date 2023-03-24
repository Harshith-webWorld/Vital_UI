import React, { useState } from 'react';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { reportTableStyle } from '../../utils';

const Table = ({
  unitReportTableData,
  subUnitReportTableData,
  createpdf,
  id,
  districtName,
  month,
  year,
  FilariaFieldUnitName,
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
            <tr>
              <td rowSpan={2}>Unit</td>
              <td rowSpan={2}>Target for persons</td>
              <td rowSpan={2}>No.of persons Exam.</td>
              <td rowSpan={2}>% of Achievement</td>
              <td rowSpan={2}>Blood Smear Exam.</td>
              <td colSpan={4}>Filaria Cases Detected</td>
              <td colSpan={3}>Rates</td>
              <td colSpan={3}>Cases Treated</td>
              <td colSpan={6}>Cases Remain Un-Treated Due to</td>
            </tr>
            <tr>
              <td>MF</td>
              <td>Dis.</td>
              <td>Botd</td>
              <td>Total</td>
              <td>MF</td>
              <td>Dis.</td>
              <td>End</td>
              <td>MF</td>
              <td>Dis.</td>
              <td>Total</td>
              <td>Preg</td>
              <td>Abs</td>
              <td>ill</td>
              <td>Mig</td>
              <td>Pain</td>
              <td>Total</td>
            </tr>
          </thead>

          <tbody>
            {unitReportTableData.length !== 0 ? (
              unitReportTableData.map((data: any, index: any) => (
                <tr>
                  {index === 0 && (
                    <>
                      <td rowSpan={unitReportTableData.length}>
                        Unit as Whole
                      </td>
                      <td rowSpan={unitReportTableData.length}>
                        {data.targetForCollectionOfNBS}
                      </td>
                    </>
                  )}
                  <td>{data.NoOfPersonsExam}</td>
                  <td>{data.PercentageOfAchievement}</td>
                  <td>{data.NoOfBSExamined}</td>
                  <td>{data.NoOfMF}</td>
                  <td>{data.NoOfDes}</td>
                  <td>{data.NoOfBoth}</td>
                  <td>{data.NoOfTot}</td>
                  <td>{data.MFRate}</td>
                  <td>{data.DesRate}</td>
                  <td>{data.EndRate}</td>
                  <td>{data.NoTreatedMF}</td>
                  <td>{data.NoTreatedDes}</td>
                  <td>{data.NoTreatedTot}</td>
                  <td>{data.NotTreatedP}</td>
                  <td>{data.NotTreatedAP}</td>
                  <td>{data.NotTreatedI}</td>
                  <td>{data.NotTreatedM}</td>
                  <td>{data.NotTreatedP}</td>
                  <td>{data.NotTreatedTot}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td> Unit as Whole</td>

                <td
                  colSpan={4}
                  style={{ textAlign: 'center', height: '100px' }}>
                  No Data found
                </td>
              </tr>
            )}

            {subUnitReportTableData.length !== 0 ? (
              subUnitReportTableData.map((data: any, index: any) => (
                <tr>
                  {index === 0 && (
                    <>
                      <td rowSpan={subUnitReportTableData.length}>
                        A type Unit
                      </td>
                      <td rowSpan={subUnitReportTableData.length}>
                        {data.targetForCollectionOfNBS}
                      </td>
                    </>
                  )}
                  <td>{data.NoOfPersonsExam}</td>
                  <td>{data.PercentageOfAchievement}</td>
                  <td>{data.NoOfBSExamined}</td>
                  <td>{data.NoOfMF}</td>
                  <td>{data.NoOfDes}</td>
                  <td>{data.NoOfBoth}</td>
                  <td>{data.NoOfTot}</td>
                  <td>{data.MFRate}</td>
                  <td>{data.DesRate}</td>
                  <td>{data.EndRate}</td>
                  <td>{data.NoTreatedMF}</td>
                  <td>{data.NoTreatedDes}</td>
                  <td>{data.NoTreatedTot}</td>
                  <td>{data.NotTreatedP}</td>
                  <td>{data.NotTreatedAP}</td>
                  <td>{data.NotTreatedI}</td>
                  <td>{data.NotTreatedM}</td>
                  <td>{data.NotTreatedP}</td>
                  <td>{data.NotTreatedTot}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td> A type Unit</td>
                <td
                  colSpan={4}
                  style={{ textAlign: 'center', height: '100px' }}>
                  No Data found
                </td>
              </tr>
            )}

            {/* <tr>
              <td >Unit as Whole</td>
              <td >Progressive</td>
              {[...Array(19)].map((index) => (
                <td  key={index}></td>
              ))}
            </tr>
            <tr>
              <td >A type Unit</td>
              <td >Progressive</td>
              {[...Array(19)].map((index) => (
                <td  key={index}></td>
              ))}
            </tr> */}
          </tbody>
        </table>
      </TableContainer>

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
      </div>

      <div className="mt-10 flex items-center">
        Endemicity Rate =
        <div className="mx-2">
          <p>No having disease signs + no of MF positive + botd</p>
          <p className="border"></p>
          <p>Total No person examined</p>
        </div>
        x 100
      </div> */}
    </div>
  );
};

export default Table;
