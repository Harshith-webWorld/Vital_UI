import React, { useEffect, useState, useRef } from 'react';
import { Formik, Field, Form, ErrorMessage, FormikProvider } from 'formik';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import * as Yup from 'yup';
import Row from 'react-bootstrap/Row';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
//import { ToastContainer } from 'react-toastify';
import { Container } from 'react-bootstrap';
import TassurveyService from '../../../services/FormTasSurveyService';
import history from '../../../../helpers/history';
import { BASE_URL } from '../../../../helpers/config';
import axios from 'axios';
import {
  TasSurvey,
  tasSurveyChildren,
} from '../../../interfaces/FormTasSurveyInterfaces';
import { useFormik } from 'formik';
import DropdownService from '../../../services/DropdownService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import Select, { Option } from 'react-select';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonFunction from '../../../../helpers/common/common';
import Stepper from '@material-ui/core/Stepper';
import StepConnector from '@material-ui/core/StepConnector';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import clsx from 'clsx';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import { StepIconProps } from '@material-ui/core/StepIcon';
import DescriptionIcon from '@material-ui/icons/Description';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import Button from 'react-bootstrap/Button';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import AccordionTASSurveyChildren from './AccordionTASSurveyChildren';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import tasSurveyDraftService from '../../../draftServices/FormTasSurveyDraftService';
import DexieOfflineFormTasSurvey from '../../../draftServices/FormTasSurveyDraftService';

const AddTasSurvey: React.FC<any> = (props) => {
  const listDESheetName: any = props && props.listDESheetName;
  const location = useLocation<any>();
  const currentdate = moment(new Date()).format('yyyy-MM-DD');
  let isValidDate = moment().format('YYYY-MM-DD');

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
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);

  useEffect(() => {
    console.log('location', location);
    getTasData();
    getDropDownData();
    getTassurveyChildrenData();
    getStateValues('14');
  }, []);
  const [isDisabled, setIsDisabled] = useState(false);

  const [stateId, setstateId] = useState([]);
  const [districtId, setDistrictId] = useState();
  const [facilityId, setfacilityId] = useState();
  const [talukaId, settalukaId] = useState();
  const [zoneId, setzoneId] = useState();
  const [corporationId, setcorporationId] = useState();
  const [activeStep, setActiveStep] = React.useState(0);
  const [step1Valid, isStep1Valid] = React.useState(false);
  let [StateValues, setStateValues] = useState([]);
  let [districtValues, setDistrictValues] = useState([]);
  let [corporationValues, setCorporationValues] = useState([]);
  let [talukaValues, setTalukaValues] = useState([]);
  let [wardIdValues, setwardIdValues] = useState([]);
  let [villageValues, setVillageValues] = useState([]);
  let [data, setData] = useState([]);
  const [hideSchoolData, setHideSchoolData] = useState(false);
  const [hidecommunityData, setHideCommunityData] = useState(false);
  let isOnline = window.navigator.onLine;
  const [tasSurveyIdValue, setTasSurveyIdValue] = useState('');
  const [saveUUID, setsaveUUID] = useState();
  const [childView, setChildView] = useState(true);
  let defaultStateValue = [{ label: 'Maharashtra', value: 14 }];
  let typeofTasValue = [
    // { label: "Select....", value: 0 },
    { label: 'Community Based', value: 'Community Based' },
    { label: 'School Based', value: 'School Based' },
  ];
  let tasData = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
  ];
  let euData = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
    { label: 5, value: 5 },
    { label: 6, value: 6 },
    { label: 7, value: 7 },
    { label: 8, value: 8 },
    { label: 9, value: 9 },
    { label: 10, value: 10 },
  ];
  const ageYearsList: any = [];
  Array.from(Array(100), (e, i: any) => {
    ageYearsList.push({ label: i + 1, value: i + 1 });
  });

  const ageMonthsList: any = [];
  Array.from(Array(12), (e, i: any) => {
    ageMonthsList.push({ label: i + 1, value: i + 1 });
  });

  const [hideChildrenTable, setHideChildrenTable] = useState(true);
  const [getChildrenData, setGetChildrendata] = useState([]);
  const [genderData, setGenderData] = useState([]);

  // useEffect(() => {
  //     popup()
  // }, [isOnline])

  async function popup() {
    if (!isOnline) {
      confirmAlert({
        title: 'You are offline now!',
        message: "Don't Refresh your page",
        buttons: [
          {
            label: 'ok',
            onClick: () => {},
          },
        ],
      });
    }
  }

  async function deleteTas(event: any, row: any) {
    event.presist();
    if (location && location.state && location.state.id) {
      const response = await TassurveyService.deleteTasSurveyChildren(row.id);
      if (response.message == 'Deleted successfully') {
        getTassurveyChildrenData();
        //console.log("Delete News", response);
      }
    } else {
      let OfflineResponse = await tasSurveyDraftService.deleteTasSurveyChild(
        row.tasSurveyChildUUID
      );
      getTassurveyChildrenData();
    }
  }

  const Delete = (event: any, row: any) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deleteTas(event, row);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  let tasTable: any = {};
  //Finish and Save Button Function
  async function finishSave() {
    if (
      (location && location.state && location.state.id) ||
      (location && location.state && location.state.view)
    ) {
      moveToListPage();
    } else {
      if (saveUUID) {
        console.log('finish UUID', saveUUID);
        setIsDisabled(true);

        let values = await DexieOfflineFormTasSurvey.getOneTasSurvey(saveUUID);
        tasTable = values;
        let tasDetail = await DexieOfflineFormTasSurvey.getListTasSurveyChild(
          saveUUID
        );
        if (tasDetail && tasDetail.length > 0) {
          tasTable.tasSurveyChildrens = tasDetail;
        }

        let response = await TassurveyService.createAllTasSurvey(tasTable);
        setIsDisabled(false);
        if (response.status === 200) {
          moveToListPage();
          let values = await DexieOfflineFormTasSurvey.deleteTasSurvey(
            saveUUID
          );
          console.log(values);
          let tasList =
            await DexieOfflineFormTasSurvey.deleteGetListTasSurveyChild(
              saveUUID
            );
          console.log(tasList);
        }
      }
    }
  }

  const [initialValues, setInitialvalues] = useState<TasSurvey>({
    id: 0,
    stateId: 14,
    year: '',
    month: '',
    districtId: '',
    corporationId: '',
    talukaId: '',
    wardId: '',
    villageId: '',
    tasId: 0,
    typeOfTAS: '',
    nameOfEU: '',
    euId: 0,
    DateOfSurvey: currentdate,
    nameOfSchool: '',
    typeOfSchool: 0,
    serialNoOfSchool: '',
    tokenNumberSB: '',
    serialNumberOfEA: 0,
    tokenNumberCB: '',
    nameOfEA: '',
    isActive: true,
  });
  const [tasChildren, setTasChildren] = useState<tasSurveyChildren>({
    tasSurveyId: 0,
    nameOfStudent: '',
    tockenNumber: '',
    ageYears: 0,
    ageMonths: 0,
    sex: 0,
    result: '',
    isFamilyHistory: 'false',
    familyHistoryRemarks: '',
    isActive: true,
  });

  const validSchema = Yup.object().shape({
    year: Yup.string().required('Required').nullable(),
    month: Yup.number().min(1, 'Required').required('Required').nullable(),
    stateId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('state is required').nullable(),
    }),
    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('district is required').nullable(),
    }),
    corporationId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('corporation is required').nullable(),
    }),
    talukaId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('taluka is required').nullable(),
    }),
    wardId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Ward is required').nullable(),
    }),
    villageId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('village is required').nullable(),
    }),
  });

  const validSchemaChildren = Yup.object().shape({
    nameOfStudent: Yup.string()
      .required('Name of Student is Required')
      .nullable(),
  });

  const handleNext = () => {
    if (
      formik.values.districtId &&
      formik.values.corporationId &&
      formik.values.talukaId &&
      formik.values.wardId &&
      formik.values.villageId &&
      activeStep === 0
    ) {
      isStep1Valid(true);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (initialValues.id) {
      getTasData();
    }
  };
  const Back = () => {
    setHideChildrenTable(true);
  };

  async function getTassurveyChildrenData() {
    let tasSurveyListId: any;
    let tasSurveyDetails: any;

    if (location && location.state && location.state.id) {
      tasSurveyListId = location.state.id;
      tasSurveyDetails = await TassurveyService.getTASSurveyChildren(
        tasSurveyListId
      );
      if (tasSurveyDetails && tasSurveyDetails.data) {
        setGetChildrendata(tasSurveyDetails && tasSurveyDetails.data);
      }
    } else if (location && location.state && location.state.tasSurveyUUID) {
      tasSurveyListId = location.state.tasSurveyUUID;
      let tasSurveyDetails = await tasSurveyDraftService.getListTasSurveyChild(
        tasSurveyListId
      );
      if (tasSurveyDetails) {
        setGetChildrendata(tasSurveyDetails);
      }
    } else {
      tasSurveyListId = tasSurveyIdValue;
      let tasSurveyDetails = await tasSurveyDraftService.getListTasSurveyChild(
        tasSurveyListId
      );
      if (tasSurveyDetails) {
        setGetChildrendata(tasSurveyDetails);
      }
    }
  }

  const columns = [
    {
      name: 'Name of Student',
      selector: 'nameOfStudent',
    },

    {
      name: 'Age Years',
      selector: 'ageYears',
    },
    {
      name: 'Age Months',
      selector: 'ageMonths',
    },
    {
      name: 'Gender',
      selector: (row: any) => {
        if (row.sex === '0') {
          return 'None';
        } else {
          return genderData.map((item: any) => {
            if (parseInt(row.sex) === item.id) {
              return item.categoryOptionName;
            }
          });
        }
      },
      // (row && row.sex && row.Sex.categoryOptionName),
    },
    {
      name: 'Actions',
      selector: 'Actions',
      cell: (row) => (
        <div data-tag='allowRowEvents'>
          {location && location.state && location.state.view ? (
            <button
              className='btn'
              onClick={() => {
                getOneTasSurveyChildren(row);
              }}
            >
              <img src={viewIcon} />
            </button>
          ) : (
            <>
              <button
                className='btn'
                onClick={() => {
                  getOneTasSurveyChildren(row);
                }}
              >
                <img src={editIcon} />
              </button>
              <button className='btn' onClick={(event) => Delete(event, row)}>
                <img src={deleteIcon} />
              </button>
            </>
          )}
        </div>
      ),
    },
    /*      {
                 name: 'Actions',
                 selector: 'Actions',
                 cell: row => <div data-tag="allowRowEvents">
                     {location && location.state && location.state.id && !location.state.view ? "" : 
                     <button className="btn"
     
                         onClick={() => {
                             if (row.tasSurveyUUID) {
                                 getOneTasSurveyChildren(row.tasSurveyUUID, "UUID")
                             } else if (row.id) {
                                 getOneTasSurveyChildren(row.id, "Id")
                             }
                         }} ><img src={viewIcon} className="font-chng" /></button>}
                     {location && location.state && location.state.view ? "" :
                         <>
                             <button className="btn"
                                 onClick={() => {
                                     if (row.tasSurveyUUID) {
                                         getOneTasSurveyChildren(row.tasSurveyUUID, "UUID")
                                     } else if (row.id) {
                                         getOneTasSurveyChildren(row.id, "Id")
                                     }
                                 }}
                             ><img src={editIcon} className="font-chng" /></button>
                             <button className="btn"
                                 onClick={(e: any) => {
                                     if (row.tasSurveyChildUUID) {
                                         Delete(e, row.tasSurveyChildUUID, "UUID")
                                     } else if (row.id) {
                                         Delete(e, row.id, "Id")
                                     }
                                 }}><img src={deleteIcon} className="font-chng" /></button>
                         </>}
                 </div>,
     
             }, */
  ];

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: async (values: any) => {
      values.districtId = values.districtId ? values.districtId : '0';
      values.corporationId = values.corporationId ? values.corporationId : '0';
      values.talukaId = values.talukaId ? values.talukaId : '0';
      values.wardId = values.wardId ? values.wardId : '0';
      values.villageId = values.villageId ? values.villageId : '0';
      if (location && location.state && location.state.view) {
        getTassurveyChildrenData();
        handleNext();
      }

      //console.log('Users', values);
      else if (location && location.state && location.state.id) {
        values.lastModifiedBy = props && props.userSessionId;
        setTasSurveyIdValue(location.state.id);
        const id: any = location.state.id;
        const response = await TassurveyService.updateTASSurvey(values, id);
        getTassurveyChildrenData();
        handleNext();
      } else if (location && location.state && location.state.id) {
        values.lastModifiedBy = props && props.userSessionId;
        setsaveUUID(location.state.tasSurveyUUID);
        setTasSurveyIdValue(location.state.tasSurveyUUID);
        let response = await tasSurveyDraftService.updateTasSurvey(
          location.state.tasSurveyUUID,
          values
        );
        getTassurveyChildrenData();
        handleNext();
      } else {
        if (values && values.tasSurveyUUID) {
          values.lastModifiedBy = props && props.userSessionId;
          let response = await tasSurveyDraftService.updateTasSurvey(
            values.tasSurveyUUID,
            values
          );
          getTassurveyChildrenData();
          handleNext();
        } else {
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          let response = await tasSurveyDraftService.addTasSurvey(values);
          setsaveUUID(response);
          setTasSurveyIdValue(response);
          getTassurveyChildrenData();
          handleNext();
        }
      }
    },
  });

  const tasChildrenFormik = useFormik({
    initialValues: tasChildren,
    enableReinitialize: true,
    validationSchema: validSchemaChildren,
    onSubmit: async (values: any) => {
      if (location && location.state && location.state.view) {
        getTassurveyChildrenData();
        Back();
      } else {
        let ChildrenId: any;
        let ChildrenListId: any;
        let response;
        if (location && location.state && location.state.id) {
          if (values && values.id) {
            values.tasSurveyId = location.state.id;
            values.lastModifiedBy = props && props.userSessionId;
            let response = await TassurveyService.updateTASSurveyChildren(
              values,
              values.id
            );
            getTassurveyChildrenData();
            Back();
          } else {
            values.tasSurveyId = location.state.id;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;
            let response = await TassurveyService.postTassurveyChildren(values);
            getTassurveyChildrenData();
            Back();
          }
        } else if (location && location.state && location.state.tasSurveyUUID) {
          if (values && values.tasSurveyChildUUID) {
            ChildrenId = location.state.tasSurveyUUID;
            values.tasSurveyId = ChildrenId;
            values.lastModifiedBy = props && props.userSessionId;
            let response = await tasSurveyDraftService.updateTasSurveyChild(
              values.tasSurveyChildUUID,
              values
            );
            getTassurveyChildrenData();
            Back();
          } else {
            ChildrenId = location.state.tasSurveyUUID;
            values.tasSurveyId = ChildrenId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;

            let response = await tasSurveyDraftService.addTasSurveyChild(
              values
            );
            getTassurveyChildrenData();
            Back();
          }
        } else {
          if (values && values.tasSurveyChildUUID) {
            ChildrenId = tasSurveyIdValue;
            values.tasSurveyId = ChildrenId;
            values.lastModifiedBy = props && props.userSessionId;

            let response = await tasSurveyDraftService.updateTasSurveyChild(
              values.tasSurveyChildUUID,
              values
            );
            getTassurveyChildrenData();
            Back();
          } else {
            ChildrenId = tasSurveyIdValue;
            values.tasSurveyId = ChildrenId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;

            let response = await tasSurveyDraftService.addTasSurveyChild(
              values
            );
            getTassurveyChildrenData();
            Back();
          }
        }
      }
    },
  });

  const districtNoneList = [{ districtName: 'None', value: 0 }];

  let NoneList = [{ label: 'None', value: 0 }];
  const prevStateRef: any = React.useRef();
  const prevDistrictRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const prevTalukaRef: any = React.useRef();
  const prevZoneRef: any = React.useRef();
  const prevCorporationRef: any = React.useRef();
  useEffect(() => {
    prevDistrictRef.current = districtId;
    prevFacilityRef.current = facilityId;
    prevTalukaRef.current = talukaId;
    prevZoneRef.current = zoneId;
    prevCorporationRef.current = corporationId;
    prevStateRef.current = stateId;
  });
  const prevStateIdValue = prevStateRef.current;
  const prevDistrictIdValue = prevDistrictRef.current;
  const prevFacilityIdValue = prevFacilityRef.current;
  const prevTalukaIdValue = prevTalukaRef.current;
  const prevZoneIdValue = prevZoneRef.current;
  const prevCorporationIdValue = prevCorporationRef.current;
  let selectDistrictRef: any = useRef();
  let selectCorporationRef: any = useRef();
  let selectZoneRef: any = useRef();
  let selectWardRef: any = useRef();
  let selectTalukaRef: any = useRef();
  let selectFacilityRef: any = useRef();
  let selectVillageRef: any = useRef();

  async function getState(e: any) {
    console.log(e);
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
      if (districtId && districtId.data && districtId.data.length > 0) {
        let districtData: any;
        if (!isOnline) {
          districtData = [OptionLabel.districtNone, ...offlineDistrictId];
        } else {
          districtData = [OptionLabel.districtNone, ...districtId.data];
        }
        districtData = [OptionLabel.districtSelectLabel, ...districtData];
        formik.setFieldValue('districtId', '');
        formik.setFieldValue('talukaId', 0);
        formik.setFieldValue('villageId', 0);
        formik.setFieldValue('wardId', 0);
        formik.setFieldValue('zoneId', 0);
        formik.setFieldValue('corporationId', 0);
        setDistrictValues(districtData);
      } else {
        //selectDistrictRef.current.select.clearValue();
        let DistrictData: any = [OptionLabel.districtNone];
        setDistrictValues(DistrictData);
        formik.setFieldValue('districtId', 0);
        formik.setFieldValue('talukaId', 0);
        formik.setFieldValue('villageId', 0);
        formik.setFieldValue('wardId', 0);
        formik.setFieldValue('zoneId', 0);
        formik.setFieldValue('corporationId', 0);
      }
    }
  }

  async function getStateValues(e: any) {
    if (e) {
      let districtIdvalueOffline: any;
      let districtIdvalue: any;
      if (!isOnline) {
        districtIdvalueOffline = await DexieOfflineDataBase.getOneDistrict(e);
      } else {
        districtIdvalue = await DropdownService.getOneDistrict(e);
      }
      console.log(districtIdvalue, districtIdvalueOffline);

      if (
        (districtIdvalue &&
          districtIdvalue.data &&
          districtIdvalue.data.length > 0) ||
        (districtIdvalueOffline && districtIdvalueOffline.length > 0)
      ) {
        let districtData: any;
        if (!isOnline) {
          districtData = [OptionLabel.districtNone, ...districtIdvalueOffline];
        } else {
          districtData = [OptionLabel.districtNone, ...districtIdvalue.data];
        }

        setDistrictValues(districtData);
      } else {
        let districtData: any = [OptionLabel.districtNone];
        setDistrictValues(districtData);
        formik.setFieldValue('districtId', 0);
        // formik.setFieldValue("districtId", 0);
        // formik.setFieldValue("talukaId", 0);
        // formik.setFieldValue("facilityId", 0);
        // formik.setFieldValue("subCenterId", 0);
        // formik.setFieldValue("villageId", 0);
        // formik.setFieldValue("wardId", 0);
        // formik.setFieldValue("corporationId", 0);
      }
    }
  }

  async function getDistrict(e: any) {
    setDistrictId(e && e.value);
    console.log('current value', e && e.value);
    console.log('previous value', prevDistrictIdValue);
    if (!((e && e.value) === prevDistrictIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('talukaId', 0);
        formik.setFieldValue('villageId', 0);
        formik.setFieldValue('wardId', 0);
        formik.setFieldValue('corporationId', 0);
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
        formik.setFieldValue('corporationId', '');
        formik.setFieldValue('wardId', 0);
        setCorporationValues(corporationData);
      } else {
        selectCorporationRef.current.select.clearValue();
        let corporationData: any = [OptionLabel.corporationNone];
        setCorporationValues(corporationData);
        formik.setFieldValue('corporationId', 0);
        // formik.setFieldValue("wardId", 0);
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
      if (
        (talukaId && talukaId.data && talukaId.data.length > 0) ||
        (talukaIdOffline && talukaIdOffline.length > 0)
      ) {
        formik.setFieldValue('talukaId', '');
        formik.setFieldValue('villageId', 0);
        selectTalukaRef.current.select.clearValue();
        let talukaList: any;
        if (!isOnline) {
          talukaList = [OptionLabel.talukaNone, ...talukaIdOffline];
        } else {
          talukaList = [OptionLabel.talukaNone, ...talukaId.data];
        }
        setTalukaValues(talukaList);
      } else {
        selectTalukaRef.current.select.clearValue();
        let Data: any = [OptionLabel.talukaNone];
        setTalukaValues(Data);
        formik.setFieldValue('talukaId', 0);
        // formik.setFieldValue("villageId", 0);
      }
    }
  }

  async function getDistrictValues(e: any) {
    let corporationIdOffline: any;
    let corporationId: any;
    if (!isOnline) {
      console.log('district', e);
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
      setCorporationValues(corporationData);
      console.log(formik.values.corporationId);
      //formik.setFieldValue("corporationId", 0);
    } else {
      let Data: any = [OptionLabel.corporationSelectLabel];
      setCorporationValues(Data);
      formik.setFieldValue('corporationId', 0);
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
      setTalukaValues(talukaList);
    } else {
      let Data: any = [OptionLabel.talukaNone];
      setTalukaValues(Data);
      formik.setFieldValue('talukaId', 0);
    }
  }
  async function getCorporation(e: any) {
    setcorporationId(e && e.value);
    console.log('current value', e && e.value);
    console.log('previous value', prevCorporationIdValue);
    if (!((e && e.value) === prevCorporationIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('wardId', 0);
      }
      console.log('corporation id', e && e.value);
      console.log('district id', formik.values.districtId);
      let wardId: any;
      let wardIdOffline: any;
      if (!isOnline) {
        wardIdOffline = await DexieOfflineDataBase.getWardOffline(
          e && e.value,
          formik.values.districtId
        );
      } else {
        wardId = await DropdownService.getOneWard(
          e && e.value,
          formik.values.districtId
        );
      }

      console.log('ward data', wardId);
      if (
        (wardId && wardId.data && wardId.data.length > 0) ||
        (wardIdOffline && wardIdOffline.length > 0)
      ) {
        formik.setFieldValue('wardId', '');
        let wardlist: any;
        if (!isOnline) {
          wardlist = [OptionLabel.wardNoneLabel, ...wardIdOffline];
        } else {
          wardlist = [OptionLabel.wardNoneLabel, ...wardId.data];
        }
        setwardIdValues(wardlist);
      } else {
        selectWardRef.current.select.clearValue();
        let Data: any = [OptionLabel.wardNoneLabel];
        setwardIdValues(Data);
        formik.setFieldValue('wardId', 0);
      }
    }
  }

  async function getCorporationValues(e: any, districtId: any) {
    let wardId: any;
    let wardIdOffline: any;
    if (!isOnline) {
      wardIdOffline = await DexieOfflineDataBase.getWardOffline(e, districtId);
    } else {
      wardId = await DropdownService.getOneWard(e, districtId);
    }

    if (
      (wardId && wardId.data && wardId.data.length > 0) ||
      (wardIdOffline && wardIdOffline.length > 0)
    ) {
      let wardlist: any;
      if (!isOnline) {
        wardlist = [OptionLabel.wardNoneLabel, ...wardIdOffline];
      } else {
        wardlist = [OptionLabel.wardNoneLabel, ...wardId.data];
      }
      setwardIdValues(wardlist);
    } else {
      let Data: any = [OptionLabel.wardNoneLabel];
      setwardIdValues(Data);
      formik.setFieldValue('wardId', 0);
    }
  }

  async function getTaluka(e: any) {
    settalukaId(e && e.value);
    if (!((e && e.value) === prevTalukaIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('villageId', 0);
      }
      let Village: any;
      let VillageIdOffline: any;
      if (!isOnline) {
        VillageIdOffline = await DexieOfflineDataBase.getVillageByTalukaOffline(
          e && e.value,
          formik.values.districtId
        );
      } else {
        Village = await DropdownService.getOneVillageByTaluka(
          e && e.value,
          formik.values.districtId
        );
      }
      if (
        (Village && Village.data && Village.data.length > 0) ||
        (VillageIdOffline && VillageIdOffline.length > 0)
      ) {
        formik.setFieldValue('villageId', '');
        selectVillageRef.current.select.clearValue();
        let villagelist: any;
        if (!isOnline) {
          villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
        } else {
          villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
        }
        setVillageValues(villagelist);
      } else {
        selectVillageRef.current.select.clearValue();
        let Data: any = [OptionLabel.villageNoneLabel];
        setVillageValues(Data);
        formik.setFieldValue('villageId', 0);
      }
    }
  }
  async function getTalukaValues(e: any, id: any) {
    if (location && location.state && location.state.id) {
      let Village: any;
      let VillageIdOffline: any;
      if (!isOnline) {
        VillageIdOffline = await DexieOfflineDataBase.getVillageByTalukaOffline(
          e,
          id
        );
      } else {
        Village = await DropdownService.getOneVillageByTaluka(e, id);
      }
      if (
        (Village && Village.data && Village.data.length > 0) ||
        (VillageIdOffline && VillageIdOffline.length > 0)
      ) {
        let villagelist: any;
        if (!isOnline) {
          villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
        } else {
          villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
        }
        setVillageValues(villagelist);
      } else {
        let Data: any = [OptionLabel.villageNoneLabel];
        setVillageValues(Data);
        formik.setFieldValue('villageId', 0);
      }
    }
  }

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

  async function getDropDownData() {
    if (isOnline) {
      const response = await DropdownService.getStateInfo();
      if (response) {
        setStateValues(response.data);
      }
    } else {
      const response = await DexieOfflineDataBase.getStates();
      if (response) {
        setStateValues(response);
      }
    }
    if (isOnline) {
      const districtId: any = await DropdownService.getDistrictInfo();
      //console.log("PreeOffline",districtId)

      if (districtId && districtId.data) {
        setDistrictValues(districtId.data);
      }
    } else {
      const districtIdOffline: any = await DexieOfflineDataBase.getDistricts();
      if (districtIdOffline) {
        setDistrictValues(districtIdOffline);
      }
    }

    if (isOnline) {
      const unitActionData: any = await DropdownService.getUnitAction();
      if (unitActionData && unitActionData.data) {
        setData(unitActionData.data);
      }
    } else {
      const UnitActionOfflineData: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (UnitActionOfflineData) {
        setData(UnitActionOfflineData);
      }
    }
    const genderOfflineData: any =
      await DexieOfflineDataBase.getCatagoryOption();
    if (genderOfflineData) {
      setGenderData(genderOfflineData);
    }
  }

  const TypeofTASDropdownData: any = [];
  data &&
    data.map((item: any, i: any) => {
      if (item && item.categoryCode == 1018) {
        TypeofTASDropdownData.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });

  const AgeDropdownData =
    data &&
    data.map((item: any, i: any) => {
      if (item && item.categoryCode == 1014) {
        return (
          <option key={i} value={item.id}>
            {item.categoryOptionName}
          </option>
        );
      }
    });

  const ResultDropdownData: any = [];
  data &&
    data.map((item: any, i: any) => {
      if (item && item.categoryCode == 1011) {
        ResultDropdownData.push({
          label: item.categoryOptionName,
          value: item.categoryOptionName,
        });
      }
    });

  const boolean2str = (value) => {
    if (value === true) return 'true';
    if (value === false) return 'false';
    return value;
  };

  async function getTasData() {
    let id: any;
    if (location.state && location.state.id) {
      id = location.state.id;
      const response = await TassurveyService.getOneTasSurvey(id);
      if (response) {
        getStateValues(response.data[0].stateId);
        getDistrictValues(response.data[0].districtId);
        getCorporationValues(
          response.data[0].corporationId,
          response.data[0].districtId
        );
        getTalukaValues(response.data[0].talukaId, response.data[0].districtId);
        let arr: any = response.data;
        arr[0].isFamilyHistory = boolean2str(arr[0].isFamilyHistory);
        console.log('EditId', arr[0]);
        setInitialvalues(arr[0]);
        if (response.data[0].typeOfTAS === 'Community Based') {
          setHideSchoolData(false);
          setHideCommunityData(true);
        } else if (response.data[0].typeOfTAS === 'School Based') {
          setHideSchoolData(true);
          setHideCommunityData(false);
        } else {
          setHideSchoolData(false);
          setHideCommunityData(false);
        }
        getTassurveyChildrenData();
      }
    } else if (location.state && location.state.tasSurveyUUID) {
      id = location.state.tasSurveyUUID;
      setsaveUUID(id);
      let OfflineResponse = await tasSurveyDraftService.getOneTasSurvey(id);
      getStateValues(OfflineResponse.stateId);
      getDistrictValues(OfflineResponse.districtId);
      getCorporationValues(
        OfflineResponse.corporationId,
        OfflineResponse.districtId
      );
      getTalukaValues(OfflineResponse.talukaId, OfflineResponse.districtId);
      let arr: any = OfflineResponse;
      setInitialvalues(arr);
      if (OfflineResponse.typeOfTAS === 'Community Based') {
        setHideSchoolData(false);
        setHideCommunityData(true);
      } else if (OfflineResponse.typeOfTAS === 'School Based') {
        setHideSchoolData(true);
        setHideCommunityData(false);
      } else {
        setHideSchoolData(false);
        setHideCommunityData(false);
      }
      getTassurveyChildrenData();
    }
    // else {
    //     let OfflineResponse = await tasSurveyDraftService.getOneTasSurvey(saveUUID);
    //     getStateValues(OfflineResponse.stateId);
    //     getDistrictValues(OfflineResponse.districtId);
    //     getCorporationValues(OfflineResponse.corporationId, OfflineResponse.districtId)
    //     getTalukaValues(OfflineResponse.talukaId, OfflineResponse.districtId);
    //     let arr: any = OfflineResponse;
    //     setInitialvalues(arr);
    //     if (OfflineResponse.typeOfTAS === "Community Based") {
    //         setHideSchoolData(false)
    //         setHideCommunityData(true)
    //     } else if (OfflineResponse.typeOfTAS === "School Based") {
    //         setHideSchoolData(true)
    //         setHideCommunityData(false)
    //     } else {
    //         setHideSchoolData(false)
    //         setHideCommunityData(false)
    //     }
    // }
  }

  const hideChildren = () => {
    tasChildrenFormik.resetForm({ values: tasChildren });
    setHideChildrenTable(false);
  };

  async function getOneTasSurveyChildren(row) {
    setTasChildren(row);
    setHideChildrenTable(false);
    console.log('Row', row.isFamilyHistory);
    row.isFamilyHistory = boolean2str(row.isFamilyHistory);
  }

  /*   async function getOneTasSurveyChildren(id: any, idType) {
          if (idType === "ID") {
              // const id: any = location.state.id;
              const response = await TassurveyService.getOneTasSurveyChildren(id);
              if (response) {
                  let data: any = response.data;
                  console.log('EditId22', data[0])
                  data[0].isFamilyHistory = boolean2str(data[0].isFamilyHistory)
                  setTasChildren(data[0]);
                  setHideChildrenTable(false);
  
  
              }
          }
          else if (idType === "UUID") {
              let OfflineResponse = await tasSurveyDraftService.getOneTasSurveyChild(id);
              let arr: any = OfflineResponse;
              setTasChildren(OfflineResponse)
              setHideChildrenTable(false)
  
          }
  
  
      } */

  async function getOneTasSurveyChildrenViewData(id: any, idType) {
    if (id) {
      if (idType === 'ID') {
        // const id: any = location.state.id;
        const response = await TassurveyService.getOneTasSurveyChildren(id);
        if (response) {
          let data: any = response.data;
          console.log('EditId22', data[0]);
          data[0].isFamilyHistory = boolean2str(data[0].isFamilyHistory);
          setTasChildren(data[0]);
          setHideChildrenTable(false);
          setChildView(false);
        }
      } else {
        let OfflineResponse = await tasSurveyDraftService.getOneTasSurveyChild(
          id
        );
        let arr: any = OfflineResponse;
        setInitialvalues(arr);
        setHideChildrenTable(false);
        setChildView(false);
      }
    }
  }
  async function moveToListPage() {
    if (location && location.state && location.state.view) {
      history.push(listDESheetName);
    } else {
      history.push(listDESheetName);
      toast.success('Form Submitted Successfully', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

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
  const corporationList =
    corporationValues &&
    corporationValues.map((item: any, i: any) => {
      return { label: item.corporationName, value: item.id };
    });
  const talukaList =
    talukaValues &&
    talukaValues.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });
  const wardList =
    wardIdValues &&
    wardIdValues.map((item: any, i: any) => {
      return { label: item.wardName, value: item.id };
    });
  const villageList =
    villageValues &&
    villageValues.map((item: any, i: any) => {
      return { label: item.villageName, value: item.id };
    });

  const genderList =
    data &&
    data.map((item: any, i: any) => {
      if (item && item.categoryCode === 1000) {
        return (
          <label className='form-label' key={i}>
            <input
              type='radio'
              name='sex'
              value={item.id}
              checked={Number(tasChildrenFormik.values.sex) === Number(item.id)}
              onChange={(event: any) => {
                tasChildrenFormik.setFieldValue('sex', event.target.value);
              }}
            />
            {item.categoryOptionName}
          </label>
        );
      }
    });

  const dateHandle = (val) => {
    let val1 = moment(val).format('YYYY-MM-DD');
    formik.setFieldValue('DateOfSurvey', val1);
  };

  const handleChangeData = (e) => {
    if (e.value == 'Community Based') {
      setHideSchoolData(false);
      setHideCommunityData(true);
    } else if (e.value == 'School Based') {
      setHideSchoolData(true);
      setHideCommunityData(false);
    }
  };

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
    } else if (e.target.id == 'Submitbtnid2') {
      tasChildrenFormik.validateForm().then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error('Please Enter Required Fields', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
    }
  };

  function getSteps() {
    return ['Select campaign settings', 'Create an ad group'];
  }

  const useColorlibStepIconStyles = makeStyles({
    root: {
      backgroundColor: '#DAF2CC',
      zIndex: 1,
      color: '#a9a3a3',
      width: 60,
      height: 60,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    active: {
      color: '#0D9206',
    },
    completed: {
      backgroundColor: '#DAF2CC',
      color: '#0D9206',
    },
  });

  const useColorlibStepIconStylesnew = makeStyles((theme) => ({
    root: {
      backgroundColor: '#B8E3FC',
      zIndex: 1,
      color: '#a9a3a3',
      width: 60,
      height: 60,
      display: 'flex',
      borderRadius: '50%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    active: {
      color: '#19D895',
      backgroundColor: '#19D895',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    completed: {
      backgroundColor: '#19D895',
      color: '#0D9206',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }));

  function ColorlibStepIcon(props: StepIconProps) {
    const classes = useColorlibStepIconStylesnew();
    const { active, completed } = props;

    const icons: { [index: string]: React.ReactElement } = {
      1: (
        <div className='step-iconnew pre-iconnew font-chng'>
          <DescriptionIcon />
        </div>
      ),
      2: (
        <div className='step-iconnew truck-iconnew font-chng'>
          <LocalShippingIcon />
        </div>
      ),
    };

    return (
      <div
        className={clsx(classes.root, {
          [classes.active]: active,
          [classes.completed]: completed,
        })}
      >
        {icons[String(props.icon)]}
      </div>
    );
  }

  const ColorlibConnector = withStyles({
    alternativeLabel: {
      top: 22,
    },
    active: {
      '& $line': {
        backgroundColor: '#B8E3FC',
      },
      backgroundColor: '#B8E3FC',
    },
    completed: {
      '& $line': {
        backgroundColor: '#B8E3FC',
      },
      backgroundColor: '#B8E3FC',
    },
    line: {
      height: 3,
      border: 0,
      backgroundColor: '#E5E5E5',
      borderRadius: 1,
    },
  })(StepConnector);

  const handleStep = (step: number) => () => {
    if (step1Valid || location.state) {
      setActiveStep(step);
    }
  };
  const ExpandedComponent = (row) => {
    return <AccordionTASSurveyChildren rowValues={row} />;
  };

  return (
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
            history.push('/tas-survey');
          }}
          className='font-chng'
        >
          TAS Survey
        </Breadcrumb.Item>
        {isOnline ? (
          <Breadcrumb.Item active className='font-chng'>
            ONLINE
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active className='font-chng'>
            OFFLINE
          </Breadcrumb.Item>
        )}
        {location.state && location.state.view ? (
          <Breadcrumb.Item active>View</Breadcrumb.Item>
        ) : (location.state && location.state.id) ||
          (location.state && location.state.tasSurveyUUID) ? (
          <Breadcrumb.Item active>Edit</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active>Add</Breadcrumb.Item>
        )}
      </Breadcrumb>
      <Stepper
        className={`${
          location && location.state && location.state.view
            ? 'step-wrapnew'
            : 'step-wrapnew-no-cursor'
        }`}
        activeStep={activeStep}
        alternativeLabel
        connector={<ColorlibConnector />}
      >
        <Step>
          <StepLabel
            onClick={handleStep(0)}
            StepIconComponent={ColorlibStepIcon}
          >
            <h5 className='font-chng'>Step 1</h5>
            <h4 className='font-chng'>Tas Survey</h4>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel
            onClick={handleStep(1)}
            StepIconComponent={ColorlibStepIcon}
          >
            <h5 className='font-chng'>Step 2</h5>
            <h4 className='font-chng'>Tas Survey Children</h4>
          </StepLabel>
        </Step>
      </Stepper>

      {/* <FormikProvider value={formik}> */}
      {activeStep === 0 && (
        <form
          onClick={showToast}
          name='tassurvey'
          onSubmit={formik.handleSubmit}
          onChange={formik.handleChange}
        >
          {/* <fieldset disabled={location.state && location.state.view ? true : false}> */}

          <div className='card'>
            <h4 className='formtitlenew font-chng'> TAS Survey</h4>
            <div className='card-body'>
              <fieldset
                disabled={location.state && location.state.view ? true : false}
              >
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='stateId' className='form-label'>
                        State*
                      </label>
                      {/* {StateValues && StateValues.length !== 0 ? */}
                      <Select
                        name='stateId'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        options={stateIdList}
                        isClearable={true}
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
                      {/* :
                                            <Select name="stateId" isDisabled={location.state && location.state.view ? true : false}
                                                styles={commonFunction.customStyles}

                                                options={NoneList}
                                                isClearable={true}
                                                value={NoneList ? NoneList.find(option => option.value == formik.values.stateId) : ''}
                                                onChange={(option: Option) => {
                                                    if (option && option.value) {
                                                        formik.setFieldValue("stateId", option && option.value);
                                                        getState(option);
                                                    }
                                                    else {
                                                        formik.setFieldValue("stateId", 0)
                                                    }
                                                }}
                                                className={(formik.errors.stateId && formik.touched.stateId ? "custom-select is-invalid"
                                                    : "custom-select")} >
                                            </Select>
                                        } */}
                      <div className={'invalid-feedback'}>
                        {formik.errors.stateId ? formik.errors.stateId : ''}
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
                          styles={commonFunction.customStyles}
                          options={districtList}
                          isClearable={true}
                          ref={selectDistrictRef}
                          defaultValue={[{ label: 'Select...', value: 0 }]}
                          className={
                            formik.errors.districtId &&
                            formik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            districtList
                              ? districtList.find(
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
                        ></Select>
                      ) : (
                        <Select
                          name='districtId'
                          options={NoneList}
                          isClearable={true}
                          ref={selectDistrictRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          defaultValue={[{ label: 'Select...', value: 0 }]}
                          className={
                            formik.errors.districtId &&
                            formik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          styles={commonFunction.customStyles}
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option: any) =>
                                    option &&
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
                          aria-label='Default select example'
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
                      {corporationValues && corporationValues.length !== 0 ? (
                        <Select
                          ref={selectCorporationRef}
                          name='corporationId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          value={
                            corporationList
                              ? corporationList.find(
                                  (option) =>
                                    option.value === formik.values.corporationId
                                )
                              : 0
                          }
                          options={corporationList}
                          className={
                            formik.errors.corporationId &&
                            formik.touched.corporationId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          styles={commonFunction.customStyles}
                          isClearable={true}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'corporationId',
                              option && option.value
                            );
                            getCorporation(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      ) : (
                        <Select
                          ref={selectCorporationRef}
                          name='corporationId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          className={
                            formik.errors.corporationId &&
                            formik.touched.corporationId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option: any) => option && option.value === 0
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                          onChange={(option: Option) => {
                            formik.setFieldValue('corporationId', '0');
                            getCorporation(option);
                          }}
                          aria-label='Default select example'
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
                      {talukaValues && talukaValues.length !== 0 ? (
                        <Select
                          name='talukaId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectTalukaRef}
                          isClearable={true}
                          className={
                            formik.errors.talukaId && formik.touched.talukaId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            talukaList
                              ? talukaList.find(
                                  (option) =>
                                    option.value === formik.values.talukaId
                                )
                              : ''
                          }
                          options={talukaList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'talukaId',
                              option && option.value
                            );
                            getTaluka(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      ) : (
                        <Select
                          name='talukaId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectTalukaRef}
                          className={
                            formik.errors.talukaId && formik.touched.talukaId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option: any) => option && option.value === 0
                                )
                              : ''
                          }
                          options={NoneList}
                          isClearable={true}
                          defaultValue={NoneList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'talukaId',
                              option && option.value
                            );
                            getTaluka(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.talukaId ? formik.errors.talukaId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='wardId' className='form-label font-chng'>
                        Ward*
                      </label>
                      {wardIdValues && wardIdValues.length !== 0 ? (
                        <Select
                          name='wardId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectWardRef}
                          className={
                            formik.errors.wardId && formik.touched.wardId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            wardList
                              ? wardList.find(
                                  (option) =>
                                    option.value === formik.values.wardId
                                )
                              : ''
                          }
                          options={wardList}
                          isClearable={true}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'wardId',
                              option && option.value
                            );
                          }}
                          aria-label='Default select example'
                        ></Select>
                      ) : (
                        <Select
                          name='wardId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectWardRef}
                          className={
                            formik.errors.wardId && formik.touched.wardId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option: any) => option && option.value === 0
                                )
                              : ''
                          }
                          options={NoneList}
                          isClearable={true}
                          defaultValue={NoneList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'wardId',
                              option && option.value
                            );
                          }}
                          aria-label='Default select example'
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.wardId ? formik.errors.wardId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='villageId'
                        className='form-label font-chng'
                      >
                        village*
                      </label>
                      {villageValues && villageValues.length !== 0 ? (
                        <Select
                          name='villageId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectVillageRef}
                          isClearable={true}
                          className={
                            formik.errors.villageId && formik.touched.villageId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'villageId',
                              option && option.value
                            );
                          }}
                          value={
                            villageList
                              ? villageList.find(
                                  (option) =>
                                    option.value === formik.values.villageId
                                )
                              : ''
                          }
                          options={villageList}
                          aria-label='Default select example'
                        ></Select>
                      ) : (
                        <Select
                          name='villageId'
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          ref={selectVillageRef}
                          isClearable={true}
                          className={
                            formik.errors.villageId && formik.touched.villageId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              'villageId',
                              option && option.value
                            );
                          }}
                          value={
                            NoneList
                              ? NoneList.find(
                                  (option: any) => option && option.value === 0
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                          aria-label='Default select example'
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {formik.errors.villageId ? formik.errors.villageId : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='tasId' className='form-label font-chng'>
                        {' '}
                        TAS{' '}
                      </label>
                      <Select
                        name='tasId'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        className='custom-select'
                        // value={formik.values.typeOfTASSB}
                        // onChange={(e) => handleChangeData(e)}
                        isClearable='true'
                        // onChange={(e) => hidesourcerounddist(e)}
                        onChange={(option: Option) => {
                          formik.setFieldValue('tasId', option && option.value);
                          handleChangeData(option);
                        }}
                        value={
                          tasData
                            ? tasData.find(
                                (option: any) =>
                                  option && option.value === formik.values.tasId
                              )
                            : ''
                        }
                        options={tasData}
                      ></Select>
                    </div>
                  </div>
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
                        htmlFor='typeOfTAS'
                        className='form-label font-chng'
                      >
                        Type of TAS{' '}
                      </label>
                      <Select
                        name='typeOfTAS'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        className='custom-select'
                        // value={formik.values.typeOfTASSB}
                        // onChange={(e) => handleChangeData(e)}
                        isClearable='true'
                        // onChange={(e) => hidesourcerounddist(e)}
                        onChange={(option: Option) => {
                          formik.setFieldValue(
                            'typeOfTAS',
                            option && option.value
                          );
                          handleChangeData(option);
                        }}
                        value={
                          typeofTasValue
                            ? typeofTasValue.find(
                                (option: any) =>
                                  option &&
                                  option.value === formik.values.typeOfTAS
                              )
                            : ''
                        }
                        options={typeofTasValue}
                      ></Select>
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='nameOfEU'
                        className='form-label font-chng'
                      >
                        Name of EU
                      </label>
                      <input
                        name='nameOfEU'
                        value={formik.values.nameOfEU}
                        onChange={formik.handleChange}
                        onKeyPress={(e) => commonFunction.keyPress(e)}
                        onInput={(event) => commonFunction.onlyAlphabets(event)}
                        type='text'
                        className='form-control'
                      />
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label htmlFor='euId' className='form-label font-chng'>
                        {' '}
                        EU{' '}
                      </label>
                      <Select
                        name='euId'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        className='custom-select'
                        // value={formik.values.typeOfTASSB}
                        // onChange={(e) => handleChangeData(e)}
                        isClearable='true'
                        // onChange={(e) => hidesourcerounddist(e)}
                        onChange={(option: Option) => {
                          formik.setFieldValue('euId', option && option.value);
                          handleChangeData(option);
                        }}
                        value={
                          euData
                            ? euData.find(
                                (option: any) =>
                                  option && option.value === formik.values.euId
                              )
                            : ''
                        }
                        options={euData}
                      ></Select>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3 col-12'>
                    <div className='form-grp'>
                      <label
                        htmlFor='dateofSurvey'
                        className='form-label font-chng'
                      >
                        Date of Survey
                      </label>
                      <input
                        type='date'
                        max={isValidDate}
                        className='form-control'
                        name='DateOfSurvey'
                        value={formik.values.DateOfSurvey}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                </Row>
              </fieldset>
            </div>
          </div>

          <div className='card'>
            {hideSchoolData && (
              <>
                <h4 className='formtitlenew font-chng'>
                  School Based Survey profoma
                </h4>
                <div className='card-body'>
                  <fieldset
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  >
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-3 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='typeOfSchool'
                            className='form-label font-chng'
                          >
                            Type of School
                          </label>
                          <Select
                            name='typeOfSchool'
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            className='custom-select'
                            styles={commonFunction.customStyles}
                            value={
                              TypeofTASDropdownData
                                ? TypeofTASDropdownData.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.typeOfSchool
                                  )
                                : ''
                            }
                            options={TypeofTASDropdownData}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'typeOfSchool',
                                option && option.value
                              );
                            }}
                          ></Select>
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='nameOfSchool'
                            className='form-label font-chng'
                          >
                            Name of School
                          </label>
                          <input
                            name='nameOfSchool'
                            type='text'
                            className='form-control'
                            onChange={formik.handleChange}
                            onKeyPress={(e) => commonFunction.keyPress(e)}
                            onInput={(event) =>
                              commonFunction.onlyAlphabets(event)
                            }
                            value={formik.values.nameOfSchool}
                          />
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='serialNoOfSchool'
                            className='form-label font-chng'
                          >
                            Serial No of School
                          </label>
                          <input
                            name='serialNoOfSchool'
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            className='form-control'
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            onChange={formik.handleChange}
                            value={formik.values.serialNoOfSchool}
                          />
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='tokenNumberSB'
                            className='form-label font-chng'
                          >
                            Token Number
                          </label>
                          <input
                            onChange={formik.handleChange}
                            value={formik.values.tokenNumberSB}
                            name='tokenNumberSB'
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
                </div>
              </>
            )}
            {hidecommunityData && (
              <>
                <h4 className='formtitlenew font-chng'>
                  Community Based Survey
                </h4>
                <div className='card-body'>
                  <fieldset
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  >
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-3 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='serialNumberOfEA'
                            className='form-label font-chng'
                          >
                            Serial No of EA
                          </label>
                          <input
                            name='serialNumberOfEA'
                            value={
                              formik.values.serialNumberOfEA
                                ? formik.values.serialNumberOfEA
                                : ''
                            }
                            onChange={formik.handleChange}
                            type='number'
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
                            htmlFor='nameOfEA'
                            className='form-label font-chng'
                          >
                            Name of EA
                          </label>
                          <input
                            name='nameOfEA'
                            value={formik.values.nameOfEA}
                            onChange={formik.handleChange}
                            onKeyPress={(e) => commonFunction.keyPress(e)}
                            onInput={(event) =>
                              commonFunction.onlyAlphabets(event)
                            }
                            type='text'
                            className='form-control'
                          />
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='serialNumberOfEA'
                            className='form-label font-chng'
                          >
                            Serial No of EA
                          </label>
                          <input
                            name='serialNumberOfEA'
                            value={
                              formik.values.serialNumberOfEA
                                ? formik.values.serialNumberOfEA
                                : ''
                            }
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
                            htmlFor='tokenNumberCB'
                            className='form-label font-chng'
                          >
                            Token Number
                          </label>
                          <input
                            name='tokenNumberCB'
                            value={formik.values.tokenNumberCB}
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
                </div>
              </>
            )}

            {/* <div className="form-grp text-right">
                            <button
                                type="submit"
                                className="btn btn-outline-light font-chng"
                                onClick={() => history.push(listDESheetName)}
                            >Cancel
                            </button>
                            <button id="Submitbtnid" 
                            type="submit" 
                            className="mt-m btn btn-secondary btn-pad font-chng" >Next</button>
                        </div> */}
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
              Cancel{' '}
            </Button>
            <Button
              id='Submitbtnid'
              type='submit'
              // className='btn-cancel'
              style={{
                backgroundColor: '#34c38f',
                border: '0px',
                color: ' #ffffff',
              }}
            >
              Next
            </Button>
          </div>
        </form>
      )}
      {activeStep == 1 && (
        <div>
          {hideChildrenTable ? (
            <div className='card'>
              <div className='row'>
                <div className='col-md-9 col-12'>
                  <h4 className='formtitlenew font-chng'>Tas Survey List</h4>
                </div>
                {location && location.state && location.state.view ? (
                  ''
                ) : (
                  <div
                    className='col-md-3 col-12 text-right'
                    style={{ display: 'flex', flexDirection: 'row-reverse' }}
                  >
                    <Button
                      variant='secondary'
                      className='mt-m font-chng mr-10'
                      onClick={(e) => {
                        e.preventDefault();
                        setTasChildren(tasChildren);
                        hideChildren();
                      }}
                    >
                      <img src={plusImg} className='pe-2' />
                      Add New
                    </Button>
                  </div>
                )}
              </div>
              <div className='post-tablenew font-chng'>
                <DataTable
                  columns={columns}
                  data={getChildrenData}
                  expandableRows={true}
                  expandOnRowClicked={true}
                  expandableRowsComponent={<ExpandedComponent />}
                  highlightOnHover
                  pagination
                  paginationPerPage={10}
                  paginationRowsPerPageOptions={[10, 25, 50, 100]}
                  paginationComponentOptions={{
                    rowsPerPageText: 'Records per page:',
                    rangeSeparatorText: 'out of',
                  }}
                />
              </div>
              {/* <div className="form-grp text-right">
                                <button type="submit" className="btn btn-outline-light font-chng" onClick={handleBack}><i className="fas fa-arrow-left" ></i>Back</button>
                                {!(location && location.state && location.state.id) && <button type="submit" className="mt-m btn btn-secondary btn-pad font-chng"
                                    onClick={() => moveToListPage()}
                                    style={{ marginRight: 10 }}
                                >Save as Draft</button>}
                                &nbsp; &nbsp;
                                {isOnline &&
                                    <button
                                        type="button"
                                        onClick={() => finishSave()}
                                        className="btn btn-secondary font-chng"
                                        disabled={!isOnline ? true : false}
                                    >
                                        Save
                                    </button>
                                }
                            </div> */}

              <div className='buttongrouprightend mb-4'>
                <Button
                  type='submit'
                  // className=' btn-cancel'
                  onClick={handleBack}
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
                {!(location && location.state && location.state.id) && (
                  <button
                    type='submit'
                    className='btn font-chng'
                    onClick={() => moveToListPage()}
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
                {isOnline && (
                  <button
                    type='submit'
                    onClick={() => finishSave()}
                    className='btn font-chng'
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#34c38f',
                      border: '0px',
                      color: ' #ffffff',
                      textTransform: 'none',
                    }}
                    disabled={!isOnline ? (isDisabled ? true : false) : false}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          ) : (
            <FormikProvider value={tasChildrenFormik}>
              <>
                <form
                  onClick={showToast}
                  name='tassurveyChildren'
                  onSubmit={tasChildrenFormik.handleSubmit}
                  onChange={tasChildrenFormik.handleChange}
                >
                  {/* <fieldset disabled={location.state && location.state.view ? true : false}> */}
                  <div className='card'>
                    <div className='card-body'>
                      <fieldset
                        disabled={
                          location.state && location.state.view ? true : false
                        }
                      >
                        <Row>
                          <div className='col-md-6 col-xl-3 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='nameOfStudent'
                                className='form-label font-chng'
                              >
                                Name of Child*
                              </label>
                              <input
                                name='nameOfStudent'
                                value={tasChildrenFormik.values.nameOfStudent}
                                onKeyPress={(e) => commonFunction.keyPress(e)}
                                onInput={(event) =>
                                  commonFunction.onlyAlphabets(event)
                                }
                                onChange={tasChildrenFormik.handleChange}
                                type='text'
                                className={
                                  tasChildrenFormik.errors.nameOfStudent &&
                                  tasChildrenFormik.touched.nameOfStudent
                                    ? 'form-control is-invalid'
                                    : 'form-control'
                                }
                              />
                              <div className={'invalid-feedback'}>
                                {tasChildrenFormik.errors.nameOfStudent
                                  ? tasChildrenFormik.errors.nameOfStudent
                                  : ''}
                              </div>
                            </div>
                          </div>

                          <div className='col-md-6 col-xl-3 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='tockenNumber'
                                className='form-label font-chng'
                              >
                                Token Number
                              </label>
                              <input
                                name='tockenNumber'
                                value={tasChildrenFormik.values.tockenNumber}
                                //onKeyPress={(e) => commonFunction.keyPress(e)}
                                //onInput={(event) => commonFunction.onlyAlphabets(event)}
                                onChange={tasChildrenFormik.handleChange}
                                type='text'
                                className={
                                  tasChildrenFormik.errors.tockenNumber &&
                                  tasChildrenFormik.touched.tockenNumber
                                    ? 'form-control is-invalid'
                                    : 'form-control'
                                }
                              />
                              <div className={'invalid-feedback'}>
                                {tasChildrenFormik.errors.tockenNumber
                                  ? tasChildrenFormik.errors.tockenNumber
                                  : ''}
                              </div>
                            </div>
                          </div>
                          <h5 className='inner-title font-chng'>
                            Age(In Complete Years)
                          </h5>
                          <div className='col-md-6 col-xl-3 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='ageCB'
                                className='form-label font-chng'
                              >
                                Years
                              </label>
                              <Select
                                className='custom-select'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                name='ageYears'
                                isClearable='true'
                                onChange={(option: Option) => {
                                  tasChildrenFormik.setFieldValue(
                                    'ageYears',
                                    option && option.value
                                  );
                                }}
                                value={
                                  ageYearsList
                                    ? ageYearsList.find(
                                        (option: any) =>
                                          option &&
                                          option.value ===
                                            tasChildrenFormik.values.ageYears
                                      )
                                    : ''
                                }
                                options={ageYearsList}
                              ></Select>
                              <div className={'invalid-feedback'}>
                                {tasChildrenFormik.errors
                                  ? tasChildrenFormik.errors.ageYears
                                  : ''}
                              </div>
                            </div>
                          </div>
                          <div className='col-md-6 col-xl-3 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='ageMonths'
                                className='form-label font-chng'
                              >
                                Months
                              </label>
                              <Select
                                className='custom-select'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                name='ageMonths'
                                isClearable='true'
                                onChange={(option: Option) => {
                                  tasChildrenFormik.setFieldValue(
                                    'ageMonths',
                                    option && option.value
                                  );
                                }}
                                value={
                                  ageMonthsList
                                    ? ageMonthsList.find(
                                        (option: any) =>
                                          option &&
                                          option.value ===
                                            tasChildrenFormik.values.ageMonths
                                      )
                                    : ''
                                }
                                options={ageMonthsList}
                              ></Select>
                            </div>
                          </div>
                          <div className='col-md-6 col-xl-3 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='sex'
                                className='form-label font-chng'
                              >
                                Gender
                              </label>
                              <div
                                role='group'
                                aria-labelledby='my-radio-group'
                                className='form-radio'
                              >
                                {genderList}
                              </div>
                            </div>
                          </div>
                          <div className='col-md-6 col-12 col-xl-3'>
                            <div className='form-grp'>
                              <label
                                htmlFor='result'
                                className='form-label font-chng'
                              >
                                Result
                              </label>
                              <Select
                                name='result'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                className='custom-select'
                                value={
                                  ResultDropdownData
                                    ? ResultDropdownData.find(
                                        (option: any) =>
                                          option &&
                                          option.value ===
                                            tasChildrenFormik.values.result
                                      )
                                    : ''
                                }
                                options={ResultDropdownData}
                                onChange={(option: Option) => {
                                  tasChildrenFormik.setFieldValue(
                                    'result',
                                    option && option.value
                                  );
                                }}
                              ></Select>
                            </div>
                          </div>
                        </Row>
                        <Row className='mb-3'>
                          <div className='col-md-6 col-12 col-xl-3'>
                            <div className='form-grp'>
                              <label
                                htmlFor='isFamilyHistory'
                                className='form-label font-chng'
                              >
                                Previous Family Histroy
                              </label>
                              <div
                                role='group'
                                aria-labelledby='my-radio-group'
                                className='form-radio'
                              >
                                <label className='form-label font-chng'>
                                  <Field
                                    type='radio'
                                    name='isFamilyHistory'
                                    onChange={tasChildrenFormik.handleChange}
                                    defaultChecked={
                                      tasChildrenFormik.values
                                        .isFamilyHistory === 'true'
                                    }
                                    value={'true'}
                                  />
                                  Yes
                                </label>
                                <label className='form-label font-chng'>
                                  <Field
                                    type='radio'
                                    name='isFamilyHistory'
                                    onChange={tasChildrenFormik.handleChange}
                                    defaultChecked={
                                      tasChildrenFormik.values
                                        .isFamilyHistory === 'false'
                                    }
                                    value={'false'}
                                  />
                                  No
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className='col-md-12 col-xl-3 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='familyHistoryRemarks'
                                className='form-label font-chng'
                              >
                                Family History Remarks
                              </label>
                              <textarea
                                name='familyHistoryRemarks'
                                onChange={tasChildrenFormik.handleChange}
                                value={
                                  tasChildrenFormik.values.familyHistoryRemarks
                                }
                                className='form-control h150'
                              />
                            </div>
                          </div>
                        </Row>
                      </fieldset>
                      {/* <div className="form-group text-right">
                                                <button
                                                    type="submit"
                                                    className="btn btn-outline-light font-chng"
                                                    onClick={() => setHideChildrenTable(true)}
                                                >Cancel
                                                </button>
                                                {((location.state && !location.state.view) || (!location.state)) &&
                                                    <button id="Submitbtnid2"
                                                        type="submit"
                                                        className="btn btn-secondary font-chng">
                                                        Submit
                                                    </button>}
                                            </div> */}
                    </div>
                  </div>
                  <div className='buttongrouprightend mb-4'>
                    <Button
                      type='submit'
                      // className=' btn-cancel'
                      onClick={() => setHideChildrenTable(true)}
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
                    {((location.state && !location.state.view) ||
                      !location.state) && (
                      <Button
                        id='Submitbtnid2'
                        type='submit'
                        // className='btn-cancel'
                        style={{
                          backgroundColor: '#34c38f',
                          border: '0px',
                          color: ' #ffffff',
                        }}
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                  {/* </fieldset> */}
                </form>
              </>
            </FormikProvider>
          )}
        </div>
      )}
    </div>
  );
};
export default AddTasSurvey;
