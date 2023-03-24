import React, { useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TabPanel from '../../TabPanel';
import DescriptionIcon from '@material-ui/icons/Description';

import FSUReport from './FSUReport';
import FCUReport from './FCUReport';
import NCReport from './NCReport';
import RCOReport from './RCOReport';
import YearwiseReport from './YearwiseReport';
import InventoryReport from './InventoryReport';
import EntomologicalReport from './EntomologicalReport';
import HydroceleOpsReport from './HydroceleOpsReport';
// import BaselineEntomoligicalReport from './BaselineEntomoligicalReport';
// import LarvalDensityReport from './LarvalDensityReport';
// import LarvicidalReport1 from './LarvicidalReport1';
// import NFCUReportEntomology1 from './NFCUReportEntomology1';
// import NFCUMosquitoDisectionReport2 from './NFCUMosquitoDisectionReport2';

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

const MISMTRReports = (props: any) => {
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
            classes={{
              indicator: classes.indicator,
            }}>
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  PERFORMANCE OF FILARIA SURVEY UNIT
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  PERFORMANCE OF FILARIA CONTROL UNIT
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  PERFORMANCE OF FILARIA NIGHT CLINICS
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  PERFORMANCE OF NFSU, NFCU AND NC UNITS
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  YEARWISE DATA
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  INVENTORY DATA
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  ENTOMOLOGICAL DATA
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  HYDROCELE OPERATIONS CARRIED OUT
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />{' '}
            {/* <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Base Line Entomoligical Report
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Monthly Larval Density Report
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Larvicidal Treatment
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Monthly Mosquito Disection Report
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Monthly Mosquito Collection Report
                </span>
              }
              {...a11yProps(0)}
              wrapped
            /> */}
          </Tabs>
        </div>
        <div>
          <TabPanel value={value} index={0}>
            {' '}
            <FSUReport />{' '}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {' '}
            <FCUReport />{' '}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {' '}
            <NCReport />{' '}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {' '}
            <RCOReport />{' '}
          </TabPanel>
          <TabPanel value={value} index={4}>
            {' '}
            <YearwiseReport />{' '}
          </TabPanel>
          <TabPanel value={value} index={5}>
            {' '}
            <InventoryReport />{' '}
          </TabPanel>
          <TabPanel value={value} index={6}>
            {' '}
            <EntomologicalReport />{' '}
          </TabPanel>
          <TabPanel value={value} index={7}>
            {' '}
            <HydroceleOpsReport />{' '}
          </TabPanel>
          {/* 
          <TabPanel value={value} index={2}>
            {' '}
            <LarvalDensityReport />{' '}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {' '}
            <LarvicidalReport1 />{' '}
          </TabPanel>
          <TabPanel value={value} index={4}>
            {' '}
            <NFCUMosquitoDisectionReport2 />{' '}
          </TabPanel>
          <TabPanel value={value} index={5}>
            {' '}
            <NFCUReportEntomology1 />{' '}
          </TabPanel> */}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MISMTRReports;
