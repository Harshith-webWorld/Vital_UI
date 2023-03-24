import React, { useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TabPanel from '../../TabPanel';
import DescriptionIcon from '@material-ui/icons/Description';
import MonthlyStockPositionReport from './MonthlyStockPositionReport';

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

const VerticalStockAnalysis = (props: any) => {
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
                  Monthly Stock Position Report (Equipments, Medicine, and
                  Larvicide)
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
          </Tabs>
        </div>
        <div>
          <TabPanel value={value} index={0}>
            <MonthlyStockPositionReport />
          </TabPanel>
          {/* 
          <TabPanel value={value} index={1}>
            <TASReport2 />{' '}
          </TabPanel> */}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default VerticalStockAnalysis;
