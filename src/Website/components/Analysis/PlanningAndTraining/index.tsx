import React, { useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TabPanel from '../../TabPanel';
import DescriptionIcon from '@material-ui/icons/Description';
import DrugAdminSupervisorAvaliability from './DrugAdminSupervisorAvaliability';
import ExpenditureBalanceReceivedFunds from './ExpenditureBalanceReceivedFunds';
import FSUPercentageTargetCompleted from './FSUPercentageTargetCompleted';
import PhcHrAndTrainingStatus from './PhcHrAndTrainingStatus';
import PlanningForOT from './PlanningForOT';
import VspMonthlyVacancyStatus from './VspMonthlyVacancyStatus';
import VspTrainingStatus from './VspTrainingStatus';

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    width: '320px',
    height: 'auto',
    borderRadius: '10px',
  },
  iconbutton: {
    float: 'right',
    display: 'inline-block',
  },
  label: {
    color: '#00AEE6',
  },
  indicator: {
    backgroundColor: 'white',
  },
}));

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}
const theme = createTheme({
  overrides: {
    MuiTab: {
      root: {
        '&.Mui-selected': {
          color: 'black',
          backgroundColor:'white',
          borderRadius:'10px',
        },
      },
    },
  },
});

const PlanningAndTrainingReports = (props: any) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <div className='tabstyle'>
          <Tabs
            value={value}
            onChange={handleChange}
            variant='scrollable'
            scrollButtons='on'
            classes={{ indicator: classes.indicator }}>
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} /> Drug
                  Admin/Supervisor Avaliability
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Expenditure Balance Received Funds
                </span>
              }
              {...a11yProps(1)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Percentage Of Target Completed
                </span>
              }
              wrapped
              {...a11yProps(2)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  HR And Training Status PHC Wise
                </span>
              }
              wrapped
              {...a11yProps(3)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Planning For OT
                </span>
              }
              wrapped
              {...a11yProps(4)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Vertical Unit Monthly Vacancy Status
                </span>
              }
              wrapped
              {...a11yProps(5)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Vertical Unit Training Status
                </span>
              }
              wrapped
              {...a11yProps(6)}
            />
          </Tabs>
        </div>
        <div>
          <TabPanel value={value} index={0}>
            <DrugAdminSupervisorAvaliability />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ExpenditureBalanceReceivedFunds />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <FSUPercentageTargetCompleted />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <PhcHrAndTrainingStatus />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <PlanningForOT />
          </TabPanel>
          <TabPanel value={value} index={5}>
            <VspMonthlyVacancyStatus />
          </TabPanel>
          <TabPanel value={value} index={6}>
            <VspTrainingStatus />
          </TabPanel>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default PlanningAndTrainingReports;
