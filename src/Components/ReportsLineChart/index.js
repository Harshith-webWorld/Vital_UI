

import { useMemo, useState } from "react";
import configs from "./configs";
import { Card, Box, Divider, Typography, Icon, Tooltip, styled, MenuItem, Menu } from "@material-ui/core";
import ScheduleIcon from '@material-ui/icons/Schedule';
import { Line } from "react-chartjs-2";
import OpenWithIcon from '@material-ui/icons/Launch';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import history from "../../helpers/history";

const MDCard = styled(Card)(({ theme }) => ({
  borderRadius: '10px',
  boxShadow: '0rem 0.25rem 0.375rem -0.0625rem rgb(0 0 0 / 10%), 0rem 0.125rem 0.25rem -0.0625rem rgb(0 0 0 / 6%)',
  overflow: 'visible', height: '100%'
}));
const MDTitle = styled(Typography)(({ theme }) => ({
  margin: 0,
  fontSize: '1rem',
  lineheight: ' 1.625',
  color: '#344767',
  fontWeight: 700,
  letterSpacing: '0.0075em',
  opacity: 1,
  textTransform: 'capitalize',
  verticalalign: 'unset',
}));
const MDDes = styled(Typography)(({ theme }) => ({
  margin: 0,
  fontSize: '0.875rem',
  fontWeight: 300,
  lineheight: 1.5,
  letterSpacing: '0.02857em',
  opacity: 1,
  textTransform: 'none',
  verticalalign: 'unset',
  textDecoration: 'none',
  color: '#7b809a'
}));
const MDDate = styled(Typography)(({ theme }) => ({
  margin: 0,
  fontSize: '0.875rem',
  fontWeight: 300,
  lineheight: 1.5,
  letterSpacing: '0.02857em',
  opacity: 1,
  textTnsform: 'none',
  verticalalign: 'unset',
  textDecoration: 'none',
  color: '#7b809a',
}));
const MDBox = styled(Box)(({ theme }) => ({
  paddingTop: '16px',
  paddingBottom: '16px',
  paddingRight: '4px',
  marginTop: '-40px',
  height: '12.5rem',
  opacity: 1,
  color: '#344767',
  borderRadius: '0.5rem',
  boxShadow: '0rem 0.25rem 1.25rem 0rem rgb(0 0 0 / 14%), 0rem 0.4375rem 0.625rem -0.3125rem rgb(0 187 212 / 40%)',
}));


function ReportsBarChart({ color, title, description, date, chart, path, customstyle }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {});
  const [menu, setMenu] = useState(null);
  const openMenu = ({ currentTarget }) => setMenu(currentTarget);
  const closeMenu = () => setMenu(null);
  const renderMenu = (
    <Menu
      id="simple-menu"
      anchorEl={menu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "left",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(menu)}
      onClose={closeMenu}
    >
      <MenuItem onClick={() => {
        history.push(path);
        closeMenu()
      }}>View More</MenuItem>
    </Menu>
  );
  return (
    <MDCard  >
      <Box padding="1rem" style={customstyle}>
        {useMemo(
          () => (
            <Box>
              <Box style={{ float: 'right', paddingRight: '1rem' }}></Box>
              <MDBox style={{ background: color, }}>
                <Line data={data} options={options} />
              </MDBox>
            </Box>
          ),
          [chart, color]
        )}
        <Box pt={3} pb={1} px={1}>
          <MDTitle>{title}</MDTitle>
          <MDDes component="div" variant="h5" fontWeight="light">  {description}</MDDes>
          <Divider style={{ margin: '1rem' }} />
          <Box style={{ display: 'flex', justifyContent: "space-between" }}>
            <Box style={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h5" lineheight={1} >
                <Icon><ScheduleIcon style={{ color: '#7b809a', fontSize: 'inherit', width: '1rem', height: '1rem' }} /></Icon>
              </Typography>
              <MDDate variant="h5" fontWeight="light">{date}</MDDate>
            </Box>
            <Box onClick={openMenu}>
              <Tooltip title="View more" placement="right-start">
                <Icon style={{ cursor: "pointer", fontWeight: "bold" }} fontSize="small" ><MoreVertIcon /></Icon>
              </Tooltip>
            </Box>
            {renderMenu}
          </Box>
        </Box>
      </Box>
    </MDCard >
  );
}


export default ReportsBarChart;
