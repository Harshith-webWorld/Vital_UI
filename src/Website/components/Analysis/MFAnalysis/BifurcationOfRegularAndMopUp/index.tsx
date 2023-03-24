import { useState, useEffect, useRef, useCallback } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import Table from "./Table";
import Select, { Option } from 'react-select';
import {
  years,
  months,
  reportTableStyle,
  getDistrictName,
} from '../../../Reports/utils';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import DropdownService from '../../../../services/DropdownService';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import ReportService from '../../../../services/ReportService';
import { Exportpdf } from '../../../../services/PdfService';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Icon, Menu } from '@material-ui/core';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
// import { reportTableStyle } from '../../../Reports/utils';
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
import { responsivePropType } from 'react-bootstrap/esm/createUtilityClasses';
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
const BifurcationOfRegularAndMopUP = () => {
  let classes = useStyles();
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const userDistrictId = useUserDistrictId() || '';
  const d = new Date();
  let currentmonth = d.getMonth();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
      facilityId: '1',
    };
  }, []);
  const prevDistrictRef: any = useRef();
  const prevFacilityRef: any = useRef();
  const [districtId, setdistrictId] = useState();
  const [reportTableData, setreportTableData] = useState([]);
  const [districtName, setDistrictName] = useState('');

  let [districtIdValues, setdistrictIdValues] = useState([]);

  const [facilityId, setfacilityId] = useState();

  let [facilityIdValues, setfacilityIdValues] = useState([]);

  const [startMonth, setStartMonth] = useState(`1`);
  const [endMonth, setEndMonth] = useState(`${current_month[0].value}`);
  const [year, setYear] = useState(`${current_year}`);
  const [facilityName, setfacilityName] = useState('');

  useEffect(() => {
    const data = initialFilterValue();
    getMDAbifurcationOfRegularAndMopup(data);
  }, [initialFilterValue]);

  async function getMDAbifurcationOfRegularAndMopup(filterData) {
    const reportData: any =
      await ReportService.getMDAbifurcationOfRegularAndMopup(filterData);
    console.log(reportData, 'data');
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
    }
  }

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
    }
  }
  async function getfacilityId(e: any) {
    if (e && e.value) {
      setfacilityId(e && e.value);
    }
  }
  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
      setDistrictName(() => getDistrictName(districtId.data, userDistrictId));
    }
  }

  useEffect(() => {
    getpostcontent();
    prevDistrictRef.current = districtId;
    prevFacilityRef.current = facilityId;
  }, []);

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

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    districtId: Yup.string(),
    facilityId: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
      facilityId: '',
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      setStartMonth(`${values.startMonth}`);
      setEndMonth(`${values.endMonth}`);
      setYear(`${values.year}`);
      setDistrictName(() =>
        getDistrictName(districtIdValues, values.districtId)
      );
      getMDAbifurcationOfRegularAndMopup(values);
    },
    onReset: () => {
      setDistrictName(() => getDistrictName(districtIdValues, userDistrictId));
      setStartMonth('1');
      setEndMonth(`${current_month[0].value}`);
      setYear(`${current_year}`);
      setfacilityName('');
    },
  });

  const getfacilitycontent = useCallback(() => {
    async function getData() {
      if (formik.values.districtId) {
        const facility: any = await DropdownService.getOneFacility(
          formik.values.districtId
        );
        if (facility && facility.data && facility.data.length > 0) {
          setfacilityIdValues(facility.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId]);

  useEffect(() => {
    getfacilitycontent();
  }, [getfacilitycontent]);

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
          <p className='rpthead'>Bifurcation of Regular and Mopup</p>
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
                  `Bifurcation of Regular and Mopup.pdf`,
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
              filename=' Bifurcation of Regular and Mopup'
              sheet=' Bifurcation of Regular and Mopup'
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
                              <div className='col-md-6 col-xl-3 col-12'>
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
                                        // setDistrictName(option && option.label);
                                        setfacilityIdValues([]);
                                        formik.setFieldValue('facilityId', '');
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
                              <div className='col-md-6 col-xl-3 col-12'>
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
                                        option ? option.value : ''
                                      );
                                      // setyear(option && option.label);
                                    }}
                                  ></Select>
                                  {console.log(formik.values.year)}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.year : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-3 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='districtId'
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
                                          option ? option.value : ''
                                        );
                                        getfacilityId(option);
                                        // setfacilityName(option && option.label);
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
            {facilityName !== '' ? `Facility - ` : ''}
            {facilityName !== '' && <b> {facilityName}</b>}
          </div>
        </div>
        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table id='table-to-xlsnew'>
              <thead>
                {' '}
                <tr>
                  <td rowSpan={2}>District Name </td>
                  <td rowSpan={2}>Facility Name</td>
                  <td colSpan={2}>Round</td>
                  <td rowSpan={2}>No of People Administered</td>
                  <td colSpan={7}>No. of person adverse experience</td>
                  <td rowSpan={2}>Remarks</td>
                </tr>{' '}
                <tr>
                  <td>Type</td>
                  <td>Name</td>
                  <td>Fever</td>
                  <td>Headache</td>
                  <td>Bodyache</td>
                  <td>Nausea</td>
                  <td>Vomiting</td>
                  <td>Clinical outcome</td>
                  <td>Required hospital stay</td>
                </tr>
              </thead>
              <tbody>
                {reportTableData && reportTableData.length > 0 ? (
                  reportTableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data: any, index: any) => {
                      return (
                        <>
                          <tr key={index}>
                            <td rowSpan={20}>{data.districtName}</td>
                            <td rowSpan={20}>{data.facilityName}</td>
                            {index === 0 && <td rowSpan={10}>Regular</td>}
                            <td>{data.roundR1}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredR1}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverR1}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheR1}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheR1}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaR1}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingR1}
                            </td>
                            <td align='right'>{data.clinicalOutcomeR1}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayR1 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksr1}</td>
                          </tr>
                          <tr>
                            <td>{data.roundR2}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredR2}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverR2}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheR2}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheR2}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaR2}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingR2}
                            </td>
                            <td align='right'>{data.clinicalOutcomeR2}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayR2 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksr2}</td>
                          </tr>
                          <tr>
                            <td>{data.roundR3}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredR3}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverR3}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheR3}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheR3}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaR3}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingR3}
                            </td>
                            <td align='right'>{data.clinicalOutcomeR3}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayR3 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksr3}</td>
                          </tr>
                          <tr>
                            <td>{data.roundR4}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredR4}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverR4}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheR4}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheR4}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaR4}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingR4}
                            </td>
                            <td align='right'>{data.clinicalOutcomeR4}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayR4 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksr4}</td>
                          </tr>
                          <tr>
                            <td>{data.roundR5}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredR5}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverR5}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheR5}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheR5}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaR5}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingR5}
                            </td>
                            <td align='right'>{data.clinicalOutcomeR5}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayR5 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksr5}</td>
                          </tr>
                          <tr>
                            <td>{data.roundR6}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredR6}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverR6}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheR6}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheR6}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaR6}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingR6}
                            </td>
                            <td align='right'>{data.clinicalOutcomeR6}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayR6 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksr6}</td>
                          </tr>
                          <tr>
                            <td>{data.roundR7}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredR7}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverR7}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheR7}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheR7}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaR7}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingR7}
                            </td>
                            <td align='right'>{data.clinicalOutcomeR7}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayR7 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksr7}</td>
                          </tr>
                          <tr>
                            <td>{data.roundR8}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredR8}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverR8}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheR8}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheR8}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaR8}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingR8}
                            </td>
                            <td align='right'>{data.clinicalOutcomeR8}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayR8 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksr8}</td>
                          </tr>
                          <tr>
                            <td>{data.roundR9}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredR9}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverR9}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheR9}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheR9}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaR9}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingR9}
                            </td>
                            <td align='right'>{data.clinicalOutcomeR9}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayR9 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksr9}</td>
                          </tr>
                          <tr>
                            <td>{data.roundR10}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredR10}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithFeverR10}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheR10}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheR10}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaR10}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingR10}
                            </td>
                            <td align='right'>{data.clinicalOutcomeR10}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayR10 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksr10}</td>
                          </tr>
                          <tr>
                            {index === 0 && <td rowSpan={10}>Mop Up</td>}
                            <td>{data.roundM1}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredM1}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverM1}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheM1}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheM1}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaM1}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingM1}
                            </td>
                            <td align='right'>{data.clinicalOutcomeM1}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayM1 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksm1}</td>
                          </tr>
                          <tr>
                            <td>{data.roundM2}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredM2}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverM2}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheM2}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheM2}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaM2}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingM2}
                            </td>
                            <td align='right'>{data.clinicalOutcomeM2}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayM2 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksm2}</td>
                          </tr>
                          <tr>
                            <td>{data.roundM3}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredM3}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverM3}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheM3}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheM3}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaM3}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingM3}
                            </td>
                            <td align='right'>{data.clinicalOutcomeM3}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayM3 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksm3}</td>
                          </tr>
                          <tr>
                            <td>{data.roundM4}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredM4}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverM4}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheM4}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheM4}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaM4}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingM4}
                            </td>
                            <td align='right'>{data.clinicalOutcomeM4}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayM4 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksm4}</td>
                          </tr>
                          <tr>
                            <td>{data.roundM5}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredM5}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverM5}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheM5}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheM5}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaM5}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingM5}
                            </td>
                            <td align='right'>{data.clinicalOutcomeM5}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayM5 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksm5}</td>
                          </tr>
                          <tr>
                            <td>{data.roundM6}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredM6}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverM6}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheM6}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheM6}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaM6}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingM6}
                            </td>
                            <td align='right'>{data.clinicalOutcomeM6}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayM6 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksm6}</td>
                          </tr>
                          <tr>
                            <td>{data.roundM7}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredM7}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverM7}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheM7}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheM7}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaM7}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingM7}
                            </td>
                            <td align='right'>{data.clinicalOutcomeM7}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayM7 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksm7}</td>
                          </tr>
                          <tr>
                            <td>{data.roundM8}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredM8}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverM8}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheM8}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheM8}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaM8}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingM8}
                            </td>
                            <td align='right'>{data.clinicalOutcomeM8}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayM8 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksm8}</td>
                          </tr>
                          <tr>
                            <td>{data.roundM9}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredM9}
                            </td>
                            <td align='right'>{data.noOfPersonsWithFeverM9}</td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheM9}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheM9}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaM9}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingM9}
                            </td>
                            <td align='right'>{data.clinicalOutcomeM9}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayM9 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksm9}</td>
                          </tr>
                          <tr>
                            <td>{data.roundM10}</td>
                            <td align='right'>
                              {data.noOfPeopleAdministeredM10}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithFeverM10}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithHeadacheM10}
                            </td>

                            <td align='right'>
                              {data.noOfPersonsWithBodyacheM10}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithNauseaM10}
                            </td>
                            <td align='right'>
                              {data.noOfPersonsWithVomitingM10}
                            </td>
                            <td align='right'>{data.clinicalOutcomeM10}</td>
                            <td align='right'>
                              {data.isRequiredHospitalStayM10 ? 'Yes' : 'No'}
                            </td>
                            <td align='right'>{data.remarksm10}</td>
                          </tr>
                        </>
                      );
                    })
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      style={{ textAlign: 'center', height: '100px' }}
                    >
                      No Data found <br />
                      Please select different filter criteria
                    </td>
                  </tr>
                )}
                <tr>
                  <td
                    colSpan={9}
                    style={{ textAlign: 'center', height: '100px' }}
                  ></td>
                </tr>
              </tbody>
            </table>
          </TableContainer>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          {' '}
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

export default BifurcationOfRegularAndMopUP;
