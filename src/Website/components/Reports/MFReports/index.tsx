import React, { useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TabPanel from '../../TabPanel';
import DescriptionIcon from '@material-ui/icons/Description';
import BaselineMFSurvey from './Base_line_Survey/Base_line_Survey';
import Additional_MF_Survey_Report from './Additional_MF_Survey_Report';

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

const MFReports = (props: any) => {
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
            classes={{
              indicator: classes.indicator,
            }}>
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Additional MF Survey
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Base line MF Survey
                </span>
              }
              wrapped
              {...a11yProps(1)}
            />
          </Tabs>
        </div>
        <div>
          {' '}
          <TabPanel value={value} index={0}>
            <Additional_MF_Survey_Report />{' '}
          </TabPanel>
          <TabPanel value={value} index={1}>
            <BaselineMFSurvey />{' '}
          </TabPanel>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MFReports;
