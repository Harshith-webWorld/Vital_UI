import React, { useState, useEffect, useRef } from 'react';
import { Row, Button, Container } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { WebsiteMDAIECActivity } from '../../../interfaces/website-MDA-IECActivity';
import DropdownService from '../../../services/DropdownService';
import MDAActivityServices from '../../../services/FormMdaIecActivityService';
import { useLocation } from 'react-router';
import history from '../../../../helpers/history';
import moment from 'moment';
import { useSelector } from 'react-redux';
import Select, { Option } from 'react-select';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonFunction from '../../../../helpers/common/common';
import mdaIecActivityDraftServices from '../../../draftServices/FormMdaIecActivityDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import { SettingsInputSvideo } from '@material-ui/icons';

//import { useAlert } from "react-alert";

const AddMDAIECActivity: React.FC<any> = (props) => {
  const listDESheetName: any = props && props.listDESheetName;
  const userInfo = useSelector((state: any) => state);
  const currentdate = moment(new Date()).format('yyyy-MM-DD');
  const [showResult, setShowResult] = useState(false);
  let isValidDate = moment().format('YYYY-MM-DD');
  const [otherShow, setOtherShow] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  let selectDistrictRef: any = useRef();
  const months = [
    { month: 1, monthName: 'JAN' },
    { month: 2, monthName: 'FEB' },
    { month: 3, monthName: 'MAR' },
    { month: 4, monthName: 'APR' },
    { month: 5, monthName: 'MAY' },
    { month: 6, monthName: 'JUN' },
    { month: 7, monthName: 'JUL' },
    { month: 8, monthName: 'AUG' },
    { month: 9, monthName: 'SEP' },
    { month: 10, monthName: 'OCT' },
    { month: 11, monthName: 'NOV' },
    { month: 12, monthName: 'DEC' },
  ];
  const currentYear = new Date().getFullYear();
  const range = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  const years = range(currentYear, currentYear - 50, -1);
  const [symbolsArr] = useState(['e', 'E', '+', '-', 'Enter']);
  let isOnline = window.navigator.onLine;

  //  const alert = useAlert();
  const location = useLocation<any>();
  const [formdata, setformdata] = useState<WebsiteMDAIECActivity>({
    stateId: 14,
    year: '',
    month: '',
    districtId: '',
    materialActivity: '',
    otherMaterial: '',
    materialActivityNo: '',
    materialActivityCostInRs: '',
    statementOfFundsAllotted: 0,
    dateDistrictCoordComitte: currentdate,
    fundAllocatedWithDate: '',
    fundUtilisedWithDate: '',
    fundBalanceAfterRound: 0,
    isActive: true,
  });
  useEffect(() => {
    getCatagoryOptionData();
    // getStatementOfFundsAllotted();
    getStateValues('14'); //get districts
    getStatedetails(); //get state
    getEditData();
  }, []);

  const prevStateRef: any = React.useRef();
  useEffect(() => {
    prevStateRef.current = stateId;
  });
  const prevStateIdValue = prevStateRef.current;

  const [maxValidation, setmaxValidation] = useState(false);
  const [stateId, setstateId] = useState([]);
  const [stateList, setstateList] = useState([]);
  const [districtList, setdistrictList] = useState([]);
  const [materialActivityOption, setmaterialActivityOption] = useState([]);
  const [statementOfFundsAllottedOption, setstatementOfFundsAllottedOption] =
    useState([]);
  //const [stateId,setstateId]=useState();
  const [districtId, setdistrictId] = useState();
  let NoneList = [{ label: 'None', value: 0 }];
  let defaultStateValue = [{ label: 'Maharashtra', value: 14 }];

  //const prevStateRef:any = React.useRef();
  const prevDistrictRef: any = React.useRef();
  useEffect(() => {
    prevStateRef.current = stateId;
    prevDistrictRef.current = districtId;
  });
  //const prevStateIdValue = prevStateRef.current;
  const prevDistrictIdValue = prevDistrictRef.current;

  async function getUnitActionData() {
    if (isOnline) {
      const unitActionData: any = await DropdownService.getUnitAction();
      if (unitActionData && unitActionData.data) {
        return unitActionData.data;
      }
    } else {
      const genderDataOffline: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (genderDataOffline) {
        return genderDataOffline;
      }
    }
  }

  async function getCatagoryOptionData() {
    if (isOnline) {
      const response: any = await DropdownService.getUnitAction();
      if (response && response.data) {
        setmaterialActivityOption(response.data);
        setstatementOfFundsAllottedOption(response.data);
      }
    } else {
      const response: any = await DexieOfflineDataBase.getCatagoryOption();
      if (response) {
        setmaterialActivityOption(response);
        setstatementOfFundsAllottedOption(response);
      }
    }
  }

  // async function getStatementOfFundsAllotted() {
  //     let response: any = await DropdownService.getUnitAction();
  //     if (response && response.data) {
  //         setstatementOfFundsAllottedOption(response.data);
  //     }
  // }

  const stateIdValues =
    stateList &&
    stateList.map((item: any, i: any) => {
      return { label: item.stateName, value: item.id };
    });

  const districtIdValues =
    districtList &&
    districtList.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  const YearNone = {
    label: 'Unknown Year',
    value: '',
  };

  let yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  yearList = [...yearList];
  const monthList = months.map((item: any, i: any) => {
    return { label: item.monthName, value: item.month };
  });

  async function getState(e: any) {
    console.log(e);
    if (!(e === null)) {
      setstateId(e && e.value);
      if (!((e && e.value) === prevStateIdValue)) {
        if (e === null) {
          formik.setFieldValue('districtId', 0);
        }
        let districtId: any;
        let offlineDistrictId: any;
        if (isOnline) {
          districtId = await DropdownService.getOneDistrict(e && e.value);
        } else {
          offlineDistrictId = await DexieOfflineDataBase.getOneDistrict(
            e && e.value
          );
        }

        if (
          (districtId && districtId.data && districtId.data.length > 0) ||
          (offlineDistrictId && offlineDistrictId.length > 0)
        ) {
          selectDistrictRef.current.select.clearValue();
          formik.setFieldValue('districtId', '');
          if (isOnline) {
            setdistrictList(districtId.data);
          } else {
            setdistrictList(offlineDistrictId);
          }
        } else {
          selectDistrictRef.current.select.clearValue();
          console.log('dddd................', districtId);
          let districtData: any = [OptionLabel.districtNone];
          setdistrictList(districtData);
          formik.setFieldValue('districtId', 0);
        }
      } else {
        console.log('Same District Value');
      }
    } else {
      let districtData: any = [OptionLabel.districtNone];
      setdistrictList(districtData);
      formik.setFieldValue('districtId', 0);
    }
  }

  async function getStateValues(e: any) {
    if (isOnline) {
      const districtId: any = await DropdownService.getOneDistrict(e);
      if (districtId && districtId.data && districtId.data.length > 0) {
        setdistrictList(districtId.data);
      } else {
        let districtData: any = [OptionLabel.districtNone];
        setdistrictList(districtData);
        formik.setFieldValue('districtId', 0);
      }
    } else {
      const districtId: any = await DexieOfflineDataBase.getOneDistrict(e);
      console.log(districtId);
      if (districtId && districtId.length > 0) {
        setdistrictList(districtId);
      } else {
        let districtData: any = [OptionLabel.districtNone];
        setdistrictList(districtData);
        formik.setFieldValue('districtId', 0);
      }
    }
  }

  async function getStatedetails() {
    if (isOnline) {
      const response = await DropdownService.getStateInfo();
      if (response) {
        setstateList(response.data);
      }
    } else {
      const response = await DexieOfflineDataBase.getStates();
      if (response) {
        setstateList(response);
      }
    }
  }

  async function getEditData() {
    const unitActionData: any = await getUnitActionData();
    if (location.state && location.state.id) {
      const id: any = location.state.id;
      const response = await MDAActivityServices.getOneMDAActivity(id);
      if (response && response.data) {
        getStateValues(response.data[0].stateId);
        console.log('unitActionData', unitActionData);
        unitActionData.forEach((el: any) => {
          if (el.id === response.data[0].materialActivity) {
            if (el.categoryOptionName === 'Any other (specify)') {
              console.log('worked', el.categoryOptionName);
              setOtherShow(true);
            } else {
              setOtherShow(false);
            }
          }
        });
        console.log(
          'Material',
          response.data[0].materialActivity.categoryOptionName
        );
        console.log('EditId', response.data[0]);
        let Data: any = response.data[0];
        setformdata(Data);
      }
    } else if (location.state && location.state.UUID) {
      const id: any = location.state.UUID;
      console.log(id);
      const response = await mdaIecActivityDraftServices.getOneMdaIecActivity(
        id
      );
      if (response) {
        getStateValues(response.stateId);
        console.log('unitActionData', unitActionData);
        unitActionData.forEach((el: any) => {
          if (el.id === response.materialActivity) {
            if (el.categoryOptionName === 'Any other (specify)') {
              console.log('worked', el.categoryOptionName);
              setOtherShow(true);
            } else {
              setOtherShow(false);
            }
          }
        });
        console.log('EditId', response);
        setformdata(response);
      }
    }
  }
  const handleOthers = (e) => {
    if (e.label == 'Any other (specify)') {
      setOtherShow(true);
    } else {
      setOtherShow(false);
    }
  };

  let handleOptions = (data, e) => {
    console.log('Fund Value', e);
    if (
      (e && e.label === 'IEC') ||
      (e && e.label === 'Training') ||
      (e && e.label === 'District Co-ordination Committee First Meeting') ||
      (e && e.label === 'District Co-ordination Committee Second Meeting') ||
      (e && e.label === 'Drug administrator honorium') ||
      (e && e.label === 'Surervision honorium') ||
      (e && e.label === 'Surveillance Booklet') ||
      (e && e.label === 'Petrol Oil Lubricants (POL)') ||
      (e && e.label === ' Hydrocele Operation') ||
      (e && e.label === 'Advertisement in News Paper') ||
      (e && e.label === 'Verification by Medical College Team') ||
      (e && e.label === 'Other Activity - Base line data')
    ) {
      setShowResult(true);
    } else {
      formik.setFieldValue('statementOfFundsAllotted', 0);
      setShowResult(false);
    }
  };

  const MaterialActivityList: any = [];
  materialActivityOption &&
    materialActivityOption.map((item: any, i: any) => {
      if (item && item.categoryCode === 1008) {
        MaterialActivityList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });

  const statementOfFundsAllottedList: any = [];
  statementOfFundsAllottedOption &&
    statementOfFundsAllottedOption.map((item: any, i: any) => {
      if (item && item.categoryCode === 1009) {
        statementOfFundsAllottedList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
        //console.log("StateMent",item.categoryOptionName)
      }
    });

  const validationSchemaForm = Yup.object().shape({
    year: Yup.string().required('Required').nullable(),
    month: Yup.number().min(1, 'Required').required('required').nullable(),
    stateId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Required').nullable(),
    }),
    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Required').nullable(),
    }),
    materialActivity: Yup.string().required('Required').nullable(),
    fundBalanceAfterRound: Yup.number()
      .min(0, 'Fund utilized is more')
      .nullable(),
  });

  const formik = useFormik({
    initialValues: formdata,
    enableReinitialize: true,
    validationSchema: validationSchemaForm,

    onSubmit: async (values: any) => {
      console.log('DE3 Values', values);
      if (location && location.state && location.state.view) {
        history.push(listDESheetName);
      } else {
        values.materialActivityNo = values.materialActivityNo
          ? values.materialActivityNo
          : 0;
        values.materialActivityCostInRs = values.materialActivityCostInRs
          ? values.materialActivityCostInRs
          : 0;
        values.fundAllocatedWithDate = values.fundAllocatedWithDate
          ? values.fundAllocatedWithDate
          : 0;
        values.fundUtilisedWithDate = values.fundUtilisedWithDate
          ? values.fundUtilisedWithDate
          : 0;

        if (values && values.status === 'Active') {
          if (location.state && location.state.id) {
            setIsDisabled(true);
            const id: any = location.state.id;
            values.stateId = values.stateId == 0 ? '0' : values.stateId;
            values.districtId =
              values.districtId == 0 ? '0' : values.districtId;
            values.fundAllocatedWithDate =
              values.fundAllocatedWithDate == ''
                ? '0.00'
                : values.fundAllocatedWithDate;
            values.fundUtilisedWithDate =
              values.fundUtilisedWithDate == ''
                ? '0.00'
                : values.fundUtilisedWithDate;
            values.fundBalanceAfterRound =
              values.fundBalanceAfterRound == ''
                ? '0.00'
                : values.fundBalanceAfterRound;
            values.lastModifiedBy = props && props.userSessionId;
            const response = await MDAActivityServices.editMDAActivity(
              id,
              values
            );
            setIsDisabled(false);
            console.log(response);
            if (response && response.data) {
              toast.success('Form Submitted Successfully', {
                position: toast.POSITION.TOP_CENTER,
              });
              history.push(listDESheetName);
            }
          } else {
            values.stateId = values.stateId == 'None' ? '' : values.stateId;
            values.districtId =
              values.districtId == 'None' ? '' : values.districtId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;
            if (values && values.mdaIecActivityUUID) {
              setIsDisabled(true);
              let UUID = values.mdaIecActivityUUID;
              let response = await MDAActivityServices.createMDAActivity(
                values
              );
              setIsDisabled(false);
              console.log(response);
              if (response && response.data) {
                let deleteResponse =
                  await mdaIecActivityDraftServices.deleteMdaIecActivity(UUID);
                console.log(deleteResponse);
                toast.success('Form Submitted Successfully', {
                  position: toast.POSITION.TOP_CENTER,
                });
                history.push(listDESheetName);
              }
            } else {
              setIsDisabled(true);
              let response = await MDAActivityServices.createMDAActivity(
                values
              );
              setIsDisabled(false);
              console.log(response);
              if (response && response.data) {
                //alert.success(response.message)
                toast.success('Form Submitted Successfully', {
                  position: toast.POSITION.TOP_CENTER,
                });
                history.push(listDESheetName);
              }
            }
          }
        } else if (values && values.status === 'Draft') {
          if (location.state && location.state.UUID) {
            const id: any = location.state.UUID;
            // values.stateId = (values.stateId == 0) ? "0" : values.stateId;
            // values.districtId = (values.districtId == 0) ? "0" : values.districtId;
            // values.fundAllocatedWithDate = (values.fundAllocatedWithDate == "") ? "0.00" : values.fundAllocatedWithDate;
            // values.fundUtilisedWithDate = (values.fundUtilisedWithDate == "") ? "0.00" : values.fundUtilisedWithDate;
            // values.fundBalanceAfterRound = (values.fundBalanceAfterRound == "") ? "0.00" : values.fundBalanceAfterRound;
            values.lastModifiedBy = props && props.userSessionId;
            const response =
              await mdaIecActivityDraftServices.updateMdaIecActivity(
                id,
                values
              );
            console.log(response);
            if (response) {
              toast.success('Form Submitted Successfully', {
                position: toast.POSITION.TOP_CENTER,
              });
              history.push(listDESheetName);
            }
          } else {
            values.stateId = values.stateId == 'None' ? '' : values.stateId;
            values.districtId =
              values.districtId == 'None' ? '' : values.districtId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;
            let response = await mdaIecActivityDraftServices.addMdaIecActivity(
              values
            );
            console.log(response);
            if (response) {
              //alert.success(response.message)
              toast.success('Form Submitted Successfully', {
                position: toast.POSITION.TOP_CENTER,
              });
              history.push(listDESheetName);
            }
          }
        }
      }
    },
  });

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

  return (
    <div className='in-left'>
      <Breadcrumb>
        <Breadcrumb.Item
          onClick={() => {
            history.push('/WebDashboard');
          }}
        >
          Data Entry
        </Breadcrumb.Item>
        {/* <Breadcrumb.Item href="">Pre-MDA</Breadcrumb.Item> */}
        <Breadcrumb.Item
          onClick={() => {
            history.push('/mda-iec-activities');
          }}
        >
          MDA Activity and Fund Utilization
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
            MDA Activity and Fund Utilization
          </h6>
          <div className='card-body'>
            <fieldset
              disabled={location.state && location.state.view ? true : false}
            >
              <Row className='mb-3'>
                <div className='col-xl-3 col-md-6  col-12'>
                  <div className='form-grp'>
                    <label htmlFor='stateId' className='form-label'>
                      State*
                    </label>
                    {stateList && stateList.length !== 0 ? (
                      <Select
                        name='stateId'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        options={stateIdValues}
                        isClearable={true}
                        value={
                          stateIdValues
                            ? stateIdValues.find(
                                (option) =>
                                  option.value === formik.values.stateId
                              )
                            : ''
                        }
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            'stateId',
                            option && option.value
                          );
                          getState(option);
                        }}
                        className={
                          formik.errors.stateId && formik.touched.stateId
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                      ></Select>
                    ) : (
                      <Select
                        name='stateId'
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
                                  option.value === formik.values.stateId
                              )
                            : ''
                        }
                        onChange={(option: Option) => {
                          if (option && option.value) {
                            formik.setFieldValue(
                              'stateId',
                              option && option.value
                            );
                            getState(option);
                          } else {
                            formik.setFieldValue('stateId', 0);
                          }
                        }}
                        className={
                          formik.errors.stateId && formik.touched.stateId
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                      ></Select>
                    )}
                    <div className={'invalid-feedback'}>
                      {formik.errors.stateId ? formik.errors.stateId : ''}
                    </div>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6  col-12'>
                  <div className='form-grp'>
                    <label htmlFor='districtId' className='form-label'>
                      District*
                    </label>
                    {/* {districtList && districtList.length !== 0 ? */}
                    <Select
                      ref={selectDistrictRef}
                      name='districtId'
                      isDisabled={
                        location.state && location.state.view ? true : false
                      }
                      styles={commonFunction.customStyles}
                      isClearable={true}
                      value={
                        districtIdValues
                          ? districtIdValues.find(
                              (option) =>
                                option.value === formik.values.districtId
                            )
                          : ''
                      }
                      options={districtIdValues}
                      onChange={(option: Option) => {
                        formik.setFieldValue(
                          'districtId',
                          option && option.value
                        );
                      }}
                      className={
                        formik.errors.districtId && formik.touched.districtId
                          ? 'custom-select is-invalid'
                          : 'custom-select'
                      }
                    ></Select>
                    {/* :
                                            <Select ref={selectDistrictRef} name="districtId" isDisabled={location.state && location.state.view ? true : false}
                                                styles={commonFunction.customStyles}

                                                value={NoneList ? NoneList.find(option => option.value === 0) : ''}
                                                options={NoneList}
                                                isClearable={true}
                                                onChange={(option: Option) => {
                                                    formik.setFieldValue("districtId", option && option.value);
                                                }}
                                                className={(formik.errors.districtId && formik.touched.districtId ? "custom-select is-invalid"
                                                    : "custom-select")} >
                                            </Select>
                                        } */}
                    <div className={'invalid-feedback'}>
                      {formik.errors.districtId ? formik.errors.districtId : ''}
                    </div>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='form-grp'>
                    <label htmlFor='email' className='form-label font-chng'>
                      Year*
                    </label>
                    <Select
                      isDisabled={
                        location.state && location.state.view ? true : false
                      }
                      styles={commonFunction.customStyles}
                      className={
                        formik.errors.year && formik.touched.year
                          ? 'custom-select is-invalid'
                          : 'custom-select'
                      }
                      name='year'
                      isClearable='true'
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
                      {formik.errors ? formik.errors.year : ''}
                    </div>
                  </div>
                </div>
                <div className='col-md-6 col-xl-3 col-12'>
                  <div className='form-grp'>
                    <label htmlFor='email' className='form-label font-chng'>
                      Month*
                    </label>
                    <Select
                      isDisabled={
                        location.state && location.state.view ? true : false
                      }
                      styles={commonFunction.customStyles}
                      className={
                        formik.errors.month && formik.touched.month
                          ? 'custom-select is-invalid'
                          : 'custom-select'
                      }
                      name='month'
                      isClearable='true'
                      value={
                        monthList
                          ? monthList.find(
                              (option: any) =>
                                option && option.value === formik.values.month
                            )
                          : ''
                      }
                      options={monthList}
                      onChange={(option: Option) => {
                        formik.setFieldValue('month', option && option.value);
                      }}
                    ></Select>
                    <div className={'invalid-feedback'}>
                      {formik.errors ? formik.errors.month : ''}
                    </div>
                  </div>
                </div>

                <div className='col-xl-3 col-md-6  col-12'>
                  <div className='form-grp'>
                    <label htmlFor='materialActivity' className='form-label'>
                      Material/Activity*
                    </label>
                    <Select
                      isDisabled={
                        location.state && location.state.view ? true : false
                      }
                      styles={commonFunction.customStyles}
                      isClearable={true}
                      name='materialActivity'
                      className={
                        formik.errors.materialActivity &&
                        formik.touched.materialActivity
                          ? 'custom-select is-invalid'
                          : 'custom-select'
                      }
                      value={
                        MaterialActivityList
                          ? MaterialActivityList.find(
                              (option: any) =>
                                option &&
                                option.value === formik.values.materialActivity
                            )
                          : ''
                      }
                      options={MaterialActivityList}
                      onChange={(option: Option) => {
                        formik.setFieldValue(
                          'materialActivity',
                          option && option.value
                        );
                        handleOthers(option);
                      }}
                    ></Select>

                    <div className={'invalid-feedback'}>
                      {formik.errors.materialActivity
                        ? formik.errors.materialActivity
                        : ''}
                    </div>
                  </div>
                </div>
                {otherShow && (
                  <div className='col-xl-3 col-md-6  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='otherMaterial' className='form-label'>
                        Others Specify
                      </label>
                      <input
                        type='text'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        name='otherMaterial'
                        value={
                          formik.values.otherMaterial
                            ? formik.values.otherMaterial
                            : ''
                        }
                        onChange={formik.handleChange}
                        className='form-control'
                      />
                    </div>
                  </div>
                )}

                <div className='col-xl-3 col-md-6  col-12'>
                  <div className='form-grp'>
                    <label htmlFor='materialActivityNo' className='form-label'>
                      Number Of Material/Activity
                    </label>
                    <input
                      type='number'
                      onKeyDown={(e) =>
                        symbolsArr.includes(e.key) && e.preventDefault()
                      }
                      min='0'
                      onWheel={(e) => commonFunction.handleWheelEvent(e)}
                      name='materialActivityNo'
                      value={formik.values.materialActivityNo}
                      onChange={formik.handleChange}
                      className='form-control'
                    />
                  </div>
                </div>

                <div className='col-xl-3 col-md-6  col-12'>
                  <div className='form-grp'>
                    <label
                      htmlFor='materialActivityCostInRs'
                      className='form-label'
                    >
                      Cost Of Material/Activity in Rs.
                    </label>
                    <input
                      type='number'
                      onKeyDown={(e) =>
                        symbolsArr.includes(e.key) && e.preventDefault()
                      }
                      min='0'
                      onWheel={(e) => commonFunction.handleWheelEvent(e)}
                      name='materialActivityCostInRs'
                      value={formik.values.materialActivityCostInRs}
                      onChange={formik.handleChange}
                      className='form-control'
                    />
                  </div>
                </div>

                <div className='col-xl-3 col-md-6  col-12'>
                  <div className='form-grp'>
                    <label
                      htmlFor='statementOfFundsAllotted'
                      className='form-label'
                    >
                      Statement of fund allotted
                    </label>
                    <Select
                      isDisabled={
                        location.state && location.state.view ? true : false
                      }
                      styles={commonFunction.customStyles}
                      name='statementOfFundsAllotted'
                      className='custom-select'
                      isClearable={true}
                      value={
                        statementOfFundsAllottedList
                          ? statementOfFundsAllottedList.find(
                              (option: any) =>
                                option &&
                                option.value ===
                                  formik.values.statementOfFundsAllotted
                            )
                          : ''
                      }
                      options={statementOfFundsAllottedList}
                      onChange={(option: Option) => {
                        formik.setFieldValue(
                          'statementOfFundsAllotted',
                          option && option.value
                        );
                        handleOptions(
                          formik.values.statementOfFundsAllotted,
                          option
                        );
                      }}
                    ></Select>
                  </div>
                </div>
                <div className='col-xl-3 col-md-6  col-12'>
                  <div className='form-grp'>
                    <label
                      htmlFor='fundAllocatedWithDate'
                      className='form-label'
                    >
                      Fund Allocated
                    </label>
                    <input
                      type='number'
                      onKeyDown={(e) =>
                        symbolsArr.includes(e.key) && e.preventDefault()
                      }
                      min='0'
                      onWheel={(e) => commonFunction.handleWheelEvent(e)}
                      name='fundAllocatedWithDate'
                      value={formik.values.fundAllocatedWithDate}
                      onChange={(e) => {
                        let num = parseInt(e.target.value);
                        if (num < formik.values.fundUtilisedWithDate) {
                          setmaxValidation(true);
                          console.log(maxValidation);
                        } else {
                          setmaxValidation(false);
                          console.log(maxValidation);
                        }
                        let balance: any =
                          num - Number(formik.values.fundUtilisedWithDate);
                        if (isNaN(balance)) {
                          balance = '';
                          formik.setFieldValue('fundBalanceAfterRound', '');
                        } else {
                          formik.setFieldValue(
                            'fundBalanceAfterRound',
                            balance
                          );
                        }
                        formik.setFieldValue('fundBalanceAfterRound', balance);
                      }}
                      className='form-control'
                    />
                  </div>
                </div>

                <div className='col-xl-3 col-md-6  col-12'>
                  <div className='form-grp'>
                    <label
                      htmlFor='fundUtilisedWithDate'
                      className='form-label'
                    >
                      Fund Utilised
                    </label>
                    <input
                      type='number'
                      onKeyDown={(e) =>
                        symbolsArr.includes(e.key) && e.preventDefault()
                      }
                      min='0'
                      onWheel={(e) => commonFunction.handleWheelEvent(e)}
                      name='fundUtilisedWithDate'
                      value={formik.values.fundUtilisedWithDate}
                      onChange={(e) => {
                        let num = parseInt(e.target.value);
                        if (num > formik.values.fundAllocatedWithDate) {
                          setmaxValidation(true);
                          console.log(maxValidation);
                        } else {
                          setmaxValidation(false);
                          console.log(maxValidation);
                        }
                        let balance: any =
                          Number(formik.values.fundAllocatedWithDate) - num;
                        if (isNaN(balance)) {
                          balance = '';
                          formik.setFieldValue('fundBalanceAfterRound', '');
                        } else {
                          formik.setFieldValue(
                            'fundBalanceAfterRound',
                            balance
                          );
                        }
                      }}
                      className='form-control'
                    />
                  </div>
                </div>

                {showResult && (
                  <div className='col-xl-3 col-md-6  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='dateDistrictCoordComitte'
                        className='form-label'
                      >
                        Date District coordination comittee
                      </label>
                      <input
                        type='date'
                        max={isValidDate}
                        className='form-control'
                        name='dateDistrictCoordComitte'
                        value={formik.values.dateDistrictCoordComitte}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                )}

                <div className='col-xl-3 col-md-6  col-12'>
                  <div className='form-grp'>
                    <label
                      htmlFor='fundBalanceAfterRound'
                      className='form-label'
                    >
                      Fund Balance after round
                    </label>
                    <input
                      type='number'
                      onKeyDown={(e) =>
                        symbolsArr.includes(e.key) && e.preventDefault()
                      }
                      disabled={true}
                      min='0'
                      onWheel={(e) => commonFunction.handleWheelEvent(e)}
                      name='fundBalanceAfterRound'
                      value={
                        formik.values.fundBalanceAfterRound
                          ? formik.values.fundBalanceAfterRound
                          : ''
                      }
                      onChange={formik.handleChange}
                      className={
                        formik.errors.fundBalanceAfterRound &&
                        formik.touched.fundBalanceAfterRound
                          ? 'form-control is-invalid'
                          : 'form-control'
                      }
                    />
                    <div className='invalid-feedback text-danger'>
                      {formik.errors.fundBalanceAfterRound
                        ? formik.errors.fundBalanceAfterRound
                        : null}
                    </div>
                  </div>
                </div>
              </Row>
            </fieldset>
            <div className='form-grp text-right'>
              {/* <button
                                type="submit"
                                className="btn btn-outline-light"
                                onClick={() => history.push(listDESheetName)}
                            >Cancel
                            </button> */}
              {/* {((location.state && !location.state.view) || (!location.state)) && (!(location.state && location.state.id)) &&
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
                                >Save</button>
                            } */}
            </div>
          </div>
        </div>
        <>
          <div className='buttongrouprightend mb-4'>
            <Button
              type='submit'
              onClick={() => history.push(listDESheetName)}
              style={{
                // marginRight: '10px',
                backgroundColor: '#34c38f',
                border: '0px',
                color: ' #ffffff',
              }}
            >
              Cancel
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
                    marginLeft: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                >
                  Save As Draft
                </button>
              )}
            {((location.state && !location.state.view) || !location.state) &&
              isOnline && (
                <button
                  id='Submitbtnid'
                  type='submit'
                  className='btn font-chng'
                  disabled={!isOnline ? (isDisabled ? true : false) : false}
                  style={{
                    marginLeft: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                  onClick={() => {
                    formik.setFieldValue('status', 'Active');
                  }}
                >
                  Save
                </button>
              )}
            {/* <Button
                            id='Submitbtnid'
                            type='submit'
                            style={{
                                backgroundColor: '#34c38f',
                                border: '0px',
                                color: ' #ffffff',
                            }}>
                            Next
                        </Button> */}
          </div>
        </>
      </form>
    </div>
  );
};

export default AddMDAIECActivity;
