import React, { useState, useEffect, useCallback, useRef } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select, { Option } from 'react-select';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import { useLocation } from 'react-router-dom';
import DropdownService from '../../../../services/DropdownService';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import _ from 'lodash';
import { FormikProvider, useFormik } from 'formik';
import { useSelector } from 'react-redux';
// import {
//   months,
//   years,
// } from '../../../DataEntry/DE1-Lymphedema-Hydrocele-Patients/Form1-stepper-config';
import LymphedemaPatientInfoService from '../../../../services/FormLymphedemaService';
import * as Yup from 'yup';
import OptionLabel from '../../../../../helpers/selectOptionLabel';
import commonFunction from '../../../../../helpers/common/common';
import ReportService from '../../../../services/ReportService';
import TableContainer from '@material-ui/core/TableContainer';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Paper from '@material-ui/core/Paper';
import { years, months, reportTableStyle, getDistrictName } from '../../utils';
import {
  current_month,
  current_year,
  initmonth,
  previous_month,
  endMonthList,
  NoneList,
  monthList,
  yearList,
  findMonthName,
} from '../../../../../Components/constant';
import { Exportpdf } from '../../../../services/PdfService';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';
import { Menu, TablePagination as Paging } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    filterdataStyle: { textAlign: 'start', marginRight: '10px' },
    menuheading: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
      color: '#00AEE6',
    },
    menu: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '13px',
      lineHeight: '20px',
      color: '#123962',
    },
    popup: {
      paddingLeft: '10px',
      maxWidth: '850px !important',
      '&.MuiMenu-paper': {
        maxWidth: '850px !important',
      },
    },
  })
);

const Analysis1postMDAevaluation = (props) => {
  let classes = useStyles();
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const userDistrictId = useUserDistrictId() || '';
  const [initialFilterValue, setinitialFilterValue] = useState<any>({
    districtId: userDistrictId,
    year: `${current_year}`,
    startMonth: `1`,
    endMonth: `${current_month[0].value}`,
    facilityId: '',
    subCenterId: '',
    wardId: '',
    villageId: '',
    nameOfInvestigator: '',
    corporationId: '',
    talukaId: '',
    zoneId: '',
  });
  const [formdata, setFormData] = useState<any>(initialFilterValue);
  const location: any = useLocation();
  const prevDistrictRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const prevTalukaRef: any = React.useRef();
  const prevZoneRef: any = React.useRef();

  const prevCorporationRef: any = React.useRef();
  const [districtId, setdistrictId] = useState();
  const [districtName, setDistrictName] = useState('');
  const [facilityId, setfacilityId] = useState();
  const [talukaId, settalukaId] = useState();
  const [zoneId, setzoneId] = useState();
  const [corporationId, setcorporationId] = useState();
  const [reportTableData, setreportTableData] = useState<any>([]);
  const [postMDAEvalList, setpostMDAEvalList] = useState<any>([]);
  const [startMonth, setStartMonth] = useState(`1`);
  const [endMonth, setEndMonth] = useState(`${current_month[0].value}`);
  const [year, setYear] = useState(`${current_year}`);
  const [nameOfInvestigator, setnameOfInvestigator] = useState<any>();

  useEffect(() => {
    getpostcontent();
    getPatientInfo();
    getpostMDAEvalList();
    prevDistrictRef.current = districtId;
    prevFacilityRef.current = facilityId;
    prevTalukaRef.current = talukaId;
    prevZoneRef.current = zoneId;
    prevCorporationRef.current = corporationId;
    // getState(defaultStateValue[0]);
  }, []);
  const prevDistrictIdValue = prevDistrictRef.current;
  const prevFacilityIdValue = prevFacilityRef.current;
  const prevTalukaIdValue = prevTalukaRef.current;
  const prevZoneIdValue = prevZoneRef.current;
  const prevCorporationIdValue = prevCorporationRef.current;

  // MDA
  let selectTalukaRef: any = React.useRef();
  let selectCorporationRef: any = useRef();
  let selectZoneRef: any = useRef();
  let selectWardRef: any = useRef();
  let selectFacilityRef: any = useRef();
  let selectVillageRef: any = useRef();
  let selectSubcenterRef: any = useRef();
  let selectnameofInvestigatorRef: any = useRef();

  useEffect(() => {
    const data = initialFilterValue;
    postMDAEvaluation1Data(data);
  }, [initialFilterValue]);

  async function postMDAEvaluation1Data(filterData) {
    const reportData: any = await ReportService.postMDAEvaluation1(filterData);
    if (reportData && reportData.data) {
      reportData.data.forEach((o, i) => (o.key = i + 1));
      setreportTableData(reportData.data);
    }
  }
  const getpostMDAEvalList = async () => {
    const postMDAEvalList: any =
      await ReportService.getpostMDAEvalListdropdown();
    setpostMDAEvalList(postMDAEvalList.data);
    formik.setFieldValue('nameOfInvestigator', postMDAEvalList.data[0].value);
    setinitialFilterValue({
      ...initialFilterValue,
      nameOfInvestigator: postMDAEvalList.data[0].value,
    });
    setnameOfInvestigator(postMDAEvalList.data[0].label);
  };

  const getPatientInfo = async () => {
    if (location && location.state && location.state.id) {
      const getOneResult: any = await LymphedemaPatientInfoService.getStep1Info(
        location.state.id
      );
      getDistrictValues(getOneResult.data[0].districtId);
      getCorporationValues(
        getOneResult.data[0].corporationId,
        getOneResult.data[0].districtId
      );
      getFacilityValues(
        getOneResult.data[0].facilityId,
        getOneResult.data[0].districtId
      );
      getTalukaValues(
        getOneResult.data[0].talukaId,
        getOneResult.data[0].districtId
      );
      getZoneValues(
        getOneResult.data[0].zoneId,
        getOneResult.data[0].corporationId,
        getOneResult.data[0].districtId
      );
      if (getOneResult.data[0]) {
        setFormData({
          formdata,
          ...getOneResult.data[0],
        });
      }
    } else {
      setFormData({
        formdata,
        ...props,
      });
    }
  };

  let validSchema = Yup.object().shape({
    year: Yup.string().required('Year is required').nullable(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    districtId: Yup.string(),
    corporationId: Yup.string(),
    talukaId: Yup.string(),
    zoneId: Yup.string(),
    facilityId: Yup.string(),
    subCenterId: Yup.string(),
    wardId: Yup.string(),
    villageId: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
      facilityId: '',
      subCenterId: '',
      wardId: '',
      villageId: '',
      nameOfInvestigator: '',
      corporationId: '',
      talukaId: '',
      zoneId: '',
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      const {
        districtId,
        year,
        startMonth,
        endMonth,
        facilityId,
        subCenterId,
        talukaId,
      } = values;
      const data = {
        districtId: districtId ? `${districtId}` : '',
        year: `${year}`,
        startMonth: `${startMonth}`,
        endMonth: `${endMonth}`,
        facilityId: facilityId ? `${facilityId}` : '',
        subCenterId: subCenterId ? `${subCenterId}` : '',
        talukaId: `${talukaId}`,
      };
      setStartMonth(`${values.startMonth}`);
      setEndMonth(`${values.endMonth}`);
      setYear(`${values.year}`);
      setDistrictName(() =>
        getDistrictName(districtIdValues, values.districtId)
      );
      postMDAEvaluation1Data(data);
    },
    onReset: () => {
      setDistrictName(() => getDistrictName(districtIdValues, userDistrictId));
      setStartMonth('1');
      setEndMonth(`${current_month[0].value}`);
      setYear(`${current_year}`);
      setfacilityName('');
      setsubCenterName('');
      settalukaName('');
      setsubCenterIdValues([]);
      setfacilityIdValues([]);
      postMDAEvaluation1Data(initialFilterValue());
    },
  });

  let [stateIdValues, setstateIdValues] = useState([]);
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [corporationIdValues, setcorporationIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [subCenterIdValues, setsubCenterIdValues] = useState([]);
  let [wardIdValues, setwardIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  let [zoneIdValues, setzoneIdValues] = useState([]);
  let [optionTableValues, setOptionTableValues] = useState([]);
  let [cityIdValues, setcityIdValues] = useState([]);
  const [facilityName, setfacilityName] = useState('');
  const [subCenterName, setsubCenterName] = useState('');
  const [talukaName, settalukaName] = useState('');

  const zoneIdList =
    zoneIdValues &&
    zoneIdValues.map((item: any, i: any) => {
      return { label: item.zoneName, value: item.id };
    });
  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  const cityIdList =
    cityIdValues &&
    cityIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  const corporationIdList =
    corporationIdValues &&
    corporationIdValues.map((item: any, i: any) => {
      return { label: item.corporationName, value: item.id };
    });

  const talukaIdList =
    talukaIdValues &&
    talukaIdValues.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });
  const facilityIdList =
    facilityIdValues &&
    facilityIdValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });
  const subCenterIdList =
    subCenterIdValues &&
    subCenterIdValues.map((item: any, i: any) => {
      return { label: item.subCenterName, value: item.id };
    });
  const wardIdList =
    wardIdValues &&
    wardIdValues.map((item: any, i: any) => {
      return { label: item.wardName, value: item.id };
    });
  const villageIdList =
    villageIdValues &&
    villageIdValues.map((item: any, i: any) => {
      return { label: item.villageName, value: item.id };
    });
  const YearNone = {
    label: 'Unknown Year',
    value: 0,
  };

  const ageYearsList: any = [];
  Array.from(Array(100), (e, i: any) => {
    ageYearsList.push({ label: i + 1, value: i + 1 });
  });

  const ageMonthsList: any = [];
  Array.from(Array(11), (e, i: any) => {
    ageMonthsList.push({ label: i + 1, value: i + 1 });
  });

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
      if (!((e && e.value) == prevDistrictIdValue)) {
        if ((e && e.value) == null) {
          formik.setFieldValue('talukaId', 0);
          formik.setFieldValue('facilityId', 0);
          formik.setFieldValue('subCenterId', 0);
          formik.setFieldValue('villageId', 0);
          formik.setFieldValue('wardId', 0);
          formik.setFieldValue('zoneId', 0);
          formik.setFieldValue('corporationId', 0);
        }
        const corporationId: any = await DropdownService.getOneCorporation(
          e && e.value
        );
        console.log(corporationId);
        if (
          corporationId &&
          corporationId.data &&
          corporationId.data.length > 0
        ) {
          let corporationData: any = [
            OptionLabel.corporationNone,
            ...corporationId.data,
          ];
          corporationData = [
            OptionLabel.corporationSelectLabel,
            ...corporationData,
          ];
          formik.setFieldValue('corporationId', '');
          formik.setFieldValue('wardId', 0);
          formik.setFieldValue('zoneId', 0);
          setcorporationIdValues(corporationData);
        } else {
          let corporationData: any = [OptionLabel.corporationNone];
          setcorporationIdValues(corporationData);
          formik.setFieldValue('corporationId', 0);
          formik.setFieldValue('wardId', 0);
          formik.setFieldValue('zoneId', 0);
        }
        const talukaId: any = await DropdownService.getOneTaluka(e && e.value);
        if (talukaId && talukaId.data && talukaId.data.length > 0) {
          formik.setFieldValue('talukaId', '');
          formik.setFieldValue('villageId', 0);
          let talukaList: any = [OptionLabel.talukaNone, ...talukaId.data];
          talukaList = [OptionLabel.talukaSelect, ...talukaList];
          settalukaIdValues(talukaList);
        } else {
          let Data: any = [OptionLabel.talukaNone];
          settalukaIdValues(Data);
          formik.setFieldValue('talukaId', 0);
        }
        const facilityId: any = await DropdownService.getOneFacility(
          e && e.value
        );
        if (facilityId && facilityId.data && facilityId.data.length > 0) {
          formik.setFieldValue('facilityId', '');
          formik.setFieldValue('subCenterId', 0);
          let facilityList: any = [
            OptionLabel.facilityNoneLabel,
            ...facilityId.data,
          ];
          facilityList = [OptionLabel.facilitySelectLabel, ...facilityList];
          setfacilityIdValues(facilityList);
        } else {
          let Data: any = [OptionLabel.facilityNoneLabel];
          setfacilityIdValues(Data);
          formik.setFieldValue('facilityId', 0);
        }
      }
    }
  }

  async function getDistrictValues(e: any) {
    if (e) {
      const corporationId: any = await DropdownService.getOneCorporation(e);
      if (
        corporationId &&
        corporationId.data &&
        corporationId.data.length > 0
      ) {
        let corporationData: any = [
          OptionLabel.corporationNone,
          ...corporationId.data,
        ];
        setcorporationIdValues(corporationData);
      } else {
        let Data: any = [OptionLabel.corporationSelectLabel];
        setcorporationIdValues(Data);
        formik.setFieldValue('corporationId', 0);
      }
      const talukaId: any = await DropdownService.getOneTaluka(e);
      if (talukaId && talukaId.data && talukaId.data.length > 0) {
        let talukaList: any = [OptionLabel.talukaNone, ...talukaId.data];
        settalukaIdValues(talukaList);
      } else {
        let Data: any = [OptionLabel.talukaNone];
        settalukaIdValues(Data);
        formik.setFieldValue('talukaId', 0);
      }

      const facilityId: any = await DropdownService.getOneFacility(e);
      if (facilityId && facilityId.data && facilityId.data.length > 0) {
        let facilityList: any = [
          OptionLabel.facilityNoneLabel,
          ...facilityId.data,
        ];
        setfacilityIdValues(facilityList);
      } else {
        let Data: any = [OptionLabel.facilityNoneLabel];
        setfacilityIdValues(Data);
        formik.setFieldValue('facilityId', 0);
      }
    }
  }

  async function getCorporation(e: any) {
    if (e && e.value) {
      setcorporationId(e && e.value);

      if (!((e && e.value) == prevCorporationIdValue)) {
        if ((e && e.value) == null) {
          formik.setFieldValue('zoneId', 0);
          formik.setFieldValue('wardId', 0);
        }
        let zoneId: any = await DropdownService.getOneZone(
          e && e.value,
          formik.values.districtId
        );
        if (zoneId && zoneId.data && zoneId.data.length > 0) {
          formik.setFieldValue('zoneId', '');
          formik.setFieldValue('wardId', 0);
          let facilityList: any = [OptionLabel.zoneNoneLabel, ...zoneId.data];
          facilityList = [OptionLabel.zoneSelectLabel, ...facilityList];
          setzoneIdValues(facilityList);
        } else {
          let Data: any = [OptionLabel.zoneNoneLabel];
          setzoneIdValues(Data);
          formik.setFieldValue('zoneId', 0);
        }
      }
    }
  }
  async function getCorporationValues(e: any, id: any) {
    if (e) {
      let zoneId: any = await DropdownService.getOneZone(e, id);
      if (zoneId && zoneId.data && zoneId.data.length > 0) {
        let Data: any = [OptionLabel.zoneNoneLabel, ...zoneId.data];
        setzoneIdValues(Data);
      } else {
        let Data: any = [OptionLabel.zoneNoneLabel];
        setzoneIdValues(Data);
        formik.setFieldValue('zoneId', 0);
      }
    }
  }

  async function getTaluka(e: any) {
    if (e && e.value) {
      settalukaId(e && e.value);

      if (!((e && e.value) == prevTalukaIdValue)) {
        if ((e && e.value) == null) {
          formik.setFieldValue('villageId', 0);
        }
        let Village: any = await DropdownService.getOneVillage(
          e && e.value,
          formik.values.districtId
        );
        if (Village && Village.data && Village.data.length > 0) {
          formik.setFieldValue('villageId', '');
          let villagelist: any = [
            OptionLabel.villageNoneLabel,
            ...Village.data,
          ];
          villagelist = [OptionLabel.villageSelectLabel, ...villagelist];
          setvillageIdValues(villagelist);
        } else {
          let Data: any = [OptionLabel.villageNoneLabel];
          setvillageIdValues(Data);
          formik.setFieldValue('villageId', 0);
        }
      }
    }
  }
  async function getTalukaValues(e: any, id: any) {
    if (e) {
      let Village: any = await DropdownService.getOneVillage(e, id);
      console.log(Village);
      console.log(e);
      if (Village && Village.data && Village.data.length > 0) {
        let Data: any = [OptionLabel.villageNoneLabel, ...Village.data];
        setvillageIdValues(Data);
      } else {
        let Data: any = [OptionLabel.villageNoneLabel];
        setvillageIdValues(Data);
        formik.setFieldValue('villageId', 0);
      }
    }
  }

  async function getFacility(e: any) {
    if (e && e.value) {
      setfacilityId(e && e.value);

      if (!((e && e.value) == prevFacilityIdValue)) {
        if ((e && e.value) == null) {
          formik.setFieldValue('subCenterId', 0);
        }
        let Subcenter: any = await DropdownService.getOneSubCenter(
          e && e.value,
          formik.values.districtId
        );
        if (Subcenter && Subcenter.data && Subcenter.data.length > 0) {
          formik.setFieldValue('subCenterId', '');
          let subcenterlist: any = [
            OptionLabel.subCenterNoneLabel,
            ...Subcenter.data,
          ];
          subcenterlist = [OptionLabel.subCenterSelectLabel, ...subcenterlist];
          setsubCenterIdValues(subcenterlist);
        } else {
          let Data: any = [OptionLabel.subCenterNoneLabel];
          setsubCenterIdValues(Data);
          formik.setFieldValue('subCenterId', 0);
        }
      }
    }
  }

  async function getFacilityValues(e: any, id: any) {
    if (e) {
      let Subcenter: any;
      Subcenter = await DropdownService.getOneSubCenter(e, id);
      if (Subcenter && Subcenter.data && Subcenter.data.length > 0) {
        let Data: any = [OptionLabel.subCenterNoneLabel, ...Subcenter.data];
        setsubCenterIdValues(Data);
      } else {
        let Data: any = [OptionLabel.subCenterNoneLabel];
        setsubCenterIdValues(Data);
        formik.setFieldValue('subCenterId', 0);
      }
    }
  }

  async function getZone(e: any) {
    if (e && e.value) {
      setzoneId(e && e.value);
      console.log('current value', e && e.value);
      console.log('previous value', prevZoneIdValue);
      if (!((e && e.value) == prevZoneIdValue)) {
        if ((e && e.value) == null) {
          formik.setFieldValue('wardId', 0);
        }
        let wardId: any;
        wardId = await DropdownService.getOneWard(
          e && e.value,
          formik.values.districtId
        );
        if (wardId && wardId.data && wardId.data.length > 0) {
          formik.setFieldValue('wardId', '');
          let wardlist: any = [OptionLabel.wardNoneLabel, ...wardId.data];
          wardlist = [OptionLabel.wardSelectLabel, ...wardlist];
          setwardIdValues(wardlist);
        } else {
          let Data: any = [OptionLabel.wardNoneLabel];
          setwardIdValues(Data);
          formik.setFieldValue('wardId', 0);
        }
      }
    }
  }

  async function getZoneValues(e: any, corporationId: any, districtId: any) {
    if (e && e.value) {
      const wardId = await DropdownService.getOneWard(
        corporationId,
        districtId
      );
      if (wardId && wardId.data && wardId.data.length > 0) {
        let wardlist: any = [OptionLabel.wardNoneLabel, ...wardId.data];
        setwardIdValues(wardlist);
      } else {
        let Data: any = [OptionLabel.wardNoneLabel];
        setwardIdValues(Data);
        formik.setFieldValue('wardId', 0);
      }
    }
  }

  async function getpostcontent() {
    const stateId: any = await DropdownService.getStateInfo();
    if (stateId && stateId.data) {
      setstateIdValues(stateId.data);
    }
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
      setDistrictName(() => getDistrictName(districtId.data, userDistrictId));
    }

    const cityId: any = await DropdownService.getDistrictInfo();
    if (cityId && cityId.data && cityId.data.length > 0) {
      setcityIdValues(cityId.data);
    }

    const genderdata: any = await DropdownService.getUnitAction();
    if (genderdata && genderdata.data) {
      setOptionTableValues(genderdata.data);
    }
  }

  return (
    <div>
      <style>{`
    td {
      padding: 6px 20px;
      white-space: nowrap;
    }
  `}</style>
      <div
        style={{
          backgroundColor: '#ffff',
          borderRadius: '10px',
        }}
      >
        <div style={{ display: 'flex', marginTop: '2%', marginBottom: '2%' }}>
          <p className='rpthead'>
            Evaluation of MDA Compliance for a village /Urban area
          </p>
          <div
            style={{
              display: 'flex',
              marginLeft: 'auto',
            }}
          >
            <button
              className='mt-m font-chng btn btn-secondary1'
              onClick={() =>
                Exportpdf(
                  'table-to-xlsnew',
                  `Evaluation of MDA Compliance for a village /Urban area.pdf`,
                  'p',
                  210,
                  295
                )
              }
            >
              Export as PDF
            </button>
            <ReactHTMLTableToExcel
              className='mt-m font-chng btn btn-secondary1'
              id='test-table-xls-button'
              table='table-to-xlsnew'
              filename='Evaluation of MDA Compliance for a village /Urban area'
              sheet='Evaluation of MDA Compliance for a village /Urban area'
              buttonText=' Export as xsl'
            />

            <PopupState variant='popover' popupId='demo-popup-menu'>
              {(popupState) => (
                <div>
                  <FilterListIcon
                    style={{
                      marginRight: '15px',
                      cursor: 'pointer',
                      float: 'right',
                      marginTop: '50%',
                      margin: 'auto',
                    }}
                    {...bindTrigger(popupState)}
                  >
                    Filter
                  </FilterListIcon>
                  <Menu {...bindMenu(popupState)} style={{ padding: '0px' }}>
                    <div className={classes.popup}>
                      <div style={{ display: 'flex' }}>
                        <FormikProvider value={formik}>
                          <form
                            onSubmit={formik.handleSubmit}
                            onChange={formik.handleChange}
                          >
                            <Row className='mb-3'>
                              <div className='col-md-12 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='districtId'
                                    className='form-label font-chng'
                                  >
                                    District
                                  </label>
                                  {districtIdValues &&
                                  districtIdValues.length !== 0 ? (
                                    <Select
                                      name='districtId'
                                      styles={commonFunction.customStyles}
                                      options={districtIdList}
                                      isClearable='true'
                                      isDisabled={!!userDistrictId}
                                      className={
                                        formik.errors.districtId &&
                                        formik.touched.districtId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      value={
                                        districtIdList
                                          ? districtIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ==
                                                  formik.values.districtId
                                            )
                                          : ''
                                      }
                                      isSearchable='true'
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'districtId',
                                          option && option.value
                                        );
                                        getDistrict(option);
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      name='districtId'
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      //options={NoneList}
                                      className='custom-select'
                                      options={NoneList}
                                      isClearable='true'
                                      value={
                                        NoneList
                                          ? NoneList.find(
                                              (option) =>
                                                option &&
                                                option.value ==
                                                  formik.values.districtId
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'districtId',
                                          option && option.value
                                        );
                                        getDistrict(option);
                                      }}
                                    ></Select>
                                  )}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.districtId
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-12 col-xl-8 col-12'>
                                {' '}
                                <label className='form-label font-chng'>
                                  Month
                                </label>
                                <Row>
                                  <div className='col-md-1 col-xl-1 col-12'>
                                    <label
                                      className='form-label font-chng'
                                      style={{ paddingTop: '6px' }}
                                    >
                                      From
                                    </label>
                                  </div>
                                  <div className='col-md-5 col-xl-5 col-12'>
                                    <div className='form-grp'>
                                      <Select
                                        menuPortalTarget={document.body}
                                        styles={{
                                          menuPortal: (base) => ({
                                            ...base,
                                            zIndex: '9999',
                                          }),
                                          control: (base) => ({
                                            ...base,
                                            borderColor: '#ced4da',
                                            fontSize: '14px',
                                            color: '#212529',
                                            minHeight: '35px',
                                            height: '35px',
                                            '&:hover': {
                                              borderColor: '#ced4da',
                                            },
                                          }),
                                          menu: (base) => ({
                                            top: '100%',
                                            backgroundColor: 'hsl(0, 0%, 100%)',
                                            borderRadius: '4',
                                            boxShadow:
                                              '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                            marginBottom: '8px',
                                            marginTop: '8px',
                                            position: 'absolute',
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            zIndex: '9999',
                                          }),
                                          placeholder: (base) => ({
                                            color: '#212529',
                                            fontSize: '13px',
                                          }),
                                          indicatorContainer: (base) => ({
                                            color: '#212529',
                                          }),
                                        }}
                                        className={
                                          formik.errors.startMonth &&
                                          formik.touched.startMonth
                                            ? 'custom-select is-invalid'
                                            : 'custom-select'
                                        }
                                        name='startMonth'
                                        isClearable='true'
                                        value={
                                          formik.values.startMonth !== ''
                                            ? monthList
                                              ? monthList.find(
                                                  (option: any) =>
                                                    option &&
                                                    option.value ==
                                                      formik.values.startMonth
                                                )
                                              : ''
                                            : monthList.find(
                                                (option: any) =>
                                                  option &&
                                                  option.value == previous_month
                                              )
                                        }
                                        options={monthList}
                                        onChange={(option: Option) => {
                                          formik.setFieldValue(
                                            'startMonth',
                                            option ? option.value : ''
                                          );
                                          formik.setFieldValue(
                                            'endMonth',
                                            option ? option.value : ''
                                          );
                                          // setstartMonth(
                                          //   option ? option.label : ''
                                          // );
                                        }}
                                      ></Select>
                                      <div className={'invalid-feedback'}>
                                        {formik.errors
                                          ? formik.errors.startMonth
                                          : ''}
                                      </div>
                                    </div>
                                  </div>
                                  <div className='col-md-1 col-xl-1 col-12'>
                                    <label
                                      className='form-label font-chng'
                                      style={{ paddingTop: '6px' }}
                                    >
                                      &nbsp;&nbsp;To
                                    </label>
                                  </div>
                                  <div className='col-md-5 col-xl-5 col-12'>
                                    <div className='form-grp'>
                                      <Select
                                        menuPortalTarget={document.body}
                                        styles={{
                                          menuPortal: (base) => ({
                                            ...base,
                                            zIndex: '9999',
                                          }),
                                          control: (base) => ({
                                            ...base,
                                            borderColor: '#ced4da',
                                            fontSize: '14px',
                                            color: '#212529',
                                            minHeight: '35px',
                                            height: '35px',
                                            '&:hover': {
                                              borderColor: '#ced4da',
                                            },
                                          }),
                                          menu: (base) => ({
                                            top: '100%',
                                            backgroundColor: 'hsl(0, 0%, 100%)',
                                            borderRadius: '4',
                                            boxShadow:
                                              '0 0 0 1px hsl(0deg 0% 0% / 10%), 0 4px 11px hsl(0deg 0% 0% / 10%)',
                                            marginBottom: '8px',
                                            marginTop: '8px',
                                            position: 'absolute',
                                            width: '100%',
                                            boxSizing: 'border-box',
                                            zIndex: '9999',
                                          }),
                                          placeholder: (base) => ({
                                            color: '#212529',
                                            fontSize: '13px',
                                          }),
                                          indicatorContainer: (base) => ({
                                            color: '#212529',
                                          }),
                                        }}
                                        className={
                                          formik.errors.endMonth &&
                                          formik.touched.endMonth
                                            ? 'custom-select is-invalid'
                                            : 'custom-select'
                                        }
                                        name='endMonth'
                                        isClearable='true'
                                        value={
                                          formik.values.endMonth !== ''
                                            ? endMonthList(
                                                formik.values.startMonth
                                              )?.find(
                                                (option: any) =>
                                                  option &&
                                                  option.value ==
                                                    formik.values.endMonth
                                              )
                                            : endMonthList(
                                                formik.values.startMonth
                                              )?.find(
                                                (option: any) =>
                                                  option &&
                                                  option.value == previous_month
                                              )
                                        }
                                        options={
                                          formik.values.startMonth
                                            ? endMonthList(
                                                formik.values.startMonth
                                              )
                                            : NoneList
                                        }
                                        onChange={(option: Option) => {
                                          formik.setFieldValue(
                                            'endMonth',
                                            option ? option.value : ''
                                          );
                                          // setendMonth(
                                          //   option ? option.label : ''
                                          // );
                                        }}
                                      ></Select>
                                      <div className={'invalid-feedback'}>
                                        {formik.errors
                                          ? formik.errors.endMonth
                                          : ''}
                                      </div>
                                    </div>
                                  </div>
                                </Row>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    Year
                                  </label>
                                  <Select
                                    isDisabled={
                                      location.state && location.state.view
                                        ? true
                                        : false
                                    }
                                    styles={commonFunction.customStyles}
                                    className={
                                      formik.errors.year && formik.touched.year
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    name='year'
                                    isClearable='true'
                                    value={
                                      yearList
                                        ? yearList.find(
                                            (option: any) =>
                                              option &&
                                              option.value == formik.values.year
                                          )
                                        : ''
                                    }
                                    options={yearList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'year',
                                        option && option.value
                                      );
                                    }}
                                  ></Select>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.year : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='corporationId'
                                    className='form-label font-chng'
                                  >
                                    Corporation
                                  </label>
                                  {corporationIdValues &&
                                  corporationIdValues.length !== 0 ? (
                                    <Select
                                      ref={selectCorporationRef}
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      options={corporationIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.corporationId &&
                                        formik.touched.corporationId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='corporationId'
                                      value={
                                        corporationIdList
                                          ? corporationIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ==
                                                  formik.values.corporationId
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'corporationId',
                                          option && option.value
                                        );
                                        getCorporation(option);
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      ref={selectCorporationRef}
                                      name='corporationId'
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      className='custom-select'
                                      options={NoneList}
                                      isClearable='true'
                                      value={
                                        NoneList
                                          ? NoneList.find(
                                              (option: any) =>
                                                option && option.value == 0
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'corporationId',
                                          option && option.value
                                        );
                                        getCorporation(option);
                                      }}
                                    ></Select>
                                  )}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.corporationId
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='talukaId'
                                    className='form-label font-chng'
                                  >
                                    Taluka
                                  </label>
                                  {talukaIdValues &&
                                  talukaIdValues.length !== 0 ? (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectTalukaRef}
                                      className={
                                        formik.errors.talukaId &&
                                        formik.touched.talukaId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      isClearable='true'
                                      name='talukaId'
                                      options={talukaIdList}
                                      value={
                                        talukaIdList
                                          ? talukaIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ==
                                                  formik.values.talukaId
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'talukaId',
                                          option && option.value
                                        );
                                        getTaluka(option);
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectTalukaRef}
                                      className={
                                        formik.errors.talukaId &&
                                        formik.touched.talukaId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='talukaId'
                                      options={NoneList}
                                      isClearable='true'
                                      value={
                                        NoneList
                                          ? NoneList.find(
                                              (option) =>
                                                option && option.value == 0
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'talukaId',
                                          option && option.value
                                        );
                                        getTaluka(option);
                                      }}
                                    ></Select>
                                  )}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.talukaId
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='zoneId'
                                    className='form-label font-chng'
                                  >
                                    Zone
                                  </label>
                                  {zoneIdValues && zoneIdValues.length !== 0 ? (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectZoneRef}
                                      options={zoneIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.zoneId &&
                                        formik.touched.zoneId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='zoneId'
                                      value={
                                        zoneIdList
                                          ? zoneIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ==
                                                  formik.values.zoneId
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'zoneId',
                                          option && option.value
                                        );
                                        getZone(option);
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectZoneRef}
                                      options={NoneList}
                                      isClearable='true'
                                      className={
                                        formik.errors.zoneId &&
                                        formik.touched.zoneId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='zoneId'
                                      value={
                                        NoneList
                                          ? NoneList.find(
                                              (option) =>
                                                option && option.value == 0
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'zoneId',
                                          option && option.value
                                        );
                                        getZone(option);
                                      }}
                                    ></Select>
                                  )}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.zoneId : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    Ward
                                  </label>
                                  {wardIdValues && wardIdValues.length !== 0 ? (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectWardRef}
                                      options={wardIdList}
                                      className={
                                        formik.errors.wardId &&
                                        formik.touched.wardId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='wardId'
                                      isClearable='true'
                                      value={
                                        wardIdList
                                          ? wardIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ==
                                                  formik.values.wardId
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'wardId',
                                          option && option.value
                                        );
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectWardRef}
                                      options={NoneList}
                                      className={
                                        formik.errors.wardId &&
                                        formik.touched.wardId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='wardId'
                                      isClearable='true'
                                      value={
                                        NoneList
                                          ? NoneList.find(
                                              (option) =>
                                                option && option.value == 0
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'wardId',
                                          option && option.value
                                        );
                                      }}
                                    ></Select>
                                  )}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.wardId : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    Village
                                  </label>
                                  {villageIdValues &&
                                  villageIdValues.length !== 0 ? (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectVillageRef}
                                      options={villageIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.villageId &&
                                        formik.touched.villageId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='villageId'
                                      value={
                                        villageIdList
                                          ? villageIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ==
                                                  formik.values.villageId
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'villageId',
                                          option && option.value
                                        );
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectVillageRef}
                                      options={NoneList}
                                      isClearable='true'
                                      className={
                                        formik.errors.villageId &&
                                        formik.touched.villageId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='villageId'
                                      value={
                                        NoneList
                                          ? NoneList.find(
                                              (option) =>
                                                option && option.value == 0
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'villageId',
                                          option && option.value
                                        );
                                      }}
                                    ></Select>
                                  )}{' '}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.villageId
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    Facility
                                  </label>
                                  {facilityIdValues &&
                                  facilityIdValues.length !== 0 ? (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectFacilityRef}
                                      options={facilityIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.facilityId &&
                                        formik.touched.facilityId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='facilityId'
                                      value={
                                        facilityIdList
                                          ? facilityIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ==
                                                  formik.values.facilityId
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'facilityId',
                                          option && option.value
                                        );
                                        getFacility(option);
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectFacilityRef}
                                      options={NoneList}
                                      isClearable='true'
                                      className={
                                        formik.errors.facilityId &&
                                        formik.touched.facilityId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='facilityId'
                                      value={
                                        NoneList
                                          ? NoneList.find(
                                              (option) =>
                                                option && option.value == 0
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'facilityId',
                                          option && option.value
                                        );
                                        getFacility(option);
                                      }}
                                    ></Select>
                                  )}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.facilityId
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    Sub Center
                                  </label>
                                  {subCenterIdValues &&
                                  subCenterIdValues.length !== 0 ? (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectSubcenterRef}
                                      options={subCenterIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.subCenterId &&
                                        formik.touched.subCenterId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='subCenterId'
                                      value={
                                        subCenterIdList
                                          ? subCenterIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ==
                                                  formik.values.subCenterId
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'subCenterId',
                                          option && option.value
                                        );
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      isDisabled={
                                        location.state && location.state.view
                                          ? true
                                          : false
                                      }
                                      styles={commonFunction.customStyles}
                                      ref={selectSubcenterRef}
                                      options={NoneList}
                                      isClearable='true'
                                      className={
                                        formik.errors.subCenterId &&
                                        formik.touched.subCenterId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      name='subCenterId'
                                      value={
                                        NoneList
                                          ? NoneList.find(
                                              (option) =>
                                                option && option.value == 0
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'subCenterId',
                                          option && option.value
                                        );
                                      }}
                                    ></Select>
                                  )}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.subCenterId
                                      : ''}
                                  </div>
                                </div>
                              </div>

                              <div className='col-md-6'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='nameOfInvestigator'
                                    className='form-label font-chng'
                                  >
                                    Name of Investigator
                                  </label>
                                  <Select
                                    menuPortalTarget={document.body}
                                    styles={commonFunction.customStyles}
                                    ref={selectnameofInvestigatorRef}
                                    options={postMDAEvalList}
                                    isClearable='true'
                                    className={
                                      formik.errors.nameOfInvestigator &&
                                      formik.touched.nameOfInvestigator
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    name='nameOfInvestigator'
                                    value={
                                      formik.values.nameOfInvestigator == ''
                                        ? postMDAEvalList[0]
                                        : postMDAEvalList?.find(
                                            (option) =>
                                              option &&
                                              option.value ==
                                                formik.values.nameOfInvestigator
                                          )
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'nameOfInvestigator',
                                        option && option.value
                                      );
                                      setnameOfInvestigator(
                                        option && option.label
                                      );
                                    }}
                                  ></Select>
                                </div>
                              </div>
                              <div
                                className='col-md-6 col-xl-12 col-12 right-wrappernew '
                                style={{
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  alignItems: 'center',
                                }}
                              >
                                <button
                                  onClick={popupState.close}
                                  className='mt-m font-chng btn btn-secondary1'
                                  type='submit'
                                >
                                  Filter
                                </button>
                                <button
                                  className='mt-m font-chng btn btn-secondary1'
                                  type='reset'
                                  onClick={() => {
                                    formik.resetForm();
                                  }}
                                  style={{ marginLeft: '10px' }}
                                >
                                  Clear
                                </button>
                              </div>
                            </Row>
                          </form>
                        </FormikProvider>

                        <Icon
                          onClick={popupState.close}
                          style={{ height: '2em' }}
                        >
                          <CloseIcon
                            style={{ width: '1rem', cursor: 'pointer' }}
                          />
                        </Icon>
                      </div>
                    </div>
                  </Menu>
                </div>
              )}
            </PopupState>
          </div>
        </div>
        <div style={{ display: 'flex', marginBottom: '1%' }}>
          <div className={classes.filterdataStyle}>
            {startMonth !== '' ? `Month from - ` : ''}
            {startMonth !== '' && <b> {findMonthName(startMonth)}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {endMonth !== '' ? `Month to -  ` : ''}
            {endMonth !== '' && <b>{findMonthName(endMonth)}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {year !== '' ? `Year - ` : ''}
            {year !== '' && <b> {year}</b>}
          </div>{' '}
          <div className={classes.filterdataStyle}>
            {districtName !== '' ? `District - ` : ''}
            {districtName !== '' && <b> {districtName}</b>}
          </div>{' '}
        </div>
        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table id='table-to-xlsnew'>
              <thead>
                {' '}
                <tr>
                  <td rowSpan={2} height='64'>
                    <b>Sr.No</b>
                  </td>
                  <td rowSpan={2}>
                    {' '}
                    <b>Particulars </b>
                  </td>
                  <td colSpan={reportTableData.length}>
                    {' '}
                    <b>House Number</b>
                  </td>
                </tr>
              </thead>

              <tr>
                {reportTableData.map((data: any, index: any) => {
                  return (
                    <td>
                      <b>{index + 1}</b>
                    </td>
                  );
                })}
              </tr>
              <tr>
                <td height='29'>1</td>
                <td>No. of persons interviewed</td>
                {reportTableData.map((data: any) => {
                  return <td>{data.NoOfPersonsInterviewed}</td>;
                })}
              </tr>
              <tr>
                <td height='29'>2</td>
                <td>No. of beneficiaries in the house</td>
                {reportTableData.map((data: any) => {
                  return <td>{data.NoOfBeneficiaries}</td>;
                })}
              </tr>
              <tr>
                <td height='29'>3</td>
                <td>No. of persons consumed tablets</td>
                {reportTableData.map((data: any) => {
                  return <td>{data.NoOfPersonsConsumed}</td>;
                })}
              </tr>
              <tr>
                <td height='29'>4</td>
                <td>No. of persons did not consume tablets </td>
                {reportTableData.map((data: any) => {
                  return <td>{data.NoOfPersonsNotConsumed}</td>;
                })}
              </tr>
              <tr>
                <td height='29'>5</td>
                <td>Percentage consumption</td>
                {reportTableData.map((data: any) => {
                  return <td>{data.percentageConsumption}</td>;
                })}
              </tr>
              <tr>
                <td height='29'>6</td>
                <td>Did the DD Visit the house ? Y/N</td>
                {reportTableData.map((data: any) => {
                  return <td>{data.DidDDVisitHouse}</td>;
                })}
              </tr>
              <tr>
                <td height='29'>7</td>
                <td>Percentage of houses visited</td>
                {reportTableData.map((data: any) => {
                  return <td>{data.PercentageOfHousesVisited}</td>;
                })}
              </tr>
              <tr>
                <td height='42'>8</td>
                <td>
                  No. of beneficiaries swallowed tablets
                  <br /> in presence of drug distributor{' '}
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='42'>9</td>
                <td>
                  Percentage of beneficiaries swallowed tablets
                  <br /> in presence of drug distributor
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td rowSpan={9} height='259' align='center' valign='middle'>
                  10
                </td>
                <td>
                  <b>Reasons for not swallowing the drugs </b>
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td>a) No. information about LF/MDA/DEC</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td>b)Fear of drug </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td>
                  c) Beneficiaries on empty stomach at the time <br />
                  of DD's visit
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td>d) Side reactions of drugs</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td>
                  e) Beneficiaries not suffering from LF, Why they
                  <br /> should take DEC ?
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td>f) Complications of previous year's MDA </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td>g) Others - specify</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td>h) Others - specify</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='21'>11</td>
                <td>
                  <b>
                    Opinion of Beneficiaries as who should be
                    <br /> the drug distributors ?{' '}
                  </b>
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>a) ANM</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>b) Health Worker (Male)</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>c) Anganwadi Worker</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>d) NGO</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>e) Volunteer</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>f) Student</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>g) Others - specify</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>h) Others - specify</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='21'>12</td>
                <td>
                  <b>Sources of information about MDA activity ?</b>
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>a) ANM</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>b) Health Worker (Male)</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>c) Anganwadi Worker</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>d) Volunteer</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>e) Miking</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>f) Davandi</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>g) Radio</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>h) TV</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>i) Newspapers</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>j) Handbills </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>k) Others</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='21'>13</td>
                <td>No. of beneficiaries experienced side effects of DEC</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='27'>14</td>
                <td>
                  <b>Details of Side effects of DEC</b>
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>a) Nausea, vomiting </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>b) Headache</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>c) Fever</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>d) Rash</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>e) Dehydration</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>f) Fainting attact</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>g) Others - specify</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='21'>15</td>
                <td>
                  No of beneficiaries aware about the nearest
                  <br /> treatment facility center for treating side effects of
                  DEC
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>16</td>
                <td>If treated, place of treatment</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>a) PHC</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>b) Rural Hospital /Govt. Hospital</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>c) Private practitioners</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
              <tr>
                <td height='29'>
                  <br />
                </td>
                <td>d) Others</td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
                <td>
                  <br />
                </td>
              </tr>
            </table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Analysis1postMDAevaluation;
