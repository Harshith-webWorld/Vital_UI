import React, { useEffect, useState, useRef } from 'react';
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  useFormik,
  setIn,
  FormikProvider,
} from 'formik';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import * as Yup from 'yup';
import Row from 'react-bootstrap/Row';
import { useLocation } from 'react-router-dom';
//import { ToastContainer } from 'react-toastify';
import { Container } from 'react-bootstrap';
import history from '../../../../helpers/history';
import StockPositionService from '../../../services/FormVerticalStockPositionService';
import DropdownService from '../../../services/DropdownService';
import { VerticalStockPosition } from '../../../interfaces/FormVerticalStockPositionInterface';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { useOnlineStatus } from '../../../../helpers/networkconnection';
import Select, { Option } from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import commonFunction from '../../../../helpers/common/common';
import VerticalUnitStockDraftServices from '../../../draftServices/FormVerticalUnitStockDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import Button from 'react-bootstrap/Button';

const AddVerticalUnitStockPosition: React.FC<any> = (props) => {
  const listDESheetName: any = props && props.listDESheetName;
  let isOnline = window.navigator.onLine;
  const location = useLocation<any>();
  let [showResults, setShowResults] = useState(false);
  let [otherResult, setOtherResult] = useState(false);
  const [stateId, setstateId] = useState([]);
  let [StateValues, setStateValues] = useState([]);
  let [districtValues, setDistrictValues] = useState([]);
  let [districtIdValuesDisplay, setdistrictIdValuesDisplay] = useState([]);
  let [districtreceived, setDistrictReceived] = useState([]);
  let [unitAction, setUnitAction] = useState([]);
  let [nameOfUnitValues, setNameOfUnitValues] = useState([]);
  let selectDistrictRef: any = useRef();
  const [isDisabled, setIsDisabled] = useState(false);
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);
  let measurementValue = [
    { label: 'Ltr.', value: 'Ltr.' },
    { label: 'Kg.', value: 'Kg.' },
    { label: 'Number.', value: 'Number.' },
  ];

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
  let isValidDate = moment().format('YYYY-MM-DD');
  const formReceived = ['District', 'Maharashtra', 'Others'];
  const currentYear = new Date().getFullYear();
  const range = (start, stop, step) =>
    Array.from(
      { length: (stop - start) / step + 1 },
      (_, i) => start + i * step
    );
  const years = range(currentYear, currentYear - 50, -1);
  const currentdate = moment(new Date()).format('yyyy-MM-DD');
  let NoneList = [{ label: 'None', value: 0 }];
  let defaultStateValue = [{ label: 'Maharastra', value: 14 }];
  let receivedValue = [
    { label: 'District', value: 'District' },
    { label: 'Maharastra', value: 'Maharastra' },
    { label: 'Others', value: 'Others' },
  ];
  const [others, setOthers] = useState(false);
  const [initialValues, setInitialvalues] = useState<VerticalStockPosition>({
    year: '',
    month: '',
    stateId: 14,
    districtId: '',
    unitType: '',
    unitName: '',
    items: '',
    otherItem: '',
    measurement: '',
    openingBalanceBatchNo: '',
    openingBalanceMFDate: currentdate,
    openingBalanceExpiryDate: currentdate,
    openingBalanceQty: '',
    receivedDuringMonthBatchNo: '',
    receivedDuringMonthMFDate: currentdate,
    receivedDuringMonthExpiryDate: currentdate,
    receivedDuringMonthQty: '',
    receivedFromWhom: '',
    receivedFromDistricts: 0,
    receivedFromWhomOthers: '',
    totalStock: '',
    actualConsumption: '',
    issueToOtherBatchNo: '',
    issueToOtherMFDate: currentdate,
    issueToOtherExpiryDate: currentdate,
    issueToOtherQty: '',
    issuedToWhom: '',
    balanceEndOfMonth: '',
    reqNext3MonthsQty: '',
    isActive: true,
  });
  const districtNone = {
    id: 0,
    districtName: 'None',
    districtId: 0,
    stateId: 14,
    isActive: true,
    createdBy: null,
    lastModifiedBy: null,
  };

  const districtSelectLabel = {
    id: '',
    districtName: 'Select District',
    districtId: '',
    stateId: 14,
    isActive: true,
    createdBy: null,
    lastModifiedBy: null,
  };

  useEffect(() => {
    //getPosts();
    getStatedetails();
    getDropDownData();
    getData();
    getState(defaultStateValue[0]);
  }, []);

  const prevStateRef: any = React.useRef();
  useEffect(() => {
    prevStateRef.current = stateId;
  });
  const prevStateIdValue = prevStateRef.current;
  const selectNameOfUnitRef: any = React.useRef();
  let [districtIdValues, setdistrictIdValues] = useState([]);

  const validSchema = Yup.object().shape({
    year: Yup.string().required('Required').nullable(),
    month: Yup.number().min(1, 'Required').required('Required').nullable(),
    stateId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Required').nullable(),
    }),
    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Required').nullable(),
    }),
    unitType: Yup.string().required('Required').nullable(),
    unitName: Yup.string().required('Required').nullable(),
    items: Yup.string().required('Required').nullable(),
    receivedDuringMonthMFDate: Yup.date().nullable(),
    receivedDuringMonthExpiryDate: Yup.date()
      .min(
        Yup.ref('receivedDuringMonthMFDate'),
        ({ min }) =>
          `Date Of Expiry should always be greater than Date Of Manufacturing `
      )
      .nullable(),
    issueToOtherMFDate: Yup.date().nullable(),
    issueToOtherExpiryDate: Yup.date()
      .min(
        Yup.ref('issueToOtherMFDate'),
        ({ min }) =>
          `Date Of Expiry should always be greater than Date Of Manufacturing `
      )
      .nullable(),
    openingBalanceMFDate: Yup.date().nullable(),
    openingBalanceExpiryDate: Yup.date()
      .min(
        Yup.ref('openingBalanceMFDate'),
        ({ min }) =>
          `Date Of Expiry should always be greater than Date Of Manufacturing `
      )
      .nullable(),
  });

  async function getStatedetails() {
    if (isOnline) {
      const response = await DropdownService.getStateInfo();
      if (response) {
        setStateValues(response.data);
      }
    } else {
      const offlineResponse = await DexieOfflineDataBase.getStates();
      if (offlineResponse) {
        console.log('PreeOfflien', offlineResponse);
        setStateValues(offlineResponse);
      }
    }
  }

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
            setDistrictValues(districtId.data);
            setDistrictReceived(districtId.data);
          } else {
            setDistrictValues(offlineDistrictId);
            setDistrictReceived(offlineDistrictId);
          }
        } else {
          selectDistrictRef.current.select.clearValue();
          console.log('dddd................', districtId);
          let districtData: any = [OptionLabel.districtNone];
          setDistrictValues(districtData);
          formik.setFieldValue('districtId', 0);
        }
      } else {
        console.log('Same District Value');
      }
    } else {
      let districtData: any = [OptionLabel.districtNone];
      setDistrictValues(districtData);
      formik.setFieldValue('districtId', 0);
    }
  }

  async function getStateValues(e: any) {
    if (isOnline) {
      const districtId: any = await DropdownService.getOneDistrict(e);
      console.log(districtId.data);
      if (districtId && districtId.data && districtId.data.length > 0) {
        setDistrictValues(districtId.data);
      } else {
        let districtData: any = [OptionLabel.districtNone];
        setDistrictValues(districtData);
        formik.setFieldValue('districtId', 0);
      }
    } else {
      const districtId: any = await DexieOfflineDataBase.getOneDistrict(e);
      console.log(districtId);
      if (districtId && districtId.length > 0) {
        setDistrictValues(districtId);
      } else {
        let districtData: any = [OptionLabel.districtNone];
        setDistrictValues(districtData);
        formik.setFieldValue('districtId', 0);
      }
    }
  }
  const prevTypeOfUnitRef: any = React.useRef();

  const [typeOfUnit, setTypeOfUnit] = useState();
  prevTypeOfUnitRef.current = typeOfUnit;
  const prevTypeOfUnitValue = prevTypeOfUnitRef.current;

  async function filterNameOfUnit(e: any, optionTableValues) {
    optionTableValues &&
      optionTableValues.map(async (item: any, i: any) => {
        if (e && e.value) {
          if (item.id == e.value && item.categoryCode === 1003) {
            let nameOfUnitOffline: any;
            let nameOfUnitData: any;
            if (isOnline) {
              nameOfUnitData = await DropdownService.getNameOfUnit(
                item.categoryOptionCode,
                item.categoryOptionEnum
              );
            } else {
              nameOfUnitOffline =
                await DexieOfflineDataBase.getNameOfUnitOffline(
                  item.categoryOptionCode
                );
            }
            //console.log("name of unit", nameOfUnitData);
            if (
              (nameOfUnitData && nameOfUnitData.data.length > 0) ||
              (nameOfUnitOffline && nameOfUnitOffline.length > 0)
            ) {
              selectNameOfUnitRef.current.select.clearValue();
              let data: any;
              if (isOnline) {
                data = [OptionLabel.nameOfUnitNone, ...nameOfUnitData.data];
              } else {
                data = [OptionLabel.nameOfUnitNone, ...nameOfUnitOffline];
              }
              setNameOfUnitValues(data);
              //formik.setFieldValue("nameOfUnit", "")
            } else {
              selectNameOfUnitRef.current.select.clearValue();
              let Data: any = [OptionLabel.nameOfUnitNone];
              setNameOfUnitValues(Data);
              formik.setFieldValue('unitName', 0);
            }
          }
        } else {
          if (item.id == e && item.categoryCode === 1003) {
            let nameOfUnitOffline: any;
            let nameOfUnitData: any;
            if (isOnline) {
              nameOfUnitData = await DropdownService.getNameOfUnit(
                item.categoryOptionCode,
                item.categoryOptionEnum
              );
            } else {
              nameOfUnitOffline =
                await DexieOfflineDataBase.getNameOfUnitOffline(
                  item.categoryOptionCode
                );
            }
            if (
              (nameOfUnitData && nameOfUnitData.data.length > 0) ||
              (nameOfUnitOffline && nameOfUnitOffline.length > 0)
            ) {
              let data: any;
              if (isOnline) {
                data = [OptionLabel.nameOfUnitNone, ...nameOfUnitData.data];
              } else {
                data = [OptionLabel.nameOfUnitNone, ...nameOfUnitOffline];
              }
              setNameOfUnitValues(data);
            } else {
              let Data: any = [OptionLabel.nameOfUnitNone];
              setNameOfUnitValues(Data);
              formik.setFieldValue('unitName', 0);
            }
          }
        }
      });
  }

  async function getDropDownData() {
    if (isOnline) {
      const state: any = await DropdownService.getStateInfo();
      if (state && state.data) {
        setStateValues(state.data);
      }
      const unitActionData: any = await DropdownService.getUnitAction();
      if (unitActionData && unitActionData.data) {
        setUnitAction(unitActionData.data);
      }
      return unitActionData.data;
    } else {
      const state: any = await DexieOfflineDataBase.getStates();
      if (state) {
        setStateValues(state);
      }
      const unitActionData: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (unitActionData) {
        setUnitAction(unitActionData);
      }
      return unitActionData;
    }
  }
  async function filterdistrict(e: any) {
    let nameOfdistrictData: any;
    nameOfdistrictData = await DropdownService.getDistrictByVCU(e);
    console.log(nameOfdistrictData, 'trst');
    formik.setFieldValue('districtId', nameOfdistrictData.data.districtId);
    console.log(formik.values.unitType, 'testt');
  }

  async function loadFsuData(e:any){
    var fsu = await DropdownService.getDistrictByFSU(e);
    if(fsu.data.length==1){
      formik.setFieldValue('districtId', fsu.data[0].id);
    }else{
     setdistrictIdValuesDisplay(modifyData(fsu.data))
    }
    console.log(fsu,"<--fsu district list")
  }
  const modifyData=(data)=>{
    return data.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    })
      }

  const getData = async () => {
    let unitOfActionValues = await getDropDownData();
    if (location.state && location.state.id) {
      const id: any = location.state.id;
      const response = await StockPositionService.getoneStockPosition(id);
      console.log('response', response);
      if (response) {
        getStateValues(response.data[0].stateId);
        let Data: any = response.data[0];
        if (unitOfActionValues) {
          filterNameOfUnit(Data.unitType, unitOfActionValues);
        }
        setInitialvalues(Data);

        if (response.data[0].receivedFromWhom === 'District') {
          setShowResults(true);
          setOtherResult(false);
        }
        if (response.data[0].receivedFromWhom === 'Maharashtra') {
          setShowResults(false);
          setOtherResult(false);
        }
        if (response.data[0].receivedFromWhom === 'Others') {
          setShowResults(false);
          setOtherResult(true);
        }
        console.log('Item', response.data[0].items);
        if (response.data[0].items === 0) {
          setOthers(true);
        } else {
          setOthers(false);
        }
      }
    } else if (location.state && location.state.UUID) {
      const id: any = location.state.UUID;
      console.log(id);
      const response =
        await VerticalUnitStockDraftServices.getOneVerticalUnitStock(id);
      if (response) {
        getStateValues(response.stateId);
        let Data: any = response;
        if (unitOfActionValues) {
          filterNameOfUnit(Data.unitType, unitOfActionValues);
        }
        setInitialvalues(Data);

        if (response.receivedFromWhom === 'District') {
          setShowResults(true);
          setOtherResult(false);
        }
        if (response.receivedFromWhom === 'Maharashtra') {
          setShowResults(false);
          setOtherResult(false);
        }
        if (response.receivedFromWhom === 'Others') {
          setShowResults(false);
          setOtherResult(true);
        }
        if (response.items === 0) {
          setOthers(true);
        } else {
          setOthers(false);
        }
      }
    }
  };

  const stateIdList =
    StateValues &&
    StateValues.map((item: any, i: any) => {
      return { label: item.stateName, value: item.id };
    });
  const districtList =
    districtValues &&
    districtValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };

    });

  const districtReceivedList =
    districtreceived &&
    districtreceived.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });

  const unitOfActionList: any = [];
  unitAction &&
    unitAction.map((item: any, i: any) => {
      if (item && item.categoryCode === 1003) {
        unitOfActionList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });

  const nameOfUnit =
    nameOfUnitValues &&
    nameOfUnitValues.map((item: any, i: any) => {
      return { label: item.nameOfControlUnit, value: item.id };
    });

  const itemList: any = [];
  unitAction &&
    unitAction.map((item: any, i: any) => {
      if (item && item.categoryCode == 1020) {
        itemList.push({ label: item.categoryOptionName, value: item.id });
      }
    });
  itemList.push({ label: 'Other Specify', value: 0 });
  //console.log("itemList:: ",itemList);
  const handleOthers = (e) => {
    if (e.label == 'Other Specify') {
      setOthers(true);
    } else {
      setOthers(false);
    }
  };

  const yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });
  const formReceivedList = formReceived.map((formReceived: any, i: any) => {
    return { label: formReceived, value: formReceived };
  });
  const monthList = months.map((months: any, i: any) => {
    return { label: monthsText[i], value: months };
  });

  const ShowHandleChange = (event) => {
    if (event && event.value === 'District') {
      setShowResults(true);
      setOtherResult(false);
      formik.setFieldValue('receivedFromWhomOthers', '');
      formik.setFieldValue(
        'receivedFromDistricts',
        formik.values.receivedFromDistricts
      );
    } else if (event && event.value === 'Others') {
      setShowResults(false);
      setOtherResult(true);
      formik.setFieldValue('receivedFromWhomOthers', '');
      formik.setFieldValue(
        'receivedFromDistricts',
        formik.values.receivedFromDistricts
      );
    } else {
      setShowResults(false);
      setOtherResult(false);
      formik.setFieldValue('receivedFromWhomOthers', '');
      formik.setFieldValue(
        'receivedFromDistricts',
        formik.values.receivedFromDistricts
      );
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: async (values: any) => {
      values.openingBalanceQty = values.openingBalanceQty
        ? values.openingBalanceQty
        : 0;
      values.receivedDuringMonthQty = values.receivedDuringMonthQty
        ? values.receivedDuringMonthQty
        : 0;
      values.totalStock = values.totalStock ? values.totalStock : 0;
      values.actualConsumption = values.actualConsumption
        ? values.actualConsumption
        : 0;
      values.issueToOtherQty = values.issueToOtherQty
        ? values.issueToOtherQty
        : 0;
      values.balanceEndOfMonth = values.balanceEndOfMonth
        ? values.balanceEndOfMonth
        : 0;
      values.reqNext3MonthsQty = values.reqNext3MonthsQty
        ? values.reqNext3MonthsQty
        : 0;

      setInitialvalues(values);
      setIsDisabled(true);
      if (values && values.status === 'Active') {
        if (location && location.state && location.state.id) {
          values.stateId = values.stateId == 'None' ? 0 : values.stateId;
          values.districtId =
            values.districtId == 'None' ? 0 : values.districtId;
          formik.setFieldValue('unitName', values.unitName);
          values.lastModifiedBy = props && props.userSessionId;
          const response = await StockPositionService.updateStockPosition(
            values,
            location.state.id
          );
          toast.success('Form Submitted Successfully', {
            position: toast.POSITION.TOP_CENTER,
          });
          setIsDisabled(false);

          history.push(listDESheetName);
        } else {
          values.stateId = values.stateId == 'None' ? 0 : values.stateId;
          values.districtId =
            values.districtId == 'None' ? 0 : values.districtId;
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;

          if (values && values.VerticalUnitStockUUID) {
            setIsDisabled(true);
            let UUID: any = values.VerticalUnitStockUUID;
            let response = await StockPositionService.postStockPosition(values);
            console.log(response);
            if (response && response.data) {
              setIsDisabled(false);
              let deleteResponse =
                await VerticalUnitStockDraftServices.deleteVerticalUnitStock(
                  UUID
                );
              console.log(deleteResponse);
              toast.success('Form Submitted Successfully', {
                position: toast.POSITION.TOP_CENTER,
              });
              history.push(listDESheetName);
            }
          } else {
            setIsDisabled(true);
            let response = await StockPositionService.postStockPosition(values);
            if (response.data) {
              setIsDisabled(false);
              toast.success('Form Submitted Successfully', {
                position: toast.POSITION.TOP_CENTER,
              });
            }
            console.log('create Response  ::', response);
            history.push(listDESheetName);
          }
        }
      } else if (values && values.status === 'Draft') {
        setIsDisabled(true);
        if (location.state && location.state.UUID) {
          const id: any = location.state.UUID;
          values.stateId = values.stateId == 'None' ? 0 : values.stateId;
          values.districtId =
            values.districtId == 'None' ? 0 : values.districtId;
          formik.setFieldValue('unitName', values.unitName);
          values.lastModifiedBy = props && props.userSessionId;
          const response =
            await VerticalUnitStockDraftServices.updateVerticalUnitStock(
              id,
              values
            );
          console.log(response);
          if (response) {
            setIsDisabled(false);
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push(listDESheetName);
          }
        } else {
          values.stateId = values.stateId == 'None' ? 0 : values.stateId;
          setIsDisabled(true);
          values.districtId =
            values.districtId == 'None' ? 0 : values.districtId;
          formik.setFieldValue('unitName', values.unitName);
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          let response =
            await VerticalUnitStockDraftServices.addVerticalUnitStock(values);
          console.log(response);
          if (response) {
            setIsDisabled(false);
            //alert.success(response.message)
            toast.success('Form Submitted Successfully', {
              position: toast.POSITION.TOP_CENTER,
            });
            history.push(listDESheetName);
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

  const handleDate = (date: any) => {
    let isExpired = moment().format('YYYY-MM-DD');
    if (isExpired >= date) {
      toast.error('Expired item that should be discarded', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };
  return (
    <FormikProvider value={formik}>
      <div className='in-left'>
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
              history.push('/vertical-stock-position');
            }}
            className='font-chng'
          >
            Vertical unit Stock Position
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
          name='verticalunitstockposition'
          onSubmit={formik.handleSubmit}
          onChange={formik.handleChange}
        >
          <fieldset
            disabled={location.state && location.state.view ? true : false}
          >
            <div className='card'>
              <h4 className='formtitlenew font-chng'>
                Vertical unit Stock Position
              </h4>
              <h4 className='formtitlenew pt-4 font-chng'>Unit Info</h4>
              <div className='card-body'>
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='year' className='form-label font-chng'>
                        Year*
                      </label>
                      <Select
                        name='year'
                        isClearable='true'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
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
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='month' className='form-label font-chng'>
                        Month*
                      </label>
                      <Select
                        name='month'
                        isClearable='true'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        className={
                          formik.errors.month && formik.touched.month
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        options={monthList}
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
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='stateId' className='form-label font-chng'>
                        State*
                      </label>
                      {StateValues && StateValues.length !== 0 ? (
                        <Select
                          name='stateId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          isClearable={true}
                          options={stateIdList}
                          placeholder={'Select State'}
                          value={
                            stateIdList
                              ? stateIdList.find(
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
                          isClearable={true}
                          options={NoneList}
                          placeholder={'Select State'}
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

                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='unitType'
                        className='form-label font-chng'
                      >
                        Type of Unit*
                      </label>
                      <Select
                        name='unitType'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        isClearable='true'
                        className={
                          formik.errors.unitType && formik.touched.unitType
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        value={
                          unitOfActionList
                            ? unitOfActionList.find(
                                (option: any) =>
                                  option &&
                                  option.value === formik.values.unitType
                              )
                            : ''
                        }
                        options={unitOfActionList}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            'unitType',
                            option && option.value
                          );
                          formik.setFieldValue('districtId','')
                          filterNameOfUnit(option, unitAction);
                          setdistrictIdValuesDisplay(modifyData(districtIdValues))
                        }}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.unitType ? formik.errors.unitType : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-xl-3 col-md-6 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='unitName' className='form-label'>
                        Name of Unit*
                      </label>
                      {nameOfUnitValues && nameOfUnitValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          isClearable='true'
                          ref={selectNameOfUnitRef}
                          className={
                            formik.errors.unitName && formik.touched.unitName
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='unitName'
                          value={
                            nameOfUnit
                              ? nameOfUnit.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.unitName
                                )
                              : ''
                          }
                          options={nameOfUnit}
                          onChange={(option: Option) => {
                            if(option!== null){
                            formik.setFieldValue(
                              'unitName',
                              option && option.value
                            );
                            setdistrictIdValuesDisplay(modifyData(districtIdValues))
                            formik.setFieldValue('districtId','')
                            if (formik.values.unitType != '14') {
                              filterdistrict(option.value);
                            }else{
                              loadFsuData(option.value);
                            }
                          }
                          }}
                        ></Select>
                      ) : (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          // styles={commonFunction.customStyles}
                          ref={selectNameOfUnitRef}
                          className={
                            formik.errors.unitName && formik.touched.unitName
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          name='unitName'
                          isClearable={true}
                          value={
                            nameOfUnit
                              ? nameOfUnit.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.unitName
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'unitName',
                              option && option.values
                            );
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.unitName ? formik.errors.unitName : ''}
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
                      {districtValues && districtValues.length !== 0 ? (
                        <Select
                          name='districtId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          isClearable={true}
                          value={
                            districtList
                              ? districtList.find(
                                  (option) =>
                                    option.value === formik.values.districtId
                                )
                              : ''
                          }
                          ref={selectDistrictRef}
                          options={districtIdValuesDisplay}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'districtId',
                              option && option.value
                            );
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
                          value={
                            NoneList
                              ? NoneList.find((option) => option.value === 0)
                              : ''
                          }
                          options={NoneList}
                          ref={selectDistrictRef}
                          isClearable={true}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'districtId',
                              option && option.value
                            );
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
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='items' className='form-label font-chng'>
                        Items*
                      </label>
                      <Select
                        name='items'
                        isClearable='true'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        className={
                          formik.errors.items && formik.touched.items
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        value={
                          itemList
                            ? itemList.find(
                                (option: any) =>
                                  option && option.value === formik.values.items
                              )
                            : ''
                        }
                        options={itemList}
                        onChange={(option: Option) => {
                          formik.setFieldValue('items', option && option.value);
                          handleOthers(option);
                        }}
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {formik.errors.items ? formik.errors.items : ''}
                      </div>
                    </div>
                  </div>
                  {others && (
                    <div className='col-md-6 col-xl-3  col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='otherItem'
                          className='form-label font-chng'
                        >
                          Specify Other
                        </label>
                        <input
                          name='otherItem'
                          value={formik.values.otherItem}
                          onChange={formik.handleChange}
                          type='text'
                          className='form-control'
                        />
                      </div>
                    </div>
                  )}
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='measurement'
                        className='form-label mt-s font-chng'
                      >
                        Measurement
                      </label>
                      <Select
                        name='measurement'
                        isClearable={true}
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        placeholder={measurementValue ? 'Select' : 'None'}
                        className={
                          formik.errors.measurement &&
                          formik.touched.measurement
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        value={
                          measurementValue
                            ? measurementValue.find(
                                (option: any) =>
                                  option &&
                                  option.value === formik.values.measurement
                              )
                            : ''
                        }
                        options={measurementValue}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            'measurement',
                            option && option.value
                          );
                        }}
                      ></Select>
                    </div>
                  </div>
                </Row>
              </div>
            </div>
            <div className='card'>
              <h4 className='formtitlenew font-chng'>Opening Balance</h4>
              <div className='card-body'>
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='openingBalanceBatchNo'
                        className='form-label font-chng'
                      >
                        Batch No
                      </label>
                      <input
                        name='openingBalanceBatchNo'
                        value={formik.values.openingBalanceBatchNo}
                        onChange={formik.handleChange}
                        type='text'
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='openingBalanceMFDate'
                        className='form-label font-chng'
                      >
                        Manufacturing Date
                      </label>
                      <input
                        type='date'
                        max={isValidDate}
                        className='form-control'
                        name='openingBalanceMFDate'
                        value={formik.values.openingBalanceMFDate}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='openingBalanceExpiryDate'
                        className='form-label font-chng'
                      >
                        Expiry Date
                      </label>
                      <input
                        type='date'
                        className={
                          formik.errors.openingBalanceExpiryDate &&
                          formik.touched.openingBalanceExpiryDate
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        name='openingBalanceExpiryDate'
                        value={formik.values.openingBalanceExpiryDate}
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleDate(e.target.value);
                        }}
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors
                          ? formik.errors.openingBalanceExpiryDate
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='openingBalanceQty'
                        className='form-label font-chng'
                      >
                        Quantity
                      </label>
                      <input
                        name='openingBalanceQty'
                        value={formik.values.openingBalanceQty}
                        onChange={formik.handleChange}
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                      />
                    </div>
                  </div>
                </Row>
              </div>
            </div>
            <div className='card'>
              <h4 className='formtitlenew font-chng'>Received During Month</h4>
              <div className='card-body'>
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='receivedDuringMonthBatchNo'
                        className='form-label font-chng'
                      >
                        Batch No
                      </label>
                      <input
                        name='receivedDuringMonthBatchNo'
                        value={formik.values.receivedDuringMonthBatchNo}
                        onChange={formik.handleChange}
                        type='text'
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='receivedDuringMonthMFDate'
                        className='form-label font-chng'
                      >
                        Manufacturing Date
                      </label>
                      <input
                        type='date'
                        max={isValidDate}
                        className='form-control'
                        name='receivedDuringMonthMFDate'
                        value={formik.values.receivedDuringMonthMFDate}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='receivedDuringMonthExpiryDate'
                        className='form-label font-chng'
                      >
                        Expiry Date
                      </label>
                      <input
                        type='date'
                        className={
                          formik.errors.receivedDuringMonthExpiryDate &&
                          formik.touched.receivedDuringMonthExpiryDate
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        name='receivedDuringMonthExpiryDate'
                        value={formik.values.receivedDuringMonthExpiryDate}
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleDate(e.target.value);
                        }}
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors
                          ? formik.errors.receivedDuringMonthExpiryDate
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='receivedDuringMonthQty'
                        className='form-label font-chng'
                      >
                        Quantity
                      </label>
                      <input
                        name='receivedDuringMonthQty'
                        value={formik.values.receivedDuringMonthQty}
                        onChange={formik.handleChange}
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                      />
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='receivedFromWhom'
                        className='form-label font-chng'
                      >
                        From Whom Received
                      </label>
                      <Select
                        name='receivedFromWhom'
                        className='custom-select'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        isClearable='true'
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            'receivedFromWhom',
                            option && option.value
                          );
                          ShowHandleChange(option);
                        }}
                        value={
                          receivedValue
                            ? receivedValue.find(
                                (option: any) =>
                                  option &&
                                  option.value ===
                                    formik.values.receivedFromWhom
                              )
                            : ''
                        }
                        options={receivedValue}
                      ></Select>
                    </div>
                  </div>

                  {showResults && (
                    <div className='col-md-6 col-xl-3 col-12'>
                      <div className='form-grp'>
                        <label
                          htmlFor='receivedFromDistricts'
                          className='form-label font-chng'
                        >
                          From District Received
                        </label>
                        {districtreceived && districtreceived.length !== 0 ? (
                          <Select
                            name='receivedFromDistricts'
                            isClearable={true}
                            value={
                              districtReceivedList
                                ? districtReceivedList.find(
                                    (option) =>
                                      option.value ===
                                      formik.values.receivedFromDistricts
                                  )
                                : ''
                            }
                            options={districtReceivedList}
                            placeholder={'Select District'}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'receivedFromDistricts',
                                option && option.value
                              );
                            }}
                            className={
                              formik.errors.receivedFromDistricts &&
                              formik.touched.receivedFromDistricts
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        ) : (
                          <Select
                            name='receivedFromDistricts'
                            value={
                              NoneList
                                ? NoneList.find((option) => option.value === 0)
                                : ''
                            }
                            options={NoneList}
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'receivedFromDistricts',
                                option && option.value
                              );
                            }}
                            className={
                              formik.errors.receivedFromDistricts &&
                              formik.touched.receivedFromDistricts
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                          ></Select>
                        )}
                        <div className={'invalid-feedback'}>
                          {formik.errors.receivedFromDistricts
                            ? formik.errors.receivedFromDistricts
                            : ''}
                        </div>
                      </div>
                    </div>
                  )}
                  {otherResult && (
                    <div className='col-md-6'>
                      <div className='form-grp'>
                        <label
                          htmlFor='receivedFromWhomOthers'
                          className='form-label font-chng'
                        >
                          From Whom Received Others
                        </label>
                        <input
                          name='receivedFromWhomOthers'
                          value={formik.values.receivedFromWhomOthers}
                          onChange={formik.handleChange}
                          type='text'
                          className='form-control'
                        />
                      </div>
                    </div>
                  )}
                </Row>
              </div>
            </div>
            <div className='card'>
              <div className='card-body'>
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='totalStock'
                        className='form-label font-chng'
                      >
                        Total Stock
                      </label>
                      <input
                        name='totalStock'
                        value={formik.values.totalStock}
                        onChange={formik.handleChange}
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='actualConsumption'
                        className='form-label font-chng'
                      >
                        Actual Consumption
                      </label>
                      <input
                        name='actualConsumption'
                        value={formik.values.actualConsumption}
                        onChange={formik.handleChange}
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                      />
                    </div>
                  </div>
                </Row>
              </div>
            </div>
            <div className='card'>
              <h4 className='formtitlenew font-chng'>Issue To Other</h4>
              <div className='card-body'>
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='issueToOtherBatchNo'
                        className='form-label font-chng'
                      >
                        Batch No
                      </label>
                      <input
                        name='issueToOtherBatchNo'
                        value={formik.values.issueToOtherBatchNo}
                        onChange={formik.handleChange}
                        type='text'
                        className='form-control'
                      />
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='issueToOtherMFDate'
                        className='form-label font-chng'
                      >
                        Manufacturing Date
                      </label>
                      <input
                        type='date'
                        max={isValidDate}
                        className='form-control'
                        name='issueToOtherMFDate'
                        value={formik.values.issueToOtherMFDate}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='issueToOtherExpiryDate'
                        className='form-label font-chng'
                      >
                        Expiry Date
                      </label>
                      <input
                        //  max={isValidDate}
                        type='date'
                        className={
                          formik.errors.issueToOtherExpiryDate &&
                          formik.touched.issueToOtherExpiryDate
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        name='issueToOtherExpiryDate'
                        value={formik.values.issueToOtherExpiryDate}
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleDate(e.target.value);
                        }}
                      />
                      <div className={'invalid-feedback'}>
                        {formik.errors
                          ? formik.errors.issueToOtherExpiryDate
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='issueToOtherQty'
                        className='form-label font-chng'
                      >
                        Quantity
                      </label>
                      <input
                        name='issueToOtherQty'
                        value={formik.values.issueToOtherQty}
                        onChange={formik.handleChange}
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='issuedToWhom'
                        className='form-label font-chng'
                      >
                        To Whom Issued
                      </label>
                      <input
                        name='issuedToWhom'
                        value={formik.values.issuedToWhom}
                        onChange={formik.handleChange}
                        onKeyPress={(e) => commonFunction.keyPress(e)}
                        onInput={(event) => commonFunction.onlyAlphabets(event)}
                        type='text'
                        className='form-control'
                      />
                    </div>
                  </div>
                </Row>
              </div>
            </div>
          </fieldset>
          <div className='card'>
            <div className='card-body'>
              <fieldset
                disabled={location.state && location.state.view ? true : false}
              >
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='balanceEndOfMonth'
                        className='form-label font-chng'
                      >
                        Balance End of Month
                      </label>
                      <input
                        name='balanceEndOfMonth'
                        value={formik.values.balanceEndOfMonth}
                        onChange={formik.handleChange}
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                      />
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='reqNext3MonthsQty'
                        className='form-label font-chng'
                      >
                        Req. Next 3 Month Qty
                      </label>
                      <input
                        name='reqNext3MonthsQty'
                        value={formik.values.reqNext3MonthsQty}
                        onChange={formik.handleChange}
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className='form-control'
                      />
                    </div>
                  </div>
                </Row>
              </fieldset>
              {/* <div className="form-grp text-right">
                <button
                  type="submit"
                  className="btn btn-outline-light font-chng"
                  onClick={() => history.push(listDESheetName)}
                >
                  Cancel
                </button>
                {((location.state && !location.state.view) || (!location.state)) && (!(location.state && location.state.id)) &&
                  <button id="Submitbtnid" type="submit" className="mt-m btn btn-secondary"
                    disabled={location && location.state && location.state.id ? true : false}
                    onClick={() => {
                      formik.setFieldValue("status", "Draft");
                    }}
                    style={{ marginRight: 10 }}
                  >Save As Draft</button>}
                {((location.state && !location.state.view) || (!location.state)) && isOnline &&
                  <button id="Submitbtnid" type="submit" className="mt-m btn btn-secondary"
                    disabled={!isOnline}
                    onClick={() => {
                      formik.setFieldValue("status", "Active");
                    }}

                  >save</button>
                }
              </div> */}
            </div>
          </div>
          <div className='buttongrouprightend mb-4'>
            <Button
              type='submit'
              onClick={() => history.push(listDESheetName)}
              style={{
                marginRight: '10px',
                backgroundColor: '#34c38f',
                border: '0px',
                color: ' #ffffff',
                textTransform: 'none',
              }}
            >
              Cancel{' '}
            </Button>
            {((location.state && !location.state.view) || !location.state) &&
              !(location.state && location.state.id) && (
                <button
                  id='Submitbtnid'
                  className='btn font-chng'
                  type='submit'
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
                  id='Submitbtnid'
                  type='submit'
                  disabled={!isOnline ? (isDisabled ? true : false) : false}
                  onClick={() => {
                    formik.setFieldValue('status', 'Active');
                  }}
                  className='btn font-chng'
                  style={{
                    // marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                >
                  Save
                </button>
              )}
          </div>
        </form>
      </div>
    </FormikProvider>
  );
};
export default AddVerticalUnitStockPosition;
