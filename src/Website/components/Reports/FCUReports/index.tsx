import React, { useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TabPanel from '../../TabPanel';
import DescriptionIcon from '@material-ui/icons/Description';
import AnalysisOne from './AnalysisOne';
import AnalysisTwo from './AnalysisTwo';
import AnalysisFour from './AnalysisFour';
import AnalysisFive from './AnalysisFive';
import AnalysisSix from './AnalysisSix';
import AnalysisSeven from './AnalysisSeven';
import AnalysisEight from './AnalysisEight';
import AnalysisTen from './AnalysisTen';

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

const FCUReports = (props: any) => {
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
                  Monthly and Progressive of B.S. Collection and MF +Ve{' '}
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
                  Monthly and Progressive of B.S. Collection and MF +Ve
                </span>
              }
              {...a11yProps(1)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Random Collection Survey Report
                </span>
              }
              wrapped
              {...a11yProps(2)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Monthly & Progressive MF +Ve Treatment
                </span>
              }
              wrapped
              {...a11yProps(3)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Monthly Assesment Report for B.S. Examination & MF Rate
                </span>
              }
              wrapped
              {...a11yProps(4)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Monthly Backlog Position Report{' '}
                </span>
              }
              wrapped
              {...a11yProps(5)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Monthly Comparative Statement Report
                </span>
              }
              wrapped
              {...a11yProps(6)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Monthly Radical Treatment & Followup of MF +Ve Patients
                </span>
              }
              wrapped
              {...a11yProps(7)}
            />
          </Tabs>
        </div>
        <div>
          <TabPanel value={value} index={0}>
            {' '}
            <AnalysisOne />{' '}
          </TabPanel>
          <TabPanel value={value} index={1}>
            {' '}
            <AnalysisTwo />{' '}
          </TabPanel>
          <TabPanel value={value} index={2}>
            {' '}
            <AnalysisFour />{' '}
          </TabPanel>
          <TabPanel value={value} index={3}>
            {' '}
            <AnalysisFive />{' '}
          </TabPanel>
          <TabPanel value={value} index={4}>
            {' '}
            <AnalysisSix />{' '}
          </TabPanel>
          <TabPanel value={value} index={5}>
            {' '}
            <AnalysisSeven />{' '}
          </TabPanel>
          <TabPanel value={value} index={6}>
            {' '}
            <AnalysisEight />{' '}
          </TabPanel>
          <TabPanel value={value} index={7}>
            {' '}
            <AnalysisTen />{' '}
          </TabPanel>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default FCUReports;
