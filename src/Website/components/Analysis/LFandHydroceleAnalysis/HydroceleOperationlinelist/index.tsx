import React, { useState, useEffect, useCallback } from 'react';
import Select, { Option } from 'react-select';
import moment from 'moment';
import {
  ageGroupList,
  ageTextGenerator,
  monthAlphabetGenerator,
  stageHydrogele,
  years,
  months,
  reportTableStyle,
  getDistrictName,
} from '../../../Reports/utils';

import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import ReportService from '../../../../services/ReportService';
import DropdownService from '../../../../services/DropdownService';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import TableContainer from '@material-ui/core/TableContainer';
import { Menu, TablePagination as Paging } from '@material-ui/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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


const processYears = (year) => {
  if (year === null || year === 0) {
    return null;
  }
  if (year?.toString().length === 4) {
    return year;
  } else {
    return +moment().subtract(year, 'year').format('YYYY');
  }
};

const processMonths = (month) => {
  if (month === null || month === 0) {
    return null;
  } else {
    return month;
  }
};

const getDateDetails = (year, month) => {
  if ([null, 0].includes(month) || [null, 0].includes(year)) {
    return "No data"
  }
  let currentDate = moment();
  let stayingIndDate = moment([year, month - 1]);
  let localYear = currentDate.diff(stayingIndDate, 'year');
  stayingIndDate.add(localYear, 'years');
  var localMonth = currentDate.diff(stayingIndDate, 'months');
  stayingIndDate.add(localMonth, 'months');
  return (
    localYear +
    ` year${localYear > 1 ? 's' : ''} ` +
    localMonth +
    ` month${localMonth > 1 ? 's' : ''}`
  );
};

const HydroceleOperationlinelist = () => {
  let classes = useStyles();
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const [reportTableData, setreportTableData] = useState([]);
  const prevDistrictRef: any = React.useRef();
  const prevTalukaRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const [districtId, setdistrictId] = useState();
  const [talukaId, settalukaId] = useState();
  const [facilityId, setfacilityId] = useState();
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [takulaIdValues, setTalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  const [startMonth, setStartMonth] = useState(`1`);
  const [endMonth, setEndMonth] = useState(`${current_month[0].value}`);
  const [year, setYear] = useState(`${current_year}`);
  const [districtName, setdistrictName] = useState('');
  const [talukaName, settalukaName] = useState('');
  const [facilityName, setfacilityName] = useState('');
  const [genderName, setgenderName] = useState('');

  const [genderId, setgenderId] = useState();
  let [genderIdValues, setgenderIdValues] = useState([]);
  const [ageGroupName, setageGroupName] = useState('');

  const [nameOfHospitalId, setNameOfHospitalId] = useState();
  let [nameOfHospitalIdValues, setNameOfHospitalIdValues] = useState([]);
  const userDistrictId = useUserDistrictId() || '';
  const d = new Date();
  let currentmonth = d.getMonth();
  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
      taluka: '',
      facilityId: '',
      gender: '',
      age: '',
      stageOfHydrocele: '',
      nameOfSurgeon: '',
      hospitalSurgeryId: '',
    };
  }, []);

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    districtId: Yup.string(),
    taluka: Yup.string(),
    facilityId: Yup.string(),
    gender: Yup.string(),
    age: Yup.string(),
    stageOfHydrocele: Yup.string(),
    nameOfSurgeon: Yup.string(),
    hospitalSurgeryId: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
      taluka: '',
      facilityId: '',
      gender: '',
      age: '',
      stageOfHydrocele: '',
      nameOfSurgeon: '',
      hospitalSurgeryId: '',
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      setStartMonth(`${values.startMonth}`);
      setEndMonth(`${values.endMonth}`);
      setYear(`${values.year}`);
      setdistrictName(() =>
        getDistrictName(districtIdValues, values.districtId)
      );
      getReportLFHydroceleOPLineList(values);
    },
    onReset: () => {
      setdistrictName(() => getDistrictName(districtIdValues, userDistrictId));
      setStartMonth('1');
      setEndMonth(`${current_month[0].value}`);
      setYear(`${current_year}`);
      settalukaName('');
      setfacilityName('');
      setgenderName('');
      setageGroupName('');
    },
  });

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  const talukaIdList =
    takulaIdValues &&
    takulaIdValues.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });
  const facilityIdList =
    facilityIdValues &&
    facilityIdValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });
  const nameOfHospitalIdList =
    nameOfHospitalIdValues &&
    nameOfHospitalIdValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });
  const genderIdList =
    genderIdValues &&
    genderIdValues.map((item: any, i: any) => {
      return { label: item.categoryOptionName, value: item.categoryOptionEnum };
    });

  async function getReportLFHydroceleOPLineList(filterData) {
    const reportData: any = await ReportService.getReportLFHydroceleOPLineList(
      filterData
    );
    console.log(reportData, 'testtt');
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
    }
  }
  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
    }
  }
  async function getTaluka(e: any) {
    if (e && e.value) {
      settalukaId(e && e.value);
    }
  }
  async function getfacility(e: any) {
    if (e && e.value) {
      setfacilityId(e && e.value);
    }
  }
  async function getGender(e: any) {
    if (e && e.value) {
      setgenderId(e && e.value);
      setgenderName(e && e.label);
    }
  }
  async function getNameOfHospital(e: any) {
    if (e && e.value) {
      setNameOfHospitalId(e && e.value);
    }
  }
  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
      setdistrictName(() => getDistrictName(districtId.data, userDistrictId));
    }
  }
  async function getUnitOfUnitList() {
    const districtId: any = await DropdownService.getUnitOfAction();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setgenderIdValues(
        districtId.data.filter((item: any) => item.categoryCode === 1000)
      );
    }
  }
  const getTalukacontent = useCallback(() => {
    async function getData() {
      if (formik.values.districtId) {
        const facility: any = await DropdownService.getOneTaluka(
          formik.values.districtId
        );
        if (facility && facility.data && facility.data.length > 0) {
          setTalukaIdValues(facility.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId]);
  const getfacilitycontent = useCallback(() => {
    async function getData() {
      if (formik.values.districtId) {
        const facility: any = await DropdownService.getOneFacility(
          formik.values.districtId
        );
        if (facility && facility.data && facility.data.length > 0) {
          setfacilityIdValues(facility.data);
          setNameOfHospitalIdValues(facility.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId]);
  useEffect(() => {
    const data = initialFilterValue();
    getReportLFHydroceleOPLineList(data);
  }, [initialFilterValue]);
  useEffect(() => {
    getpostcontent();
    getUnitOfUnitList();
    prevDistrictRef.current = districtId;
    prevTalukaRef.current = talukaId;
    prevFacilityRef.current = facilityId;
  }, []);

  useEffect(() => {
    getfacilitycontent();
    getTalukacontent();
  }, [getfacilitycontent, getTalukacontent]);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const createpdf = () => {
    const input = document.getElementById('table-to-xls');
    if (input) {
      html2canvas(input).then((canvas: any) => {
        var imgWidth: any = 210;
        var pageHeight = 295;
        var imgHeight = (canvas.height * imgWidth) / canvas.width;
        var heightLeft = imgHeight;
        const imgData = canvas.toDataURL('image/png');
        var doc = new jsPDF('p', 'mm');
        var position = 0;
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight + 15);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          doc.addPage();
          doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight + 15);
          heightLeft -= pageHeight;
        }
        doc.save('Hydrocele operation line list.pdf');
      });
    }
  };

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
          <p className='rpthead'>Hydrocele Operation Line List</p>
          <div
            style={{
              display: 'flex',
              marginLeft: 'auto',
            }}
          >
            <button
              className='mt-m font-chng btn btn-secondary1'
              onClick={() =>
                Exportpdf('table-to-xlsnew', `Disease Cases.pdf`, 'p', 210, 295)
              }
            >
              Export as PDF
            </button>
            <ReactHTMLTableToExcel
              className='mt-m font-chng btn btn-secondary1'
              id='test-table-xls-button'
              table='table-to-xlsnew'
              filename='Disease Cases'
              sheet='Disease Cases'
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
                            onReset={formik.handleReset}
                          >
                            <Row className='mb-3' style={{ padding: '0 20px' }}>
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
                                                option.value ==
                                                formik.values.districtId
                                            )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'districtId',
                                          option ? option.value : ''
                                        );
                                        getDistrict(option);
                                        // setdistrictName(
                                        //   option ? option.label : ''
                                        // );
                                        setTalukaIdValues([]);
                                        formik.setFieldValue('taluka', '');
                                        setfacilityIdValues([]);
                                        formik.setFieldValue('facilityId', '');
                                        setNameOfHospitalIdValues([]);
                                        formik.setFieldValue(
                                          'hospitalSurgeryId',
                                          ''
                                        );
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
                                      value=''
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'districtId',
                                          option ? option.value : ''
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
                                            ? monthList?.find(
                                              (option: any) =>
                                                option &&
                                                option.value ==
                                                formik.values.startMonth
                                            )
                                            : monthList?.find(
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
                                  <label className='form-label font-chng'>
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
                                        option ? option.value : ''
                                      );
                                      // setyear(option ? option.label : '');
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
                                    htmlFor='talukaId'
                                    className='form-label font-chng'
                                  >
                                    Taluka
                                  </label>
                                  {takulaIdValues &&
                                    takulaIdValues.length !== 0 ? (
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
                                      options={talukaIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.taluka &&
                                          formik.touched.taluka
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      value={
                                        formik.values.taluka !== ''
                                          ? talukaIdList
                                            ? talukaIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ==
                                                formik.values.taluka
                                            )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'taluka',
                                          option ? option.value : ''
                                        );
                                        getTaluka(option);

                                        settalukaName(
                                          option ? option.label : ''
                                        );
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
                                          'taluka',
                                          option ? option.value : ''
                                        );
                                      }}
                                    ></Select>
                                  )}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.taluka : ''}
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
                                                option.value ==
                                                formik.values.facilityId
                                            )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'facilityId',
                                          option ? option.value : ''
                                        );
                                        getfacility(option);
                                        setfacilityName(
                                          option ? option.label : ''
                                        );
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
                                          option ? option.value : ''
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
                                    htmlFor='genderId'
                                    className='form-label font-chng'
                                  >
                                    Gender
                                  </label>
                                  {genderIdValues &&
                                    genderIdValues.length !== 0 ? (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='genderId'
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
                                      options={genderIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.gender &&
                                          formik.touched.gender
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      value={
                                        formik.values.gender !== ''
                                          ? genderIdList
                                            ? genderIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ==
                                                formik.values.gender
                                            )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'gender',
                                          option ? option.value : ''
                                        );
                                        getGender(option);
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='gender'
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
                                              parseInt(formik.values.gender)
                                          )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'gender',
                                          option ? option.value : ''
                                        );
                                      }}
                                    ></Select>
                                  )}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.gender : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label className='form-label font-chng'>
                                    Age
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
                                      formik.errors.age && formik.touched.age
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    name='age'
                                    isClearable='true'
                                    value={
                                      formik.values.age !== ''
                                        ? ageGroupList
                                          ? ageGroupList.find(
                                            (option: any) =>
                                              option &&
                                              option.value ==
                                              formik.values.age
                                          )
                                          : ''
                                        : ''
                                    }
                                    options={ageGroupList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'age',
                                        option ? option.value : ''
                                      );
                                      setageGroupName(
                                        option ? option.label : ''
                                      );
                                    }}
                                  ></Select>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.age : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label className='form-label font-chng'>
                                    Stage of Hydrocele
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
                                      formik.errors.stageOfHydrocele &&
                                        formik.touched.stageOfHydrocele
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    name='stageOfHydrocele'
                                    isClearable='true'
                                    value={
                                      formik.values.stageOfHydrocele !== ''
                                        ? stageHydrogele
                                          ? stageHydrogele.find(
                                            (option: any) =>
                                              option &&
                                              option.value ===
                                              formik.values.stageOfHydrocele
                                          )
                                          : ''
                                        : ''
                                    }
                                    options={stageHydrogele}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'stageOfHydrocele',
                                        option ? option.value : ''
                                      );
                                    }}
                                  ></Select>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.stageOfHydrocele
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='nameOfSurgeon'
                                    className='form-label font-chng'
                                  >
                                    Name of Surgeon
                                  </label>
                                  <input
                                    name='nameOfSurgeon'
                                    value={
                                      formik.values.nameOfSurgeon
                                        ? formik.values.nameOfSurgeon
                                        : ''
                                    }
                                    onChange={formik.handleChange}
                                    type='text'
                                    // className="form-control"
                                    className={
                                      formik.errors.nameOfSurgeon &&
                                        formik.touched.nameOfSurgeon
                                        ? 'form-control is-invalid'
                                        : 'form-control'
                                    }
                                  ></input>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.nameOfSurgeon
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-5 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='hospitalSurgeryId'
                                    className='form-label font-chng'
                                  >
                                    Name of hospital where identified for
                                    surgery
                                  </label>
                                  {nameOfHospitalIdValues &&
                                    nameOfHospitalIdValues.length !== 0 ? (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='hospitalSurgeryId'
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
                                      options={nameOfHospitalIdList}
                                      isClearable='true'
                                      className={
                                        formik.errors.hospitalSurgeryId &&
                                          formik.touched.hospitalSurgeryId
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      value={
                                        formik.values.hospitalSurgeryId !== ''
                                          ? nameOfHospitalIdList
                                            ? nameOfHospitalIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ===
                                                formik.values
                                                  .hospitalSurgeryId
                                            )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'hospitalSurgeryId',
                                          option ? option.value : ''
                                        );
                                        getNameOfHospital(option);
                                        // setDistrictName(option ? option.label : "");
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='hospitalSurgeryId'
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
                                          'hospitalSurgeryId',
                                          option ? option.value : ''
                                        );
                                      }}
                                    ></Select>
                                  )}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.hospitalSurgeryId
                                      : ''}
                                  </div>
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
                                  className='mt-m font-chng btn btn-secondary1'
                                  type='reset'
                                  style={{ marginLeft: '10px' }}
                                >
                                  Clear{' '}
                                </button>
                              </div>{' '}
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
        <div style={{ display: 'flex' }}>
          <div className={classes.filterdataStyle}>
            {startMonth !== '' ? `Month from - ` : ''}
            {startMonth !== '' && <b> {findMonthName(startMonth)}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {endMonth !== '' ? `Month to -  ` : ''}
            {endMonth !== '' && <b>{findMonthName(endMonth)}</b>}{' '}
          </div>
          <div className={classes.filterdataStyle}>
            {year !== '' ? `Year - ` : ''}
            {year !== '' && <b> {year}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {districtName !== '' ? `District - ` : ''}
            {districtName !== '' && <b> {districtName}</b>}
          </div>{' '}
          <div className={classes.filterdataStyle}>
            {talukaName !== '' ? `Taluka - ` : ''}
            {talukaName !== '' && <b> {talukaName}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {facilityName !== '' ? `Gender - ` : ''}
            {facilityName !== '' && <b> {facilityName}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {genderName !== '' ? `Facility - ` : ''}
            {genderName !== '' && <b> {genderName}</b>}
          </div>
        </div>
        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table id='table-to-xlsnew'>
              {/* <tr>
                <td colSpan={10}>
                  <b>Hydrocele operation line list</b>
                </td>
              </tr> */}

              {/* <td colSpan={2}>
                  <b> {year !== '' ? `Year - ${year}` : ''} </b> */}
              {/* </td> <tr>
                <td colSpan={2}>
                  <b>
                    {districtName !== '' ? `District - ${districtName}` : ''}
                  </b>
                </td>
                <td colSpan={1} style={{ border: 'none', textAlign: 'start' }}>
                  <b>{startMonth !== '' ? `Month from - ${startMonth}` : ''}</b>
                </td>
                <td colSpan={1} style={{ border: 'none', textAlign: 'start' }}>
                  <b>{endMonth !== '' ? `Month to - ${endMonth}` : ''}</b>
                </td> */}
              {/* <td colSpan={2}>
                  <b> {talukaName !== '' ? `Taluka - ${talukaName}` : ''} </b>
                </td>
                <td colSpan={2}>
                  <b>
                    {' '}
                    {facilityName !== ''
                      ? `Facility - ${facilityName}`
                      : ''}{' '}
                  </b>
                </td>
                <td colSpan={2}>
                  <b> {genderName !== '' ? `Gender - ${genderName}` : ''} </b>
                </td>
                <td colSpan={2}>
                  <b> {ageGroupName !== '' ? `Age - ${ageGroupName}` : ''} </b>
                </td>
              </tr> */}
              <thead>
                {' '}
                <tr>
                  <td rowSpan={2}>Name Of Patient</td>
                  <td rowSpan={2}>Patient ID</td>
                  <td rowSpan={2}>Gender</td>
                  <td rowSpan={2}>District</td>
                  <td rowSpan={2}>Corporation</td>
                  <td rowSpan={2}>Taluka</td>
                  <td rowSpan={2}>Zone</td>
                  <td rowSpan={2}>Ward</td>
                  <td rowSpan={2}>Village</td>
                  <td rowSpan={2}>Facility/PHC</td>
                  <td rowSpan={2}>Year</td>
                  <td rowSpan={2}>Month</td>
                  <td rowSpan={2}>Age</td>
                  <td rowSpan={2}>Mobile No</td>
                  <td rowSpan={2}>Address</td>
                  {/* <td  rowSpan={2}>
                  Desese Type{" "}
                </td>
                <td  rowSpan={2}>
                  Grading
                </td>
                <td  rowSpan={2}>
                  Presence Of Blisters
                </td> */}
                  <td rowSpan={2}>Duration Of Disease</td>
                  <td colSpan={4}>Details of Service Provider</td>
                  <td rowSpan={2}>Co-Morbidity Type</td>
                  <td rowSpan={2}>Date Of Surgery</td>
                  <td rowSpan={2}>
                    Name Of Hospital<br></br> Where Surgery Done
                  </td>
                  <td rowSpan={2}>Stage Of Hydrocele</td>
                  <td rowSpan={2}>Reason of Rejection for Hydrocele</td>
                  <td rowSpan={2}>Remarks if any</td>
                  <td rowSpan={2}>Name Of Surgeon</td>
                  <td rowSpan={2}>Surgeon's Mobile Number</td>
                  <td rowSpan={2}>
                    Date Of Follow<br></br> Up After Surgery
                  </td>
                  <td rowSpan={2}>Findings During Follow Up</td>
                </tr>
                <tr>
                  <td>Name</td>
                  <td>Designation</td>
                  <td>Place Of Service Given</td>
                  <td>Phone Number</td>
                </tr>
              </thead>
              <tbody>
                {reportTableData && reportTableData.length > 0 ? (
                  reportTableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data: any, index) => {
                      // const nameOfMonth: any = monthName(data.month);
                      return (
                        <tr key={`HOLL${index}`}>
                          <td>{data.nameOfPatient}</td>
                          <td>{data.patientId}</td>
                          <td>{data.gender}</td>
                          <td>{data.districtName}</td>
                          <td>{data.corporationName}</td>
                          <td>{data.talukaName}</td>
                          <td>{data.zoneName}</td>
                          <td>{data.wardName}</td>
                          <td>{data.villageName}</td>
                          <td>{data.facilityName}</td>
                          <td align='right'>
                            {data.year === 0 ? '' : data.year}
                          </td>
                          <td>{monthAlphabetGenerator(data.month)}</td>
                          <td>
                            {ageTextGenerator(data.ageYears, data.ageMonths)}
                          </td>
                          <td align='right'>{data.patientMobileNumber}</td>
                          <td>
                            {data.permanentAddressLine1}
                            {data.permanentAddressLine2},
                            {data.permanentAddressPINCode}
                          </td>
                          {/* <td >{data.diseaseType}</td>
                        <td  align="right">
                          {data.grading}
                        </td>
                        <td >
                          {data.presenceOfBlisters ? "Y" : "N"}
                        </td> */}
                          {/* <td>
                            {ageTextGenerator(
                              data.diseaseLastedYears,
                              data.diseaseLastedMonths
                            )}
                          </td> */}
                          <td>
                            {
                              getDateDetails(processYears(data.diseaseLastedYears), processMonths(data.diseaseLastedMonths))
                            }
                          </td>
                          <td>{data.serviceProviderName}</td>
                          <td>{data.serviceProviderDesignation}</td>
                          <td>{data.serviceProviderPlace}</td>
                          <td>{data.serviceProviderPhone}</td>
                          <td>{data.comorbidityType}</td>
                          <td align='right'>{data.dateOfSurgery}</td>
                          <td>{data.nameOfHospitalSurgeryDone}</td>
                          <td>{data.stageOfHydrocele}</td>
                          <td></td>
                          <td></td>
                          <td>{data.nameOfSurgeon}</td>
                          <td>{data.surgeonPhone}</td>
                          <td align='right'>
                            {data.dateOfFollowUpAfterSurgery}
                          </td>
                          <td align='right'>
                            {data.findingsDuringSurgeryFollowUp}
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      style={{ textAlign: 'center', height: '100px' }}
                    >
                      No Data found
                    </td>
                  </tr>
                )}
                {reportTableData && reportTableData.length > 0 && (
                  <tr>
                    <td></td>
                    <td>
                      <b>Total No. of Patients</b>
                    </td>
                    <td align='right'>
                      <b>{reportTableData.length}</b>
                    </td>
                  </tr>
                )}
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: 'center',
                      height: '40px',
                    }}
                  ></td>
                </tr>
              </tbody>
            </table>
          </TableContainer>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Paging
              rowsPerPageOptions={[10, 25, 50, 100]}
              count={reportTableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              style={{ border: 'none' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default HydroceleOperationlinelist;
