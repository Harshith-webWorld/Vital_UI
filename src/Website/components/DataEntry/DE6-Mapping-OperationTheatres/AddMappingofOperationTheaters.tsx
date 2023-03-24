import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Container } from 'react-bootstrap';
import { MultiSelect } from 'react-multi-select-component';
import { useSelector } from 'react-redux';

import Breadcrumb from 'react-bootstrap/Breadcrumb';
import * as Yup from 'yup';
import {
  useFormik,
  FormikProvider,
  FieldArray,
  Field,
  ErrorMessage,
  FormikErrors,
} from 'formik';
import { useLocation } from 'react-router';
import history from '../../../../helpers/history';
import MappingOfOT from '../../../interfaces/FormMappingOfOT';
import MappingOfOTService from '../../../services/FormMappingOfOTService';
import DropdownService from '../../../services/DropdownService';
import Delete from '../../../assets/img/LEFP_Images/deletesection.png';
import Select, { Option } from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonFunction from '../../../../helpers/common/common';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import mappingOfOperationTheatersDraftServices from '../../../draftServices/FormMappingOfOTDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';

const AddMappingOfOperationTheaters: React.FC<any> = (props) => {
  const listDESheetName: any = props && props.listDESheetName;
  const location = useLocation<any>();
  const userInfo = useSelector((state: any) => state);
  const headQtrSelect = {
    facilityName: 'Select Head Qtr',
    districtId: 0,
    stateId: 14,
    isActive: true,
    createdBy: null,
    lastModifiedBy: null,
  };
  const headQtrOthers = {
    facilityName: 'Others',
    districtId: 0,
    stateId: 14,
  };
  const facilityNoneLabel = {
    facilityName: 'None',
    districtId: 0,
    id: 0,
  };
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const monthsText = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  const PHCchange = (selected: any) => {
    setwherePHCoption(selected);
    console.log(selected, 'test');
    console.log(selected.map((item) => item.label).join(','), 'testtt');
    console.log(wherePHCoption, 'ff');
    formik.setFieldValue(
      'mappingOfOTPhcAttachedToTheaters',
      selected.map((item) => {
        return {
          facilityId: item.value,
          createdBy: userInfo.Admin.signin.data.id,
          lastModifiedBy: userInfo.Admin.signin.data.id,
        };
      })
    );
    console.log(userInfo, 'user');
    console.log(userInfo.Admin.signin.data.id, 'userr');
  };
  const currentYear = new Date().getFullYear();
  const range = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  const years = range(currentYear, currentYear - 50, -1);
  let isOnline = window.navigator.onLine;
  const [districtList, setdistrictList] = useState([]);
  const [districtId, setdistrictId] = useState([]);
  const [corporationList, setcorporationList] = useState([]);
  const [talukaList, settalukaList] = useState([]);
  const [facilityList, setfacilityList] = useState([]);
  const [headQtrList, setheadOtrList] = useState([]);
  const [privateShow, setPrivateShow] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [wherePHCoption, setwherePHCoption] = useState([]);

  useEffect(() => {
    getDistrictdetails();
    getEditData();
  }, []);

  let NoneList = [{ label: 'None', value: 0 }];

  const prevDistrictRef: any = React.useRef();
  let selectFacilityRef: any = React.useRef();
  useEffect(() => {
    prevDistrictRef.current = districtId;
  });
  const prevDistrictIdValue = prevDistrictRef.current;
  let selectCorporationRef: any = useRef();
  let selectTalukaRef: any = useRef();

  const handlePrivateHospital = (e) => {
    if (e.target.value == 'Private') {
      setPrivateShow(true);
    } else {
      setPrivateShow(false);
    }
  };

  async function getDistrict(e: any) {
    setdistrictId(e && e.value);
    console.log('current value', e && e.value);
    console.log('previous value', prevDistrictIdValue);
    if (!((e && e.value) === prevDistrictIdValue)) {
      if (e === null) {
        formik.setFieldValue('corporationId', 0);
        formik.setFieldValue('talukaId', 0);
        formik.setFieldValue('mappingOfOTPhcAttachedToTheaters', 0);
        let headqtrarr =
          formik && formik.values && formik.values.mappingOfOTSurgeons;
        formik &&
          formik.values &&
          formik.values.mappingOfOTSurgeons.map((othersObj: any) => {
            othersObj.headquarter = 'None';
          });
      }
      let corporationIdOffline: any;
      let corporationId: any;
      if (!isOnline) {
        corporationIdOffline = await DexieOfflineDataBase.getCorporationOffline(
          e && e.value
        );
      } else {
        corporationId = await DropdownService.getOneCorporation(e && e.value);
      }
      if (
        (corporationId &&
          corporationId.data &&
          corporationId.data.length > 0) ||
        (corporationIdOffline && corporationIdOffline.length > 0)
      ) {
        selectCorporationRef.current.select.clearValue();
        let corporationData: any;
        if (!isOnline) {
          corporationData = [
            OptionLabel.corporationNone,
            ...corporationIdOffline,
          ];
        } else {
          corporationData = [
            OptionLabel.corporationNone,
            ...corporationId.data,
          ];
        }
        OptionLabel.corporationNone.districtId = e.value;
        formik.setFieldValue('corporationId', '');
        setcorporationList(corporationData);
      } else {
        selectCorporationRef.current.select.clearValue();
        formik.setFieldValue('corporationId', 0);
      }
      let talukaIdOffline: any;
      let talukaId: any;
      if (!isOnline) {
        talukaIdOffline = await DexieOfflineDataBase.getTalukaOffline(
          e && e.value
        );
      } else {
        talukaId = await DropdownService.getOneTaluka(e && e.value);
      }
      console.log(talukaIdOffline);
      if (
        (talukaId && talukaId.data && talukaId.data.length > 0) ||
        (talukaIdOffline && talukaIdOffline.length > 0)
      ) {
        let talukaList: any;
        selectTalukaRef.current.select.clearValue();
        if (!isOnline) {
          talukaList = [OptionLabel.talukaNone, ...talukaIdOffline];
        } else {
          talukaList = [OptionLabel.talukaNone, ...talukaId.data];
        }
        OptionLabel.talukaNone.districtId = e.value;
        formik.setFieldValue('talukaId', '');
        settalukaList(talukaList);
      } else {
        selectTalukaRef.current.select.clearValue();
        formik.setFieldValue('talukaId', 0);
      }
      let facilityIdOffline: any;
      let facilityId: any;
      if (!isOnline) {
        facilityIdOffline = await DexieOfflineDataBase.getFacilityOffline(
          e && e.value
        );
      } else {
        facilityId = await DropdownService.getOneFacility(e && e.value);
      }
      console.log(facilityIdOffline);
      if (
        (facilityId && facilityId.data && facilityId.data.length > 0) ||
        (facilityIdOffline && facilityIdOffline.length > 0)
      ) {
        let facilityList: any;
        selectFacilityRef.current.select.clearValue();
        if (!isOnline) {
          facilityList = [OptionLabel.facilityNoneLabel, ...facilityIdOffline];
        } else {
          facilityList = [OptionLabel.facilityNoneLabel, ...facilityId.data];
        }
        OptionLabel.facilityNoneLabel.districtId = e.value;
        headQtrOthers.districtId = e.value;
        headQtrSelect.districtId = e.value;
        formik.setFieldValue('mappingOfOTPhcAttachedToTheaters', []);
        setfacilityList(facilityList);

        let headqtrlist: any = [headQtrOthers, ...facilityList];
        formik &&
          formik.values &&
          formik.values.mappingOfOTSurgeons.map((othersObj: any) => {
            othersObj.headquarter = 'Select Head Qtr';
          });
        setheadOtrList(headqtrlist);
      } else {
        selectFacilityRef.current.select.clearValue();
        let facilityList: any = [OptionLabel.facilityNoneLabel];
        formik.setFieldValue('mappingOfOTPhcAttachedToTheaters', 0);
        setfacilityList(facilityList);
      }
    } else {
      console.log('Same District Value');
    }
  }
  async function getDistrictValues(e: any) {
    let corporationIdOffline: any;
    let corporationId: any;
    if (!isOnline) {
      corporationIdOffline = await DexieOfflineDataBase.getCorporationOffline(
        e
      );
    } else {
      corporationId = await DropdownService.getOneCorporation(e);
    }
    if (
      (corporationId && corporationId.data && corporationId.data.length > 0) ||
      (corporationIdOffline && corporationIdOffline.length > 0)
    ) {
      let corporationData: any;
      if (!isOnline) {
        corporationData = [
          OptionLabel.corporationNone,
          ...corporationIdOffline,
        ];
      } else {
        corporationData = [OptionLabel.corporationNone, ...corporationId.data];
      }
      setcorporationList(corporationData);
    }

    let talukaIdOffline: any;
    let talukaId: any;
    if (!isOnline) {
      talukaIdOffline = await DexieOfflineDataBase.getTalukaOffline(e);
    } else {
      talukaId = await DropdownService.getOneTaluka(e);
    }
    if (
      (talukaId && talukaId.data && talukaId.data.length > 0) ||
      (talukaIdOffline && talukaIdOffline.length > 0)
    ) {
      let talukaList: any;
      if (!isOnline) {
        talukaList = [OptionLabel.talukaNone, ...talukaIdOffline];
      } else {
        talukaList = [OptionLabel.talukaNone, ...talukaId.data];
      }
      settalukaList(talukaList);
    } else {
      let Data: any = [OptionLabel.talukaNone];
      settalukaList(Data);
    }
    let facilityIdOffline: any;
    let facilityId: any;
    if (!isOnline) {
      facilityIdOffline = await DexieOfflineDataBase.getFacilityOffline(e);
    } else {
      facilityId = await DropdownService.getOneFacility(e);
    }
    if (
      (facilityId && facilityId.data && facilityId.data.length > 0) ||
      (facilityIdOffline && facilityIdOffline.length > 0)
    ) {
      let facilityList: any;
      if (!isOnline) {
        facilityList = [OptionLabel.facilityNoneLabel, ...facilityIdOffline];
      } else {
        facilityList = [OptionLabel.facilityNoneLabel, ...facilityId.data];
      }
      OptionLabel.facilityNoneLabel.districtId = e.value;
      headQtrOthers.districtId = e.value;
      headQtrSelect.districtId = e.value;
      setfacilityList(facilityList);

      let headqtrlist: any;
      headqtrlist = [headQtrOthers, ...facilityList];
      setheadOtrList(headqtrlist);
    }
  }

  async function getDistrictdetails() {
    if (isOnline) {
      const response = await DropdownService.getDistrictInfo();
      console.log('online', response);
      if (response) {
        setdistrictList(response.data);
      }
    } else {
      let response = await DexieOfflineDataBase.getDistricts();
      console.log('offline', response);
      if (response) {
        setdistrictList(response);
      }
    }
  }

  const monthList = months.map((months: any, i: any) => {
    return { label: monthsText[i], value: months };
  });
  const yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  const districtIdList =
    districtList &&
    districtList.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  const corporationIdList =
    corporationList &&
    corporationList.map((item: any, i: any) => {
      return { label: item.corporationName, value: item.id };
    });
  const talukaIdList =
    talukaList &&
    talukaList.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });
  const facilityIdList =
    facilityList &&
    facilityList.map((item: any, id: any) => {
      return { label: item.facilityName, value: item.id };
    });
  const HeadQtrIdList = headQtrList.map((item: any, id: any) => {
    return { label: item.facilityName, value: item.facilityName };
  });

  const FilteredHeadQtrIdList = HeadQtrIdList.filter(
    (item) => !item.value.includes('PHC')
  );

  const [mappingInitialState, setMappingInitialState] = useState<MappingOfOT>({
    year: '',
    month: '',
    districtId: '',
    corporationId: '',
    talukaId: '',
    nameOfInstitutionOT: '',
    govtOrPrivate: '',
    privateHospitalName: '',
    noOfAvailableSurgeons: '',
    noOfAvailableAnaesthetist: '',
    mappingOfOTPhcAttachedToTheaters: [],
    isActive: true,
    mappingOfOTSurgeons: [
      {
        surgeonOrAnesthetist: '',
        nameOfDoctor: '',
        headquarter: '',
        headquarterOther: '',
      },
    ],
  });

  async function getEditData() {
    if (location.state && location.state.id) {
      const id: any = location.state.id;
      const response = await MappingOfOTService.getOneMappingOfOT(id);

      if (response) {
        let arr: any = response.data;
        getDistrictValues(response.data[0].districtId);
        // if (arr[0].govtOrPrivate == null) {
        //     arr[0].govtOrPrivate = ""
        // } else {
        //     arr[0].govtOrPrivate = arr[0].govtOrPrivate ? "true" : "false";
        // }
        if (response.data[0].govtOrPrivate == 'Private') {
          setPrivateShow(true);
        } else {
          setPrivateShow(false);
        }
        console.log('EditId', arr[0]);
        let res = arr[0].mappingOfOTPhcAttachedToTheaters.map((item) => {
          return {
            label: item.facility.facilityName,
            value: item.facility.id,
          };
        });
        arr[0].mappingOfOTPhcAttachedToTheaters = res;
        setwherePHCoption(res);

        // setwherePHCoption(res);
        setMappingInitialState(arr[0]);
      }
    } else if (location.state && location.state.UUID) {
      const id: any = location.state.UUID;
      const response =
        await mappingOfOperationTheatersDraftServices.getOneMappingOfOperationTheaters(
          id
        );
      if (response) {
        getDistrictValues(response.districtId);
        setMappingInitialState(response);
        if (response.govtOrPrivate == 'Private') {
          setPrivateShow(true);
        } else {
          setPrivateShow(false);
        }
      }
    }
  }

  const validationSchema = Yup.object().shape({
    year: Yup.string().required('Required').nullable(),
    month: Yup.number().min(1, 'Required').required('Required').nullable(),
    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Required').nullable(),
    }),
    //month: Yup.string().required('Required'),
    corporationId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Required').nullable(),
    }),
    talukaId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Required').nullable(),
    }),
    nameOfInstitutionOT: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Required').nullable(),
    }),
    // mappingOfOTPhcAttachedToTheaters: Yup.array()
    //   .min(1, 'required')
    //   .of(
    //     Yup.object().shape({
    //       label: Yup.string().required(),
    //       value: Yup.string().required(),
    //     })
    //   ),
    mappingOfOTPhcAttachedToTheaters: Yup.array()
      .min(1, 'Required')
      .required('Required')
      .nullable(),

    mappingOfOTSurgeons: Yup.array().of(
      Yup.object().shape({
        surgeonOrAnesthetist: Yup.string().required('Required').nullable(),
      })
    ),
  });

  const formik = useFormik({
    initialValues: mappingInitialState,
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: async (values: any) => {
      values.noOfAvailableSurgeons = values.noOfAvailableSurgeons
        ? values.noOfAvailableSurgeons
        : 0;
      values.noOfAvailableAnaesthetist = values.noOfAvailableAnaesthetist
        ? values.noOfAvailableAnaesthetist
        : 0;
      if (location && location.state && location.state.view) {
        history.push(listDESheetName);
      } else if (values && values.status === 'Active') {
        if (location.state && location.state.id) {
          values.lastModifiedBy = props && props.userSessionId;
          values.mappingOfOTSurgeons.map((othersObj: any) => {
            othersObj.headquarter =
              othersObj.headquarter === 'None' ? '' : othersObj.headquarter;
            othersObj.headquarter =
              othersObj.headquarter === 'Select Head Qtr'
                ? ''
                : othersObj.headquarter;
            if (othersObj && othersObj.id) {
              othersObj.lastModifiedBy = props && props.userSessionId;
            } else {
              othersObj.createdBy = props && props.userSessionId;
              othersObj.lastModifiedBy = 0;
            }
            if (!(othersObj.headquarter === 'Others')) {
              othersObj.headquarterOther = '';
            }
          });
          setIsDisabled(true);
          const response = await MappingOfOTService.updateMappingOfOT(
            location.state.id,
            values
          );

          if (response && response.data) {
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
            setIsDisabled(false);
            history.push(listDESheetName);
          }
        } else {
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          values.mappingOfOTPhcAttachedToTheaters =
            values.mappingOfOTPhcAttachedToTheaters == 'None'
              ? ''
              : values.mappingOfOTPhcAttachedToTheaters;
          values.mappingOfOTSurgeons.map((othersObj: any) => {
            othersObj.headquarter =
              othersObj.headquarter === 'None' ? '' : othersObj.headquarter;
            othersObj.headquarter =
              othersObj.headquarter === 'Select Head Qtr'
                ? ''
                : othersObj.headquarter;
            if (othersObj && othersObj.id) {
              othersObj.lastModifiedBy = props && props.userSessionId;
            } else {
              othersObj.createdBy = props && props.userSessionId;
              othersObj.lastModifiedBy = 0;
            }
          });
          let response = await MappingOfOTService.createMappingOfOT(values);
          if (response && response.data) {
            if (values && values.mappingOfOperationTheatersUUID) {
              let deleteResponse =
                await mappingOfOperationTheatersDraftServices.deleteMappingOfOperationTheaters(
                  values.mappingOfOperationTheatersUUID
                );
            }
            history.push(listDESheetName);
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        }
      } else if (values && values.status === 'Draft') {
        if (location && location.state && location.state.UUID) {
          values.lastModifiedBy = props && props.userSessionId;
          let response =
            await mappingOfOperationTheatersDraftServices.updateMappingOfOperationTheaters(
              location.state.UUID,
              values
            );
          if (response) {
            history.push(listDESheetName);
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        } else {
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          let response =
            await mappingOfOperationTheatersDraftServices.addMappingOfOperationTheaters(
              values
            );
          if (response) {
            history.push(listDESheetName);
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
          }
        }
      }
    },
  });
  async function deleteFieldArray(row) {
    console.log('deleteFieldArray:: ', row.id);
    if (row.id) {
      const response = await MappingOfOTService.deleteSurgeonMappingOfOT(
        row.id
      );
      console.log('Reponse', response);
    }
  }

  const showToast = (e) => {
    if (e.target.id == 'Submitbtnid') {
      formik.validateForm().then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error('Please Enter Required Fields', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
    }
  };

  function addField(arrayHelpers) {
    const index = arrayHelpers.form.values.mappingOfOTSurgeons.length;
    if (index == 1) {
      arrayHelpers.push({
        surgeonOrAnesthetist: '',
        nameOfDoctor: '',
        headquarter: '',
        headquarterOther: '',
      });
    }
  }

  return (
    <div className='in-left'>
      <FormikProvider value={formik}>
        <Breadcrumb>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/WebDashboard');
            }}
            className='font-chng'
          >
            Data Entry
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => {
              history.push('/mapping-operationtheatres');
            }}
            className='font-chng'
          >
            Mapping of Operation Theaters
          </Breadcrumb.Item>
          {location.state && location.state.view ? (
            <Breadcrumb.Item active>View</Breadcrumb.Item>
          ) : (location.state && location.state.id) ||
            (location.state && location.state.UUID) ? (
            <Breadcrumb.Item active>Edit</Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item active>Add</Breadcrumb.Item>
          )}
        </Breadcrumb>
        <form
          onClick={showToast}
          onSubmit={formik.handleSubmit}
          onChange={formik.handleChange}
        >
          <div className='card'>
            <h6 className='formtitlenew font-chng'>
              {' '}
              Mapping of Operation Theaters
            </h6>
            <div className='card-body'>
              <fieldset
                disabled={location.state && location.state.view ? true : false}
              >
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='year' className='form-label font-chng'>
                        Year*
                      </label>

                      <Select
                        name='year'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        isClearable='true'
                        className={
                          formik.errors.year && formik.touched.year
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        value={
                          yearList
                            ? yearList.find(
                                (option: any) =>
                                  option && option.value === formik.values.year
                              )
                            : ''
                        }
                        options={yearList}
                        onChange={(option: Option) => {
                          formik.setFieldValue('year', option && option.value);
                        }}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.year ? formik.errors.year : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='month' className='form-label font-chng'>
                        Month*
                      </label>
                      <Select
                        name='month'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        className={
                          formik.errors.month && formik.touched.month
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        options={monthList}
                        isClearable='true'
                        onChange={(option: Option) => {
                          formik.setFieldValue('month', option && option.value);
                        }}
                        value={
                          monthList
                            ? monthList.find(
                                (option: any) =>
                                  option && option.value == formik.values.month
                              )
                            : ''
                        }
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.month ? formik.errors.month : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='districtId'
                        className='form-label font-chng'
                      >
                        District*
                      </label>
                      {districtList && districtList.length !== 0 ? (
                        <Select
                          name='districtId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          options={districtIdList}
                          isClearable={true}
                          value={
                            districtIdList
                              ? districtIdList.find(
                                  (option) =>
                                    option.value === formik.values.districtId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'districtId',
                              option && option.value
                            );
                            getDistrict(option);
                          }}
                          className={
                            formik.errors.districtId &&
                            formik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                        ></Select>
                      ) : (
                        <Select
                          name='districtId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          options={NoneList}
                          isClearable={true}
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option) =>
                                    option.value === formik.values.districtId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'districtId',
                              option && option.value
                            );
                            getDistrict(option);
                          }}
                          className={
                            formik.errors.districtId &&
                            formik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.districtId
                          ? formik.errors.districtId
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='corporationId'
                        className='form-label font-chng'
                      >
                        Corporation*
                      </label>
                      {corporationList && corporationList.length !== 0 ? (
                        <Select
                          ref={selectCorporationRef}
                          name='corporationId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          isClearable={true}
                          value={
                            corporationIdList
                              ? corporationIdList.find(
                                  (option) =>
                                    option.value === formik.values.corporationId
                                )
                              : ''
                          }
                          options={corporationIdList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'corporationId',
                              option && option.value
                            );
                          }}
                          className={
                            formik.errors.corporationId &&
                            formik.touched.corporationId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                        ></Select>
                      ) : (
                        <Select
                          ref={selectCorporationRef}
                          name='corporationId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          value={
                            NoneList
                              ? NoneList.find((option) => option.value === 0)
                              : ''
                          }
                          options={NoneList}
                          isClearable={true}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'corporationId',
                              option && option.value
                            );
                          }}
                          className={
                            formik.errors.corporationId &&
                            formik.touched.corporationId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.corporationId
                          ? formik.errors.corporationId
                          : ''}
                      </div>
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='talukaId'
                        className='form-label font-chng'
                      >
                        Taluka*
                      </label>
                      {talukaList && talukaList.length !== 0 ? (
                        <Select
                          name='talukaId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectTalukaRef}
                          isClearable={true}
                          value={
                            talukaIdList
                              ? talukaIdList.find(
                                  (option) =>
                                    option.value === formik.values.talukaId
                                )
                              : ''
                          }
                          options={talukaIdList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'talukaId',
                              option && option.value
                            );
                          }}
                          className={
                            formik.errors.talukaId && formik.touched.talukaId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                        ></Select>
                      ) : (
                        <Select
                          name='talukaId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectTalukaRef}
                          isClearable={true}
                          value={
                            NoneList
                              ? NoneList.find((option) => option.value === 0)
                              : ''
                          }
                          options={NoneList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'talukaId',
                              option && option.value
                            );
                          }}
                          className={
                            formik.errors.talukaId && formik.touched.talukaId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.talukaId ? formik.errors.talukaId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='nameOfInstitutionOT'
                        className='form-label font-chng'
                      >
                        Name Of the Institution/OT*
                      </label>
                      <input
                        type='text'
                        name='nameOfInstitutionOT'
                        value={formik.values.nameOfInstitutionOT}
                        onKeyPress={(e) => commonFunction.keyPress(e)}
                        onInput={(event) => commonFunction.onlyAlphabets(event)}
                        onChange={formik.handleChange}
                        className={
                          formik.errors.nameOfInstitutionOT &&
                          formik.touched.nameOfInstitutionOT
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                      />
                    </div>
                    <div className={'invalid-feedback'}>
                      {formik.errors.nameOfInstitutionOT
                        ? formik.errors.nameOfInstitutionOT
                        : ''}
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='govtOrPrivate'
                        className='form-label font-chng'
                      >
                        is Govt Or Private
                      </label>
                      <div
                        role='group'
                        aria-labelledby='my-radio-group'
                        className='form-radio'
                      >
                        <label className='form-label font-chng'>
                          <Field
                            type='radio'
                            name='govtOrPrivate'
                            onChange={(e) => handlePrivateHospital(e)}
                            defaultChecked={
                              formik.values.govtOrPrivate === 'Govt'
                            }
                            value='Govt'
                          />
                          Govt
                        </label>
                        <label className='form-label font-chng'>
                          <Field
                            type='radio'
                            name='govtOrPrivate'
                            onChange={(e) => handlePrivateHospital(e)}
                            defaultChecked={
                              formik.values.govtOrPrivate === 'Private'
                            }
                            value='Private'
                          />
                          Private
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    {privateShow ? (
                      <>
                        <div className='form-grp'>
                          <label
                            htmlFor='privateHospitalName'
                            className='form-label font-chng'
                          >
                            Private Hospital Name
                          </label>
                          <input
                            type='text'
                            name='privateHospitalName'
                            value={formik.values.privateHospitalName}
                            onKeyPress={(e) => commonFunction.keyPress(e)}
                            onInput={(event) =>
                              commonFunction.onlyAlphabets(event)
                            }
                            onChange={formik.handleChange}
                            className={
                              formik.errors.privateHospitalName &&
                              formik.touched.privateHospitalName
                                ? 'form-control is-invalid'
                                : 'form-control'
                            }
                          />
                        </div>
                        <div className={'invalid-feedback'}>
                          {formik.errors.privateHospitalName
                            ? formik.errors.privateHospitalName
                            : ''}
                        </div>
                      </>
                    ) : null}
                  </div>
                  <Row
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'end',
                    }}
                  >
                    <div className='col-md-6 col-xl-3 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='noOfAvailableSurgeons'
                          className='form-label font-chng'
                        >
                          No of empaneled Surgeons
                        </label>
                        <input
                          type='number'
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          name='noOfAvailableSurgeons'
                          value={formik.values.noOfAvailableSurgeons}
                          onChange={formik.handleChange}
                          className='form-control'
                        />
                      </div>
                    </div>
                    <div className='col-md-12 col-lg-6 col-xl-3 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='noOfAvailableAnaesthetist'
                          className='form-label font-chng'
                        >
                          No of Available Anaesthetist
                        </label>
                        <input
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfAvailableAnaesthetist'
                          value={formik.values.noOfAvailableAnaesthetist}
                          onChange={formik.handleChange}
                          className='form-control'
                        />
                      </div>
                    </div>
                    <div className='col-md-12 col-lg-3 col-xl-3 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='mappingOfOTPhcAttachedToTheaters'
                          className='form-label font-chng'
                        >
                          Name of PHC's attached to Operation Theater*
                        </label>
                        {facilityList && facilityList.length !== 0 ? (
                          <MultiSelect
                            // name='mappingOfOTPhcAttachedToTheaters'
                            disabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            options={facilityIdList}
                            value={wherePHCoption}
                            onChange={PHCchange}
                            className={
                              formik.errors.mappingOfOTPhcAttachedToTheaters &&
                              formik.touched.mappingOfOTPhcAttachedToTheaters
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            labelledBy={Select}
                          />
                        ) : (
                          <Select
                            name='mappingOfOTPhcAttachedToTheaters'
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            ref={selectFacilityRef}
                            value={
                              NoneList
                                ? NoneList.find((option) => option.value === 0)
                                : ''
                            }
                            options={NoneList}
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'mappingOfOTPhcAttachedToTheaters',
                                option && option.value
                              );
                            }}
                            className={
                              formik.errors.mappingOfOTPhcAttachedToTheaters &&
                              formik.touched.mappingOfOTPhcAttachedToTheaters
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        )}
                        <div className={'invalid-feedback'}>
                          {formik.errors.mappingOfOTPhcAttachedToTheaters
                            ? formik.errors.mappingOfOTPhcAttachedToTheaters
                            : ''}
                        </div>
                      </div>
                    </div>
                  </Row>
                </Row>{' '}
              </fieldset>
            </div>
          </div>
          <div className='card'>
            <div className='card-body'>
              <FieldArray
                name='mappingOfOTSurgeons'
                render={(arrayHelpers: any) => (
                  <fieldset
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  >
                    <div className='mb-3'>
                      {formik.values.mappingOfOTSurgeons.map(
                        (mappingOfOTSurgeons, index) => (
                          <div key={index}>
                            <Row
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'end',
                              }}
                            >
                              <div className='col-md-6 col-xl-3 col-12'>
                                <div className='form-grp'>
                                  <div
                                    role='group'
                                    aria-labelledby='my-radio-group'
                                    className='form-radio map-l'
                                  >
                                    <label className='form-label font-chng'>
                                      <Field
                                        type='radio'
                                        className={
                                          formik.errors.mappingOfOTSurgeons &&
                                          formik.errors.mappingOfOTSurgeons[
                                            index
                                          ] &&
                                          formik.errors.mappingOfOTSurgeons[
                                            index
                                          ]['surgeonOrAnesthetist'] &&
                                          formik.touched.mappingOfOTSurgeons &&
                                          formik.touched.mappingOfOTSurgeons[
                                            index
                                          ] &&
                                          formik.touched.mappingOfOTSurgeons[
                                            index
                                          ]['surgeonOrAnesthetist']
                                            ? 'form-check-input is-invalid'
                                            : 'form-check-input'
                                        }
                                        name={`mappingOfOTSurgeons[${index}].surgeonOrAnesthetist`}
                                        onChange={formik.handleChange}
                                        defaultChecked={
                                          formik.values.mappingOfOTSurgeons[
                                            index
                                          ].surgeonOrAnesthetist === 'surgeon'
                                        }
                                        value='surgeon'
                                      />
                                      Surgeon
                                    </label>
                                    <label className='form-label font-chng'>
                                      <Field
                                        type='radio'
                                        className={
                                          formik.errors.mappingOfOTSurgeons &&
                                          formik.errors.mappingOfOTSurgeons[
                                            index
                                          ] &&
                                          formik.errors.mappingOfOTSurgeons[
                                            index
                                          ]['surgeonOrAnesthetist'] &&
                                          formik.touched.mappingOfOTSurgeons &&
                                          formik.touched.mappingOfOTSurgeons[
                                            index
                                          ] &&
                                          formik.touched.mappingOfOTSurgeons[
                                            index
                                          ]['surgeonOrAnesthetist']
                                            ? 'form-check-input is-invalid'
                                            : 'form-check-input'
                                        }
                                        name={`mappingOfOTSurgeons[${index}].surgeonOrAnesthetist`}
                                        onChange={formik.handleChange}
                                        defaultChecked={
                                          formik.values.mappingOfOTSurgeons[
                                            index
                                          ].surgeonOrAnesthetist ===
                                          'anesthetist'
                                        }
                                        value='anesthetist'
                                      />
                                      Anesthetist
                                    </label>
                                  </div>
                                  <div
                                    className={
                                      formik.errors.mappingOfOTSurgeons &&
                                      formik.errors.mappingOfOTSurgeons[
                                        index
                                      ] &&
                                      formik.errors.mappingOfOTSurgeons[index][
                                        'surgeonOrAnesthetist'
                                      ] &&
                                      formik.touched.mappingOfOTSurgeons &&
                                      formik.touched.mappingOfOTSurgeons[
                                        index
                                      ] &&
                                      formik.touched.mappingOfOTSurgeons[index][
                                        'surgeonOrAnesthetist'
                                      ]
                                        ? 'text-danger'
                                        : 'invalid-feedback'
                                    }
                                  >
                                    {formik.errors.mappingOfOTSurgeons &&
                                    formik.errors.mappingOfOTSurgeons[index] &&
                                    formik.errors.mappingOfOTSurgeons[index][
                                      'surgeonOrAnesthetist'
                                    ]
                                      ? formik.errors.mappingOfOTSurgeons[
                                          index
                                        ]['surgeonOrAnesthetist']
                                      : ''}
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-3 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='nameOfDoctor'
                                    className='form-label font-chng'
                                  >
                                    Name of Surgeon and Anesthetist
                                  </label>
                                  <input
                                    type='text'
                                    name={`mappingOfOTSurgeons[${index}].nameOfDoctor`}
                                    onChange={formik.handleChange}
                                    onKeyPress={(e) =>
                                      commonFunction.keyPress(e)
                                    }
                                    onInput={(event) =>
                                      commonFunction.onlyAlphabets(event)
                                    }
                                    value={
                                      formik.values.mappingOfOTSurgeons[index]
                                        .nameOfDoctor
                                    }
                                    className='form-control'
                                  />
                                </div>
                              </div>
                              <div className='col-md-6 col-xl-3 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='headquarter'
                                    className='form-label mt-s font-chng'
                                  >
                                    Head Qtrs.
                                  </label>
                                  <Select
                                    isDisabled={
                                      location.state && location.state.view
                                        ? true
                                        : false
                                    }
                                    styles={commonFunction.customStyles}
                                    name={`mappingOfOTSurgeons[${index}].headquarter`}
                                    isClearable={true}
                                    placeholder={
                                      HeadQtrIdList &&
                                      HeadQtrIdList.length !== 0
                                        ? 'Select Head Otr'
                                        : 'None'
                                    }
                                    options={
                                      HeadQtrIdList &&
                                      HeadQtrIdList.length !== 0
                                        ? FilteredHeadQtrIdList
                                        : NoneList
                                    }
                                    onChange={(option: Option) => {
                                      formik.setFieldValue(
                                        `mappingOfOTSurgeons[${index}].headquarter`,
                                        option && option.value
                                      );
                                    }}
                                    className={'custom-select'}
                                    value={
                                      HeadQtrIdList
                                        ? HeadQtrIdList.find(
                                            (option) =>
                                              option.value ===
                                              formik.values.mappingOfOTSurgeons[
                                                index
                                              ].headquarter
                                          )
                                        : ''
                                    }
                                  ></Select>
                                </div>
                              </div>
                              <div className='col-md-4 col-xl-3 col-12'>
                                {formik.values.mappingOfOTSurgeons &&
                                formik.values.mappingOfOTSurgeons[index] &&
                                formik.values.mappingOfOTSurgeons[index]
                                  .headquarter === 'Others' ? (
                                  <div className='form-grp'>
                                    <label
                                      htmlFor='headquarterOther'
                                      className='form-label mt-s font-chng'
                                    >
                                      Head Qtr. Others
                                    </label>
                                    <input
                                      type='text'
                                      name={`mappingOfOTSurgeons[${index}].headquarterOther`}
                                      onChange={formik.handleChange}
                                      value={
                                        formik.values.mappingOfOTSurgeons[index]
                                          .headquarterOther
                                      }
                                      className='form-control'
                                      onInput={(event) =>
                                        commonFunction.onlyAlphabets(event)
                                      }
                                    />
                                  </div>
                                ) : null}
                              </div>

                              <div className='offset-xl-9 col-md-6 col-xl-3 col-12 mopt-btn'>
                                {location &&
                                location.state &&
                                location.state.view ? (
                                  ''
                                ) : (
                                  <div className='form-grp m-3'>
                                    {formik.values.mappingOfOTSurgeons.length -
                                      1 ===
                                      index && (
                                      <Button
                                        type='button'
                                        className='fnt-btn btn btn-secondary'
                                        style={{ display: 'inline-block' }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          arrayHelpers.push({
                                            surgeonOrAnesthetist: '',
                                            nameOfDoctor: '',
                                            headquarter: '',
                                            headquarterOther: '',
                                          });
                                        }}
                                      >
                                        Add
                                      </Button>
                                    )}
                                    <button
                                      style={{
                                        display: 'inline-block',
                                        float: 'right',
                                      }}
                                      type='button'
                                      className='btn'
                                      // disabled={index ? false : true}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        deleteFieldArray(mappingOfOTSurgeons);
                                        arrayHelpers.remove(index);
                                        addField(arrayHelpers);
                                      }}
                                    >
                                      <img src={Delete} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </Row>
                          </div>
                        )
                      )}
                    </div>
                  </fieldset>
                )}
              />
              {/* <div className="form-grp text-right">
                <button
                  type="submit"
                  className="btn btn-outline-light font-chng"
                  onClick={() => history.push(listDESheetName)}
                >Cancel
                </button>
                {((location.state && !location.state.view) || (!location.state)) && (!(location.state && location.state.id)) &&
                  <button id="Submitbtnid" type="submit" className="mt-m btn btn-secondary"
                    disabled={location && location.state && location.state.id ? true : false}
                    onClick={() => {
                      formik.setFieldValue("status", "Draft");
                    }}
                  >Save As Draft</button>}
                &nbsp; &nbsp;

                {((location.state && !location.state.view) || (!location.state)) && isOnline &&
                  <button id="Submitbtnid" type="submit" className="mt-m btn btn-secondary"
                    disabled={!isOnline}
                    onClick={() => {
                      formik.setFieldValue("status", "Active");
                    }}
                  >Save</button>}

              </div> */}
            </div>
          </div>
          <div className='buttongrouprightend mb-4'>
            <Button
              type='submit'
              // className=' btn-cancel'
              onClick={() => history.push(listDESheetName)}
              style={{
                marginRight: '10px',
                backgroundColor: '#34c38f',
                border: '0px',
                color: ' #ffffff',
                textTransform: 'none',
              }}
            >
              <i className='fas fa-arrow-left'></i>&nbsp; Back{' '}
            </Button>
            {((location.state && !location.state.view) || !location.state) &&
              !(location.state && location.state.id) && (
                <button
                  id='Submitbtnid'
                  type='submit'
                  className='btn font-chng'
                  disabled={
                    location && location.state && location.state.id
                      ? true
                      : false
                  }
                  onClick={() => {
                    formik.setFieldValue('status', 'Draft');
                  }}
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                >
                  Save as Draft
                </button>
              )}
            {((location.state && !location.state.view) || !location.state) &&
              isOnline && (
                <button
                  type='submit'
                  id='Submitbtnid'
                  className='btn font-chng'
                  style={{
                    // marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                  disabled={!isOnline ? (isDisabled ? true : false) : false}
                  onClick={() => {
                    formik.setFieldValue('status', 'Active');
                  }}
                >
                  Save
                </button>
              )}
          </div>
        </form>
      </FormikProvider>
    </div>
  );
};

export default AddMappingOfOperationTheaters;
