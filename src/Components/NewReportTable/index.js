import React from "react";
import {
  Box,
  Typography,
  styled,
  TableContainer,
  TablePagination as Paging,
  withStyles,
} from "@material-ui/core";
import "./styles.css";

const MDBox = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  alignSelf: "center",
}));

const MDTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: "600",
  fontSize: "15px",
  lineHeight: "28px",
  color: "#495057",
}));

function NewReportTable({ title, rightTitle, tableHead, tableData }) {
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
    <div style={{ padding: "20px" }}>
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
      <MDBox>
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
      </MDBox>
      <div>
        <TableContainer>
          <table style={{ width: "100%" }}>
            <thead>
              <tr>
                {tableHead.map(({item}, index) => (
                  <td
                    key={index}
                    style={{
                      fontFamily: "Poppins",
                      fontStyle: "normal",
                      fontWeight: "600",
                      fontSize: "13px",
                      lineHeight: "24px",
                      color: "#000000",
                      height: '35px'

                    }}
                  >
                    {/* {item === "TAS 1 Outcome" ||
                      item === "TAS 2 Outcome" ||
                      item === "TAS 3 Outcome"
                      ? "Outcome"
                      : item} */}
                      {item}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <tr key={index}>
                    {tableHead.map(({head}, i) => (
                      <td
                        key={i}
                        style={{
                          fontFamily: "Poppins",
                          fontStyle: "normal",
                          fontWeight: i === 0 ? "600" : "500",
                          fontSize: "13px",
                          lineHeight: "24px",
                          height: '35px',
                          color:
                            i === 0
                              ? "rgb(47, 121, 234)"
                              : typeof item[head] !== "string" ? "#2F79EA"
                              : item[head]?.slice(0, 4).toUpperCase() === "PASS"
                                ? "#34C38F"
                                : item[head]?.slice(0, 4).toUpperCase() === "FAIL"
                                  ? "#F46A6A"
                                  : "#495057",
                        }}
                      >
                        {item[head]}
                      </td>
                    ))}
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Paging

            rowsPerPageOptions={[10, 25, 50, 100]}
            count={tableData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            style={{
              border: "none",
              overflow: "hidden",
              fontFamily: 'Poppins',
              fontStyle: "normal",
              fontSize: "12px",
              lineHeight: "24px",
            }}
          />
        </div>
      </div>
    </div >
  );
}

export default NewReportTable;
