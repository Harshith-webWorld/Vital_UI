import React, { useState, useEffect, useRef } from 'react';
import {
  Formik,
  Field,
  Form,
  useFormik,
  FormikProvider,
  FieldArray,
} from 'formik';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
//import { ToastContainer } from 'react-toastify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Container } from 'react-bootstrap';
import DropdownService from '../../../services/DropdownService';
import { useLocation } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import StaffPositionService from '../../../services/FormStaffPosition';
import {
  WebsiteStaffPosition,
  WebsiteStaffPositionTraining,
} from '../../../interfaces/FormStaffPositionInterface';
// import deleteIcon from "../../../assets/img/LEFP_Images/delete_icon.png";
import delectIconForArray from '../../../assets/img/LEFP_Images/deletesection.png';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import history from '../../../../helpers/history';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import StepConnector from '@material-ui/core/StepConnector';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import DescriptionIcon from '@material-ui/icons/Description';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import { StepIconProps } from '@material-ui/core/StepIcon';
import clsx from 'clsx';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import deleteImg from '../../../assets/img/Trash.png';
import Select, { Option } from 'react-select';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import moment from 'moment';
import commonFunction from '../../../../helpers/common/common';
import AccordionVerticalStaffPostion from './accordionVerticalUnit';
//offline
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import staffPositionDraftServices from '../../../draftServices/FormStaffPositionDraftServices';

const AddStaffPosition: React.FC<any> = (props) => {
  useEffect(() => {
    getDropDown();
    getOneStaff();
    listStaffPositionTraining();
    getState(defaultStateValue[0]);
  }, []);

  const location = useLocation<any>();
  const listDESheetName: any = props && props.listDESheetName;
  let isOnline = window.navigator.onLine;

  let [districtValues, setdistrictIdValues] = useState([]);
  let [stateValues, setStateValues] = useState([]);
  let [designationValues, setDesignationValues] = useState([]);
  let [unitAction, setUnitOfAction] = useState([]);
  let Location: any = useLocation();
  let [showDesignation, setShowDesignation] = useState(false);
  let [showCadre, setShowCadre] = useState(false);
  let [nameOfUnitValues, setNameOfUnitValues] = useState([]);
  const [stateId, setstateId] = useState();
  const [districtId, setdistrictId] = useState();
  const [isDisabled, setIsDisabled] = useState(false);

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
  let selectCorporationRef: any = useRef();
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);

  let nameOfUnitId = ['Subunit', 'Night Clinic', 'FSUc', 'RCTC', 'Corporation'];
  let NoneList = [{ label: 'None', value: 0 }];
  let defaultStateValue = [{ label: 'Maharastra', value: 14 }];

  const [traininglist, setTraininglist] = useState<any>([]);
  const [saveUUID, setsaveUUID] = React.useState(undefined);
  let [staffPositionId, setStaffPositionId] = useState('');
  const [activeStep, setActiveStep] = React.useState(0);
  const [step2Valid, isStep2Valid] = React.useState(false);
  let [districtIdValuesDisplay, setdistrictIdValuesDisplay] = useState([]);
  const [hide, setHide] = useState(true);
  const steps = getSteps();
  let selectDistrictRef: any = useRef();

  const prevStateRef: any = React.useRef();
  const prevDistrictRef: any = React.useRef();
  useEffect(() => {
    prevStateRef.current = stateId;
    prevDistrictRef.current = districtId;
  });
  const prevStateIdValue = prevStateRef.current;
  const prevDistrictIdValue = prevDistrictRef.current;
  let selectNameOfUnitRef: any = React.useRef();

  const staffPosVerticalUnitTrainingStatuses = {
    staffPosVerticalUnitId: 0,
    staffPosVerticalUnitStaffId: 0,
    typeOfTraining: '',
    placeOfTraining: '',
    dateOfTraining: currentdate,
    isTrained: 'false',
  };
  const staffPosVerticalUnitTrainingStatusesInitial = {
    staffPosVerticalUnitId: 0,
    staffPosVerticalUnitStaffId: 0,
    typeOfTraining: '',
    placeOfTraining: '',
    dateOfTraining: currentdate,
    isTrained: 'false',
  };
  const ExpandedComponent = (row) => {
    return <AccordionVerticalStaffPostion rowValues={row} />;
  };

  const [trainingStatus, setTrainingStatus] =
    useState<WebsiteStaffPositionTraining>({
      id: 0,
      staffPosVerticalUnitId: 0,
      nameOfStaff: '',
      designationId: 0,
      designationOther: '',
      staffPosVerticalUnitTrainingStatuses: [
        staffPosVerticalUnitTrainingStatuses,
      ],
    });

  const [trainingStatusInitial, setTrainingStatusInitial] =
    useState<WebsiteStaffPositionTraining>({
      id: 0,
      staffPosVerticalUnitId: 0,
      nameOfStaff: '',
      designationId: 0,
      designationOther: '',
      staffPosVerticalUnitTrainingStatuses: [
        staffPosVerticalUnitTrainingStatusesInitial,
      ],
    });

  const [formData, setFormData] = useState<WebsiteStaffPosition>({
    year: '',
    month: '',
    stateId: 14,
    districtId: 0,
    typeOfUnit: '',
    nameOfUnit: '',
    cadre: 0,
    cadreOther: 0,
    sanctioned: '',
    filled: '',
    vacant: '',
    id: 0,
  });

  const changeDesignation = (e) => {
    if (e && e.value === 'Others') {
      setShowDesignation(true);
    } else {
      setShowDesignation(false);
    }
  };

  const changeCadre = (e) => {
    if (e && e.label === 'Other-Specify') {
      setShowCadre(true);
    } else {
      setShowCadre(false);
    }
  };

  async function getStaffPositionTraining() {
    let staffTraningList: any;
    let response;
    if (Location.state && Location.state.id) {
      staffTraningList = Location.state.id;
      response = await StaffPositionService.getStaffPostionTraining(
        staffTraningList
      );
      setTraininglist(response.data);
    } else if (Location.state && Location.state.staffPosUnitStatusUUID) {
      staffTraningList = Location.state.staffPosUnitStatusUUID;
      console.log('get list StaffPositionTraining', staffTraningList);
      response = await staffPositionDraftServices.getListStaffPosTraningStatus(
        staffTraningList
      );
      setTraininglist(response);
    } else {
      staffTraningList = staffPositionId;
      response = await staffPositionDraftServices.getListStaffPosTraningStatus(
        staffTraningList
      );
      setTraininglist(response);
    }
  }

  async function deletetrainingstatus(row) {
    if (row.id) {
      const response = await StaffPositionService.deleteStaffPositionTraining(
        row.id
      );
    }
  }

  async function filterdistrict(e: any) {
    let nameOfdistrictData: any;
    nameOfdistrictData = await DropdownService.getDistrictByVCU(e);
    console.log(nameOfdistrictData, 'trst');
    formik.setFieldValue('districtId', nameOfdistrictData.data.districtId);
    console.log(formik.values.typeOfUnit, 'testt');
  }

  async function listStaffPositionTraining() {
    let staffTraningList: any;
    let response;
    if (Location.state && Location.state.id) {
      response = await StaffPositionService.listStaffPostionTraining(
        Location.state.id
      );
      setTraininglist(response.data);
      console.log('id list', response);
    } else if (
      location &&
      location.state &&
      location.state.staffPosUnitStatusUUID
    ) {
      let response =
        await staffPositionDraftServices.getListStaffPosTraningStatus(
          location.state.staffPosUnitStatusUUID
        );
      setTraininglist(response);
      console.log('uuid list', response);
    } else {
      staffTraningList = staffPositionId;
      response = await staffPositionDraftServices.getListStaffPosTraningStatus(
        staffTraningList
      );
      console.log('list', staffTraningList);
      setTraininglist(response);
    }
  }

  const getOneStaffTraining = async (row) => {
    row.staffPosVerticalUnitTrainingStatuses.forEach((element) => {
      element.isTrained = element.isTrained.toString();
    });
    setTrainingStatus(row);
  };

  const getOneStaff = async () => {
    let typeOfUnitValues = await getDropDown();
    let recordId;
    if (Location.state && Location.state.id) {
      if (Location.state && Location.state.id) {
        recordId = Location.state.id;
      } else {
        recordId = formData.id;
      }
      if (recordId) {
        const items: any = await StaffPositionService.getOneStaffPOstion(
          recordId
        );
        getStateValues(items.data[0].stateId);
        if (typeOfUnitValues) {
          filterNameOfUnit(items.data[0].typeOfUnit, typeOfUnitValues);
        }
        setFormData(items.data[0]);
      }
    } else if (Location.state && Location.state.staffPosUnitStatusUUID) {
      if (Location.state && Location.state.staffPosUnitStatusUUID) {
        recordId = Location.state.staffPosUnitStatusUUID;
        setsaveUUID(recordId);
        if (recordId) {
          const items: any =
            await staffPositionDraftServices.getOneStaffPosUnitStatus(recordId);
          getStateValues(items.stateId);
          if (typeOfUnitValues) {
            filterNameOfUnit(items.typeOfUnit, typeOfUnitValues);
          }
          setFormData(items);
        }
      }
    }
  };

  async function moveToListPage() {
    if (location && location.state && location.state.view) {
      history.push(listDESheetName);
    } else {
      history.push(listDESheetName);
      toast.success('Form Submitted Successfully', {
        position: toast.POSITION.TOP_CENTER,
        className: 'toast-message',
      });
    }
  }

  let staffPosTable: any;

  async function finishSave() {
    if (
      (location && location.state && location.state.id) ||
      (location && location.state && location.state.view)
    ) {
      moveToListPage();
    } else if (saveUUID) {
      console.log('finish UUID', saveUUID);
      let values = await staffPositionDraftServices.getOneStaffPosUnitStatus(
        saveUUID
      );
      staffPosTable = values;
      let staffTrainStatus =
        await staffPositionDraftServices.getListStaffPosTraningStatus(saveUUID);
      if (staffTrainStatus && staffTrainStatus.length > 0) {
        staffTrainStatus.map((Obj: any) => {
          Obj.staffPosVerticalUnitId = 0;
          Obj.staffPosVerticalUnitTrainingStatuses.map((Obj: any) => {
            Obj.staffPosVerticalUnitId = 0;
          });
        });
        staffPosTable.staffPosVerticalUnitStaffs = staffTrainStatus;
      }

      console.log('save DE10 Table Obj', staffPosTable);
      let response = await StaffPositionService.postAllStaffPostion(
        staffPosTable
      );
      if (response.status === 200) {
        moveToListPage();
        let values = await staffPositionDraftServices.deleteStaffPosUnitStatus(
          saveUUID
        );
        console.log(values);
        let response =
          await staffPositionDraftServices.deleteStaffPosTraningStatus(
            saveUUID
          );
        console.log(response);
        moveToListPage();
      }
    }
  }

  async function getState(e: any) {
    setstateId(e && e.value);
    if (!((e && e.value) === prevStateIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('districtId', 0);
      }

      let districtIdOffline: any;
      let districtId: any;
      if (!isOnline) {
        districtIdOffline = await DexieOfflineDataBase.getOneDistrict(
          e && e.value
        );
      } else {
        districtId = await DropdownService.getOneDistrict(e && e.value);
      }
      console.log(districtId, districtIdOffline);

      if (
        (districtId && districtId.data && districtId.data.length > 0) ||
        (districtIdOffline && districtIdOffline.length > 0)
      ) {
        //selectDistrictRef.current.select.clearValue();
        let districtData: any;
        if (!isOnline) {
          districtData = [OptionLabel.districtNone, ...districtIdOffline];
        } else {
          districtData = [OptionLabel.districtNone, ...districtId.data];
        }
        // districtData = [OptionLabel.districtSelectLabel, ...districtData];
        formik.setFieldValue('districtId', '');
        setdistrictIdValues(districtData);
      } else {
        let districtData: any;
        //selectDistrictRef.current.select.clearValue();
        districtData = [OptionLabel.districtNone];
        setdistrictIdValues(districtData);
        formik.setFieldValue('districtId', 0);
      }
      // setdistrictIdValues(districtId.data)
    }
  }
  const modifyData=(data)=>{
    return data.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    })
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
        setdistrictIdValuesDisplay(districtData)
        setdistrictIdValues(districtData);
      } else {
        let districtData: any = [OptionLabel.districtNone];
        setdistrictIdValues(districtData);
        setdistrictIdValuesDisplay(districtData)
        formik.setFieldValue('districtId', 0);
      }
    }
    // setDistrictValues(districtId.data)
  }

  async function getDropDown() {
    //state
    if (isOnline) {
      const State: any = await DropdownService.getStateInfo();
      if (State && State.data) {
        setStateValues(State.data);
      }
      const Designation: any = await DropdownService.getDesignationInfo();

      if (Designation && Designation.data) {
        setDesignationValues(Designation.data);
        console.log('Desig', designationValues);
      }
    } else {
      const stateIdOffline: any = await DexieOfflineDataBase.getStates();
      if (stateIdOffline) {
        setStateValues(stateIdOffline);
      }
      const DesignationOffline: any =
        await DexieOfflineDataBase.getAllDesignationOffline();
      if (DesignationOffline) {
        setDesignationValues(DesignationOffline);
      }
    }

    //unit of action
    if (isOnline) {
      const UnitOfAction: any = await DropdownService.getUnitOfAction();
      if (UnitOfAction && UnitOfAction.data) {
        setUnitOfAction(UnitOfAction.data);
      }
      return UnitOfAction.data;
    } else {
      const UnitOfAction: any = await DexieOfflineDataBase.getCatagoryOption();
      if (UnitOfAction) {
        setUnitOfAction(UnitOfAction);
      }
    }
    
    //Designation
    // if (isOnline) {
    //   const Designation: any = await DropdownService.getDesignationInfo();

    //   if (Designation && Designation.data) {
    //     setDesignationValues(Designation.data);
    //     console.log("Desig",designationValues)
    //   }
    // } else {
    //   const DesignationOffline: any = await DexieOfflineDataBase.getAllDesignationOffline();
    //   if (DesignationOffline) {
    //     setDesignationValues(DesignationOffline);
    //   }
    // }
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

  async function deleteStaffPositionTraining(Obj: any) {
    console.log('id', Obj);
    if (location && location.state && location.state.id) {
      const response = await StaffPositionService.deleteStaffPositionTraining(
        Obj.id
      );
      if (response) {
        getStaffPositionTraining();
      }
    } else {
      console.log('id.staffPositionTraningUUID', Obj.staffPositionTraningUUID);
      const response =
        await staffPositionDraftServices.deleteStaffPosTraningStatus(
          Obj.staffPositionTraningUUID
        );
      if (response) {
        getStaffPositionTraining();
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
            deleteStaffPositionTraining(Obj);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const stateIdList =
    stateValues &&
    stateValues.map((item: any, i: any) => {
      return { label: item.stateName, value: item.id };
    });
  const districtList =
    districtValues &&
    districtValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  const designationList =
    designationValues &&
    designationValues.map((item: any, i: any) => {
      return { label: item.designationName, value: item.id };
    });

  const cadreDropDownData: any = [];
  unitAction &&
    unitAction.map((item: any, i: any) => {
      if (item && item.categoryCode == 1016) {
        cadreDropDownData.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });

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
            console.log('name of unit', nameOfUnitData);
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
              formik.setFieldValue('nameOfUnit', 0);
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
              formik.setFieldValue('nameOfUnit', 0);
            }
          }
        }
      });
  }

  const nameOfUnit =
    nameOfUnitValues &&
    nameOfUnitValues.map((item: any, i: any) => {
      return { label: item.nameOfControlUnit, value: item.id };
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

  const validationSchema = Yup.object().shape({
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
    nameOfUnit: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Required').nullable(),
    }),
    typeOfUnit: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Required').nullable(),
    }),
  });

  const trainingValidation = Yup.object().shape({
    nameOfStaff: Yup.string().required('Required').nullable(),
    designationId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('Designation is required').nullable(),
    }),
  });

  const formik = useFormik({
    initialValues: formData,
    enableReinitialize: true,
    validationSchema: validationSchema,

    onSubmit: async (values: any) => {
      setIsDisabled(true);
      if (Location && Location.state && Location.state.view) {
        handleNext();
      } else {
        values.cadreOther = values.cadreOther ? values.cadreOther : 0;
        values.sanctioned = values.sanctioned ? values.sanctioned : 0;
        values.filled = values.filled ? values.filled : 0;
        values.vacant = values.vacant ? values.vacant : 0;

        if (Location.state && Location.state.id) {
          values.lastModifiedBy = props && props.userSessionId;
          setStaffPositionId(Location.state.id);
          console.log('id', Location.state.id);
          const response = await StaffPositionService.updateStaffPostion(
            values,
            Location.state.id
          );
          setIsDisabled(false);
          if (response) {
            trainingStatus.staffPosVerticalUnitId = response.data.id;
            handleNext();
          }
          handleNext();
          console.log('id ', response);
        } else if (
          location &&
          location.state &&
          location.state.staffPosUnitStatusUUID
        ) {
          setIsDisabled(true);
          values.lastModifiedBy = props && props.userSessionId;
          setsaveUUID(location.state.staffPosUnitStatusUUID);
          setStaffPositionId(Location.state.staffPosUnitStatusUUID);
          console.log('uuid', Location.state.staffPosUnitStatusUUID);
          const response =
            await staffPositionDraftServices.updateStaffPosUnitStatus(
              location.state.staffPosUnitStatusUUID,
              values
            );
          setIsDisabled(false);
          /*   if (response) {
              trainingStatus.staffPosVerticalUnitId = response.staffPosUnitStatusUUID;
              handleNext();
            } */
          console.log('uuid', response);
          handleNext();
        } else {
          values.districtId = values.districtId ? values.districtId : 0;
          let response;

          if (values.staffPosUnitStatusUUID) {
            setIsDisabled(true);
            values.lastModifiedBy = props && props.userSessionId;
            setStaffPositionId(values.staffPosUnitStatusUUID);
            response =
              await staffPositionDraftServices.updateStaffPosUnitStatus(
                values.staffPosUnitStatusUUID,
                values
              );
            setIsDisabled(false);
            console.log(response);
          } else {
            setIsDisabled(true);
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;
            response = await staffPositionDraftServices.addStaffPosUnitStatus(
              values
            );
            setIsDisabled(false);
            setsaveUUID(response);
            setFormData({ ...formData, id: response.staffPosUnitStatusUUID });
          }
          if (response) {
            trainingStatus.staffPosVerticalUnitId =
              response.staffPosUnitStatusUUID;
            handleNext();
          }
          console.log('value uuid', response);
          setStaffPositionId(response);
        }
      }
    },
  });

  const trainingFormik = useFormik({
    initialValues: trainingStatus,
    validationSchema: trainingValidation,
    enableReinitialize: true,
    onSubmit: async (value: any) => {
      if (Location && Location.state && Location.state.view) {
        Back();
      } else {
        let response;
        if (location && location.state && location.state.id) {
          let response;
          value.staffPosVerticalUnitTrainingStatuses.forEach((element) => {
            if (Location && Location.state && Location.state.id) {
              element.staffPosVerticalUnitId = Location.state.id;
            } else {
              element.staffPosVerticalUnitId =
                trainingStatus.staffPosVerticalUnitId;
            }
          });
          if (Location && Location.state && Location.state.id) {
            value.staffPosVerticalUnitId = Location.state.id;
            if (value && value.id) {
              value.lastModifiedBy = props && props.userSessionId;
              value.staffPosVerticalUnitTrainingStatuses.map((val: any) => {
                val.staffPosVerticalUnitId = Location.state.id;
                if (val && val.id) {
                  val.lastModifiedBy = props && props.userSessionId;
                } else {
                  val.createdBy = props && props.userSessionId;
                  val.lastModifiedBy = 0;
                }
              });
              response = await StaffPositionService.updateStaffPostionTraining(
                value
              );
            } else {
              value.createdBy = props && props.userSessionId;
              value.lastModifiedBy = 0;
              value.staffPosVerticalUnitTrainingStatuses.map((val: any) => {
                val.staffPosVerticalUnitId = Location.state.id;
                if (val && val.id) {
                  val.lastModifiedBy = props && props.userSessionId;
                } else {
                  val.createdBy = props && props.userSessionId;
                  val.lastModifiedBy = 0;
                }
              });
              response = await StaffPositionService.postStaffPostionTraining(
                value
              );
            }
          }
          listStaffPositionTraining();
          Back();
        } else if (
          location &&
          location.state &&
          location.state.staffPosUnitStatusUUID
        ) {
          console.log('uuid-edit ', location.state.staffPosUnitStatusUUID);
          let response;
          value.staffPosVerticalUnitTrainingStatuses.forEach((element) => {
            if (
              Location &&
              Location.state &&
              Location.state.staffPosUnitStatusUUID
            ) {
              element.staffPosVerticalUnitId =
                Location.state.staffPosUnitStatusUUID;
            } else {
              element.staffPosVerticalUnitId =
                trainingStatus.staffPosVerticalUnitId;
            }
          });
          console.log(
            'value.staffPositionTraningUUID',
            value.staffPositionTraningUUID
          );
          if (value.staffPositionTraningUUID) {
            value.lastModifiedBy = props && props.userSessionId;
            console.log('uuid update', Location.state.staffPosUnitStatusUUID);
            response =
              await staffPositionDraftServices.updateStaffPosTraningStatus(
                value.staffPositionTraningUUID,
                value
              );
            if (value && value.staffPosUnitStatusUUID) {
              value.lastModifiedBy = props && props.userSessionId;
            } else {
              value.createdBy = props && props.userSessionId;
              value.lastModifiedBy = 0;
            }
            console.log('uuid', response);
            handleNext();
            listStaffPositionTraining();
            Back();
          } else {
            let staffPosVerticalUnitId: any;
            staffPosVerticalUnitId = staffPositionId;
            value.staffPosVerticalUnitId = staffPosVerticalUnitId;
            value.createdBy = props && props.userSessionId;
            value.lastModifiedBy = 0;
            value.staffPosVerticalUnitTrainingStatuses.map((val: any) => {
              val.staffPosVerticalUnitId = staffPosVerticalUnitId;
              if (val && val.id) {
                val.lastModifiedBy = props && props.userSessionId;
              } else {
                val.createdBy = props && props.userSessionId;
                val.lastModifiedBy = 0;
              }
            });
            response =
              await staffPositionDraftServices.addStaffPosTraningStatus(value);
            handleNext();
            console.log('uuid add', response);
            listStaffPositionTraining();
            Back();
          }
        } else {
          if (value.staffPositionTraningUUID) {
            console.log('value', value.staffPositionTraningUUID);
            value.createdBy = props && props.userSessionId;
            value.lastModifiedBy = props && props.userSessionId;
            setStaffPositionId(value.staffPosUnitStatusUUID);
            response =
              await staffPositionDraftServices.updateStaffPosTraningStatus(
                value.staffPositionTraningUUID,
                value
              );
            console.log(response);
          } else {
            let staffPosVerticalUnitId: any;
            staffPosVerticalUnitId = staffPositionId;
            value.staffPosVerticalUnitId = staffPosVerticalUnitId;
            value.createdBy = props && props.userSessionId;
            value.lastModifiedBy = 0;
            value.staffPosVerticalUnitTrainingStatuses.map((val: any) => {
              val.staffPosVerticalUnitId = staffPosVerticalUnitId;
              if (val && val.id) {
                val.lastModifiedBy = props && props.userSessionId;
              } else {
                val.createdBy = props && props.userSessionId;
                val.lastModifiedBy = 0;
              }
            });

            response =
              await staffPositionDraftServices.addStaffPosTraningStatus(value);
          }
          if (response) {
            listStaffPositionTraining();
            Back();
          }
        }
      }
    },
  });

  const handleNext = () => {
    if (
      formik.values.stateId &&
      formik.values.districtId &&
      formik.values.nameOfUnit &&
      activeStep === 0
    ) {
      isStep2Valid(true);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    getOneStaff();
    listStaffPositionTraining();
  };

  const handleBack = () => {
    console.log('backing');
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    getOneStaff();
    listStaffPositionTraining();
  };

  const Back = () => {
    setHide(true);
  };

  const hideTraining = () => {
    //console.log("hideTraining", trainingStatus);
    trainingFormik.resetForm({ values: trainingStatus });
    setHide(false);
  };
  const addNew = () => {
    // console.log("hideTraining", trainingStatusInitial);
    trainingFormik.resetForm({ values: trainingStatusInitial });
    setHide(false);
  };

  const columns1 = [
    // {
    //   name: "Name of Unit ",
    //   selector: (row: any) =>
    //     row.staffPosVerticalUnit &&
    //       row.staffPosVerticalUnit.TypeOfUnit2 &&
    //       row.staffPosVerticalUnit.TypeOfUnit2.categoryOptionName
    //       ? row.staffPosVerticalUnit.TypeOfUnit2.categoryOptionName
    //       : "None",
    // },
    // {
    //   name: "Type Of Unit",
    //   selector: (row: any) =>
    //     row.staffPosVerticalUnit &&
    //       row.staffPosVerticalUnit.verticalControlUnit &&
    //       row.staffPosVerticalUnit.verticalControlUnit.nameOfControlUnit
    //       ? row.staffPosVerticalUnit.verticalControlUnit.nameOfControlUnit
    //       : "None",
    // },

    {
      name: 'Staff Name',
      selector: 'nameOfStaff',
    },
    {
      name: 'Designation',
      selector: (row: any) => {
        if (row.designationId === 0) {
          return 'None';
        } else {
          return designationValues.map((item: any) => {
            if (row.designationId === item.id) {
              return item.designationName;
            }
          });
        }
      },
      /*    row.Designation
             ? row.Designation.designationName
             : "None", */
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
      name: 'Actions',
      selector: 'Actions',
      cell: (row) => (
        <div data-tag='allowRowEvents'>
          {/*  {Location && Location.state && Location.state.id && !location.state.view ? "" :
            <button className="btn"
              onClick={() => {
                hideTraining();
                getOneStaffTraining(row);
              }}>
              <img src={viewIcon} />
            </button>} */}
          {Location && Location.state && Location.state.view ? (
            <button
              className='btn'
              onClick={() => {
                hideTraining();
                getOneStaffTraining(row);
              }}
            >
              <img src={viewIcon} />
            </button>
          ) : (
            <>
              <button
                className='btn'
                onClick={() => {
                  hideTraining();
                  getOneStaffTraining(row);
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

  function getSteps() {
    return ['Select campaign settings', 'Create an ad group'];
  }

  function addField(arrayHelpers) {
    const index =
      arrayHelpers.form.values.staffPosVerticalUnitTrainingStatuses.length;
    console.log(index, 'test');
    if (index == 1) {
      arrayHelpers.push({
        staffPosVerticalUnitId: 0,
        staffPosVerticalUnitStaffId: 0,
        typeOfTraining: '',
        placeOfTraining: '',
        dateOfTraining: currentdate,
        isTrained: 'false',
      });
    }
  }
  function addFielddata(arrayHelpers) {
    const index =
      arrayHelpers.form.values.staffPosVerticalUnitTrainingStatuses.length;
    console.log(index, 'test');

    arrayHelpers.push({
      staffPosVerticalUnitId: 0,
      staffPosVerticalUnitStaffId: 0,
      typeOfTraining: '',
      placeOfTraining: '',
      dateOfTraining: currentdate,
      isTrained: 'false',
    });
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
        <div className='step-iconnew plan-iconnew'>
          <DescriptionIcon />
        </div>
      ),
      2: (
        <div className='step-iconnew truck-iconnew'>
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
    if (step2Valid || Location.state) setActiveStep(step);
    setHide(true);
    getOneStaff();
    listStaffPositionTraining();
  };

  const showToast = (event) => {
    if (event.target.id == 'Submitbtnid2') {
      formik.validateForm().then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error('Please Enter Required Fields', {
            position: toast.POSITION.TOP_CENTER,

            className: 'toast-message',
          });
        }
      });
    } else if (event.target.id == 'Submitbtnid') {
      trainingFormik.validateForm().then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error('Please Enter Required Fields', {
            position: toast.POSITION.TOP_CENTER,
            className: 'toast-message',
          });
        }
      });
    }
  };

  return (
    <FormikProvider value={trainingFormik}>
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
              history.push('/staff-position-vertical-unit');
            }}
            className='font-chng'
          >
            Staff Position Vertical unit{' '}
          </Breadcrumb.Item>
          {isOnline ? (
            <Breadcrumb.Item active>ONLINE</Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item active>OFFLINE</Breadcrumb.Item>
          )}
          {location.state && location.state.view ? (
            <Breadcrumb.Item active>View</Breadcrumb.Item>
          ) : (location.state && location.state.id) ||
            (location.state && location.state.staffPosUnitStatusUUID) ? (
            <Breadcrumb.Item active>Edit</Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item active>Add</Breadcrumb.Item>
          )}
          {activeStep === 0 &&
            (location.state && location.state.view ? (
              <Breadcrumb.Item active>View Planning</Breadcrumb.Item>
            ) : (location.state && location.state.id) ||
              (location.state && location.state.staffPosUnitStatusUUID) ? (
              <Breadcrumb.Item active className='font-chng'>
                Edit Planning
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item active className='font-chng'>
                Add Planning
              </Breadcrumb.Item>
            ))}

          {activeStep === 1 &&
            (location.state && location.state.view ? (
              <Breadcrumb.Item active>View Training</Breadcrumb.Item>
            ) : (location.state && location.state.id) ||
              (location.state && location.state.staffPosUnitStatusUUID) ? (
              <Breadcrumb.Item active className='font-chng'>
                Edit Training
              </Breadcrumb.Item>
            ) : (
              <Breadcrumb.Item active className='font-chng'>
                Add Training
              </Breadcrumb.Item>
            ))}
        </Breadcrumb>

        <div className='card'>
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
                <h4 className='font-chng'>Planning</h4>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel
                onClick={handleStep(1)}
                StepIconComponent={ColorlibStepIcon}
              >
                <h5 className='font-chng'>Step 2</h5>
                <h4 className='font-chng'>Training</h4>
              </StepLabel>
            </Step>
          </Stepper>
        </div>
        {activeStep === 0 ? (
          <>
            <form
              onClick={showToast}
              onSubmit={formik.handleSubmit}
              onChange={formik.handleChange}
            >
              <div className='card'>
                <fieldset
                  disabled={
                    Location.state && Location.state.view ? true : false
                  }
                >
                  <h4 className='formtitlenew font-chng'>Unit Details</h4>
                  <div className='card-body'>
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='stateId'
                            className='form-label font-chng'
                          >
                            State*
                          </label>
                          <Select
                            isDisabled={
                              Location.state && Location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='stateId'
                            className={
                              formik.errors.stateId && formik.touched.stateId
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            options={stateIdList}
                            value={
                              stateIdList
                                ? stateIdList.find(
                                    (option) =>
                                      option &&
                                      option.value === formik.values.stateId
                                  )
                                : ''
                            }
                            isClearable={true}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'stateId',
                                option && option.value
                              );
                              getState(option);
                            }}
                          ></Select>
                          <div className={'invalid-feedback'}>
                            {formik.errors.stateId ? formik.errors.stateId : ''}
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='typeofunit'
                            className='form-label font-chng'
                          >
                            Type Of Unit*
                          </label>
                          <Select
                            isDisabled={
                              Location.state && Location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            isClearable={true}
                            name='typeOfUnit'
                            className={
                              formik.errors.typeOfUnit &&
                              formik.touched.typeOfUnit
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            value={
                              unitOfActionList
                                ? unitOfActionList.find(
                                    (option: any) =>
                                      option &&
                                      option.value === formik.values.typeOfUnit
                                  )
                                : ''
                            }
                            options={unitOfActionList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'typeOfUnit',
                                option && option.value
                              );
                              formik.setFieldValue('districtId','')
                              filterNameOfUnit(option, unitAction);
                              setdistrictIdValuesDisplay(modifyData(districtValues))
                            }}
                          ></Select>
                          <div className={'invalid-feedback'}>
                            {formik.errors.typeOfUnit
                              ? formik.errors.typeOfUnit
                              : ''}
                          </div>
                        </div>
                      </div>
                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='nameOfUnit'
                            className='form-label font-chng'
                          >
                            Name of Unit*
                          </label>
                          {nameOfUnitValues && nameOfUnitValues.length !== 0 ? (
                            <Select
                              isDisabled={
                                Location.state && Location.state.view
                                  ? true
                                  : false
                              }
                              styles={commonFunction.customStyles}
                              ref={selectNameOfUnitRef}
                              isClearable={true}
                              className={
                                formik.errors.nameOfUnit &&
                                formik.touched.nameOfUnit
                                  ? 'custom-select is-invalid'
                                  : 'custom-select'
                              }
                              name='nameOfUnit'
                              options={nameOfUnit}
                              value={
                                nameOfUnit
                                  ? nameOfUnit.find(
                                      (option: any) =>
                                        option &&
                                        option.value == formik.values.nameOfUnit
                                    )
                                  : ''
                              }
                              onChange={(option: Option) => {
                                if(option!== null){
                                formik.setFieldValue(
                                  'nameOfUnit',
                                  option && option.value
                                );
                                formik.setFieldValue('districtId','')
                                setdistrictIdValuesDisplay(modifyData(districtValues))
                                if (formik.values.typeOfUnit != '14') {
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
                                location.state && location.state.view
                                  ? true
                                  : false
                              }
                              styles={commonFunction.customStyles}
                              ref={selectNameOfUnitRef}
                              className={
                                formik.errors.nameOfUnit &&
                                formik.touched.nameOfUnit
                                  ? 'custom-select is-invalid'
                                  : 'custom-select'
                              }
                              name='nameOfUnit'
                              isClearable={true}
                              value={
                                NoneList
                                  ? NoneList.find(
                                      (option: any) =>
                                        option &&
                                        option.value ===
                                          formik.values.nameOfUnit
                                    )
                                  : ''
                              }
                              options={NoneList}
                              onChange={(option: Option) => {
                                formik.setFieldValue(
                                  'nameOfUnit',
                                  option && option.values
                                );
                                formik.setFieldValue('districtId','')
                              }}
                            ></Select>
                          )}
                          <div className={'invalid-feedback'}>
                            {formik.errors.nameOfUnit
                              ? formik.errors.nameOfUnit
                              : ''}
                          </div>
                        </div>
                      </div>

                      <div className='col-md-6 col-xl-3 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='year'
                            className='form-label font-chng'
                          >
                            Year*
                          </label>

                          <Select
                            name='year'
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
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
                                      option &&
                                      option.value === formik.values.year
                                  )
                                : ''
                            }
                            options={yearList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'year',
                                option && option.value
                              );
                            }}
                          ></Select>
                          <div className={'invalid-feedback'}>
                            {formik.errors.year ? formik.errors.year : ''}
                          </div>
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='month'
                            className='form-label font-chng'
                          >
                            Month*
                          </label>
                          <Select
                            name='month'
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
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
                              formik.setFieldValue(
                                'month',
                                option && option.value
                              );
                            }}
                            value={
                              monthList
                                ? monthList.find(
                                    (option: any) =>
                                      option &&
                                      option.value == formik.values.month
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
                          {districtValues && districtValues.length !== 0 ? (
                            <Select
                              ref={selectDistrictRef}
                              isDisabled={
                                Location.state && Location.state.view
                                  ? true
                                  : false
                              }
                              styles={commonFunction.customStyles}
                              isClearable={true}
                              name='districtId'
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
                                        option &&
                                        option.value ===
                                          formik.values.districtId
                                    )
                                  : ''
                              }
                              options={districtIdValuesDisplay}
                              onChange={(option) => {
                                formik.setFieldValue(
                                  'districtId',
                                  option && option.value
                                );
                              }}
                            ></Select>
                          ) : (
                            <Select
                              ref={selectDistrictRef}
                              isDisabled={
                                Location.state && Location.state.view
                                  ? true
                                  : false
                              }
                              styles={commonFunction.customStyles}
                              isClearable={true}
                              name='districtId'
                              className={
                                formik.errors.districtId &&
                                formik.touched.districtId
                                  ? 'custom-select is-invalid'
                                  : 'custom-select'
                              }
                              value={
                                NoneList
                                  ? NoneList.find(
                                      (option) =>
                                        option &&
                                        option.value ===
                                          formik.values.districtId
                                    )
                                  : ''
                              }
                              options={NoneList}
                              onChange={(option) => {
                                formik.setFieldValue(
                                  'districtId',
                                  option && option.value
                                );
                              }}
                            ></Select>
                          )}
                          <div className={'invalid-feedback'}>
                            {formik.errors.districtId
                              ? formik.errors.districtId
                              : ''}
                          </div>
                        </div>
                      </div>
                    </Row>
                  </div>{' '}
                </fieldset>
              </div>
              <div className='card'>
                <h4 className='formtitlenew font-chng'>HR Status</h4>
                <div className='card-body'>
                  <fieldset
                    disabled={
                      Location.state && Location.state.view ? true : false
                    }
                  >
                    <Row className='mb-3'>
                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='cadre'
                            className='form-label font-chng'
                          >
                            Cadre
                          </label>
                          <Select
                            isDisabled={
                              Location.state && Location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            isClearable={true}
                            name='cadre'
                            className='custom-select'
                            value={
                              cadreDropDownData
                                ? cadreDropDownData.find(
                                    (option: any) =>
                                      option &&
                                      option.value === formik.values.cadre
                                  )
                                : ''
                            }
                            options={cadreDropDownData}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                'cadre',
                                option && option.value
                              );
                              changeCadre(option);
                            }}
                          ></Select>
                        </div>
                      </div>
                      {showCadre && (
                        <div className='col-md-6'>
                          <div className='form-grp'>
                            <label
                              htmlFor='cadreOther'
                              className='form-label font-chng'
                            >
                              Cadre other
                            </label>
                            <input
                              name='cadreOther'
                              className='form-control'
                              value={formik.values.cadreOther}
                              onChange={formik.handleChange}
                            ></input>
                          </div>
                        </div>
                      )}
                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='sanctioned'
                            className='form-label font-chng'
                          >
                            Sanctioned
                          </label>
                          <input
                            name='sanctioned'
                            className='form-control'
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            value={formik.values.sanctioned}
                            onChange={formik.handleChange}
                          ></input>
                        </div>
                      </div>
                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='filled'
                            className='form-label font-chng'
                          >
                            Filled
                          </label>
                          <input
                            name='filled'
                            className='form-control'
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            value={formik.values.filled}
                            onChange={formik.handleChange}
                          ></input>
                        </div>
                      </div>
                      {/* </Row> */}

                      {/* <Row className='mb-3'> */}
                      <div className='col-md-6 col-xl-3  col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='vacant'
                            className='form-label font-chng'
                          >
                            Vacant
                          </label>
                          <input
                            name='vacant'
                            className='form-control'
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            value={formik.values.vacant}
                            onChange={formik.handleChange}
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
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="Submitbtnid2"
                      className="btn btn-secondary font-chng"
                    >
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
                  id='Submitbtnid2'
                  className='btn font-chng'
                  disabled={isDisabled}
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
          </>
        ) : (
          <div>
            {hide ? (
              <div className='card'>
                <div className='row'>
                  <div className='col-md-9 col-xl-3 col-12'>
                    <h4 className='formtitlenew font-chng'>Training List</h4>
                  </div>
                  <div
                    className='col-md-3 offset-xl-6 col-xl-3 col-12 d-flex flex-row-reverse'
                    style={{ paddingRight: '20px' }}
                  >
                    {((Location.state && !Location.state.view) ||
                      !Location.state) && (
                      <Button
                        variant='secondary'
                        className={
                          location && location.state && location.state.view
                            ? 'd-none'
                            : 'mt-m font-chng'
                        }
                        onClick={addNew}
                      >
                        <img src={plusImg} className='pe-2' />
                        Add New
                      </Button>
                    )}
                  </div>
                </div>
                <div className='post-tablenew font-chng'>
                  <DataTable
                    columns={columns1}
                    data={traininglist}
                    expandableRows={true}
                    onRowExpandToggled={(expand, row) => {
                      //  console.log(expand);
                      //  console.log(row);
                    }}
                    //expandOnRowClicked={false}
                    expandableRowsComponent={<ExpandedComponent />}
                    highlightOnHover
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 25, 50, 100, 1000]}
                    paginationComponentOptions={{
                      rowsPerPageText: 'Records per page:',
                      rangeSeparatorText: 'out of',
                    }}
                  />
                </div>

                {/* <div className="form-grp text-right">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn btn-outline-light font-chng"
                  >
                    <i className="fas fa-arrow-left"></i>Back
                  </button>
                  {location && location.state && location.state.id ?
                    null
                    :
                    <button
                      type="submit"
                      onClick={() => moveToListPage()}
                      className="btn btn-secondary font-chng"
                      disabled={location && location.state && location.state.id ? true : false}
                      style={{ marginRight: 10 }}
                    >
                      Save as Draft
                    </button>
                  }
                  {isOnline &&
                    <button
                      type="submit"
                      onClick={() => finishSave()}
                      className="btn btn-secondary font-chng"
                      disabled={!isOnline ? true : false}
                    >
                      Save
                    </button>
                  }
                </div> */}
                {/* ==================== */}
                <div className='buttongrouprightend mb-4'>
                  <Button
                    type='button'
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
                  {location && location.state && location.state.id ? null : (
                    <button
                      type='submit'
                      onClick={() => moveToListPage()}
                      className='btn font-chng'
                      style={{
                        marginRight: '10px',
                        backgroundColor: '#34c38f',
                        border: '0px',
                        color: ' #ffffff',
                        textTransform: 'none',
                      }}
                      disabled={
                        location && location.state && location.state.id
                          ? true
                          : false
                      }
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
                      disabled={!isOnline ? true : false}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div>
                  <form
                    onClick={showToast}
                    onSubmit={trainingFormik.handleSubmit}
                    onChange={trainingFormik.handleChange}
                  >
                    <div className='card'>
                      <h4 className='formtitlenew font-chng'>
                        Training Status
                      </h4>
                      <div className='card-body'>
                        <fieldset
                          disabled={
                            Location.state && Location.state.view ? true : false
                          }
                        >
                          <Row className='md-3'>
                            <div className='col-md-6 col-xl-3  col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='nameOfStaff'
                                  className='form-label font-chng'
                                >
                                  Name of Staff*
                                </label>
                                <input
                                  name='nameOfStaff'
                                  className={
                                    trainingFormik.errors.nameOfStaff &&
                                    trainingFormik.touched.nameOfStaff
                                      ? 'form-control is-invalid'
                                      : 'form-control'
                                  }
                                  value={trainingFormik.values.nameOfStaff}
                                  onChange={trainingFormik.handleChange}
                                  onKeyPress={(e) => commonFunction.keyPress(e)}
                                  onInput={(event) =>
                                    commonFunction.onlyAlphabets(event)
                                  }
                                />
                                <div className={'invalid-feedback'}>
                                  {trainingFormik.errors
                                    ? trainingFormik.errors.nameOfStaff
                                    : ''}
                                </div>
                              </div>
                            </div>
                            <div className='col-md-6 col-xl-3  col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='designationId'
                                  className='form-label font-chng'
                                >
                                  Designation
                                </label>
                                <Select
                                  name='designationId'
                                  isDisabled={
                                    Location.state && Location.state.view
                                      ? true
                                      : false
                                  }
                                  className={
                                    trainingFormik.errors.designationId &&
                                    trainingFormik.touched.designationId
                                      ? 'custom-select is-invalid'
                                      : 'custom-select'
                                  }
                                  styles={commonFunction.customStyles}
                                  value={
                                    designationList
                                      ? designationList.find(
                                          (option: any) =>
                                            option &&
                                            option.value ===
                                              trainingFormik.values
                                                .designationId
                                        )
                                      : ''
                                  }
                                  options={designationList}
                                  onChange={(option: Option) => {
                                    trainingFormik.setFieldValue(
                                      'designationId',
                                      option && option.value
                                    );
                                    changeDesignation(option);
                                  }}
                                >
                                  <option value='Others'>Others</option>
                                </Select>
                                <div className={'invalid-feedback'}>
                                  {trainingFormik.errors.designationId
                                    ? trainingFormik.errors.designationId
                                    : ''}
                                </div>
                              </div>
                            </div>
                            {showDesignation && (
                              <div className='col-md-6 col-xl-3  col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='designationOther'
                                    className='form-label font-chng'
                                  >
                                    Designation Other
                                  </label>
                                  <input
                                    name='designationOther'
                                    className='form-control'
                                    value={
                                      trainingFormik.values.designationOther
                                    }
                                    onChange={trainingFormik.handleChange}
                                  ></input>
                                </div>
                              </div>
                            )}
                          </Row>
                        </fieldset>
                      </div>
                    </div>
                    <FieldArray
                      name='staffPosVerticalUnitTrainingStatuses'
                      render={(arrayHelpers) => (
                        <div className='card'>
                          {trainingFormik.values.staffPosVerticalUnitTrainingStatuses.map(
                            (staffPosVerticalUnitTrainingStatuses, index) => (
                              <div key={index}>
                                <fieldset
                                  disabled={
                                    Location.state && Location.state.view
                                      ? true
                                      : false
                                  }
                                >
                                  <div className='card-body'>
                                    <Row>
                                      <div className='col-md-6 col-xl-3 col-12'>
                                        <div className='form-grp'>
                                          <label
                                            htmlFor={`staffPosVerticalUnitTrainingStatuses.${index}.typeOfTraining`}
                                            className='form-label font-chng'
                                          >
                                            Type of Training
                                          </label>
                                          <Field
                                            name={`staffPosVerticalUnitTrainingStatuses.${index}.typeOfTraining`}
                                            className='form-control'
                                            value={
                                              trainingFormik.values
                                                .staffPosVerticalUnitTrainingStatuses[
                                                index
                                              ].typeOfTraining
                                            }
                                            onChange={
                                              trainingFormik.handleChange
                                            }
                                            onKeyPress={(e) =>
                                              commonFunction.keyPress(e)
                                            }
                                            onInput={(event) =>
                                              commonFunction.onlyAlphabets(
                                                event
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className='col-md-6 col-xl-3  col-12'>
                                        <div className='form-grp'>
                                          <label
                                            htmlFor={`staffPosVerticalUnitTrainingStatuses.${index}.placeOfTraining`}
                                            className='form-label font-chng'
                                          >
                                            Place of Training
                                          </label>
                                          <Field
                                            name={`staffPosVerticalUnitTrainingStatuses.${index}.placeOfTraining`}
                                            className='form-control'
                                            value={
                                              trainingFormik.values
                                                .staffPosVerticalUnitTrainingStatuses[
                                                index
                                              ].placeOfTraining
                                            }
                                            onChange={
                                              trainingFormik.handleChange
                                            }
                                            onKeyPress={(e) =>
                                              commonFunction.keyPress(e)
                                            }
                                            onInput={(event) =>
                                              commonFunction.onlyAlphabets(
                                                event
                                              )
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className='col-md-6 col-xl-3  col-12'>
                                        <div className='form-grp'>
                                          <label
                                            htmlFor={`staffPosVerticalUnitTrainingStatuses.${index}.dateOfTraining`}
                                            className='form-label font-chng'
                                          >
                                            Date of Training
                                          </label>
                                          <Field
                                            name={`staffPosVerticalUnitTrainingStatuses.${index}.dateOfTraining`}
                                            type='date'
                                            max={isValidDate}
                                            className='form-control'
                                            value={
                                              trainingFormik.values
                                                .staffPosVerticalUnitTrainingStatuses[
                                                index
                                              ].dateOfTraining
                                            }
                                            onChange={
                                              trainingFormik.handleChange
                                            }
                                          />
                                        </div>
                                      </div>
                                      <div className='col-md-6 col-xl-3 col-12 pe-0'>
                                        <label
                                          htmlFor={`staffPosVerticalUnitTrainingStatuses.${index}.isTrained`}
                                          className='form-label font-chng'
                                        >
                                          Is Trained
                                        </label>
                                        <div className='form-radio staff-pos'>
                                          <label className='form-label font-chng'>
                                            <Field
                                              name={`staffPosVerticalUnitTrainingStatuses.${index}.isTrained`}
                                              type='radio'
                                              onChange={
                                                trainingFormik.handleChange
                                              }
                                              defaultChecked={
                                                trainingFormik.values
                                                  .staffPosVerticalUnitTrainingStatuses[
                                                  index
                                                ].isTrained === 'yes'
                                              }
                                              value='true'
                                            />
                                            <label>Yes</label>
                                          </label>
                                          <label className='form-label font-chng'>
                                            <Field
                                              name={`staffPosVerticalUnitTrainingStatuses.${index}.isTrained`}
                                              type='radio'
                                              onChange={
                                                trainingFormik.handleChange
                                              }
                                              defaultChecked={
                                                trainingFormik.values
                                                  .staffPosVerticalUnitTrainingStatuses[
                                                  index
                                                ].isTrained === 'no'
                                              }
                                              value='false'
                                            />
                                            <label>No</label>
                                          </label>
                                        </div>
                                      </div>
                                    </Row>
                                    <Row>
                                      <div
                                        className='offset-xl-9 col-xl-3 d-flex flex-row-reverse'
                                        style={{ alignItems: 'baseline' }}
                                      >
                                        {Location.state &&
                                        Location.state.view ? (
                                          ''
                                        ) : (
                                          <>
                                            <button
                                              className='btn font-chng'
                                              type='button'
                                              disabled={!index}
                                              style={{
                                                display: 'inline-block',
                                                float: 'right',
                                              }}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                arrayHelpers.remove(index);
                                                addField(arrayHelpers);
                                                deletetrainingstatus(
                                                  staffPosVerticalUnitTrainingStatuses
                                                );
                                              }}
                                            >
                                              <img src={deleteImg} />
                                            </button>

                                            {trainingFormik.values
                                              .staffPosVerticalUnitTrainingStatuses
                                              .length -
                                              1 ===
                                              index && (
                                              <Button
                                                type='button'
                                                variant='secondary'
                                                className='font-chng'
                                                style={{
                                                  display: 'inline-block',
                                                }}
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  addFielddata(arrayHelpers);
                                                }}
                                              >
                                                Add
                                              </Button>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </Row>
                                  </div>
                                </fieldset>
                              </div>
                            )
                          )}
                          {/* <div className="form-group text-right ">
                            <button
                              type="submit"
                              className="btn btn-outline-light me-2 font-chng"
                              onClick={Back}
                            >
                              <i className="fas fa-arrow-left pe-1"></i>Back
                            </button>
                            <button
                              type="submit"
                              id="Submitbtnid"
                              className="btn btn-secondary font-chng"
                            >
                              Submit
                            </button>
                          </div> */}
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
                            <button
                              id='Submitbtnid'
                              className='btn font-chng'
                              type='submit'
                              style={{
                                marginRight: '10px',
                                backgroundColor: '#34c38f',
                                border: '0px',
                                color: ' #ffffff',
                                textTransform: 'none',
                              }}
                            >
                              Submit
                            </button>
                          </div>
                        </div>
                      )}
                    />
                  </form>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </FormikProvider>
  );
};

export default AddStaffPosition;
function getDropDown() {
  throw new Error('Function not implemented.');
}

function getOneCoverageRegularFormViewData(id: any, arg1: string) {
  throw new Error('Function not implemented.');
}
