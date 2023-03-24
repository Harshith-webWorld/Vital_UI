import {
  Grid,
  Box,
  styled,
  Card,
  Typography,
  FormControl,
  Select,
  InputLabel,
  InputBase,
  MenuItem,
  SvgIcon,
  SwipeableDrawer,
} from '@material-ui/core';
import { useSelector } from 'react-redux';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect, useCallback } from 'react';
import PeopleIcon from '@material-ui/icons/People';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import StoreIcon from '@material-ui/icons/Store';
import NotificationsIcon from '@material-ui/icons/Notifications';
import BarChartIcon from '@material-ui/icons/BarChart';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import dashboardService from '../../helpers/services/dashboardService';
import GraphService from '../../helpers/services/website-barchart.service';

import {
  current_year,
  endMonthList,
  monthList,
  NoneList,
  previous_month,
  current_month,
  yearList,
} from '../constant';
import MapService from '../../helpers/services/MapService';
import NewStatisticsCardDetails from '../NewStatisticsCardDetails';
import NewEndemicityData from '../NewEndemicityData';
import NewReportGraph from '../NewReportGarph';
import NewReportLineGraph from '../NewReportGarph/NewReportLineGraph';
import { coverageData } from '../NewReportGarph/MockData';
import NewReportTable from '../NewReportTable';
import FSUFCUTable from '../NewReportTable/FSUFCUTable';
import { MDA_TAS_Data, FCU_Data, FSU_Data } from '../NewReportTable/MockData';
import MdaTasData from '../MdaTasData';
import districtService from '../../helpers/services/districtService';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import HydroceleCases from '../img/HydroceleCases.svg';
import LymphedemaCases from '../img/LymphedemaCases.svg';
import MFPositiveCases from '../img/MFPositiveCases.png';
import HydroceleImg from '../img/hydrocele.png';
import LymphImg from '../img/lymph.png';
import Alerts from '../img/Alerts.svg';
import history from '../../helpers/history';
import MFRatesTable from './DetailsTable/MFRatesTable';

const MDBox = styled(Box)(({ theme }) => ({
  borderRadius: 3,
  overflow: 'visible',
  marginBottom: '5px',
  opacity: 1,
  background: 'transparent',
  color: '#344767',
}));
const MDP = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins !important',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '13px',
  lineHeight: '20px',
  color: '#74788D',

  display: 'flex',
  alignContent: 'flex-end',
  alignItems: 'center',
  height: '29px',

  '@media (max-width: 1640px)': {
    fontSize: '10px',
  },
}));

const MDCount = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins !important',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '19.5px',
  lineHeight: '29px',
  color: '#495057',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '7px',

  '@media (max-width: 1640px)': {
    fontSize: '14px',
  },
}));

const MDCountPointer = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins !important',
  fontStyle: 'normal',
  fontWeight: '500',
  fontSize: '19.5px',
  lineHeight: '29px',
  color: '#495057',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingLeft: '7px',
  cursor: 'pointer',

  '@media (max-width: 1640px)': {
    fontSize: '14px',
  },
}));

const MDCountBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingRight: '80px',
}));

const MDTitle = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins !important',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '15px',
  lineHeight: '22px',
  color: '#495057',
  '@media (max-width: 1640px)': {
    width: '300px',
  },
}));

const MDTitleContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const CustomParagarph = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins !important',
  fontStyle: 'normal',
  fontWeight: '600',
  fontSize: '11px',
  lineHeight: '16px',
  color: '#74788D',
  paddingLeft: '7px',
  '@media (max-width: 1640px)': {
    fontSize: '10px',
  },
}));

const CustomSelectField = styled(Select)(({ theme }) => ({
  border: 'none',
  outline: 'none',
  background: '#EFF2F7',
  fontSize: '13px',
  fontFamily: 'poppins',
  fontWeight: '500',
  '&:before': {
    border: 'none',
    outline: 'none',
  },
  '&:after': {
    border: 'none',
    outline: 'none',
  },
  // "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
  //   border: "none",
  //   outline: "none",
  // },
  '&.MuiFilledInput-root:hover': {
    border: 'none',
    outline: 'none',
  },
  '&.MuiFilledInput-underline:hover:before': {
    border: 'none',
    outline: 'none',
  },

  '& .MuiSelect-filled.MuiSelect-filled': {
    paddingTop: '9px',
  },

  '& option': {
    fontWeight: '500',
    fontSize: '13px',
  },
}));

// const onInteractive = () => {
//   history.push('/endemicitymap')
// }

function NewDashboard() {
  const signinInfo = useSelector(
    (state) => state && state.Admin && state.Admin.signin
  );

  const [districtyear, setdistrictyear] = useState(current_year);
  const [districtstartmonth, setdistrictstartmonth] = useState(`1`);
  const [districtendmonth, setdistrictendmonth] = useState(`${previous_month}`);
  const [stagesyear, setstagesyear] = useState(current_year);
  const [stmdatasyear, setstmdatasyear] = useState(current_year);
  const [endemicMapYear, setEndemicMapYear] = useState(current_year);
  const [endemicMapStartMonth, setEndemicMapStartMonth] = useState('1');
  const [endemicMapEndMonth, setEndemicMapEndMonth] = useState(
    `${previous_month}`
  );
  const [mfyear, setmfyear] = useState(current_year);
  const [fcuFsuNcYear, setFcuFsuNcYear] = useState(current_year);
  const [mfRateDistrictId, setMfRateDistrictId] = useState('');
  const [popupTable, setpopupTable] = useState(false);
  const [popupTableColumnConfig, setPopupTableColumnConfig] = useState({});
  const [popupTableData, setpopupTableData] = useState([]);
  const [initialFilterValueEndemicityMap] = useState({
    year: `${current_year}`,
    startMonth: `1`,
    endMonth: `${previous_month}`,
    district: '',
  });
  const [initialFilterValue] = useState({
    districtId: `${
      signinInfo?.data?.districtId ? signinInfo?.data?.districtId : '0'
    }`,
    fromyear: `2005`,
    toyear: `${current_year}`,
    startMonth: `1`,
    endMonth: `${previous_month}`,
  });
  const [filterValuesForLFPopup, setFilterValuesForLFPopup] = useState({
    districtId: '0',
    fromyear: `2005`,
    toyear: `${current_year}`,
    startMonth: `1`,
    endMonth: `${previous_month}`,
  });
  const [mfRateinitialFilterValue] = useState({
    startYear: '2005',
    endYear: `${current_year}`,
    districtId: `${
      signinInfo?.data?.districtId ? signinInfo?.data?.districtId : ''
    }`,
  });
  const [mmdpInitialFilterValue] = useState({
    startYear: '2005',
    endYear: `${current_year}`,
    districtId: `${
      signinInfo?.data?.districtId ? signinInfo?.data?.districtId : ''
    }`,
  });
  const [mdaidaCoverageInitiaFilterValue] = useState({
    startYear: '2005',
    endYear: `${current_year}`,
    districtId: `${
      signinInfo?.data?.districtId ? signinInfo?.data?.districtId : ''
    }`,
  });
  const [mfRateListinitialFilterValue] = useState({
    year: `${current_year}`,
    districtId: '',
  });
  const [todayentry, settodayentry] = useState({
    TodayLF: '0',
    TodayHF: '0',
    TodayMF: '0',
    TodayEntry: '0',
    percentThanYesterday: '0',
  });
  const [bsCollectedToday, setbsCollectedToday] = useState({
    bsCollectedToday: '0',
    percentThanYesterday: '0',
  });
  const [lfThisMonth, setlfThisMonth] = useState({
    CumulativeUntilToday: '200',
    CurrentYear: '40',
    PreviousYear: '50',
    percentThanLastmonth: '0',
  });
  const [alertMsg, setAlertMsg] = useState({
    newAlerts: '0',
    allAlerts: [],
  });
  const [mfPositive12Monthslabels, setmfPositive12Monthslabels] = useState([]);
  const [mfPositive12Monthsdata, setmfPositive12Monthsdata] = useState([]);
  const [lfCases12Monthslabels, setlfCases12Monthslabels] = useState([]);
  const [lfCases12Monthsdata, setlfCases12Monthsdata] = useState([]);
  const [moNotVerifiedlabels, setMONotVerifiedlabels] = useState([]);
  const [moNotVerifieddata, setMONotVerifieddata] = useState([]);
  const [mfRateslabels, setmfRateslabels] = useState([]);
  const [mfRatesdata, setmfRatesdata] = useState([]);
  const [districtEndemicity, setDistrictEndemicity] = useState([]);
  const [geoData, setGeoData] = useState([]);
  const [endemicityMapSelect, setEndemicityMapSelect] = useState('LfCases');
  const [fsuFcuPerfomanceSelect, setFsuFcuPerfomanceSelect] = useState('FSU');
  const [MDA_MMDP_Labels, setMDA_MMDP_Labels] = useState([]);
  const [MMDP_KIT_GraphData, setMMDP_KIT_GraphData] = useState([]);
  const [MMDP_GraphData, setMMDP_GraphData] = useState([]);
  const [statisticsData, setStatisticsData] = useState({});
  const [districtList, setDistrictList] = useState([]);
  const [mfGraphDataarr, setmfGraphDataarr] = useState([]);
  const [mdaIdaCoverageConsumption, setMdaIdaCoverageConsumption] = useState(
    []
  );
  const [mdaTasActivityStatus, setMdaTasActivityStatus] = useState([]);
  const [fsuFcuNcPerformance, setFsuFcuNcPerformance] = useState({
    fsu: [],
    fcu: [],
    nc: [],
  });

  let validSchema = Yup.object().shape({
    fromyear: Yup.string(),
    toyear: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    districtId: Yup.string(),
  });
  const formik = useFormik({
    initialValues: initialFilterValue,
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      get_EndemicityTotalAllDistricts(values);
      setFilterValuesForLFPopup(values);
    },
    onReset: (values) => {
      get_EndemicityTotalAllDistricts(values);
      setFilterValuesForLFPopup(values);
    },
  });

  let mfvalidSchema = Yup.object().shape({
    startYear: Yup.string(),
    endYear: Yup.string(),
    districtId: Yup.string(),
  });
  const mfformik = useFormik({
    initialValues: mfRateinitialFilterValue,
    enableReinitialize: true,
    validationSchema: mfvalidSchema,
    onSubmit: (values) => {
      getDashboardMFRateTimeTrend(values);
    },
  });

  let mmdpValidSchema = Yup.object().shape({
    startYear: Yup.string(),
    endYear: Yup.string(),
    districtId: Yup.string(),
  });
  const mmdpFormik = useFormik({
    initialValues: mmdpInitialFilterValue,
    enableReinitialize: true,
    validationSchema: mmdpValidSchema,
  });

  let mdaIdaValidSchema = Yup.object().shape({
    startYear: Yup.string(),
    endYear: Yup.string(),
    districtId: Yup.string(),
  });
  const mdaIdaFormik = useFormik({
    initialValues: mdaidaCoverageInitiaFilterValue,
    enableReinitialize: true,
    validationSchema: mdaIdaValidSchema,
  });

  let validSchemaEndemicityMap = Yup.object().shape({
    year: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    district: Yup.string(),
  });

  const formikEndemicityMap = useFormik({
    initialValues: initialFilterValueEndemicityMap,
    enableReinitialize: true,
    validationSchema: validSchemaEndemicityMap,
    onSubmit: (values) => {
      getEndemicityMapAllDistricts(values);
    },
  });

  const signinUserId = signinInfo && signinInfo.data && signinInfo.data.id;

  async function getMMDPPercentageGraphDistrictWise(values) {
    const response = await dashboardService.getMMDPGraph(values);
    if (response && response.data && response.data.length > 0) {
      console.log('resp', response.data);
      setMDA_MMDP_Labels(response.data.map((item) => item.name));

      setMMDP_KIT_GraphData(
        response.data.map((item) => item.mmdpKitGivenPercent)
      );
      setMMDP_GraphData(response.data.map((item) => item.mmdpTrainedPercent));
    } else {
      setMDA_MMDP_Labels([]);
      setMMDP_KIT_GraphData([]);
      setMMDP_GraphData([]);
    }
  }

  async function getMdaTasActivityStatus(value) {
    const response = await dashboardService.getMdaTasActivityStatus({
      year: value,
    });
    if (response && response.data) {
      setMdaTasActivityStatus(response.data);
    } else {
      setMdaTasActivityStatus([]);
    }
  }

  async function getFsuFcuNcPerformance(year) {
    const response = await dashboardService.getFsuFcuNcPerformance({ year });
    if (response && response.message === 'Success') {
      setFsuFcuNcPerformance(response.data);
    } else {
      setFsuFcuNcPerformance({
        fsu: [],
        fcu: [],
        nc: [],
      });
    }
  }

  async function getAlertMsgs(userId) {
    const response = await dashboardService.getAlertsForUser({
      userId: String(userId),
    });
    if (response && response.message === 'Success') {
      setAlertMsg({
        newAlerts: response.data.newAlerts[0].newAlerts,
        allAlerts: response.data.allAlerts,
      });
    } else {
      setAlertMsg({
        newAlerts: '0',
        allAlerts: [],
      });
    }
  }

  async function get_EndemicityTotalAllDistricts(values) {
    let reqdata = {
      districtId: values.districtId,
      fromYear: values.fromyear,
      toYear: values.toyear,
      startMonth: values.startMonth,
      endMonth: values.endMonth,
    };
    const response = await dashboardService.get_EndemicityTotalAllDistricts({
      ...reqdata,
    });
    if (response && response.data) {
      let LFCases = {
        cumulative: response.data.cumulative[0].NoOfLFCases,
        previosYear: response.data.previosYear[0].NoOfLFCases,
        selectYear: response.data.selectYear[0].NoOfLFCases,
      };
      let MFPositive = {
        cumulative: response.data.cumulative[0].NoMFPosetive,
        previosYear: response.data.previosYear[0].NoMFPosetive,
        selectYear: response.data.selectYear[0].NoMFPosetive,
      };
      let HydroceleCases = {
        cumulative: response.data.cumulative[0].NoOfHydroceleCases,
        previosYear: response.data.previosYear[0].NoOfHydroceleCases,
        selectYear: response.data.selectYear[0].NoOfHydroceleCases,
      };
      let HydroceleSurgery = {
        cumulative: response.data.cumulative[0].NoOfHydroceleSurgery,
        previosYear: response.data.previosYear[0].NoOfHydroceleSurgery,
        selectYear: response.data.selectYear[0].NoOfHydroceleSurgery,
      };
      //console.log({ LFCases, MFPositive, HydroceleCases, HydroceleSurgery })
      setStatisticsData({
        LFCases,
        MFPositive,
        HydroceleCases,
        HydroceleSurgery,
      });
    }
  }

  async function getAllDistrictList() {
    const response = await districtService.getDistrict();
    if (response && response.data && response.data.length > 0) {
      setDistrictList(response.data);
    }
  }
  async function getDashboardMFRateTimeTrend(values) {
    const response = await dashboardService.DashboardMFRateTimeTrend({
      startYear: values.startYear,
      endYear: values.endYear,
      districtId: values.districtId,
    });
    if (response && response.data && response.data.length > 0) {
      setmfGraphDataarr(
        response.data.map((item) => {
          return {
            Year: item.year,
            'MF Rate %': item.mfRate,
          };
        })
      );
    }
  }

  async function getDASHBOARDGetMFRateTimeTrendList(year) {
    const response = await dashboardService.get_DASHBOARDGetMFRateTimeTrendList(
      {
        year: `${year}`,
        districtId: mfRateDistrictId,
      }
    );
    if (response && response.message === 'Success') {
      setpopupTableData(response.data);
    } else {
      setpopupTableData([]);
    }
    setPopupTableColumnConfig({
      title: 'MF Rate Time Trend',
      headers: 'mfRatesTable',
    });
    setpopupTable(true);
  }

  async function getMdaIdaCoverageConsumption(values) {
    const response = await dashboardService.getMDAIDACoverageAndConsumption({
      startYear: values.startYear,
      endYear: values.endYear,
      districtId: values.districtId,
    });
    if (response && response.data && response.data.length > 0) {
      setMdaIdaCoverageConsumption(response.data);
    }
  }
  function formatLFPopupPayload(tenure) {
    let payload = { ...filterValuesForLFPopup };
    payload.year =
      tenure === 'current' ? payload.toyear : `${+payload.toyear - 1}`;
    delete payload.fromyear;
    delete payload.toyear;
    console.log(payload);
    return payload;
  }
  async function getLymphedemaCasesDistricts(tenure) {
    let payload = formatLFPopupPayload(tenure);
    const response = await dashboardService.getLymphedemaCasesDistricts(
      payload
    );
    if (response && response.message === 'Success') {
      setpopupTableData(response.data);
    } else {
      setpopupTableData([]);
    }
    setPopupTableColumnConfig({
      title: 'Lymphedema Cases',
      headers: 'LFTable',
    });
    setpopupTable(true);
  }

  async function getHydroceleCasesDistricts(tenure) {
    let payload = formatLFPopupPayload(tenure);
    const response = await dashboardService.getHydroceleCasesDistricts(payload);
    if (response && response.message === 'Success') {
      setpopupTableData(response.data);
    } else {
      setpopupTableData([]);
    }
    setPopupTableColumnConfig({ title: 'Hydrocele Cases', headers: 'LFTable' });
    setpopupTable(true);
  }

  async function getHydroceleSurgeriesDistricts(tenure) {
    let payload = formatLFPopupPayload(tenure);
    const response = await dashboardService.getHydroceleSurgeriesDistricts(
      payload
    );
    if (response && response.message === 'Success') {
      setpopupTableData(response.data);
    } else {
      setpopupTableData([]);
    }
    setPopupTableColumnConfig({
      title: 'Hydrocele Surgery Cases',
      headers: 'LFTable',
    });
    setpopupTable(true);
  }

  async function getMFPositiveCasesDistricts(tenure) {
    let payload = formatLFPopupPayload(tenure);
    const response = await dashboardService.getMFPositiveCasesDistricts(
      payload
    );
    if (response && response.message === 'Success') {
      setpopupTableData(response.data);
    } else {
      setpopupTableData([]);
    }
    setPopupTableColumnConfig({
      title: 'MF Positive Cases',
      headers: 'LFTable',
    });
    setpopupTable(true);
  }
  //   function handleMFRatesPopup
  //   (Value) {
  //   setpopupTable(true)
  // }
  const districtIdList =
    districtList &&
    districtList.map((item, i) => {
      return { label: item.districtName, value: item.id };
    });

  const selectDistrictList = [
    { label: 'All Districts', value: '0' },
    ...districtIdList,
  ];

  // async function getTodayEntry() {
  //   const response = await dashboardService.get_DashboardTodayEntry();
  //   if (response && response.data && response.data.length > 0) {
  //     settodayentry({
  //       TodayLF: response.data[0].TodayLF,
  //       TodayHF: response.data[0].TodayHF,
  //       TodayMF: response.data[0].TodayMF,
  //       TodayEntry: response.data[0].TodayEntry,
  //       percentThanYesterday: response.data[0].percentThanYesterday,
  //     });
  //   }
  // }
  // async function getbsCollectedToday() {
  //   const response = await dashboardService.DashboardBSCollectedToday();
  //   if (response && response.data && response.data.length > 0) {
  //     setbsCollectedToday({
  //       bsCollectedToday: response.data[0].bsCollectedToday,
  //       percentThanYesterday: response.data[0].percentThanYesterday,
  //     });
  //   }
  // }
  // async function getDashboardLFThisMonth() {
  //   const response = await dashboardService.DashboardLFThisMonth();
  //   if (response && response.data && response.data.length > 0) {
  //     setlfThisMonth({
  //       lfThisMonth: response.data[0].lfThisMonth,
  //       percentThanLastmonth: response.data[0].percentThanLastmonth,
  //     });
  //   }
  // }
  // async function getDashboardMFPositive12Months() {
  //   const response = await dashboardService.DashboardMFPositive12Months();
  //   console.log(response);
  //   if (response && response.data && response.data.length > 0) {
  //     setmfPositive12Monthslabels([
  //       ...response.data.slice(0, 6).map((item) => {
  //         return item.monthName;
  //       }),
  //     ]);
  //     setmfPositive12Monthsdata([
  //       ...response.data.slice(0, 6).map((item) => {
  //         return item.noMFPositive !== null && item.noMFPositive;
  //       }),
  //     ]);
  //   }
  // }
  // async function getDashboardLFCases12Months() {
  //   const response = await dashboardService.DashboardLFCases12Months();
  //   if (response && response.data && response.data.length > 0) {
  //     setlfCases12Monthslabels([
  //       ...response.data.slice(0, 6).map((item) => {
  //         return item.monthName;
  //       }),
  //     ]);
  //     setlfCases12Monthsdata([
  //       ...response.data.slice(0, 6).map((item) => {
  //         return item.noLFCases !== null && item.noLFCases;
  //       }),
  //     ]);
  //   }
  // }
  // async function getDashboardMONotVerified() {
  //   const response = await dashboardService.DashboardMONotVerified();
  //   if (response && response.data && response.data.length > 0) {
  //     setMONotVerifiedlabels([
  //       ...response.data.slice(0, 6).map((item) => {
  //         return item.districtName !== null && item.districtName;
  //       }),
  //     ]);
  //     setMONotVerifieddata([
  //       ...response.data.slice(0, 6).map((item) => {
  //         return item.noNotVerified !== null && item.noNotVerified;
  //       }),
  //     ]);
  //   }
  // }
  // async function GetMFEndemicityGraphAllDistricts() {
  //   const response = await GraphService.getMFEndemicityGraphAllDistricts({
  //     year: current_year,
  //     month: "",
  //     districtId: "",
  //   });
  //   if (response && response.data) {
  //     setmfRateslabels([
  //       ...response.data.map((item) => {
  //         return item.districtName !== null && item.districtName;
  //       }),
  //     ]);
  //     setmfRatesdata([
  //       ...response.data.map((item) => {
  //         return item.NoMFPosetive !== null && item.NoMFPosetive;
  //       }),
  //     ]);
  //   }
  // }

  const mfGraphLabels = mfGraphDataarr.map((item) => item.Year);

  const mfGraphData = mfGraphDataarr.map((item) =>
    item['MF Rate %'].replace('%', '')
  );
  const coverageGraphLabels = (labelData) => labelData.map((item) => item.name);
  const coverageGraphData = (coverageData) =>
    coverageData.map((item) => item.percentCoverage);
  const consumptionGraphData = (consumptionData) =>
    consumptionData.map((item) => item.percentConsumption);

  // async function getDashboardMFRateTimeTrend(values) {
  //   const response = await dashboardService.DashboardMFRateTimeTrend({
  //     startYear: values.startYear,
  //     endYear: values.endYear,
  //     districtId: values.districtId
  //   });
  //   if (response && response.data && response.data.length > 0) {

  //     setmfGraphDataarr(response.data.map((item) => {
  //       return {
  //         Year: item.year,
  //         "MF Rate %": item.mfRate,

  //       }
  //     }))
  //   }
  // }
  async function getEndemicityMapAllDistricts(values) {
    console.log(values, 'Value');
    const response = await MapService.GetEndemicityMapAllDistricts({
      year: values.year,
      startMonth: values.startMonth,
      endMonth: values.endMonth,
      district: values.district,
    });
    if (response && response.data) {
      setDistrictEndemicity(response.data);
    }
  }
  async function getDistrictsGeo() {
    const response = await MapService.GetDistrictsGeo();
    if (response?.data?.features) {
      //console.log(response.data.features);
      setGeoData(response.data.features);
    }
  }
  useEffect(() => {
    // getTodayEntry();
    // getbsCollectedToday();
    // getDashboardLFThisMonth();
    // getDashboardLFCases12Months();
    // getDashboardMFPositive12Months();
    // getDashboardMONotVerified();
    // GetMFEndemicityGraphAllDistricts();
    getDistrictsGeo();
    get_EndemicityTotalAllDistricts(initialFilterValue);
    getMMDPPercentageGraphDistrictWise(mmdpInitialFilterValue);
    getEndemicityMapAllDistricts(initialFilterValueEndemicityMap);
    getAllDistrictList();
    getDashboardMFRateTimeTrend(mfRateinitialFilterValue);
    getMdaIdaCoverageConsumption(mdaidaCoverageInitiaFilterValue);
    getMdaTasActivityStatus(stmdatasyear);
    getFsuFcuNcPerformance(fcuFsuNcYear);
    getAlertMsgs(signinUserId);
    //getDASHBOARDGetMFRateTimeTrendList(mfRateListinitialFilterValue)
  }, []);

  const endemicityMapUrlHandler = (e) => {
    // setEndemicityMapSelect(e.target.value);
    let url = window.location.href;
    if (url.toLowerCase().includes('/webdashboard')) {
      console.log('url', url);
      history.push('/endemicitymap');
    } else {
      history.push('/endemicitymapadmin');
    }
  };

  const endemicityMapSelectHandler = (e) => {
    setEndemicityMapSelect(e.target.value);
  };
  return (
    <div>
      <style>{`
    div{ font-family: "poppins"; }
  `}</style>
      {/* Content */}
      <MFRatesTable
        show={popupTable}
        data={popupTableData}
        // selectedkey={selectedvalue}
        // selectedId={selectedId}
        tableColumnConfig={popupTableColumnConfig}
        handleCloseModal={(yearoption) => setpopupTable(false)}
        // yearoption={yearoption}
        // monthoption={monthoption}
      />
      <div className='content' style={{ backgroundColor: '#F2F3F9' }}>
        <Box mb={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={12}>
              <Card
                style={{
                  borderRadius: '3.25px',
                  boxShadow: 'none',
                  overflow: 'visible',
                  height: '100%',
                }}
              >
                <div
                  style={{
                    width: '100%',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#ffff',
                  }}
                >
                  <FormikProvider value={formik}>
                    <form
                      style={{ width: '100%' }}
                      onSubmit={formik.handleSubmit}
                      onChange={formik.handleChange}
                      onReset={formik.handleReset}
                    >
                      <Row style={{ padding: '10px' }}>
                        <div className='col-md-3 col-xl-3 col-12'>
                          <MDP>Cumulative Year (From : To) </MDP>
                          <div style={{ display: 'flex' }}>
                            <div style={{ marginRight: 10 }}>
                              <FormControl
                                variant='filled'
                                style={{ width: '100%' }}
                              >
                                <CustomSelectField
                                  native
                                  value={formik.values.fromyear}
                                  onChange={(e) =>
                                    formik.setFieldValue(
                                      'fromyear',
                                      e?.target?.value ? e.target.value : ''
                                    )
                                  }
                                  style={{
                                    outline: 'none',
                                    border: 'none',
                                  }}
                                >
                                  {yearList.map((item) => (
                                    <option
                                      value={`${item.value}`}
                                      id={`${item.value}`}
                                      key={`${item.value}`}
                                    >
                                      {item.label}
                                    </option>
                                  ))}
                                </CustomSelectField>
                              </FormControl>
                              <div className={'invalid-feedback'}>
                                {formik.errors ? formik.errors.fromyear : ''}
                              </div>
                            </div>
                            <div style={{ marginRight: 10 }}>
                              <FormControl
                                variant='filled'
                                style={{ width: '100%' }}
                              >
                                <CustomSelectField
                                  native
                                  value={formik.values.toyear}
                                  onChange={(e) =>
                                    formik.setFieldValue(
                                      'toyear',
                                      e?.target?.value ? e.target.value : ''
                                    )
                                  }
                                  style={{
                                    outline: 'none',
                                    border: 'none',
                                  }}
                                >
                                  {yearList
                                    .filter(
                                      (item) =>
                                        item.value >= formik.values.fromyear
                                    )

                                    .map((item) => (
                                      <option
                                        value={`${item.value}`}
                                        id={`${item.value}`}
                                        key={`${item.value}`}
                                      >
                                        {item.label}
                                      </option>
                                    ))}
                                </CustomSelectField>
                              </FormControl>
                              <div className={'invalid-feedback'}>
                                {formik.errors ? formik.errors.toyear : ''}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='col-md-3 col-xl-3 col-12'>
                          <MDP>Progressive Month (From : To) </MDP>
                          <div style={{ display: 'flex' }}>
                            <div style={{ marginRight: 10 }}>
                              <FormControl
                                variant='filled'
                                style={{ width: '100%' }}
                              >
                                <CustomSelectField
                                  native
                                  value={formik.values.startMonth}
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      'startMonth',
                                      e?.target?.value != 0
                                        ? e.target.value
                                        : ''
                                    );
                                  }}
                                  style={{
                                    outline: 'none',
                                    border: 'none',
                                  }}
                                >
                                  {monthList?.length !== 0
                                    ? monthList.map((item) => (
                                        <option
                                          value={`${item.value}`}
                                          id={`${item.value}`}
                                          key={`${item.value}`}
                                        >
                                          {item.label}
                                        </option>
                                      ))
                                    : NoneList.map((item) => (
                                        <option
                                          value={`${item.value}`}
                                          id={`${item.value}`}
                                          key={`${item.value}`}
                                        >
                                          {item.label}
                                        </option>
                                      ))}
                                </CustomSelectField>
                              </FormControl>
                              <div className={'invalid-feedback'}>
                                {formik.errors ? formik.errors.startMonth : ''}
                              </div>
                            </div>
                            <div style={{ marginRight: 10 }}>
                              <FormControl
                                variant='filled'
                                style={{ width: '100%' }}
                              >
                                <CustomSelectField
                                  native
                                  value={formik.values.endMonth}
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      'endMonth',
                                      e?.target?.value != 0
                                        ? e.target.value
                                        : ''
                                    );
                                  }}
                                  style={{
                                    outline: 'none',
                                    border: 'none',
                                  }}
                                >
                                  {formik.values.startMonth &&
                                  endMonthList(formik.values.startMonth)
                                    ?.length !== 0
                                    ? endMonthList(
                                        formik.values.startMonth
                                      ).map((item) => (
                                        <option
                                          value={`${item.value}`}
                                          id={`${item.value}`}
                                          key={`${item.value}`}
                                        >
                                          {item.label}
                                        </option>
                                      ))
                                    : NoneList.map((item) => (
                                        <option
                                          value={`${item.value}`}
                                          id={`${item.value}`}
                                          key={`${item.value}`}
                                        >
                                          {item.label}
                                        </option>
                                      ))}
                                </CustomSelectField>
                              </FormControl>
                              <div className={'invalid-feedback'}>
                                {formik.errors ? formik.errors.endMonth : ''}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className='col-md-6 col-xl-6 col-12'
                          style={{ display: 'flex' }}
                        >
                          <div>
                            <MDP>District</MDP>
                            <div style={{ display: 'flex' }}>
                              <div style={{ marginRight: 10 }}>
                                <FormControl
                                  variant='filled'
                                  style={{ width: '100%' }}
                                >
                                  <CustomSelectField
                                    native
                                    value={formik.values.districtId}
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        'districtId',
                                        e?.target?.value != 0
                                          ? e.target.value
                                          : ''
                                      );
                                    }}
                                    style={{
                                      outline: 'none',
                                      border: 'none',
                                    }}
                                  >
                                    {districtIdList?.length !== 0
                                      ? selectDistrictList.map((item) => (
                                          <option
                                            value={`${item.value}`}
                                            id={`${item.value}`}
                                            key={`${item.value}`}
                                          >
                                            {item.label}
                                          </option>
                                        ))
                                      : NoneList.map((item) => (
                                          <option
                                            value={`${item.value}`}
                                            id={`${item.value}`}
                                            key={`${item.value}`}
                                          >
                                            {item.label}
                                          </option>
                                        ))}
                                  </CustomSelectField>
                                </FormControl>

                                <div className={'invalid-feedback'}>
                                  {formik.errors
                                    ? formik.errors.districtId
                                    : ''}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'flex-start',
                              alignItems: 'end',
                            }}
                          >
                            <Button
                              className='mt-m font-chng'
                              type='submit'
                              style={{
                                backgroundColor: '#19D895',
                                border: 'none',
                                fontWeight: 500,
                                color: '#FFFFFF',
                                fontSize: 13,
                              }}
                            >
                              Filter
                            </Button>
                            <Button
                              className='mt-m font-chng'
                              type='reset'
                              style={{
                                marginLeft: '10px',
                                backgroundColor: '#19D895',
                                border: 'none',
                                fontWeight: 500,
                                color: '#FFFFFF',
                                fontSize: 13,
                              }}
                            >
                              Clear
                            </Button>
                          </div>
                        </div>
                      </Row>
                    </form>
                  </FormikProvider>
                </div>
                {/* <Paper className={classes.root}> */}

                {/* <FilterListIcon
              style={{
                marginRight: "15px",
                cursor: "pointer",
                marginBottom: "10px", float: 'right'
              }}
            >
              Filter
            </FilterListIcon>
            <Tabs
              value={value}
              onChange={handleChange}
              style={{ color: '#00AEE6' }}
              classes={{
                indicator: classes.indicator,

              }}

            >
              <Tab label={`Linelisting Of Lymphedema cases & MMDP Report`} wrapped />
              <Tab label={`Planning of Hydrocele Operations `} wrapped />
              <Tab label={`Consolidated district report on Lymphedema morbidity Management and Hydrocele cases`} wrapped />
            </Tabs> */}

                {/* </Paper> */}
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <NewStatisticsCardDetails
                  icon={
                    <img
                      alt=''
                      src={LymphImg}
                      style={{
                        height: '48px',
                        width: '48px',
                        border: '2px solid #2680f1',
                        borderRadius: '50%',
                      }}
                    />
                  }
                  iconBackgroundColor={'#2380F1'}
                  title={'Lymphedema Cases'}
                  count={
                    <>
                      <Box>
                        <Grid container>
                          <Grid item xs={6}></Grid>
                          <Grid item xs={6}>
                            <CustomParagarph>Cases</CustomParagarph>
                          </Grid>
                          {/* <Grid item xs={3}>
                            <CustomParagarph>Surgeries</CustomParagarph>
                          </Grid> */}
                        </Grid>
                        <Grid container>
                          <Grid item xs={6}>
                            <Box
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <MDP>Cumulative</MDP>
                              <MDP>
                                {formik.values.toyear - 1} till{' '}
                                {
                                  monthList.find(
                                    (item) =>
                                      item.value == formik.values.endMonth
                                  )?.label
                                }
                              </MDP>
                              <MDP>
                                {formik.values.toyear} till{' '}
                                {
                                  monthList.find(
                                    (item) =>
                                      item.value == formik.values.endMonth
                                  )?.label
                                }
                              </MDP>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <MDCount>
                                {statisticsData?.LFCases?.cumulative
                                  ? statisticsData?.LFCases?.cumulative
                                  : '0'}{' '}
                              </MDCount>
                              <MDCountBox>
                                <MDCountPointer
                                  onClick={() =>
                                    getLymphedemaCasesDistricts('previous')
                                  }
                                >
                                  {statisticsData?.LFCases?.previosYear
                                    ? statisticsData.LFCases.previosYear
                                    : '0'}{' '}
                                </MDCountPointer>
                              </MDCountBox>
                              <MDCountBox>
                                <MDCountPointer
                                  onClick={() =>
                                    getLymphedemaCasesDistricts('current')
                                  }
                                >
                                  {statisticsData?.LFCases?.selectYear
                                    ? statisticsData.LFCases.selectYear
                                    : '0'}
                                </MDCountPointer>
                                {statisticsData?.LFCases?.selectYear <
                                statisticsData?.LFCases?.previosYear ? (
                                  <ArrowDownwardIcon
                                    style={{ width: '13px', color: '#34C38F' }}
                                  />
                                ) : (
                                  <ArrowUpwardIcon
                                    style={{ width: '13px', color: '#F46A6A' }}
                                  />
                                )}
                              </MDCountBox>
                              {/* <MDCount>789889 </MDCount>
                              <MDCountBox>
                                <MDCount>12503 </MDCount>
                              </MDCountBox>
                              <MDCountBox>
                                <MDCount>
                                  {statisticsData[0]?.NoOfLFCases}
                                </MDCount>
                                {12503 > 15 ? (
                                  <ArrowDownwardIcon
                                    style={{ width: "13px", color: "#34C38F" }}
                                  />
                                ) : (
                                  <ArrowUpwardIcon
                                    style={{ width: "13px", color: "#F46A6A" }}
                                  />
                                )}
                              </MDCountBox> */}
                            </Box>
                          </Grid>
                          {/* <Grid item xs={3}>
                            <Box
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <MDCount>2021 <ArrowDownwardIcon style={{width: "13px"}}/></MDCount>
                              <MDCount>2021 <ArrowDownwardIcon style={{width: "13px"}}/></MDCount>
                              <MDCount>2022 <ArrowDownwardIcon style={{width: "13px"}}/></MDCount>
                            </Box>
                          </Grid> */}
                        </Grid>
                      </Box>
                    </>
                  }
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <NewStatisticsCardDetails
                  icon={
                    <img
                      alt=''
                      src={HydroceleImg}
                      style={{
                        height: '48px',
                        width: '48px',
                        border: '2px solid #2680f1',
                        borderRadius: '50%',
                      }}
                    />
                  }
                  // iconBackgroundColor={'#34C38F'}
                  title={'Hydrocele Cases'}
                  count={
                    <>
                      <Box>
                        <Grid container>
                          <Grid item xs={5}></Grid>
                          <Grid item xs={4}>
                            <CustomParagarph>Cases</CustomParagarph>
                          </Grid>
                          <Grid item xs={3}>
                            <CustomParagarph>Surg.done</CustomParagarph>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={5}>
                            <Box
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <MDP>Cumulative</MDP>
                              <MDP>
                                {formik.values.toyear - 1} till{' '}
                                {
                                  monthList.find(
                                    (item) =>
                                      item.value == formik.values.endMonth
                                  )?.label
                                }
                              </MDP>
                              <MDP>
                                {formik.values.toyear} till{' '}
                                {
                                  monthList.find(
                                    (item) =>
                                      item.value == formik.values.endMonth
                                  )?.label
                                }
                              </MDP>
                            </Box>
                          </Grid>
                          <Grid item xs={4}>
                            <Box
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                // padding: "3px",
                              }}
                            >
                              <MDCount>
                                {statisticsData?.HydroceleCases?.cumulative
                                  ? statisticsData.HydroceleCases.cumulative
                                  : '0'}{' '}
                              </MDCount>
                              <MDCountPointer
                                onClick={() =>
                                  getHydroceleCasesDistricts('previous')
                                }
                              >
                                {statisticsData?.HydroceleCases?.previosYear
                                  ? statisticsData.HydroceleCases.previosYear
                                  : '0'}
                              </MDCountPointer>
                              <MDCountBox>
                                <MDCountPointer
                                  onClick={() =>
                                    getHydroceleCasesDistricts('current')
                                  }
                                >
                                  {statisticsData?.HydroceleCases?.selectYear
                                    ? statisticsData.HydroceleCases.selectYear
                                    : '0'}
                                </MDCountPointer>{' '}
                                {/* {console.log(statisticsData?.HydroceleCases?.selectYear, statisticsData?.HydroceleCases?.previosYear, 'statisticsData?.HydroceleCases?.selectYear > statisticsData?.HydroceleCases?.previosYear ')} */}
                                {statisticsData?.HydroceleCases?.selectYear <
                                statisticsData?.HydroceleCases?.previosYear ? (
                                  <ArrowDownwardIcon
                                    style={{ width: '13px', color: '#34C38F' }}
                                  />
                                ) : (
                                  <ArrowUpwardIcon
                                    style={{ width: '13px', color: '#F46A6A' }}
                                  />
                                )}
                              </MDCountBox>
                              {/*
                              <MDCount>523488 </MDCount>
                              <MDCount>
                                4771{" "}
                                                            </MDCount>
                            <MDCountBox>
                              <MDCount>
                                {statisticsData[0]?.NoOfHydroceleCases}
                              </MDCount>
                              {4771 > 2 ? (
                                <ArrowDownwardIcon
                                  style={{ width: "13px", color: "#34C38F" }}
                                />
                              ) : (
                                <ArrowUpwardIcon
                                  style={{ width: "13px", color: "#F46A6A" }}
                                />
                              )}
                            </MDCountBox> */}
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            <Box
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <MDCount>
                                {statisticsData?.HydroceleSurgery?.cumulative
                                  ? statisticsData.HydroceleSurgery.cumulative
                                  : '0'}
                              </MDCount>
                              <MDCountPointer
                                onClick={() =>
                                  getHydroceleSurgeriesDistricts('previous')
                                }
                              >
                                {statisticsData?.HydroceleSurgery?.previosYear
                                  ? statisticsData.HydroceleSurgery.previosYear
                                  : '0'}{' '}
                              </MDCountPointer>
                              <MDCountBox>
                                <MDCountPointer
                                  onClick={() =>
                                    getHydroceleSurgeriesDistricts('current')
                                  }
                                >
                                  {statisticsData?.HydroceleSurgery?.selectYear
                                    ? statisticsData.HydroceleSurgery.selectYear
                                    : '0'}{' '}
                                </MDCountPointer>
                                {(statisticsData?.HydroceleCases?.PreviousYear /
                                  statisticsData?.HydroceleSurgery
                                    ?.PreviousYear) *
                                  100 <
                                (statisticsData?.HydroceleCases?.selectYear /
                                  statisticsData?.HydroceleSurgery
                                    ?.selectYear) *
                                  100 ? (
                                  <ArrowUpwardIcon
                                    style={{ width: '13px', color: '#F46A6A' }}
                                  />
                                ) : (
                                  <ArrowDownwardIcon
                                    style={{ width: '13px', color: '#F46A6A' }}
                                  />
                                )}
                              </MDCountBox>

                              {/*
                                  <MDCount>55403</MDCount>
                              <MDCount>797 </MDCount>
                              <MDCountBox>
                                <MDCount>
                                  {statisticsData[0]?.NoOfHydroceleSurgery}
                                </MDCount>
                                {797 > 1 ? (
                                  <ArrowDownwardIcon
                                    style={{ width: "13px", color: "#F46A6A" }}
                                  />
                                ) : (
                                  <ArrowUpwardIcon
                                    style={{ width: "13px", color: "#34C38F" }}
                                  />
                                )}
                              </MDCountBox> */}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </>
                  }
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <NewStatisticsCardDetails
                  icon={<img alt='' src={MFPositiveCases} />}
                  title={'MF Positive Cases'}
                  iconBackgroundColor={'#2380F1'}
                  count={
                    <>
                      <Box>
                        <Grid container>
                          <Grid item xs={6}></Grid>
                          <Grid item xs={6}>
                            <CustomParagarph>Cases</CustomParagarph>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={6}>
                            <Box
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <MDP>Cumulative</MDP>
                              <MDP>
                                {formik.values.toyear - 1} till{' '}
                                {
                                  monthList.find(
                                    (item) =>
                                      item.value == formik.values.endMonth
                                  )?.label
                                }
                              </MDP>
                              <MDP>
                                {formik.values.toyear} till{' '}
                                {
                                  monthList.find(
                                    (item) =>
                                      item.value == formik.values.endMonth
                                  )?.label
                                }
                              </MDP>
                            </Box>
                          </Grid>
                          <Grid item xs={6}>
                            <Box
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <MDCount>
                                {statisticsData?.MFPositive?.cumulative
                                  ? statisticsData.MFPositive.cumulative
                                  : '0'}{' '}
                              </MDCount>
                              <MDCountBox>
                                <MDCountPointer
                                  onClick={() =>
                                    getMFPositiveCasesDistricts('previous')
                                  }
                                >
                                  {statisticsData?.MFPositive?.previosYear
                                    ? statisticsData.MFPositive.previosYear
                                    : '0'}{' '}
                                </MDCountPointer>
                              </MDCountBox>
                              <MDCountBox>
                                <MDCountPointer
                                  onClick={() =>
                                    getMFPositiveCasesDistricts('current')
                                  }
                                >
                                  {statisticsData?.MFPositive?.selectYear
                                    ? statisticsData?.MFPositive?.selectYear
                                    : '0'}{' '}
                                </MDCountPointer>
                                {statisticsData?.MFPositive?.selectYear <
                                statisticsData?.MFPositive?.previosYear ? (
                                  <ArrowDownwardIcon
                                    style={{ width: '13px', color: '#34C38F' }}
                                  />
                                ) : (
                                  <ArrowUpwardIcon
                                    style={{ width: '13px', color: '#F46A6A' }}
                                  />
                                )}
                              </MDCountBox>
                              {/*
                                <MDCount>67953 </MDCount>
                              <MDCountBox>
                                <MDCount>56 </MDCount>
                              </MDCountBox>
                              <MDCountBox>
                                <MDCount>
                                  {statisticsData[0]?.NoMFPosetive}
                                </MDCount>
                                {56 > 20 ? (
                                  <ArrowDownwardIcon
                                    style={{ width: "13px", color: "#34C38F" }}
                                  />
                                ) : (
                                  <ArrowUpwardIcon
                                    style={{ width: "13px", color: "#F46A6A" }}
                                  />
                                )}
                              </MDCountBox> */}
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>
                    </>
                  }
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={3}>
              <MDBox mb={1.5}>
                <NewStatisticsCardDetails
                  icon={<img alt='' src={Alerts} />}
                  iconBackgroundColor={'#F1B44C'}
                  title={'Alerts'}
                  count={
                    <>
                      <Box>
                        <Grid container>
                          <Grid item xs={6}>
                            <p></p>
                          </Grid>
                          <Grid item xs={3}>
                            <p></p>
                          </Grid>
                          <Grid item xs={3}>
                            <p></p>
                          </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Box
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <MDP style={{ fontSize: '14px', height: '27px' }}>
                                New
                              </MDP>
                            </Box>
                          </Grid>
                          <Grid item xs={3}>
                            <Box
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                              }}
                            >
                              <MDCount
                                onClick={() => {
                                  setPopupTableColumnConfig({
                                    title: 'Alerts',
                                    headers: 'Alerts',
                                  });
                                  setpopupTableData(alertMsg.allAlerts);
                                  setpopupTable(true);
                                }}
                              >
                                <span
                                  style={{
                                    fontFamily: 'Poppins',
                                    fontStyle: 'normal',
                                    fontWeight: '600',
                                    fontSize: '19.5px',
                                    lineHeight: '29px',
                                    color: '#F1B44C',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {alertMsg.newAlerts}
                                </span>
                              </MDCount>
                            </Box>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={6}>
                            <p></p>
                          </Grid>
                          <Grid item xs={3}>
                            <p></p>
                          </Grid>
                          <Grid item xs={3}>
                            <p></p>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={6}>
                            <p></p>
                          </Grid>
                          <Grid item xs={3}>
                            <p></p>
                          </Grid>
                          <Grid item xs={3}>
                            <p></p>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <Grid item xs={6} style={{ height: '26px' }}>
                            <p></p>
                          </Grid>
                          <Grid item xs={3}>
                            <p></p>
                          </Grid>
                          <Grid item xs={3}>
                            <p></p>
                          </Grid>
                        </Grid>
                      </Box>
                    </>
                  }
                />
              </MDBox>
            </Grid>
          </Grid>
        </Box>
        <Box mb={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={7}>
              <Card
                style={{
                  padding: '20px 20px',
                  borderRadius: '3.25px',
                  boxShadow: 'none',
                  overflow: 'visible',
                  height: '100%',
                }}
              >
                <MDTitleContainer>
                  <MDTitle style={{ width: '100%' }}>
                    District wise Endemicity & Entomology Status
                  </MDTitle>
                </MDTitleContainer>
                <div
                  className='mapDistrict'
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <MDP>Year</MDP>
                    <div style={{ display: 'flex' }}>
                      <div className='form-grp' style={{ marginRight: 10 }}>
                        <FormControl variant='filled'>
                          <CustomSelectField
                            native
                            value={formikEndemicityMap.values.year}
                            style={{
                              outline: 'none',
                              border: 'none',
                              backgroundColor: '#efefef',
                            }}
                          >
                            {yearList.map((item) => (
                              <option
                                value={`${item.value}`}
                                id={`${item.value}`}
                                key={`${item.value}`}
                              >
                                {item.label}
                              </option>
                            ))}
                          </CustomSelectField>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  <div>
                    <MDP>Month (From : To)</MDP>
                    <div style={{ display: 'flex' }}>
                      <div className='form-grp' style={{ marginRight: 10 }}>
                        <FormControl variant='filled'>
                          <CustomSelectField
                            native
                            value={formikEndemicityMap.values.startMonth}
                            style={{
                              outline: 'none',
                              border: 'none',
                              backgroundColor: '#efefef',
                            }}
                          >
                            {monthList?.length !== 0
                              ? monthList.map((item) => (
                                  <option
                                    value={`${item.value}`}
                                    id={`${item.value}`}
                                    key={`${item.value}`}
                                  >
                                    {item.label}
                                  </option>
                                ))
                              : NoneList.map((item) => (
                                  <option
                                    value={`${item.value}`}
                                    id={`${item.value}`}
                                    key={`${item.value}`}
                                  >
                                    {item.label}
                                  </option>
                                ))}
                          </CustomSelectField>
                        </FormControl>
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.startMonth : ''}
                        </div>
                      </div>
                      <div className='form-grp' style={{ marginRight: 10 }}>
                        <FormControl variant='filled'>
                          <CustomSelectField
                            native
                            value={formikEndemicityMap.values.endMonth}
                            style={{
                              outline: 'none',
                              border: 'none',
                              backgroundColor: '#efefef',
                            }}
                          >
                            {formik.values.startMonth &&
                            endMonthList(formik.values.startMonth)?.length !== 0
                              ? endMonthList(formik.values.startMonth).map(
                                  (item) => (
                                    <option
                                      value={`${item.value}`}
                                      id={`${item.value}`}
                                      key={`${item.value}`}
                                    >
                                      {item.label}
                                    </option>
                                  )
                                )
                              : NoneList.map((item) => (
                                  <option
                                    value={`${item.value}`}
                                    id={`${item.value}`}
                                    key={`${item.value}`}
                                  >
                                    {item.label}
                                  </option>
                                ))}
                          </CustomSelectField>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  <div>
                    <MDP></MDP>
                    <div style={{ display: 'flex' }}>
                      <div className='form-grp' style={{ marginRight: 10 }}>
                        <FormControl variant='filled'>
                          <CustomSelectField
                            native
                            value={endemicityMapSelect}
                            onChange={endemicityMapSelectHandler}
                          >
                            {/* <option aria-label="None" value="" /> */}
                            <option value={'LfCases'}>Lymphedema</option>
                            <option value={'HydroceleCases'}>Hydrocele</option>
                            <option value={'MfPositive'}>MF Positive</option>
                            <option value={'CulexInfection'}>
                              Culex Infection
                            </option>
                            <option value={'CulexInfectivity'}>
                              Culex Infectivity
                            </option>
                          </CustomSelectField>
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  <div>
                    <MDP></MDP>
                    <div style={{ display: 'flex' }}>
                      <div className='form-grp' style={{ marginRight: 10 }}>
                        <Button
                          className='mt-m font-chng'
                          type='submit'
                          style={{
                            backgroundColor: '#19D895',
                            border: 'none',
                            fontWeight: 500,
                            color: '#FFFFFF',
                            fontSize: 13,
                          }}
                          onClick={endemicityMapUrlHandler}
                        >
                          ...
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                <NewEndemicityData
                  endemicityProps={endemicityMapSelect}
                  endemicityData={districtEndemicity}
                  geoData={geoData}
                  zoomSize={6}
                  mapContainerHeight={'50vh'}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={5}>
              <Card
                style={{
                  // padding: "15px 10px",
                  borderRadius: '3.25px',
                  boxShadow: 'none',
                  overflow: 'visible',
                  height: '100%',
                }}
              >
                <NewReportLineGraph
                  chart={{
                    labels: mfGraphLabels,
                    datasets: {
                      label: 'MF Rate',
                      data: mfGraphData,
                      backgroundColor: '#82eddf',
                    },
                    // displayY: true,
                  }}
                  config='mf'
                  title='MF Rate Time Trend'
                  isSelectField='false'
                  selectField={[]}
                  popupCallback={getDASHBOARDGetMFRateTimeTrendList}
                  rightTitle={
                    <>
                      <div>
                        <MDP>Year (From : To) </MDP>
                        <div style={{ display: 'flex' }}>
                          <div className='form-grp' style={{ marginRight: 10 }}>
                            <FormControl variant='filled'>
                              <CustomSelectField
                                native
                                value={mfformik.values.startYear}
                                onChange={(e) => {
                                  mfformik.setFieldValue(
                                    'startYear',
                                    e?.target?.value ? e.target.value : ''
                                  );
                                  getDashboardMFRateTimeTrend({
                                    ...mfformik.values,
                                    startYear: e?.target?.value
                                      ? e.target.value
                                      : '',
                                  });
                                }}
                                style={{
                                  outline: 'none',
                                  border: 'none',
                                }}
                              >
                                {yearList.map((item) => (
                                  <option
                                    value={`${item.value}`}
                                    id={`${item.value}`}
                                    key={`${item.value}`}
                                  >
                                    {item.label}
                                  </option>
                                ))}
                              </CustomSelectField>
                            </FormControl>
                            <div className={'invalid-feedback'}>
                              {mfformik.errors ? mfformik.errors.startYear : ''}
                            </div>
                          </div>
                          <div className='form-grp' style={{ marginRight: 10 }}>
                            <FormControl variant='filled'>
                              <CustomSelectField
                                native
                                value={mfformik.values.endYear}
                                onChange={(e) => {
                                  mfformik.setFieldValue(
                                    'endYear',
                                    e?.target?.value ? e.target.value : ''
                                  );
                                  getDashboardMFRateTimeTrend({
                                    ...mfformik.values,
                                    endYear: e?.target?.value
                                      ? e.target.value
                                      : '',
                                  });
                                }}
                                style={{
                                  outline: 'none',
                                  border: 'none',
                                }}
                              >
                                [14:17] Ashok Induraj
                                {yearList
                                  .filter(
                                    (item) =>
                                      item.value >= mfformik.values.startYear
                                  )
                                  .map((item) => (
                                    <option
                                      value={`${item.value}`}
                                      id={`${item.value}`}
                                      key={`${item.value}`}
                                    >
                                      {item.label}
                                    </option>
                                  ))}
                              </CustomSelectField>
                            </FormControl>
                            <div className={'invalid-feedback'}>
                              {mfformik.errors ? mfformik.errors.endYear : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <MDP>District</MDP>
                        <div className='form-grp'>
                          <FormControl variant='filled'>
                            <CustomSelectField
                              native
                              value={mfformik.values.districtId}
                              onChange={(e) => {
                                setMfRateDistrictId(
                                  e?.target?.value ? e.target.value : ''
                                );
                                mfformik.setFieldValue(
                                  'districtId',
                                  e?.target?.value ? e.target.value : ''
                                );
                                getDashboardMFRateTimeTrend({
                                  ...mfformik.values,
                                  districtId: e?.target?.value
                                    ? e.target.value
                                    : '',
                                });
                              }}
                              style={{
                                outline: 'none',
                                border: 'none',
                              }}
                            >
                              {districtIdList?.length !== 0
                                ? selectDistrictList.map((item) => (
                                    <option
                                      value={`${item.value}`}
                                      id={`${item.value}`}
                                      key={`${item.value}`}
                                    >
                                      {item.label}
                                    </option>
                                  ))
                                : NoneList.map((item) => (
                                    <option
                                      value={`${item.value}`}
                                      id={`${item.value}`}
                                      key={`${item.value}`}
                                    >
                                      {item.label}
                                    </option>
                                  ))}
                            </CustomSelectField>
                          </FormControl>
                          <div className={'invalid-feedback'}>
                            {mfformik.errors ? mfformik.errors.districtId : ''}
                          </div>
                        </div>
                      </div>
                    </>
                  }
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Box mb={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={7}>
              <Card
                style={{
                  padding: '20px',
                  borderRadius: '3.25px',
                  boxShadow: 'none',
                  overflow: 'visible',
                  height: '100%',
                }}
              >
                <MDTitleContainer style={{ marginBottom: '10px' }}>
                  <MDTitle style={{ width: '100%' }}>
                    Stages of Elimination - MDA/IDA And TAS
                  </MDTitle>
                </MDTitleContainer>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  {/* <div>
                    <MDP>Year</MDP>
                    <div style={{ display: 'flex' }}>
                      <div className='form-grp' style={{ marginRight: 10 }}>
                        <FormControl variant="filled">
                          <CustomSelectField
                            native
                            value={stagesyear}
                            onChange={(e) => setstagesyear(e.target.value)}
                            style={{
                              outline: "none",
                              border: "none",
                            }}
                          >
                            {yearList.map((item) => <option value={`${item.value}`} id={`${item.value}`} key={`${item.value}`}>{item.label}</option>)}
                          </CustomSelectField>
                        </FormControl>
                      </div>
                    </div>
                  </div> */}
                </div>
                <div
                  style={{
                    display: 'flex',
                    marginLeft: '5px',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    <div style={{ display: 'flex', marginRight: '10px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          background: '459e41',
                          marginTop: '4px',
                          marginRight: '5px',
                          borderRadius: '2px',
                        }}
                      ></div>
                      <p
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: '500',
                          fontSize: '13px',
                          lineHeight: '20px',
                          color: '#A6B0CF',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Non Endemic
                      </p>
                    </div>
                    <div style={{ display: 'flex', marginRight: '10px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          background: '#c4bf16',
                          marginTop: '4px',
                          marginRight: '5px',
                          borderRadius: '2px',
                        }}
                      ></div>
                      <p
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: '500',
                          fontSize: '13px',
                          lineHeight: '20px',
                          color: '#A6B0CF',
                        }}
                      >
                        TAS
                      </p>
                    </div>
                    <div style={{ display: 'flex' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          background: '#eb5ead',
                          marginTop: '4px',
                          marginRight: '5px',
                          borderRadius: '2px',
                        }}
                      ></div>
                      <p
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: '500',
                          fontSize: '13px',
                          lineHeight: '20px',
                          color: '#A6B0CF',
                        }}
                      >
                        MDA
                      </p>
                    </div>
                    <div style={{ display: 'flex', paddingLeft: '5px' }}>
                      <div
                        style={{
                          height: '10px',
                          width: '10px',
                          background: '#a607eb',
                          marginTop: '4px',
                          marginRight: '5px',
                          borderRadius: '2px',
                        }}
                      ></div>
                      <p
                        style={{
                          fontFamily: 'Poppins',
                          fontStyle: 'normal',
                          fontWeight: '500',
                          fontSize: '13px',
                          lineHeight: '20px',
                          color: '#A6B0CF',
                        }}
                      >
                        TAS/MDA
                      </p>
                    </div>
                  </div>
                </div>
                <MdaTasData
                  endemicityProps={null}
                  endemicityData={districtEndemicity}
                  geoData={geoData}
                  zoomSize={6}
                  mapContainerHeight={'50vh'}
                />
              </Card>
            </Grid>
            <Grid item xs={12} md={6} lg={5}>
              <Card
                style={{
                  padding: '15px 10px',
                  borderRadius: '3.25px',
                  boxShadow: 'none',

                  overflow: 'visible',
                  height: '100%',
                  // overflowX: "h",
                }}
              >
                <NewReportGraph
                  chart={{
                    labels: coverageGraphLabels(mdaIdaCoverageConsumption),
                    datasets: [
                      {
                        label: '% of coverage',
                        data: coverageGraphData(mdaIdaCoverageConsumption),
                        backgroundColor: '#556EE6',
                      },
                      {
                        label: '% of consumption',
                        data: consumptionGraphData(mdaIdaCoverageConsumption),
                        backgroundColor: '#B2E3AE',
                      },
                    ],
                  }}
                  title='MDA/IDA - Coverage and Consumption %'
                  isSelectField='false'
                  selectField={[]}
                  rightTitle={
                    <>
                      <div className='col-md-6 col-xl-6 col-12 col-xs-12'>
                        <MDP>Year (From : To) </MDP>
                        <div style={{ display: 'flex' }}>
                          <div className='form-grp' style={{ marginRight: 10 }}>
                            <FormControl variant='filled'>
                              <CustomSelectField
                                native
                                value={mdaIdaFormik.values.startYear}
                                onChange={(e) => {
                                  console.log(mdaIdaFormik.values);
                                  mdaIdaFormik.setFieldValue(
                                    'startYear',
                                    e?.target?.value ? e.target.value : ''
                                  );
                                  getMdaIdaCoverageConsumption({
                                    ...mdaIdaFormik.values,
                                    startYear: e?.target?.value
                                      ? e.target.value
                                      : '',
                                  });
                                }}
                                style={{
                                  outline: 'none',
                                  border: 'none',
                                }}
                              >
                                {yearList.map((item) => (
                                  <option
                                    value={`${item.value}`}
                                    id={`${item.value}`}
                                    key={`${item.value}`}
                                  >
                                    {item.label}
                                  </option>
                                ))}
                              </CustomSelectField>
                            </FormControl>
                            <div className={'invalid-feedback'}>
                              {mdaIdaFormik.errors
                                ? mdaIdaFormik.errors.startYear
                                : ''}
                            </div>
                          </div>
                          <div className='form-grp'>
                            <FormControl variant='filled'>
                              <CustomSelectField
                                native
                                value={mdaIdaFormik.values.endYear}
                                onChange={(e) => {
                                  console.log(mdaIdaFormik.values);
                                  mdaIdaFormik.setFieldValue(
                                    'endYear',
                                    e?.target?.value ? e.target.value : ''
                                  );
                                  getMdaIdaCoverageConsumption({
                                    ...mdaIdaFormik.values,
                                    endYear: e?.target?.value
                                      ? e.target.value
                                      : '',
                                  });
                                }}
                                style={{
                                  outline: 'none',
                                  border: 'none',
                                }}
                              >
                                {yearList
                                  .filter(
                                    (item) =>
                                      item.value >=
                                      mdaIdaFormik.values.startYear
                                  )

                                  .map((item) => (
                                    <option
                                      value={`${item.value}`}
                                      id={`${item.value}`}
                                      key={`${item.value}`}
                                    >
                                      {item.label}
                                    </option>
                                  ))}
                              </CustomSelectField>
                            </FormControl>
                            <div className={'invalid-feedback'}>
                              {mdaIdaFormik.errors
                                ? mdaIdaFormik.errors.toyear
                                : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <MDP>District</MDP>
                        <div className='form-grp'>
                          <FormControl variant='filled'>
                            <CustomSelectField
                              native
                              value={mdaIdaFormik.values.districtId}
                              onChange={(e) => {
                                console.log(mdaIdaFormik.values);
                                mdaIdaFormik.setFieldValue(
                                  'districtId',
                                  e?.target?.value ? e.target.value : ''
                                );
                                getMdaIdaCoverageConsumption({
                                  ...mdaIdaFormik.values,
                                  districtId: e?.target?.value
                                    ? e.target.value
                                    : '',
                                });
                              }}
                              style={{
                                outline: 'none',
                                border: 'none',
                              }}
                            >
                              {districtIdList?.length !== 0
                                ? selectDistrictList.map((item) => (
                                    <option
                                      value={`${item.value}`}
                                      id={`${item.value}`}
                                      key={`${item.value}`}
                                    >
                                      {item.label}
                                    </option>
                                  ))
                                : NoneList.map((item) => (
                                    <option
                                      value={`${item.value}`}
                                      id={`${item.value}`}
                                      key={`${item.value}`}
                                    >
                                      {item.label}
                                    </option>
                                  ))}
                            </CustomSelectField>
                          </FormControl>
                          <div className={'invalid-feedback'}>
                            {mdaIdaFormik.errors
                              ? mdaIdaFormik.errors.districtId
                              : ''}
                          </div>
                        </div>
                      </div>
                    </>
                  }
                  plotTitleData={[
                    {
                      title: '% of Coverage',
                      color: '#556EE6',
                    },
                    {
                      title: '% of Consumption',
                      color: '#B2E3AE',
                    },
                  ]}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Box mb={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={12}>
              <Card
                style={{
                  padding: '15px 10px',
                  borderRadius: '3.25px',
                  boxShadow: 'none',
                  overflow: 'visible',
                  height: '100%',
                }}
              >
                <NewReportTable
                  title={'Maharashtra State TAS activity status data'}
                  rightTitle={
                    <>
                      <div style={{ marginRight: 10 }}>
                        <MDP>Year</MDP>
                        <div style={{ display: 'flex' }}>
                          <div className='form-grp' style={{ marginRight: 10 }}>
                            <FormControl variant='filled'>
                              <CustomSelectField
                                native
                                value={stmdatasyear}
                                onChange={(e) => {
                                  setstmdatasyear(e.target.value);
                                  getMdaTasActivityStatus(e.target.value);
                                }}
                                style={{
                                  outline: 'none',
                                  border: 'none',
                                }}
                              >
                                {yearList.map((item) => (
                                  <option
                                    value={`${item.value}`}
                                    id={`${item.value}`}
                                    key={`${item.value}`}
                                  >
                                    {item.label}
                                  </option>
                                ))}
                              </CustomSelectField>
                            </FormControl>
                          </div>
                        </div>
                      </div>
                    </>
                  }
                  tableData={mdaTasActivityStatus}
                  tableHead={[
                    { item: 'District', head: 'nameOfDistrictOrEU' },
                    { item: 'TAS 1 Year', head: 'tas1Period' },
                    { item: 'Outcome', head: 'tas1Outcome' },
                    { item: 'TAS 2 Year', head: 'tas2Period' },
                    { item: 'Outcome', head: 'tas2Outcome' },
                    { item: 'TAS 3 Year', head: 'tas3Period' },
                    { item: 'Outcome', head: 'tas3Outcome' },
                  ]}
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Box mb={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={12}>
              <Card
                style={{
                  padding: '15px 10px',
                  borderRadius: '3.25px',
                  boxShadow: 'none',

                  overflow: 'visible',
                  height: '100%',
                }}
              >
                <NewReportGraph
                  chart={{
                    labels: MDA_MMDP_Labels,
                    datasets: [
                      {
                        label: '% of people received MMDP kit',
                        data: MMDP_KIT_GraphData,
                        backgroundColor: '#556EE6',
                      },
                      {
                        label: '% of people trained MMDP',
                        data: MMDP_GraphData,
                        backgroundColor: '#B2E3AE',
                      },
                    ],
                    showunit: '%',
                  }}
                  title='Morbidity Management and Disability prevention (MMDP)'
                  plotTitleData={[
                    {
                      title: '% of people received MMDP kit',
                      color: '#556EE6',
                    },
                    {
                      title: '% of people trained MMDP',
                      color: '#A6B0CF',
                    },
                  ]}
                  isSelectField='false'
                  selectField={[]}
                  rightTitle={
                    <>
                      <div style={{ marginRight: 10 }}>
                        <MDP>Year (From : To) </MDP>
                        <div style={{ display: 'flex' }}>
                          <div className='form-grp' style={{ marginRight: 10 }}>
                            <FormControl variant='filled'>
                              <CustomSelectField
                                native
                                value={mmdpFormik.values.startYear}
                                onChange={(e) => {
                                  mmdpFormik.setFieldValue(
                                    'startYear',
                                    e?.target?.value ? e.target.value : ''
                                  );
                                  getMMDPPercentageGraphDistrictWise({
                                    ...mmdpFormik.values,
                                    startYear: e?.target?.value
                                      ? e.target.value
                                      : '',
                                  });
                                }}
                                style={{
                                  outline: 'none',
                                  border: 'none',
                                }}
                              >
                                {yearList.map((item) => (
                                  <option
                                    value={`${item.value}`}
                                    id={`${item.value}`}
                                    key={`${item.value}`}
                                  >
                                    {item.label}
                                  </option>
                                ))}
                              </CustomSelectField>
                            </FormControl>
                            <div className={'invalid-feedback'}>
                              {mmdpFormik.errors
                                ? mmdpFormik.errors.startYear
                                : ''}
                            </div>
                          </div>
                          <div className='form-grp'>
                            <FormControl variant='filled'>
                              <CustomSelectField
                                native
                                value={mmdpFormik.values.endYear}
                                onChange={(e) => {
                                  mmdpFormik.setFieldValue(
                                    'endYear',
                                    e?.target?.value ? e.target.value : ''
                                  );
                                  getMMDPPercentageGraphDistrictWise({
                                    ...mmdpFormik.values,
                                    endYear: e?.target?.value
                                      ? e.target.value
                                      : '',
                                  });
                                }}
                                style={{
                                  outline: 'none',
                                  border: 'none',
                                }}
                              >
                                {yearList
                                  .filter(
                                    (item) =>
                                      item.value >= mmdpFormik.values.startYear
                                  )

                                  .map((item) => (
                                    <option
                                      value={`${item.value}`}
                                      id={`${item.value}`}
                                      key={`${item.value}`}
                                    >
                                      {item.label}
                                    </option>
                                  ))}
                              </CustomSelectField>
                            </FormControl>
                            <div className={'invalid-feedback'}>
                              {mmdpFormik.errors
                                ? mmdpFormik.errors.endYear
                                : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <MDP>District</MDP>
                        <div className='form-grp'>
                          <FormControl variant='filled'>
                            <CustomSelectField
                              native
                              value={mmdpFormik.values.districtId}
                              onChange={(e) => {
                                mmdpFormik.setFieldValue(
                                  'districtId',
                                  e?.target?.value ? e.target.value : ''
                                );
                                getMMDPPercentageGraphDistrictWise({
                                  ...mmdpFormik.values,
                                  districtId: e?.target?.value
                                    ? e.target.value
                                    : '',
                                });
                              }}
                              style={{
                                outline: 'none',
                                border: 'none',
                              }}
                            >
                              {districtIdList?.length !== 0
                                ? selectDistrictList.map((item) => (
                                    <option
                                      value={`${item.value}`}
                                      id={`${item.value}`}
                                      key={`${item.value}`}
                                    >
                                      {item.label}
                                    </option>
                                  ))
                                : NoneList.map((item) => (
                                    <option
                                      value={`${item.value}`}
                                      id={`${item.value}`}
                                      key={`${item.value}`}
                                    >
                                      {item.label}
                                    </option>
                                  ))}
                            </CustomSelectField>
                          </FormControl>
                          <div className={'invalid-feedback'}>
                            {mmdpFormik.errors
                              ? mmdpFormik.errors.districtId
                              : ''}
                          </div>
                        </div>
                      </div>
                    </>
                  }
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
        <Box mb={1}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12} lg={12}>
              <Card
                style={{
                  padding: '15px 10px',
                  borderRadius: '3.25px',
                  boxShadow: 'none',

                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <MDTitleContainer
                  style={{ paddingLeft: '20px', paddingRight: '20px' }}
                >
                  <Typography
                    style={{
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: '600',
                      fontSize: '15px',
                      lineHeight: '28px',
                      color: '#495057',
                    }}
                  >
                    {fsuFcuPerfomanceSelect === 'FCU'
                      ? 'FCU Performance'
                      : fsuFcuPerfomanceSelect === 'FSU'
                      ? 'FSU Performance'
                      : 'NC Performance'}
                  </Typography>
                  <div
                    style={{
                      display: 'flex',
                      marginLeft: '5px',
                      marginRight: '10px',
                      alignItems: 'baseline',
                    }}
                  >
                    <FormControl
                      variant='filled'
                      style={{ marginRight: '10px' }}
                    >
                      <CustomSelectField
                        native
                        value={fcuFsuNcYear}
                        onChange={(e) => {
                          setFcuFsuNcYear(e.target.value);
                          getFsuFcuNcPerformance(e.target.value);
                        }}
                        style={{
                          outline: 'none',
                          border: 'none',
                        }}
                      >
                        {yearList.map((item) => (
                          <option
                            value={`${item.value}`}
                            id={`${item.value}`}
                            key={`${item.value}`}
                          >
                            {item.label}
                          </option>
                        ))}
                      </CustomSelectField>
                    </FormControl>
                    <FormControl variant='filled'>
                      <CustomSelectField
                        native
                        value={fsuFcuPerfomanceSelect}
                        onChange={(e) => {
                          setFsuFcuPerfomanceSelect(e.target.value);
                        }}
                      >
                        <option value={'FSU'}>FSU Performance</option>
                        <option value={'FCU'}>FCU Performance</option>
                        <option value={'NC'}>NC Performance</option>
                      </CustomSelectField>
                    </FormControl>
                  </div>
                </MDTitleContainer>
                <FSUFCUTable
                  // tableData={
                  //   fsuFcuPerfomanceSelect === "FCU" ? FCU_Data : FSU_Data
                  // }
                  tableData={
                    fsuFcuPerfomanceSelect === 'FCU'
                      ? fsuFcuNcPerformance['fcu']
                      : fsuFcuPerfomanceSelect === 'FSU'
                      ? fsuFcuNcPerformance['fsu']
                      : fsuFcuNcPerformance['nc']
                  }
                  tableHeadTitle={
                    fsuFcuPerfomanceSelect === 'FCU'
                      ? 'N.F.C.P unit'
                      : fsuFcuPerfomanceSelect === 'FSU'
                      ? 'Filaria Survey unit'
                      : 'Night Clinic Unit'
                  }
                />
              </Card>
            </Grid>
          </Grid>
        </Box>
      </div>
    </div>
  );
}

export default NewDashboard;
