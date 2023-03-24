import React, { useState, useEffect, useRef } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Container } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  useFormik,
  FormikProvider,
  FieldArray,
} from 'formik';
//import { ToastContainer } from 'react-toastify';
import * as Yup from 'yup';
import Stepper from '@material-ui/core/Stepper';
import StepConnector from '@material-ui/core/StepConnector';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import ListAlt from '@material-ui/icons/ListAlt';
import DescriptionIcon from '@material-ui/icons/Description';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import clsx from 'clsx';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import { StepIconProps } from '@material-ui/core/StepIcon';
import DropdownService from '../../../services/DropdownService';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import Delete from '../../../assets/img/LEFP_Images/deletesection.png';
import PreMDAActivityService from '../../../services/FormPreMDAActivityService';
import { useLocation } from 'react-router-dom';
import history from '../../../../helpers/history';
import {
  PreMDAActivity,
  preMDAActivityDrugLogistics,
} from '../../../interfaces/FormPreMDAActivityInterface';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert';
import { truncate } from 'fs';
import Select, { Option } from 'react-select';
import OptionLabel from '../../../../helpers/selectOptionLabel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonFunction from '../../../../helpers/common/common';
import AccordionPreMDAActivityDrug from './AccordionPreMDAActivityDrug';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';
import DexieOfflineFormPreMdaActivity from '../../../draftServices/FormPreMdaActivityDraft';

const AddPreMDAActivity: React.FC<any> = (props) => {
  const location = useLocation<any>();
  const listDESheetName: any = props && props.listDESheetName;
  const currentdate = moment(new Date()).format('yyyy-MM-DD');
  let [districtValues, setDistrictValues] = useState([]);
  let [corporationValues, setCorporationValues] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  let [talukaValues, setTalukaValues] = useState([]);
  let [wardValues, setWardValues] = useState([]);
  let [villageValues, setVillageValues] = useState([]);
  let [facilityValues, setFacilityValues] = useState([]);
  let [subCenterValues, setSubCenterValues] = useState([]);
  let [zoneValues, setZoneValues] = useState([]);
  const [druglist, setDrugList] = useState<any>([]);
  const [hide, setHide] = useState(true);
  const [stepper1Submit, setstepper1Submit] = useState(true);

  const [activeStep, setActiveStep] = React.useState(0);
  const [step1Valid, isStep1Valid] = React.useState(false);
  const [getDrugData, setGetDrugdata] = useState([]);
  const [dropDownData, setDropDownData] = useState([]);
  const [hideData, setHideData] = useState(false);
  const [selectedOption, setSelectedOption] = useState([]);
  const [districtId, setDistrictId] = useState([]);
  const [facilityId, setfacilityId] = useState();
  const [subCenterId, setsubCenterId] = useState();
  const [talukaId, settalukaId] = useState();
  const [zoneId, setzoneId] = useState();
  const [corporationId, setcorporationId] = useState();
  const [cadreOfDrugAdminOthersIdValue, setcadreOfDrugAdminOthersIdValue] =
    useState(33);
  const [cadreOfSupervisorOthersIdValue, setcadreOfSupervisorOthersIdValue] =
    useState(37);
  const Sourcefromtable = [
    { label: 'National', value: 'national' },
    { label: 'State', value: 'state' },
    { label: 'District', value: 'district' },
  ];
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
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);
  let isOnline = window.navigator.onLine;
  const [preMdaIdValue, setPreMdaIdValue] = useState('');
  const [saveUUID, setsaveUUID] = React.useState(undefined);
  const [childView, setChildView] = useState(true);
  const steps = getSteps();
  useEffect(() => {
    getDropDownData();
    getPreMDAActivityData();
    getPreMDAActivityDrugData();
    //getPreMDAActivityDrugLogisticsData();
  }, []);

  const [preMDAActivity, setPreMDAActivity] = useState<PreMDAActivity>({
    id: 0,
    srNo: '',
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
    totalPopulationVillage: '',
    totalStaffSanctioned: '',
    totalStaffsUnit: '',
    totalManDaysRequired: '',
    cadreOfDrugAdminId: 0,
    actualAvailableDrugAdmin: '',
    requiredSupervisors: '',
    cadreOfSupervisorId: 0,
    actualAvailableSupervisor: '',
    numberTrainedForMMDP: '',
    batchesOfTrainingOrganizedMMDP: '',
    numberTrainedForMDAIDA: '',
    batchesOfTrainingOrganizedMDAIDA: '',
    isActive: true,
    preMDAActivityDrugAdministrators: [
      {
        cadreOfDrugAdminId: '',
        preMDAActivityId: 0,
        otherDrugAdministrator: '',
        noOfDrugAdministrator: '',
      },
    ],
    preMDAActivitySupervisors: [
      {
        cadreOfSupervisorId: '',
        preMDAActivityId: 0,
        otherDrugSupervisor: '',
        noOfSupervisor: '',
      },
    ],
  });
  const [preMDAActivityDrugLogistics, setPreMDAActivityDrugLogistics] =
    useState<preMDAActivityDrugLogistics>({
      preMDAActivityId: 0,
      nameOfTablet: '',
      batchNumberOfTablet: '',
      dateOfExpiryTablet: currentdate,
      quantityTabletRquireForMDA: '',
      quantityTabletInStockBeforeRound: '',
      quantityOfTabletReceivedForRound: '',
      batchNoOfTabletReceivedForRound: '',
      dateOfExpiryTabletReceivedForRound: currentdate,
      sourceFromTabletReceivedForRound: '',
      sourceFromTabletReceivedForRoundDist: 0,
      quantityOfTabletsDestroyedDuringRound: '',
      quantityOfBalanceTabletsInStock: '',
      batchNumberOfTabletInStock: '',
      dateOfExpiryTabletInStock: currentdate,
      quantityOfBalanceTabletsStockIn: 0,
      batchNumberOfTabletStockIn: '',
      dateOfExpiryTabletStockIn: currentdate,
      dateOfExpiryTabletDestroyed: currentdate,
      batchNumberOfTabletDestroyed: 0,
      reasonForTabletsDestroyed: '',
      isActive: true,
    });

  const dateHandle = (val) => {
    let val1 = moment(val).format('YYYY-MM-DD');
    Drugformik.setFieldValue('dateOfExpiryTablet', val1);
  };
  const dateHandle1 = (val) => {
    let val2 = moment(val).format('YYYY-MM-DD');
    Drugformik.setFieldValue('dateOfExpiryTabletReceivedForRound', val2);
  };
  const dateHandle2 = (val) => {
    let val3 = moment(val).format('YYYY-MM-DD');
    Drugformik.setFieldValue('dateOfExpiryTabletInStock', val3);
  };

  const hideDrugs = () => {
    Drugformik.resetForm({ values: preMDAActivityDrugLogistics });
    setHide(false);
  };

  async function getPreMDAActivityDrugData() {
    let preMDAListId: any;
    let PreMdaDetails: any;
    if (location && location.state && location.state.id) {
      preMDAListId = location.state.id;
      PreMdaDetails =
        await PreMDAActivityService.getPreMDAActivityDrugLogistics(
          preMDAListId
        );
      if (PreMdaDetails) {
        setGetDrugdata(PreMdaDetails && PreMdaDetails.data);
        console.log('PreMda', PreMdaDetails);
      }
    } else if (
      location &&
      location.state &&
      location.state.preMDAActivityUUID
    ) {
      preMDAListId = location.state.preMDAActivityUUID;
      console.log('UUID', location.state.preMDAActivityUUID);
      PreMdaDetails =
        await DexieOfflineFormPreMdaActivity.getListPreMdaActivityDrug(
          preMDAListId
        );
      if (PreMdaDetails) {
        setGetDrugdata(PreMdaDetails);
      }
    } else {
      if (saveUUID) {
        PreMdaDetails =
          await DexieOfflineFormPreMdaActivity.getListPreMdaActivityDrug(
            saveUUID
          );
        if (PreMdaDetails) {
          setGetDrugdata(PreMdaDetails);
        }
      }
    }
  }

  async function deletePreMdaAtivity(event, row) {
    event.persist();
    if (location && location.state && location.state.id) {
      const response =
        await PreMDAActivityService.deletePreMDAActivityDrugLogistics(row.id);
      if (response.message == 'Deleted successfully') {
        getPreMDAActivityDrugData();
        //console.log('Delete News', response);
      }
    } else {
      let offlineResponse =
        await DexieOfflineFormPreMdaActivity.deleteGetListPreMdaActivityDrug(
          row.preMDAActivityUUID
        );
      getPreMDAActivityDrugData();
    }
  }

  const DeleteFunction = (event: any, row: any) => {
    confirmAlert({
      // title: 'Confirm to Delete',
      message: 'Do you want to delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deletePreMdaAtivity(event, row);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  let preMdaTable: any = {};
  //Finish and Save Button Function
  async function finishSave() {
    if (
      (location && location.state && location.state.id) ||
      (location && location.state && location.state.view)
    ) {
      moveToListPage();
    } else {
      if (saveUUID) {
        let values = await DexieOfflineFormPreMdaActivity.getOnePreMdaActivity(
          saveUUID
        );
        setIsDisabled(true);

        preMdaTable = values;
        let preMdaDetail =
          await DexieOfflineFormPreMdaActivity.getListPreMdaActivityDrug(
            saveUUID
          );
        if (preMdaDetail && preMdaDetail.length > 0) {
          preMdaTable.preMDAActivityDrugLogistics = preMdaDetail;
        }
        console.log('preMdaTable', preMdaTable);
        let response = await PreMDAActivityService.createAllPreMDAActivities(
          preMdaTable
        );
        setIsDisabled(false);
        if (response.status === 200) {
          moveToListPage();
          let values =
            await DexieOfflineFormPreMdaActivity.deletePreMdaActivity(saveUUID);
          console.log(values);
          let preMdaList =
            await DexieOfflineFormPreMdaActivity.deleteGetListPreMdaActivityDrug(
              saveUUID
            );
          console.log(preMdaList);
        }
      }
    }
  }

  const validSchema = Yup.object().shape({
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

    // zoneId: Yup.string()
    //     .when([], {
    //         is: 0,
    //         then: Yup.string().required("zone is required").nullable(),
    //     }),

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
    preMDAActivityDrugAdministrators: Yup.array().of(
      Yup.object().shape({
        cadreOfDrugAdminId: Yup.string().required('Required').nullable(),
      })
    ),
    preMDAActivitySupervisors: Yup.array().of(
      Yup.object().shape({
        cadreOfSupervisorId: Yup.string().required('Required').nullable(),
      })
    ),
  });

  const validation = Yup.object().shape({
    // nameOfTablet: Yup.string().required("Name Of Tablet is required").nullable(),
    batchNumberOfTablet: Yup.string()
      .required('Batch Number Of Tablet is required')
      .nullable(),
  });

  const formik = useFormik({
    initialValues: preMDAActivity,
    enableReinitialize: true,
    validationSchema: validSchema,

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
      values.totalPopulationVillage = values.totalPopulationVillage
        ? values.totalPopulationVillage
        : 0;
      values.totalStaffSanctioned = values.totalStaffSanctioned
        ? values.totalStaffSanctioned
        : 0;
      values.totalManDaysRequired = values.totalManDaysRequired
        ? values.totalManDaysRequired
        : 0;
      values.totalStaffsUnit = values.totalStaffsUnit
        ? values.totalStaffsUnit
        : 0;
      values.requiredDrugAdmin = values.requiredDrugAdmin
        ? values.requiredDrugAdmin
        : 0;
      values.actualAvailableDrugAdmin = values.actualAvailableDrugAdmin
        ? values.actualAvailableDrugAdmin
        : 0;
      values.requiredSupervisors = values.requiredSupervisors
        ? values.requiredSupervisors
        : 0;
      values.actualAvailableSupervisor = values.actualAvailableSupervisor
        ? values.actualAvailableSupervisor
        : 0;
      values.numberTrainedForMMDP = values.numberTrainedForMMDP
        ? values.numberTrainedForMMDP
        : 0;
      values.batchesOfTrainingOrganizedMMDP =
        values.batchesOfTrainingOrganizedMMDP
          ? values.batchesOfTrainingOrganizedMMDP
          : 0;
      values.numberTrainedForMDAIDA = values.numberTrainedForMDAIDA
        ? values.numberTrainedForMDAIDA
        : 0;
      values.batchesOfTrainingOrganizedMDAIDA =
        values.batchesOfTrainingOrganizedMDAIDA
          ? values.batchesOfTrainingOrganizedMDAIDA
          : 0;
      values.preMDAActivityDrugAdministrators.forEach((element: any) => {
        element.cadreOfDrugAdminId =
          element.cadreOfDrugAdminId == '' ? 0 : element.cadreOfDrugAdminId;
        element.noOfDrugAdministrator =
          element.noOfDrugAdministrator == ''
            ? 0
            : element.noOfDrugAdministrator;
      });
      values.preMDAActivitySupervisors.forEach((element: any) => {
        element.cadreOfSupervisorId =
          element.cadreOfSupervisorId == '' ? 0 : element.cadreOfSupervisorId;
        element.noOfSupervisor =
          element.noOfSupervisor == '' ? 0 : element.noOfSupervisor;
      });
      if (location && location.state && location.state.view) {
        getPreMDAActivityDrugData();
        handleNext();
      } else if (location && location.state && location.state.id) {
        setPreMdaIdValue(location.state.id);
        values.lastModifiedBy = props && props.userSessionId;
        const id: any = location.state.id;
        let response = await PreMDAActivityService.updatePreMDAActivity(
          values,
          id
        );
        getPreMDAActivityDrugData();
        handleNext();
      } else if (
        location &&
        location.state &&
        location.state.preMDAActivityUUID
      ) {
        setsaveUUID(location.state.preMDAActivityUUID);
        console.log(
          'location.state.preMDAActivityUUID',
          location.state.preMDAActivityUUID
        );
        setPreMdaIdValue(location.state.preMDAActivityUUID);
        values.lastModifiedBy = props && props.userSessionId;
        let response =
          await DexieOfflineFormPreMdaActivity.updatePreMdaActivity(
            location.state.preMDAActivityUUID,
            values
          );
        getPreMDAActivityDrugData();
        handleNext();
      } else {
        if (values.preMDAActivityUUID) {
          values.lastModifiedBy = props && props.userSessionId;
          let response =
            await DexieOfflineFormPreMdaActivity.updatePreMdaActivity(
              values.preMDAActivityUUID,
              values
            );
          getPreMDAActivityDrugData();
          handleNext();
        } else {
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          let response = await DexieOfflineFormPreMdaActivity.addPreMdaActivity(
            values
          );
          setsaveUUID(response);
          setPreMdaIdValue(response);
          getPreMDAActivityDrugData();
          handleNext();
        }
      }
    },

    // onSubmit: async (values) => {
    //     if (location && location.state && location.state.view) {
    //         handleNext();
    //     }
    //     else {
    //         //console.log('Users', values);
    //         values.totalPopulationVillage = values.totalPopulationVillage ? values.totalPopulationVillage : "0";
    //         values.totalStaffSanctioned = values.totalStaffSanctioned ? values.totalStaffSanctioned : "0";
    //         values.totalStaffsUnit = values.totalStaffsUnit ? values.totalStaffsUnit : "0";
    //         values.totalManDaysRequired = values.totalManDaysRequired ? values.totalManDaysRequired : "0";
    //         values.actualAvailableDrugAdmin = values.actualAvailableDrugAdmin ? values.actualAvailableDrugAdmin : "0";
    //         values.requiredSupervisors = values.requiredSupervisors ? values.requiredSupervisors : "0";
    //         values.actualAvailableSupervisor = values.actualAvailableSupervisor ? values.actualAvailableSupervisor : "0";
    //         values.numberTrainedForMMDP = values.numberTrainedForMMDP ? values.numberTrainedForMMDP : "0";
    //         values.batchesOfTrainingOrganizedMMDP = values.batchesOfTrainingOrganizedMMDP ? values.batchesOfTrainingOrganizedMMDP : '0';
    //         values.numberTrainedForMDAIDA = values.numberTrainedForMDAIDA ? values.numberTrainedForMDAIDA : "0";
    //         values.batchesOfTrainingOrganizedMDAIDA = values.batchesOfTrainingOrganizedMDAIDA ? values.batchesOfTrainingOrganizedMDAIDA : "0";
    //         values.districtId = (values.districtId == "None") ? "" : values.districtId;
    //         values.corporationId = (values.corporationId == "None" || values.corporationId == "0") ? "0" : values.corporationId;
    //         values.talukaId = (values.talukaId == "None" || values.talukaId == "0") ? "0" : values.talukaId;
    //         values.facilityId = (values.facilityId == "None" || values.facilityId == "0") ? "0" : values.facilityId;
    //         values.subCenterId = (values.subCenterId == "None" || values.subCenterId == "0") ? "0" : values.subCenterId;
    //         values.zoneId = (values.zoneId == "None" || values.zoneId == "0") ? "0" : values.zoneId;
    //         values.wardId = (values.wardId == "None" || values.wardId == "0") ? "0" : values.wardId;
    //         if (location && location.state && location.state.id) {
    //             values.lastModifiedBy = props && props.userSessionId;
    //             const response = await PreMDAActivityService.updatePreMDAActivity(values, location.state.id);
    //             //console.log("Message", response.message)
    //             setPreMDAActivityDrugLogistics({ ...preMDAActivityDrugLogistics, preMDAActivityId: response.data.id });
    //             handleNext();

    //         }
    //         else {
    //             values.createdBy = props && props.userSessionId;
    //             values.lastModifiedBy = 0;
    //             let response ;
    //         response = await PreMDAActivityService.postPreMDAActivity(values);
    //             if(response && response.data.id){
    //                 setPreMDAActivity({ ...preMDAActivity, id:response.data.id})
    //                 setPreMDAActivityDrugLogistics({ ...preMDAActivityDrugLogistics, preMDAActivityId: response.data.id });
    //             }else if(preMDAActivity.id){
    //                 values.lastModifiedBy = props && props.userSessionId;
    //                 response = await PreMDAActivityService.updatePreMDAActivity(values,preMDAActivity.id);
    //             }
    //             handleNext();
    //             //console.log("Err::", response.data)
    //             //console.log("aaaa", preMDAActivityDrugLogistics.preMDAActivityId)

    //         }
    //     }
    // }
  });

  const Drugformik = useFormik({
    initialValues: preMDAActivityDrugLogistics,
    validationSchema: validation,

    enableReinitialize: true,
    onSubmit: async (values: any) => {
      values.quantityTabletRquireForMDA = values.quantityTabletRquireForMDA
        ? values.quantityTabletRquireForMDA
        : 0;
      values.quantityTabletInStockBeforeRound =
        values.quantityTabletInStockBeforeRound
          ? values.quantityTabletInStockBeforeRound
          : 0;
      values.quantityOfTabletReceivedForRound =
        values.quantityOfTabletReceivedForRound
          ? values.quantityOfTabletReceivedForRound
          : 0;
      values.quantityOfTabletsDestroyedDuringRound =
        values.quantityOfTabletsDestroyedDuringRound
          ? values.quantityOfTabletsDestroyedDuringRound
          : 0;
      values.quantityOfBalanceTabletsInStock =
        values.quantityOfBalanceTabletsInStock
          ? values.quantityOfBalanceTabletsInStock
          : 0;
      if (location && location.state && location.state.view) {
        getPreMDAActivityDrugData();
        setHide(true);
        Back();
      } else {
        let preMdaId: any;
        let preMdaDrugId: any;
        if (location && location.state && location.state.id) {
          if (values.id) {
            values.preMDAActivityId = location.state.id;
            values.lastModifiedBy = props && props.userSessionId;

            let response =
              await PreMDAActivityService.updatePreMDAActivityDrugLogistics(
                values,
                values.id
              );
            getPreMDAActivityDrugData();
            setHide(true);
            Back();
          } else {
            values.preMDAActivityId = location.state.id;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;

            let response =
              await PreMDAActivityService.postPreMDAActivityDrugLogistics(
                values
              );
            getPreMDAActivityDrugData();
            setHide(true);
            Back();
          }
        } else if (
          location &&
          location.state &&
          location.state.preMDAActivityUUID
        ) {
          if (values && values.preMDAActivityDrugUUID) {
            preMdaId = location.state.preMDAActivityUUID;
            values.preMDAActivityId = preMdaId;
            values.lastModifiedBy = props && props.userSessionId;

            let response =
              await DexieOfflineFormPreMdaActivity.updatePreMdaActivityDrug(
                values.preMDAActivityDrugUUID,
                values
              );
            getPreMDAActivityDrugData();
            setHide(true);
            Back();
          } else {
            preMdaId = location.state.preMDAActivityUUID;
            values.preMDAActivityId = preMdaId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;

            let response =
              await DexieOfflineFormPreMdaActivity.addPreMdaActivityDrug(
                values
              );
            getPreMDAActivityDrugData();
            setHide(true);
            Back();
          }
        } else {
          if (values && values.preMDAActivityDrugUUID) {
            preMdaId = preMdaIdValue;
            values.preMDAActivityId = preMdaId;
            values.lastModifiedBy = props && props.userSessionId;
            let response =
              await DexieOfflineFormPreMdaActivity.updatePreMdaActivityDrug(
                values.preMDAActivityDrugUUID,
                values
              );
            getPreMDAActivityDrugData();
            setHide(true);
            Back();
          } else {
            preMdaId = preMdaIdValue;
            values.preMDAActivityId = preMdaId;
            values.createdBy = props && props.userSessionId;
            values.lastModifiedBy = 0;

            let response =
              await DexieOfflineFormPreMdaActivity.addPreMdaActivityDrug(
                values
              );
            getPreMDAActivityDrugData();
            setHide(true);
            Back();
          }
        }
      }
    },
  });

  // onSubmit: async (val: any) => {
  //     if (location && location.state && location.state.view) {
  //         getPreMDAActivityDrugData();
  //         Back();
  //         //console.log("valuesssss")
  //     }
  //     else {
  //         let DrugFormID: any;
  //         let DrugListId: any;
  //         let response;
  //         if(location && location.state && location.state.id){
  //         if (val.id) {
  //             DrugListId = val.id;
  //             DrugFormID = val.preMDAActivityId;
  //             val.quantityTabletRquireForMDA = val.quantityTabletRquireForMDA ? val.quantityTabletRquireForMDA : "0";
  //             val.quantityTabletInStockBeforeRound = val.quantityTabletInStockBeforeRound ? val.quantityTabletInStockBeforeRound : "0";
  //             val.quantityOfTabletReceivedForRound = val.quantityOfTabletReceivedForRound ? val.quantityOfTabletReceivedForRound : "0";
  //             val.quantityOfTabletsDestroyedDuringRound = val.quantityOfTabletsDestroyedDuringRound ? val.quantityOfTabletsDestroyedDuringRound : "0";
  //             val.quantityOfBalanceTabletsInStock = val.quantityOfBalanceTabletsInStock ? val.quantityOfBalanceTabletsInStock : "0";
  //             val.lastModifiedBy = props && props.userSessionId;
  //             response = await PreMDAActivityService.updatePreMDAActivityDrugLogistics(val, DrugListId)

  //         }
  //         else {
  //             if (location && location.state && location.state.id) {
  //                 DrugFormID = location.state.id;
  //             }
  //             else {
  //                 DrugFormID = preMDAActivityDrugLogistics.preMDAActivityId
  //             }
  //             val.createdBy = props && props.userSessionId;
  //             val.lastModifiedBy = 0;
  //             val.preMDAActivityId = DrugFormID;
  //             response = await PreMDAActivityService.postPreMDAActivityDrugLogistics(val);

  //         }
  //         if (response) {
  //             getPreMDAActivityDrugData();
  //             Back();

  //         }
  //     }
  //     }
  // },

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
  const prevSubCenterIdValue = prevSubCenterRef.current;
  const prevCorporationIdValue = prevCorporationRef.current;

  async function getDistrict(e: any) {
    setDistrictId(e && e.value);
    //console.log("current value", e && e.value)
    //console.log("previous value", prevDistrictIdValue)
    if (!((e && e.value) === prevDistrictIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('talukaId', 0);
        formik.setFieldValue('facilityId', 0);
        formik.setFieldValue('subCenterId', 0);
        formik.setFieldValue('villageId', 0);
        formik.setFieldValue('wardId', 0);
        formik.setFieldValue('zoneId', 0);
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
        formik.setFieldValue('zoneId', 0);
        setCorporationValues(corporationData);
      } else {
        selectCorporationRef.current.select.clearValue();
        let corporationData: any = [OptionLabel.corporationNone];
        setCorporationValues(corporationData);
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
      if (
        (talukaId && talukaId.data && talukaId.data.length > 0) ||
        (talukaIdOffline && talukaIdOffline.length > 0)
      ) {
        let talukaList: any;
        formik.setFieldValue('talukaId', '');
        formik.setFieldValue('villageId', 0);
        selectTalukaRef.current.select.clearValue();
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
        formik.setFieldValue('facilityId', '');
        formik.setFieldValue('subCenterId', 0);
        selectFacilityRef.current.select.clearValue();
        if (!isOnline) {
          facilityList = [OptionLabel.facilityNoneLabel, ...facilityIdOffline];
        } else {
          facilityList = [OptionLabel.facilityNoneLabel, ...facilityId.data];
        }
        setFacilityValues(facilityList);
      } else {
        selectFacilityRef.current.select.clearValue();
        let Data: any = [OptionLabel.facilityNoneLabel];
        setFacilityValues(Data);
        formik.setFieldValue('facilityId', 0);
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
    } //console.log(corporationId)
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
      //formik.setFieldValue("corporationId", "");
      setCorporationValues(corporationData);
    } else {
      let Data: any = [OptionLabel.corporationNone];
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
      //formik.setFieldValue("talukaId", "");
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
      // formik.setFieldValue("facilityId", "");
      let facilityList: any;
      if (!isOnline) {
        facilityList = [OptionLabel.facilityNoneLabel, ...facilityIdOffline];
      } else {
        facilityList = [OptionLabel.facilityNoneLabel, ...facilityId.data];
      }
      setFacilityValues(facilityList);
    } else {
      let Data: any = [OptionLabel.facilityNoneLabel];
      setFacilityValues(Data);
      formik.setFieldValue('facilityId', 0);
    }
  }
  async function getCorporation(e: any) {
    setcorporationId(e && e.value);
    //console.log("current value", e && e.value)
    //console.log("previous value", prevCorporationIdValue)
    if (!((e && e.value) === prevCorporationIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('zoneId', 0);
        formik.setFieldValue('wardId', 0);
      }
      let zoneId: any;
      let zoneIdOffline: any;
      if (!isOnline) {
        zoneIdOffline = await DexieOfflineDataBase.getZoneOffline(
          e && e.value,
          formik.values.districtId
        );
      } else {
        zoneId = await DropdownService.getOneZone(
          e && e.value,
          formik.values.districtId
        );
      }
      if (
        (zoneId && zoneId.data && zoneId.data.length > 0) ||
        (zoneIdOffline && zoneIdOffline.length > 0)
      ) {
        formik.setFieldValue('zoneId', '');
        formik.setFieldValue('wardId', 0);
        selectZoneRef.current.select.clearValue();
        let zoneList: any;
        if (!isOnline) {
          zoneList = [OptionLabel.zoneNoneLabel, ...zoneIdOffline];
        } else {
          zoneList = [OptionLabel.zoneNoneLabel, ...zoneId.data];
        }
        setZoneValues(zoneList);
      } else {
        selectZoneRef.current.select.clearValue();
        let Data: any = [OptionLabel.zoneNoneLabel];
        setZoneValues(Data);
        formik.setFieldValue('zoneId', 0);
      }

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
      if (
        (wardId && wardId.data && wardId.data.length > 0) ||
        (wardIdOffline && wardIdOffline.length > 0)
      ) {
        formik.setFieldValue('wardId', '');
        selectWardRef.current.select.clearValue();
        let wardlist: any;
        if (!isOnline) {
          wardlist = [OptionLabel.wardNoneLabel, ...wardIdOffline];
        } else {
          wardlist = [OptionLabel.wardNoneLabel, ...wardId.data];
        }
        setWardValues(wardlist);
      } else {
        selectWardRef.current.select.clearValue();
        let Data: any = [OptionLabel.wardNoneLabel];
        setWardValues(Data);
        formik.setFieldValue('wardId', 0);
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
      setZoneValues(zoneList);
    } else {
      let Data: any = [OptionLabel.zoneNoneLabel];
      setZoneValues(Data);
      formik.setFieldValue('zoneId', 0);
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
      selectWardRef.current.select.clearValue();
      let wardlist: any;
      if (!isOnline) {
        wardlist = [OptionLabel.wardNoneLabel, ...wardIdOffline];
      } else {
        wardlist = [OptionLabel.wardNoneLabel, ...wardId.data];
      }
      setWardValues(wardlist);
    } else {
      let Data: any = [OptionLabel.wardNoneLabel];
      setWardValues(Data);
      formik.setFieldValue('wardId', 0);
    }
  }

  // async function getTaluka(e: any) {
  //     settalukaId(e && e.value)
  //     //console.log("current value", e && e.value)
  //     //console.log("previous value", prevTalukaIdValue)
  //     if (!((e && e.value) === prevTalukaIdValue)) {
  //         if ((e && e.value) === null) {
  //             formik.setFieldValue("villageId", 0);
  //         }
  //         let Village: any;
  //         let VillageIdOffline: any;
  //         if (!isOnline) {
  //             VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(e &&
  //                 e.value,
  //                 formik.values.districtId
  //             );
  //         } else {
  //             Village = await DropdownService.getOneVillage(e &&
  //                 e.value,
  //                 formik.values.districtId
  //             );
  //         }
  //         if (Village && Village.data && Village.data.length > 0 || VillageIdOffline && VillageIdOffline.length > 0) {
  //             formik.setFieldValue("villageId", "");
  //             selectVillageRef.current.select.clearValue();
  //             let villagelist: any;
  //             if (!isOnline) {
  //                 villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
  //             } else {
  //                 villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
  //             }
  //             setVillageValues(villagelist);
  //         } else {
  //             selectVillageRef.current.select.clearValue();
  //             let Data: any = [OptionLabel.villageNoneLabel];
  //             setVillageValues(Data);
  //             formik.setFieldValue("villageId", 0);
  //         }
  //     }
  // }
  // async function getTalukaValues(e: any, id: any) {
  //     if (location && location.state && location.state.id) {
  //         let Village: any;
  //         let VillageIdOffline: any;
  //         if (!isOnline) {
  //             VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(e, id);
  //         } else {
  //             Village = await DropdownService.getOneVillage(e, id);
  //         }
  //         if (Village && Village.data && Village.data.length > 0 || VillageIdOffline && VillageIdOffline.length > 0) {
  //             let villagelist: any;
  //             if (!isOnline) {
  //                 villagelist = [OptionLabel.villageNoneLabel, ...VillageIdOffline];
  //             } else {
  //                 villagelist = [OptionLabel.villageNoneLabel, ...Village.data];
  //             }
  //             setVillageValues(villagelist);
  //         }
  //     }
  // }

  async function getFacility(e: any) {
    setfacilityId(e && e.value);

    if (!((e && e.value) === prevFacilityIdValue)) {
      if ((e && e.value) === null) {
        formik.setFieldValue('subCenterId', 0);
        formik.setFieldValue('villageId', 0);
      }
      let Subcenter: any;
      let SubcenterOffline: any;
      if (isOnline) {
        Subcenter = await DropdownService.getOneSubCenter(
          e && e.value,
          formik.values.districtId
        );
      } else {
        SubcenterOffline = await DexieOfflineDataBase.getSubCenterOffline(
          e && e.value,
          formik.values.districtId
        );
      }
      if (
        (Subcenter && Subcenter.data && Subcenter.data.length > 0) ||
        (SubcenterOffline && SubcenterOffline.length > 0)
      ) {
        formik.setFieldValue('subCenterId', '');
        selectSubcenterRef.current.select.clearValue();
        let subcenterlist: any;
        if (!isOnline) {
          subcenterlist = [OptionLabel.subCenterNoneLabel, ...SubcenterOffline];
        } else {
          subcenterlist = [OptionLabel.subCenterNoneLabel, ...Subcenter.data];
        }
        setSubCenterValues(subcenterlist);
      } else {
        selectSubcenterRef.current.select.clearValue();
        let Data: any = [OptionLabel.subCenterNoneLabel];
        setSubCenterValues(Data);
        formik.setFieldValue('subCenterId', 0);
      }

      let Village: any;
      let VillageIdOffline: any;
      if (!isOnline) {
        VillageIdOffline = await DexieOfflineDataBase.getVillageOffline(
          e && e.value,
          formik.values.districtId
        );
      } else {
        Village = await DropdownService.getOneVillage(
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
      setSubCenterValues(subcenterlist);
    } else {
      let Data: any = [OptionLabel.subCenterNoneLabel];
      setSubCenterValues(Data);
      formik.setFieldValue('subCenterId', 0);
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
      setVillageValues(villagelist);
    } else {
      let Data: any = [OptionLabel.villageNoneLabel];
      setVillageValues(Data);
      formik.setFieldValue('villageId', 0);
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
              formik.values.districtId,
              formik.values.facilityId,
              e && e.value
            );
        } else {
          villageId = await DropdownService.getOneVillageBySubCenter(
            formik.values.districtId,
            formik.values.facilityId,
            e && e.value
          );
        }
        if (
          (villageId && villageId.data && villageId.data.length > 0) ||
          (villageIdOffline && villageIdOffline.length > 0)
        ) {
          formik.setFieldValue('villageId', '');
          selectVillageRef.current.select.clearValue();
          let villagelist: any;
          if (!isOnline) {
            villagelist = [OptionLabel.villageNoneLabel, ...villageIdOffline];
          } else {
            villagelist = [OptionLabel.villageNoneLabel, ...villageId.data];
          }
          setVillageValues(villagelist);
        }
        // else {
        //   selectVillageRef.current.select.clearValue();
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
        setVillageValues(villagelist);
      }
      // else {
      //   // selectVillageRef.current.select.clearValue();
      //   let Data: any = [OptionLabel.villageNoneLabel];
      //   setvillageIdValues(Data);
      //   formik.setFieldValue("villageId", 0);
      // }
    }
  }

  // async function getZone(e: any) {
  //     setzoneId(e && e.value)
  //     // console.log("current value", e && e.value)
  //     //console.log("previous value", prevZoneIdValue)
  //     if (!((e && e.value) === prevZoneIdValue)) {
  //         if ((e && e.value) === null) {
  //             formik.setFieldValue("wardId", 0);
  //         }
  //         let wardId: any;
  //         let wardIdOffline: any;
  //         if (!isOnline) {
  //             wardIdOffline = await DexieOfflineDataBase.getWardOffline(e && e.value, formik.values.corporationId, formik.values.districtId);
  //         } else {
  //             wardId = await DropdownService.getOneWard(e && e.value, formik.values.corporationId, formik.values.districtId);
  //         }
  //         if (wardId && wardId.data && wardId.data.length > 0 || wardIdOffline && wardIdOffline.length > 0) {
  //             formik.setFieldValue("wardId", "");
  //             selectWardRef.current.select.clearValue();
  //             let wardlist: any;
  //             if (!isOnline) {
  //                 wardlist = [OptionLabel.wardNoneLabel, ...wardIdOffline]
  //             } else {
  //                 wardlist = [OptionLabel.wardNoneLabel, ...wardId.data]
  //             }
  //             setWardValues(wardlist);
  //         } else {
  //             selectWardRef.current.select.clearValue();
  //             let Data: any = [OptionLabel.wardNoneLabel];
  //             setWardValues(Data);
  //             formik.setFieldValue("wardId", 0);
  //         }
  //     }
  // }

  // async function getZoneValues(e: any, corporationId: any, districtId: any) {
  //     let wardId: any;
  //     let wardIdOffline: any;
  //     if (!isOnline) {
  //         wardIdOffline = await DropdownService.getOneWard(e, corporationId, districtId);
  //     } else {
  //         wardId = await DropdownService.getOneWard(e, corporationId, districtId);
  //     }
  //     if (wardId && wardId.data && wardId.data.length > 0) {
  //         let wardlist: any;
  //         if (!isOnline) {
  //             wardlist = [OptionLabel.wardNoneLabel, ...wardIdOffline]
  //         } else {
  //             wardlist = [OptionLabel.wardNoneLabel, ...wardId.data]
  //         }
  //         setWardValues(wardlist);
  //     }
  // }

  async function getDropDownData() {
    if (isOnline) {
      const districtId: any = await DropdownService.getDistrictInfo();
      //console.log("PreeOffline",districtId)

      if (districtId && districtId.data) {
        setDistrictValues(districtId.data);
      }
    } else {
      const districtIdOffline: any = await DexieOfflineDataBase.getDistricts();
      console.log('PreeOffline', districtIdOffline);
      if (districtIdOffline) {
        setDistrictValues(districtIdOffline);
      }
    }
    if (isOnline) {
      const unitActionData: any = await DropdownService.getUnitAction();
      if (unitActionData && unitActionData.data) {
        setDropDownData(unitActionData.data);
        if (unitActionData && unitActionData.data.length > 0) {
          unitActionData.data.find((unitAction: any, i: any) => {
            if (unitAction.categoryCode === 1006) {
              if (
                unitAction.categoryOptionName === 'other' ||
                unitAction.categoryOptionName === 'Other'
              ) {
                setcadreOfDrugAdminOthersIdValue(unitAction.id);
              }
            }
            if (unitAction.categoryCode === 1007) {
              if (
                unitAction.categoryOptionName === 'other' ||
                unitAction.categoryOptionName === 'Other'
              ) {
                setcadreOfSupervisorOthersIdValue(unitAction.id);
              }
            }
          });
        }
      }
    } else {
      const UnitActionOfflineData: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (UnitActionOfflineData) {
        setDropDownData(UnitActionOfflineData);
        if (UnitActionOfflineData.length > 0) {
          UnitActionOfflineData.find((unitAction: any, i: any) => {
            if (unitAction.categoryCode === 1006) {
              if (
                unitAction.categoryOptionName === 'other' ||
                unitAction.categoryOptionName === 'Other'
              ) {
                setcadreOfDrugAdminOthersIdValue(unitAction.id);
              }
            }
            if (unitAction.categoryCode === 1007) {
              if (
                unitAction.categoryOptionName === 'other' ||
                unitAction.categoryOptionName === 'Other'
              ) {
                setcadreOfSupervisorOthersIdValue(unitAction.id);
              }
            }
          });
        }
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
    wardValues &&
    wardValues.map((item: any, i: any) => {
      return { label: item.wardName, value: item.id };
    });
  const villageList =
    villageValues &&
    villageValues.map((item: any, i: any) => {
      return { label: item.villageName, value: item.id };
    });
  const FacilityList =
    facilityValues &&
    facilityValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });
  const SubCenterList =
    subCenterValues &&
    subCenterValues.map((item: any, i: any) => {
      return { label: item.subCenterName, value: item.id };
    });
  const ZoneList =
    zoneValues &&
    zoneValues.map((item: any, i: any) => {
      return { label: item.zoneName, value: item.id };
    });
  const caderAdminDropdownData: any = [];
  dropDownData &&
    dropDownData.map((item: any, i: any) => {
      if (item && item.categoryCode == 1006) {
        caderAdminDropdownData.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });
  let caderSuperVisorList: any = [];
  dropDownData &&
    dropDownData.map((item: any, i: any) => {
      if (item && item.categoryCode == 1007) {
        caderSuperVisorList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });

  const tabletNameDropdownData: any = [];
  dropDownData &&
    dropDownData.map((item: any, i: any) => {
      if (item && item.categoryCode == 1022) {
        tabletNameDropdownData.push({
          label: item.categoryOptionName,
          value: item.categoryOptionName,
        });
      }
    });

  const handleNext = () => {
    if (
      formik.values.districtId &&
      formik.values.corporationId &&
      formik.values.talukaId &&
      formik.values.subCenterId &&
      formik.values.zoneId &&
      formik.values.wardId &&
      formik.values.villageId &&
      formik.values.facilityId &&
      activeStep === 0
    ) {
      isStep1Valid(true);
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    //setHide(false)
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    if (preMDAActivity.id) {
      getPreMDAActivityData();
    }
  };

  const Back = () => {
    setHide(true);
  };

  const columns1 = [
    {
      name: 'SR No',
      selector: (row: any) =>
        row.preMDAActivity && row.preMDAActivity.srNo
          ? row.preMDAActivity.srNo
          : '',
      grow: 0,
    },
    {
      name: 'Name of Tablet',
      selector: 'nameOfTablet',
    },
    {
      name: 'Batch No Of Tablet',
      selector: 'batchNumberOfTablet',
    },
    {
      name: 'Date of Expriy Tablet',
      selector: (row: any) => (
        <div>{moment(row.dateOfExpiryTablet).format('DD/MM/YYYY')}</div>
      ),
    },
    {
      name: 'Qty Tablet Require ForMDA',
      selector: 'quantityTabletRquireForMDA',
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
          {location && location.state && location.state.view ? (
            <button
              className='btn tooltip-wrap'
              onClick={() => {
                getPreMDAActivityDrugLogisticsData(row);
              }}
            >
              <img src={viewIcon} />
            </button>
          ) : (
            <>
              <button
                className='btn'
                onClick={() => {
                  getPreMDAActivityDrugLogisticsData(row);
                }}
              >
                <img src={editIcon} />
              </button>
              <button
                className='btn'
                onClick={(event) => DeleteFunction(event, row)}
              >
                <img src={deleteIcon} />
              </button>
            </>
          )}
          {/* {location && location.state && location.state.id && !location.state.view ? "" : <button className="btn"
                    onClick={() => {
                        if (row.preMDAActivityDrugUUID) {
                            getPreMDAActivityDrugLogisticsData(row.preMDAActivityDrugUUID, "UUID")

                        }
                        else if (row.id) {
                            getPreMDAActivityDrugLogisticsData(row.id, "Id")

                        }
                    }

                        //getPreMDAActivityDrugLogisticsData(row.id)
                    }>
                    <img src={viewIcon} className="font-chng" />
                </button>}
                {location && location.state && location.state.view ? "" :
                    <>
                        <button className="btn"
                            onClick={() => {
                                if (row.preMDAActivityDrugUUID) {
                                    getPreMDAActivityDrugLogisticsData(row.preMDAActivityDrugUUID, "UUID")
                                } else if (row.id) {
                                    getPreMDAActivityDrugLogisticsData(row.id, "Id")
                                }
                            }}>
                            <img src={editIcon} className="font-chng" />
                        </button>
                        <button className="btn"
                            onClick={(e: any) => {
                                if (row.preMDAActivityDrugUUID) {
                                    DeleteFunction(e, row.preMDAActivityDrugUUID, "UUID")
                                } else if (row.id) {
                                    DeleteFunction(e, row.id, "Id")
                                }
                            }}>
                            <img src={deleteIcon} className="font-chng" />
                        </button>
                    </>} */}
        </div>
      ),
    },
  ];
  const data1 = [
    {
      srNo: 1,
      NameofTablet: '01',
      BatchNoOfTablet: 'Damini Dash',
      DateofExpriy: '12,2018',
      QtyTablet: 'nn',
      PersonInterviewed: 'Ahila',
      Actions: '3',
    },
  ];

  function getSteps() {
    return ['Select campaign settings', 'Create an ad group'];
  }

  const useColorlibStepIconStyles = makeStyles({
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
    completed: {
      backgroundColor: '#19D895',
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
        <div className='step-iconnew pre-iconnew'>
          <ListAlt />
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
    if (step1Valid || location.state) {
      setActiveStep(step);
    }
  };

  async function getPreMDAActivityData() {
    let id: any;
    if (location.state && location.state.id) {
      id = location.state.id;
    } else if (preMDAActivity.id) {
      id = preMDAActivity.id;
    }
    if (location && location.state && location.state.id) {
      const response = await PreMDAActivityService.getOnePreMDAActivity(id);
      let arr: any = response && response.data;
      getDistrictValues(arr[0].districtId);
      await getFacilityValues(arr[0].facilityId, arr[0].districtId);
      getCorporationValues(arr[0].corporationId, arr[0].districtId);
      // getTalukaValues(arr[0].talukaId, arr[0].districtId);
      // getZoneValues(arr[0].zoneId, arr[0].corporationId, arr[0].districtId);
      getSubCenterValues(
        arr[0].subCenterId,
        arr[0].facilityId,
        arr[0].districtId
      );
      if (
        arr[0].preMDAActivityDrugAdministrators &&
        arr[0].preMDAActivityDrugAdministrators.length == 0
      ) {
        arr[0].preMDAActivityDrugAdministrators =
          preMDAActivity.preMDAActivityDrugAdministrators;
      }
      if (
        arr[0].preMDAActivitySupervisors &&
        arr[0].preMDAActivitySupervisors.length == 0
      ) {
        arr[0].preMDAActivitySupervisors =
          preMDAActivity.preMDAActivitySupervisors;
      }
      setPreMDAActivity(arr[0]);
    } else if (
      location &&
      location.state &&
      location.state.preMDAActivityUUID
    ) {
      id = location.state.preMDAActivityUUID;
      setsaveUUID(id);
      const OfflineResponse =
        await DexieOfflineFormPreMdaActivity.getOnePreMdaActivity(id);
      getDistrictValues(OfflineResponse.districtId);
      await getFacilityValues(
        OfflineResponse.facilityId,
        OfflineResponse.districtId
      );
      getCorporationValues(
        OfflineResponse.corporationId,
        OfflineResponse.districtId
      );
      getSubCenterValues(
        OfflineResponse.subCenterId,
        OfflineResponse.facilityId,
        OfflineResponse.districtId
      );
      // getTalukaValues(OfflineResponse.talukaId, OfflineResponse.districtId);
      // getZoneValues(OfflineResponse.zoneId, OfflineResponse.corporationId, OfflineResponse.districtId);
      if (
        OfflineResponse.preMDAActivityDrugAdministrators &&
        OfflineResponse.preMDAActivityDrugAdministrators.length == 0
      ) {
        OfflineResponse.preMDAActivityDrugAdministrators =
          preMDAActivity.preMDAActivityDrugAdministrators;
      }
      if (
        OfflineResponse.preMDAActivitySupervisors &&
        OfflineResponse.preMDAActivitySupervisors.length == 0
      ) {
        OfflineResponse.preMDAActivitySupervisors =
          preMDAActivity.preMDAActivitySupervisors;
      }
      setPreMDAActivity(OfflineResponse);
    }
  }

  async function getPreMDAActivityDrugLogisticsData(row: any) {
    if (row.data) {
      // console.log('EditId', data[0])
      setPreMDAActivityDrugLogistics(row);
      setHide(false);
      if (row.data[0].sourceFromTabletReceivedForRound === 'district') {
        setHideData(true);
        // console.log("MO", hideData)
      } else if (
        row.data[0].sourceFromTabletReceivedForRound === 'national' ||
        row.data[0].sourceFromTabletReceivedForRound === 'state'
      ) {
        setHideData(false);
      }
    } else {
      setPreMDAActivityDrugLogistics(row);
      setHide(false);
      if (row.sourceFromTabletReceivedForRound === 'district') {
        setHideData(true);
        // console.log("MO", hideData)
      } else if (
        row.sourceFromTabletReceivedForRound === 'national' ||
        row.sourceFromTabletReceivedForRound === 'state'
      ) {
        setHideData(false);
      }
    }
  }

  /*   async function getPreMDAActivityDrugLogisticsData(id: any, idType) {
          if (id) {
              if (idType === "Id") {
                  // const id: any = location.state.id;
                  const response = await PreMDAActivityService.getOnePreMDAActivityDrugLogistics(id);
                  if (response) {
                      let data: any = response.data;
                      // console.log('EditId', data[0])
                      setPreMDAActivityDrugLogistics(data[0]);
                      setHide(false);
                      if (response.data[0].sourceFromTabletReceivedForRound === "district") {
                          setHideData(true)
                          // console.log("MO", hideData)
                      }
                      else if (response.data[0].sourceFromTabletReceivedForRound === "national" || response.data[0].sourceFromTabletReceivedForRound === "state") {
                          setHideData(false)
                      }
                  }
              } else {
                  let OfflineRespone = await DexieOfflineFormPreMdaActivity.getOnePreMdaActivityDrug(id);
                  if (OfflineRespone) {
                      let arr: any = OfflineRespone;
                      setPreMDAActivityDrugLogistics(OfflineRespone)
                      setHide(false);
                      if (OfflineRespone.sourceFromTabletReceivedForRound === "district") {
                          setHideData(true)
                          // console.log("MO", hideData)
                      }
                      else if (OfflineRespone.sourceFromTabletReceivedForRound === "national" || OfflineRespone.data.sourceFromTabletReceivedForRound === "state") {
                          setHideData(false)
                      }
                  }
    
              }
    
          }
      } */

  async function getPreMDAActivityDrugLogisticsViewData(id: any, idType) {
    if (id) {
      if (idType === 'Id') {
        const response =
          await PreMDAActivityService.getOnePreMDAActivityDrugLogistics(id);
        let arr: any = response && response.data;
        setPreMDAActivityDrugLogistics(arr[0]);
        setHide(false);
        setChildView(false);
        if (response.arr[0].sourceFromTabletReceivedForRound === 'district') {
          setHideData(true);
          // console.log("MO", hideData)
        } else if (
          response.arr[0].sourceFromTabletReceivedForRound === 'national' ||
          response.data[0].sourceFromTabletReceivedForRound === 'state'
        ) {
          setHideData(false);
        } else {
          let OfflineRespone =
            await DexieOfflineFormPreMdaActivity.getOnePreMdaActivityDrug(id);

          let arr: any = OfflineRespone;
          setPreMDAActivityDrugLogistics(arr[0]);
          setHide(false);
          setChildView(false);
          if (
            OfflineRespone.data[0].sourceFromTabletReceivedForRound ===
            'district'
          ) {
            setHideData(true);
            // console.log("MO", hideData)
          } else if (
            OfflineRespone.data[0].sourceFromTabletReceivedForRound ===
              'national' ||
            OfflineRespone.data[0].sourceFromTabletReceivedForRound === 'state'
          ) {
            setHideData(false);
          }
        }
      }
    }
  }

  const hidesourcerounddist = (e) => {
    if (e.value === 'district') {
      setHideData(true);
      Drugformik.setFieldValue('sourceFromTabletReceivedForRoundDist', 0);
      getDistrict(e);
    } else if (e.value === 'national' || e.value === 'state') {
      setHideData(false);
    }
  };

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

  function addFieldPreMDAActivityDrugAdministrators(arrayHelpers) {
    const index =
      arrayHelpers.form.values.preMDAActivityDrugAdministrators.length;
    if (index == 1) {
      arrayHelpers.push({
        cadreOfDrugAdminId: '',
        preMDAActivityId: 0,
        otherDrugAdministrator: '',
        noOfDrugAdministrator: '',
      });
    }
  }

  function addFieldPreMDAActivitySupervisors(arrayHelpers) {
    const index = arrayHelpers.form.values.preMDAActivitySupervisors.length;
    if (index == 1) {
      arrayHelpers.push({
        cadreOfSupervisorId: '',
        preMDAActivityId: 0,
        otherDrugSupervisor: '',
        noOfSupervisor: '',
      });
    }
  }

  async function deleteFieldArrayPreMDAActivityDrugAdministrators(row) {
    if (row && row.id) {
      let response =
        await PreMDAActivityService.deletePreMDAActivityDrugAdministrators(
          row.id
        );
    }
  }

  async function deleteFieldArrayPreMDAActivitySupervisors(row) {
    if (row && row.id) {
      let response =
        await PreMDAActivityService.deletePreMDAActivitySupervisors(row.id);
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
    } else if (e.target.id == 'Submitbtnid2') {
      Drugformik.validateForm().then((errors) => {
        const isValid = Object.keys(errors).length === 0;
        if (!isValid) {
          toast.error('Please Enter Required Fields', {
            position: toast.POSITION.TOP_CENTER,
          });
        }
      });
    }
  };

  const AccordionComponent = (row) => {
    return <AccordionPreMDAActivityDrug rowValues={row} />;
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
          Data Entry{' '}
        </Breadcrumb.Item>
        {/* <Breadcrumb.Item href="/viewpremdaactivity">Pre-MDA</Breadcrumb.Item> */}
        {isOnline ? (
          <Breadcrumb.Item active className='font-chng'>
            ONLINE
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active className='font-chng'>
            OFFLINE
          </Breadcrumb.Item>
        )}
        <Breadcrumb.Item
          onClick={() => {
            history.push('/pre-mda-activities');
          }}
          className='font-chng'
        >
          Pre MDA activity
        </Breadcrumb.Item>
        {location.state && location.state.view ? (
          <Breadcrumb.Item active>View</Breadcrumb.Item>
        ) : (location.state && location.state.id) ||
          (location.state && location.state.preMDAActivityUUID) ? (
          <Breadcrumb.Item active>Edit</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active>Add</Breadcrumb.Item>
        )}

        {activeStep === 0 && (
          <Breadcrumb.Item active className='font-chng'>
            {' '}
            Pre-MDA Planning
          </Breadcrumb.Item>
        )}
        {activeStep === 1 && (
          <Breadcrumb.Item active className='font-chng'>
            Drugs Logistics
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      {/* <ToastContainer /> */}

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
            <h4 className='font-chng'>Pre-MDA Planning</h4>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel
            onClick={handleStep(1)}
            StepIconComponent={ColorlibStepIcon}
          >
            <h5 className='font-chng'>Step 2</h5>
            <h4 className='font-chng'>Drugs Logistics</h4>
          </StepLabel>
        </Step>
      </Stepper>
      {activeStep === 0 ? (
        <FormikProvider value={formik}>
          <form
            onClick={showToast}
            onSubmit={formik.handleSubmit}
            onChange={formik.handleChange}
          >
            <>
              {' '}
              <fieldset
                disabled={location.state && location.state.view ? true : false}
              >
                <div className='card mt-4 mb-4'>
                  <div className='mt-3'>
                    <h4 className='formtitlenew font-chng'>
                      Pre MDA activity (Action plan, Training status and drugs
                      logistics){' '}
                    </h4>
                    {/* <div className="col-md-6 col-12 m-auto">
                        </div> */}
                    <h4 className='formtitlenew pt-2 font-chng'>Pre MDA</h4>
                  </div>
                  <div className='card-body'>
                    <div>
                      <Row className='mb-3'>
                        <div className='col-xl-3 col-md-6 col-12'>
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
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={districtList}
                                //placeholder={"select District"}
                                isClearable={true}
                                value={
                                  districtList
                                    ? districtList.find(
                                        (option) =>
                                          option.value ===
                                          formik.values.districtId
                                      )
                                    : ''
                                }
                                className={
                                  formik.errors.districtId &&
                                  formik.touched.districtId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
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
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={NoneList}
                                isClearable={true}
                                value={
                                  districtList
                                    ? districtList.find(
                                        (option) =>
                                          option.value ===
                                          formik.values.districtId
                                      )
                                    : ''
                                }
                                className={
                                  formik.errors.districtId &&
                                  formik.touched.districtId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
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
                              {formik.errors ? formik.errors.districtId : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='corporationId'
                              className='form-label font-chng'
                            >
                              Corporation*
                            </label>
                            {corporationValues &&
                            corporationValues.length !== 0 ? (
                              <Select
                                ref={selectCorporationRef}
                                name='corporationId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={corporationList}
                                isClearable={true}
                                //placeholder={"Select Corporation"}
                                value={
                                  corporationList
                                    ? corporationList.find(
                                        (option) =>
                                          option.value ===
                                          formik.values.corporationId
                                      )
                                    : ''
                                }
                                className={
                                  formik.errors.corporationId &&
                                  formik.touched.corporationId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
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
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={NoneList}
                                defaultValue={NoneList}
                                isClearable={true}
                                value={
                                  corporationList
                                    ? corporationList.find(
                                        (option) =>
                                          option.value ===
                                          formik.values.corporationId
                                      )
                                    : ''
                                }
                                className={
                                  formik.errors.corporationId &&
                                  formik.touched.corporationId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                onChange={(option: Option) => {
                                  formik.setFieldValue(
                                    'corporationId',
                                    option && option.value
                                  );
                                  getCorporation(option);
                                }}
                                aria-label='Default select example'
                              ></Select>
                            )}
                            <div className={'invalid-feedback'}>
                              {formik.errors ? formik.errors.corporationId : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='talukaId'
                              className='form-label font-chng'
                            >
                              Taluka*
                            </label>
                            {talukaValues && talukaValues.length !== 0 ? (
                              <Select
                                ref={selectTalukaRef}
                                name='talukaId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={talukaList}
                                isClearable={true}
                                placeholder={'Select...'}
                                className={
                                  formik.errors.talukaId &&
                                  formik.touched.talukaId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                onChange={(option: Option) => {
                                  formik.setFieldValue(
                                    'talukaId',
                                    option && option.value
                                  );
                                  // getTaluka(option);
                                }}
                                value={
                                  talukaList
                                    ? talukaList.find(
                                        (option) =>
                                          option.value ===
                                          formik.values.talukaId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            ) : (
                              <Select
                                ref={selectTalukaRef}
                                name='talukaId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={NoneList}
                                isClearable={true}
                                defaultValue={NoneList}
                                className={
                                  formik.errors.talukaId &&
                                  formik.touched.talukaId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                onChange={(option: Option) => {
                                  formik.setFieldValue(
                                    'talukaId',
                                    option && option.value
                                  );
                                  // getTaluka(option);
                                }}
                                value={
                                  talukaList
                                    ? talukaList.find(
                                        (option) =>
                                          option.value ===
                                          formik.values.talukaId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            )}
                            <div className={'invalid-feedback'}>
                              {formik.errors ? formik.errors.talukaId : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='zoneId'
                              className='form-label font-chng'
                            >
                              Zone
                            </label>
                            {zoneValues && zoneValues.length !== 0 ? (
                              <Select
                                ref={selectZoneRef}
                                name='zoneId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={ZoneList}
                                isClearable={true}
                                className={
                                  formik.errors.zoneId && formik.touched.zoneId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                onChange={(option: Option) => {
                                  formik.setFieldValue(
                                    'zoneId',
                                    option && option.value
                                  );
                                  // getZone(option);
                                }}
                                value={
                                  ZoneList
                                    ? ZoneList.find(
                                        (option) =>
                                          option.value === formik.values.zoneId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            ) : (
                              <Select
                                ref={selectZoneRef}
                                name='zoneId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={NoneList}
                                isClearable={true}
                                defaultValue={NoneList}
                                className={
                                  formik.errors.zoneId && formik.touched.zoneId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                onChange={(option: Option) => {
                                  formik.setFieldValue(
                                    'zoneId',
                                    option && option.value
                                  );
                                  // getZone(option);
                                }}
                                value={
                                  ZoneList
                                    ? ZoneList.find(
                                        (option) =>
                                          option.value === formik.values.zoneId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            )}
                            <div className={'invalid-feedback'}>
                              {formik.errors ? formik.errors.zoneId : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='facilityId'
                              className='form-label font-chng'
                            >
                              Facility*
                            </label>
                            {facilityValues && facilityValues.length !== 0 ? (
                              <Select
                                ref={selectFacilityRef}
                                name='facilityId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={FacilityList}
                                isClearable={true}
                                className={
                                  formik.errors.facilityId &&
                                  formik.touched.facilityId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                onChange={(option: Option) => {
                                  formik.setFieldValue(
                                    'facilityId',
                                    option && option.value
                                  );
                                  getFacility(option);
                                }}
                                value={
                                  FacilityList
                                    ? FacilityList.find(
                                        (option) =>
                                          option.value ===
                                          formik.values.facilityId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            ) : (
                              <Select
                                ref={selectFacilityRef}
                                name='facilityId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={NoneList}
                                isClearable={true}
                                defaultValue={NoneList}
                                className={
                                  formik.errors.facilityId &&
                                  formik.touched.facilityId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                onChange={(option: Option) => {
                                  formik.setFieldValue(
                                    'facilityId',
                                    option && option.value
                                  );
                                  getFacility(option);
                                }}
                                value={
                                  FacilityList
                                    ? FacilityList.find(
                                        (option) =>
                                          option.value ===
                                          formik.values.facilityId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            )}
                            <div className={'invalid-feedback'}>
                              {formik.errors ? formik.errors.facilityId : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='subCenterId'
                              className='form-label font-chng'
                            >
                              Subcenter*
                            </label>
                            {subCenterValues && subCenterValues.length !== 0 ? (
                              <Select
                                ref={selectSubcenterRef}
                                name='subCenterId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={SubCenterList}
                                isClearable={true}
                                className={
                                  formik.errors.subCenterId &&
                                  formik.touched.subCenterId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                onChange={(option: Option) => {
                                  formik.setFieldValue(
                                    'subCenterId',
                                    option && option.value
                                  );
                                  getSubCenter(option);
                                }}
                                value={
                                  SubCenterList
                                    ? SubCenterList.find(
                                        (option) =>
                                          option.value ===
                                          formik.values.subCenterId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            ) : (
                              <Select
                                ref={selectSubcenterRef}
                                name='subCenterId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={NoneList}
                                isClearable={true}
                                defaultValue={NoneList}
                                className={
                                  formik.errors.subCenterId &&
                                  formik.touched.subCenterId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                onChange={(option: Option) => {
                                  formik.setFieldValue(
                                    'subCenterId',
                                    option && option.value
                                  );
                                  getSubCenter(option);
                                }}
                                value={
                                  SubCenterList
                                    ? SubCenterList.find(
                                        (option) =>
                                          option.value ===
                                          formik.values.subCenterId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            )}
                            <div className={'invalid-feedback'}>
                              {formik.errors ? formik.errors.subCenterId : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='villageId'
                              className='form-label font-chng'
                            >
                              Village*
                            </label>
                            {villageValues && villageValues.length !== 0 ? (
                              <Select
                                ref={selectVillageRef}
                                name='villageId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={villageList}
                                isClearable={true}
                                className={
                                  formik.errors.villageId &&
                                  formik.touched.villageId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
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
                                          option.value ===
                                          formik.values.villageId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            ) : (
                              <Select
                                ref={selectVillageRef}
                                name='villageId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={NoneList}
                                isClearable={true}
                                defaultValue={NoneList}
                                className={
                                  formik.errors.villageId &&
                                  formik.touched.villageId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
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
                                          option.value ===
                                          formik.values.villageId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            )}
                            <div className={'invalid-feedback'}>
                              {formik.errors ? formik.errors.villageId : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='wardId'
                              className='form-label font-chng'
                            >
                              Ward*
                            </label>
                            {wardValues && wardValues.length !== 0 ? (
                              <Select
                                ref={selectWardRef}
                                name='wardId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={wardList}
                                isClearable={true}
                                className={
                                  formik.errors.wardId && formik.touched.wardId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                onChange={(option: Option) => {
                                  formik.setFieldValue(
                                    'wardId',
                                    option && option.value
                                  );
                                }}
                                value={
                                  wardList
                                    ? wardList.find(
                                        (option) =>
                                          option.value === formik.values.wardId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            ) : (
                              <Select
                                ref={selectWardRef}
                                name='wardId'
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                options={NoneList}
                                isClearable={true}
                                defaultValue={NoneList}
                                className={
                                  formik.errors.districtId &&
                                  formik.touched.districtId
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                onChange={(option: Option) => {
                                  formik.setFieldValue(
                                    'wardId',
                                    option && option.value
                                  );
                                }}
                                value={
                                  wardList
                                    ? wardList.find(
                                        (option) =>
                                          option.value === formik.values.wardId
                                      )
                                    : ''
                                }
                                aria-label='Default select example'
                              ></Select>
                            )}
                            <div className={'invalid-feedback'}>
                              {formik.errors ? formik.errors.wardId : ''}
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
                              name='month'
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
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='area'
                              className='form-label font-chng'
                            >
                              Area
                            </label>
                            <input
                              name='area'
                              className='form-control font-chng'
                              onChange={formik.handleChange}
                              onKeyPress={(e) => commonFunction.keyPress(e)}
                              onInput={(event) =>
                                commonFunction.onlyAlphabets(event)
                              }
                              value={
                                formik.values.area ? formik.values.area : ''
                              }
                            />
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='totalPopulationVillage'
                              className='form-label font-chng'
                            >
                              Total Population Village
                            </label>
                            <input
                              type='number'
                              name='totalPopulationVillage'
                              className='form-control font-chng'
                              onChange={formik.handleChange}
                              value={formik.values.totalPopulationVillage}
                              onKeyDown={(e) =>
                                symbolsArr.includes(e.key) && e.preventDefault()
                              }
                              min='0'
                              onWheel={(e) =>
                                commonFunction.handleWheelEvent(e)
                              }
                            />
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='totalStaffSanctioned'
                              className='form-label font-chng'
                            >
                              Total Staff Sanctioned
                            </label>
                            <input
                              name='totalStaffSanctioned'
                              type='number'
                              className='form-control font-chng'
                              onChange={formik.handleChange}
                              value={formik.values.totalStaffSanctioned}
                              onKeyDown={(e) =>
                                symbolsArr.includes(e.key) && e.preventDefault()
                              }
                              min='0'
                              onWheel={(e) =>
                                commonFunction.handleWheelEvent(e)
                              }
                            />
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='totalStaffsUnit'
                              className='form-label font-chng'
                            >
                              Total Staff Available
                            </label>
                            <input
                              name='totalStaffsUnit'
                              type='number'
                              className='form-control font-chng'
                              onChange={formik.handleChange}
                              value={formik.values.totalStaffsUnit}
                              onKeyDown={(e) =>
                                symbolsArr.includes(e.key) && e.preventDefault()
                              }
                              min='0'
                              onWheel={(e) =>
                                commonFunction.handleWheelEvent(e)
                              }
                            />
                          </div>
                        </div>
                      </Row>
                    </div>
                  </div>
                </div>
                <div className='card mt-4 mb-4'>
                  <h4 className='formtitlenew font-chng m-3'>Action plan</h4>
                  <div className='card-body'>
                    <div>
                      <Row className='mb-3'>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='totalManDaysRequired'
                              className='form-label font-chng'
                            >
                              Total Man days Required
                            </label>
                            <input
                              name='totalManDaysRequired'
                              type='number'
                              className='form-control font-chng'
                              onChange={formik.handleChange}
                              value={formik.values.totalManDaysRequired}
                              onKeyDown={(e) =>
                                symbolsArr.includes(e.key) && e.preventDefault()
                              }
                              min='0'
                              onWheel={(e) =>
                                commonFunction.handleWheelEvent(e)
                              }
                            />
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='requiredDrugAdmin'
                              className='form-label font-chng'
                            >
                              Required Drug Admin
                            </label>
                            <input
                              name='requiredDrugAdmin'
                              type='number'
                              className='form-control font-chng'
                              onChange={formik.handleChange}
                              value={formik.values.requiredDrugAdmin}
                              onKeyDown={(e) =>
                                symbolsArr.includes(e.key) && e.preventDefault()
                              }
                              min='0'
                              onWheel={(e) =>
                                commonFunction.handleWheelEvent(e)
                              }
                            />
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='actualAvailableDrugAdmin'
                              className='form-label font-chng'
                            >
                              Actual availabe drug administrator
                            </label>
                            <input
                              name='actualAvailableDrugAdmin'
                              type='number'
                              className='form-control font-chng'
                              onChange={formik.handleChange}
                              value={formik.values.actualAvailableDrugAdmin}
                              onKeyDown={(e) =>
                                symbolsArr.includes(e.key) && e.preventDefault()
                              }
                              min='0'
                              onWheel={(e) =>
                                commonFunction.handleWheelEvent(e)
                              }
                            />
                          </div>
                        </div>
                        <FieldArray
                          name='preMDAActivityDrugAdministrators'
                          render={(arrayHelpers: any) => (
                            <fieldset
                              disabled={
                                location.state && location.state.view
                                  ? true
                                  : false
                              }
                            >
                              <div className='mb-2'>
                                {formik.values.preMDAActivityDrugAdministrators.map(
                                  (preMDAActivityDrugAdministrators, index) => (
                                    <div key={index}>
                                      <Row>
                                        <div className='col-xl-3 col-md-1 col-12'>
                                          <div className='form-grp'>
                                            <label
                                              htmlFor='cadreOfDrugAdminId'
                                              className='form-label font-chng'
                                            >
                                              Cadre of drug administrator*
                                            </label>
                                            <Select
                                              name={`preMDAActivityDrugAdministrators[${index}].cadreOfDrugAdminId`}
                                              isDisabled={
                                                location.state &&
                                                location.state.view
                                                  ? true
                                                  : false
                                              }
                                              styles={
                                                commonFunction.customStyles
                                              }
                                              isClearable={true}
                                              className={
                                                formik.errors
                                                  .preMDAActivityDrugAdministrators &&
                                                formik.errors
                                                  .preMDAActivityDrugAdministrators[
                                                  index
                                                ] &&
                                                formik.errors
                                                  .preMDAActivityDrugAdministrators[
                                                  index
                                                ]['cadreOfDrugAdminId'] &&
                                                formik.touched
                                                  .preMDAActivityDrugAdministrators &&
                                                formik.touched
                                                  .preMDAActivityDrugAdministrators[
                                                  index
                                                ] &&
                                                formik.touched
                                                  .preMDAActivityDrugAdministrators[
                                                  index
                                                ]['cadreOfDrugAdminId']
                                                  ? 'custom-select font-chng is-invalid'
                                                  : 'custom-select font-chng'
                                              }
                                              value={
                                                caderAdminDropdownData
                                                  ? caderAdminDropdownData.find(
                                                      (option: any) =>
                                                        option &&
                                                        option.value ===
                                                          formik.values
                                                            .preMDAActivityDrugAdministrators[
                                                            index
                                                          ][
                                                            'cadreOfDrugAdminId'
                                                          ]
                                                    )
                                                  : ''
                                              }
                                              options={caderAdminDropdownData}
                                              onChange={(option: Option) => {
                                                formik.setFieldValue(
                                                  `preMDAActivityDrugAdministrators[${index}].cadreOfDrugAdminId`,
                                                  option && option.value
                                                );
                                              }}
                                            ></Select>
                                            <div className={'invalid-feedback'}>
                                              {formik.errors
                                                .preMDAActivityDrugAdministrators &&
                                              formik.errors
                                                .preMDAActivityDrugAdministrators[
                                                index
                                              ] &&
                                              formik.errors
                                                .preMDAActivityDrugAdministrators[
                                                index
                                              ]['cadreOfDrugAdminId']
                                                ? formik.errors
                                                    .preMDAActivityDrugAdministrators[
                                                    index
                                                  ]['cadreOfDrugAdminId']
                                                : ''}
                                            </div>
                                          </div>
                                        </div>
                                        <div className='col-md-1 col-xl-3 col-12'>
                                          <div className='form-grp'>
                                            <label
                                              htmlFor='noOfDrugAdministrator'
                                              className='form-label font-chng'
                                            >
                                              Number Of DrugAdministrator
                                            </label>
                                            <input
                                              type='number'
                                              name={`preMDAActivityDrugAdministrators[${index}].noOfDrugAdministrator`}
                                              onChange={formik.handleChange}
                                              min='0'
                                              onWheel={(e) =>
                                                commonFunction.handleWheelEvent(
                                                  e
                                                )
                                              }
                                              onKeyDown={(e) =>
                                                symbolsArr.includes(e.key) &&
                                                e.preventDefault()
                                              }
                                              value={
                                                formik.values
                                                  .preMDAActivityDrugAdministrators[
                                                  index
                                                ].noOfDrugAdministrator
                                              }
                                              className='form-control'
                                            />
                                          </div>
                                        </div>
                                        <div className='col-md-1 col-xl-3 col-12'>
                                          {formik.values
                                            .preMDAActivityDrugAdministrators &&
                                          formik.values
                                            .preMDAActivityDrugAdministrators[
                                            index
                                          ] &&
                                          formik.values
                                            .preMDAActivityDrugAdministrators[
                                            index
                                          ].cadreOfDrugAdminId ===
                                            cadreOfDrugAdminOthersIdValue ? (
                                            <div className='form-grp'>
                                              <label
                                                htmlFor='otherDrugAdministrator'
                                                className='form-label font-chng'
                                              >
                                                Other Drug Administrator
                                              </label>
                                              <input
                                                type='text'
                                                name={`preMDAActivityDrugAdministrators[${index}].otherDrugAdministrator`}
                                                onChange={formik.handleChange}
                                                onKeyPress={(e) =>
                                                  commonFunction.keyPress(e)
                                                }
                                                onInput={(event) =>
                                                  commonFunction.onlyAlphabets(
                                                    event
                                                  )
                                                }
                                                value={
                                                  formik.values
                                                    .preMDAActivityDrugAdministrators[
                                                    index
                                                  ].otherDrugAdministrator
                                                }
                                                className='form-control'
                                              />
                                            </div>
                                          ) : null}
                                        </div>
                                        <div className='col-md-2 col-xl-3 col-12 mopt-btn'>
                                          {location &&
                                          location.state &&
                                          location.state.view ? (
                                            ''
                                          ) : (
                                            <div className='form-grp m-3'>
                                              {formik.values
                                                .preMDAActivityDrugAdministrators
                                                .length -
                                                1 ===
                                                index && (
                                                <Button
                                                  type='button'
                                                  className='fnt-btn btn btn-secondary'
                                                  style={{
                                                    display: 'inline-block',
                                                  }}
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    arrayHelpers.push({
                                                      cadreOfDrugAdminId: '',
                                                      preMDAActivityId: 0,
                                                      otherDrugAdministrator:
                                                        '',
                                                      noOfDrugAdministrator: '',
                                                    });
                                                  }}
                                                >
                                                  Add
                                                </Button>
                                              )}
                                              <button
                                                disabled={index ? false : true}
                                                style={{
                                                  display: 'inline-block',
                                                  float: 'right',
                                                }}
                                                type='button'
                                                className='btn'
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  arrayHelpers.remove(index);
                                                  deleteFieldArrayPreMDAActivityDrugAdministrators(
                                                    preMDAActivityDrugAdministrators
                                                  );
                                                  addFieldPreMDAActivityDrugAdministrators(
                                                    arrayHelpers
                                                  );
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
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='requiredSupervisors'
                              className='form-label font-chng'
                            >
                              Required supervisors
                            </label>
                            <input
                              name='requiredSupervisors'
                              type='number'
                              className='form-control font-chng'
                              onChange={formik.handleChange}
                              value={formik.values.requiredSupervisors}
                              onKeyDown={(e) =>
                                symbolsArr.includes(e.key) && e.preventDefault()
                              }
                              min='0'
                              onWheel={(e) =>
                                commonFunction.handleWheelEvent(e)
                              }
                            />
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='actualAvailableSupervisor'
                              className='form-label font-chng'
                            >
                              Actual availabe supervisor
                            </label>
                            <input
                              name='actualAvailableSupervisor'
                              type='number'
                              className='form-control font-chng'
                              onChange={formik.handleChange}
                              value={formik.values.actualAvailableSupervisor}
                              onKeyDown={(e) =>
                                symbolsArr.includes(e.key) && e.preventDefault()
                              }
                              min='0'
                              onWheel={(e) =>
                                commonFunction.handleWheelEvent(e)
                              }
                            />
                          </div>
                        </div>
                      </Row>
                    </div>
                    <FieldArray
                      name='preMDAActivitySupervisors'
                      render={(arrayHelpers: any) => (
                        <fieldset
                          disabled={
                            location.state && location.state.view ? true : false
                          }
                        >
                          <div className='mb-2'>
                            {formik.values.preMDAActivitySupervisors.map(
                              (preMDAActivitySupervisors, index) => (
                                <div key={index}>
                                  <Row>
                                    <div className='col-xl-3 col-md-1 col-12'>
                                      <div className='form-grp'>
                                        <label
                                          htmlFor='cadreOfSupervisorId'
                                          className='form-label font-chng'
                                        >
                                          Cadre Of Supervisor*
                                        </label>
                                        <Select
                                          name={`preMDAActivitySupervisors[${index}].cadreOfSupervisorId`}
                                          isDisabled={
                                            location.state &&
                                            location.state.view
                                              ? true
                                              : false
                                          }
                                          styles={commonFunction.customStyles}
                                          isClearable={true}
                                          className={
                                            formik.errors
                                              .preMDAActivitySupervisors &&
                                            formik.errors
                                              .preMDAActivitySupervisors[
                                              index
                                            ] &&
                                            formik.errors
                                              .preMDAActivitySupervisors[index][
                                              'cadreOfSupervisorId'
                                            ] &&
                                            formik.touched
                                              .preMDAActivitySupervisors &&
                                            formik.touched
                                              .preMDAActivitySupervisors[
                                              index
                                            ] &&
                                            formik.touched
                                              .preMDAActivitySupervisors[index][
                                              'cadreOfSupervisorId'
                                            ]
                                              ? 'custom-select font-chng is-invalid'
                                              : 'custom-select font-chng'
                                          }
                                          value={
                                            caderSuperVisorList
                                              ? caderSuperVisorList.find(
                                                  (option: any) =>
                                                    option &&
                                                    option.value ===
                                                      formik.values
                                                        .preMDAActivitySupervisors[
                                                        index
                                                      ]['cadreOfSupervisorId']
                                                )
                                              : ''
                                          }
                                          options={caderSuperVisorList}
                                          onChange={(option: Option) => {
                                            formik.setFieldValue(
                                              `preMDAActivitySupervisors[${index}].cadreOfSupervisorId`,
                                              option && option.value
                                            );
                                          }}
                                        ></Select>
                                        <div className={'invalid-feedback'}>
                                          {formik.errors
                                            .preMDAActivitySupervisors &&
                                          formik.errors
                                            .preMDAActivitySupervisors[index] &&
                                          formik.errors
                                            .preMDAActivitySupervisors[index][
                                            'cadreOfSupervisorId'
                                          ]
                                            ? formik.errors
                                                .preMDAActivitySupervisors[
                                                index
                                              ]['cadreOfSupervisorId']
                                            : ''}
                                        </div>
                                      </div>
                                    </div>
                                    <div className='col-md-1 col-xl-3 col-12'>
                                      <div className='form-grp'>
                                        <label
                                          htmlFor='noOfSupervisor'
                                          className='form-label font-chng'
                                        >
                                          Number Of Supervisor
                                        </label>
                                        <input
                                          type='number'
                                          min='0'
                                          onWheel={(e) =>
                                            commonFunction.handleWheelEvent(e)
                                          }
                                          name={`preMDAActivitySupervisors[${index}].noOfSupervisor`}
                                          onChange={formik.handleChange}
                                          onKeyDown={(e) =>
                                            symbolsArr.includes(e.key) &&
                                            e.preventDefault()
                                          }
                                          value={
                                            formik.values
                                              .preMDAActivitySupervisors[index]
                                              .noOfSupervisor
                                          }
                                          className='form-control'
                                        />
                                      </div>
                                    </div>
                                    <div className='col-md-1 col-xl-3 col-12'>
                                      {formik.values
                                        .preMDAActivitySupervisors &&
                                      formik.values.preMDAActivitySupervisors[
                                        index
                                      ] &&
                                      formik.values.preMDAActivitySupervisors[
                                        index
                                      ].cadreOfSupervisorId ===
                                        cadreOfSupervisorOthersIdValue ? (
                                        <div className='form-grp'>
                                          <label
                                            htmlFor='otherDrugSupervisor'
                                            className='form-label font-chng'
                                          >
                                            Other Supervisor
                                          </label>
                                          <input
                                            type='text'
                                            name={`preMDAActivitySupervisors[${index}].otherDrugSupervisor`}
                                            onChange={formik.handleChange}
                                            onKeyPress={(e) =>
                                              commonFunction.keyPress(e)
                                            }
                                            onInput={(event) =>
                                              commonFunction.onlyAlphabets(
                                                event
                                              )
                                            }
                                            value={
                                              formik.values
                                                .preMDAActivitySupervisors[
                                                index
                                              ].otherDrugSupervisor
                                            }
                                            className='form-control'
                                          />
                                        </div>
                                      ) : null}
                                    </div>
                                    <div className='col-md-2 col-xl-3 col-12 mopt-btn'>
                                      {location &&
                                      location.state &&
                                      location.state.view ? (
                                        ''
                                      ) : (
                                        <div className='form-grp m-3'>
                                          {formik.values
                                            .preMDAActivitySupervisors.length -
                                            1 ===
                                            index && (
                                            <Button
                                              type='button'
                                              className='fnt-btn btn btn-secondary'
                                              style={{
                                                display: 'inline-block',
                                              }}
                                              onClick={(e) => {
                                                e.preventDefault();
                                                arrayHelpers.push({
                                                  cadreOfSupervisorId: '',
                                                  preMDAActivityId: 0,
                                                  otherDrugSupervisor: '',
                                                  noOfSupervisor: '',
                                                });
                                              }}
                                            >
                                              Add
                                            </Button>
                                          )}
                                          <button
                                            disabled={index ? false : true}
                                            type='button'
                                            className='btn'
                                            style={{
                                              display: 'inline-block',
                                              float: 'right',
                                            }}
                                            onClick={(e) => {
                                              e.preventDefault();
                                              arrayHelpers.remove(index);
                                              deleteFieldArrayPreMDAActivitySupervisors(
                                                preMDAActivitySupervisors
                                              );
                                              addFieldPreMDAActivitySupervisors(
                                                arrayHelpers
                                              );
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
                  </div>
                </div>
              </fieldset>
              <div className='card mb-4'>
                <h4 className='formtitlenew font-chng m-3'>Training status</h4>
                <div className='card-body'>
                  <fieldset
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  >
                    <Row
                      className='mb-3'
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'end',
                      }}
                    >
                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='numberTrainedForMMDP'
                            className='form-label font-chng'
                          >
                            Number Trained for Morbidity Management
                          </label>
                          <input
                            name='numberTrainedForMMDP'
                            type='number'
                            className='form-control font-chng'
                            onChange={formik.handleChange}
                            value={formik.values.numberTrainedForMMDP}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          />
                        </div>
                      </div>
                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='batchesOfTrainingOrganizedMMDP'
                            className='form-label font-chng'
                          >
                            Batches of training organized for MMDP
                          </label>
                          <input
                            name='batchesOfTrainingOrganizedMMDP'
                            type='number'
                            className='form-control font-chng'
                            onChange={formik.handleChange}
                            value={formik.values.batchesOfTrainingOrganizedMMDP}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          />
                        </div>
                      </div>
                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='numberTrainedForMDAIDA'
                            className='form-label font-chng'
                          >
                            Number trained for MDA/IDA
                          </label>
                          <input
                            name='numberTrainedForMDAIDA'
                            type='number'
                            className='form-control font-chng'
                            onChange={formik.handleChange}
                            value={formik.values.numberTrainedForMDAIDA}
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          />
                        </div>
                      </div>
                      <div className='col-xl-3 col-md-6 col-12'>
                        <div className='form-grp'>
                          <label
                            htmlFor='batchesOfTrainingOrganizedMDAIDA'
                            className='form-label font-chng'
                          >
                            Batches of training organized for MDA/IDA
                          </label>
                          <input
                            name='batchesOfTrainingOrganizedMDAIDA'
                            type='number'
                            className='form-control font-chng'
                            onChange={formik.handleChange}
                            value={
                              formik.values.batchesOfTrainingOrganizedMDAIDA
                            }
                            onKeyDown={(e) =>
                              symbolsArr.includes(e.key) && e.preventDefault()
                            }
                            min='0'
                            onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          />
                        </div>
                      </div>
                    </Row>
                  </fieldset>
                  {/* <div className="form-grp text-right" style={{ display: "flex", justifyContent: "center" }}>
                    <button
                      type="submit"
                      className="btn btn-outline-light font-chng"
                      onClick={() => history.push(listDESheetName)}
                    >Cancel
                    </button>
                    <button id="Submitbtnid" type="submit"
                      className="mt-m btn btn-secondary btn-pad font-chng"
                      style={{ backgroundColor: '#19D895', border: 'none' }}
                    >Next</button>
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
                  }}
                >
                  Cancel
                </Button>
                <Button
                  id='Submitbtnid'
                  type='submit'
                  style={{
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                  }}
                >
                  Next
                </Button>
              </div>
            </>
          </form>
        </FormikProvider>
      ) : (
        <div>
          {hide ? (
            <>
              <div className='card mt-4 mb-4'>
                <div className='row'>
                  <div className='col-md-9 col-12'>
                    <h4 className='m-3 formtitlenew font-chng'>
                      Drugs Logistics List
                    </h4>
                  </div>
                  {location && location.state && location.state.view ? (
                    ''
                  ) : (
                    <div className='col-md-3 col-12 text-right'>
                      <Button
                        variant='secondary'
                        className='mt-m font-chng'
                        onClick={(e) => {
                          e.preventDefault();
                          setPreMDAActivityDrugLogistics(
                            preMDAActivityDrugLogistics
                          );
                          hideDrugs();
                        }}
                      >
                        <img src={plusImg} className='pe-2' />
                        Add New
                      </Button>
                    </div>
                  )}
                </div>
                <div className='post-tablenew cus-table font-chng'>
                  <DataTable
                    columns={columns1}
                    data={getDrugData}
                    expandableRows={true}
                    //expandOnRowClicked={true}
                    expandableRowsComponent={<AccordionComponent />}
                    highlightOnHover
                    pagination
                    paginationPerPage={10}
                    paginationRowsPerPageOptions={[10, 25, 50]}
                    paginationComponentOptions={{
                      rowsPerPageText: 'Records per page:',
                      rangeSeparatorText: 'out of',
                    }}
                  />
                </div>
                <div
                  className='form-grp text-right'
                  style={{ display: 'flex', justifyContent: 'center' }}
                >
                  {/* <button type="submit" className="btn btn-outline-light font-chng" onClick={handleBack}><i className="fas fa-arrow-left" ></i>Back</button> */}
                  {/* {((location.state && !location.state.view) || (!location.state)) && (!(location.state && location.state.id)) &&
                  <button type="submit" className="mt-m btn btn-secondary btn-pad font-chng"
                    onClick={() => moveToListPage()}
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
                } */}
                </div>
              </div>
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
                {((location.state && !location.state.view) ||
                  !location.state) &&
                  !(location.state && location.state.id) && (
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
            </>
          ) : (
            <>
              <FormikProvider value={Drugformik}>
                <form
                  onClick={showToast}
                  onSubmit={Drugformik.handleSubmit}
                  onChange={Drugformik.handleChange}
                >
                  <fieldset
                    disabled={
                      location.state && location.state.view ? true : false
                    }
                  >
                    <div className='card mt-4 mb-4'>
                      <h4 className='formtitlenew font-chng m-3'>
                        Drugs Logistics
                      </h4>
                      <div className='card-body'>
                        <Row className='mb-3'>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp form-view'>
                              <label
                                htmlFor='nameOfTablet'
                                className='form-label mt-s font-chng'
                              >
                                Name of tablet*
                              </label>
                              <Select
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                styles={commonFunction.customStyles}
                                isClearable={true}
                                name='nameOfTablet'
                                className={
                                  Drugformik.errors.nameOfTablet &&
                                  Drugformik.errors.nameOfTablet
                                    ? 'custom-select is-invalid'
                                    : 'custom-select font-chng'
                                }
                                value={
                                  tabletNameDropdownData
                                    ? tabletNameDropdownData.find(
                                        (option: any) =>
                                          option &&
                                          option.value ===
                                            Drugformik.values.nameOfTablet
                                      )
                                    : ''
                                }
                                options={tabletNameDropdownData}
                                onChange={(option: Option) => {
                                  Drugformik.setFieldValue(
                                    'nameOfTablet',
                                    option && option.value
                                  );
                                }}
                              ></Select>
                              <div className={'invalid-feedback'}>
                                {Drugformik.errors
                                  ? Drugformik.errors.nameOfTablet
                                  : ''}
                              </div>
                            </div>
                          </div>
                        </Row>
                      </div>
                    </div>

                    <div className='card mt-4 mb-4'>
                      <h4 className='formtitlenew font-chng m-3'>
                        Stock Before Round
                      </h4>
                      <div className='card-body'>
                        <Row className='mb-3'>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp form-view'>
                              <label
                                htmlFor='batchNumberOfTablet'
                                className='form-label mt-s font-chng'
                              >
                                Batch Number of tablet*
                              </label>
                              <input
                                name='batchNumberOfTablet'
                                type='text'
                                className={
                                  Drugformik.errors.batchNumberOfTablet &&
                                  Drugformik.touched.batchNumberOfTablet
                                    ? 'form-control is-invalid'
                                    : 'form-control'
                                }
                                //   onInput={(event)=>commonFunction.onlyAlphabets(event)}
                                onChange={Drugformik.handleChange}
                                value={Drugformik.values.batchNumberOfTablet}
                              />
                              <div className={'invalid-feedback'}>
                                {Drugformik.errors
                                  ? Drugformik.errors.batchNumberOfTablet
                                  : ''}
                              </div>
                            </div>
                          </div>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp form-view'>
                              <label
                                htmlFor='dateOfExpiryTablet'
                                className='form-label mt-s font-chng'
                              >
                                Date Of Expiry tablet
                              </label>
                              <input
                                type='date'
                                className='form-control font-chng'
                                name='dateOfExpiryTablet'
                                value={Drugformik.values.dateOfExpiryTablet}
                                onChange={Drugformik.handleChange}
                              />
                            </div>
                          </div>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='quantityTabletRquireForMDA'
                                className='form-label font-chng'
                              >
                                Quantity Tablet Require for MDA
                              </label>
                              <input
                                name='quantityTabletRquireForMDA'
                                type='number'
                                min='0'
                                onWheel={(e) =>
                                  commonFunction.handleWheelEvent(e)
                                }
                                className='form-control font-chng'
                                onChange={Drugformik.handleChange}
                                onKeyDown={(e) =>
                                  symbolsArr.includes(e.key) &&
                                  e.preventDefault()
                                }
                                value={
                                  Drugformik.values.quantityTabletRquireForMDA
                                }
                              />
                            </div>
                          </div>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='quantityTabletInStockBeforeRound'
                                className='form-label font-chng'
                              >
                                Quantity Tablet in Stock Before Round
                              </label>
                              <input
                                name='quantityTabletInStockBeforeRound'
                                type='number'
                                min='0'
                                onWheel={(e) =>
                                  commonFunction.handleWheelEvent(e)
                                }
                                className='form-control font-chng'
                                onKeyDown={(e) =>
                                  symbolsArr.includes(e.key) &&
                                  e.preventDefault()
                                }
                                onChange={Drugformik.handleChange}
                                value={
                                  Drugformik.values
                                    .quantityTabletInStockBeforeRound
                                }
                              />
                            </div>
                          </div>
                        </Row>
                      </div>
                    </div>

                    <div className='card mt-4 mb-4'>
                      <h4 className='formtitlenew font-chng m-3'>
                        Received During Round/For Round
                      </h4>
                      <div className='card-body'>
                        <Row className='mb-3' style={{ alignItems: 'end' }}>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp form-view'>
                              <label
                                htmlFor='quantityOfTabletReceivedForRound'
                                className='form-label mt-s font-chng'
                              >
                                Quantity of Tablet Received for Round
                              </label>
                              <input
                                name='quantityOfTabletReceivedForRound'
                                type='number'
                                min='0'
                                onWheel={(e) =>
                                  commonFunction.handleWheelEvent(e)
                                }
                                className='form-control font-chng'
                                onKeyDown={(e) =>
                                  symbolsArr.includes(e.key) &&
                                  e.preventDefault()
                                }
                                onChange={Drugformik.handleChange}
                                value={
                                  Drugformik.values
                                    .quantityOfTabletReceivedForRound
                                }
                              />
                            </div>
                          </div>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='batchNoOfTabletReceivedForRound'
                                className='form-label font-chng'
                              >
                                Batch Number of Tablet Received for Round
                              </label>
                              <input
                                name='batchNoOfTabletReceivedForRound'
                                type='text'
                                className='form-control'
                                onChange={Drugformik.handleChange}
                                //onInput={(event)=>commonFunction.onlyAlphabets(event)}
                                value={
                                  Drugformik.values
                                    .batchNoOfTabletReceivedForRound
                                }
                              />
                            </div>
                          </div>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='dateOfExpiryTabletReceivedForRound'
                                className='form-label font-chng'
                              >
                                Date of Expiry Tablet Received for Round
                              </label>

                              <input
                                type='date'
                                className='form-control font-chng'
                                name='dateOfExpiryTabletReceivedForRound'
                                value={
                                  Drugformik.values
                                    .dateOfExpiryTabletReceivedForRound
                                }
                                onChange={Drugformik.handleChange}
                              />
                            </div>
                          </div>
                          <div className='col-xl-3 ol-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='sourceFromTabletReceivedForRound'
                                className='form-label font-chng'
                              >
                                Source from Tablet Received for Round
                              </label>
                              <Select
                                isDisabled={
                                  location.state && location.state.view
                                    ? true
                                    : false
                                }
                                name='sourceFromTabletReceivedForRound'
                                className='custom-select font-chng'
                                isClearable='true'
                                // onChange={(e) => hidesourcerounddist(e)}
                                onChange={(option: Option) => {
                                  Drugformik.setFieldValue(
                                    'sourceFromTabletReceivedForRound',
                                    option && option.value
                                  );
                                  hidesourcerounddist(option);
                                }}
                                value={
                                  Sourcefromtable
                                    ? Sourcefromtable.find(
                                        (option: any) =>
                                          option &&
                                          option.value ===
                                            Drugformik.values
                                              .sourceFromTabletReceivedForRound
                                      )
                                    : ''
                                }
                                options={Sourcefromtable}
                              ></Select>
                            </div>
                          </div>
                          {hideData ? (
                            <div className='col-xl-3 col-md-6 col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='sourceFromTabletReceivedForRoundDist'
                                  className='form-label font-chng'
                                >
                                  Source from Tablet Received for Round District
                                </label>
                                {districtValues &&
                                districtValues.length !== 0 ? (
                                  <Select
                                    name='sourceFromTabletReceivedForRoundDist'
                                    isDisabled={
                                      location.state && location.state.view
                                        ? true
                                        : false
                                    }
                                    styles={commonFunction.customStyles}
                                    options={districtList}
                                    //placeholder={"select District"}
                                    isClearable={true}
                                    value={
                                      districtList
                                        ? districtList.find(
                                            (option) =>
                                              option.value ===
                                              Drugformik.values
                                                .sourceFromTabletReceivedForRoundDist
                                          )
                                        : ''
                                    }
                                    className={
                                      Drugformik.errors
                                        .sourceFromTabletReceivedForRoundDist &&
                                      Drugformik.touched
                                        .sourceFromTabletReceivedForRoundDist
                                        ? 'custom-select is-invalid'
                                        : 'custom-select font-chng'
                                    }
                                    onChange={(option: Option) => {
                                      Drugformik.setFieldValue(
                                        'sourceFromTabletReceivedForRoundDist',
                                        option && option.value
                                      );
                                      getDistrict(option);
                                    }}
                                  ></Select>
                                ) : (
                                  <Select
                                    name='sourceFromTabletReceivedForRoundDist'
                                    styles={commonFunction.customStyles}
                                    options={NoneList}
                                    isClearable={true}
                                    value={
                                      districtList
                                        ? districtList.find(
                                            (option) =>
                                              option.value ===
                                              Drugformik.values
                                                .sourceFromTabletReceivedForRoundDist
                                          )
                                        : ''
                                    }
                                    className={
                                      Drugformik.errors
                                        .sourceFromTabletReceivedForRoundDist &&
                                      Drugformik.touched
                                        .sourceFromTabletReceivedForRoundDist
                                        ? 'custom-select is-invalid'
                                        : 'custom-select font-chng'
                                    }
                                    onChange={(option: Option) => {
                                      Drugformik.setFieldValue(
                                        'sourceFromTabletReceivedForRoundDist',
                                        option && option.value
                                      );
                                      getDistrict(option);
                                    }}
                                    aria-label='Default select example'
                                  ></Select>
                                )}
                              </div>
                            </div>
                          ) : null}
                        </Row>
                      </div>
                    </div>

                    <div className='card mt-4 mb-4'>
                      <h4 className='formtitlenew font-chng m-3'>
                        Destroyed Since Last Round
                      </h4>
                      <div className='card-body'>
                        <Row className='mb-3'>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='quantityOfTabletsDestroyedDuringRound'
                                className='form-label font-chng'
                              >
                                Quantity of Tablet Destroyed During Round
                              </label>
                              <input
                                name='quantityOfTabletsDestroyedDuringRound'
                                type='number'
                                min='0'
                                onWheel={(e) =>
                                  commonFunction.handleWheelEvent(e)
                                }
                                className='form-control'
                                onChange={Drugformik.handleChange}
                                onKeyDown={(e) =>
                                  symbolsArr.includes(e.key) &&
                                  e.preventDefault()
                                }
                                value={
                                  Drugformik.values
                                    .quantityOfTabletsDestroyedDuringRound
                                }
                              />
                            </div>
                          </div>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='reasonForTabletsDestroyed'
                                className='form-label font-chng'
                              >
                                Reason for tablet Destroyed
                              </label>
                              <input
                                name='reasonForTabletsDestroyed'
                                type='text'
                                className='form-control'
                                onChange={Drugformik.handleChange}
                                //onInput={(event)=>commonFunction.onlyAlphabets(event)}
                                value={
                                  Drugformik.values.reasonForTabletsDestroyed
                                    ? Drugformik.values
                                        .reasonForTabletsDestroyed
                                    : ''
                                }
                              />
                            </div>
                          </div>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='batchNumberOfTabletDestroyed'
                                className='form-label font-chng'
                              >
                                Batch Number of Tablet Destroyed
                              </label>
                              <input
                                name='batchNumberOfTabletDestroyed'
                                type='text'
                                className='form-control'
                                onChange={Drugformik.handleChange}
                                value={
                                  Drugformik.values.batchNumberOfTabletDestroyed
                                }
                              />
                            </div>
                          </div>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='dateOfExpiryTabletDestroyed'
                                className='form-label font-chng'
                              >
                                Date of Expiry Tablet Destroyed
                              </label>
                              <input
                                type='date'
                                className='form-control font-chng'
                                name='dateOfExpiryTabletDestroyed'
                                value={
                                  Drugformik.values.dateOfExpiryTabletDestroyed
                                }
                                onChange={Drugformik.handleChange}
                              />
                            </div>
                          </div>
                        </Row>
                      </div>
                    </div>
                  </fieldset>
                  <div className='card mb-4'>
                    <h4 className='formtitlenew font-chng m-3'>
                      Stock In hand After Current Round
                    </h4>
                    <div className='card-body'>
                      <fieldset
                        disabled={
                          location.state && location.state.view ? true : false
                        }
                      >
                        <Row className='mb-3'>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='quantityOfBalanceTabletsInStock'
                                className='form-label font-chng'
                              >
                                Quantity in hand after current round
                              </label>
                              <input
                                name='quantityOfBalanceTabletsInStock'
                                type='number'
                                min='0'
                                onWheel={(e) =>
                                  commonFunction.handleWheelEvent(e)
                                }
                                className='form-control'
                                onChange={Drugformik.handleChange}
                                onKeyDown={(e) =>
                                  symbolsArr.includes(e.key) &&
                                  e.preventDefault()
                                }
                                value={
                                  Drugformik.values
                                    .quantityOfBalanceTabletsInStock
                                }
                              />
                            </div>
                          </div>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='batchNumberOfTabletInStock'
                                className='form-label font-chng'
                              >
                                Batch Number of Tablet In Stock
                              </label>
                              <input
                                name='batchNumberOfTabletInStock'
                                type='text'
                                className='form-control'
                                onChange={Drugformik.handleChange}
                                //onInput={(event)=>commonFunction.onlyAlphabets(event)}
                                value={
                                  Drugformik.values.batchNumberOfTabletInStock
                                }
                              />
                            </div>
                          </div>
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='dateOfExpiryTabletInStock'
                                className='form-label font-chng'
                              >
                                Date of Expiry Tablet In Stock
                              </label>
                              <input
                                type='date'
                                className='form-control font-chng'
                                name='dateOfExpiryTabletInStock'
                                value={
                                  Drugformik.values.dateOfExpiryTabletInStock
                                }
                                onChange={Drugformik.handleChange}
                              />
                            </div>
                          </div>
                        </Row>
                      </fieldset>
                      {/* <div className="form-grp text-right" style={{ display: "flex", justifyContent: "center" }} >
                        <button className="btn btn-outline-light font-chng" onClick={Back}><i className="fas fa-arrow-left" ></i>Back</button>
                        <button id="Submitbtnid2" type="submit" className="mt-m btn btn-secondary btn-pad font-chng">Submits</button>
                      </div> */}
                    </div>
                  </div>
                  <div className='buttongrouprightend mb-4'>
                    <Button
                      type='submit'
                      // className=' btn-cancel'
                      onClick={Back}
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
                  </div>
                </form>
              </FormikProvider>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default AddPreMDAActivity;
