import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import Select, { Option } from 'react-select';
import { months, years, ageTextGenerator, getDistrictName } from '../../utils';
import DropdownService from '../../../../services/DropdownService';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import ReportService from '../../../../services/ReportService';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import moment from 'moment';
import TableContainer from '@material-ui/core/TableContainer';
import { Menu, TablePagination as Paging, Icon } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { useSelector } from 'react-redux';
import {
  current_year,
  endMonthList,
  initmonth,
  NoneList,
  previous_month,
  current_month,
  findMonthName,
} from '../../../../../Components/constant';
import { Exportpdf } from '../../../../services/PdfService';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

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
  if([null, 0].includes(month) || [null, 0].includes(year)){
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


const Analysis2 = (props) => {
  let classes = useStyles();
  const userDistrictId = useUserDistrictId() || '';
  const prevDistrictRef: any = React.useRef();
  const [districtId, setdistrictId] = useState();
  const [reportTableData, setreportTableData] = useState([]);
  const [startMonth, setStartMonth] = useState(`1`);
  const [endMonth, setEndMonth] = useState(`${current_month[0].value}`);
  const [year, setYear] = useState(`${current_year}`);
  const [districtName, setDistrictName] = useState('');

  const [facilityId, setfacilityId] = useState();
  let [facilityIdValues, setfacilityIdValues] = useState([]);

  const [nameOfHospitalId, setNameOfHospitalId] = useState();
  let [nameOfHospitalIdValues, setNameOfHospitalIdValues] = useState([]);

  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
      facilityId: '',
      hospitalSurgeryId: '',
    };
  }, []);

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    districtId: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    facilityId: Yup.string(),
    hospitalSurgeryId: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
      facilityId: '',
      hospitalSurgeryId: '',
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      setYear(values.year);
      setStartMonth(`${values.startMonth}`);
      setEndMonth(`${values.endMonth}`);
      getReportAnalysis2(values);
      setDistrictName(getDistrictName(districtIdList, values.districtId));
    },
    onReset: (values) => {
      const data = initialFilterValue();
      setDistrictName(() => getDistrictName(districtIdList, userDistrictId));
      setStartMonth(`1`);
      setEndMonth(`${current_month[0].value}`);
      setYear(`${current_year}`);
      getReportAnalysis2(data);
    },
  });

  let [districtIdValues, setdistrictIdValues] = useState([]);

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

  const nameOfHospitalIdList =
    nameOfHospitalIdValues &&
    nameOfHospitalIdValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [...yearList];

  let monthList = months.map((months: any, i: any) => {
    return { label: months.monthName, value: months.month };
  });
  monthList = [...monthList];

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
    }
  }
  async function getFacility(e: any) {
    if (e && e.value) {
      setfacilityId(e && e.value);
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
      setDistrictName(() => getDistrictName(districtId.data, userDistrictId));
    }
  }
  async function getReportAnalysis2(filterData) {
    const reportData: any = await ReportService.getReportLfAnalysis2(
      filterData
    );
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
    }
  }
  async function getfacilitycontentdropdown(districtId) {
    let param = {};
    if (districtId) {
      param = { districtId: `${districtId}` };
    }
    const facility: any = await DropdownService.getFacilityInfoDropDown(param);
    const allfacility: any = await DropdownService.getFacilityInfoDropDown(
      param
    );
    if (facility && facility.data && facility.data.length > 0) {
      setfacilityIdValues(facility.data);
    }
    if (allfacility && allfacility.data && allfacility.data.length > 0)
      setNameOfHospitalIdValues(allfacility.data);
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getpostcontent();
    prevDistrictRef.current = districtId;
  }, []);

  useEffect(() => {
    const data = initialFilterValue();
    getReportAnalysis2(data);
  }, [initialFilterValue]);

  useEffect(() => {
    getfacilitycontentdropdown(null);
  }, []);
  useEffect(() => {
    const data = initialFilterValue();
    getReportAnalysis2(data);
  }, [initialFilterValue]);
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
          <p className='rpthead'>Planning of Hydrocele Operations </p>
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
                  `Planning of Hydrocele Operations.pdf`,
                  'l',
                  295,
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
              filename='Planning of Hydrocele Operations'
              sheet='Planning of Hydrocele Operations'
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
                                    options={
                                      districtIdValues &&
                                      districtIdValues.length !== 0
                                        ? districtIdList
                                        : NoneList
                                    }
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
                                        option?.value && option.value !== 0
                                          ? option.value
                                          : ''
                                      );
                                      getDistrict(option);
                                      setfacilityIdValues([]);
                                      formik.setFieldValue('facilityId', '');
                                      setNameOfHospitalIdValues([]);
                                      formik.setFieldValue(
                                        'hospitalSurgeryId',
                                        ''
                                      );
                                      getfacilitycontentdropdown(
                                        option ? option.value : ''
                                      );
                                    }}
                                  ></Select>

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
                                            ? monthList.find(
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
                                        ? yearList?.find(
                                            (option: any) =>
                                              option &&
                                              option.value == formik.values.year
                                          )
                                        : yearList?.find(
                                            (option: any) =>
                                              option &&
                                              option.value == current_year
                                          )
                                    }
                                    options={yearList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'year',
                                        option ? option.value : ''
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
                                    htmlFor='facilityId'
                                    className='form-label font-chng'
                                  >
                                    Attached Facility
                                  </label>

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
                                    options={
                                      facilityIdValues &&
                                      facilityIdValues.length !== 0
                                        ? facilityIdList
                                        : NoneList
                                    }
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
                                        option?.value && option.value !== 0
                                          ? option.value
                                          : ''
                                      );
                                      getFacility(option);
                                    }}
                                  ></Select>

                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.facilityId
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
                                    options={
                                      nameOfHospitalIdValues &&
                                      nameOfHospitalIdValues.length !== 0
                                        ? nameOfHospitalIdList
                                        : NoneList
                                    }
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
                                        option?.value && option.value !== 0
                                          ? option.value
                                          : ''
                                      );
                                      getNameOfHospital(option);
                                    }}
                                  ></Select>

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
                                  onClick={() => {
                                    formik.resetForm();
                                    getfacilitycontentdropdown(null);
                                  }}
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
        <div style={{ display: 'flex', marginBottom: '1%' }}>
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
            {' '}
            {districtName !== '' ? `District - ` : ''}
            {districtName !== '' && <b> {districtName}</b>}
          </div>
        </div>
        <TableContainer>
          <table id='table-to-xlsnew'>
            <thead>
              {' '}
              <tr>
                <td rowSpan={2}>
                  <br />
                  Sr. no.
                </td>
                <td rowSpan={2}>
                  <br />
                  Name of P.H.C.
                </td>
                <td rowSpan={2}>
                  <br />
                  Name of Hydrocele patient
                </td>
                <td rowSpan={2}>
                  <br />
                  Age
                </td>
                <td rowSpan={2}>
                  <br />
                  Address
                </td>
                <td rowSpan={2}>
                  <br />
                  Patient's Mobile no
                </td>
                <td rowSpan={2}>
                  <br />
                  Hydrocele for last<br></br> how many years?
                </td>
                <td rowSpan={2}>
                  <br />
                  Patient staying in the<br></br> village for last<br></br> how
                  many years ?
                </td>
                <td rowSpan={2}>
                  <br />
                  Name of MPW<br></br> assigned for this case
                </td>
                <td rowSpan={2}>
                  <br />
                  MPW's Mobile no
                </td>
                <td rowSpan={2}>
                  <br />
                  Name of HA<br></br> assigned for this case
                </td>
                <td rowSpan={2}>
                  <br />
                  HA's Mobile No
                </td>
                <td rowSpan={2}>
                  <br />
                  Date of DMO Visit<br></br> to case
                </td>
                <td rowSpan={2}>
                  <br />
                  Consent for surgery<br></br> given by patient<br></br> Y/N
                </td>
                <td rowSpan={2}>
                  <br />
                  Name of Doctor<br></br> who examined patient
                </td>
                <td rowSpan={2}>
                  <br />
                  Fitness &amp; examination<br></br> tentative date in PHC
                </td>
                <td rowSpan={2}>
                  <br />
                  Name of the Hospital<br></br> identified for surgery
                </td>
                <td rowSpan={2}>
                  <br />
                  tentative date of surgery
                </td>
                <td rowSpan={2}>
                  <br />
                  Actual date of surgery
                </td>
                <td colSpan={3}>
                  <br />
                  Hydrocele Gradation
                </td>
                <td rowSpan={2}>
                  <br />
                  Name of Surgeon
                </td>
                <td rowSpan={2}>
                  <br />
                  Surgeon's Mobile no
                </td>
                <td rowSpan={2}>
                  <br />
                  Date of follow up<br></br> done by MPW after surgery
                </td>
                <td rowSpan={2}>
                  <br />
                  Remark
                </td>
              </tr>
              <tr>
                <td>I</td>
                <td>II</td>
                <td>III</td>
              </tr>
            </thead>

            <tbody>
              {reportTableData && reportTableData.length > 0 ? (
                reportTableData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((data: any, index) => (
                    <tr key={`LFA2${index}`}>
                      <td className='srno' align='right'>
                        {index + 1}
                      </td>
                      <td>{data.facilityName}</td>
                      <td>{data.nameOfPatient}</td>
                      <td>{
                      ageTextGenerator(data.ageYears, data.ageMonths)
                      }</td>
                      <td>
                        {`${data.permanentAddressCity}, ${data.permanentAddressLine1} ${data.permanentAddressLine2}`}
                      </td>
                      <td align='right'>{data.patientMobileNumber}</td>
                      <td>
                        {/* {ageTextGenerator(
                          data.diseaseLastedYears,
                          data.diseaseLastedMonths
                        )} */}
                        {
                          getDateDetails(processYears(data.diseaseLastedYears), processMonths(data.diseaseLastedMonths))

                        }
                      </td>
                      <td>
                        {/* {ageTextGenerator(
                          data.stayingInYears,
                          data.stayingInMonths
                        )} */}
                        {
                         getDateDetails(processYears(data.stayingInYears), processMonths(data.stayingInMonths))

                        }
                      </td>
                      <td>{''}</td>
                      <td>{''}</td>
                      <td>{''}</td>
                      <td>{''}</td>
                      <td>{''}</td>
                      <td>{''}</td>
                      <td>{data.verifiedByDoctorName}</td>
                      <td>{''}</td>
                      <td>{data.nameOfHospitalSurgeryDone}</td>
                      <td>{''}</td>
                      <td align='right'>{data.dateOfSurgery}</td>
                      <td>{''}</td>
                      <td>{''}</td>
                      <td>{''}</td>
                      <td>{data.nameOfSurgeon}</td>
                      <td align='right'>{data.surgeonPhone}</td>
                      <td>{data.dateOfFollowUpAfterSurgery}</td>
                      <td>{data.remarks}</td>
                    </tr>
                  ))
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
  );
};

export default Analysis2;
