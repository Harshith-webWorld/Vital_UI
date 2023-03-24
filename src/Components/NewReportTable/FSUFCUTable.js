import React from 'react';
import {
  Box,
  Typography,
  Card,
  Divider,
  Icon,
  Tooltip,
  styled,
  FormControl,
  Select,
  TableContainer,
  TablePagination as Paging,
} from '@material-ui/core';

import { totalCountGenerator } from './utils';

const MDBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  alignSelf: 'center',
  marginBottom: '10px',
}));

const MDTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '15px',
  lineHeight: '28px',
  color: '#495057',
}));

const tableHeadStyle = {
  fontFamily: 'Poppins',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '13px',
  lineHeight: '24px',
  color: '#000000',
};

const tdStyle = (index, item) => {
  return {
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: index === 0 ? '600' : '500',
    fontSize: '13px',
    lineHeight: '24px',
    color: index === 3 ? 'rgb(52, 195, 143)' : '#000000',
    // color:
    //   index === 0
    //     ? "#2F79EA"
    //     : item?.slice(0, 4).toUpperCase() === "PASS"
    //       ? "#34C38F"
    //       : item?.slice(0, 4).toUpperCase() === "FAIL"
    //         ? "#F46A6A"
    //         : "#495057",
  };
};

function FSUFCUTable({ title, rightTitle, tableHeadTitle, tableData }) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  return (
    <div style={{ padding: '20px' }}>
      <style>{`
      td {
      padding: 6px 5px;
      white-space: unset;
      height: 35px;
      border-bottom: 2px solid #EFF2F7;
          }
    thead{
        background: rgba(47, 121, 234, 0.06);
        height: 40px;
        border-bottom: 2px solid #EFF2F7;
    }
  `}</style>
      {/* <MDBox>
        <MDTitle>{title}</MDTitle>
        {rightTitle && (
          <p
            style={{
              fontFamily: "Poppins",
              fontStyle: "normal",
              fontWeight: "500",
              fontSize: "13px",
              lineHeight: "20px",
              color: "#495057",
            }}
          >
            {rightTitle}
          </p>
        )}
      </MDBox> */}
      <div>
        <TableContainer>
          <table style={{ width: '100%' }}>
            <thead>
              <tr>
                <td rowSpan={2} style={tableHeadStyle}>
                  {tableHeadTitle}
                </td>
                <td colSpan={3} style={tableHeadStyle}>
                  No. of Person Examined
                </td>
                <td colSpan={3} style={tableHeadStyle}>
                  No. of Filaria Cases Detected
                </td>
                <td colSpan={3} style={tableHeadStyle}>
                  No. of Filaria Cases Treated
                </td>
              </tr>
              <tr>
                <td style={tableHeadStyle}>Target</td>
                <td style={tableHeadStyle}>Ach.</td>
                <td style={tableHeadStyle}>% Ach.</td>
                <td style={tableHeadStyle}>MF</td>
                <td style={tableHeadStyle}>Dis.</td>
                <td style={tableHeadStyle}>Total</td>
                <td style={tableHeadStyle}>MF</td>
                <td style={tableHeadStyle}>Dis.</td>
                <td style={tableHeadStyle}>Total</td>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 &&
                tableData
                  ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => (
                    <tr key={index}>
                      <td style={tdStyle(0, item.nameOfUnit)}>
                        {item.nameOfUnit}
                      </td>
                      <td style={tdStyle(1, item.noOfPersonsTarget)}>
                        {item.noOfPersonsTarget}
                      </td>
                      <td style={tdStyle(2, item.noOfPersonsAchieved)}>
                        {item.noOfPersonsAchieved}
                      </td>
                      <td style={tdStyle(3, item.percentOfPersonsAchieved)}>
                        {parseFloat(item.percentOfPersonsAchieved).toFixed(2)}
                      </td>
                      <td style={tdStyle(4, item.noOfCasesMF)}>
                        {item.noOfCasesMF}
                      </td>
                      <td style={tdStyle(4, item.noOfCasesDisease)}>
                        {item.noOfCasesDisease}
                      </td>
                      <td style={tdStyle(4, item.noOfCasesTotal)}>
                        {item.noOfCasesTotal}
                      </td>
                      <td style={tdStyle(4, item.noOfCasesMFTreated)}>
                        {item.noOfCasesMFTreated}
                      </td>
                      <td style={tdStyle(4, item.noOfCasesDiseaseTreated)}>
                        {item.noOfCasesDiseaseTreated}
                      </td>
                      <td style={tdStyle(4, item.noOfCasesTreatedTotal)}>
                        {item.noOfCasesTreatedTotal}
                      </td>
                    </tr>
                  ))}
              {tableData.length > 0 && (
                <tr>
                  <>
                    <td style={tdStyle(0, 'nameOfUnit')}>Total</td>
                    <td style={tdStyle(1, 'noOfPersonsTarget')}>
                      {totalCountGenerator(tableData, 'noOfPersonsTarget')}
                    </td>
                    <td style={tdStyle(1, 'noOfPersonsAchieved')}>
                      {totalCountGenerator(tableData, 'noOfPersonsAchieved')}
                    </td>
                    <td style={tdStyle(3, 'percentOfPersonsAchieved')}>
                      {totalCountGenerator(
                        tableData,
                        'percentOfPersonsAchieved'
                      )}
                    </td>
                    <td style={tdStyle(1, 'noOfCasesMF')}>
                      {totalCountGenerator(tableData, 'noOfCasesMF')}
                    </td>
                    <td style={tdStyle(1, 'noOfCasesDisease')}>
                      {totalCountGenerator(tableData, 'noOfCasesDisease')}
                    </td>
                    <td style={tdStyle(1, 'noOfCasesTotal')}>
                      {totalCountGenerator(tableData, 'noOfCasesTotal')}
                    </td>
                    <td style={tdStyle(1, 'noOfCasesMFTreated')}>
                      {totalCountGenerator(tableData, 'noOfCasesMFTreated')}
                    </td>
                    <td style={tdStyle(1, 'noOfCasesDiseaseTreated')}>
                      {totalCountGenerator(
                        tableData,
                        'noOfCasesDiseaseTreated'
                      )}
                    </td>
                    <td style={tdStyle(1, 'noOfCasesTreatedTotal')}>
                      {totalCountGenerator(tableData, 'noOfCasesTreatedTotal')}
                    </td>
                  </>
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
          }}
        >
          <Paging
            rowsPerPageOptions={[10, 25, 50, 100]}
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{ border: 'none', overflow: 'hidden' }}
          />
        </div>
      </div>
    </div>
  );
}

export default FSUFCUTable;
