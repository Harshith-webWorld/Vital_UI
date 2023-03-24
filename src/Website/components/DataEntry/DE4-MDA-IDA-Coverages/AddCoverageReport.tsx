import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import deletebx from '../../../assets/img/Trash.png';
import Stepper from '@material-ui/core/Stepper';
import StepConnector from '@material-ui/core/StepConnector';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import DescriptionIcon from '@material-ui/icons/Description';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import clsx from 'clsx';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import StepIcon, { StepIconProps } from '@material-ui/core/StepIcon';
import history from '../../../../helpers/history';
import moment from 'moment';
import {
  MdaIdaCoverages,
  MdaIdaCoverageRegular,
  MdaIdaCoverageMopUp,
} from '../../../interfaces/FormMdaIdaCoverages';
import { useFormik, FormikProvider, FieldArray, Field } from 'formik';
import * as Yup from 'yup';
import MdaIdaCoveregareService from '../../../services/FormMdaIdaCoveragesService';
import { useLocation } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DropdownService from '../../../services/DropdownService';
import { boolean2str } from '../DE1-Lymphedema-Hydrocele-Patients/Form1-stepper-config';
import PersonIcon from '@material-ui/icons/Person';
import { backgroundRepeat } from 'html2canvas/dist/types/css/property-descriptors/background-repeat';
import Select, { Option } from 'react-select';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonFunction from '../../../../helpers/common/common';
import AccordionCoverageRegularList from './AccdorinCoverageRegularList';
import AccordionCoverageMopUpList from './AccordionCoverageMopUp';
//offline
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import mdaIdaCoveragesDraftServices from '../../../draftServices/FormMadIdaCoveragesDraftServices';

const AddMDACoverageReport: React.FC<any> = (props) => {
  const listDESheetName: any = props && props.listDESheetName;
  const location = useLocation<any>();
  const [activeStep, setActiveStep] = React.useState(0);
  const [step1Valid, isStep1Valid] = React.useState(false);
  const [step2Valid, isStep2Valid] = React.useState(false);
  let [showRegularForm, setShowRegularForm] = useState(false);
  let [showMopUpForm, setShowMopUpForm] = useState(false);
  let [isRegularView, setisRegularView] = useState(false);
  let [isMopUpView, setisMopUpView] = useState(false);
  let isOnline = window.navigator.onLine;
  let [requiredHospitalStay, setrequiredHospitalStay] = useState(false);
  let [requiredHospitalStay1, setrequiredHospitalStay1] = useState(false);

  const [mdaIDACoverageIdValue, setmdaIDACoverageIdValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [mdaIdaCoverageRegularList, setmdaIdaCoverageRegularList] = useState(
    []
  );
  const [mdaIdaCoverageMopUpList, setmdaIdaCoverageMopUpList] = useState([]);
  let [stateIdValues, setstateIdValues] = useState([]);
  let [districtIdValues, setdistrictIdValues] = useState([]);
  let [corporationIdValues, setcorporationIdValues] = useState([]);
  let [talukaIdValues, settalukaIdValues] = useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  let [subCenterIdValues, setsubCenterIdValues] = useState([]);
  let [wardIdValues, setwardIdValues] = useState([]);
  let [villageIdValues, setvillageIdValues] = useState([]);
  let [zoneData, setZoneData] = useState([]);
  let [clinicalOutcomeValues, setclinicalOutcomeValues] = useState([]);
  const [districtId, setdistrictId] = useState();
  const [facilityId, setfacilityId] = useState();
  const [talukaId, settalukaId] = useState();
  const [zoneId, setzoneId] = useState();
  const [subCenterId, setsubCenterId] = useState();
  const [corporationId, setcorporationId] = useState();
  const [saveUUID, setsaveUUID] = React.useState(undefined);
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);

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
  let selectZoneRef: any = useRef();
  let selectWardRef: any = useRef();
  let selectTalukaRef: any = useRef();
  let selectFacilityRef: any = useRef();
  let selectVillageRef: any = useRef();
  let selectSubcenterRef: any = useRef();

  useEffect(() => {
    getWebsitestateIdcontent();
    getOneCoveragesFormData();
    getmdaIdaCoverageRegularList();
    getmdaIdaCoverageMopUpList();
  }, []);

  let NoneList = [{ label: 'None', value: 0 }];

  const prevDistrictRef: any = React.useRef();
  const prevFacilityRef: any = React.useRef();
  const prevTalukaRef: any = React.useRef();
  const prevZoneRef: any = React.useRef();
  const prevCorporationRef: any = React.useRef();
  const prevSubCenterRef: any = React.useRef();
  useEffect(() => {
    prevDistrictRef.current = districtId;
    prevFacilityRef.current = facilityId;
    prevTalukaRef.current = talukaId;
    prevZoneRef.current = zoneId;
    prevCorporationRef.current = corporationId;
    prevSubCenterRef.current = subCenterId;
  });
  const prevDistrictIdValue = prevDistrictRef.current;
  const prevFacilityIdValue = prevFacilityRef.current;
  const prevTalukaIdValue = prevTalukaRef.current;
  const prevZoneIdValue = prevZoneRef.current;
  const prevCorporationIdValue = prevCorporationRef.current;
  const prevSubCenterIdValue = prevSubCenterRef.current;

  async function getDistrict(e: any) {
    setdistrictId(e && e.value);
    if (!((e && e.value) === prevDistrictIdValue)) {
      if ((e && e.value) === null) {
        formikCoverageForm.setFieldValue('talukaId', 0);
        formikCoverageForm.setFieldValue('facilityId', 0);
        formikCoverageForm.setFieldValue('subCenterId', 0);
        formikCoverageForm.setFieldValue('villageId', 0);
        formikCoverageForm.setFieldValue('wardId', 0);
        formikCoverageForm.setFieldValue('zoneId', 0);
        formikCoverageForm.setFieldValue('corporationId', 0);
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
      console.log(corporationId, corporationIdOffline);
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
        formikCoverageForm.setFieldValue('corporationId', '');
        formikCoverageForm.setFieldValue('wardId', 0);
        formikCoverageForm.setFieldValue('zoneId', 0);
        setcorporationIdValues(corporationData);
      } else {
        selectCorporationRef.current.select.clearValue();
        let corporationData: any = [OptionLabel.corporationNone];
        setcorporationIdValues(corporationData);
        formikCoverageForm.setFieldValue('corporationId', 0);
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
        formikCoverageForm.setFieldValue('talukaId', '');
        formikCoverageForm.setFieldValue('villageId', 0);
        selectTalukaRef.current.select.clearValue();
        if (!isOnline) {
          talukaList = [OptionLabel.talukaNone, ...talukaIdOffline];
        } else {
          talukaList = [OptionLabel.talukaNone, ...talukaId.data];
        }
        settalukaIdValues(talukaList);
      } else {
        selectTalukaRef.current.select.clearValue();
        let Data: any = [OptionLabel.talukaNone];
        settalukaIdValues(Data);
        formikCoverageForm.setFieldValue('talukaId', 0);
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
        formikCoverageForm.setFieldValue('facilityId', '');
        formikCoverageForm.setFieldValue('subCenterId', 0);
        selectFacilityRef.current.select.clearValue();
        if (!isOnline) {
          facilityList = [OptionLabel.facilityNoneLabel, ...facilityIdOffline];
        } else {
          facilityList = [OptionLabel.facilityNoneLabel, ...facilityId.data];
        }
        setfacilityIdValues(facilityList);
      } else {
        selectFacilityRef.current.select.clearValue();
        let Data: any = [OptionLabel.facilityNoneLabel];
        setfacilityIdValues(Data);
        formikCoverageForm.setFieldValue('facilityId', 0);
      }
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
      setcorporationIdValues(corporationData);
    } else {
      let Data: any = [OptionLabel.corporationNone];
      setcorporationIdValues(Data);
      formikCoverageForm.setFieldValue('corporationId', 0);
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
      settalukaIdValues(talukaList);
    } else {
      let Data: any = [OptionLabel.talukaNone];
      settalukaIdValues(Data);
      formikCoverageForm.setFieldValue('talukaId', 0);
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
      setfacilityIdValues(facilityList);
    } else {
      let Data: any = [OptionLabel.facilityNoneLabel];
      setfacilityIdValues(Data);
      formikCoverageForm.setFieldValue('facilityId', 0);
    }
  }
  async function getCorporation(e: any) {
    if (e && e.value) {
      setcorporationId(e && e.value);
      if (!((e && e.value) === prevCorporationIdValue)) {
        if ((e && e.value) === null) {
          formikCoverageForm.setFieldValue('zoneId', 0);
          formikCoverageForm.setFieldValue('wardId', 0);
          //formikCoverageForm.values.districtId = null;
        }
        let zoneId: any;
        let zoneIdOffline: any;
        if (!isOnline) {
          zoneIdOffline = await DexieOfflineDataBase.getZoneOffline(
            e && e.value,
            formikCoverageForm.values.districtId
          );
        } else {
          zoneId = await DropdownService.getOneZone(
            e && e.value,
            formikCoverageForm.values.districtId
          );
        }
        console.log('zone zoneId', zoneId);
        if (
          (zoneId && zoneId.data && zoneId.data.length > 0) ||
          (zoneIdOffline && zoneIdOffline.length > 0)
        ) {
          selectZoneRef.current.select.clearValue();
          formikCoverageForm.setFieldValue('zoneId', '');
          formikCoverageForm.setFieldValue('wardId', 0);
          let zoneList: any;
          if (!isOnline) {
            zoneList = [OptionLabel.zoneNoneLabel, ...zoneIdOffline];
          } else {
            zoneList = [OptionLabel.zoneNoneLabel, ...zoneId.data];
          }
          setZoneData(zoneList);
        } else {
          selectZoneRef.current.select.clearValue();
          let Data: any = [OptionLabel.zoneNoneLabel];
          setZoneData(Data);
          formikCoverageForm.setFieldValue('zoneId', 0);
        }

        let wardId: any;
        let wardIdOffline: any;
        if (!isOnline) {
          wardIdOffline = await DexieOfflineDataBase.getWardOffline(
            e && e.value,
            formikCoverageForm.values.districtId
          );
        } else {
          wardId = await DropdownService.getOneWard(
            e && e.value,
            formikCoverageForm.values.districtId
          );
        }
        if (
          (wardId && wardId.data && wardId.data.length > 0) ||
          (wardIdOffline && wardIdOffline.length > 0)
        ) {
          formikCoverageForm.setFieldValue('wardId', '');
          selectWardRef.current.select.clearValue();
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
          formikCoverageForm.setFieldValue('wardId', 0);
        }
      }
    }
  }
  async function getCorporationValues(e: any, id: any) {
    let zoneId: any;
    let zoneIdOffline: any;
    if (!isOnline) {
      zoneIdOffline = await DexieOfflineDataBase.getZoneOffline(e, id);
    } else {
      zoneId = await DropdownService.getOneZone(e, id);
    }
    console.log('zoneId', zoneId);
    if (
      (zoneId && zoneId.data && zoneId.data.length > 0) ||
      (zoneIdOffline && zoneIdOffline.length > 0)
    ) {
      let zoneList: any;
      if (!isOnline) {
        zoneList = [OptionLabel.zoneNoneLabel, ...zoneIdOffline];
      } else {
        zoneList = [OptionLabel.zoneNoneLabel, ...zoneId.data];
      }
      setZoneData(zoneList);
    } else {
      let Data: any = [OptionLabel.zoneNoneLabel];
      setZoneData(Data);
      formikCoverageForm.setFieldValue('zoneId', 0);
    }

    let wardId: any;
    let wardIdOffline: any;
    if (!isOnline) {
      wardIdOffline = await DexieOfflineDataBase.getWardOffline(e, id);
    } else {
      wardId = await DropdownService.getOneWard(e, id);
    }
    if (
      (wardId && wardId.data && wardId.data.length > 0) ||
      (wardIdOffline && wardIdOffline.length > 0)
    ) {
      // formik.setFieldValue("wardId", "");
      // selectWardRef.current.select.clearValue();
      let wardlist: any;
      if (!isOnline) {
        wardlist = [OptionLabel.wardNoneLabel, ...wardIdOffline];
      } else {
        wardlist = [OptionLabel.wardNoneLabel, ...wardId.data];
      }
      setwardIdValues(wardlist);
    } else {
      // selectWardRef.current.select.clearValue();
      let Data: any = [OptionLabel.wardNoneLabel];
      setwardIdValues(Data);
      formikCoverageForm.setFieldValue('wardId', 0);
    }
  }

  async function getSubCenter(e: any) {
    if (e && e.value) {
      setsubCenterId(e && e.value);
      if (!((e && e.value) === prevSubCenterIdValue)) {
        if ((e && e.value) === null) {
          // formik.setFieldValue("villageId", 0);
        }
        let villageId: any;
        let villageIdOffline: any;
        if (!isOnline) {
          villageIdOffline =
            await DexieOfflineDataBase.getVillageBySubCenterOffline(
              formikCoverageForm.values.districtId,
              formikCoverageForm.values.facilityId,
              e && e.value
            );
        } else {
          villageId = await DropdownService.getOneVillageBySubCenter(
            formikCoverageForm.values.districtId,
            formikCoverageForm.values.facilityId,
            e && e.value
          );
        }
        if (
          (villageId && villageId.data && villageId.data.length > 0) ||
          (villageIdOffline && villageIdOffline.length > 0)
        ) {
          formikCoverageForm.setFieldValue('villageId', '');
          selectVillageRef.current.select.clearValue();
          let villagelist: any;
          if (!isOnline) {
            villagelist = [OptionLabel.villageNoneLabel, ...villageIdOffline];
          } else {
            villagelist = [OptionLabel.villageNoneLabel, ...villageId.data];
          }
          setvillageIdValues(villagelist);
        }
        // else {
        //   selectWardRef.current.select.clearValue();
        //   let Data: any = [OptionLabel.villageNoneLabel];
        //   setvillageIdValues(Data);
        //   formik.setFieldValue("villageId", 0);
        // }
      }
    }
  }

  async function getSubCenterValues(e: any, facilityId: any, districtId: any) {
    if (e) {
      let villageId: any;
      let villageIdOffline: any;
      if (!isOnline) {
        villageIdOffline =
          await DexieOfflineDataBase.getVillageBySubCenterOffline(
            districtId,
            facilityId,
            e
          );
      } else {
        villageId = await DropdownService.getOneVillageBySubCenter(
          districtId,
          facilityId,
          e
        );
      }
      if (
        (villageId && villageId.data && villageId.data.length > 0) ||
        (villageIdOffline && villageIdOffline.length > 0)
      ) {
        // selectVillageRef.current.select.clearValue();
        let villagelist: any;
        if (!isOnline) {
          villagelist = [OptionLabel.villageNoneLabel, ...villageIdOffline];
        } else {
          villagelist = [OptionLabel.villageNoneLabel, ...villageId.data];
        }
        setvillageIdValues(villagelist);
      }
      // else {
      //   // selectWardRef.current.select.clearValue();
      //   let Data: any = [OptionLabel.villageNoneLabel];
      //   setvillageIdValues(Data);
      //   formik.setFieldValue("villageId", 0);
      // }
    }
  }

  // async function getTaluka(e: any) {
  //   settalukaId(e && e.value)
  //   if (!((e && e.value) === prevTalukaIdValue)) {
  //     if ((e && e.value) === null) {
  //       formikCoverageForm.setFieldValue("villageId", 0);
  //     }
  //     let Village: any;
  //     let VillageIdOffline: any;
  //     if(!isOnline){
  //       VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(e &&
  //         e.value,
  //         formikCoverageForm.values.districtId
  //       );
  //     } else {
  //       Village = await DropdownService.getOneVillage(e &&
  //        e.value,
  //        formikCoverageForm.values.districtId
  //      );
  //     }
  //     console.log("village offline",VillageIdOffline)
  //     if (Village && Village.data && Village.data.length > 0 || VillageIdOffline && VillageIdOffline.length > 0) {
  //       selectVillageRef.current.select.clearValue();
  //       formikCoverageForm.setFieldValue("villageId", "");
  //       let villagelist: any;
  //       if(!isOnline){
  //         villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
  //       } else {
  //         villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
  //       }
  //       setvillageIdValues(villagelist);
  //     } else {
  //       selectVillageRef.current.select.clearValue();
  //       let Data: any = [OptionLabel.villageNoneLabel];
  //       setvillageIdValues(Data);
  //       formikCoverageForm.setFieldValue("villageId", 0);
  //     }
  //   }
  // }
  // async function getTalukaValues(e: any, id: any) {
  //   if (e) {
  //     let Village: any;
  //     let VillageIdOffline: any;
  //     if(!isOnline){
  //       VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(e, id);
  //     } else {
  //       Village = await DropdownService.getOneVillage(e, id);
  //     }
  //     if (Village && Village.data && Village.data.length > 0 || VillageIdOffline && VillageIdOffline.length > 0) {
  //       let villagelist: any;
  //       if(!isOnline){
  //         villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
  //       } else {
  //         villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
  //       }
  //       setvillageIdValues(villagelist);
  //     }
  //   }
  // }

  async function getFacility(e: any) {
    setfacilityId(e && e.value);
    if (!((e && e.value) === prevFacilityIdValue)) {
      if ((e && e.value) === null) {
        formikCoverageForm.setFieldValue('subCenterId', 0);
        formikCoverageForm.setFieldValue('villageId', 0);
      }
      let Subcenter: any;
      let SubcenterOffline: any;
      if (isOnline) {
        Subcenter = await DropdownService.getOneSubCenter(
          e && e.value,
          formikCoverageForm.values.districtId
        );
      } else {
        SubcenterOffline = await DexieOfflineDataBase.getSubCenterOffline(
          e && e.value,
          formikCoverageForm.values.districtId
        );
      }
      console.log('subbbbb', SubcenterOffline);
      if (
        (Subcenter && Subcenter.data && Subcenter.data.length > 0) ||
        (SubcenterOffline && SubcenterOffline.length > 0)
      ) {
        selectSubcenterRef.current.select.clearValue();
        formikCoverageForm.setFieldValue('subCenterId', '');
        let subcenterlist: any;
        if (!isOnline) {
          subcenterlist = [OptionLabel.subCenterNoneLabel, ...SubcenterOffline];
        } else {
          subcenterlist = [OptionLabel.subCenterNoneLabel, ...Subcenter.data];
        }
        setsubCenterIdValues(subcenterlist);
      } else {
        selectSubcenterRef.current.select.clearValue();
        let Data: any = [OptionLabel.subCenterNoneLabel];
        setsubCenterIdValues(Data);
        formikCoverageForm.setFieldValue('subCenterId', 0);
      }

      let Village: any;
      let VillageIdOffline: any;
      if (!isOnline) {
        VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(
          e && e.value,
          formikCoverageForm.values.districtId
        );
      } else {
        Village = await DropdownService.getOneVillage(
          e && e.value,
          formikCoverageForm.values.districtId
        );
      }
      console.log('village offline', VillageIdOffline);
      if (
        (Village && Village.data && Village.data.length > 0) ||
        (VillageIdOffline && VillageIdOffline.length > 0)
      ) {
        selectVillageRef.current.select.clearValue();
        formikCoverageForm.setFieldValue('villageId', '');
        let villagelist: any;
        if (!isOnline) {
          villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
        } else {
          villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
        }
        setvillageIdValues(villagelist);
      } else {
        selectVillageRef.current.select.clearValue();
        let Data: any = [OptionLabel.villageNoneLabel];
        setvillageIdValues(Data);
        formikCoverageForm.setFieldValue('villageId', 0);
      }
    }
  }

  async function getFacilityValues(e: any, id: any) {
    let Subcenter: any;
    let SubcenterOffline: any;
    if (isOnline) {
      Subcenter = await DropdownService.getOneSubCenter(e, id);
    } else {
      SubcenterOffline = await DexieOfflineDataBase.getSubCenterOffline(e, id);
    }
    if (
      (Subcenter && Subcenter.data && Subcenter.data.length > 0) ||
      (SubcenterOffline && SubcenterOffline.length > 0)
    ) {
      let subcenterlist: any;
      if (!isOnline) {
        subcenterlist = [OptionLabel.subCenterNoneLabel, ...SubcenterOffline];
      } else {
        subcenterlist = [OptionLabel.subCenterNoneLabel, ...Subcenter.data];
      }
      setsubCenterIdValues(subcenterlist);
    }
    let Village: any;
    let VillageIdOffline: any;
    if (!isOnline) {
      VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(e, id);
    } else {
      Village = await DropdownService.getOneVillage(e, id);
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
      setvillageIdValues(villagelist);
    } else {
      selectVillageRef.current.select.clearValue();
      let Data: any = [OptionLabel.villageNoneLabel];
      setvillageIdValues(Data);
      formikCoverageForm.setFieldValue('villageId', 0);
    }
  }

  // async function getZone(e: any) {
  //   setzoneId(e && e.value)
  //   if (!((e && e.value) === prevZoneIdValue)) {
  //     if ((e && e.value) === null) {
  //       formikCoverageForm.setFieldValue("wardId", 0);
  //     }
  //     let wardId: any;
  //     let wardIdOffline: any;
  //     if(!isOnline){
  //       wardIdOffline = await DexieOfflineDataBase.getWardOffline(e && e.value, formikCoverageForm.values.corporationId, formikCoverageForm.values.districtId);
  //     } else {
  //       wardId = await DropdownService.getOneWard(e && e.value, formikCoverageForm.values.corporationId, formikCoverageForm.values.districtId);
  //     }
  //     console.log("ward offline",wardIdOffline);
  //     if (wardId && wardId.data && wardId.data.length > 0 || wardIdOffline && wardIdOffline.length > 0) {
  //       selectWardRef.current.select.clearValue();
  //       formikCoverageForm.setFieldValue("wardId", "");
  //       let wardlist: any;
  //       if(!isOnline){
  //         wardlist = [OptionLabel.wardNoneLabel, ...wardIdOffline]
  //       }else{
  //         wardlist = [OptionLabel.wardNoneLabel, ...wardId.data]
  //       }
  //       setwardIdValues(wardlist);
  //     } else {
  //       selectWardRef.current.select.clearValue();
  //       let Data: any = [OptionLabel.wardNoneLabel];
  //       setwardIdValues(Data);
  //       formikCoverageForm.setFieldValue("wardId", 0);
  //     }
  //   }
  // }

  // async function getZoneValues(e: any, corporationId: any, districtId: any) {
  //   let wardId: any;
  //   let wardIdOffline: any;
  //   if(!isOnline){
  //     wardIdOffline = await DropdownService.getOneWard(e, corporationId, districtId);
  //   } else {
  //     wardId = await DropdownService.getOneWard(e, corporationId, districtId);
  //   }
  //   if (wardId && wardId.data && wardId.data.length > 0 || wardIdOffline && wardIdOffline.length > 0) {
  //     let wardlist: any;
  //       if(!isOnline){
  //         wardlist = [OptionLabel.wardNoneLabel, ...wardIdOffline]
  //       }else{
  //         wardlist = [OptionLabel.wardNoneLabel, ...wardId.data]
  //       }
  //     setwardIdValues(wardlist);
  //   }
  // }
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

  async function getWebsitestateIdcontent() {
    if (isOnline) {
      const districtId: any = await DropdownService.getDistrictInfo();
      if (districtId && districtId.data) {
        setdistrictIdValues(districtId.data);
      }
      //   const clinicalOutcomeData: any = await DropdownService.getUnitAction();
      // if (clinicalOutcomeData && clinicalOutcomeData.data) {
      //   setclinicalOutcomeValues(clinicalOutcomeData.data);
      // }
    } else {
      const districtIdOffline: any = await DexieOfflineDataBase.getDistricts();
      if (districtIdOffline) {
        setdistrictIdValues(districtIdOffline);
      }
      //   const clinicalOutcomeDataOffline: any = await DexieOfflineDataBase.getCatagoryOption();
      // if (clinicalOutcomeDataOffline) {
      //   setclinicalOutcomeValues(clinicalOutcomeDataOffline);
      // }
    }
  }
  const districtIdList =
    districtIdValues &&
    districtIdValues.map((item: any, i: any) => {
      return { label: item.districtName, value: item.id };
    });
  const corporationIdList =
    corporationIdValues &&
    corporationIdValues.map((item: any, i: any) => {
      return { label: item.corporationName, value: item.id };
    });
  const talukaIdList =
    talukaIdValues &&
    talukaIdValues.map((item: any, i: any) => {
      return { label: item.talukaName, value: item.id };
    });
  const clinicalOutcomeIdList: any = [];
  clinicalOutcomeValues &&
    clinicalOutcomeValues.map((item: any, i: any) => {
      if (item && item.categoryCode === 1010) {
        clinicalOutcomeIdList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });
  const subCenterIdList =
    subCenterIdValues &&
    subCenterIdValues.map((item: any, i: any) => {
      return { label: item.subCenterName, value: item.id };
    });
  const wardIdList =
    wardIdValues &&
    wardIdValues.map((item: any, i: any) => {
      return { label: item.wardName, value: item.id };
    });
  const villageIdList =
    villageIdValues &&
    villageIdValues.map((item: any, i: any) => {
      return { label: item.villageName, value: item.id };
    });
  const zoneIdList =
    zoneData &&
    zoneData.map((item: any, i: any) => {
      return { label: item.zoneName, value: item.id };
    });
  const facilityIdList =
    facilityIdValues &&
    facilityIdValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });

  let mdaIdaCoverageTable: any = {};
  //Finish and Save Button Function
  async function finishSave() {
    if (
      (location && location.state && location.state.id) ||
      (location && location.state && location.state.view)
    ) {
      moveToListPage();
    } else {
      if (saveUUID) {
        setIsDisabled(true);
        console.log('finish UUID', saveUUID);
        let values = await mdaIdaCoveragesDraftServices.getOneMdaIdaCoverages(
          saveUUID
        );
        mdaIdaCoverageTable = values;
        let regularDetails =
          await mdaIdaCoveragesDraftServices.getListMdaIdaRegular(saveUUID);
        if (regularDetails && regularDetails.length > 0) {
          regularDetails.map((Obj) => {
            Obj.mdaIDACoverageId = 0;
            Obj.mdaIDACoverageOthersLists.map((ObjOthers) => {
              ObjOthers.mdaIDACoverageId = 0;
            });
          });
          mdaIdaCoverageTable.mdaIDACoverageRegularLists = regularDetails;
        }
        let mopUpDetails =
          await mdaIdaCoveragesDraftServices.getListMdaIdaMopUp(saveUUID);
        if (mopUpDetails && mopUpDetails.length > 0) {
          mopUpDetails.map((Obj) => {
            Obj.mdaIDACoverageId = 0;
            Obj.mdaIDACoverageOthersLists.map((ObjOthers) => {
              ObjOthers.mdaIDACoverageId = 0;
            });
          });
          mdaIdaCoverageTable.mdaIDACoverageMopUpLists = mopUpDetails;
        }
        console.log('save DE4 Table Obj', mdaIdaCoverageTable);
        let response = await MdaIdaCoveregareService.createAllMdaIdaCoverages(
          mdaIdaCoverageTable
        );
        setIsDisabled(false);
        if (response.status === 200) {
          moveToListPage();
          let values = await mdaIdaCoveragesDraftServices.deleteMdaIdaCoverages(
            saveUUID
          );
          console.log(values);
          let regularList =
            await mdaIdaCoveragesDraftServices.deleteGetListMdaIdaRegular(
              saveUUID
            );
          console.log(regularList);
          let mopupList =
            await mdaIdaCoveragesDraftServices.deleteGetListMdaIdaMopUp(
              saveUUID
            );
          console.log(mopupList);
          // moveToListPage();
        }
      }
    }
  }

  async function getOneCoveragesFormData() {
    let id: any;
    console.log(mdaIdaCoveragesInitialState);
    if (location.state && location.state.id) {
      id = location.state.id;
    } else if (mdaIdaCoveragesInitialState.id) {
      id = mdaIdaCoveragesInitialState.id;
    }
    if (location.state && location.state.id) {
      const response = await MdaIdaCoveregareService.getOneMdaIdaCoverages(id);
      if (response && response.data) {
        let arr: any = response && response.data && response.data[0];
        getDistrictValues(arr.districtId);
        await getFacilityValues(arr.facilityId, arr.districtId);
        getCorporationValues(arr.corporationId, arr.districtId);
        getSubCenterValues(arr.subCenterId, arr.facilityId, arr.districtId);
        // getTalukaValues(response.data[0].talukaId, response.data[0].districtId);
        // getZoneValues(response.data[0].zoneId, response.data[0].corporationId, response.data[0].districtId);
        setmdaIdaCoveragesInitialState(arr);
      }
    } else if (location.state && location.state.mdaIDACoveragesUUID) {
      id = location.state.mdaIDACoveragesUUID;
      setsaveUUID(id);
      let OfflineResponse =
        await mdaIdaCoveragesDraftServices.getOneMdaIdaCoverages(id);
      getDistrictValues(OfflineResponse.districtId);
      await getFacilityValues(
        OfflineResponse.facilityId,
        OfflineResponse.districtId
      );
      getSubCenterValues(
        OfflineResponse.subCenterId,
        OfflineResponse.facilityId,
        OfflineResponse.districtId
      );
      getCorporationValues(
        OfflineResponse.corporationId,
        OfflineResponse.districtId
      );
      // getTalukaValues(OfflineResponse.talukaId, OfflineResponse.districtId);
      // getZoneValues(OfflineResponse.zoneId, OfflineResponse.corporationId, OfflineResponse.districtId);
      let arr: any = OfflineResponse;
      setmdaIdaCoveragesInitialState(arr);
    }
  }

  async function getOneCoverageRegularFormData(id: any, idType) {
    console.log('regular id', id);
    if (id) {
      if (idType === 'Id') {
        console.log('server mopup', typeof id);
        const response =
          await MdaIdaCoveregareService.getOneMdaIdaCoverageRegular(id);
        let arr: any = response && response.data;
        arr[0].isRequiredHospitalStay = boolean2str(
          arr[0].isRequiredHospitalStay
        );
        requiredHospitalStayHandleChange(arr[0].isRequiredHospitalStay);
        arr[0].regular = parseInt(arr[0].regular);
        setmdaIdaCoverageRegularInitialState(arr[0]);
        setShowRegularForm(true);
      } else {
        console.log('local mopup', typeof id);
        let OfflineResponse =
          await mdaIdaCoveragesDraftServices.getOneMdaIdaRegular(id);
        let arr: any = OfflineResponse;
        arr.isRequiredHospitalStay = boolean2str(arr.isRequiredHospitalStay);
        requiredHospitalStayHandleChange(arr.isRequiredHospitalStay);
        arr.regular = parseInt(arr.regular);
        setmdaIdaCoverageRegularInitialState(arr);
        setShowRegularForm(true);
      }
    }
  }

  async function getOneCoverageRegularFormViewData(id: any, idType) {
    if (id) {
      if (idType === 'Id') {
        const response =
          await MdaIdaCoveregareService.getOneMdaIdaCoverageRegular(id);
        let arr: any = response && response.data;
        arr[0].isRequiredHospitalStay = boolean2str(
          arr[0].isRequiredHospitalStay
        );
        requiredHospitalStayHandleChange(arr[0].isRequiredHospitalStay);
        arr[0].regular = parseInt(arr[0].regular);
        setmdaIdaCoverageRegularInitialState(arr[0]);
        setShowRegularForm(true);
        setisRegularView(true);
      } else {
        let OfflineResponse =
          await mdaIdaCoveragesDraftServices.getOneMdaIdaRegular(id);
        let arr: any = OfflineResponse;
        arr.isRequiredHospitalStay = boolean2str(arr.isRequiredHospitalStay);
        requiredHospitalStayHandleChange(arr.isRequiredHospitalStay);
        arr.regular = parseInt(arr.regular);
        setmdaIdaCoverageRegularInitialState(arr);
        setShowRegularForm(true);
        setisRegularView(true);
      }
    }
  }

  async function getOneCoverageMopUpFormData(id: any, idType) {
    console.log(id);
    if (id) {
      if (idType === 'Id') {
        console.log('server mopup', typeof id);
        const response =
          await MdaIdaCoveregareService.getOneMdaIdaCoverageMopUp(id);
        let arr: any = response && response.data;
        arr[0].isRequiredHospitalStay = boolean2str(
          arr[0].isRequiredHospitalStay
        );
        requiredHospitalStayHandleChange1(arr[0].isRequiredHospitalStay);
        arr[0].mopUp = parseInt(arr[0].mopUp);
        console.log(typeof arr[0].isRequiredHospitalStay);
        setmdaIdaCoverageMopUpInitialState(arr[0]);
        setShowMopUpForm(true);
      } else {
        console.log('local mopup', typeof id);
        let OfflineResponse =
          await mdaIdaCoveragesDraftServices.getOneMdaIdaMopUp(id);
        let arr: any = OfflineResponse;
        arr.isRequiredHospitalStay = boolean2str(arr.isRequiredHospitalStay);
        requiredHospitalStayHandleChange1(arr.isRequiredHospitalStay);
        arr.mopUp = parseInt(arr.mopUp);
        console.log(typeof arr.isRequiredHospitalStay);
        setmdaIdaCoverageMopUpInitialState(arr);
        setShowMopUpForm(true);
      }
    }
  }
  async function getOneCoverageMopUpFormViewData(id: any, idType) {
    if (id) {
      if (idType === 'Id') {
        const response =
          await MdaIdaCoveregareService.getOneMdaIdaCoverageMopUp(id);
        let arr: any = response && response.data;
        arr[0].mopUp = parseInt(arr[0].mopUp);
        arr[0].isRequiredHospitalStay = boolean2str(
          arr[0].isRequiredHospitalStay
        );
        requiredHospitalStayHandleChange1(arr[0].isRequiredHospitalStay);
        setmdaIdaCoverageMopUpInitialState(arr[0]);
        setShowMopUpForm(true);
        setisMopUpView(true);
      } else {
        let OfflineResponse =
          await mdaIdaCoveragesDraftServices.getOneMdaIdaMopUp(id);
        let arr: any = OfflineResponse;
        arr.mopUp = parseInt(arr.mopUp);
        arr.isRequiredHospitalStay = boolean2str(arr.isRequiredHospitalStay);
        requiredHospitalStayHandleChange1(arr.isRequiredHospitalStay);
        setmdaIdaCoverageMopUpInitialState(arr);
        setShowMopUpForm(true);
        setisMopUpView(true);
      }
    }
  }

  async function getmdaIdaCoverageRegularList() {
    let coverageListId: any;
    let regularDetails: any;
    if (location && location.state && location.state.id) {
      coverageListId = location.state.id;
      regularDetails =
        await MdaIdaCoveregareService.getAllMdaIdaCoverageRegular(
          coverageListId
        );
      if (regularDetails) {
        console.log('get survey info:: ', regularDetails.data);
        setmdaIdaCoverageRegularList(regularDetails && regularDetails.data);
      }
    } else if (
      location &&
      location.state &&
      location.state.mdaIDACoveragesUUID
    ) {
      coverageListId = location.state.mdaIDACoveragesUUID;
      let regularDetails =
        await mdaIdaCoveragesDraftServices.getListMdaIdaRegular(coverageListId);
      if (regularDetails) {
        setmdaIdaCoverageRegularList(regularDetails);
      }
    } else {
      coverageListId = mdaIDACoverageIdValue;
      let regularDetails =
        await mdaIdaCoveragesDraftServices.getListMdaIdaRegular(coverageListId);
      if (regularDetails) {
        setmdaIdaCoverageRegularList(regularDetails);
      }
    }

    // let coverageListId: any;
    // let regularDetails: any;
    // if (location && location.state && location.state.id) {
    //   coverageListId = location.state.id;
    // } else {
    //   coverageListId = mdaIDACoverageIdValue;

    // }

    // if (coverageListId) {
    //   if(isOnline){
    //       regularDetails = await MdaIdaCoveregareService.getAllMdaIdaCoverageRegular(
    //         coverageListId
    //       );

    //       if (regularDetails) {
    //       console.log("get survey info:: ", regularDetails.data);
    //       setmdaIdaCoverageRegularList(regularDetails.data);
    //       }
    //     } else {
    //     let OfflineRespone = await mdaIdaCoveragesDraftServices.getListMdaIdaRegular(coverageListId);
    //     if(OfflineRespone){
    //       setmdaIdaCoverageRegularList(OfflineRespone);
    //     }
    //   }
    //   }
  }

  async function getmdaIdaCoverageMopUpList() {
    let coverageListId: any;
    let mopUpDetails: any;
    if (location && location.state && location.state.id) {
      coverageListId = location.state.id;
      mopUpDetails = await MdaIdaCoveregareService.getAllMdaIdaCoverageMopUp(
        coverageListId
      );
      if (mopUpDetails) {
        console.log('get survey info:: ', mopUpDetails.data);
        setmdaIdaCoverageMopUpList(mopUpDetails && mopUpDetails.data);
      }
    } else if (
      location &&
      location.state &&
      location.state.mdaIDACoveragesUUID
    ) {
      coverageListId = location.state.mdaIDACoveragesUUID;
      let mopUpDetails = await mdaIdaCoveragesDraftServices.getListMdaIdaMopUp(
        coverageListId
      );
      if (mopUpDetails) {
        setmdaIdaCoverageMopUpList(mopUpDetails);
      }
    } else {
      coverageListId = mdaIDACoverageIdValue;
      let mopUpDetails = await mdaIdaCoveragesDraftServices.getListMdaIdaMopUp(
        coverageListId
      );
      if (mopUpDetails) {
        setmdaIdaCoverageMopUpList(mopUpDetails);
      }
    }
    // let coverageListId: any;
    // let mopUpDetails: any;
    // if (location && location.state && location.state.id) {
    //   coverageListId = location.state.id;
    // } else {
    //   coverageListId = mdaIDACoverageIdValue;
    //   console.log("coverageListId", coverageListId)
    // }

    // if (coverageListId) {
    //   if(isOnline){
    //     mopUpDetails = await MdaIdaCoveregareService.getAllMdaIdaCoverageMopUp(
    //       coverageListId
    //     );

    //     if (mopUpDetails) {
    //     console.log("get survey info:: ", mopUpDetails.data);
    //     setmdaIdaCoverageMopUpList(mopUpDetails.data);
    //     }
    //   } else {
    //     let OfflineRespone = await mdaIdaCoveragesDraftServices.getListMdaIdaMopUp(coverageListId);
    //     if(OfflineRespone){
    //       setmdaIdaCoverageMopUpList(OfflineRespone);
    //     }
    //   }
    // }
  }

  const onMdaIdaCoverageRegularRemove = async (event: any, id: any, idType) => {
    event.persist();
    if (idType === 'Id') {
      const response =
        await MdaIdaCoveregareService.deleteMdaIdaCoverageRegular(id);
      console.log(response.data);
      getmdaIdaCoverageRegularList();
    } else {
      let OfflineRespone =
        await mdaIdaCoveragesDraftServices.deleteMdaIdaRegular(id);
      getmdaIdaCoverageRegularList();
    }
  };

  const onMdaIdaCoverageMopUpRemove = async (event: any, id: any, idType) => {
    event.persist();
    if (idType === 'Id') {
      const response = await MdaIdaCoveregareService.deleteMdaIdaCoverageMopUp(
        id
      );
      console.log(response.data);
      getmdaIdaCoverageMopUpList();
    } else {
      let OfflineRespone = await mdaIdaCoveragesDraftServices.deleteMdaIdaMopUp(
        id
      );
      getmdaIdaCoverageMopUpList();
    }
  };

  const DeleteRegularOne = (event: any, id: any, idType) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            onMdaIdaCoverageRegularRemove(event, id, idType);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const DeleteMopUpOne = (event: any, id: any, idType) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            onMdaIdaCoverageMopUpRemove(event, id, idType);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const Regularcolumns = [
    {
      name: 'Sr.No',
      selector: (row: any) =>
        row.mdaIDACoverage && row.mdaIDACoverage.srNo
          ? row.mdaIDACoverage.srNo
          : '',
      grow: 0,
    },
    // {
    //   name: 'Regular',
    //   selector: 'regular',
    // },
    {
      name: 'No of Person With Fever',
      selector: 'noOfPersonsWithFever',
    },
    {
      name: 'No of Person With Headache',
      selector: 'noOfPersonsWithHeadache',
    },
    {
      name: 'No Of Persons Requried Hospital Stay',
      selector: 'noOfPersonsRequiredHospitalStay',
    },
    {
      name: 'No of Person With Bodyache',
      selector: 'noOfPersonsWithBodyache',
    },

    {
      name: 'Date Of Submission',
      selector: (row: any) => (
        <div>{moment(row.createdAt).format('DD/MM/YYYY')}</div>
      ),
    },
    {
      name: 'Last Modified',
      selector: (row: any) => (
        <div>{moment(row.updatedAt).format('DD/MM/YYYY')}</div>
      ),
    },

    {
      name: 'Actions',
      selector: 'Actions',

      cell: (row: any) => (
        <div data-tag='allowRowEvents'>
          {location && location.state && location.state.view && (
            <button
              className='btn'
              onClick={() => {
                if (row.mdaIdaRegularUUID) {
                  getOneCoverageRegularFormViewData(
                    row.mdaIdaRegularUUID,
                    'UUID'
                  );
                } else if (row.id) {
                  getOneCoverageRegularFormViewData(row.id, 'Id');
                }
              }}
            >
              <img src={viewIcon} />
            </button>
          )}
          {location && location.state && location.state.view ? null : (
            <>
              <button
                className='btn'
                onClick={() => {
                  if (row.mdaIdaRegularUUID) {
                    getOneCoverageRegularFormData(
                      row.mdaIdaRegularUUID,
                      'UUID'
                    );
                  } else if (row.id) {
                    getOneCoverageRegularFormData(row.id, 'Id');
                  }
                }}
              >
                <img src={editIcon} />
              </button>
              <button
                className='btn'
                onClick={(e: any) => {
                  if (row.mdaIdaRegularUUID) {
                    DeleteRegularOne(e, row.mdaIdaRegularUUID, 'UUID');
                  } else if (row.id) {
                    DeleteRegularOne(e, row.id, 'Id');
                  }
                }}
              >
                <img src={deleteIcon} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const MopUpcolumns = [
    {
      name: 'Sr.No',
      selector: (row: any) =>
        row.mdaIDACoverage && row.mdaIDACoverage.srNo
          ? row.mdaIDACoverage.srNo
          : '',
      grow: 0,
    },
    {
      name: 'MopUp',
      selector: 'mopUp',
    },
    {
      name: 'No of Person With Fever',
      selector: 'noOfPersonsWithFever',
    },
    {
      name: 'No of Person With Headache',
      selector: 'noOfPersonsWithHeadache',
    },
    {
      name: 'No Of Persons Requried Hospital Stay',
      selector: 'noOfPersonsRequiredHospitalStay',
    },
    {
      name: 'No of Person With Bodyache',
      selector: 'noOfPersonsWithBodyache',
    },
    {
      name: 'Date Of Submission',
      selector: (row: any) => (
        <div>{moment(row.createdAt).format('DD/MM/YYYY')}</div>
      ),
    },
    {
      name: 'Last Modified',
      selector: (row: any) => (
        <div>{moment(row.updatedAt).format('DD/MM/YYYY')}</div>
      ),
    },

    {
      name: 'Actions',
      selector: 'Actions',

      cell: (row) => (
        <div data-tag='allowRowEvents'>
          {location && location.state && location.state.view && (
            <button
              className='btn'
              onClick={() => {
                if (row.mdaIdaMopUpUUID) {
                  getOneCoverageMopUpFormViewData(row.mdaIdaMopUpUUID, 'UUID');
                } else if (row.id) {
                  getOneCoverageMopUpFormViewData(row.id, 'Id');
                }
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
                  if (row.mdaIdaMopUpUUID) {
                    getOneCoverageMopUpFormData(row.mdaIdaMopUpUUID, 'UUID');
                  } else if (row.id) {
                    getOneCoverageMopUpFormData(row.id, 'Id');
                  }
                }}
              >
                <img src={editIcon} />
              </button>
              <button
                className='btn'
                onClick={(e: any) => {
                  if (row.mdaIdaMopUpUUID) {
                    DeleteMopUpOne(e, row.mdaIdaMopUpUUID, 'UUID');
                  } else if (row.id) {
                    DeleteMopUpOne(e, row.id, 'Id');
                  }
                }}
              >
                <img src={deleteIcon} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  //   function getSteps() {
  //     return ['Select campaign settings', 'Create an ad group'];
  // }

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
        <div className='step-iconnew reg-iconnew'>
          <LocalShippingIcon />
        </div>
      ),
      3: (
        <div className='step-iconnew person-iconnew'>
          <PersonIcon />
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
    console.log(step1Valid);
    if (step1Valid || location.state) setActiveStep(step);
    setShowRegularForm(false);
    setShowMopUpForm(false);
    setisRegularView(false);
    setisMopUpView(false);
  };

  const RegularList = () => {
    setShowRegularForm(false);
    setisRegularView(false);
  };

  const MopUpList = () => {
    setShowMopUpForm(false);
    setisMopUpView(false);
  };

  const RegularForm = () => {
    formikCoverageRegularForm.resetForm({
      values: mdaIdaCoverageRegularInitialValues,
    });
    setShowRegularForm(true);
  };

  const MopUpForm = () => {
    formikCoverageMopUpForm.resetForm({
      values: mdaIdaCoverageMopUpInitialValues,
    });
    setShowMopUpForm(true);
  };

  const handleNext = () => {
    if (
      commonFunction.checkNumber(formikCoverageForm.values.districtId) &&
      commonFunction.checkNumber(formikCoverageForm.values.corporationId) &&
      commonFunction.checkNumber(formikCoverageForm.values.talukaId) &&
      commonFunction.checkNumber(formikCoverageForm.values.subCenterId) &&
      commonFunction.checkNumber(formikCoverageForm.values.wardId) &&
      commonFunction.checkNumber(formikCoverageForm.values.villageId) &&
      commonFunction.checkNumber(formikCoverageForm.values.facilityId) &&
      commonFunction.checkNumber(formikCoverageForm.values.year)
    ) {
      isStep1Valid(true);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    //setHide(false)
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setisMopUpView(false);
    setisRegularView(false);
    if (mdaIdaCoveragesInitialState.id) {
      getOneCoveragesFormData();
    }
  };

  const [mdaIdaCoveragesInitialState, setmdaIdaCoveragesInitialState] =
    useState<MdaIdaCoverages>({
      id: 0,
      year: '',
      month: '',
      districtId: '',
      corporationId: '',
      talukaId: '',
      zoneId: '',
      facilityId: '',
      subCenterId: '',
      wardId: '',
      villageId: '',
      area: '',
      totalPopulation: '',
      eligiblePopulation: '',
      isActive: true,
    });

  let mdaIdaCoverageRegularInitialValues: MdaIdaCoverageRegular = {
    mdaIDACoverageId: 0,
    regular: '',
    noOfPeopleAdministered: '',
    noOfPersonsWithFever: '',
    noOfPersonsWithHeadache: '',
    noOfPersonsWithBodyache: '',
    noOfPersonsWithNausea: '',
    noOfPersonsWithVomiting: '',
    //clinicalOutcome: 0,
    noOfPersonsRecovered: '',
    noOfPersonsNotRecovered: '',
    isRequiredHospitalStay: 'false',
    noOfPersonsRequiredHospitalStay: '',
    remarks: '',
    mdaIDACoverageOthersLists: [
      {
        mdaIDACoverageId: 0,
        otherAdverseExp: '',
        noOfPersonsWithOtherAdverseExp: 0,
      },
    ],
  };

  let mdaIdaCoverageMopUpInitialValues: MdaIdaCoverageMopUp = {
    mdaIDACoverageId: 0,
    mopUp: '',
    noOfPeopleAdministered: '',
    noOfPersonsWithFever: '',
    noOfPersonsWithHeadache: '',
    noOfPersonsWithBodyache: '',
    noOfPersonsWithNausea: '',
    noOfPersonsWithVomiting: '',
    clinicalOutcome: 0,
    noOfPersonsRecovered: '',
    noOfPersonsNotRecovered: '',
    isRequiredHospitalStay: 'false',
    noOfPersonsRequiredHospitalStay: '',
    remarks: '',
    mdaIDACoverageOthersLists: [
      {
        mdaIDACoverageId: 0,
        otherAdverseExp: '',
        noOfPersonsWithOtherAdverseExp: 0,
      },
    ],
  };

  const [
    mdaIdaCoverageRegularInitialState,
    setmdaIdaCoverageRegularInitialState,
  ] = useState<MdaIdaCoverageRegular>({
    mdaIDACoverageId: 0,
    regular: '',
    noOfPeopleAdministered: '',
    noOfPersonsWithFever: '',
    noOfPersonsWithHeadache: '',
    noOfPersonsWithBodyache: '',
    noOfPersonsWithNausea: '',
    noOfPersonsWithVomiting: '',
    //clinicalOutcome: "",
    noOfPersonsRecovered: '',
    noOfPersonsNotRecovered: '',
    isRequiredHospitalStay: 'false',
    noOfPersonsRequiredHospitalStay: '',
    remarks: '',
    mdaIDACoverageOthersLists: [
      {
        mdaIDACoverageId: 0,
        otherAdverseExp: '',
        noOfPersonsWithOtherAdverseExp: 0,
      },
    ],
  });

  const [mdaIdaCoverageMopUpInitialState, setmdaIdaCoverageMopUpInitialState] =
    useState<MdaIdaCoverageMopUp>({
      mdaIDACoverageId: 0,
      mopUp: '',
      noOfPeopleAdministered: '',
      noOfPersonsWithFever: '',
      noOfPersonsWithHeadache: '',
      noOfPersonsWithBodyache: '',
      noOfPersonsWithNausea: '',
      noOfPersonsWithVomiting: '',
      clinicalOutcome: 0,
      noOfPersonsRecovered: '',
      noOfPersonsNotRecovered: '',
      isRequiredHospitalStay: 'false',
      noOfPersonsRequiredHospitalStay: '',
      remarks: '',
      mdaIDACoverageOthersLists: [
        {
          mdaIDACoverageId: 0,
          otherAdverseExp: '',
          noOfPersonsWithOtherAdverseExp: 0,
        },
      ],
    });

  function requiredHospitalStayHandleChange(e) {
    if (e === 'true') {
      setrequiredHospitalStay(true);
    } else if (e === 'false') {
      formikCoverageRegularForm.setFieldValue(
        'noOfPersonsRequiredHospitalStay',
        0
      );
      setrequiredHospitalStay(false);
    }
  }

  function requiredHospitalStayHandleChange1(e) {
    if (e === 'true') {
      setrequiredHospitalStay1(true);
    } else if (e === 'false') {
      formikCoverageMopUpForm.setFieldValue(
        'noOfPersonsRequiredHospitalStay',
        0
      );
      setrequiredHospitalStay1(false);
    }
  }
  const validationCoverageForm = Yup.object().shape({
    year: Yup.string().required('Required').nullable(),
    month: Yup.number().min(1, 'Required').required('required').nullable(),
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
    // zoneId: Yup.string().when([], {
    //   is: 0,
    //   then: Yup.string().required("zone is required").nullable(),
    // }),
    facilityId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('facility is required').nullable(),
    }),
    subCenterId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('subcenter is required').nullable(),
    }),
    wardId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('ward is required').nullable(),
    }),
    villageId: Yup.string().when([], {
      is: 0,
      then: Yup.string().required('village is required').nullable(),
    }),
    totalPopulation: Yup.number().integer(),
    eligiblePopulation: Yup.number()
      .integer()
      .max(
        Yup.ref('totalPopulation'),
        'Eligible Poplation should always be less than Total population'
      )
      .nullable(),
  });

  const validationRegularForm = Yup.object().shape({
    regular: Yup.string().required('Required').nullable(),
    noOfPersonsRequiredHospitalStay: Yup.string()
      .required('Required')
      .nullable(),
  });

  const validationMopUpForm = Yup.object().shape({
    mopUp: Yup.string().required('Required').nullable(),
    noOfPersonsRequiredHospitalStay: Yup.string()
      .required('Required')
      .nullable(),
  });

  const RegularNumberList: any = [];
  Array.from(Array(30), (e, i: any) => {
    RegularNumberList.push({ label: i + 1, value: i + 1 });
  });

  const MopUpNumberList: any = [];
  Array.from(Array(15), (e, i: any) => {
    MopUpNumberList.push({ label: i + 1, value: i + 1 });
  });
  const formikCoverageForm = useFormik({
    initialValues: mdaIdaCoveragesInitialState,
    validationSchema: validationCoverageForm,
    enableReinitialize: true,
    onSubmit: async (values: any) => {
      values.districtId = values.districtId == 0 ? 0 : values.districtId;
      values.corporationId =
        values.corporationId == 0 ? 0 : values.corporationId;
      values.facilityId = values.facilityId == 0 ? 0 : values.facilityId;
      values.subCenterId = values.subCenterId == 0 ? 0 : values.subCenterId;
      values.talukaId = values.talukaId == 0 ? 0 : values.talukaId;
      values.villageId = values.villageId == 0 ? 0 : values.villageId;
      values.wardId = values.wardId == 0 ? 0 : values.wardId;
      values.zoneId = values.zoneId == 0 ? 0 : values.zoneId;
      values.totalPopulation = values.totalPopulation
        ? values.totalPopulation
        : 0;
      values.eligiblePopulation = values.eligiblePopulation
        ? values.eligiblePopulation
        : 0;
      if (values.mdaIDACoverageOthersLists) {
        values.mdaIDACoverageOthersLists.noOfPersonsWithOtherAdverseExp = values
          .mdaIDACoverageOthersLists.noOfPersonsWithOtherAdverseExp
          ? values.mdaIDACoverageOthersLists.noOfPersonsWithOtherAdverseExp
          : 0;
      }
      if (location && location.state && location.state.view) {
        getmdaIdaCoverageRegularList();
        handleNext();
      } else if (location && location.state && location.state.id) {
        setmdaIDACoverageIdValue(location.state.id);
        values.lastModifiedBy = props && props.userSessionId;
        const id: any = location.state.id;
        let response = await MdaIdaCoveregareService.updateMdaIdaCoverages(
          id,
          values
        );
        console.log(response);
        getmdaIdaCoverageRegularList();
        handleNext();
      } else if (
        location &&
        location.state &&
        location.state.mdaIDACoveragesUUID
      ) {
        setsaveUUID(location.state.mdaIDACoveragesUUID);
        setmdaIDACoverageIdValue(location.state.mdaIDACoveragesUUID);
        values.lastModifiedBy = props && props.userSessionId;
        let response = await mdaIdaCoveragesDraftServices.updateMdaIdaCoverages(
          location.state.mdaIDACoveragesUUID,
          values
        );
        console.log(response);
        getmdaIdaCoverageRegularList();
        handleNext();
      } else {
        if (values.mdaIDACoveragesUUID) {
          values.lastModifiedBy = props && props.userSessionId;
          let response =
            await mdaIdaCoveragesDraftServices.updateMdaIdaCoverages(
              values.mdaIDACoveragesUUID,
              values
            );
          console.log(response);
          getmdaIdaCoverageRegularList();
          handleNext();
        } else {
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          let response = await mdaIdaCoveragesDraftServices.addMdaIdaCoverages(
            values
          );
          setsaveUUID(response);
          console.log(response);
          setmdaIDACoverageIdValue(response);
          getmdaIdaCoverageRegularList();
          handleNext();
        }
      }
      //   if (values.mdaIDACoverageOthersLists) {
      //     values.mdaIDACoverageOthersLists.noOfPersonsWithOtherAdverseExp = values.mdaIDACoverageOthersLists.noOfPersonsWithOtherAdverseExp ? values.mdaIDACoverageOthersLists.noOfPersonsWithOtherAdverseExp : 0;
      //   }
      //   if (location && location.state && location.state.view) {
      //     getmdaIdaCoverageRegularList();
      //     handleNext();
      //   } else {
      //     values.districtId = (values.districtId == 0) ? 0 : values.districtId;
      //     values.corporationId = (values.corporationId == 0) ? 0 : values.corporationId;
      //     values.facilityId = (values.facilityId == 0) ? 0 : values.facilityId;
      //     values.subCenterId = (values.subCenterId == 0) ? 0 : values.subCenterId;
      //     values.talukaId = (values.talukaId == 0) ? 0 : values.talukaId;
      //     values.villageId = (values.villageId == 0) ? 0 : values.villageId;
      //     values.wardId = (values.wardId == 0) ? 0 : values.wardId;
      //     values.zoneId = (values.zoneId == 0) ? 0 : values.zoneId;
      //     if (location.state && location.state.id) {
      //       values.lastModifiedBy = props && props.userSessionId;
      //       if(isOnline){
      //       const id: any = location.state.id;
      //       let response = await MdaIdaCoveregareService.updateMdaIdaCoverages(id, values);
      //       console.log(response);
      //       getmdaIdaCoverageRegularList();
      //       handleNext();
      //       } else {
      //         let id = values.mdaIDACoveragesOfflineId;
      //         let OfflineResponse = await mdaIdaCoveragesDraftServices.updateMdaIdaCoverages(id,values);
      //         console.log("offline id coverage",OfflineResponse);
      //         getmdaIdaCoverageRegularList();
      //         handleNext();
      //       }
      //     } else {
      //         values.createdBy = props && props.userSessionId;
      //         values.lastModifiedBy = 0;
      //         if(isOnline){
      //           let response;
      //           response = await MdaIdaCoveregareService.createMdaIdaCoverages(values);
      //           if(response && response.data.id){
      //             setmdaIdaCoveragesInitialState({ ...mdaIdaCoveragesInitialState,id:response.data.id})
      //             setmdaIDACoverageIdValue(response.data.id)
      //           }else if(mdaIdaCoveragesInitialState.id){
      //             response = await MdaIdaCoveregareService.updateMdaIdaCoverages(mdaIdaCoveragesInitialState.id, values);
      //           }
      //           getmdaIdaCoverageRegularList();
      //           handleNext();
      //         } else {
      //           let OfflineResponse = await mdaIdaCoveragesDraftServices.addMdaIdaCoverages(values);
      //           console.log(OfflineResponse);
      //           setmdaIDACoverageIdValue(OfflineResponse)
      //           getmdaIdaCoverageRegularList();
      //           handleNext();
      //         }
      //     }
      //   }
    },
  });

  const formikCoverageRegularForm = useFormik({
    initialValues: mdaIdaCoverageRegularInitialState,
    validationSchema: validationRegularForm,
    enableReinitialize: true,

    onSubmit: async (values: any) => {
      values.noOfPeopleAdministered = values.noOfPeopleAdministered
        ? values.noOfPeopleAdministered
        : 0;
      values.noOfPersonsWithFever = values.noOfPersonsWithFever
        ? values.noOfPersonsWithFever
        : 0;
      values.noOfPersonsWithHeadache = values.noOfPersonsWithHeadache
        ? values.noOfPersonsWithHeadache
        : 0;
      values.noOfPersonsWithBodyache = values.noOfPersonsWithBodyache
        ? values.noOfPersonsWithBodyache
        : 0;
      values.noOfPersonsWithNausea = values.noOfPersonsWithNausea
        ? values.noOfPersonsWithNausea
        : 0;
      values.noOfPersonsWithVomiting = values.noOfPersonsWithVomiting
        ? values.noOfPersonsWithVomiting
        : 0;
      values.noOfPersonsRecovered = values.noOfPersonsRecovered
        ? values.noOfPersonsRecovered
        : 0;
      values.noOfPersonsNotRecovered = values.noOfPersonsNotRecovered
        ? values.noOfPersonsNotRecovered
        : 0;

      values.noOfPersonsRequiredHospitalStay =
        values.isRequiredHospitalStay === 'false'
          ? (values.noOfPersonsRequiredHospitalStay = 0)
          : values.noOfPersonsRequiredHospitalStay;
      if (location && location.state && location.state.view) {
        getmdaIdaCoverageRegularList();
        getmdaIdaCoverageMopUpList();
        setShowRegularForm(false);
      } else {
        let mdaIdaCovergeId: any;
        let mdaIdaCovergeRegularId: any;
        if (location && location.state && location.state.id) {
          if (values.id) {
            mdaIdaCovergeRegularId = values.id;
            mdaIdaCovergeId = values.mdaIDACoverageId;
            values.lastModifiedBy = props && props.userSessionId;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeRegularId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response =
              await MdaIdaCoveregareService.updateMdaIdaCoverageRegular(
                mdaIdaCovergeRegularId,
                values
              );
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowRegularForm(false);
          } else {
            mdaIdaCovergeId = mdaIDACoverageIdValue;
            values.mdaIDACoverageId = mdaIdaCovergeId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeRegularId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response =
              await MdaIdaCoveregareService.createMdaIdaCoverageRegular(values);
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowRegularForm(false);
          }
        } else if (
          location &&
          location.state &&
          location.state.mdaIDACoveragesUUID
        ) {
          if (values && values.mdaIdaRegularUUID) {
            mdaIdaCovergeId = location.state.mdaIDACoveragesUUID;
            mdaIdaCovergeId = mdaIDACoverageIdValue;
            values.mdaIDACoverageId = mdaIdaCovergeId;
            values.lastModifiedBy = props && props.userSessionId;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeRegularId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response =
              await mdaIdaCoveragesDraftServices.updateMdaIdaRegular(
                values.mdaIdaRegularUUID,
                values
              );
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowRegularForm(false);
          } else {
            mdaIdaCovergeId = location.state.mdaIDACoveragesUUID;
            values.mdaIDACoverageId = mdaIdaCovergeId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeRegularId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response = await mdaIdaCoveragesDraftServices.addMdaIdaRegular(
              values
            );
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowRegularForm(false);
          }
        } else {
          if (values && values.mdaIdaRegularUUID) {
            mdaIdaCovergeId = mdaIDACoverageIdValue;
            values.mdaIDACoverageId = mdaIdaCovergeId;
            values.lastModifiedBy = props && props.userSessionId;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeRegularId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response =
              await mdaIdaCoveragesDraftServices.updateMdaIdaRegular(
                values.mdaIdaRegularUUID,
                values
              );
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowRegularForm(false);
          } else {
            mdaIdaCovergeId = mdaIDACoverageIdValue;
            values.mdaIDACoverageId = mdaIdaCovergeId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeRegularId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response = await mdaIdaCoveragesDraftServices.addMdaIdaRegular(
              values
            );
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowRegularForm(false);
          }
        }
        // let mdaIdaCovergeId:any;
        // let mdaIdaCovergeRegularId:any;
        // if(values.id || values.mdaIdaRegularUUID){
        //   mdaIdaCovergeRegularId = values.id;
        //   mdaIdaCovergeId = values.mdaIDACoverageId;
        //   values.lastModifiedBy = props && props.userSessionId;
        //   values.mdaIDACoverageOthersLists.map((othersObj: any) => {
        //     othersObj.mdaIDACoverageId = mdaIdaCovergeId;
        //     othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeRegularId;
        //     if(othersObj && othersObj.id){
        //       othersObj.lastModifiedBy = props && props.userSessionId;
        //     } else {
        //       othersObj.createdBy = props && props.userSessionId;
        //       othersObj.lastModifiedBy = 0;
        //     }
        //   })
        //   if(isOnline){
        //     let response = await MdaIdaCoveregareService.updateMdaIdaCoverageRegular(mdaIdaCovergeRegularId,values);
        //    getmdaIdaCoverageRegularList();
        //     getmdaIdaCoverageMopUpList();
        //     setShowRegularForm(false);

        //   } else {
        //     let id = values.mdaIdaRegularUUID;
        //     let OfflineResponse = await mdaIdaCoveragesDraftServices.updateMdaIdaRegular(id,values);
        //     getmdaIdaCoverageRegularList();
        //    getmdaIdaCoverageMopUpList();
        //    setShowRegularForm(false);
        //   }
        // } else {
        //   if (location && location.state && location.state.id) {
        //     mdaIdaCovergeId = location.state.id;
        //   } else {
        //     mdaIdaCovergeId = mdaIDACoverageIdValue;
        //   }
        //   values.createdBy = props && props.userSessionId;
        //   values.lastModifiedBy = 0;
        //   values.mdaIDACoverageId = mdaIdaCovergeId;
        //   values.mdaIDACoverageOthersLists.map((othersObj: any) => {
        //     othersObj.mdaIDACoverageId = mdaIdaCovergeId;
        //     if(othersObj && othersObj.id){
        //       othersObj.lastModifiedBy = props && props.userSessionId;
        //     } else {
        //       othersObj.createdBy = props && props.userSessionId;
        //       othersObj.lastModifiedBy = 0;
        //     }
        //   })
        //   if(isOnline){
        //     let response = await MdaIdaCoveregareService.createMdaIdaCoverageRegular(values);
        //     console.log(response);

        //     getmdaIdaCoverageRegularList();
        //     getmdaIdaCoverageMopUpList();
        //     setShowRegularForm(false);
        //   } else {
        //     let OfflineResponse = await mdaIdaCoveragesDraftServices.addMdaIdaRegular(values);
        //     console.log(OfflineResponse);

        //     getmdaIdaCoverageRegularList();
        //     setShowRegularForm(false);

        //   }
        // }
      }
    },
  });
  const formikCoverageMopUpForm = useFormik({
    initialValues: mdaIdaCoverageMopUpInitialState,
    validationSchema: validationMopUpForm,
    enableReinitialize: true,

    onSubmit: async (values: any) => {
      values.noOfPeopleAdministered = values.noOfPeopleAdministered
        ? values.noOfPeopleAdministered
        : 0;
      values.noOfPersonsWithFever = values.noOfPersonsWithFever
        ? values.noOfPersonsWithFever
        : 0;
      values.noOfPersonsWithHeadache = values.noOfPersonsWithHeadache
        ? values.noOfPersonsWithHeadache
        : 0;
      values.noOfPersonsWithBodyache = values.noOfPersonsWithBodyache
        ? values.noOfPersonsWithBodyache
        : 0;
      values.noOfPersonsWithNausea = values.noOfPersonsWithNausea
        ? values.noOfPersonsWithNausea
        : 0;
      values.noOfPersonsWithVomiting = values.noOfPersonsWithVomiting
        ? values.noOfPersonsWithVomiting
        : 0;
      values.noOfPersonsRecovered = values.noOfPersonsRecovered
        ? values.noOfPersonsRecovered
        : 0;
      values.noOfPersonsNotRecovered = values.noOfPersonsNotRecovered
        ? values.noOfPersonsNotRecovered
        : 0;
      values.noOfPersonsRequiredHospitalStay =
        values.isRequiredHospitalStay === 'false'
          ? (values.noOfPersonsRequiredHospitalStay = 0)
          : values.noOfPersonsRequiredHospitalStay;
      if (location && location.state && location.state.view) {
        getmdaIdaCoverageRegularList();
        getmdaIdaCoverageMopUpList();
        setShowMopUpForm(false);
      } else {
        let mdaIdaCovergeId: any;
        let mdaIdaCovergeMopUpId: any;
        if (location && location.state && location.state.id) {
          if (values.id) {
            mdaIdaCovergeMopUpId = values.id;
            mdaIdaCovergeId = values.mdaIDACoverageId;
            values.lastModifiedBy = props && props.userSessionId;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeMopUpId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response =
              await MdaIdaCoveregareService.updateMdaIdaCoverageMopUp(
                mdaIdaCovergeMopUpId,
                values
              );
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowMopUpForm(false);
          } else {
            mdaIdaCovergeId = location.state.id;
            values.mdaIDACoverageId = mdaIdaCovergeId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeMopUpId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response =
              await MdaIdaCoveregareService.createMdaIdaCoverageMopUp(values);
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowMopUpForm(false);
          }
        } else if (
          location &&
          location.state &&
          location.state.mdaIDACoveragesUUID
        ) {
          if (values && values.mdaIdaMopUpUUID) {
            mdaIdaCovergeId = location.state.mdaIDACoveragesUUID;
            values.mdaIDACoverageId = mdaIdaCovergeId;
            values.lastModifiedBy = props && props.userSessionId;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeMopUpId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response = await mdaIdaCoveragesDraftServices.updateMdaIdaMopUp(
              values.mdaIdaMopUpUUID,
              values
            );
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowMopUpForm(false);
          } else {
            mdaIdaCovergeId = location.state.mdaIDACoveragesUUID;
            values.mdaIDACoverageId = mdaIdaCovergeId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeMopUpId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response = await mdaIdaCoveragesDraftServices.addMdaIdaMopUp(
              values
            );
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowMopUpForm(false);
          }
        } else {
          if (values && values.mdaIdaMopUpUUID) {
            mdaIdaCovergeId = mdaIDACoverageIdValue;
            values.mdaIDACoverageId = mdaIdaCovergeId;
            values.lastModifiedBy = props && props.userSessionId;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeMopUpId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response = await mdaIdaCoveragesDraftServices.updateMdaIdaMopUp(
              values.mdaIdaMopUpUUID,
              values
            );
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowMopUpForm(false);
          } else {
            mdaIdaCovergeId = mdaIDACoverageIdValue;
            values.mdaIDACoverageId = mdaIdaCovergeId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;
            values.mdaIDACoverageOthersLists.map((othersObj: any) => {
              othersObj.mdaIDACoverageId = mdaIdaCovergeId;
              othersObj.mdaIDACoverageRegularListId = mdaIdaCovergeMopUpId;
              if (othersObj && othersObj.id) {
                othersObj.lastModifiedBy = props && props.userSessionId;
              } else {
                othersObj.createdBy = props && props.userSessionId;
                othersObj.lastModifiedBy = 0;
              }
            });
            let response = await mdaIdaCoveragesDraftServices.addMdaIdaMopUp(
              values
            );
            getmdaIdaCoverageRegularList();
            getmdaIdaCoverageMopUpList();
            setShowMopUpForm(false);
          }
        }

        // let mdaIdaCovergeId: any;
        // let mdaIdaCovergeMopUpId: any;

        // if(values.id || values.mdaIdaMopUpUUID){
        //   mdaIdaCovergeMopUpId = values.id;
        //   mdaIdaCovergeId = values.mdaIDACoverageId;
        //   values.lastModifiedBy = props && props.userSessionId;
        //   values.mdaIDACoverageOthersLists.map((othersObj: any) => {
        //     othersObj.mdaIDACoverageId = mdaIdaCovergeId;
        //     othersObj.mdaIDACoverageMopUpListId = mdaIdaCovergeMopUpId;
        //     if(othersObj && othersObj.id){
        //       othersObj.lastModifiedBy = props && props.userSessionId;
        //     } else {
        //       othersObj.createdBy = props && props.userSessionId;
        //       othersObj.lastModifiedBy = 0;
        //     }
        //   })
        //   if(isOnline){
        //     let response = await MdaIdaCoveregareService.updateMdaIdaCoverageMopUp(mdaIdaCovergeMopUpId,values);
        //     getmdaIdaCoverageRegularList();
        //     getmdaIdaCoverageMopUpList();
        //     setShowMopUpForm(false);
        //   } else {
        //     let id = values.mdaIdaMopUpUUID;
        //     let OfflineResponse = await mdaIdaCoveragesDraftServices.updateMdaIdaMopUp(id,values);
        //     getmdaIdaCoverageRegularList();
        //     getmdaIdaCoverageMopUpList();
        //     setShowMopUpForm(false);
        //   }
        // } else {
        //   if (location && location.state && location.state.id) {
        //     mdaIdaCovergeId = location.state.id;
        //   } else {
        //     mdaIdaCovergeId = mdaIDACoverageIdValue;
        //   }
        //   values.createdBy = props && props.userSessionId;
        //   values.lastModifiedBy = 0;
        //   values.mdaIDACoverageId = mdaIdaCovergeId;
        //   values.mdaIDACoverageOthersLists.map((othersObj: any) => {
        //     othersObj.mdaIDACoverageId = mdaIdaCovergeId;
        //     if(othersObj && othersObj.id){
        //       othersObj.lastModifiedBy = props && props.userSessionId;
        //     } else {
        //       othersObj.createdBy = props && props.userSessionId;
        //       othersObj.lastModifiedBy = 0;
        //     }
        //   })
        //   if(isOnline){
        //     let response = await MdaIdaCoveregareService.createMdaIdaCoverageMopUp(values);

        //     getmdaIdaCoverageRegularList();
        //     getmdaIdaCoverageMopUpList();
        //     setShowMopUpForm(false);
        //   } else {
        //     let OfflineResponse = await mdaIdaCoveragesDraftServices.addMdaIdaMopUp(values);

        //     getmdaIdaCoverageMopUpList();
        //     setShowMopUpForm(false);
        //   }
        // }
      }
    },
  });
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

  const showToast = (e) => {
    if (e.target.id == 'Submitbtnid') {
      formikCoverageForm.validateForm().then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error('Please Enter Required Fields', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
    } else if (e.target.id == 'Submitbtnid2') {
      formikCoverageRegularForm.validateForm().then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error('Please Enter Required Fields', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
    } else if (e.target.id == 'Submitbtnid3') {
      formikCoverageMopUpForm.validateForm().then((errors) => {
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
    const index = arrayHelpers.form.values.mdaIDACoverageOthersLists.length;
    if (index == 1) {
      arrayHelpers.push({
        mdaIDACoverageId: '',
        otherAdverseExp: '',
        noOfPersonsWithOtherAdverseExp: 0,
      });
    }
  }

  function addField1(arrayHelpers) {
    const index = arrayHelpers.form.values.mdaIDACoverageOthersLists.length;
    if (index == 1) {
      arrayHelpers.push({
        mdaIDACoverageId: '',
        otherAdverseExp: '',
        noOfPersonsWithOtherAdverseExp: 0,
      });
    }
  }

  const AccordionComponent = (row) => {
    return <AccordionCoverageRegularList rowValues={row} />;
  };

  const AccordionComponentMopUp = (row) => {
    return <AccordionCoverageMopUpList rowValues={row} />;
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
        {/* <Breadcrumb.Item href="">Pre-MDA</Breadcrumb.Item> */}
        <Breadcrumb.Item
          onClick={() => {
            history.push('/mda-ida-coverages');
          }}
          className='font-chng'
        >
          MDA activity
        </Breadcrumb.Item>
        {/* {
          isOnline ?  <Breadcrumb.Item active>ONLINE</Breadcrumb.Item> :  <Breadcrumb.Item active>OFFLINE</Breadcrumb.Item>
        } */}
        {location.state && location.state.view ? (
          <Breadcrumb.Item active>View</Breadcrumb.Item>
        ) : (location && location.state && location.state.id) ||
          (location && location.state && location.state.mdaIDACoveragesUUID) ? (
          <Breadcrumb.Item active>Edit</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active>Add</Breadcrumb.Item>
        )}
      </Breadcrumb>

      <div className='card'>
        <h4 className='formtitlenew font-chng'> MDA & IDA Coverage Report</h4>

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
              <h4 className='font-chng'>Regular</h4>
            </StepLabel>
          </Step>
          <Step>
            <StepLabel
              onClick={handleStep(2)}
              StepIconComponent={ColorlibStepIcon}
            >
              <h5 className='font-chng'>Step 3</h5>
              <h4 className='font-chng'>Mopup</h4>
            </StepLabel>
          </Step>
        </Stepper>
        {activeStep === 0 && (
          <>
            <div id='stepper1' className='padlr55'>
              <form
                onClick={showToast}
                onSubmit={formikCoverageForm.handleSubmit}
                onChange={formikCoverageForm.handleChange}
                className='card-body'
              >
                <fieldset
                  disabled={
                    location.state && location.state.view ? true : false
                  }
                >
                  <Row className='mb-3'>
                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'>District*</Form.Label>
                      {districtIdValues && districtIdValues.length !== 0 ? (
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='districtId'
                          isClearable={true}
                          options={districtIdList}
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'districtId',
                              option && option.value
                            );
                            getDistrict(option);
                          }}
                          aria-label='Default select example'
                          value={
                            districtIdList
                              ? districtIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.districtId
                                )
                              : ''
                          }
                          className={
                            formikCoverageForm.errors.districtId &&
                            formikCoverageForm.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                        ></Select>
                      ) : (
                        <Select
                          styles={commonFunction.customStyles}
                          name='districtId'
                          options={NoneList}
                          isClearable={true}
                          value={
                            districtIdList
                              ? districtIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.districtId
                                )
                              : ''
                          }
                          className={
                            formikCoverageForm.errors.districtId &&
                            formikCoverageForm.touched.districtId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option) => {
                            formikCoverageForm.setFieldValue(
                              'districtId',
                              option && option.value
                            );
                            getDistrict(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      )}
                      <div className='invalid-feedback'>
                        {formikCoverageForm.errors.districtId
                          ? formikCoverageForm.errors.districtId
                          : null}
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'>
                        Corporation*
                      </Form.Label>
                      {corporationIdValues &&
                      corporationIdValues.length !== 0 ? (
                        <Select
                          ref={selectCorporationRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='corporationId'
                          isClearable={true}
                          value={
                            corporationIdList
                              ? corporationIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.corporationId
                                )
                              : ''
                          }
                          options={corporationIdList}
                          className={
                            formikCoverageForm.errors.corporationId &&
                            formikCoverageForm.touched.corporationId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
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
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='corporationId'
                          isClearable={true}
                          value={
                            corporationIdList
                              ? corporationIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.corporationId
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                          className={
                            formikCoverageForm.errors.corporationId &&
                            formikCoverageForm.touched.corporationId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'corporationId',
                              option && option.value
                            );
                            getCorporation(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      )}
                      <div className='invalid-feedback'>
                        {formikCoverageForm.errors.corporationId
                          ? formikCoverageForm.errors.corporationId
                          : null}
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'>Taluka*</Form.Label>
                      {talukaIdValues && talukaIdValues.length !== 0 ? (
                        <Select
                          ref={selectTalukaRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='talukaId'
                          isClearable={true}
                          value={
                            talukaIdList
                              ? talukaIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.talukaId
                                )
                              : ''
                          }
                          options={talukaIdList}
                          className={
                            formikCoverageForm.errors.talukaId &&
                            formikCoverageForm.touched.talukaId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'talukaId',
                              option && option.value
                            );
                            // getTaluka(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      ) : (
                        <Select
                          ref={selectTalukaRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='talukaId'
                          isClearable={true}
                          value={
                            talukaIdList
                              ? talukaIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.talukaId
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                          className={
                            formikCoverageForm.errors.talukaId &&
                            formikCoverageForm.touched.talukaId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'talukaId',
                              option && option.value
                            );
                            // getTaluka(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      )}
                      <div className='invalid-feedback'>
                        {formikCoverageForm.errors.talukaId
                          ? formikCoverageForm.errors.talukaId
                          : null}
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'>Zone</Form.Label>
                      {zoneData && zoneData.length !== 0 ? (
                        <Select
                          ref={selectZoneRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='zoneId'
                          isClearable={true}
                          value={
                            zoneIdList
                              ? zoneIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.zoneId
                                )
                              : 0
                          }
                          options={zoneIdList}
                          className={
                            formikCoverageForm.errors.zoneId &&
                            formikCoverageForm.touched.zoneId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'zoneId',
                              option && option.value
                            );
                            // getZone(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      ) : (
                        <Select
                          ref={selectZoneRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='zoneId'
                          isClearable={true}
                          value={
                            zoneIdList
                              ? zoneIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.zoneId
                                )
                              : 0
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                          className={
                            formikCoverageForm.errors.zoneId &&
                            formikCoverageForm.touched.zoneId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'zoneId',
                              option && option.value
                            );
                            // getZone(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      )}
                      <div className='invalid-feedback'>
                        {formikCoverageForm.errors.zoneId
                          ? formikCoverageForm.errors.zoneId
                          : null}
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'>Facility*</Form.Label>
                      {facilityIdValues && facilityIdValues.length !== 0 ? (
                        <Select
                          ref={selectFacilityRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='facilityId'
                          isClearable={true}
                          value={
                            facilityIdList
                              ? facilityIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.facilityId
                                )
                              : ''
                          }
                          options={facilityIdList}
                          className={
                            formikCoverageForm.errors.facilityId &&
                            formikCoverageForm.touched.facilityId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'facilityId',
                              option && option.value
                            );
                            getFacility(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      ) : (
                        <Select
                          ref={selectFacilityRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='facilityId'
                          isClearable={true}
                          value={
                            facilityIdList
                              ? facilityIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.facilityId
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                          className={
                            formikCoverageForm.errors.facilityId &&
                            formikCoverageForm.touched.facilityId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'facilityId',
                              option && option.value
                            );
                            getFacility(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      )}
                      <div className='invalid-feedback'>
                        {formikCoverageForm.errors.facilityId
                          ? formikCoverageForm.errors.facilityId
                          : null}
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'>Sub Center*</Form.Label>
                      {subCenterIdValues && subCenterIdValues.length !== 0 ? (
                        <Select
                          ref={selectSubcenterRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='subCenterId'
                          isClearable={true}
                          value={
                            subCenterIdList
                              ? subCenterIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.subCenterId
                                )
                              : ''
                          }
                          options={subCenterIdList}
                          className={
                            formikCoverageForm.errors.subCenterId &&
                            formikCoverageForm.touched.subCenterId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'subCenterId',
                              option && option.value
                            );
                            getSubCenter(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      ) : (
                        <Select
                          ref={selectSubcenterRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='subCenterId'
                          isClearable={true}
                          value={
                            subCenterIdList
                              ? subCenterIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.subCenterId
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                          className={
                            formikCoverageForm.errors.subCenterId &&
                            formikCoverageForm.touched.subCenterId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'subCenterId',
                              option && option.value
                            );
                            getSubCenter(option);
                          }}
                          aria-label='Default select example'
                        ></Select>
                      )}
                      <div className='invalid-feedback'>
                        {formikCoverageForm.errors.subCenterId
                          ? formikCoverageForm.errors.subCenterId
                          : null}
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'>Village*</Form.Label>
                      {villageIdValues && villageIdValues.length !== 0 ? (
                        <Select
                          ref={selectVillageRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='villageId'
                          isClearable={true}
                          value={
                            villageIdList
                              ? villageIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.villageId
                                )
                              : ''
                          }
                          options={villageIdList}
                          className={
                            formikCoverageForm.errors.villageId &&
                            formikCoverageForm.touched.villageId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'villageId',
                              option && option.value
                            );
                          }}
                          aria-label='Default select example'
                        ></Select>
                      ) : (
                        <Select
                          ref={selectVillageRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='villageId'
                          isClearable={true}
                          value={
                            villageIdList
                              ? villageIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.villageId
                                )
                              : ''
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                          className={
                            formikCoverageForm.errors.villageId &&
                            formikCoverageForm.touched.villageId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'villageId',
                              option && option.value
                            );
                          }}
                          aria-label='Default select example'
                        ></Select>
                      )}
                      <div className='invalid-feedback'>
                        {formikCoverageForm.errors.villageId
                          ? formikCoverageForm.errors.villageId
                          : null}
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'>Ward*</Form.Label>
                      {wardIdValues && wardIdValues.length !== 0 ? (
                        <Select
                          ref={selectWardRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='wardId'
                          isClearable={true}
                          value={
                            wardIdList
                              ? wardIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.wardId
                                )
                              : 0
                          }
                          options={wardIdList}
                          className={
                            formikCoverageForm.errors.wardId &&
                            formikCoverageForm.touched.wardId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'wardId',
                              option && option.value
                            );
                          }}
                          aria-label='Default select example'
                        ></Select>
                      ) : (
                        <Select
                          ref={selectWardRef}
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='wardId'
                          isClearable={true}
                          value={
                            wardIdList
                              ? wardIdList.find(
                                  (option) =>
                                    option.value ===
                                    formikCoverageForm.values.wardId
                                )
                              : 0
                          }
                          options={NoneList}
                          defaultValue={NoneList}
                          className={
                            formikCoverageForm.errors.wardId &&
                            formikCoverageForm.touched.wardId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          onChange={(option: Option) => {
                            formikCoverageForm.setFieldValue(
                              'wardId',
                              option && option.value
                            );
                          }}
                          aria-label='Default select example'
                        ></Select>
                      )}
                      <div className='invalid-feedback'>
                        {formikCoverageForm.errors.wardId
                          ? formikCoverageForm.errors.wardId
                          : null}
                      </div>
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'>Year*</Form.Label>

                      <Select
                        name='year'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        isClearable='true'
                        className={
                          formikCoverageForm.errors.year &&
                          formikCoverageForm.touched.year
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        value={
                          yearList
                            ? yearList.find(
                                (option: any) =>
                                  option &&
                                  option.value ===
                                    formikCoverageForm.values.year
                              )
                            : ''
                        }
                        options={yearList}
                        onChange={(option: Option) => {
                          formikCoverageForm.setFieldValue(
                            'year',
                            option && option.value
                          );
                        }}
                      ></Select>
                      <div className='invalid-feedback'>
                        {formikCoverageForm.errors.year
                          ? formikCoverageForm.errors.year
                          : null}
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'>Month*</Form.Label>
                      <Select
                        name='month'
                        isDisabled={
                          location.state && location.state.view ? true : false
                        }
                        styles={commonFunction.customStyles}
                        className={
                          formikCoverageForm.errors.month &&
                          formikCoverageForm.touched.month
                            ? 'custom-select is-invalid'
                            : 'custom-select'
                        }
                        options={monthList}
                        isClearable='true'
                        onChange={(option: Option) => {
                          formikCoverageForm.setFieldValue(
                            'month',
                            option && option.value
                          );
                        }}
                        value={
                          monthList
                            ? monthList.find(
                                (option: any) =>
                                  option &&
                                  option.value ==
                                    formikCoverageForm.values.month
                              )
                            : ''
                        }
                      ></Select>
                      <div className='invalid-feedback'>
                        {formikCoverageForm.errors.month
                          ? formikCoverageForm.errors.month
                          : null}
                      </div>
                    </Form.Group>
                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'> Area</Form.Label>
                      <Form.Control
                        type='text'
                        onInput={(event) => commonFunction.onlyAlphabets(event)}
                        name='area'
                        value={formikCoverageForm.values.area}
                        onChange={formikCoverageForm.handleChange}
                        onKeyPress={(e) => commonFunction.keyPress(e)}
                      />
                    </Form.Group>

                    <Form.Group
                      as={Col}
                      md='6'
                      xl='3'
                      xs='12'
                      className='form-grp'
                    >
                      <Form.Label className='font-chng'>
                        Total Population
                      </Form.Label>
                      <Form.Control
                        type='number'
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className={
                          formikCoverageForm.errors.totalPopulation &&
                          formikCoverageForm.touched.totalPopulation
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        name='totalPopulation'
                        value={formikCoverageForm.values.totalPopulation}
                        onChange={formikCoverageForm.handleChange}
                      />
                      {/* <div className="invalid-feedback">{formikCoverageForm.errors.totalPopulation ? formikCoverageForm.errors.totalPopulation : null}</div> */}
                    </Form.Group>
                    <Form.Group as={Col} md='6' xl='3' className='form-grp'>
                      <Form.Label className='font-chng'>
                        Eligible Population for MDA/IDA
                      </Form.Label>
                      <Form.Control
                        type='number'
                        onKeyDown={(e) =>
                          symbolsArr.includes(e.key) && e.preventDefault()
                        }
                        className={
                          formikCoverageForm.errors.eligiblePopulation &&
                          formikCoverageForm.touched.eligiblePopulation
                            ? 'form-control is-invalid'
                            : 'form-control'
                        }
                        min='0'
                        onWheel={(e) => commonFunction.handleWheelEvent(e)}
                        name='eligiblePopulation'
                        value={formikCoverageForm.values.eligiblePopulation}
                        onChange={formikCoverageForm.handleChange}
                      />
                      <Form.Label className='invalid-feedback'>
                        {formikCoverageForm.errors.eligiblePopulation
                          ? formikCoverageForm.errors.eligiblePopulation
                          : null}
                      </Form.Label>
                    </Form.Group>
                  </Row>
                </fieldset>
                {/* <div className="form-grp text-right col-md-12">
                  <button type="submit" onClick={() => history.push(listDESheetName)} className="btn btn-outline-light font-chng">
                    Cancel
                  </button>
                  <button id="Submitbtnid" type="submit" className="mt-m btn btn-secondary btn-pad font-chng">
                    Next
                  </button>
                </div> */}
                <div className='buttongrouprightend mb-4'>
                  <button
                    type='submit'
                    onClick={() => history.push(listDESheetName)}
                    className='btn btn-primary font-chng'
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#34c38f',
                      border: '0px',
                      color: ' #ffffff',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    id='Submitbtnid'
                    className='btn btn-primary font-chng'
                    type='submit'
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#34c38f',
                      border: '0px',
                      color: ' #ffffff',
                    }}
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
        {activeStep === 1 && !showRegularForm && (
          <>
            <div id='stepper2' className='mt40'>
              <div>
                <div className='row'>
                  <div className='col-md-9'>
                    <h4 className='formtitlenew font-chng'>
                      Regular Report List
                    </h4>
                  </div>
                  {location && location.state && location.state.view ? (
                    ' '
                  ) : (
                    <div className='col-md-3 d-flex flex-row-reverse'>
                      <Button
                        variant='secondary'
                        className='mt-m font-chng m-3'
                        onClick={(e) => {
                          e.preventDefault();
                          setmdaIdaCoverageRegularInitialState(
                            mdaIdaCoverageRegularInitialValues
                          );
                          requiredHospitalStayHandleChange(
                            mdaIdaCoverageRegularInitialValues.isRequiredHospitalStay
                          );
                          RegularForm();
                        }}
                      >
                        <img src={plusImg} className='pe-2' />
                        Add New
                      </Button>
                    </div>
                  )}
                </div>
                <div className='post-tablenew font-chng cus-table'>
                  <DataTable
                    columns={Regularcolumns}
                    data={mdaIdaCoverageRegularList}
                    expandableRows={true}
                    //expandOnRowClicked={true}
                    expandableRowsComponent={<AccordionComponent />}
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
                  <button
                    type="button"
                    onClick={handleBack}
                    className="btn btn-outline-light font-chng"
                  >
                    <i className="fas fa-arrow-left"></i>Back
                  </button>
                  <button
                    type="button"
                    onClick={
                      handleStep(2)
                    }

                    className="btn btn-secondary font-chng"
                  >
                    Next
                  </button>
                </div> */}
              </div>
            </div>
            <div className='buttongrouprightend mb-4'>
              <button
                type='submit'
                onClick={handleBack}
                className='btn btn-primary font-chng'
                style={{
                  marginRight: '10px',
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                }}
              >
                Back
              </button>
              <button
                id='Submitbtnid'
                className='btn btn-primary font-chng'
                type='submit'
                onClick={handleStep(2)}
                style={{
                  marginRight: '10px',
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                }}
              >
                Next
              </button>
            </div>
          </>
        )}
        {activeStep === 1 && showRegularForm && (
          <>
            <div id='stepper2-subpage' className='mt40'>
              <FormikProvider value={formikCoverageRegularForm}>
                <Form
                  onClick={showToast}
                  onSubmit={formikCoverageRegularForm.handleSubmit}
                  onChange={formikCoverageRegularForm.handleChange}
                  className='card-body'
                >
                  <fieldset
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  >
                    <Row className='mb-3'>
                      <Form.Group as={Col} xl='3' md='6' className='form-grp'>
                        <Form.Label className='font-chng'>Regular*</Form.Label>

                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='regular'
                          aria-label='Default select example'
                          isClearable='true'
                          className={
                            formikCoverageRegularForm.errors.regular &&
                            formikCoverageRegularForm.touched.regular
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            RegularNumberList
                              ? RegularNumberList.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formikCoverageRegularForm.values.regular
                                )
                              : ''
                          }
                          options={RegularNumberList}
                          onChange={(option: Option) => {
                            formikCoverageRegularForm.setFieldValue(
                              'regular',
                              option && option.value
                            );
                          }}
                        ></Select>
                        <Form.Label className='invalid-feedback'>
                          {formikCoverageRegularForm.errors.regular
                            ? formikCoverageRegularForm.errors.regular
                            : null}
                        </Form.Label>
                      </Form.Group>
                      <Form.Group as={Col} xl='3' md='6' className='form-grp'>
                        <Form.Label className='font-chng'>
                          {' '}
                          No of people administered MDA/IDA Drugs
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPeopleAdministered'
                          value={
                            formikCoverageRegularForm.values
                              .noOfPeopleAdministered
                          }
                          onChange={formikCoverageRegularForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons with Fever
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsWithFever'
                          value={
                            formikCoverageRegularForm.values
                              .noOfPersonsWithFever
                          }
                          onChange={formikCoverageRegularForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons with Headache
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsWithHeadache'
                          value={
                            formikCoverageRegularForm.values
                              .noOfPersonsWithHeadache
                          }
                          onChange={formikCoverageRegularForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons with Bodyache
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsWithBodyache'
                          value={
                            formikCoverageRegularForm.values
                              .noOfPersonsWithBodyache
                          }
                          onChange={formikCoverageRegularForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons with Nausea
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsWithNausea'
                          value={
                            formikCoverageRegularForm.values
                              .noOfPersonsWithNausea
                          }
                          onChange={formikCoverageRegularForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons with Vomitting
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsWithVomiting'
                          value={
                            formikCoverageRegularForm.values
                              .noOfPersonsWithVomiting
                          }
                          onChange={formikCoverageRegularForm.handleChange}
                        />
                      </Form.Group>
                      {/* <Form.Group as={Col} md="6" xl="4" xs="12" className="form-grp">
                        <Form.Label className="font-chng">Clinical outcome</Form.Label>
                        <Select isDisabled={location.state && location.state.view ? true : false}
                          styles={commonFunction.customStyles}
                          name="clinicalOutcome"
                          aria-label="Default select example"
                          value={clinicalOutcomeIdList ? clinicalOutcomeIdList.find((option: any) => option && option.value === formikCoverageRegularForm.values.clinicalOutcome) : ''}
                          options={clinicalOutcomeIdList}
                          onChange={(option: Option) => {
                            formikCoverageRegularForm.setFieldValue("clinicalOutcome", option && option.value);
                          }}>

                        </Select>
                      </Form.Group> */}
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons Recovered
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsRecovered'
                          value={
                            formikCoverageRegularForm.values
                              .noOfPersonsRecovered
                          }
                          onChange={formikCoverageRegularForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons Not Recovered
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsNotRecovered'
                          value={
                            formikCoverageRegularForm.values
                              .noOfPersonsNotRecovered
                          }
                          onChange={formikCoverageRegularForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group as={Col} md='6' xl='3' className='form-grp'>
                        <Form.Label className='font-chng'>
                          Is Required Hospital Stay
                        </Form.Label>
                        <div className='radio-box '>
                          <Field
                            className='form-check-input'
                            inline
                            label='Yes'
                            name='isRequiredHospitalStay'
                            type='radio'
                            defaultChecked={
                              formikCoverageRegularForm.values
                                .isRequiredHospitalStay === 'true'
                            }
                            value='true'
                            onChange={(e) => {
                              requiredHospitalStayHandleChange('true');
                            }}
                          />
                          <Form.Label className='form-check-label font-chng'>
                            Yes
                          </Form.Label>
                          <Field
                            className='form-check-input'
                            inline
                            label='No'
                            name='isRequiredHospitalStay'
                            defaultChecked={
                              formikCoverageRegularForm.values
                                .isRequiredHospitalStay === 'false'
                            }
                            value='false'
                            onChange={(e) => {
                              requiredHospitalStayHandleChange('false');
                            }}
                            type='radio'
                          />
                          <Form.Label className='form-check-label font-chng'>
                            No
                          </Form.Label>
                        </div>
                      </Form.Group>
                      {requiredHospitalStay && (
                        <Form.Group
                          as={Col}
                          md='6'
                          xl='3'
                          xs='12'
                          className='form-grp'
                        >
                          <Form.Label className='font-chng'>
                            {' '}
                            No Of Persons Requried Hospital Stay*
                          </Form.Label>
                          <Form.Control
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            name='noOfPersonsRequiredHospitalStay'
                            value={
                              formikCoverageRegularForm.values
                                .noOfPersonsRequiredHospitalStay
                                ? formikCoverageRegularForm.values
                                    .noOfPersonsRequiredHospitalStay
                                : ''
                            }
                            className={
                              formikCoverageRegularForm.errors
                                .noOfPersonsRequiredHospitalStay &&
                              formikCoverageRegularForm.touched
                                .noOfPersonsRequiredHospitalStay
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            onChange={formikCoverageRegularForm.handleChange}
                          />
                        </Form.Group>
                      )}
                      <Form.Group
                        className='form-grp row'
                        controlId='exampleForm.ControlTextarea1'
                      >
                        <div className='col-xl-6 col-md-6 col-xs-12'>
                          <Form.Label className='font-chng'>Remarks</Form.Label>
                          <Form.Control
                            as='textarea'
                            rows={6}
                            name='remarks'
                            value={formikCoverageRegularForm.values.remarks}
                            onChange={formikCoverageRegularForm.handleChange}
                          />
                        </div>
                      </Form.Group>
                    </Row>

                    <h4 className='form-title font-chng'>Others</h4>

                    <FieldArray
                      name='mdaIDACoverageOthersLists'
                      render={(arrayHelpers: any) => (
                        <div className='mb-3'>
                          {formikCoverageRegularForm.values.mdaIDACoverageOthersLists.map(
                            (mdaIDACoverageOthersLists, index) => (
                              <div key={index}>
                                <Row className=''>
                                  <Form.Group
                                    as={Col}
                                    md='5'
                                    xl='3'
                                    xs='12'
                                    className='form-grp'
                                  >
                                    <Form.Label className='font-chng'>
                                      {' '}
                                      Adverse Experiences
                                    </Form.Label>
                                    <Form.Control
                                      type='text'
                                      onInput={(event) =>
                                        commonFunction.onlyAlphabets(event)
                                      }
                                      name={`mdaIDACoverageOthersLists[${index}].otherAdverseExp`}
                                      onChange={
                                        formikCoverageRegularForm.handleChange
                                      }
                                      value={
                                        formikCoverageRegularForm.values
                                          .mdaIDACoverageOthersLists[index]
                                          .otherAdverseExp
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group
                                    as={Col}
                                    md='5'
                                    xl='3'
                                    xs='12'
                                    className='form-grp'
                                  >
                                    <Form.Label className='font-chng'>
                                      {' '}
                                      No of people with Adverse Experiences
                                    </Form.Label>
                                    <Form.Control
                                      type='number'
                                      min='0'
                                      onWheel={(e) =>
                                        commonFunction.handleWheelEvent(e)
                                      }
                                      onKeyDown={(e) =>
                                        symbolsArr.includes(e.key) &&
                                        e.preventDefault()
                                      }
                                      name={`mdaIDACoverageOthersLists[${index}].noOfPersonsWithOtherAdverseExp`}
                                      onChange={
                                        formikCoverageRegularForm.handleChange
                                      }
                                      value={
                                        formikCoverageRegularForm.values
                                          .mdaIDACoverageOthersLists[index]
                                          .noOfPersonsWithOtherAdverseExp
                                      }
                                    />
                                  </Form.Group>
                                  <div className='col-xl-3 col-md-6 col-xs-12'></div>
                                  {location &&
                                  location.state &&
                                  location.state.view ? (
                                    ''
                                  ) : (
                                    <Form.Group
                                      as={Col}
                                      md='2'
                                      xl='3'
                                      className='form-grp cvr-btn'
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'row-reverse',
                                        }}
                                      >
                                        <button
                                          type='button'
                                          disabled={index ? false : true}
                                          className='btn'
                                          style={{ display: 'inline-block' }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            arrayHelpers.remove(index);
                                            addField(arrayHelpers);
                                          }}
                                        >
                                          <img
                                            src={deletebx}
                                            className='cursor'
                                          />
                                        </button>
                                        {index ===
                                          formikCoverageRegularForm.values
                                            .mdaIDACoverageOthersLists.length -
                                            1 && (
                                          <Button
                                            type='button'
                                            className='fnt-btn btn btn-secondary m'
                                            style={{
                                              display: 'inline-block',
                                              marginRight: '10px',
                                            }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              arrayHelpers.push({
                                                mdaIDACoverageId: '',
                                                otherAdverseExp: '',
                                                noOfPersonsWithOtherAdverseExp: 0,
                                              });
                                            }}
                                          >
                                            Add
                                          </Button>
                                        )}
                                      </div>
                                    </Form.Group>
                                  )}
                                </Row>
                              </div>
                            )
                          )}
                          {/* <Form.Group as={Col} xl="11" className="form-grp text-right">
              <button type="button" className={(location && location.state && location.state.view || isRegularView ? "d-none" : "mt-m btn btn-secondary")}
              onClick={(e) =>{ e.preventDefault();
                arrayHelpers.push({mdaIDACoverageId:"", otherAdverseExp: "", noOfPersonsWithOtherAdverseExp: ""})}} >
                Add
              </button>
            </Form.Group> */}
                        </div>
                      )}
                    />
                  </fieldset>
                  {/* <div className="form-grp text-right col-md-12">
                    <button
                      type="button"
                      onClick={RegularList}
                      className="btn btn-outline-light font-chng"
                    >
                      <i className="fas fa-arrow-left"></i>Back
                    </button>{location && location.state && location.state.view ? "" :
                      <button id="Submitbtnid2" type="submit" className="mt-m btn btn-secondary btn-pad font-chng">
                        Submit
                      </button>
                    }
                  </div> */}
                  <div className='buttongrouprightend mb-4'>
                    <button
                      type='submit'
                      onClick={RegularList}
                      className='btn btn-primary font-chng'
                      style={{
                        marginRight: '10px',
                        backgroundColor: '#34c38f',
                        border: '0px',
                        color: ' #ffffff',
                      }}
                    >
                      Back
                    </button>
                    {location && location.state && location.state.view ? (
                      ''
                    ) : (
                      <button
                        id='Submitbtnid2'
                        className='btn btn-primary font-chng'
                        type='submit'
                        style={{
                          // marginRight: '10px',
                          backgroundColor: '#34c38f',
                          border: '0px',
                          color: ' #ffffff',
                        }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </Form>
              </FormikProvider>
            </div>
          </>
        )}
        {activeStep == 2 && !showMopUpForm && (
          <>
            {/* STEPPER 3 */}
            <div className='mt40'>
              {/* datatable stepper3 */}
              <div>
                <div className='row'>
                  <div className='col-md-9'>
                    <h4 className='formtitlenew font-chng'>
                      Mopup Report List
                    </h4>
                  </div>
                  {location && location.state && location.state.view ? (
                    ''
                  ) : (
                    <div className='col-md-3 d-flex flex-row-reverse'>
                      <Button
                        variant='secondary'
                        className={
                          location && location.state && location.state.view
                            ? 'd-none'
                            : 'mt-m font-chng m-3'
                        }
                        onClick={(e) => {
                          e.preventDefault();
                          setmdaIdaCoverageMopUpInitialState(
                            mdaIdaCoverageMopUpInitialValues
                          );
                          requiredHospitalStayHandleChange1(
                            mdaIdaCoverageMopUpInitialValues.isRequiredHospitalStay
                          );

                          MopUpForm();
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
                    columns={MopUpcolumns}
                    data={mdaIdaCoverageMopUpList}
                    expandableRows={true}
                    // expandOnRowClicked={true}
                    expandableRowsComponent={<AccordionComponentMopUp />}
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
                {/* <div className="form-grp text-right"> */}
                {/* <button
                    type="button"
                    onClick={handleStep(1)}
                    className="btn btn-outline-light font-chng"
                  >
                    <i className="fas fa-arrow-left"></i>Back
                  </button>
                  {location && location.state && location.state.id ?
                    null
                    :
                    <button
                      type="button"
                      onClick={() => moveToListPage()}
                      className="btn btn-secondary font-chng"
                      disabled={location && location.state && location.state.id ? true : false}
                      style={{ marginRight: 15 }}
                    >
                      Save as Draft
                    </button>
                  } */}
                {/* &nbsp; &nbsp; */}
                {/* <button
                    type="button"
                    onClick={() => moveToListPage()}
                    className="btn btn-secondary font-chng"
                    disabled={location && location.state && location.state.id ? true : false}
                  >
                    Save as Draft
                  </button> */}

                {/* {isOnline &&
                    <button
                      type="button"
                      onClick={() => finishSave()}
                      className="mt-m btn btn-secondary"
                      disabled={!isOnline ? true : false}
                    >
                      Save
                    </button>} */}
                {/* </div> */}

                <div className='buttongrouprightend mb-4'>
                  <button
                    type='button'
                    onClick={handleStep(1)}
                    className='btn btn-primary font-chng'
                    style={{
                      marginRight: '10px',
                      backgroundColor: '#34c38f',
                      border: '0px',
                      color: ' #ffffff',
                    }}
                  >
                    Back
                  </button>
                  {location && location.state && location.state.id ? null : (
                    <button
                      type='button'
                      onClick={() => moveToListPage()}
                      className='btn btn-primary font-chng'
                      disabled={
                        location && location.state && location.state.id
                          ? true
                          : false
                      }
                      style={{
                        marginRight: '10px',
                        backgroundColor: '#34c38f',
                        border: '0px',
                        color: ' #ffffff',
                      }}
                    >
                      Save as Draft
                    </button>
                  )}
                  {isOnline && (
                    <button
                      id='Submitbtnid'
                      className='btn btn-primary font-chng'
                      type='button'
                      onClick={() => finishSave()}
                      disabled={!isOnline ? (isDisabled ? true : false) : false}
                      style={{
                        marginRight: '10px',
                        backgroundColor: '#34c38f',
                        border: '0px',
                        color: ' #ffffff',
                      }}
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
        {activeStep == 2 && showMopUpForm && (
          <>
            <div id='stepper2-subpage' className='mt40'>
              <FormikProvider value={formikCoverageMopUpForm}>
                <Form
                  onClick={showToast}
                  onSubmit={formikCoverageMopUpForm.handleSubmit}
                  onChange={formikCoverageMopUpForm.handleChange}
                  className='card-body'
                >
                  <fieldset
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  >
                    <Row className='mb-3'>
                      <Form.Group as={Col} md='6' xl='3' className='form-grp'>
                        <Form.Label className='font-chng'>MopUp*</Form.Label>

                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='mopUp'
                          aria-label='Default select example'
                          isClearable='true'
                          className={
                            formikCoverageMopUpForm.errors.mopUp &&
                            formikCoverageMopUpForm.touched.mopUp
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            MopUpNumberList
                              ? MopUpNumberList.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formikCoverageMopUpForm.values.mopUp
                                )
                              : ''
                          }
                          options={MopUpNumberList}
                          onChange={(option: Option) => {
                            formikCoverageMopUpForm.setFieldValue(
                              'mopUp',
                              option && option.value
                            );
                          }}
                        ></Select>
                        <Form.Label className='invalid-feedback'>
                          {formikCoverageMopUpForm.errors.mopUp
                            ? formikCoverageMopUpForm.errors.mopUp
                            : null}
                        </Form.Label>
                      </Form.Group>
                      <Form.Group as={Col} md='6' xl='3' className='form-grp'>
                        <Form.Label className='font-chng'>
                          {' '}
                          No of people administered MDA/IDA Drugs
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPeopleAdministered'
                          value={
                            formikCoverageMopUpForm.values
                              .noOfPeopleAdministered
                          }
                          onChange={formikCoverageMopUpForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons with Fever
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsWithFever'
                          value={
                            formikCoverageMopUpForm.values.noOfPersonsWithFever
                          }
                          onChange={formikCoverageMopUpForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons with Headache
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsWithHeadache'
                          value={
                            formikCoverageMopUpForm.values
                              .noOfPersonsWithHeadache
                          }
                          onChange={formikCoverageMopUpForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons with Bodyache
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsWithBodyache'
                          value={
                            formikCoverageMopUpForm.values
                              .noOfPersonsWithBodyache
                          }
                          onChange={formikCoverageMopUpForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons with Nausea
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsWithNausea'
                          value={
                            formikCoverageMopUpForm.values.noOfPersonsWithNausea
                          }
                          onChange={formikCoverageMopUpForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons with Vomitting
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsWithVomiting'
                          value={
                            formikCoverageMopUpForm.values
                              .noOfPersonsWithVomiting
                          }
                          onChange={formikCoverageMopUpForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons Recovered
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsRecovered'
                          value={
                            formikCoverageMopUpForm.values.noOfPersonsRecovered
                          }
                          onChange={formikCoverageMopUpForm.handleChange}
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        md='6'
                        xl='3'
                        xs='12'
                        className='form-grp'
                      >
                        <Form.Label className='font-chng'>
                          {' '}
                          No Of Persons Not Recovered
                        </Form.Label>
                        <Form.Control
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          name='noOfPersonsNotRecovered'
                          value={
                            formikCoverageMopUpForm.values
                              .noOfPersonsNotRecovered
                          }
                          onChange={formikCoverageMopUpForm.handleChange}
                        />
                      </Form.Group>
                      {/* <Form.Group as={Col} md="6" xl="4" xs="12" className="form-grp">
                        <Form.Label className="font-chng">Clinical outcome</Form.Label>
                        <Select isDisabled={location.state && location.state.view ? true : false}
                          styles={commonFunction.customStyles}
                          name="clinicalOutcome" aria-label="Default select example"
                          value={clinicalOutcomeIdList ? clinicalOutcomeIdList.find((option: any) => option && option.value === formikCoverageMopUpForm.values.clinicalOutcome) : ''}
                          options={clinicalOutcomeIdList}
                          onChange={(option: Option) => {
                            formikCoverageMopUpForm.setFieldValue("clinicalOutcome", option && option.value);
                          }}>

                        </Select>
                      </Form.Group> */}
                      <Form.Group as={Col} md='6' xl='3' className='form-grp'>
                        <Form.Label className='font-chng'>
                          Is Required Hospital Stay
                        </Form.Label>
                        <div className='radio-box'>
                          <Field
                            className='form-check-input'
                            label='Yes'
                            name='isRequiredHospitalStay'
                            type='radio'
                            defaultChecked={
                              formikCoverageMopUpForm.values
                                .isRequiredHospitalStay === 'true'
                            }
                            value='true'
                            onChange={(e) => {
                              requiredHospitalStayHandleChange1('true');
                            }}
                            // onChange={formikCoverageMopUpForm.handleChange}
                          />
                          <Form.Label className='form-check-label form-label'>
                            Yes
                          </Form.Label>
                          <Field
                            className='form-check-input'
                            label='No'
                            name='isRequiredHospitalStay'
                            defaultChecked={
                              formikCoverageMopUpForm.values
                                .isRequiredHospitalStay === 'false'
                            }
                            value='false'
                            onChange={(e) => {
                              requiredHospitalStayHandleChange1('false');
                            }}
                            //   onChange={formikCoverageMopUpForm.handleChange}
                            type='radio'
                          />
                          <Form.Label className='form-check-label form-label'>
                            No
                          </Form.Label>
                        </div>
                      </Form.Group>
                      {requiredHospitalStay1 && (
                        <Form.Group
                          as={Col}
                          md='6'
                          xl='3'
                          xs='12'
                          className='form-grp'
                        >
                          <Form.Label className='font-chng'>
                            {' '}
                            No Of Persons Requried Hospital Stay*
                          </Form.Label>
                          <Form.Control
                            type='number'
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                            //onKeyDown={e => symbolsArr.includes(e.key) && e.preventDefault()}
                            name='noOfPersonsRequiredHospitalStay'
                            value={
                              formikCoverageMopUpForm.values
                                .noOfPersonsRequiredHospitalStay
                                ? formikCoverageMopUpForm.values
                                    .noOfPersonsRequiredHospitalStay
                                : ''
                            }
                            className={
                              formikCoverageMopUpForm.errors
                                .noOfPersonsRequiredHospitalStay &&
                              formikCoverageMopUpForm.touched
                                .noOfPersonsRequiredHospitalStay
                                ? 'custom-select is-invalid'
                                : 'custom-select'
                            }
                            onChange={formikCoverageMopUpForm.handleChange}
                          />
                        </Form.Group>
                      )}
                      <Form.Group
                        className='mb-3 row'
                        controlId='exampleForm.ControlTextarea1'
                      >
                        <div className='col-xl-6 col-md-6 col-xs-12'>
                          <Form.Label className='font-chng'>Remarks</Form.Label>
                          <Form.Control
                            as='textarea'
                            rows={6}
                            name='remarks'
                            value={formikCoverageMopUpForm.values.remarks}
                            onChange={formikCoverageMopUpForm.handleChange}
                          />
                        </div>
                      </Form.Group>
                    </Row>

                    <h4 className='form-title form-label'>Others</h4>

                    <FieldArray
                      name='mdaIDACoverageOthersLists'
                      render={(arrayHelpers: any) => (
                        <div className='mb-3'>
                          {formikCoverageMopUpForm.values.mdaIDACoverageOthersLists.map(
                            (mdaIDACoverageOthersLists, index) => (
                              <div key={index}>
                                <Row className=''>
                                  <Form.Group
                                    as={Col}
                                    md='6'
                                    xl='3'
                                    xs='12'
                                    className='form-grp'
                                  >
                                    <Form.Label className='font-chng'>
                                      {' '}
                                      Adverse Experiences
                                    </Form.Label>
                                    <Form.Control
                                      type='text'
                                      onInput={(event) =>
                                        commonFunction.onlyAlphabets(event)
                                      }
                                      name={`mdaIDACoverageOthersLists[${index}].otherAdverseExp`}
                                      onChange={
                                        formikCoverageMopUpForm.handleChange
                                      }
                                      value={
                                        formikCoverageMopUpForm.values
                                          .mdaIDACoverageOthersLists[index]
                                          .otherAdverseExp
                                      }
                                    />
                                  </Form.Group>
                                  <Form.Group
                                    as={Col}
                                    md='6'
                                    xl='3'
                                    xs='12'
                                    className='form-grp'
                                  >
                                    <Form.Label className='font-chng'>
                                      {' '}
                                      No of people with Adverse Experiences
                                    </Form.Label>
                                    <Form.Control
                                      type='number'
                                      min='0'
                                      onWheel={(e) =>
                                        commonFunction.handleWheelEvent(e)
                                      }
                                      onKeyDown={(e) =>
                                        symbolsArr.includes(e.key) &&
                                        e.preventDefault()
                                      }
                                      name={`mdaIDACoverageOthersLists[${index}].noOfPersonsWithOtherAdverseExp`}
                                      onChange={
                                        formikCoverageMopUpForm.handleChange
                                      }
                                      value={
                                        formikCoverageMopUpForm.values
                                          .mdaIDACoverageOthersLists[index]
                                          .noOfPersonsWithOtherAdverseExp
                                      }
                                    />
                                  </Form.Group>
                                  <div className='col-xl-3 col-md-6 col-xs-12'></div>
                                  {location &&
                                  location.state &&
                                  location.state.view ? (
                                    ''
                                  ) : (
                                    <Form.Group
                                      as={Col}
                                      md='2'
                                      xl='3'
                                      className='form-grp cvr-btn'
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'row-reverse',
                                        }}
                                      >
                                        <button
                                          type='button'
                                          disabled={index ? false : true}
                                          className='btn'
                                          style={{ display: 'inline-block' }}
                                          onClick={(e) => {
                                            e.preventDefault();
                                            arrayHelpers.remove(index);
                                            addField1(arrayHelpers);
                                          }}
                                        >
                                          <img
                                            src={deletebx}
                                            className='cursor'
                                          />
                                        </button>
                                        {index ===
                                          formikCoverageMopUpForm.values
                                            .mdaIDACoverageOthersLists.length -
                                            1 && (
                                          <Button
                                            type='button'
                                            className='fnt-btn btn btn-secondary m'
                                            style={{
                                              display: 'inline-block',
                                              marginRight: '10px',
                                            }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              arrayHelpers.push({
                                                mdaIDACoverageId: '',
                                                otherAdverseExp: '',
                                                noOfPersonsWithOtherAdverseExp: 0,
                                              });
                                            }}
                                          >
                                            Add
                                          </Button>
                                        )}
                                      </div>
                                    </Form.Group>
                                  )}
                                  {/* {location && location.state && location.state.view ? "" :
                                  <Form.Group as={Col} md="2" className="form-grp cvr-btn">
                                    <button className="btn pt-xs form-label font-chng" onClick={(e) => {
                                      e.preventDefault();
                                      arrayHelpers.remove(index);
                                      addField1(arrayHelpers)
                                    }}>
                                      <img src={deletebx} className="cursor" />
                                    </button>
                                    <button type="button" className="btn btn-secondary font-chng"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        arrayHelpers.push({ mdaIDACoverageId: "", otherAdverseExp: "", noOfPersonsWithOtherAdverseExp: 0 })
                                      }} >
                                      Add
                                    </button>
                                  </Form.Group>
                                } */}
                                </Row>
                              </div>
                            )
                          )}
                          {/* <Form.Group as={Col} md="11" className="form-grp text-right">
              <button type="button" className={(location && location.state && location.state.view || isMopUpView ? "d-none" : "mt-m btn btn-secondary")}
              onClick={(e) =>{ e.preventDefault();
                arrayHelpers.push({ mdaIDACoverageId:"",otherAdverseExp: "", noOfPersonsWithOtherAdverseExp: ""})}} >
                Add
              </button>
            </Form.Group> */}
                        </div>
                      )}
                    />
                  </fieldset>
                  {/* <div className="form-grp text-right col-md-12">
                    <button
                      type="button"
                      onClick={MopUpList}
                      className="btn btn-outline-light form-label"
                    >
                      <i className="fas fa-arrow-left"></i>Back
                    </button>
                    {location && location.state && location.state.view ? "" :
                      <button id="Submitbtnid3" type="submit" className="mt-m btn btn-secondary btn-pad form-label">
                        Submit
                      </button>
                    }
                  </div> */}
                  <div className='buttongrouprightend mb-4'>
                    <button
                      type='submit'
                      onClick={MopUpList}
                      className='btn btn-primary font-chng'
                      style={{
                        marginRight: '10px',
                        backgroundColor: '#34c38f',
                        border: '0px',
                        color: ' #ffffff',
                      }}
                    >
                      Back
                    </button>
                    {location && location.state && location.state.view ? (
                      ''
                    ) : (
                      <button
                        id='Submitbtnid3'
                        className='btn btn-primary font-chng'
                        type='submit'
                        style={{
                          // marginRight: '10px',
                          backgroundColor: '#34c38f',
                          border: '0px',
                          color: ' #ffffff',
                        }}
                      >
                        Submit
                      </button>
                    )}
                  </div>
                </Form>
              </FormikProvider>
            </div>
          </>
        )}
        {/* End Stepper */}
      </div>
    </div>
  );
};

export default AddMDACoverageReport;
