

import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, styled } from "@material-ui/core";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import dashboardService from '../../helpers/services/dashboardService';
import TimelineItem from '../TimelineItem';

const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const d = new Date();
let current_month = month[d.getMonth()];
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

function DrugConsumption() {
  const [data, setdata] = useState([])
  async function getDashboardDrugConsumption() {
    const response = await dashboardService.DashboardDrugConsumption();
    if (response && response.data) {
      let res = response.data.map((item) => {
        if (item.percentDrugConsumption !== null && item.monthName !== null) {
          return {
            month: item.monthName, value: item.percentDrugConsumption
          }
        }
      })
      setdata(res)
    }
  }
  useEffect(() => {
    getDashboardDrugConsumption()
  }, [])
  return (
    <MDCard >
      <Box pt={3} px={3}>
        <MDTitle variant="h6" fontWeight="medium">Drug Consumption</MDTitle>
      </Box>
      <Box p={2}>
        {data?.length > 0 ? data.map((item, i) => {
          if (i !== 5) return <TimelineItem key={`key+${i}`}
            lastItem={data.length === i ? true : false}
            icon={50 <= item.value && item.value <= 70 ? <FiberManualRecordIcon style={{ color: 'orange' }} /> : item.value > 70 ? <FiberManualRecordIcon style={{ color: 'green' }} /> : <FiberManualRecordIcon style={{ color: 'red' }} />}
            title={`${item.value}% ${current_month === item.month ? 'in this month' : `in ${item.month}`}`}
          />
        }) : <p>There are no records to display</p>} </Box>
    </MDCard>
  );
}

export default DrugConsumption;
