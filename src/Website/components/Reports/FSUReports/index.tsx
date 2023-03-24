import React, { useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TabPanel from '../../TabPanel';
import DescriptionIcon from '@material-ui/icons/Description';
import FSUAnalysis1 from './FSUAnalysis1';
import FSUAnalysis2 from './FSUAnalysis2';
import FSUAnalysis3 from './FSUAnalysis3';
import FSUAnalysis4 from './FSUAnalysis4';
import FSUAnalysis5 from './FSUAnalysis5';

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

const FSUReports = (props: any) => {
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
                  {' '}
                  <DescriptionIcon style={{ display: 'inline-block' }} />{' '}
                  Monthly Villagewise B.S. Collection and +Ve Cases{' '}
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              label={
                <span>
                  {' '}
                  <DescriptionIcon style={{ display: 'inline-block' }} />{' '}
                  Monthly Sexwise B.S. Collection and +Ve Cases{' '}
                </span>
              }
              {...a11yProps(1)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Monthly Abstract Report
                </span>
              }
              wrapped
              {...a11yProps(2)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Monthly Agewise & Sexwise Report
                </span>
              }
              wrapped
              {...a11yProps(3)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Line List of MF Positive Patients
                </span>
              }
              wrapped
              {...a11yProps(4)}
            />
          </Tabs>
        </div>
        <div>
          <TabPanel value={value} index={0}>
            <FSUAnalysis1 />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <FSUAnalysis2 />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <FSUAnalysis3 />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <FSUAnalysis4 />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <FSUAnalysis5 />
          </TabPanel>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default FSUReports;
