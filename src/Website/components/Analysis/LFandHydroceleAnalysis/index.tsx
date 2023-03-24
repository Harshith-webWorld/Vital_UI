import React from 'react';
import DiseaseCases from './DiseaseCases';
import HydroceleOPList from './HydroceleOperationlinelist';
import PendingHydroceleCases from './PendingHydroceleCases';
import GradingOfLFPatients from './GradingOfLFPatients';
import PerformanceOfInstitutes from './PerformanceOfInstitutes';
import PerformanceOfSurgeons from './PerformanceOfSurgeons';
import MMDPActivityReporting from './MMDPActivityReport';
import VerifiedByMO from './VerifiedByMO';
import FollowUpServicesLFPatients from './FollowUpServicesLFPatients';
import FollowUpServicesHFPatients from './FollowUpServicesHFPatients';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
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

const LFandHydroceleAnalysis = (props: any) => {
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
            }}
          >
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Disease cases
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Hydrocele operation line list
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Pending hydrocele cases
                </span>
              }
              wrapped
              {...a11yProps(2)}
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Grading Of LF Patients
                </span>
              }
              wrapped
              {...a11yProps(3)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Performance Of Institutes
                </span>
              }
              wrapped
              {...a11yProps(4)}
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Performance Of Surgeons
                </span>
              }
              wrapped
              {...a11yProps(5)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  MMDP Activity Reporting
                </span>
              }
              wrapped
              {...a11yProps(6)}
            />{' '}
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Verified by MO
                </span>
              }
              wrapped
              {...a11yProps(7)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Follow up services LF Patients
                </span>
              }
              wrapped
              {...a11yProps(8)}
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Follow Up services HYD Patients
                </span>
              }
              wrapped
              {...a11yProps(9)}
            />
          </Tabs>
        </div>
        <div>
          <TabPanel value={value} index={0}>
            <DiseaseCases />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <HydroceleOPList />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <PendingHydroceleCases />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <GradingOfLFPatients />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <PerformanceOfInstitutes />
          </TabPanel>
          <TabPanel value={value} index={5}>
            <PerformanceOfSurgeons />
          </TabPanel>
          <TabPanel value={value} index={6}>
            <MMDPActivityReporting />
          </TabPanel>
          <TabPanel value={value} index={7}>
            <VerifiedByMO />
          </TabPanel>
          <TabPanel value={value} index={8}>
            <FollowUpServicesLFPatients />
          </TabPanel>
          <TabPanel value={value} index={9}>
            <FollowUpServicesHFPatients />
          </TabPanel>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default LFandHydroceleAnalysis;
