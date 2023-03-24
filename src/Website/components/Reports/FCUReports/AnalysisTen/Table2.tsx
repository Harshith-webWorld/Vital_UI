import React from "react";
import TableContainer from "@material-ui/core/TableContainer";
import { TablePagination as Paging } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

const columnHeaderStyle = {
  background: '#0e9207',
  color: '#ffff',
};

const columnDataStyle = {
  borderBottom: '1px solid #E0E0E0',
};
const Table = (reportData:any) => {
  return (
    <TableContainer component={Paper}>
      <table style={{
        border: "none",
        width: "100%",
        borderRadius: "15px",
      }}>
        <thead>
          <tr style={{
            background: "#0e9207",
            color: "#ffff",
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
          }}>
            <th style={columnHeaderStyle} colSpan={13}>
              Followup B.S. Date & Result
            </th>
          </tr>
          <tr style={columnHeaderStyle}>
            <th style={columnHeaderStyle}></th>
            <th style={columnHeaderStyle}>I</th>
            <th style={columnHeaderStyle}></th>
            <th style={columnHeaderStyle}>II</th>
            <th style={columnHeaderStyle}></th>
            <th style={columnHeaderStyle}>III</th>
            <th style={columnHeaderStyle}></th>
            <th style={columnHeaderStyle}>IV</th>
            <th style={columnHeaderStyle}></th>
            <th style={columnHeaderStyle}>V</th>
            <th style={columnHeaderStyle}></th>
            <th style={columnHeaderStyle}>VI</th>
            <th style={columnHeaderStyle}></th>
          </tr>
          <tr>
            <th style={columnHeaderStyle}>S.No</th>
            <th style={columnHeaderStyle}>Date/Result</th>
            <th style={columnHeaderStyle}>Treatment start date</th>
            <th style={columnHeaderStyle}>Date/Result</th>
            <th style={columnHeaderStyle}>Treatment start date</th>
            <th style={columnHeaderStyle}>Date/Result</th>
            <th style={columnHeaderStyle}>Treatment start date</th>
            <th style={columnHeaderStyle}>Date/Result</th>
            <th style={columnHeaderStyle}>Treatment start date</th>
            <th style={columnHeaderStyle}>Date/Result</th>
            <th style={columnHeaderStyle}>Treatment start date</th>
            <th style={columnHeaderStyle}>Date/Result</th>
            <th style={columnHeaderStyle}>Treatment start date</th>
          </tr>
        </thead>
        <tbody>
          {reportData?.reportTableData.map((data:any,index:any) => (
            <tr key={index}>
              <td style={columnDataStyle}>{index+1}</td>
              <td style={columnDataStyle}>{data.result1}</td>
              <td style={columnDataStyle}>{data.TreatmentDate1}</td>
              <td style={columnDataStyle}>{data.result2}</td>
              <td style={columnDataStyle}>{data.TreatmentDate2}</td>
              <td style={columnDataStyle}>{data.result3}</td>
              <td style={columnDataStyle}>{data.TreatmentDate3}</td>
              <td style={columnDataStyle}>{data.result4}</td>
              <td style={columnDataStyle}>{data.TreatmentDate4}</td>
              <td style={columnDataStyle}>{data.result5}</td>
              <td style={columnDataStyle}>{data.TreatmentDate5}</td>
              <td style={columnDataStyle}>{data.result6}</td>
              <td style={columnDataStyle}>{data.TreatmentDate6}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>

  );
};

export default Table;
