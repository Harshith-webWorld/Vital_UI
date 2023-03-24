import React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select, { Option } from 'react-select';
import { years, months, getDistrictName, reportTableStyle } from '../../utils';
import DropdownService from '../../../../services/DropdownService';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
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
  findtotal,
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

const FSUAnalysis3 = () => {
  let classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const userDistrictId = useUserDistrictId() || '';
  const [initialFilterValue, setinitialFilterValue] = useState({
    nameOfUnitId: '',
    districtId: userDistrictId,
    year: `${current_year}`,
    startMonth: `1`,
    endMonth: `${current_month[0].value}`,
  });
  const prevDistrictRef: any = React.useRef();
  const prevNameOfunitRef: any = React.useRef();
  const nameOfUnitNameRef: any = useRef('');
  const [districtId, setdistrictId] = useState();
  const [reportTableData, setreportTableData] = useState([]);
  const [startMonth, setStartMonth] = useState(`1`);
  const [endMonth, setEndMonth] = useState(`${current_month[0].value}`);
  const [year, setYear] = useState(`${current_year}`);
  let [districtIdValues, setdistrictIdValues] = useState([]);
  const [nameOfUnitId, setnameOfUnitId] = useState();
  let [nameOfUnitIdValues, setNameOfUnitIdValues] = useState([]);
  const [districtName, setdistrictName] = useState('');
  const [nameOfUnitName, setnameOfUnitName] = useState('');
  const [fromDate, setFromDate] = useState(initmonth);
  const [toDate, setToDate] = useState(initmonth);

  let yearsList = [...yearList];
  let monthsList = [...monthList];

  async function getFSUAnalysis3Data(filterData) {
    const reportData: any = await ReportService.getFSUAnalysis3(filterData);
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
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
  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
      setdistrictName(() => getDistrictName(districtId.data, userDistrictId));
    }
  }
  async function getunitOfAction() {
    const unitOfAction: any = await DropdownService.getNameOfUnit('FSU', 1);
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

  const nameOfUnitIdList =
    nameOfUnitIdValues &&
    nameOfUnitIdValues.map((item: any, i: any) => {
      return { label: item.nameOfControlUnit, value: item.id };
    });

  let validSchema = Yup.object().shape({
    districtId: Yup.string(),
    nameOfUnitId: Yup.string(),
    year: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      nameOfUnitId: '',
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `1`,
      endMonth: `${current_month[0].value}`,
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
      getFSUAnalysis3Data(values);
      setnameOfUnitName(nameOfUnitNameRef.current);
    },
    onReset: () => {
      setdistrictName(() => getDistrictName(districtIdValues, userDistrictId));
      setStartMonth('1');
      setEndMonth(`${current_month[0].value}`);
      setYear(`${current_year}`);
      setnameOfUnitName('');
      nameOfUnitNameRef.current = '';
      setnameOfUnitName('');
    },
  });
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  useEffect(() => {
    getpostcontent();
    getunitOfAction();
    prevDistrictRef.current = districtId;
    prevNameOfunitRef.current = nameOfUnitId;
  }, []);

  useEffect(() => {
    const data = initialFilterValue;
    getFSUAnalysis3Data(data);
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
          <p className='rpthead'>Monthly Abstract Report Filaria Survey Unit</p>
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
                  `Monthly Abstract Report filaria Survey Unit.pdf`,
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
              filename='Monthly Abstract Report filaria Survey Unit'
              sheet='Monthly Abstract Report filaria Survey Unit'
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
                                    options={
                                      nameOfUnitIdValues &&
                                      nameOfUnitIdValues.length !== 0
                                        ? nameOfUnitIdList
                                        : NoneList
                                    }
                                    isClearable='true'
                                    className={
                                      formik.errors.nameOfUnitId &&
                                      formik.touched.nameOfUnitId
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    value={
                                      formik.values.nameOfUnitId !== ''
                                        ? nameOfUnitIdList
                                          ? nameOfUnitIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ===
                                                  formik.values.nameOfUnitId
                                            )
                                          : ''
                                        : ''
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'nameOfUnitId',
                                        option?.value && option.value !== 0
                                          ? option.value
                                          : ''
                                      );
                                      // setnameOfUnitName(
                                      //   option ? option.label : ''
                                      // );

                                      getnameOfUnit(option);
                                    }}
                                  ></Select>

                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.nameOfUnitId
                                      : ''}
                                  </div>
                                </div>
                              </div>{' '}
                              <div className='col-md-6 col-xl-4 col-12'>
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
                                      // setdistrictName(
                                      //   option?.value &&
                                      //     option.value !== 0 &&
                                      //     option.label
                                      // );
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
                                            ? monthsList?.find(
                                                (option: any) =>
                                                  option &&
                                                  option.value ==
                                                    formik.values.startMonth
                                              )
                                            : monthsList?.find(
                                                (option: any) =>
                                                  option &&
                                                  option.value == previous_month
                                              )
                                        }
                                        options={monthsList}
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
                                          // setendMonth(
                                          //   option ? option.label : ''
                                          // );
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
                                        ? yearsList?.find(
                                            (option: any) =>
                                              option &&
                                              option.value == formik.values.year
                                          )
                                        : yearsList?.find(
                                            (option: any) =>
                                              option &&
                                              option.value == current_year
                                          )
                                    }
                                    options={yearsList}
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
          </div>
          <div className={classes.filterdataStyle}>
            {districtName !== '' ? `District - ` : ''}
            {districtName !== '' && <b> {districtName}</b>}
          </div>
          <div className={classes.filterdataStyle}>
            {nameOfUnitName !== '' ? `Name of unit - ` : ''}
            {nameOfUnitName !== '' && <b> {nameOfUnitName}</b>}
          </div>
        </div>

        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table id='table-to-xlsnew'>
              <thead>
                {' '}
                <tr>
                  <td rowSpan={3}>Period Of Survey</td>
                  <td colSpan={2} rowSpan={2}>
                    Total Surveyed
                  </td>
                  <td colSpan={2} rowSpan={2}>
                    Population Surveyed
                  </td>
                  <td rowSpan={3}>
                    Target Of
                    <br /> BS Collection
                  </td>
                  <td rowSpan={3}>BS Collection</td>
                  <td rowSpan={3}>
                    Achieved Of
                    <br /> BS Collection %
                  </td>
                  <td rowSpan={3}>BS Exam.</td>
                  <td colSpan={3} rowSpan={2}>
                    Filaria Cases Detected
                  </td>
                  <td colSpan={3} rowSpan={2}>
                    Filaria Cases Treatment
                  </td>
                </tr>
                <tr className='row1'></tr>
                <tr>
                  <td>Village</td>
                  <td>City</td>
                  <td>Village</td>
                  <td>City</td>
                  <td>MF</td>
                  <td>Disease</td>
                  <td>Total</td>
                  <td>MF</td>
                  <td>Disease</td>
                  <td>Total</td>
                </tr>
              </thead>

              <tbody>
                {reportTableData && reportTableData.length > 0 ? (
                  reportTableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data: any, index: any) => (
                      <tr>
                        <td align='right'>
                          {`${data.year} - ${startMonth} ` + ` to ${endMonth} `}
                        </td>
                        <td align='right'></td>
                        <td align='right'></td>
                        <td align='right'>{data.totalPopulationVillage}</td>
                        <td></td>
                        <td align='right'>{data.targetForCollectionOfNBS}</td>
                        <td align='right'>{data.NoOfBSCollected}</td>
                        <td align='right'>{data.AchivedOfBSCollection}</td>
                        <td align='right'>{data.NoOfBSExamined}</td>
                        <td align='right'>{data.NoOfMFPostve}</td>
                        <td align='right'>{data.FoundDesPostve}</td>
                        <td align='right'>{data.FoundTotPostve}</td>
                        <td align='right'>{data.MFCasesTreatment}</td>
                        <td align='right'>{data.DecCasesTreatment}</td>
                        <td align='right'>{data.TotCasesTreatment}</td>
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
                {reportTableData && reportTableData.length > 0 && (
                  <tr>
                    <td align='right'>Total</td>
                    <td align='right'></td>
                    <td align='right'></td>
                    <td align='right'>
                      {reportTableData?.length > 0 &&
                        findtotal(reportTableData, 'totalPopulationVillage')}
                    </td>
                    <td align='right'></td>
                    <td align='right'>
                      {reportTableData?.length > 0 &&
                        findtotal(reportTableData, 'targetForCollectionOfNBS')}
                    </td>
                    <td align='right'>
                      {reportTableData?.length > 0 &&
                        findtotal(reportTableData, 'NoOfBSCollected')}
                    </td>
                    <td align='right'>
                      {reportTableData?.length > 0 &&
                        findtotal(reportTableData, 'AchivedOfBSCollection')}
                    </td>
                    <td align='right'>
                      {reportTableData?.length > 0 &&
                        findtotal(reportTableData, 'NoOfBSExamined')}
                    </td>
                    <td align='right'>
                      {reportTableData?.length > 0 &&
                        findtotal(reportTableData, 'NoOfMFPostve')}
                    </td>
                    <td align='right'>
                      {reportTableData?.length > 0 &&
                        findtotal(reportTableData, 'FoundDesPostve')}
                    </td>
                    <td align='right'>
                      {reportTableData?.length > 0 &&
                        findtotal(reportTableData, 'FoundTotPostve')}
                    </td>
                    <td align='right'>
                      {reportTableData?.length > 0 &&
                        findtotal(reportTableData, 'MFCasesTreatment')}
                    </td>
                    <td align='right'>
                      {reportTableData?.length > 0 &&
                        findtotal(reportTableData, 'DecCasesTreatment')}
                    </td>
                    <td align='right'>
                      {reportTableData?.length > 0 &&
                        findtotal(reportTableData, 'TotCasesTreatment')}
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
export default FSUAnalysis3;
