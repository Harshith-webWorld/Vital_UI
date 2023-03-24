import Table1 from './Table1';
import React, { useState, useEffect, useRef } from 'react';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import Select, { Option } from 'react-select';
import DropdownService from '../../../../services/DropdownService';
import { years, months, reportTableStyle, getDistrictName } from '../../utils';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import ReportService from '../../../../services/ReportService';
import { Exportpdf } from '../../../../services/PdfService';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CloseIcon from '@material-ui/icons/Close';
import { Icon, Menu } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
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
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
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
const AnalysisTwo = () => {
  let classes = useStyles();
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const userDistrictId = useUserDistrictId() || '';

  const [initialFilterValue, setinitialFilterValue] = useState({
    districtId: userDistrictId,
    year: `${current_year}`,
    startMonth: `1`,
    endMonth: `${current_month[0].value}`,
    facilityId: '',
    nameOfUnitId: '',
  });
  const prevDistrictRef: any = useRef();
  const prevFacilityRef: any = useRef();
  const prevNameOfunitRef: any = useRef();
  const nameOfUnitNameRef: any = useRef('');
  const [districtId, setdistrictId] = useState();
  const [reportTableData, setreportTableData] = useState([]);
  const [districtName, setDistrictName] = useState('');

  let [districtIdValues, setdistrictIdValues] = useState([]);

  const [facilityId, setfacilityId] = useState();
  const [nameOfUnitId, setnameOfUnitId] = useState();

  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [nameOfUnitIdValues, setNameOfUnitIdValues] = useState([]);

  const [startMonth, setStartMonth] = useState(`1`);
  const [endMonth, setEndMonth] = useState(`${current_month[0].value}`);
  const [year, setYear] = useState(`${current_year}`);
  const [facilityName, setfacilityName] = useState('');
  const [nameOfUnitName, setnameOfUnitName] = useState('');

  async function getFCUAnalysis2(filterData) {
    const reportData: any = await ReportService.getFCUAnalysis2(filterData);
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
  async function getnameOfUnit(e: any) {
    if (e && e.value) {
      setnameOfUnitId(e && e.value);
    }
  }
  async function getDistrictByVCU(val: any) {
    const districtData: any = await DropdownService.getDistrictByVCU(val);
    setdistrictId(districtData.data.districtId)
    formik.setFieldValue(
      'districtId',
      districtData.data.districtId
    );
    getfacilitycontent(districtData.data.districtId)
  }
  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
      setDistrictName(() => getDistrictName(districtId.data, userDistrictId));
    }
  }
  async function getunitOfAction() {
    const unitOfAction: any = await DropdownService.getNameOfUnit('FCU', 1);
    if (unitOfAction && unitOfAction.data && unitOfAction.data.length > 0) {
      setNameOfUnitIdValues(unitOfAction.data);
      formik.setFieldValue('nameOfUnitId', unitOfAction.data[0].id);
      setinitialFilterValue({
        ...initialFilterValue,
        nameOfUnitId: unitOfAction.data[0].id,
      });
      setnameOfUnitName(unitOfAction.data[0].nameOfControlUnit);
    }
  }

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

  const nameOfUnitIdList =
    nameOfUnitIdValues &&
    nameOfUnitIdValues.map((item: any, i: any) => {
      return { label: item.nameOfControlUnit, value: item.id };
    });

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    districtId: Yup.string(),
    facilityId: Yup.string(),
    nameOfUnitId: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
      facilityId: '',
      nameOfUnitId: '',
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
      setnameOfUnitName(nameOfUnitNameRef.current);
      getFCUAnalysis2(values);
    },
    onReset: () => {
      setDistrictName(() => getDistrictName(districtIdValues, userDistrictId));
      setStartMonth('1');
      setEndMonth(`${current_month[0].value}`);
      setYear(`${current_year}`);
      setnameOfUnitName('');
      nameOfUnitNameRef.current = '';
      getFCUAnalysis2({
        districtId: '',
        year: `${current_year}`,
        startMonth: `${previous_month}`,
        endMonth: `${previous_month}`,
        facilityId: '',
        nameOfUnitId: '',
      });
    },
  });

  const getfacilitycontent = async (districtId) => {
    let param = {};
    if (districtId) {
      param = { districtId: `${districtId}` };
    }
    const facility: any = await DropdownService.getFacilityInfoDropDown(param);
    if (facility && facility.data && facility.data.length > 0) {
      setfacilityIdValues(facility.data);
    }
  };
  useEffect(() => {
    getfacilitycontent(null);
  }, []);

  useEffect(() => {
    const data = initialFilterValue;
    getFCUAnalysis2(data);
  }, [initialFilterValue]);
  useEffect(() => {
    getpostcontent();
    getunitOfAction();
    prevDistrictRef.current = districtId;
    prevFacilityRef.current = facilityId;
    prevNameOfunitRef.current = nameOfUnitId;
  }, []);

  return (
    <div>
      <style>{`
  td {
    padding: 6px 20px;
    white-space: nowrap;
  }
`}</style>{' '}
      <div
        style={{
          backgroundColor: '#ffff',
          borderRadius: '10px',
        }}
      >
        <div style={{ display: 'flex', marginTop: '2%', marginBottom: '1%' }}>
          <p className='rpthead'>
            Monthly B.S. Collection, Target, B.S. Examiniation, MF Positive &
            Treatment Report Only for Fix B.S. Collection
          </p>
        </div>
        <div
          style={{
            display: 'flex',
            float: 'right',
            marginBottom: '1%',
          }}
        >
          <button
            className='mt-m font-chng btn btn-secondary1'
            onClick={() =>
              Exportpdf(
                'table-to-xlsnew',
                `Monthly B.S. Collection, Target, B.S. Examiniation, MF Positive &
        Treatment Report Only for Fix B.S. Collection.pdf`,
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
            filename='Monthly B.S. Collection, Target, B.S. Examiniation, MF Positive &
        Treatment Report Only for Fix B.S. Collection'
            sheet='Monthly B.S. Collection, Target, B.S. Examiniation, MF Positive &
        Treatment Report Only for Fix B.S. Collection'
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
                            <div className='col-md-6 col-xl-4 col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='districtId'
                                  className='form-label font-chng'
                                >
                                  Name of unit
                                </label>
                                {nameOfUnitIdValues &&
                                nameOfUnitIdValues.length !== 0 ? (
                                  <Select
                                    menuPortalTarget={document.body}
                                    name='nameOfUnitId'
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
                                    options={nameOfUnitIdList}
                                    isClearable='true'
                                    className={
                                      formik.errors.nameOfUnitId &&
                                      formik.touched.nameOfUnitId
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    value={
                                      formik.values.nameOfUnitId !== ''
                                        ? nameOfUnitIdList?.find(
                                            (option) =>
                                              option &&
                                              option.value ===
                                                formik.values.nameOfUnitId
                                          )
                                        : nameOfUnitIdList[0]
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'nameOfUnitId',
                                        option ? option.value : ''
                                      );
                                      getnameOfUnit(option);
                                      setnameOfUnitName(option && option.label);
                                      if(option && option.value){
                                        getDistrictByVCU(option.value)
                                      }                                    }}
                                  ></Select>
                                ) : (
                                  <Select
                                    menuPortalTarget={document.body}
                                    name='nameOfUnitId'
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
                                                  formik.values.nameOfUnitId
                                                )
                                          )
                                        : ''
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'nameOfUnitId',
                                        option ? option.value : ''
                                      );
                                      if(option && option.value){
                                        getDistrictByVCU(option.value)
                                      }
                                    }}
                                  ></Select>
                                )}
                                <div className={'invalid-feedback'}>
                                  {formik.errors
                                    ? formik.errors.nameOfUnitId
                                    : ''}
                                </div>
                              </div>
                            </div>
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
                                        option && option.value
                                      );
                                      getDistrict(option);
                                      // setDistrictName(option && option.label);
                                      formik.setFieldValue('facilityId', '');
                                      getfacilitycontent(
                                        option ? option.value : null
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
                                            ).find(
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
                                        // setendMonth(option ? option.label : '');
                                      }}
                                    ></Select>
                                    <div
                                      className={'invalid-feedback'}
                                      style={{
                                        display: 'block',
                                        color:
                                          formik.values.startMonth == ''
                                            ? 'rgb(127, 131, 137)'
                                            : '#dc3545',
                                      }}
                                    >
                                      {formik.errors
                                        ? formik.errors.endMonth
                                        : ''}
                                      {formik.values.startMonth == ''
                                        ? 'Select From Month  to show To Month'
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
                                            option.value ==
                                              new Date().getFullYear()
                                        )
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
        <div style={{ display: 'flex' }}>
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
          </div>
          <div className={classes.filterdataStyle}>
            {districtName !== '' ? `District - ` : ''}
            {districtName !== '' && <b> {districtName}</b>}
          </div>{' '}
          <div className={classes.filterdataStyle}>
            {facilityName !== '' ? `Facility - ` : ''}
            {facilityName !== '' && <b> {facilityName}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {nameOfUnitName !== '' ? `Name of unit - ` : ''}
            {nameOfUnitName !== '' && <b> {nameOfUnitName}</b>}
          </div>
        </div>
        <Table1
          reportTableData={reportTableData}
          createpdf={() =>
            Exportpdf(
              'table-to-xls',
              'Monthly B.S. Collection, Target, B.S. Examiniation, MF Positive & Treatment Report Only for Fix B.S. Collection.pdf',
              'p',
              210,
              295
            )
          }
          id='table-to-xls'
          districtName={districtName}
          startMonth={startMonth}
          endMonth={endMonth}
          year={year}
          facilityName={facilityName}
          nameOfUnitName={nameOfUnitName}
        />
      </div>
    </div>
  );
};

export default AnalysisTwo;
