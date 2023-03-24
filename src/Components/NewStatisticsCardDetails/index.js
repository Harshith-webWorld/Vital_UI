import React from "react";
import {
  Box,
  Typography,
  Card,
  Divider,
  Icon,
  styled,
} from "@material-ui/core";
import StoreIcon from "@material-ui/icons/Store";

const StatsTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Poppins",
  fontStyle: "normal",
  fontWeight: "600",
  fontSize: "15px",
  lineHeight: "22px",
  color: "#495057",

  "@media (max-width: 1640px)": {
    fontSize: "15px",
  },
}));

const StatsCard = styled(Typography)(({ theme }) => ({
  padding: "20px 20px",
  background: "#FFFFFF",
  boxShadow: "0px 10px 20px rgba(18, 38, 63, 0.0313726)",
  borderRadius: "3.25px",
  position: "relative",

  "@media (max-width: 1640px)": {
    padding: "10px",
  },
}));

function NewStatisticsCardDetails({ title, icon, iconBackgroundColor, count }) {
  return (
    <StatsCard>
      <Icon
        fontSize="medium"
        style={{
          background: iconBackgroundColor,
          // padding: "3px 11px",
          borderRadius: "50%",
          position: "absolute",
          top: "13px",
          right: "15px",
          width: "48.14px",
          height: "48px",
          color: "white",
        }}
      >
        {icon}
      </Icon>
      <StatsTitle>{title}</StatsTitle>

      {/* {icon} */}
      {/* <StoreIcon /> */}
      {/* <Typography fontWeight="bold" variant="h5" style={{ top: "50%" }}> */}
      <div style={{ marginTop: "30px", paddingLeft: '4px' }}>{count}</div>
      {/* </Typography> */}
    </StatsCard>
  );
}

export default NewStatisticsCardDetails;
