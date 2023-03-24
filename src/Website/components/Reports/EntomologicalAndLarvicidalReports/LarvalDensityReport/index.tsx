import React, { useState, useEffect, useCallback, useRef } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select, { Option } from 'react-select';
import DropdownService from '../../../../services/DropdownService';
import { years, months, reportTableStyle, getDistrictName } from '../../utils';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ReportService from '../../../../services/ReportService';
import TableContainer from '@material-ui/core/TableContainer';
import { TablePagination as Paging } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
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
import { useSelector } from 'react-redux';

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

const d = new Date();
let currentmonth = d.getMonth();
const LarvalDensityReport = () => {
  let classes = useStyles();
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      year: `${current_year}`,
      month: `${currentmonth}`,
      nameOfUnit: '',
    };
  }, []);
  const prevDistrictRef: any = useRef();
  const prevNameOfunitRef: any = useRef();
  const nameOfUnitNameRef: any = useRef('');
  const [districtId, setdistrictId] = useState();
  const [unitReportTableData, setunitReportTableData] = useState([]);
  const [ruralReportTableData, setruralReportTableData] = useState([]);
  const [districtName, setDistrictName] = useState('');
  const userDistrictId = useUserDistrictId() || '';

  let [districtIdValues, setdistrictIdValues] = useState([]);
  const [nameOfUnitId, setnameOfUnitId] = useState();
  let [nameOfUnitIdValues, setNameOfUnitIdValues] = useState([]);

  const [month, setmonth] = useState(`${current_month[0].value}`);
  const [year, setyear] = useState(`${current_year}`);
  const [nameOfUnitName, setnameOfUnitName] = useState('');

  useEffect(() => {
    const data = initialFilterValue();
    getLarvalDensityReport(data);
  }, [initialFilterValue]);

  async function getLarvalDensityReport(filterData) {
    const reportData: any = await ReportService.getLarvalDensityReport(
      filterData
    );
    if (reportData && reportData.data) {
      setunitReportTableData(reportData.data.Unit);
      setruralReportTableData(reportData.data.Rural);
    }
  }

  async function getDistrict(e: any) {
    if (e && e.value) {
      setdistrictId(e && e.value);
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
    }
  }

  useEffect(() => {
    const data = initialFilterValue();
    getLarvalDensityReport(data);
    getpostcontent();
    getunitOfAction();
    prevDistrictRef.current = districtId;
    prevNameOfunitRef.current = nameOfUnitId;
  }, []);

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  const nameOfUnitIdList =
    nameOfUnitIdValues &&
    nameOfUnitIdValues.map((item: any, i: any) => {
      return { label: item.nameOfControlUnit, value: item.id };
    });

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    month: Yup.string(),
    districtId: Yup.string(),
    nameOfUnitId: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      year: `${current_year}`,
      month: `${currentmonth}`,
      nameOfUnit: '',
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      setmonth(`${values.month}`);
      setyear(`${values.year}`);
      setDistrictName(() =>
        getDistrictName(districtIdValues, values.districtId)
      );
      setnameOfUnitName(nameOfUnitNameRef.current);
      getLarvalDensityReport(values);
    },
    onReset: () => {
      setDistrictName(() => getDistrictName(districtIdValues, userDistrictId));
      setmonth(`${current_month[0].value}`);
      setyear(`${current_year}`);
      setnameOfUnitName('');
      nameOfUnitNameRef.current = '';
      getLarvalDensityReport(initialFilterValue());
    },
  });

  // const [page, setPage] = useState(0);
  // const [rowsPerPage, setRowsPerPage] = useState(10);
  // const handleChangePage = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (event) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };

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
          <p className='rpthead'>Monthly Larval Density Report</p>
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
                  `Monthly Larval Density Report.pdf`,
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
              filename='Monthly Larval Density Report'
              sheet='Monthly Larval Density Report'
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
                                    Name of unit
                                  </label>
                                  {nameOfUnitIdValues &&
                                  nameOfUnitIdValues.length !== 0 ? (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='nameOfUnit'
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
                                        formik.errors.nameOfUnit &&
                                        formik.touched.nameOfUnit
                                          ? 'custom-select is-invalid'
                                          : 'custom-select'
                                      }
                                      value={
                                        formik.values.nameOfUnit !== ''
                                          ? nameOfUnitIdList
                                            ? nameOfUnitIdList.find(
                                                (option) =>
                                                  option &&
                                                  option.value ===
                                                    formik.values.nameOfUnit
                                              )
                                            : ''
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'nameOfUnit',
                                          option ? option.value : ''
                                        );

                                        if(option && option.value){
                                          getDistrictByVCU(option.value)
                                        }                                        // getnameOfUnit(option);
                                        // setnameOfUnitName(
                                        //   option && option.label
                                        // );
                                      }}
                                    ></Select>
                                  ) : (
                                    <Select
                                      menuPortalTarget={document.body}
                                      name='nameOfUnit'
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
                                                    formik.values.nameOfUnit
                                                  )
                                            )
                                          : ''
                                      }
                                      onChange={(option: Option) => {
                                        formik.setFieldValue(
                                          'nameOfUnit',
                                          option ? option.value : ''
                                        );

                                        if(option && option.value){
                                          getDistrictByVCU(option.value)
                                        }
                                        // getDistrictByVCU(option.value)
                                      }}
                                    ></Select>
                                  )}
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.nameOfUnit
                                      : ''}
                                  </div>
                                </div>
                              </div>
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
                                        // getDistrict(option);
                                        // setDistrictName(option && option.label);
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
                                      isDisabled={!!userDistrictId}
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
                                        : monthList.find(
                                            (option: any) =>
                                              option &&
                                              option.value == previous_month
                                          )
                                    }
                                    options={monthList}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'month',
                                        option ? option.value : ''
                                      );
                                      // setmonth(option && option.label);
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
                                      // setyear(option && option.label);
                                    }}
                                  ></Select>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors ? formik.errors.year : ''}
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
        </div>
        <div style={{ display: 'flex', marginBottom: '1%' }}>
          <div className={classes.filterdataStyle}>
            {month !== '' ? `Month - ` : ''}
            {month !== '' && <b>{findMonthName(month)}</b>}
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
            {nameOfUnitName !== '' ? `Name Of Unit - ` : ''}
            {nameOfUnitName !== '' && <b> {nameOfUnitName}</b>}
          </div>
        </div>
        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table id='table-to-xlsnew'>
              <thead>
                <tr>
                  <td rowSpan={2}>
                    Total No.of Breeding <br />
                    Places Checked
                  </td>
                  <td rowSpan={2}>Positive for all Stages</td>
                  <td rowSpan={2}>
                    No. of Positive
                    <br /> for 4th Stage Pupae
                  </td>
                  <td rowSpan={2}>Total No. of Dips Taken</td>
                  <td rowSpan={2}>Total No. of Positive Dips</td>
                  <td colSpan={3}>Total Larvae</td>
                  <td colSpan={3}>
                    Average No. of Larvae
                    <br /> Per Dip
                  </td>
                </tr>
                <tr>
                  <td>Culex</td>
                  <td>Anopheles</td>
                  <td>Pupae</td>
                  <td>Culex</td>
                  <td>Anopheles</td>
                  <td>Pupae</td>
                </tr>
              </thead>
              <tbody>
                {ruralReportTableData && ruralReportTableData.length > 0 && (
                  <tr>
                    <td colSpan={11} align='center'>
                      <b>RURAL AREA ONLY</b>
                    </td>
                  </tr>
                )}
                {ruralReportTableData && ruralReportTableData.length > 0 ? (
                  ruralReportTableData.map((data: any, index: any) => (
                    <tr key={`adu${index}`}>
                      <td align='right'>{data.breedingPlacesChecked}</td>
                      <td align='right'>{data.noOfPosVePlaceIIIandIVStage}</td>
                      <td align='right'>{data.noOfPosVePlaceForPupae}</td>
                      <td align='right'>{data.totalNoOfDipsTaken}</td>
                      <td align='right'></td>
                      <td align='right'>
                        {data.totalCulexLarvaeCount1to4Stage}
                      </td>
                      <td align='right'>{data.totalAnLarvaeCount}</td>
                      <td align='right'>{data.totalCulexPupaeCount}</td>
                      <td align='right'>{data.AverageNoCulexLarva}</td>
                      <td align='right'>{data.AverageNoAnoLarva}</td>
                      <td align='right'>{data.AverageNoPupae}</td>
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
                {unitReportTableData && unitReportTableData.length > 0 && (
                  <tr>
                    <td colSpan={11} align='center'>
                      <b>UNIT AS A WHOLE</b>
                    </td>
                  </tr>
                )}
                {unitReportTableData &&
                  unitReportTableData.length > 0 &&
                  unitReportTableData.map((data: any, index: any) => (
                    <tr key={`adu${index}`}>
                      <td align='right'>{data.breedingPlacesChecked}</td>
                      <td align='right'>{data.noOfPosVePlaceIIIandIVStage}</td>
                      <td align='right'>{data.noOfPosVePlaceForPupae}</td>
                      <td align='right'>{data.totalNoOfDipsTaken}</td>
                      <td align='right'></td>
                      <td align='right'>
                        {data.totalCulexLarvaeCount1to4Stage}
                      </td>
                      <td align='right'>{data.totalAnLarvaeCount}</td>
                      <td align='right'>{data.totalCulexPupaeCount}</td>
                      <td align='right'>{data.AverageNoCulexLarva}</td>
                      <td align='right'>{data.AverageNoAnoLarva}</td>
                      <td align='right'>{data.AverageNoPupae}</td>
                    </tr>
                  ))}
                {unitReportTableData && unitReportTableData.length > 0 && (
                  <>
                    <tr>
                      <td colSpan={11} align='center'>
                        <b>Total of Unit</b>
                      </td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
};
export default LarvalDensityReport;
