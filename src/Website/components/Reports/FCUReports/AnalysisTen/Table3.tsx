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

            <th style={columnHeaderStyle}>
            </th>
            <th style={columnHeaderStyle} colSpan={8}>
              Followup B.S. Date & Result
            </th>
            <th style={columnHeaderStyle} rowSpan={2}>
              Name of Drug Administrator
            </th>
            <th style={columnHeaderStyle} rowSpan={2}>
              Designation
            </th>
            <th style={columnHeaderStyle} rowSpan={2}>
              Phone No
            </th>
          </tr>
          <tr style={columnHeaderStyle}>
          <th style={columnHeaderStyle}></th>
            <th style={columnHeaderStyle} colSpan={2}>
              VII
            </th>
            <th style={columnHeaderStyle} colSpan={2}>
              VIII
            </th>
            <th style={columnHeaderStyle} colSpan={2}>
              IX
            </th>
            <th style={columnHeaderStyle} colSpan={2}>
              X
            </th>
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
            <th style={columnHeaderStyle}></th>
            <th style={columnHeaderStyle}></th>
            <th style={columnHeaderStyle}></th>
          </tr>
        </thead>
        <tbody>
          {reportData?.reportTableData.map((data:any,index:any) => (
            <tr key={index}>
          <th style={columnDataStyle}>{index+1} </th>
              <td style={columnDataStyle}>{data.result7}</td>
              <td style={columnDataStyle}>{data.TreatmentDate7}</td>
              <td style={columnDataStyle}>{data.result8}</td>
              <td style={columnDataStyle}>{data.TreatmentDate8}</td>
              <td style={columnDataStyle}>{data.result8}</td>
              <td style={columnDataStyle}>{data.TreatmentDate9}</td>
              <td style={columnDataStyle}>{data.result10}</td>
              <td style={columnDataStyle}>{data.TreatmentDate10}</td>
              <td style={columnDataStyle}>{data.nameOfDrugAdmin}</td>
              <td style={columnDataStyle}>{data.designation}</td>
              <td style={columnDataStyle}>{data.phoneNoOfDrugAdmin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </TableContainer>

  );
};

export default Table;
