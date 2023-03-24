import React, { useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TabPanel from '../../TabPanel';
import DescriptionIcon from '@material-ui/icons/Description';

import CoordinationCommitteReport from './CoordinationcommitteReport';
import CoverageReport1 from './CoverageReport1';
import DrugRequirementMDA from './DrugRequirementMDA';
import DrugRequirementMDA2 from './DrugRequirementMDA2';
import InfrastructureAndTraining from './InfrastructureandTraining';
import MDATrainingStatus1 from './MDATrainingstatus1';
import PostMDAEvaluation1 from './PostMDAevaluation1';
import PostMDAEvaluation2 from './PostMDAevaluation2';
import SAEReport from './SAEReport';
import ProposalforwithdrawalofMDA from './ProposalforwithdrawalofMDA';

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

const MDAReports = (props: any) => {
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
            classes={{ indicator: classes.indicator }}
          >
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  District co-ordination Committe (DCC){' '}
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Mass Drug Administration ( MDA/IDA) Coverage
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Drug Requirements{' '}
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Statement of Funds Allotted and Utilized
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Health Infrastructures
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Training of Health Staff for ELF
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Post MDA evaluation - Format - 2
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Post MDA evaluation - Format - 3
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Proposal for withdrawal of MDA
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Serious Adverse Experiences (SAE)
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />
          </Tabs>
        </div>
        <div>
          <TabPanel value={value} index={0}>
            <CoordinationCommitteReport />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CoverageReport1 />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <DrugRequirementMDA />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <DrugRequirementMDA2 />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <InfrastructureAndTraining />
          </TabPanel>
          <TabPanel value={value} index={5}>
            <MDATrainingStatus1 />{' '}
          </TabPanel>
          <TabPanel value={value} index={6}>
            <PostMDAEvaluation1 />{' '}
          </TabPanel>
          <TabPanel value={value} index={7}>
            <PostMDAEvaluation2 />{' '}
          </TabPanel>
          <TabPanel value={value} index={8}>
            <ProposalforwithdrawalofMDA />
          </TabPanel>
          <TabPanel value={value} index={9}>
            <SAEReport />
          </TabPanel>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MDAReports;
