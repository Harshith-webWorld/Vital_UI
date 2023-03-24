import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useUserDistrictId } from '../../../../customHooks/useUserDistrictId';
import Select, { Option } from 'react-select';
import {
  generateGenderLetter,
  ageTextGenerator,
  affectedPartsOptions,
  getDistrictName,
} from '../../utils';
import Row from 'react-bootstrap/Row';
import { FormikProvider, useFormik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import ReportService from '../../../../services/ReportService';
import DropdownService from '../../../../services/DropdownService';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import TableContainer from '@material-ui/core/TableContainer';
import { Menu, TablePagination as Paging } from '@material-ui/core';
import {
  current_year,
  endMonthList,
  initmonth,
  previous_month,
  monthList,
  yearList,
  NoneList,
  current_month,
  findMonthName,
} from '../../../../../Components/constant';
import { Exportpdf } from '../../../../services/PdfService';
import FilterListIcon from '@material-ui/icons/FilterList';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Icon } from '@material-ui/core';

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

const Analysis1 = () => {
  let classes = useStyles();
  const userDistrictId = useUserDistrictId() || '';
  const [reportTableData, setreportTableData] = useState([]);
  const prevDistrictRef: any = React.useRef();
  const [startMonth, setStartMonth] = useState(`01`);
  const [endMonth, setEndMonth] = useState(`${current_month[0].value}`);
  const [year, setYear] = useState(`${new Date().getFullYear()}`);
  const [districtId, setdistrictId] = useState();
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [subcenterIdValues, setsubcenterIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  let [genderIdValues, setgenderIdValues] = useState([]);
  let [gradingIdValues, setgradingIdValues] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `01`,
      endMonth: `${current_month[0].value}`,
      talukaId: '',
      facilityId: '',
      subcenterId: '',
      villageId: '',
      genderId: '',
      gradingId: '',
      affectedPartId: '',
      patientId: '',
    };
  }, []);

  let validSchema = Yup.object().shape({
    year: Yup.string(),
    districtId: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    talukaId: Yup.string(),
    facilityId: Yup.string(),
    subcenterId: Yup.string(),
    villageId: Yup.string(),
    genderId: Yup.string(),
    gradingId: Yup.string(),
    affectedPartId: Yup.string(),
    patientId: Yup.string(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      year: `${current_year}`,
      startMonth: `01`,
      endMonth: `${current_month[0].value}`,
      talukaId: '',
      facilityId: '',
      subcenterId: '',
      villageId: '',
      genderId: '',
      gradingId: '',
      affectedPartId: '',
      patientId: '',
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      setStartMonth(values.startMonth);
      setEndMonth(values.endMonth);
      setYear(values.year);
      getReportAnalysisOne(values);
    },
    onReset: () => {
      const data = initialFilterValue();
      setStartMonth(`01`);
      setEndMonth(`${current_month[0].value}`);
      setYear(`${current_year}`);
      getfacilitycontent(null);
      getReportAnalysisOne(data);
    },
  });

  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
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

  const subcenterIdList =
    subcenterIdValues &&
    subcenterIdValues.map((item: any, i: any) => {
      return { label: item.subCenterName, value: item.id };
    });

  const villageIdList =
    villageIdValues &&
    villageIdValues.map((item: any, i: any) => {
      return { label: item.villageName, value: item.id };
    });

  const genderIdList =
    genderIdValues &&
    genderIdValues.map((item: any, i: any) => {
      return { label: item.categoryOptionName, value: item.categoryOptionEnum };
    });
  const gradingIdList =
    gradingIdValues &&
    gradingIdValues.map((item: any, i: any) => {
      return { label: item.categoryOptionName, value: item.id };
    });

  let yearsList = [...yearList];

  let monthsList = [...monthList];

  async function getReportAnalysisOne(filterData) {
    const reportData: any = await ReportService.getReportLfAnalysis1(
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

  async function getpostcontent() {
    const districtId: any = await DropdownService.getDistrictInfo();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setdistrictIdValues(districtId.data);
    }
  }

  async function getUnitOfUnitList() {
    const districtId: any = await DropdownService.getUnitOfAction();
    if (districtId && districtId.data && districtId.data.length > 0) {
      setgenderIdValues(
        districtId.data.filter((item: any) => item.categoryCode === 1000)
      );
      setgradingIdValues(
        districtId.data.filter((item: any) => item.categoryCode === 1002)
      );
    }
  }

  const getTalukacontent = useCallback(() => {
    async function getData() {
      if (formik.values.districtId) {
        const taluka: any = await DropdownService.getOneTaluka(
          formik.values.districtId
        );
        if (taluka && taluka.data && taluka.data.length > 0) {
          settalukaIdValues(taluka.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId]);

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

  const getSubcentercontent = useCallback(() => {
    async function getData() {
      if (formik.values.districtId && formik.values.facilityId) {
        const subcenter: any = await DropdownService.getOneSubCenter(
          formik.values.facilityId,
          formik.values.districtId
        );
        if (subcenter && subcenter.data && subcenter.data.length > 0) {
          setsubcenterIdValues(subcenter.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId, formik.values.facilityId]);

  const getVillagecontent = useCallback(() => {
    async function getData() {
      if (formik.values.districtId && formik.values.talukaId) {
        const village: any = await DropdownService.getOneVillage(
          formik.values.talukaId,
          formik.values.districtId
        );
        if (village && village.data && village.data.length > 0) {
          setvillageIdValues(village.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId, formik.values.talukaId]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    getfacilitycontent(null);
    getTalukacontent();
    getSubcentercontent();
    getVillagecontent();
  }, [getSubcentercontent, getTalukacontent, getVillagecontent]);

  useEffect(() => {
    const data = initialFilterValue();
    getReportAnalysisOne(data);
  }, [initialFilterValue]);
  useEffect(() => {
    getpostcontent();
    getUnitOfUnitList();
    prevDistrictRef.current = districtId;
  }, [districtId]);
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
            Linelisting of Lymphedema cases & MMDP Report
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
                  `Linelisting of Lymphedema cases & MMDP Report.pdf`,
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
              filename='Linelisting of Lymphedema cases & MMDP Report'
              sheet='Linelisting of Lymphedema cases & MMDP Report'
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
                              <div className='col-md-12 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='districtId'
                                    className='form-label font-chng'
                                  >
                                    District
                                  </label>

                                  <Select
                                    name='districtId'
                                    styles={{
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
                                        option ? option.value : ''
                                      );
                                      getDistrict(option);
                                      settalukaIdValues([]);
                                      formik.setFieldValue('talukaId', '');
                                      setfacilityIdValues([]);
                                      formik.setFieldValue('facilityId', '');
                                      setsubcenterIdValues([]);
                                      formik.setFieldValue('subcenterId', '');
                                      setvillageIdValues([]);
                                      formik.setFieldValue('villageId', '');
                                      getfacilitycontent(
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
                                        styles={{
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
                                            ? monthsList.find(
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
                                        styles={{
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
                                        ? yearsList?.find(
                                            (option: any) =>
                                              option &&
                                              option.value == formik.values.year
                                          )
                                        : yearsList?.find(
                                            (option: any) =>
                                              option &&
                                              option.value ==
                                                new Date().getFullYear()
                                          )
                                    }
                                    options={yearsList}
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
                                    htmlFor='talukaId'
                                    className='form-label font-chng'
                                  >
                                    Taluka
                                  </label>

                                  <Select
                                    name='talukaId'
                                    styles={{
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
                                      talukaIdValues &&
                                      talukaIdValues.length !== 0
                                        ? talukaIdList
                                        : NoneList
                                    }
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
                                        option ? option.value : ''
                                      );
                                      setvillageIdValues([]);
                                      formik.setFieldValue('villageId', '');
                                    }}
                                  ></Select>

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
                                    htmlFor='facilityId'
                                    className='form-label font-chng'
                                  >
                                    Facility
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
                                        option ? option.value : ''
                                      );

                                      setsubcenterIdValues([]);
                                      formik.setFieldValue('subcenterId', '');
                                    }}
                                  ></Select>

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

                                  <Select
                                    name='subcenterId'
                                    styles={{
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
                                      subcenterIdValues &&
                                      subcenterIdValues.length !== 0
                                        ? subcenterIdList
                                        : NoneList
                                    }
                                    isClearable='true'
                                    className={
                                      formik.errors.subcenterId &&
                                      formik.touched.subcenterId
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    value={
                                      formik.values.subcenterId !== ''
                                        ? subcenterIdList
                                          ? subcenterIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ===
                                                  formik.values.subcenterId
                                            )
                                          : ''
                                        : ''
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'subcenterId',
                                        option ? option.value : ''
                                      );
                                    }}
                                  ></Select>

                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.subcenterId
                                      : ''}
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

                                  <Select
                                    name='villageId'
                                    styles={{
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
                                      villageIdValues &&
                                      villageIdValues.length !== 0
                                        ? villageIdList
                                        : NoneList
                                    }
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
                                        option ? option.value : ''
                                      );
                                    }}
                                  ></Select>

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
                                    htmlFor='genderId'
                                    className='form-label font-chng'
                                  >
                                    Gender
                                  </label>

                                  <Select
                                    name='genderId'
                                    styles={{
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
                                      genderIdValues &&
                                      genderIdValues.length !== 0
                                        ? genderIdList
                                        : NoneList
                                    }
                                    isClearable='true'
                                    className={
                                      formik.errors.genderId &&
                                      formik.touched.genderId
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    value={
                                      formik.values.genderId !== ''
                                        ? genderIdList
                                          ? genderIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ===
                                                  formik.values.genderId
                                            )
                                          : ''
                                        : ''
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'genderId',
                                        option ? option.value : ''
                                      );
                                    }}
                                  ></Select>

                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.genderId
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='gradingId'
                                    className='form-label font-chng'
                                  >
                                    Grading
                                  </label>

                                  <Select
                                    menuPortalTarget={document.body}
                                    menuPosition={'fixed'}
                                    name='gradingId'
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
                                      gradingIdValues &&
                                      gradingIdValues.length !== 0
                                        ? gradingIdList
                                        : NoneList
                                    }
                                    isClearable='true'
                                    className={
                                      formik.errors.gradingId &&
                                      formik.touched.gradingId
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    value={
                                      formik.values.gradingId !== ''
                                        ? gradingIdList
                                          ? gradingIdList.find(
                                              (option) =>
                                                option &&
                                                option.value ===
                                                  formik.values.gradingId
                                            )
                                          : ''
                                        : ''
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'gradingId',
                                        option ? option.value : ''
                                      );
                                    }}
                                  ></Select>

                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.gradingId
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label className='form-label font-chng'>
                                    Affected parts
                                  </label>
                                  <Select
                                    menuPortalTarget={document.body}
                                    menuPosition={'fixed'}
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
                                      formik.errors.affectedPartId &&
                                      formik.touched.affectedPartId
                                        ? 'custom-select is-invalid'
                                        : 'custom-select'
                                    }
                                    name='affectedPartId'
                                    isClearable='true'
                                    value={
                                      formik.values.affectedPartId !== ''
                                        ? affectedPartsOptions
                                          ? affectedPartsOptions.find(
                                              (option: any) =>
                                                option &&
                                                option.value ===
                                                  formik.values.affectedPartId
                                            )
                                          : ''
                                        : ''
                                    }
                                    options={affectedPartsOptions}
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        'affectedPartId',
                                        option ? option.value : ''
                                      );
                                      // setmonth(option ? option.label : "");
                                    }}
                                  ></Select>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.affectedPartId
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-4 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='PatientID'
                                    className='form-label font-chng'
                                  >
                                    Patient ID
                                  </label>
                                  <input
                                    name='patientId'
                                    value={
                                      formik.values.patientId
                                        ? formik.values.patientId
                                        : ''
                                    }
                                    onChange={formik.handleChange}
                                    type='text'
                                    // className="form-control"
                                    className={
                                      formik.errors.patientId &&
                                      formik.touched.patientId
                                        ? 'form-control is-invalid'
                                        : 'form-control'
                                    }
                                  ></input>
                                  <div className={'invalid-feedback'}>
                                    {formik.errors
                                      ? formik.errors.patientId
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
        </div>
        <div className='post-tablenew font-chng cus-table'>
          <TableContainer>
            <table
              // style={{
              //   border: 'none',
              //   width: '100%',
              //   borderRadius: '15px',
              // }}
              id='table-to-xlsnew'
            >
              <thead>
                <tr>
                  <td rowSpan={2}>Sr No</td>
                  <td rowSpan={2}>District (IU)</td>
                  <td rowSpan={2}>
                    Block /
                    <br />
                    Urban Planning Unit
                  </td>
                  <td rowSpan={2}>
                    Primary Health Centre /
                    <br /> Urban Health Post
                  </td>
                  <td rowSpan={2}>Health Subcentre</td>
                  <td rowSpan={2}>
                    Village /
                    <br /> Town (with Ward number)
                  </td>
                  <td rowSpan={2}>
                    Name of the Head
                    <br />
                    of the Family
                  </td>
                  <td rowSpan={2}>Patient's Name</td>
                  <td rowSpan={2}>Patient's Id</td>
                  <td rowSpan={2}>Age (in completed years)</td>
                  <td rowSpan={2}>Sex (M/F)</td>
                  <td colSpan={5}>Disease affected part/s (Y/N)</td>
                  <td colSpan={7}>Grading</td>
                  <td rowSpan={2}>
                    Disease For last
                    <br />
                    how many years ?
                  </td>
                  <td rowSpan={2}>
                    Staying in the village For
                    <br />
                    last how many years ?
                  </td>
                  <td rowSpan={2}>Date of last survey</td>
                  <td rowSpan={2}>Patient's Mobile No.</td>
                  <td rowSpan={2}>Date of MMDP</td>
                  <td rowSpan={2}>Services Given</td>
                  <td rowSpan={2}>
                    Service Provider Name
                    <br /> &amp; Designation
                  </td>
                  <td rowSpan={2}>Place</td>
                  <td rowSpan={2}>Remark</td>
                </tr>
                <tr>
                  <td>Leg</td>
                  <td>Hand</td>
                  <td>Scrotum</td>
                  <td>Breast</td>
                  <td>Others</td>
                  <td>I</td>
                  <td>II</td>
                  <td>III</td>
                  <td>IV</td>
                  <td>V</td>
                  <td>VI</td>
                  <td>VII</td>
                  {/* <td >VIII</td> */}
                </tr>
              </thead>
              <tbody>
                {reportTableData && reportTableData.length > 0 ? (
                  reportTableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((data: any, index) => (
                      <tr key={`LFA1${index}`} className='tdata'>
                        <td className='srno' align='right'>
                          {index + 1}
                        </td>
                        <td>{data.districtName}</td>
                        <td>{data.talukaName}</td>
                        <td>{data.facilityName}</td>
                        <td>{data.subCenterName}</td>
                        <td>{data.villageName}</td>
                        <td>{data.headOfFamily}</td>
                        <td>{data.nameOfPatient}</td>
                        <td>{data.patientId}</td>
                        <td>
                          {ageTextGenerator(data.ageYears, data.ageMonths)}
                        </td>
                        <td>{generateGenderLetter(data.gender)}</td>
                        <td>
                          {data.isAffectedLeftLeg || data.isAffectedRightLeg
                            ? 'Y'
                            : ''}
                        </td>
                        <td>
                          {data.isAffectedLeftHand || data.isAffectedRightHand
                            ? 'Y'
                            : ''}
                        </td>
                        <td>
                          {data.isAffectedLeftScrotum ||
                          data.isAffectedRightScrotum
                            ? 'Y'
                            : ''}
                        </td>
                        <td>
                          {data.isAffectedLeftBreast ||
                          data.isAffectedRightBreast
                            ? 'Y'
                            : ''}
                        </td>
                        <td>{data.isAffectedOthers ? 'Y' : ''}</td>
                        <td>{data.gradingname === 'I' && '\u2713'}</td>
                        <td>{data.gradingname === 'II' && '\u2713'}</td>
                        <td>{data.gradingname === 'III' && '\u2713'}</td>
                        <td>{data.gradingname === 'IV' && '\u2713'}</td>
                        <td>{data.gradingname === 'V' && '\u2713'}</td>
                        <td>{data.gradingname === 'VI' && '\u2713'}</td>
                        <td>{data.gradingname === 'VII' && '\u2713'}</td>
                        {/* <td >
                      {data.grading === 8 && "\u2713"}
                    </td> */}
                        <td>
                          {/* {ageTextGenerator(
                            data.diseaseLastedYears,
                            data.diseaseLastedMonths
                          )} */}
                          {getDateDetails(processYears(data.diseaseLastedYears), processMonths(data.diseaseLastedMonths))}
                        </td>
                        <td>
                          {/* {ageTextGenerator(
                            data.stayingInYears,
                            data.stayingInMonths
                          )} */}
                          {getDateDetails(processYears(data.stayingInYears), processMonths(data.stayingInMonths))}
                        </td>
                        <td align='right'>{data.dateOfSurvey}</td>
                        <td align='right'>{data.patientMobileNumber}</td>
                        <td align='right'>{data.serviceMMDPTrainingDate}</td>
                        <td>{data.ServicesGiven}</td>
                        <td>
                          {data.serviceProviderName
                            ? `${data.serviceProviderName},`
                            : ''}
                          {data.serviceProviderDesignation}
                        </td>
                        <td>{data.serviceProviderPlace}</td>
                        <td>
                          <br />
                        </td>
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
                )}{' '}
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

export default Analysis1;
