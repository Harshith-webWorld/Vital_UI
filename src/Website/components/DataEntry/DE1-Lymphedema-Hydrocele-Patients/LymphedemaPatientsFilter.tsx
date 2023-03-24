import React, { useState, useEffect, useCallback } from 'react';
import {useUserDistrictId} from '../../../customHooks/useUserDistrictId';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import { Row, Col, Button, Container } from 'react-bootstrap';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Icon, Menu } from '@material-ui/core';
import { FormikProvider, useFormik } from 'formik';
import Select, { Option } from 'react-select';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import * as Yup from 'yup';
import { years, months } from '../../Reports/utils';
import ReportService from '../../../services/ReportService';
import DropdownService from '../../../services/DropdownService';
import { NoneList } from '../../../../Components/constant';

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
  }),
);

let styles = {
  menuPortal: base => ({ ...base, zIndex: '9999' }),
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
}



const LymphedemaPatientsFilter = (props) => {
  const {getLymphedemaList, setFilterValues}  = props;
  const userDistrictId = useUserDistrictId() || '';
  let classes = useStyles();
  const prevDistrictRef: any = React.useRef();
  const [reportTableData, setreportTableData] = useState([]);
  const [districtId, setdistrictId] = useState();
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [subcenterIdValues, setsubcenterIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  let [genderIdValues, setgenderIdValues] = useState([]);
  let [gradingIdValues, setgradingIdValues] = useState([]);
  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      talukaId: '',
      facilityId: '',
      subCenterId: '',
      villageId: '',
      gender: '',
      grading: '',
      patientMobileNumber: '',
      ashaMobileNumber: '',
      patientId: '',
      patientName: '',
    };
  }, []);

  useEffect(() => {
    getpostcontent();
    getUnitOfUnitList();
    getfacilitycontent(userDistrictId)
  }, [])
  
  useEffect(() => {
    // getTalukacontent();
    // getSubcentercontent();
    prevDistrictRef.current = districtId;
  }, [districtId]);

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  const monthList = months.map((months, i) => {
    return { label: months.monthName, value: months.month };
  });
  yearList = [...yearList];

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

  let validSchema = Yup.object().shape({
    patientMobileNumber: Yup.string()
    .min(12, 'Invalid Mobile Number')
    .nullable(),
    ashaMobileNumber: Yup.string()
    .min(12, 'Invalid Asha Mobile Number')
    .nullable(),
  });
  const formik = useFormik({
    initialValues: {
      districtId: userDistrictId,
      talukaId: "",
      facilityId: "",
      subCenterId: "",
      villageId: "",
      grading: "",
      gender: "",
      patientId: "",
      patientName: "",
      patientMobileNumber: "",
      ashaMobileNumber: "",
    },
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: (values) => {
      setFilterValues(values)
      getLymphedemaList(values);
    },
    onReset: () => {
      setsubcenterIdValues([]);
      setvillageIdValues([]);
      setFilterValues(initialFilterValue());
      getLymphedemaList(initialFilterValue());
      getfacilitycontent(userDistrictId)
    },
  });

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
        districtId.data.filter((item: any) => item.categoryCode === 1000),
      );
      setgradingIdValues(
        districtId.data.filter((item: any) => item.categoryCode === 1002),
      );
    }
  }

  useEffect(() => {
    async function getData() {
      if (formik.values.districtId) {
        const taluka: any = await DropdownService.getOneTaluka(
          formik.values.districtId,
        );
        if (taluka && taluka.data && taluka.data.length > 0) {
          settalukaIdValues(taluka.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId])

  // const getTalukacontent = useCallback(() => {
  //   async function getData() {
  //     if (formik.values.districtId) {
  //       const taluka: any = await DropdownService.getOneTaluka(
  //         formik.values.districtId,
  //       );
  //       if (taluka && taluka.data && taluka.data.length > 0) {
  //         settalukaIdValues(taluka.data);
  //       }
  //     }
  //   }
  //   getData();
  // }, [formik.values.districtId]);

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
    async function getData() {
      if (formik.values.districtId && formik.values.facilityId) {
        const subcenter: any = await DropdownService.getOneSubCenter(
          formik.values.facilityId,
          formik.values.districtId,
        );
        if (subcenter && subcenter.data && subcenter.data.length > 0) {
          setsubcenterIdValues(subcenter.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId, formik.values.facilityId])

  // const getSubcentercontent = useCallback(() => {
  //   console.log("Subcenter");
  //   async function getData() {
  //     if (formik.values.districtId && formik.values.facilityId) {
  //       const subcenter: any = await DropdownService.getOneSubCenter(
  //         formik.values.facilityId,
  //         formik.values.districtId,
  //       );
  //       if (subcenter && subcenter.data && subcenter.data.length > 0) {
  //         setsubcenterIdValues(subcenter.data);
  //       }
  //     }
  //   }
  //   getData();
  // }, [formik.values.districtId, formik.values.facilityId]);

  useEffect(() => {
    async function getData() {
      if ((formik.values.districtId && formik.values.facilityId) || (formik.values.districtId && formik.values.facilityId && formik.values.subCenterId)) {
        const village: any = await DropdownService.getVillage({
          districtId: formik.values.districtId,
          facilityId: formik.values.facilityId,
          subCenterId: formik.values.subCenterId
        });
        if (village && village.data && village.data.length > 0) {
          setvillageIdValues(village.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId, formik.values.facilityId, formik.values.subCenterId ])

  // const getVillagecontent = useCallback(() => {
  //   async function getData() {
  //     if (formik.values.districtId && formik.values.talukaId) {
  //       const village: any = await DropdownService.getOneVillage(
  //         formik.values.talukaId,
  //         formik.values.districtId,
  //       );
  //       if (village && village.data && village.data.length > 0) {
  //         setvillageIdValues(village.data);
  //       }
  //     }
  //   }
  //   getData();
  // }, [formik.values.districtId, formik.values.talukaId]);

  async function getReportAnalysisOne(filterData) {
    const reportData: any = await ReportService.getReportLfAnalysis1(
      filterData,
    );
    if (reportData && reportData.data) {
      setreportTableData(reportData.data);
    }
  }

  // useEffect(() => {
  //   getfacilitycontent(null);
  //   getTalukacontent();
  //   getSubcentercontent();
  //   getVillagecontent();
  // }, [getSubcentercontent, getTalukacontent, getVillagecontent]);

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
      {(popupState) => (
        <div style={{height: '100%'}}>
          <FilterListIcon
            style={{
              marginRight: '20px',
              cursor: 'pointer',
              float: 'right',
              margin: '55% 15px 0 0',
            }}
            {...bindTrigger(popupState)}>
            Filter
        </FilterListIcon>
          <Menu {...bindMenu(popupState)} style={{ padding: '0px' }}>
            <div className={classes.popup}>
              <div style={{ display: 'flex' }}>
                <form
                  style={{ width: '100%' }}
                  onSubmit={formik.handleSubmit}
                  onChange={formik.handleChange}
                  onReset={formik.handleReset}>
                  <Row className='mb-3' style={{ padding: '0 20px' }}>
                    <div className='col-md-6 col-xl-4 col-12'>
                      {' '}
                      <div className='form-grp'>
                        <label
                          htmlFor='districtId'
                          className='form-label font-chng'>
                          District
                        </label>
                        <Select menuPortalTarget={document.body}
                          styles={styles}
                          className={
                            formik.errors.districtId && formik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='districtId'
                          isClearable='true'
                          isDisabled={!!userDistrictId}
                          value={
                            formik.values.districtId !== ''
                              ? districtIdList
                                ? districtIdList.find(
                                    (option) =>
                                      option &&
                                      option.value ===
                                        formik.values.districtId,
                                  )
                                : ''
                              : ''
                          }
                          options={
                            districtIdValues &&
                            districtIdValues.length !== 0
                              ? districtIdList
                              : NoneList
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'districtId',
                              option ? option.value : '',
                            );
                            getDistrict(option);
                            settalukaIdValues([]);
                            formik.setFieldValue('talukaId', '');
                            setfacilityIdValues([]);
                            formik.setFieldValue('facilityId', '');
                            setsubcenterIdValues([]);
                            formik.setFieldValue('subCenterId', '');
                            setvillageIdValues([]);
                            formik.setFieldValue('villageId', '');
                            getfacilitycontent(
                              option ? option.value : '',
                            );
                          }}></Select>
                        <div className='invalid-feedback'>
                          {formik.errors ? formik.errors.districtId : ''}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-4 col-12'>
                      {' '}
                      <div className='form-grp'>
                        <label
                          htmlFor='talukaId'
                          className='form-label font-chng'>
                          Taluka
                        </label>
                        <Select menuPortalTarget={document.body}
                          styles={styles}
                          className={
                            formik.errors.talukaId && formik.touched.talukaId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='talukaId'
                          isClearable='true'
                          value={
                            formik.values.talukaId !== ''
                              ? talukaIdList
                                ? talukaIdList.find(
                                    (option) =>
                                      option &&
                                      option.value ===
                                        formik.values.talukaId,
                                  )
                                : ''
                              : ''
                          }
                          options={
                            talukaIdValues &&
                            talukaIdValues.length !== 0
                              ? talukaIdList
                              : NoneList
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'talukaId',
                              option ? option.value : '',
                            );
                            setvillageIdValues([]);
                            formik.setFieldValue('villageId', '');
                          }}></Select>
                        <div className='invalid-feedback'>
                          {formik.errors ? formik.errors.talukaId : ''}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-4 col-12'>
                      {' '}
                      <div className='form-grp'>
                        <label
                          htmlFor='facilityId'
                          className='form-label font-chng'>
                          Facility
                        </label>
                        <Select menuPortalTarget={document.body}
                          styles={styles}
                          className={
                            formik.errors.facilityId && formik.touched.facilityId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='facilityId'
                          isClearable='true'
                          value={
                            formik.values.facilityId !== ''
                              ? facilityIdList
                                ? facilityIdList.find(
                                  (option) =>
                                    option &&
                                    option.value ===
                                    formik.values.facilityId,
                                )
                                : ''
                              : ''
                          }
                          options={
                            facilityIdValues &&
                              facilityIdValues.length !== 0
                              ? facilityIdList
                              : NoneList
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'facilityId',
                              option ? option.value : '',
                            );
                            setsubcenterIdValues([]);
                            formik.setFieldValue('subCenterId', '');
                            setvillageIdValues([]);
                            formik.setFieldValue('villageId', '');
                          }}></Select>
                        <div className='invalid-feedback'>
                          {formik.errors ? formik.errors.facilityId : ''}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-4 col-12'>
                      {' '}
                      <div className='form-grp'>
                        <label
                          htmlFor='subCenterId'
                          className='form-label font-chng'>
                          Sub Center
                        </label>
                        <Select menuPortalTarget={document.body}
                          styles={styles}
                          className={
                            formik.errors.subCenterId && formik.touched.subCenterId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='subCenterId'
                          isClearable='true'
                          value={
                            formik.values.subCenterId !== ''
                              ? subcenterIdList
                                ? subcenterIdList.find(
                                    (option) =>
                                      option &&
                                      option.value ===
                                        formik.values.subCenterId,
                                  )
                                : ''
                              : ''
                          }
                          options={
                            subcenterIdValues &&
                            subcenterIdValues.length !== 0
                              ? subcenterIdList
                              : NoneList
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'subCenterId',
                              option ? option.value : '',
                            );
                            setvillageIdValues([]);
                            formik.setFieldValue('villageId', '');
                          }}></Select>
                        <div className='invalid-feedback'>
                          {formik.errors ? formik.errors.subCenterId : ''}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-4 col-12'>
                      {' '}
                      <div className='form-grp'>
                        <label
                          htmlFor='villageId'
                          className='form-label font-chng'>
                          Village
                        </label>
                        <Select menuPortalTarget={document.body}
                          styles={styles}
                          className={
                            formik.errors.villageId && formik.touched.villageId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='villageId'
                          isClearable='true'
                          value={
                            formik.values.villageId !== ''
                              ? villageIdList
                                ? villageIdList.find(
                                    (option) =>
                                      option &&
                                      option.value ===
                                        formik.values.villageId,
                                  )
                                : ''
                              : ''
                          }
                          options={
                            villageIdValues &&
                            villageIdValues.length !== 0
                              ? villageIdList
                              : NoneList
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'villageId',
                              option ? option.value : '',
                            );
                          }}></Select>
                        <div className='invalid-feedback'>
                          {formik.errors ? formik.errors.villageId : ''}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-4 col-12'>
                      {' '}
                      <div className='form-grp'>
                        <label
                          htmlFor='grading'
                          className='form-label font-chng'>
                          Grading
                        </label>
                        <Select menuPortalTarget={document.body}
                          styles={styles}
                          className={
                            formik.errors.grading && formik.touched.grading
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='grading'
                          isClearable='true'
                          value={
                            formik.values.grading !== ''
                              ? gradingIdList
                                ? gradingIdList.find(
                                    (option) =>
                                      option &&
                                      option.value ===
                                        formik.values.grading,
                                  )
                                : ''
                              : ''
                          }
                          options={
                            gradingIdValues &&
                            gradingIdValues.length !== 0
                              ? gradingIdList
                              : NoneList
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'grading',
                              option ? option.value : '',
                            );
                          }}></Select>
                        <div className='invalid-feedback'>
                          {formik.errors ? formik.errors.grading : ''}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-4 col-12'>
                      {' '}
                      <div className='form-grp'>
                        <label
                          htmlFor='gender'
                          className='form-label font-chng'>
                          Gender
                        </label>
                        <Select menuPortalTarget={document.body}
                          styles={styles}
                          className={
                            formik.errors.gender && formik.touched.gender
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='gender'
                          isClearable='true'
                          value={
                            formik.values.gender !== ''
                              ? genderIdList
                                ? genderIdList.find(
                                    (option) =>
                                      option &&
                                      option.value ===
                                        formik.values.gender,
                                  )
                                : ''
                              : ''
                          }
                          options={
                            genderIdValues &&
                            genderIdValues.length !== 0
                              ? genderIdList
                              : NoneList
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'gender',
                              option ? option.value : '',
                            );
                          }}></Select>
                        <div className='invalid-feedback'>
                          {formik.errors ? formik.errors.gender : ''}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-4 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='patientName'
                          className='form-label font-chng'>
                          Patient Name
                                  </label>
                        <input
                          name='patientName'
                          value={
                            formik.values.patientName
                              ? formik.values.patientName
                              : ''
                          }
                          onChange={formik.handleChange}
                          type='text'
                          className={
                            formik.errors.patientName &&
                              formik.touched.patientName
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }></input>
                        <div className={'invalid-feedback'}>
                          {formik.errors
                            ? formik.errors.patientName
                            : ''}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-4 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='PatientID'
                          className='form-label font-chng'>
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
                          className={
                            formik.errors.patientId &&
                              formik.touched.patientId
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }></input>
                        <div className={'invalid-feedback'}>
                          {formik.errors
                            ? formik.errors.patientId
                            : ''}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-4 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='patientMobileNumber'
                          className='form-label font-chng'>
                          Patient Mobile Number
                                  </label>
                        <NumberFormat
                          className={
                            formik.errors.patientMobileNumber &&
                              formik.touched.patientMobileNumber
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='patientMobileNumber'
                          format='#### #### ##'
                          mask=''
                          placeholder='Phone Number Here'
                          value={formik.values.patientMobileNumber}
                          onChange={formik.handleChange}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors
                            ? formik.errors.patientMobileNumber
                            : ''}
                        </div>
                      </div>
                    </div>

                    <div className='col-md-6 col-xl-4 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='ashaMobileNumber'
                          className='form-label font-chng'>
                          Asha Mobile Number
                                  </label>
                        <NumberFormat
                          className={
                            formik.errors.ashaMobileNumber &&
                              formik.touched.ashaMobileNumber
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='ashaMobileNumber'
                          format='#### #### ##'
                          mask=''
                          placeholder='Phone Number Here'
                          value={formik.values.ashaMobileNumber}
                          onChange={formik.handleChange}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors
                            ? formik.errors.ashaMobileNumber
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
                      }}>
                      <button
                        onClick={popupState.close}
                        className='mt-m font-chng btn btn-secondary1'
                        type='submit'>
                        Filter
                      </button>
                      <button
                        className='mt-m font-chng btn btn-secondary1'
                        type='reset'
                        onClick={() => {
                          formik.resetForm();
                        }}
                        style={{ marginLeft: '10px' }}>
                        Clear
                      </button>
                    </div>
                  </Row>
                </form>
                <Icon
                  onClick={popupState.close}
                  style={{ height: '2em' }}>
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
  )
};

export default LymphedemaPatientsFilter;
