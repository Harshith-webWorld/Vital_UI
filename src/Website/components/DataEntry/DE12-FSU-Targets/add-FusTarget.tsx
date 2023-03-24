import React, { useState, useEffect, useRef } from 'react';
import { useFormik, Form } from 'formik';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import * as Yup from 'yup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//import { useDispatch, useSelector } from "react-redux";
import Stepper from '@material-ui/core/Stepper';
import { confirmAlert } from 'react-confirm-alert';
import StepConnector from '@material-ui/core/StepConnector';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from 'react-bootstrap/Button';
import DataTable from 'react-data-table-component';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import { WebsiteUserFsuTarget } from '../../../interfaces/FormFusTargetInterface';
import { WebsiteSurveyFsuTarget } from '../../../interfaces/FormFusTargetInterface';
import DescriptionIcon from '@material-ui/icons/Description';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import { StepIconProps } from '@material-ui/core/StepIcon';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import clsx from 'clsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import { ToastContainer } from "react-toastify";
import { Container } from 'react-bootstrap';
import FusTarget from '../../../services/FormFusTargetService';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../../../helpers/config';
import DropdownService from '../../../services/DropdownService';
import history from '../../../../helpers/history';
import Select, { Option } from 'react-select';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import moment from 'moment';
import commonFunction from '../../../../helpers/common/common';
import AccordionFusTarget from './AccordionFusTaget';
import AccordionFusTargetSurvey from './AccordionFusTagetSurvey';
import fsuTargetDraftServices from '../../../draftServices/FormFsuTargetDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';

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
const currentYear = new Date().getFullYear();
const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
const years = range(currentYear, currentYear - 50, -1);
let NoneList = [{ label: 'None', value: 0 }];
const AddFsuTarget: React.FC<any> = (props) => {
  const listDESheetName: any = props && props.listDESheetName;
  let isOnline = window.navigator.onLine;
  useEffect(() => {
    getUnitInfo();
    getAllSurveyDetails();
    getDropDownData();
  }, []);
  const prevDistrictRef: any = React.useRef();
  const [isDisabled, setIsDisabled] = useState(false);
  let selectFacilityRef: any = useRef();
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);
  useEffect(() => {
    prevDistrictRef.current = districtId;
  });
  const prevDistrictIdValue = prevDistrictRef.current;
  const [districtId, setdistrictId] = useState();
  const [activeStep, setActiveStep] = React.useState(0);
  const [step1Valid, isStep1Valid] = React.useState(false);
  let [nameofSurveyUnit, setNameOfSurveyUnit] = useState([]);
  const [hide, setHide] = useState(true);
  let [districtValues, setDistrictValues] = useState([]);
  let [facilityValues, setFacilitValues] = useState([]);
  const [surveyDetails, setsurveyDetails] = useState<any>([]);
  const [fsuTargetAchievementId, setfsuTargetAchievementId] = useState<any>();
  let [districtIdValuesDisplay, setdistrictIdValuesDisplay] = useState([]);
  const [userDetailsList, setUserDetailsList] = useState<WebsiteUserFsuTarget>({
    id: 0,
    nameOfFilariaSurveyUnit: '',
    year: '',
    month: '',
    districtId: '',
    facilityId: '',
    noOfVillagesOrTowns: '',
  });
  const [surveyInitialDetailsList, setSurveyInitialDetailsList] =
    useState<WebsiteSurveyFsuTarget>({
      fsuTargetAchievementId: 0,
      namesOfVillagesOrTowns: '',
      targetedPopulation: '',
      surveyedPopulation: '',
      noOfBSCollected: '',
      noOfBSExamined: '',
      noOfMFPositiveCases: '',
      id: 0,
    });
  const [surveyDetailsList, setSurveyDetailsList] =
    useState<WebsiteSurveyFsuTarget>({
      fsuTargetAchievementId: 0,
      id: 0,
      namesOfVillagesOrTowns: '',
      targetedPopulation: '',
      surveyedPopulation: '',
      noOfBSCollected: '',
      noOfBSExamined: '',
      noOfMFPositiveCases: '',
    });

  const location: any = useLocation();
  const validationSchema = Yup.object().shape({
    nameOfFilariaSurveyUnit: Yup.string()
      .required('This field is required')
      .nullable(),
    year: Yup.string().required('Required').nullable(),
    month: Yup.number().min(1, 'Required').required('Required').nullable(),
    districtId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('district is required').nullable(),
    }),
    facilityId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('facility is required').nullable(),
    }),
  });

  const validate = Yup.object().shape({
    namesOfVillagesOrTowns: Yup.string().when([], {
      is: 0,
      then: Yup.string()
        .required('Names Of Villages Or Towns is required')
        .nullable(),
    }),
  });

  async function getDistrict(e: any) {
    setdistrictId(e && e.value);
    if (!((e && e.value) === prevDistrictIdValue)) {
      if ((e && e.value) === null) {
        unitFormik.setFieldValue('facilityId', 0);
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
        console.log('ghjkl', facilityList);
        unitFormik.setFieldValue('facilityId', '');
        unitFormik.setFieldValue('subCenterId', 0);
        selectFacilityRef.current.select.clearValue();
        //facilityList = [OptionLabel.facilitySelectLabel, ...facilityList]
        setFacilitValues(facilityList);
      } else {
        selectFacilityRef.current.select.clearValue();
        let Data: any = [OptionLabel.facilityNoneLabel];
        setFacilitValues(Data);
        unitFormik.setFieldValue('facilityId', 0);
      }
    }
  }
  async function getDistrictValues(e: any) {
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
      setFacilitValues(facilityList);
    } else {
      let Data: any = [OptionLabel.facilityNoneLabel];
      setFacilitValues(Data);
      unitFormik.setFieldValue('facilityId', 0);
    }
  }
  const modifyData=(data)=>{
    return data.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    })
      }
  async function getDropDownData() {
    if (isOnline) {
      const District: any = await DropdownService.getDistrictInfo();
      if (District && District.data) {
        setDistrictValues(District.data);
        setdistrictIdValuesDisplay(modifyData(District.data))
      }
    } else {
      const District: any = await DexieOfflineDataBase.getDistricts();
      if (District) {
        setDistrictValues(District);
        setdistrictIdValuesDisplay(modifyData(District.data))
      }
    }

    if (isOnline) {
      const nameofsurveyunit: any = await DropdownService.getNameOfUnit(
        'FSU',
        0
      );
      if (nameofsurveyunit && nameofsurveyunit.data) {
        setNameOfSurveyUnit(nameofsurveyunit.data);
      }
    } else {
      const nameofsurveyunit: any =
        await DexieOfflineDataBase.getNameOfUnitOffline('FSU');
      if (nameofsurveyunit) {
        setNameOfSurveyUnit(nameofsurveyunit);
      }
    }
  }

  const districtList =
    districtValues &&
    districtValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  const facilityList =
    facilityValues &&
    facilityValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });
  const monthList = months.map((months: any, i: any) => {
    return { label: monthsText[i], value: months };
  });
  const yearList = years.map((years: any, i: any) => {
    return { label: years, value: years };
  });

  const surveyList =
    nameofSurveyUnit &&
    nameofSurveyUnit.map((item: any, i: any) => {
      return { label: item.nameOfControlUnit, value: item.id };
    });

  const unitFormik = useFormik({
    initialValues: userDetailsList,

    onSubmit: async (val: any) => {
      val.noOfVillagesOrTowns = val.noOfVillagesOrTowns
        ? val.noOfVillagesOrTowns
        : 0;
      if (location && location.state && location.state.view) {
        handleNext();
      } else if (location && location.state && location.state.id) {
        val.lastModifiedBy = props && props.userSessionId;
        setfsuTargetAchievementId(location.state.id);
        let response = await FusTarget.updateFusTarget(val, location.state.id);
        setSurveyDetailsList({
          ...surveyDetailsList,
          fsuTargetAchievementId: location.state.id,
        });
        handleNext();
      } else if (location && location.state && location.state.UUID) {
        val.lastModifiedBy = props && props.userSessionId;
        var id = location && location.state && location.state.UUID;
        setfsuTargetAchievementId(location.state.UUID);
        let response = await fsuTargetDraftServices.updateFsuTargetAchievements(
          id,
          val
        );
        setSurveyDetailsList({
          ...surveyDetailsList,
          fsuTargetAchievementId: location.state.UUID,
        });
        handleNext();
      } else {
        val.createdBy = props && props.userSessionId;
        val.lastModifiedBy = 0;
        let response = await fsuTargetDraftServices.addFsuTargetAchievements(
          val
        );
        setfsuTargetAchievementId(response);
        setSurveyDetailsList({
          ...surveyDetailsList,
          fsuTargetAchievementId: response,
        });
        setUserDetailsList({ ...userDetailsList, id: response });
        handleNext();
      }
      // else {
      //   let response;
      //   val.facilityId = val.facilityId == 0 ? "0" : val.facilityId;
      //   val.noOfVillagesOrTowns = val.noOfVillagesOrTowns ? val.noOfVillagesOrTowns : "0";
      //   if (location && location.state && location.state.id) {
      //     val.lastModifiedBy = props && props.userSessionId;
      //     response = await FusTarget.updateFusTarget(val, location.state.id);
      //     setSurveyDetailsList({ ...surveyDetailsList, fsuTargetAchievementId: location.state.id });
      //     handleNext();
      //   } else {
      //     val.createdBy = props && props.userSessionId;
      //     val.lastModifiedBy = 0;
      //     response = await FusTarget.postFusTarget(val);
      //     setSurveyDetailsList({ ...surveyDetailsList, fsuTargetAchievementId: response.data.id });
      //     setUserDetailsList({...userDetailsList, id: response.data.id})
      //     console.log("userDetailsList",userDetailsList)
      //     handleNext();
      //   }
      // }
    },

    enableReinitialize: true,
    validationSchema: validationSchema,
  });

  const surveyFormik: any = useFormik({
    initialValues: surveyDetailsList,
    onSubmit: async (val: any, errors: any) => {
      //       if(errors){
      // alert(errors);
      //       }
      val.targetedPopulation = val.targetedPopulation
        ? val.targetedPopulation
        : 0;
      val.surveyedPopulation = val.surveyedPopulation
        ? val.surveyedPopulation
        : 0;
      val.noOfBSCollected = val.noOfBSCollected ? val.noOfBSCollected : 0;
      val.noOfBSExamined = val.noOfBSExamined ? val.noOfBSExamined : 0;
      val.noOfMFPositiveCases = val.noOfMFPositiveCases
        ? val.noOfMFPositiveCases
        : 0;
      if (location && location.state && location.state.view) {
        Back();
      } else if (location && location.state && location.state.id) {
        if (location && location.state && location.state.id) {
          val.id = surveyDetailsList.id;
          val.fsuTargetAchievementId = location.state.id;
        } else {
          val.fsuTargetAchievementId = surveyDetailsList.fsuTargetAchievementId;
        }
        if (val.id === 0) {
          val.createdBy = props && props.userSessionId;
          val.lastModifiedBy = 0;
        } else {
          val.lastModifiedBy = props && props.userSessionId;
        }
        const response = await FusTarget.postFsuSurveyDetails(val);
        if (response) {
          Back();
          getAllSurveyDetails();
        }
      } else if (location && location.state && location.state.UUID) {
        val.fsuTargetAchievementId = location.state.UUID;
        if (val.fsuTargetAchievementsSurveysUUID) {
          var id = val.fsuTargetAchievementsSurveysUUID;
          val.lastModifiedBy = props && props.userSessionId;
          var response =
            await fsuTargetDraftServices.updateFsuTargetAchievementsSurveys(
              id,
              val
            );
          Back();
          getAllSurveyDetails();
        } else {
          val.createdBy = props && props.userSessionId;
          val.lastModifiedBy = 0;
          let response =
            await fsuTargetDraftServices.addFsuTargetAchievementsSurveys(val);
          Back();
          getAllSurveyDetails();
        }
      } else {
        val.fsuTargetAchievementId = fsuTargetAchievementId;
        if (val.fsuTargetAchievementsSurveysUUID) {
          var id = val.fsuTargetAchievementsSurveysUUID;
          val.lastModifiedBy = props && props.userSessionId;
          var response =
            await fsuTargetDraftServices.updateFsuTargetAchievementsSurveys(
              id,
              val
            );
          Back();
          getAllSurveyDetails();
        } else {
          val.createdBy = props && props.userSessionId;
          val.lastModifiedBy = 0;
          let response =
            await fsuTargetDraftServices.addFsuTargetAchievementsSurveys(val);
          console.log(response);
          Back();
          getAllSurveyDetails();
        }
      }

      // else {
      //   val.targetedPopulation = val.targetedPopulation ? val.targetedPopulation : "0";
      //   val.surveyedPopulation = val.surveyedPopulation ? val.surveyedPopulation : "0";
      //   val.noOfBSCollected = val.noOfBSCollected ? val.noOfBSCollected : "0";
      //   val.noOfBSExamined = val.noOfBSExamined ? val.noOfBSExamined : "0";
      //   val.noOfMFPositiveCases = val.noOfMFPositiveCases ? val.noOfMFPositiveCases : "0";

      //   if (location && location.state && location.state.id) {
      //     val.id = surveyDetailsList.id;
      //     val.fsuTargetAchievementId = location.state.id;
      //   } else {
      //     val.fsuTargetAchievementId = surveyDetailsList.fsuTargetAchievementId;
      //   }
      //   if(val.id === 0){
      //     val.createdBy = props && props.userSessionId;
      //     val.lastModifiedBy = 0;
      //   } else {
      //     val.lastModifiedBy = props && props.userSessionId;
      //   }
      //   const response = await FusTarget.postFsuSurveyDetails(val);
      //   if (response) {
      //     Back();
      //     getAllSurveyDetails();
      //   }
      // }
    },
    validationSchema: validate,
    enableReinitialize: true,
  });
  async function loadFsuData(e:any){
    var fsu = await DropdownService.getDistrictByFSU(e);
    if(fsu.data.length==1){
      setdistrictIdValuesDisplay(modifyData(districtValues))
      unitFormik.setFieldValue('districtId', fsu.data[0].id);
    }else{
     setdistrictIdValuesDisplay(modifyData(fsu.data))
    }
    console.log(fsu,"<--fsu district list")
  }
  const ExpandedComponent = (row) => {
    return <AccordionFusTargetSurvey rowValues={row} />;
  };
  const columns1 = [
    {
      name: 'Sr.No',
      selector: (row: any) =>
        row.fsuTargetAchivement && row.fsuTargetAchivement.srNo
          ? row.fsuTargetAchivement.srNo
          : '',
    },
    {
      name: 'Village/Town',
      selector: 'namesOfVillagesOrTowns',
    },
    {
      name: 'Targeted Population',
      selector: 'targetedPopulation',
    },
    {
      name: 'Surveyed Population',
      selector: 'surveyedPopulation',
    },
    {
      name: 'No. Of BS Collected',
      selector: 'noOfBSCollected',
    },
    {
      name: 'No. Of BS Examined',
      selector: 'noOfBSExamined',
    },
    {
      name: 'No. Of MF Positive Cases',
      selector: 'noOfMFPositiveCases',
    },
    {
      name: 'Date Of Submission',
      selector: (row: any) => <div>{moment(row.createdAt).format('L')}</div>,
    },
    {
      name: 'Last Modified',
      selector: (row: any) => <div>{moment(row.updatedAt).format('L')}</div>,
    },
    {
      name: 'Action',
      selector: 'Actions',
      cell: (row) => (
        <div data-tag='allowRowEvents'>
          {location && location.state && location.state.view && (
            <button
              className='btn'
              onClick={() => {
                hideSurveyForm(row);
              }}
            >
              <img src={viewIcon} />
            </button>
          )}
          {location && location.state && location.state.view ? (
            ''
          ) : (
            <>
              <button
                className='btn'
                onClick={() => {
                  hideSurveyForm(row);
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
  ];

  const hideSurveyForm = (row: any) => {
    setHide(false);
    setSurveyDetailsList({ surveyDetailsList, ...row });
  };

  const hideSurvey = (row: any) => {
    surveyFormik.resetForm({ values: surveyInitialDetailsList });
    console.log('value', surveyDetailsList);
    setHide(false);
  };

  //Finish and Save Button Function
  async function finishSave() {
    if (
      (location && location.state && location.state.id) ||
      (location && location.state && location.state.view)
    ) {
      moveListPage();
    } else {
      let fsuTargetTable: any = {};
      if (fsuTargetAchievementId) {
        let step1Response =
          await fsuTargetDraftServices.getOneFsuTargetAchievements(
            fsuTargetAchievementId
          );
        fsuTargetTable = step1Response;
        let step2list =
          await fsuTargetDraftServices.getListFsuTargetAchievementsSurveys(
            fsuTargetAchievementId
          );
        if (step2list && step2list.length > 0) {
          step2list.map((Obj) => {
            Obj.fsuTargetAchievementId = 0;
          });
        }
        setIsDisabled(true);
        fsuTargetTable.fsuTargetAchievementsSurveys = step2list;
        let createAPIResponse = await FusTarget.postFusTarget(fsuTargetTable);
        setIsDisabled(false);
        if (createAPIResponse.status === 200) {
          moveListPage();
          let response =
            await fsuTargetDraftServices.deleteFsuTargetAchievements(
              fsuTargetAchievementId
            );
          if (response) {
            let step2delete =
              await fsuTargetDraftServices.deleteGetListFsuTargetAchievementsSurveys(
                fsuTargetAchievementId
              );
            setIsDisabled(false);
            // if(step2delete){
            // }
          }
        }
      }
    }
  }

  async function getAllSurveyDetails() {
    if (location.state && location.state.id) {
      const response = await FusTarget.getOneFusTargetStepper(
        location.state.id
      );
      if (response) {
        console.log('getAllSurveyDetails:: ', response.data);
        setsurveyDetails(response.data);
      }
    } else if (location.state && location.state.UUID) {
      let response =
        await fsuTargetDraftServices.getListFsuTargetAchievementsSurveys(
          location.state.UUID
        );
      if (response) {
        setsurveyDetails(response);
      }
    } else {
      if (fsuTargetAchievementId) {
        var id = fsuTargetAchievementId;
        const response =
          await fsuTargetDraftServices.getListFsuTargetAchievementsSurveys(id);
        if (response) {
          console.log('getAllSurveyDetails:: ', response);
          setsurveyDetails(response);
        }
      }
    }
  }

  async function getUnitInfo() {
    let valueId;
    if (location.state && location.state.id) {
      if (location.state && location.state.id) {
        valueId = location.state.id;
      } else if (userDetailsList.id) {
        valueId = userDetailsList.id;
      }
      const response = await FusTarget.getOneFusTarget(valueId);
      if (response && response.data) {
        console.log('getUnitInfo:: ', response.data);
        getDistrictValues(response.data[0].districtId);
        setUserDetailsList(response.data[0]);
      }
      console.log(userDetailsList);
    } else if (location.state && location.state.UUID) {
      valueId = location.state.UUID;
      let response = await fsuTargetDraftServices.getOneFsuTargetAchievements(
        valueId
      );
      if (response) {
        getDistrictValues(response.districtId);
        setUserDetailsList(response);
      }
    } else {
      if (fsuTargetAchievementId) {
        valueId = fsuTargetAchievementId;
        let response = await fsuTargetDraftServices.getOneFsuTargetAchievements(
          valueId
        );
        if (response) {
          getDistrictValues(response.districtId);
          setUserDetailsList(response);
        }
      }
    }
  }

  async function deleteSurveyDeatails(Obj: any) {
    if (location && location.state && location.state.id) {
      const response = await FusTarget.deleteFusTargetStepper(Obj.id);
      if (response.message == 'Deleted successfully') {
        getAllSurveyDetails();
        console.log('Delete News', response);
      }
    } else {
      if (Obj && Obj.fsuTargetAchievementsSurveysUUID) {
        const response =
          await fsuTargetDraftServices.deleteFsuTargetAchievementsSurveys(
            Obj.fsuTargetAchievementsSurveysUUID
          );
        if (response) {
          getAllSurveyDetails();
          console.log('Delete News', response);
        }
      }
    }
  }

  const Delete = (event: any, Obj: any) => {
    confirmAlert({
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deleteSurveyDeatails(Obj);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };
  function moveListPage() {
    history.push(listDESheetName);
    toast.success('Form Submitted Successfully', {
      position: toast.POSITION.TOP_CENTER,
    });
  }
  function ColorlibStepIcon(props: StepIconProps) {
    const classes = useColorlibStepIconStylesnew();
    const { active, completed } = props;

    const icons: { [index: string]: React.ReactElement } = {
      1: (
        <div className='step-iconnew plan-iconnew'>
          <DescriptionIcon />
        </div>
      ),
      2: (
        <div className='step-iconnew person-iconnew'>
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

  const handleNext = () => {
    if (
      unitFormik.values.districtId &&
      unitFormik.values.facilityId &&
      unitFormik.values.month &&
      unitFormik.values.year &&
      activeStep === 0
    ) {
      isStep1Valid(true);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    getAllSurveyDetails();
    getUnitInfo();
  };

  const handleBack = () => {
    //setHide(false)
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    getUnitInfo();
  };
  const handleStep = (step: number) => () => {
    if (step1Valid || location.state) setActiveStep(step);
    setHide(true);
    getAllSurveyDetails();
    getUnitInfo();
  };
  const Back = () => {
    setHide(true);
  };

  const showToast = (e) => {
    if (e.target.id == 'Submitbtnid') {
      unitFormik.validateForm().then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error('Please Enter Required Fields', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
    } else if (e.target.id == 'Submitbtnid2') {
      surveyFormik.validateForm().then((errors) => {
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
          className='font-chng'
        >
          Data Entry
        </Breadcrumb.Item>
        <Breadcrumb.Item
          onClick={() => {
            history.push('/fus-targets');
          }}
          className='font-chng'
        >
          FSU Target & Achievement
        </Breadcrumb.Item>
        {location.state && location.state.view ? (
          <Breadcrumb.Item active>View</Breadcrumb.Item>
        ) : (location && location.state && location.state.id) ||
          (location && location.state && location.state.UUID) ? (
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
            <h4 className='font-chng'>Unit Info</h4>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel
            onClick={handleStep(1)}
            StepIconComponent={ColorlibStepIcon}
          >
            <h5 className='font-chng'>Step 2</h5>
            <h4 className='font-chng'>Survey Details</h4>
          </StepLabel>
        </Step>
      </Stepper>
      {activeStep === 0 ? (
        <form
          onClick={showToast}
          onSubmit={unitFormik.handleSubmit}
          onChange={unitFormik.handleChange}
        >
          <div className='card'>
            <h4 className='formtitlenew font-chng'>Unit Details</h4>
            <div className='card-body'>
              <fieldset
                disabled={location.state && location.state.view ? true : false}
              >
                <Row className='mb-3'>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='email' className='form-label font-chng'>
                        Name of Filaria Survey unit*
                      </label>
                      <Select
                        name='nameOfFilariaSurveyUnit'
                        className={
                          unitFormik.errors.nameOfFilariaSurveyUnit &&
                          unitFormik.touched.nameOfFilariaSurveyUnit
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        styles={commonFunction.customStyles}
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        isClearable={true}
                        options={surveyList}
                        onChange={(option: Option) => {
                          unitFormik.setFieldValue('districtId','')
                          unitFormik.setFieldValue(
                            'nameOfFilariaSurveyUnit',
                            option && option.value
                          );
                          loadFsuData(option.value);
                          
                        }}
                        value={
                          surveyList
                            ? surveyList.find(
                                (option: any) =>
                                  option &&
                                  option.value ===
                                    unitFormik.values.nameOfFilariaSurveyUnit
                              )
                            : ''
                        }
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {unitFormik.errors.nameOfFilariaSurveyUnit
                          ? unitFormik.errors.nameOfFilariaSurveyUnit
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='email' className='form-label font-chng'>
                        Year*
                      </label>
                      <Select
                        className={
                          unitFormik.errors.year && unitFormik.touched.year
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        styles={commonFunction.customStyles}
                        name='year'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        isClearable={true}
                        options={yearList}
                        onChange={(option: Option) => {
                          unitFormik.setFieldValue(
                            'year',
                            option && option.value
                          );
                        }}
                        value={
                          yearList
                            ? yearList.find(
                                (option: any) =>
                                  option.value === unitFormik.values.year
                              )
                            : ''
                        }
                      ></Select>
                      <div className={'invalid-feedback'}>
                        {unitFormik.errors.year ? unitFormik.errors.year : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='email' className='form-label font-chng'>
                        Month*
                      </label>
                      <Select
                        className={
                          unitFormik.errors.month && unitFormik.touched.month
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        styles={commonFunction.customStyles}
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        isClearable={true}
                        options={monthList}
                        name='month'
                        onChange={(option: Option) => {
                          unitFormik.setFieldValue(
                            'month',
                            option && option.value
                          );
                        }}
                        value={
                          monthList
                            ? monthList.find(
                                (option: any) =>
                                  option &&
                                  option.value === unitFormik.values.month
                              )
                            : ''
                        }
                      ></Select>

                      <div className={'invalid-feedback'}>
                        {unitFormik.errors.month ? unitFormik.errors.month : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='email' className='form-label font-chng'>
                        District*
                      </label>
                      {districtValues && districtValues.length !== 0 ? (
                        <Select
                          name='districtId'
                          isClearable={true}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          className={
                            unitFormik.errors.districtId &&
                            unitFormik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          styles={commonFunction.customStyles}
                          options={districtIdValuesDisplay}
                          value={
                            districtList
                              ? districtList.find(
                                  (option) =>
                                    option.value ===
                                    unitFormik.values.districtId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            unitFormik.setFieldValue(
                              'districtId',
                              option && option.value
                            );
                            getDistrict(option);
                          }}
                        ></Select>
                      ) : (
                        <Select
                          name='districtId'
                          className={
                            unitFormik.errors.districtId &&
                            unitFormik.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          styles={commonFunction.customStyles}
                          options={NoneList}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          isClearable={true}
                          value={
                            districtList
                              ? districtList.find(
                                  (option) =>
                                    option.value ===
                                    unitFormik.values.districtId
                                )
                              : ''
                          }
                          onChange={(option: Option) => {
                            unitFormik.setFieldValue(
                              'districtId',
                              option && option.value
                            );
                            getDistrict(option);
                          }}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {unitFormik.errors.districtId
                          ? unitFormik.errors.districtId
                          : ''}
                      </div>
                    </div>
                  </div>

                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='email' className='form-label font-chng'>
                        Facility*
                      </label>
                      {facilityValues && facilityValues.length !== 0 ? (
                        <Select
                          name='facilityId'
                          isClearable={true}
                          ref={selectFacilityRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          className={
                            unitFormik.errors.facilityId &&
                            unitFormik.touched.facilityId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          styles={commonFunction.customStyles}
                          onChange={(option: Option) => {
                            unitFormik.setFieldValue(
                              'facilityId',
                              option && option.value
                            );
                          }}
                          value={
                            facilityList
                              ? facilityList.find(
                                  (option) =>
                                    option.value ===
                                    unitFormik.values.facilityId
                                )
                              : ''
                          }
                          options={facilityList}
                        ></Select>
                      ) : (
                        <Select
                          name='facilityId'
                          isClearable={true}
                          ref={selectFacilityRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          className={
                            unitFormik.errors.facilityId &&
                            unitFormik.touched.facilityId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          styles={commonFunction.customStyles}
                          onChange={(option: Option) => {
                            unitFormik.setFieldValue(
                              'facilityId',
                              option && option.value
                            );
                          }}
                          value={
                            facilityList
                              ? facilityList.find(
                                  (option) =>
                                    option.value ===
                                    unitFormik.values.facilityId
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                        ></Select>
                      )}
                      <div className={'invalid-feedback'}>
                        {unitFormik.errors.facilityId
                          ? unitFormik.errors.facilityId
                          : ''}
                      </div>
                    </div>
                  </div>
                  <div className='col-md-6 col-xl-3  col-12'>
                    <div className='form-grp'>
                      <label htmlFor='email' className='form-label font-chng'>
                        No of Villages or Towns
                      </label>
                      <input
                        name='noOfVillagesOrTowns'
                        type='number'
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        className='form-control'
                        onChange={unitFormik.handleChange}
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        value={unitFormik.values.noOfVillagesOrTowns}
                      ></input>
                    </div>
                  </div>
                </Row>
              </fieldset>

              {/* <div className="form-grp text-right">
                <button
                  type="submit"
                  className="btn btn-outline-light font-chng"
                  onClick={() => history.push(listDESheetName)}
                >Cancel
                </button>
                <button id="Submitbtnid" type="submit" className="btn btn-secondary font-chng">
                  Next
                </button>
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
            <button
              type='submit'
              id='Submitbtnid'
              className='btn font-chng'
              style={{
                backgroundColor: '#34c38f',
                border: '0px',
                color: ' #ffffff',
                textTransform: 'none',
              }}
            >
              Next
            </button>
          </div>
        </form>
      ) : (
        <div>
          {hide ? (
            <div className='card'>
              <div className='row'>
                <div className='col-md-9 col-xl-9 col-12'>
                  <h4 className='formtitlenew font-chng'>Survey Details</h4>
                </div>
                <div className='col-md-3 col-xl-3 col-12 d-flex flex-row-reverse'>
                  <Button
                    variant='secondary'
                    className={
                      location && location.state && location.state.view
                        ? 'd-none'
                        : 'mt-m font-chng mr10'
                    }
                    onClick={hideSurvey}
                  >
                    <img src={plusImg} className='pe-2' />
                    Add New
                  </Button>
                </div>
              </div>
              <div className='post-tablenew font-chng'>
                <DataTable
                  columns={columns1}
                  data={surveyDetails}
                  //expandOnRowClicked={true}
                  expandableRows={true}
                  onRowExpandToggled={(expand, row) => {
                    console.log(expand);
                    console.log(row);
                  }}
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
                {((location.state && !location.state.view) || (!location.state)) && (!(location.state && location.state.id)) &&
                  <button type="submit" className="mt-m btn btn-secondary btn-pad font-chng"
                    onClick={() => moveListPage()}
                    style={{ marginRight: 15 }}
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

              {/* ======= */}
              <div className='buttongrouprightend mb-4'>
                <Button
                  type='submit'
                  onClick={handleBack}
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                >
                  Back{' '}
                </Button>
                {((location.state && !location.state.view) ||
                  !location.state) &&
                  !(location.state && location.state.id) && (
                    <button
                      type='submit'
                      onClick={() => moveListPage()}
                      className='btn font-chng'
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
                    type='button'
                    onClick={() => finishSave()}
                    disabled={isDisabled}
                    className='btn font-chng'
                    style={{
                      marginRight: '10px',
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
            </div>
          ) : (
            <div>
              <form
                onClick={showToast}
                onSubmit={surveyFormik.handleSubmit}
                onChange={surveyFormik.handleChange}
              >
                <div className='card'>
                  <fieldset
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  >
                    <Row className='mb-3 m-3'>
                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='namesOfVillagesOrTowns'
                            className='form-label font-chng'
                          >
                            Name of Villages or Towns*
                          </label>
                          <input
                            name='namesOfVillagesOrTowns'
                            type='text'
                            onInput={(event) =>
                              commonFunction.onlyAlphabets(event)
                            }
                            className={
                              surveyFormik.errors.namesOfVillagesOrTowns &&
                              surveyFormik.touched.namesOfVillagesOrTowns
                                ? 'form-control is-invalid'
                                : 'form-control'
                            }
                            value={
                              surveyFormik.values.namesOfVillagesOrTowns
                                ? surveyFormik.values.namesOfVillagesOrTowns
                                : ''
                            }
                            onKeyPress={(e) => commonFunction.keyPress(e)}
                          ></input>
                          <div className={'invalid-feedback'}>
                            {surveyFormik.errors.namesOfVillagesOrTowns
                              ? surveyFormik.errors.namesOfVillagesOrTowns
                              : ''}
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='targetedPopulation'
                            className='form-label font-chng'
                          >
                            Targeted Population
                          </label>
                          <input
                            name='targetedPopulation'
                            className={
                              surveyFormik.errors.targetedPopulation &&
                              surveyFormik.touched.targetedPopulation
                                ? 'form-control is-invalid'
                                : 'form-control'
                            }
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            value={surveyFormik.values.targetedPopulation}
                          ></input>
                          <div className={'invalid-feedback'}>
                            {surveyFormik.errors.targetedPopulation
                              ? surveyFormik.errors.targetedPopulation
                              : ''}
                          </div>
                        </div>
                      </div>

                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='surveyedPopulation'
                            className='form-label font-chng'
                          >
                            Surveyed Population
                          </label>
                          <input
                            name='surveyedPopulation'
                            className={
                              surveyFormik.errors.surveyedPopulation &&
                              surveyFormik.touched.surveyedPopulation
                                ? 'form-control is-invalid'
                                : 'form-control'
                            }
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            value={surveyFormik.values.surveyedPopulation}
                          ></input>
                          <div className={'invalid-feedback'}>
                            {surveyFormik.errors
                              ? surveyFormik.errors.surveyedPopulation
                              : ''}
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='noOfBSCollected'
                            className='form-label font-chng'
                          >
                            No of B.S. Collected
                          </label>
                          <input
                            name='noOfBSCollected'
                            className='form-control'
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            value={surveyFormik.values.noOfBSCollected}
                          ></input>
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='noOfBSExamined'
                            className='form-label font-chng'
                          >
                            No of B.S. Examined
                          </label>
                          <input
                            name='noOfBSExamined'
                            className={
                              surveyFormik.errors.noOfBSExamined &&
                              surveyFormik.touched.noOfBSExamined
                                ? 'form-control is-invalid'
                                : 'form-control'
                            }
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            value={surveyFormik.values.noOfBSExamined}
                          ></input>
                          <div className={'invalid-feedback'}>
                            {surveyFormik.errors
                              ? surveyFormik.errors.noOfBSExamined
                              : ''}
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='noOfMFPositiveCases'
                            className='form-label font-chng'
                          >
                            No of MF positive case
                          </label>
                          <input
                            name='noOfMFPositiveCases'
                            className='form-control'
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            value={surveyFormik.values.noOfMFPositiveCases}
                          ></input>
                        </div>
                      </div>
                    </Row>
                  </fieldset>
                  {/* <div className="form-grp text-right ">
                    <button
                      type="submit"
                      className="btn btn-outline-light font-chng"
                      onClick={Back}
                    >
                      <i className="fas fa-arrow-left"></i>Back
                    </button>
                    {location && location.state && location.state.view ? "" :
                      <button id="Submitbtnid2" type="submit" className="btn btn-secondary font-chng">
                        Submit
                      </button>}
                  </div> */}
                </div>
                <div className='buttongrouprightend mb-4'>
                  <Button
                    type='submit'
                    onClick={Back}
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#34c38f',
                      border: '0px',
                      color: ' #ffffff',
                      textTransform: 'none',
                    }}
                  >
                    Back{' '}
                  </Button>
                  {location && location.state && location.state.view ? (
                    ''
                  ) : (
                    <button
                      type='submit'
                      id='Submitbtnid2'
                      className='btn font-chng'
                      style={{
                        backgroundColor: '#34c38f',
                        border: '0px',
                        color: ' #ffffff',
                        textTransform: 'none',
                      }}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default AddFsuTarget;
