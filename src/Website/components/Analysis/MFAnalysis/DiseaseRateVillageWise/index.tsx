import React, { useState, useEffect, useCallback } from 'react';
import Select, { Option } from 'react-select';
import DropdownService from '../../../../services/DropdownService';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import {
  years,
  months,
  reportTableStyle,
  getDistrictName,
} from '../../../Reports/utils';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ReportService from '../../../../services/ReportService';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging } from '@material-ui/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
import { Icon, Menu } from '@material-ui/core';

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
const DiseaseRateVillageWise = () => {
  let classes = useStyles();
  const ref: any = React.createRef();
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const userDistrictId = useUserDistrictId() || '';
  const d = new Date();
  let currentmonth = d.getMonth();
  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      year: `${current_year}`,
      month: `${currentmonth}`,
      villageId: '',
    };
  }, []);
  const prevDistrictRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const prevTalukaRef: any = React.useRef();
  const [districtId, setdistrictId] = useState();
  const [reportTableData, setreportTableData] = useState([]);
  const [districtName, setDistrictName] = useState('');

  let [districtIdValues, setdistrictIdValues] = useState([]);

  const [villageId, setvillageId] = useState();

  let [villageIdValues, setvillageIdValues] = useState([]);

  const [talukaId, settalukaId] = useState();
  let [takulaIdValues, setTalukaIdValues] = useState([]);
  //   const [talukaName, settalukaName] = useState("");

  const [month, setmonth] = useState(`${current_month[0].value}`);
  const [year, setyear] = useState(`${current_year}`);
  const [villageName, setvillageName] = useState('');

  useEffect(() => {
    const data = initialFilterValue();
    getDiseaseRateVillageWise(data);
  }, [initialFilterValue]);

  async function getDiseaseRateVillageWise(filterData) {
    const reportData: any = await ReportService.getDiseaseRateVillageWise(
      filterData
    );
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
    }
  }

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
    }
  }
  async function getvillageId(e: any) {
    if (e && e.value) {
      setvillageId(e && e.value);
    }
  }
  async function getTaluka(e: any) {
    if (e && e.value) {
      settalukaId(e && e.value);
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
    prevFacilityRef.current = villageId;
    prevTalukaRef.current = talukaId;
  }, []);

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  const villageIdList =
    villageIdValues &&
    villageIdValues.map((item: any, i: any) => {
      return { label: item.villageName, value: item.id };
    });
  const talukaIdList =
    takulaIdValues &&
    takulaIdValues.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    month: Yup.string(),
    districtId: Yup.string(),
    villageId: Yup.string(),
    taluka: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      year: `${current_year}`,
      month: `${currentmonth}`,
      villageId: '',
      taluka: '',
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      const data = _.omit(values, ['taluka']);
      setmonth(`${values.month}`);
      setyear(`${values.year}`);
      setDistrictName(() =>
        getDistrictName(districtIdValues, values.districtId)
      );
      getDiseaseRateVillageWise(data);
    },
    onReset: () => {
      setDistrictName(() => getDistrictName(districtIdValues, userDistrictId));
      setmonth(`${current_month[0].value}`);
      setyear(`${current_year}`);
      setvillageName('');
    },
  });

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

  const getvillagecontent = useCallback(() => {
    async function getData() {
      if (formik.values.districtId && formik.values.taluka) {
        const village: any = await DropdownService.getOneVillage(
          formik.values.taluka,
          formik.values.districtId
        );
        if (village && village.data && village.data.length > 0) {
          setvillageIdValues(village.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId, formik.values.taluka]);

  useEffect(() => {
    getvillagecontent();
    getTalukacontent();
  }, [getvillagecontent, getTalukacontent]);

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
        doc.save('Disease Rate Village Wise.pdf');
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
          <p className='rpthead'>Disease Rate Village Wise</p>
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
                  `Disease Rate Village Wise.pdf`,
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
              filename=' Disease Rate Village Wise'
              sheet=' Disease Rate Village Wise'
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
                                                  option.value ==
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
                                        formik.setFieldValue('villageId', '');
                                        formik.setFieldValue('talukaId', '');
                                        setvillageIdValues([]);
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
                              <div className='col-md-6 col-xl-3 col-12'>
                                {' '}
                                <div className='form-grp'>
                                  <label
                                    htmlFor='email'
                                    className='form-label font-chng'
                                  >
                                    Month
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
                                      formik.errors.month &&
                                      formik.touched.month
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    name='month'
                                    isClearable='true'
                                    value={
                                      formik.values.month !== ''
                                        ? monthList
                                          ? monthList.find(
                                              (option: any) =>
                                                option &&
                                                option.value ==
                                                  formik.values.month
                                            )
                                          : ''
                                        : ''
                                    }
                                    options={monthList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'month',
                                        option ? option.value : ''
                                      );
                                      // setmonth(option ? option.label : '');
                                    }}
                                  ></Select>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.month : ''}
                                  </div>
                                </div>
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
                                      // setyear(option ? option.label : '');
                                    }}
                                  ></Select>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.year : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-3 col-12'>
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
                                        formik.setFieldValue('villageId', '');
                                        setvillageIdValues([]);
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
                              <div className='col-md-6 col-xl-3 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='districtId'
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
                                                  option.value ==
                                                    formik.values.villageId
                                              )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'villageId',
                                          option ? option.value : ''
                                        );
                                        getvillageId(option);
                                        setvillageName(
                                          option ? option.value : ''
                                        );
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
                                          option ? option.value : ''
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
            {month !== '' ? `Month - ` : ''}
            {month !== '' && <b> {findMonthName(month)}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {year !== '' ? `Year - ` : ''}
            {year !== '' && <b> {year}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {districtName !== '' ? `District - ` : ''}
            {districtName !== '' && <b> {districtName}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {villageName !== '' ? `Village -  ` : ''}
            {villageName !== '' && <b>{villageName}</b>}{' '}
          </div>
        </div>
        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table id='table-to-xlsnew'>
              <thead>
                {' '}
                <tr>
                  <td>Sr. No.</td>
                  <td>Name of Village</td>
                  <td>Name of District</td>
                  <td>Name of P.H.C.</td>
                  <td>Name of Unit</td>

                  <td>No.Of +ve For MF</td>
                  <td>
                    No.Of MF +ve
                    <br /> Examined
                  </td>
                  <td>MF Rate</td>
                  <td>
                    No.Of +ve For
                    <br /> Disease Cases
                  </td>

                  <td>Disease Rate</td>
                </tr>
              </thead>
              <tbody>
                {reportTableData && reportTableData.length > 0 ? (
                  reportTableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data: any, index: any) => {
                      return (
                        <tr key={`VW${index}`}>
                          <td>{index + 1}</td>
                          <td>{data.villageName}</td>
                          <td>{data.districtName}</td>
                          <td>{data.facilityName}</td>
                          <td>{data.nameOfUnit}</td>
                          <td align='right'>{data.noOfPersonsMF}</td>
                          <td align='right'>{data.noOfPersonsExam}</td>
                          <td align='right'>{data.MFRate}</td>
                          <td align='right'>{data.noOfPersonsDes}</td>
                          <td align='right'>{data.DesRate}</td>
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
                <tr>
                  <td
                    colSpan={7}
                    style={{ textAlign: 'center', height: '40px' }}
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

export default DiseaseRateVillageWise;
