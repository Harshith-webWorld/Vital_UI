import React, { useState, useEffect, useCallback } from 'react';
import {useUserDistrictId} from '../../../customHooks/useUserDistrictId';
import NumberFormat from 'react-number-format';
import { Row, Col, Button, Container } from 'react-bootstrap';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import FilterListIcon from '@material-ui/icons/FilterList';
import { Icon, Menu } from '@material-ui/core';
import { useFormik } from 'formik';
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



const MFPositiveFilter = (props) => {
  const { getPositiveList, setFilterValues } = props;
  let classes = useStyles();
  const userDistrictId = useUserDistrictId() || '';
  const prevDistrictRef: any = React.useRef();
  const [reportTableData, setreportTableData] = useState([]);
  const [districtId, setdistrictId] = useState();
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [subcenterIdValues, setsubcenterIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  const initialFilterValue = useCallback(() => {
    return {
      districtId: userDistrictId,
      talukaId: '',
      facilityId: '',
      subCenterId: '',
      villageId: '',
    };
  }, []);

  useEffect(() => {
    getpostcontent();
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
    },
    enableReinitialize: true,
    // validationSchema: validSchema,
    onSubmit: (values) => {
      setFilterValues(values)
      getPositiveList(values);
    },
    onReset: () => {
      setFilterValues(initialFilterValue())
      getPositiveList(initialFilterValue())
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

  const getTalukacontent = useCallback(() => {
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
          formik.values.districtId,
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
          formik.values.districtId,
        );
        if (village && village.data && village.data.length > 0) {
          setvillageIdValues(village.data);
        }
      }
    }
    getData();
  }, [formik.values.districtId, formik.values.talukaId]);

  useEffect(() => {
    getfacilitycontent(null);
    getTalukacontent();
    getSubcentercontent();
    getVillagecontent();
  }, [getSubcentercontent, getTalukacontent, getVillagecontent]);

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
      {(popupState) => (
        <div style={{ height: '100%' }}>
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
                            formik.setFieldValue('subcenterId', '');
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

export default MFPositiveFilter;
