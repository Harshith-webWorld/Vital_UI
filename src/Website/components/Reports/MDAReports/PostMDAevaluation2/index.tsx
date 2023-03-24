import React, { useState, useEffect, useCallback } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select, { Option } from 'react-select';
import { years, months, reportTableStyle, getDistrictName } from '../../utils';
import DropdownService from '../../../../services/DropdownService';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FormikProvider, useFormik } from 'formik';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import commonFunction from '../../../../../helpers/common/common';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import ReportService from '../../../../services/ReportService';
import _ from 'lodash';
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
const Analysis2postMDAevaluation = (props) => {
  let classes = useStyles();
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const prevDistrictRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const prevSubcenterRef: any = React.useRef();
  const prevWardRef: any = React.useRef();
  const prevVillageRef: any = React.useRef();
  const prevTalukaRef: any = React.useRef();
  const prevCorporationRef: any = React.useRef();

  const [startMonth, setStartMonth] = useState(`1`);
  const [endMonth, setEndMonth] = useState(`${current_month[0].value}`);
  const [year, setYear] = useState(`${current_year}`);
  const userDistrictId = useUserDistrictId() || '';
  const [districtId, setdistrictId] = useState();
  const [districtName, setDistrictName] = useState('');
  const [facilityId, setfacilityId] = useState();
  const [talukaId, settalukaId] = useState();
  const [subcenterId, setsubcenterId] = useState();
  const [wardId, setwardId] = useState();
  const [villageId, setVillageId] = useState();
  const [corporationId, setCorporationId] = useState();
  const [reportTableData, setReportTableData] = useState([]);

  useEffect(() => {
    getpostcontent();
    prevDistrictRef.current = districtId;
    prevFacilityRef.current = facilityId;
    prevSubcenterRef.current = subcenterId;
    prevWardRef.current = wardId;
    prevVillageRef.current = villageId;
    prevTalukaRef.current = talukaId;
    prevCorporationRef.current = corporationId;
  }, []);

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('district is required').nullable(),
    }),
    facilityId: Yup.string(),
    subCenterId: Yup.string(),
    wardId: Yup.string(),
    villageId: Yup.string(),
    corporationId: Yup.string(),
    talukaId: Yup.string(),
    nameOfInvestigator: Yup.string(),
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
      getreportData(data);
    },
    onReset: () => {
      setDistrictName(() => getDistrictName(districtIdValues, userDistrictId));
      setStartMonth('1');
      setEndMonth(`${current_month[0].value}`);
      setYear(`${current_year}`);
      setSubcenterIdValues([]);
      setFacilityIdValues([]);
      getreportData(initialFilterValue());
    },
  });

  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [facilityIdValues, setFacilityIdValues] = useState([]);
  let [subcenterIdValues, setSubcenterIdValues] = useState([]);
  let [wardIdValues, setWardIdValues] = useState([]);
  let [villageIdValues, setVillageIdValues] = useState([]);
  let [talukaIdValues, setTalukaIdValues] = useState([]);
  let [corporationIdValues, setCorporationIdValues] = useState([]);

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  const facilityIdList =
    facilityIdValues &&
    facilityIdValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });
  const subcenterIdList =
    subcenterIdValues &&
    subcenterIdValues.map((item: any, i: any) => {
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
  const talukaIdList =
    talukaIdValues &&
    talukaIdValues.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });
  const corporationIdList =
    corporationIdValues &&
    corporationIdValues.map((item: any, i: any) => {
      return { label: item.corporationName, value: item.id };
    });

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
    }
  }
  async function getsubcenter(e: any) {
    if (e && e.value) {
      setsubcenterId(e && e.value);
    }
  }
  async function getfacility(e: any) {
    if (e && e.value) {
      setfacilityId(e && e.value);
    }
  }
  async function getward(e: any) {
    if (e && e.value) {
      setwardId(e && e.value);
    }
  }
  async function getvillage(e: any) {
    if (e && e.value) {
      setVillageId(e && e.value);
    }
  }
  async function gettaluka(e: any) {
    if (e && e.value) {
      settalukaId(e && e.value);
    }
  }
  async function getcorporation(e: any) {
    if (e && e.value) {
      setCorporationId(e && e.value);
    }
  }

  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
      facilityId: '',
      subCenterId: '',
      wardId: '',
      villageId: '',
      nameOfInvestigator: '',
    };
  }, []);

  async function getreportData(filterdata: any) {
    const reportData: any = await ReportService.postMDAEvaluation2(filterdata);
    if (reportData && reportData.data) {
      setReportTableData(reportData.data);
    }
  }

  useEffect(() => {
    const data = initialFilterValue;
    getreportData(data);
  }, [initialFilterValue]);

  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data) {
      setdistrictIdValues(districtId.data);
    }
  }
  const gettalukaList = useCallback(() => {
    async function getData() {
      if (formik.values.districtId) {
        const talukaId: any = await DropdownService.getOneTaluka(
          formik.values.districtId
        );
        if (talukaId && talukaId.data) {
          setTalukaIdValues(talukaId.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId]);

  const getCorporationList = useCallback(() => {
    async function getData() {
      if (formik.values.districtId) {
        const corporationId: any = await DropdownService.getOneCorporation(
          formik.values.districtId
        );
        if (corporationId && corporationId.data) {
          setCorporationIdValues(corporationId.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId]);

  const getfacilityList = useCallback(() => {
    async function getData() {
      if (formik.values.districtId) {
        const facilityId: any = await DropdownService.getOneFacility(
          formik.values.districtId
        );
        if (facilityId && facilityId.data) {
          setFacilityIdValues(facilityId.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId]);

  const getsubcenterList = useCallback(() => {
    async function getData() {
      if (formik.values.districtId && formik.values.facilityId) {
        const subcenterId: any = await DropdownService.getOneSubCenter(
          formik.values.facilityId,
          formik.values.districtId
        );
        if (subcenterId && subcenterId.data) {
          setSubcenterIdValues(subcenterId.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId, formik.values.facilityId]);

  const getwardList = useCallback(() => {
    async function getData() {
      if (formik.values.districtId && formik.values.corporationId) {
        const wardId: any = await DropdownService.getOneWard(
          formik.values.corporationId,
          formik.values.districtId
        );
        console.log(wardId);
        if (wardId && wardId.data) {
          setWardIdValues(wardId.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId, formik.values.corporationId]);

  const getvillageList = useCallback(() => {
    async function getData() {
      if (formik.values.districtId && formik.values.talukaId) {
        const villageId: any = await DropdownService.getOneVillage(
          formik.values.talukaId,
          formik.values.districtId
        );
        if (villageId && villageId.data) {
          setVillageIdValues(villageId.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId, formik.values.talukaId]);

  useEffect(() => {
    getfacilityList();
    getsubcenterList();
    gettalukaList();
    getCorporationList();
    getwardList();
    getvillageList();
  }, [
    getfacilityList,
    getsubcenterList,
    getCorporationList,
    gettalukaList,
    getvillageList,
    getwardList,
  ]);

  console.log(reportTableData);
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
            MDA Evaluation Report of Medical College Team
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
                  `MDA Evaluation Report of Medical College Team.pdf`,
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
              filename='MDA Evaluation Report of Medical College Team'
              sheet='MDA Evaluation Report of Medical College Team'
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
                            style={{ width: '100%' }}
                            onSubmit={formik.handleSubmit}
                            onChange={formik.handleChange}
                          >
                            <Row className='mb-3' style={{ padding: '0 20px' }}>
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
                                {' '}
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    Year
                                  </label>
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
                                      formik.errors.year && formik.touched.year
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    name='year'
                                    isClearable='true'
                                    value={
                                      formik.values.year !== ''
                                        ? yearList
                                          ? yearList.find(
                                              (option: any) =>
                                                option &&
                                                option.value ==
                                                  formik.values.year
                                            )
                                          : ''
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
                                    htmlFor='districtId'
                                    className='form-label font-chng'
                                  >
                                    District
                                  </label>
                                  {districtIdValues &&
                                  districtIdValues.length !== 0 ? (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='districtId'
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
                                        formik.values.districtId !== ''
                                          ? districtIdList
                                            ? districtIdList.find(
                                                (option) =>
                                                  option &&
                                                  option.value ===
                                                    formik.values.districtId
                                              )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'districtId',
                                          option && option.value
                                        );
                                        getDistrict(option);
                                        formik.setFieldValue('facilityId', '');
                                        formik.setFieldValue('subCenterId', '');
                                        formik.setFieldValue('villageId', '');
                                        formik.setFieldValue('wardId', '');
                                        formik.setFieldValue(
                                          'corporationId',
                                          ''
                                        );
                                        formik.setFieldValue('talukaId', '');
                                        setFacilityIdValues([]);
                                        setSubcenterIdValues([]);
                                        setVillageIdValues([]);
                                        setWardIdValues([]);
                                        setCorporationIdValues([]);
                                        setTalukaIdValues([]);
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='districtId'
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
                                      //options={NoneList}
                                      className='custom-select'
                                      options={NoneList}
                                      isClearable='true'
                                      value={
                                        NoneList
                                          ? NoneList.find(
                                              (option) =>
                                                option &&
                                                option.value ===
                                                  parseInt(
                                                    formik.values.districtId
                                                  )
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'districtId',
                                          option && option.value
                                        );
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
                                      menuPortalTarget={document.body}
                                      name='districtId'
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
                                      options={talukaIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.talukaId &&
                                        formik.touched.talukaId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      value={
                                        formik.values.talukaId !== ''
                                          ? talukaIdList
                                            ? talukaIdList.find(
                                                (option) =>
                                                  option &&
                                                  option.value ===
                                                    formik.values.talukaId
                                              )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'talukaId',
                                          option && option.value
                                        );
                                        gettaluka(option);
                                        formik.setFieldValue('villageId', '');
                                        setVillageIdValues([]);
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='talukaId'
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
                                      //options={NoneList}
                                      className='custom-select'
                                      options={NoneList}
                                      isClearable='true'
                                      value=''
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'talukaId',
                                          option && option.value
                                        );
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
                                    htmlFor='corporationId'
                                    className='form-label font-chng'
                                  >
                                    Corporation
                                  </label>
                                  {corporationIdValues &&
                                  corporationIdValues.length !== 0 ? (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='corporationId'
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
                                      options={corporationIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.corporationId &&
                                        formik.touched.corporationId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      value={
                                        formik.values.corporationId !== ''
                                          ? corporationIdList
                                            ? corporationIdList.find(
                                                (option) =>
                                                  option &&
                                                  option.value ===
                                                    formik.values.corporationId
                                              )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'corporationId',
                                          option && option.value
                                        );
                                        getcorporation(option);
                                        setWardIdValues([]);
                                        formik.setFieldValue('wardId', '');
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='corporationId'
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
                                      //options={NoneList}
                                      className='custom-select'
                                      options={NoneList}
                                      isClearable='true'
                                      value=''
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'corporationId',
                                          option && option.value
                                        );
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
                                    htmlFor='facilityId'
                                    className='form-label font-chng'
                                  >
                                    Facility
                                  </label>
                                  {facilityIdValues &&
                                  facilityIdValues.length !== 0 ? (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='facilityId'
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
                                      options={facilityIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.facilityId &&
                                        formik.touched.facilityId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      value={
                                        formik.values.facilityId !== ''
                                          ? facilityIdList
                                            ? facilityIdList.find(
                                                (option) =>
                                                  option &&
                                                  option.value ===
                                                    formik.values.facilityId
                                              )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'facilityId',
                                          option && option.value
                                        );
                                        getfacility(option);
                                        setSubcenterIdValues([]);
                                        formik.setFieldValue('subCenterId', '');
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='facilityId'
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
                                      //options={NoneList}
                                      className='custom-select'
                                      options={NoneList}
                                      isClearable='true'
                                      value=''
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'facilityId',
                                          option && option.value
                                        );
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
                                    htmlFor='subcenterId'
                                    className='form-label font-chng'
                                  >
                                    Subcenter
                                  </label>
                                  {subcenterIdValues &&
                                  subcenterIdValues.length !== 0 ? (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='subCenterId'
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
                                      options={subcenterIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.subCenterId &&
                                        formik.touched.subCenterId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      value={
                                        formik.values.subCenterId !== ''
                                          ? subcenterIdList
                                            ? subcenterIdList.find(
                                                (option) =>
                                                  option &&
                                                  option.value ===
                                                    formik.values.subCenterId
                                              )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'subCenterId',
                                          option && option.value
                                        );
                                        getsubcenter(option);
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='subCenterId'
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
                                      //options={NoneList}
                                      className='custom-select'
                                      options={NoneList}
                                      isClearable='true'
                                      value=''
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
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='wardId'
                                    className='form-label font-chng'
                                  >
                                    Ward
                                  </label>
                                  {wardIdValues && wardIdValues.length !== 0 ? (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='wardId'
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
                                      options={wardIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.wardId &&
                                        formik.touched.wardId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      value={
                                        formik.values.wardId !== ''
                                          ? wardIdList
                                            ? wardIdList.find(
                                                (option) =>
                                                  option &&
                                                  option.value ===
                                                    formik.values.wardId
                                              )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'wardId',
                                          option && option.value
                                        );
                                        getward(option);
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='wardId'
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
                                      //options={NoneList}
                                      className='custom-select'
                                      options={NoneList}
                                      isClearable='true'
                                      value=''
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
                                    htmlFor='villageId'
                                    className='form-label font-chng'
                                  >
                                    Village
                                  </label>
                                  {villageIdValues &&
                                  villageIdValues.length !== 0 ? (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='villageId'
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
                                      options={villageIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.villageId &&
                                        formik.touched.villageId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      value={
                                        formik.values.villageId !== ''
                                          ? villageIdList
                                            ? villageIdList.find(
                                                (option) =>
                                                  option &&
                                                  option.value ===
                                                    formik.values.villageId
                                              )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'villageId',
                                          option && option.value
                                        );
                                        getvillage(option);
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='villageId'
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
                                      //options={NoneList}
                                      className='custom-select'
                                      options={NoneList}
                                      isClearable='true'
                                      value=''
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'villageId',
                                          option && option.value
                                        );
                                      }}
                                    ></Select>
                                  )}
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
                                    htmlFor='nameOfInvestigator'
                                    className='form-label font-chng'
                                  >
                                    Name of Investigator
                                  </label>
                                  <input
                                    name='nameOfInvestigator'
                                    value={
                                      formik.values.nameOfInvestigator
                                        ? formik.values.nameOfInvestigator
                                        : ''
                                    }
                                    onChange={formik.handleChange}
                                    onKeyPress={(e) =>
                                      commonFunction.keyPress(e)
                                    }
                                    type='text'
                                    className='form-control'
                                  ></input>
                                </div>
                              </div>
                              <div
                                className='col-md-6 col-xl-12 col-12 right-wrappernew'
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
                                  Filter{' '}
                                </button>
                                <button
                                  className='mt-m font-chng mt-m font-chng btn btn-secondary1'
                                  type='reset'
                                  onClick={() => {
                                    formik.resetForm();
                                  }}
                                  style={{ marginLeft: '10px' }}
                                >
                                  Clear{' '}
                                </button>
                              </div>
                            </Row>{' '}
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
                <tr>
                  <td>
                    <b>Sr. No.</b>
                  </td>
                  <td>
                    <b>Particulars</b>
                  </td>
                  {reportTableData.map((data: any, index: any) => (
                    <td>
                      <b>Village {index + 1}</b>
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td height='32'>1</td>
                  <td align='left' valign='middle'>
                    Name of Village/Ward Selected
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.villageName}
                    </td>
                  ))}
                  {/* <td  align="left" valign="bottom">
                <br />
              </td>
              <td  align="left" valign="bottom">
                <br />
              </td>
              <td  align="left" valign="bottom">
                <br />
              </td> */}
                </tr>
                <tr>
                  <td height='32'>2</td>
                  <td align='left' valign='middle'>
                    Population of selected Village/Ward
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.populationOfVillage}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='32'>3</td>
                  <td align='left' valign='middle'>
                    Name of the PHC
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.facilityName}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='32'>4</td>
                  <td align='left' valign='middle'>
                    No. of houses surveyed
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.noOfHousesSurveyed}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='32'>5</td>
                  <td align='left' valign='middle'>
                    <b>Drug Compliance Assessment</b>
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='42'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    a) Total No. of person in house ( Total Population Surveyed)
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.totalNoOfPersonInHouse}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='84'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    b) Total No. of beneficiaries /Eligible in selected house{' '}
                    <br />
                    (Total no of person in surveyed houses who should have
                    <br /> received tablets during MDA)
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.totalNoOfBeneficiaries}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='63'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    c) Total no of house beneficiaries /person received drug
                    <br /> (Actual drug distribution during MDA in
                    <br /> eligible population in surveyed houses)
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.totalNoOfPersonsRecived}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='42'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    <b>
                      d) No. of beneficiaries / Eligible persons consumed
                      <br /> tablets in surveyed houses
                    </b>
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.totalNoOfPersonsConsumed}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='42'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    <b>
                      e) No of beneficiaries / Eligible persons not consumed
                      <br /> tablets in surveyed houses
                    </b>
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.totalNoOfPersonsNotConsumed}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='42'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    f) Percentage of coverage (No indicated in 5c/no
                    <br /> indicated in 5b) multiplied with 100)
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.percentageOfCoverage}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='42'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    g) Percentage of consumption (No indicated in 5d/
                    <br /> No indicated in 5b) multiplied with 100)
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.percentageConsumption}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='29'>6</td>
                  <td align='left' valign='middle'>
                    District reported coverage %
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.districtReportedCoverage}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='42'>7</td>
                  <td align='left' valign='middle'>
                    No of houses visited by drug distributor for MDA
                    <br /> in selected houses
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.noOfHousesDDVisited}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='30'>8</td>
                  <td align='left' valign='middle'>
                    Percentage of houses visited
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.PercentageOfHousesVisited}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='21'>9</td>
                  <td align='left' valign='middle'>
                    No of beneficiaries swallowed tablets in presence
                    <br /> of drug distributor
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.noOfPersonsSwallowInPresence}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td height='21'>10</td>
                  <td align='left' valign='middle'>
                    Percentage of beneficiaries swallowed drug in presence
                    <br /> of drug distributor
                  </td>
                  {reportTableData.map((data: any) => (
                    <td align='left' valign='bottom'>
                      {data.PercentageOfPersonsSwallowInPresence}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td rowSpan={9} height='308'>
                    11
                  </td>
                  <td align='left' valign='middle'>
                    <b>
                      <u>Reasons for not swallowing the drug</u>
                    </b>
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td align='left' valign='middle'>
                    a) No. information about LF/MDA/DEC
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td align='left' valign='middle'>
                    b)Fear of drug{' '}
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td align='left' valign='middle'>
                    c) Beneficiaries on empty stomach at the time of DD's visit
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td align='left' valign='middle'>
                    d) Side reactions of Drugs
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td align='left' valign='middle'>
                    e) Beneficiaries not suffering from LF. Why they should
                    <br /> take DEC ?
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td align='left' valign='middle'>
                    f) Complication of Previous Years MDA{' '}
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td align='left' valign='middle'>
                    g) Others
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td align='left' valign='middle'>
                    h) Others
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='21'>12</td>
                  <td align='left' valign='middle'>
                    <b>
                      Opinion of beneficiaries as who should be the
                      <br /> drug distributors ?{' '}
                    </b>
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    a) ANM
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    b) Health Worker (Male)
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    c) Anganwadi Worker
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    d) NGO
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    e) Volunteer
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    f) Student
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    g) Others
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='21' align='center' valign='bottom'>
                    13
                  </td>
                  <td align='left' valign='middle'>
                    <b>
                      Sources of information among surveyed population about
                      <br /> MDA activity ?
                    </b>
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    a) ANM
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    b) Health Worker (Male)
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    c) Anganwadi Worker
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    d) Volunteer
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    e) Miking
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    f) Davandi
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    g) Radio
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    h) TV
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    i) Newspapers
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    j) Handbills{' '}
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    k) Others
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='34' align='center' valign='bottom'>
                    14
                  </td>
                  <td align='left' valign='middle'>
                    No. of beneficiaries experienced side effects of DEC
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    15
                  </td>
                  <td align='left' valign='middle'>
                    <b>Details of side effects of DEC</b>
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    a) Nausea, vomiting{' '}
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    b) Headache
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    c) Fever
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    d) Rash
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    e) Dehydration
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    f) Fainting attact
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    g) Others
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='21' align='center' valign='bottom'>
                    16
                  </td>
                  <td align='left' valign='middle'>
                    No of beneficiaries aware about the nearest treatment
                    <br /> facility center for treating side effects of DEC
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    17
                  </td>
                  <td align='left' valign='middle'>
                    If treated, place of treatment
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    a) PHC
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    b) Rural Hospital /Govt. Hospital
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    c) Private practitioners
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='29' align='center' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='middle'>
                    d) Others
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='21' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='21' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='40' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td colSpan={2} align='center' valign='middle'>
                    Record any other relevant information and recommendation on
                    MDA
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='31' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td colSpan={5} align='center' valign='bottom'>
                    &hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;..
                  </td>
                </tr>
                <tr>
                  <td height='26' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td colSpan={5} align='center' valign='bottom'>
                    &hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;..
                  </td>
                </tr>
                <tr>
                  <td height='26' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td colSpan={5} align='center' valign='bottom'>
                    &hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;..
                  </td>
                </tr>
                <tr>
                  <td height='29' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td colSpan={5} align='center' valign='bottom'>
                    &hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;&hellip;..
                  </td>
                </tr>
                <tr>
                  <td height='21' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='21' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                </tr>
                <tr>
                  <td height='21' align='left' valign='bottom'>
                    <br />
                  </td>
                  <td align='left' valign='bottom'>
                    Date :-
                  </td>
                  <td align='left' valign='bottom'>
                    <br />
                  </td>
                  <td colSpan={3} align='center' valign='bottom'>
                    {' '}
                    (Signature of investigator)
                  </td>
                </tr>
              </tbody>
            </table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};

export default Analysis2postMDAevaluation;
