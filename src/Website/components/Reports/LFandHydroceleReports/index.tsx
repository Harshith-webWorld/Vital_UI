import React, { useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import Analysis1 from './Analysis1';
import Analysis2 from './Analysis2';
import Analysis3 from './Analysis3';
import HydrocelectomyOperations from './HydrocelectomyOperations';
import MMDPKitsGivenReport from './MMDPKitsGivenReport';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TabPanel from '../../TabPanel';
import DescriptionIcon from '@material-ui/icons/Description';

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
    color: 'white',
  },
  indicator: {
    color:'white',
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

const LFandHydroceleReports = (props: any) => {
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
                  Linelisting Of Lymphedema cases & MMDP Reportss{' '}
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Planning of Hydrocele Operations
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Consolidated district report on Lymphedema morbidity
                  Management and Hydrocele cases
                </span>
              }
              wrapped
              {...a11yProps(2)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Hydrocelectomy Operations Reports
                </span>
              }
              wrapped
              {...a11yProps(3)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  MMDP Kits Distributed
                </span>
              }
              wrapped
              {...a11yProps(4)}
            />
          </Tabs>
        </div>
        <div>
          {' '}
          <TabPanel value={value} index={0}>
            <Analysis1 />{' '}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Analysis2 />{' '}
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Analysis3 />{' '}
          </TabPanel>
          <TabPanel value={value} index={3}>
            <HydrocelectomyOperations />{' '}
          </TabPanel>
          <TabPanel value={value} index={4}>
            <MMDPKitsGivenReport />{' '}
          </TabPanel>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LFandHydroceleReports;
