import React, { useState } from 'react';
import { makeStyles, Tab, Tabs } from '@material-ui/core';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import TabPanel from '../../TabPanel';
import DescriptionIcon from '@material-ui/icons/Description';
import DrugStockAtPHC from './DrugStockAtPHC';
import PhcWiseDrugConsumption from './PhcWiseDrugConsumption';
import VspAvailabiltyConsumptionLabMaterials from './VspAvailabilityConsumptionLabMaterials';

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

const DrugStockAndConsumption = (props: any) => {
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
                  Stock PHC Wise
                </span>
              }
              {...a11yProps(0)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Drug Consumption PHC Wise
                </span>
              }
              {...a11yProps(1)}
              wrapped
            />
            <Tab
              label={
                <span>
                  <DescriptionIcon style={{ display: 'inline-block' }} />
                  Vertical Unit Availability Consumption Lab Materials
                </span>
              }
              {...a11yProps(2)}
              wrapped
            />
          </Tabs>
        </div>
        <div>
          <TabPanel value={value} index={0}>
            <DrugStockAtPHC />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <PhcWiseDrugConsumption />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <VspAvailabiltyConsumptionLabMaterials />
          </TabPanel>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default DrugStockAndConsumption;
