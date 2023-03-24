

import { Card, Menu, MenuItem, Box, Typography, Icon, styled } from "@material-ui/core";
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import dashboardService from "../../helpers/services/dashboardService";

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

function FSUTargets() {
  const [tablelist, settablelist] = useState([])
  const [columns] = useState([
    {
      name: "Sr.No",
      selector: "nameOfUnitId",
    },
    {
      name: "Name of unit",
      selector: "nameOfUnit",
      width: '150px',
      minWidth: '150px',
    },
    {
      name: "Population Targeted",
      selector: "targetedPopulation",
    },
    {
      name: "Population Surveyed",
      selector: "surveyedPopulation",
    },
    {
      name: "No.of BS collected",
      selector: "noOfBSCollected",
    },
    {
      name: "No.of BS examined",
      selector: "noOfBSExamined",
    },
    {
      name: "M.F +ve cases",
      selector: "noOfMFPositiveCases",
    },
  ])

  async function getFSUTargets() {
    const response = await dashboardService.DashboardFSUTargets();
    if (response && response.data && response.data.length > 0) {
      settablelist(response.data)
    }
  }
  useEffect(() => {
    getFSUTargets()
  }, [])
  return (
    <MDCard>
      <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} p={2}>
        <Box>
          <MDTitle variant="h6" gutterBottom>FSU Targets</MDTitle>
        </Box>
      </Box>
      <Box style={{ margin: '0px 10px 10px 10px' }}>
        <div className='dash-table'>
          <DataTable columns={columns} data={tablelist} highlightOnHover /></div>
      </Box>
    </MDCard>
  );
}

export default FSUTargets;
