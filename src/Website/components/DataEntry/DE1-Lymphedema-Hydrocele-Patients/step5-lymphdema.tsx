import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Button as ReactButton } from '@material-ui/core';
import { FormikProvider, useFormik } from 'formik';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import { HFFollowUps, str2boolean } from './Form1-stepper-config';
import { LymphedemaLineListFollowUpsHF } from '../../../interfaces/FormLymphedema';
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import DoctorImg from '../../../assets/img/LEFP_Images/Doctor_icon.png';
import LymphedemaPatientInfoService from '../../../services/FormLymphedemaService';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import history from '../../../../helpers/history';
import DropdownService from '../../../services/DropdownService';
import { MultiSelect } from 'react-multi-select-component';
import * as Yup from 'yup';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import Select, { Option } from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonFunction from '../../../../helpers/common/common';
import AccordionLymphedamaLineListFollowUpsHF from './AccordionLymphedamaLineListFollowUpsHF';
import lymphedemaLineListDraftServices from '../../../draftServices/FormLymphdemaHydroceleDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';

const Step5 = (props: any) => {
  let isValidDate = moment().format('YYYY-MM-DD');
  const listDESheetName: any = props && props.listDESheetName;
  let isOnline = window.navigator.onLine;
  const location: any = useLocation();
  const StageHydrogele = [
    { label: 1, value: 1 },
    { label: 2, value: 2 },
    { label: 3, value: 3 },
    { label: 4, value: 4 },
  ];
  const ExpandedComponent = (row) => {
    return <AccordionLymphedamaLineListFollowUpsHF rowValues={row} />;
  };
  const hfFollowupcolumns = [
    {
      name: 'Surgeon Name',
      selector: 'nameOfSurgeon',
    },
    {
      name: 'Service Provider',
      selector: 'serviceProviderName',
    },
    {
      name: 'Service Provider Place',
      selector: 'serviceProviderPlace',
    },
    {
      name: 'Any Co-Morbidity',
      selector: (row: any) => {
        if (location && location.state && location.state.id) {
          return row.isAnyComorbidity ? 'Yes' : 'No';
        } else {
          return row.isAnyComorbidity === true ||
            row.isAnyComorbidity === 'true'
            ? 'Yes'
            : 'No';
        }
      },
    },

    {
      name: 'Surgery Done',
      selector: (row: any) => {
        if (location && location.state && location.state.id) {
          return row.isSurgeryDone ? 'Yes' : 'No';
        } else {
          return row.isSurgeryDone === true || row.isSurgeryDone === 'true'
            ? 'Yes'
            : 'No';
        }
      },
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
          {location && location.state && location.state.view && (
            <button className='btn tooltip-wrap'>
              <img src={viewIcon} onClick={() => viewHFSurvey(row)} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>View</div>
              </div>
            </button>
          )}
          {location && location.state && location.state.view ? (
            ''
          ) : (
            <>
              <button className='btn tooltip-wrap'>
                <img src={editIcon} onClick={() => updateHFSurvey(row)} />
                <div className='tooltip'>
                  <div className='tooltip-inner font-chng'>Edit</div>
                </div>
              </button>
              <button className='btn tooltip-wrap'>
                <img src={deleteIcon} onClick={() => deleteHFSurvey(row)} />
                <div className='tooltip'>
                  <div className='tooltip-inner font-chng'>Delete</div>
                </div>
              </button>
            </>
          )}
        </div>
      ),
    },
  ];
  const [hideHFFollowupList, setHideHFFollowupList] = useState(false);
  let [hFFollowUpList, setHFFollowUpList] = useState([]);
  let [othersCoMorbity, setOthersCoMorbity] = useState(false);
  let [showOthersCoMorbity, setShowOthersCoMorbity] = useState(false);
  let [showSurgeryDoneInfo, setShowSurgeryDoneInfo] = useState(false);
  let [check1, setCheck1] = useState(false);
  let [check2, setCheck2] = useState(false);
  let [showSurgeryNotPossibleInfo, setShowSurgeryNotPossibleInfo] =
    useState(true);
  const [showDeathOfDate, setShowDeathOfDate] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPlaceOfMigration, setShowPlaceOfMigration] = useState(false);
  const [surgeryNotPossibleReasonsOption, setsurgeryNotPossibleReasonsOption] =
    useState([]);
  let [facilityIdValues, setfacilityIdValues] = useState([]);
  const [coMorbidityTypselectedOption, setcoMorbidityTypselectedOption] =
    useState([]);

  const CoMorbidityTypeOptions = [
    { label: 'DM', value: 'DM' },
    { label: 'HT', value: 'HT' },
    { label: 'Asthma', value: 'Asthma' },
    { label: 'Others', value: 'Others' },
  ];

  const [formdata, setFormData] =
    useState<LymphedemaLineListFollowUpsHF>(HFFollowUps);
  const [showReasonOthers, setShowReasonOthers] = useState(false);
  const [lFdata, setLFData] =
    useState<LymphedemaLineListFollowUpsHF>(HFFollowUps);
  const [nameOfHospitalSurgeryDonename, setnameOfHospitalSurgeryDonename] =
    useState('');
  function viewHFSurvey(row) {
    row.isAnyComorbidity =
      typeof row.isAnyComorbidity === 'string'
        ? str2boolean(row.isAnyComorbidity)
        : row.isAnyComorbidity;
    row.isSurgeryDone =
      typeof row.isSurgeryDone === 'string'
        ? str2boolean(row.isSurgeryDone)
        : row.isSurgeryDone;
    let str: any = row.comorbidityType;
    let arr: any = str && str.split(',');
    let test: any = [];
    for (let i = 0; arr && i < arr.length; i++) {
      CoMorbidityTypeOptions.forEach((element: any) => {
        if (element.value === arr[i]) {
          if (arr[i] === 'Others') {
            setOthersCoMorbity(true);
          } else if (!(arr[i] === 'Others')) {
            setOthersCoMorbity(false);
          }
          test.push(element);
        }
      });
    }
    setcoMorbidityTypselectedOption(test);
    if (row.isAnyComorbidity) {
      setShowOthersCoMorbity(true);
    } else {
      setShowOthersCoMorbity(false);
    }
    if (row.isAnyComorbidity) {
      setCheck1(true);
    } else {
      setCheck1(false);
    }
    if (row.isSurgeryDone) {
      setShowSurgeryNotPossibleInfo(false);
      setShowSurgeryDoneInfo(true);
      setCheck2(true);
    } else {
      setShowSurgeryDoneInfo(false);
      setShowSurgeryNotPossibleInfo(true);
      setCheck2(false);
    }

    hideHFFollowupLists();
    setFormData(row);
  }
  function updateHFSurvey(row) {
    console.log('updateHFSurvey:: ', row);
    row.isAnyComorbidity =
      typeof row.isAnyComorbidity === 'string'
        ? str2boolean(row.isAnyComorbidity)
        : row.isAnyComorbidity;
    row.isSurgeryDone =
      typeof row.isSurgeryDone === 'string'
        ? str2boolean(row.isSurgeryDone)
        : row.isSurgeryDone;
    let str: any = row.comorbidityType;
    let arr: any = str && str.split(',');
    let test: any = [];
    if (row.isAnyComorbidity) {
      setCheck1(true);
    } else {
      setCheck1(false);
    }
    if (row.isSurgeryDone) {
      setCheck2(true);
    } else {
      setCheck2(false);
    }
    for (let i = 0; arr && i < arr.length; i++) {
      CoMorbidityTypeOptions.forEach((element: any) => {
        if (element.value === arr[i]) {
          if (arr[i] === 'Others') {
            setOthersCoMorbity(true);
          } else if (!(arr[i] === 'Others')) {
            setOthersCoMorbity(false);
          }
          test.push(element);
        }
      });
    }
    setcoMorbidityTypselectedOption(test);
    if (row.isAnyComorbidity) {
      setShowOthersCoMorbity(true);
    } else {
      setShowOthersCoMorbity(false);
    }
    if (row.isSurgeryDone) {
      setShowSurgeryNotPossibleInfo(false);
      setShowSurgeryDoneInfo(true);
    } else {
      setShowSurgeryDoneInfo(false);
      setShowSurgeryNotPossibleInfo(true);
    }

    hideHFFollowupLists();
    setFormData(row);
    facilityIdValues?.map((item: any) => {
      if (row?.nameOfHospitalSurgeryDoneId == item.id) {
        setnameOfHospitalSurgeryDonename(item.facilityName);
      }
    });
  }
  async function deleteHFSurvey(row) {
    if (location && location.state && location.state.id) {
      const deleteResult: any =
        await LymphedemaPatientInfoService.deleteHFFollowups(row);
      if (deleteResult.status === 200) {
        console.log('post HF info:: ', deleteResult);
        getHFFollowups();
      }
    } else {
      console.log('delete uuid', row.lymphedemaLineListFollowUpsHFUUID);
      if (row && row.lymphedemaLineListFollowUpsHFUUID) {
        let deleteResult: any =
          await lymphedemaLineListDraftServices.deleteListLymphedemaLineListFollowUpsHF(
            row.lymphedemaLineListFollowUpsHFUUID
          );
        if (deleteResult) {
          console.log('post HF info:: ', deleteResult);
          getHFFollowups();
        }
      }
    }
  }
  async function saveHFFollowups(postdata) {
    let id;
    if (location && location.state && location.state.id) {
      if (postdata && postdata.id) {
        postdata.lastModifiedBy = props && props.userSessionId;
      } else {
        postdata.createdBy = props && props.userSessionId;
        postdata.lastModifiedBy = 0;
      }
      const postResult: any =
        await LymphedemaPatientInfoService.postHFFollowups(postdata);
      if (postResult && postResult.data) {
        console.log('post HF info:: ', postResult.data);
        showHFFollowupList();
      }
    } else if (location && location.state && location.state.UUID) {
      if (postdata && postdata.lymphedemaLineListFollowUpsHFUUID) {
        id = postdata.lymphedemaLineListFollowUpsHFUUID;
        postdata.lastModifiedBy = props && props.userSessionId;
        let updateResponse =
          await lymphedemaLineListDraftServices.updateLymphedemaLineListFollowUpsHF(
            id,
            postdata
          );
        if (updateResponse) {
          showHFFollowupList();
        }
      } else {
        postdata.createdBy = props && props.userSessionId;
        postdata.lastModifiedBy = 0;
        let addResponse =
          await lymphedemaLineListDraftServices.addLymphedemaLineListFollowUpsHF(
            postdata
          );
        if (addResponse) {
          showHFFollowupList();
        }
      }
    } else {
      if (postdata && postdata.lymphedemaLineListFollowUpsHFUUID) {
        id = postdata.lymphedemaLineListFollowUpsHFUUID;
        postdata.lastModifiedBy = props && props.userSessionId;
        let updateResponse =
          await lymphedemaLineListDraftServices.updateLymphedemaLineListFollowUpsHF(
            id,
            postdata
          );
        if (updateResponse) {
          showHFFollowupList();
        }
      } else {
        postdata.createdBy = props && props.userSessionId;
        postdata.lastModifiedBy = 0;
        let addResponse =
          await lymphedemaLineListDraftServices.addLymphedemaLineListFollowUpsHF(
            postdata
          );
        if (addResponse) {
          showHFFollowupList();
        }
      }
    }
  }
  function finish() {
    toast.success('Form Submitted Successfully', {
      position: toast.POSITION.TOP_CENTER,
      className: 'toast-message',
    });
    history.push(listDESheetName);
  }
  useEffect(() => {
    getHFFollowups();
    getOptionsContent();
  }, []);

  async function getOptionsContent() {
    if (isOnline) {
      const getsurgeryNotPossibleReasonsOptions: any =
        await DropdownService.getUnitAction();
      if (
        getsurgeryNotPossibleReasonsOptions &&
        getsurgeryNotPossibleReasonsOptions.data
      ) {
        setsurgeryNotPossibleReasonsOption(
          getsurgeryNotPossibleReasonsOptions.data
        );
      }
      const facilityId: any = await DropdownService.getFacilityInfo();
      if (facilityId && facilityId.data) {
        setfacilityIdValues(facilityId.data);
        facilityId.data?.map((item: any) => {
          if (
            item.id == formdata.nameOfHospitalSurgeryDoneId ||
            HFFollowUps?.nameOfHospitalSurgeryDoneId == item.id
          ) {
            setnameOfHospitalSurgeryDonename(item.facilityName);
          }
        });
      }
    } else {
      const facilityIdOffline =
        await DexieOfflineDataBase.getAllFacilityOffline();
      if (facilityIdOffline) {
        setfacilityIdValues(facilityIdOffline);
      }
      const getsurgeryNotPossibleReasonsOptionsOffline: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (getsurgeryNotPossibleReasonsOptionsOffline) {
        setsurgeryNotPossibleReasonsOption(
          getsurgeryNotPossibleReasonsOptionsOffline
        );
      }
    }
  }

  let surgeryNotPossibleReasonsList: any = [];
  surgeryNotPossibleReasonsOption &&
    surgeryNotPossibleReasonsOption.map((item: any, i: any) => {
      if (
        item &&
        item.categoryCode === 1015 &&
        item.categoryOptionCode !== 'P'
      ) {
        surgeryNotPossibleReasonsList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });

  // Finish Save Single Api
  async function finishSave() {
    if (
      (location && location.state && location.state.id) ||
      (location && location.state && location.state.view)
    ) {
      finish();
    } else {
      let lymphedemaLineListJSON;
      let lymphedemaLineListId;
      if (location && location.state && location.state.UUID) {
        lymphedemaLineListId = location.state.UUID;
      } else {
        lymphedemaLineListId = props.lymphedemaLineListUUID;
      }
      setIsDisabled(true);
      if (lymphedemaLineListId) {
        console.log('finish UUID', lymphedemaLineListId);
        let step1Values =
          await lymphedemaLineListDraftServices.getOneLymphedemaLineList(
            lymphedemaLineListId
          );
        lymphedemaLineListJSON = step1Values;
        let step3Values =
          await lymphedemaLineListDraftServices.getListLymphedemaLineListSurvey(
            lymphedemaLineListId
          );
        if (step3Values && step3Values.length > 0) {
          lymphedemaLineListJSON.LymphedemaLineListSurveys = step3Values;
        }
        let step4Values =
          await lymphedemaLineListDraftServices.getListLymphedemaLineListFollowUpsLF(
            lymphedemaLineListId
          );
        if (step4Values && step4Values.length > 0) {
          lymphedemaLineListJSON.LymphedemaLineListFollowUpsLFs = step4Values;
        }
        let step5Values =
          await lymphedemaLineListDraftServices.getListLymphedemaLineListFollowUpsHF(
            lymphedemaLineListId
          );
        if (step5Values && step5Values.length > 0) {
          lymphedemaLineListJSON.LymphedemaLineListFollowUpsHFs = step5Values;
        }
        console.log('lymphedemaLineListJSON', lymphedemaLineListJSON);
        let SaveApi: any =
          await LymphedemaPatientInfoService.createAllLymphedemaLineList(
            lymphedemaLineListJSON
          );
        setIsDisabled(false);
        console.log('SaveApi', SaveApi);
        if (SaveApi.status === 200) {
          finish();
          let step1Delete =
            await lymphedemaLineListDraftServices.deleteLymphedemaLineList(
              lymphedemaLineListId
            );
          console.log('step1Delete', step1Delete);
          let step3Delete =
            await lymphedemaLineListDraftServices.deleteListLymphedemaLineListSurvey(
              lymphedemaLineListId
            );
          if (step3Delete && step3Delete.length > 0) {
            console.log('step3Delete', step3Delete);
          }
          let step4Delete =
            await lymphedemaLineListDraftServices.deleteListLymphedemaLineListFollowUpsLF(
              lymphedemaLineListId
            );
          if (step4Delete && step4Delete.length > 0) {
            console.log('step4Delete', step4Delete);
          }
          let step5Delete =
            await lymphedemaLineListDraftServices.deleteListLymphedemaLineListFollowUpsHF(
              lymphedemaLineListId
            );
          if (step5Delete && step5Delete.length > 0) {
            console.log('step5Delete', step5Delete);
          }
        }
      }
    }
  }

  const facilityIdList =
    facilityIdValues &&
    facilityIdValues.map((item: any, i: any) => {
      return { label: item.facilityName, value: item.id };
    });

  facilityIdList.push({ label: 'Other', value: '0' });
  const onSubmit = (values, actions) => {
    if (location && location.state && location.state.view) {
      history.push(listDESheetName);
    } else {
      let arr: any = [];
      let Type: any;
      coMorbidityTypselectedOption.forEach((element: any) => {
        arr.push(element.value);
        Type = arr.join(',');
        values.comorbidityType = Type;
      });
      console.log('form HF values:: ', values);
      values.isAnyComorbidity = values.isAnyComorbidity
        ? values.isAnyComorbidity.toString()
        : 'false';
      values.isSurgeryDone = values.isSurgeryDone
        ? values.isSurgeryDone.toString()
        : 'false';
      let LymphedemaLineListId;
      if (location && location.state && location.state.id) {
        LymphedemaLineListId = location.state.id;
      } else if (location && location.state && location.state.UUID) {
        LymphedemaLineListId = location.state.UUID;
      } else {
        LymphedemaLineListId = props.lymphedemaLineListUUID;
      }

      values.lymphedemaLineListId = LymphedemaLineListId;
      saveHFFollowups(values);
    }
  };
  const changeCoMorbidity = (selected: any) => {
    setcoMorbidityTypselectedOption(selected);
    if (!(selected.length === 0)) {
      selected.forEach((element: any) => {
        if (element && element.value === 'Others') {
          setOthersCoMorbity(true);
        } else {
          setOthersCoMorbity(false);
          formik.setFieldValue('otherComorbidity', '');
        }
      });
    } else {
      setOthersCoMorbity(false);
    }
  };
  async function getHFFollowups() {
    let LymphedemaLineListId: any;
    let hFDetails: any;
    if (location && location.state && location.state.id) {
      LymphedemaLineListId = location.state.id;
      if (LymphedemaLineListId) {
        hFDetails = await LymphedemaPatientInfoService.getHFFollowups(
          LymphedemaLineListId
        );
      }
      if ((hFDetails && hFDetails.data) || (hFDetails && hFDetails.message)) {
        console.log('get HF info:: ', hFDetails.data);
        setHFFollowUpList(hFDetails.data);
      }
    } else if (location && location.state && location.state.UUID) {
      LymphedemaLineListId = location.state.UUID;
      if (LymphedemaLineListId) {
        hFDetails =
          await lymphedemaLineListDraftServices.getListLymphedemaLineListFollowUpsHF(
            LymphedemaLineListId
          );
        if (hFDetails) {
          setHFFollowUpList(hFDetails);
        }
      }
    } else {
      LymphedemaLineListId = props.lymphedemaLineListUUID;
      if (LymphedemaLineListId) {
        hFDetails =
          await lymphedemaLineListDraftServices.getListLymphedemaLineListFollowUpsHF(
            LymphedemaLineListId
          );
        if (hFDetails) {
          setHFFollowUpList(hFDetails);
        }
      }
    }
  }
  const validSchema = Yup.object().shape({
    serviceProviderName: Yup.string().required('Name is required').nullable(),
    serviceProviderDesignation: Yup.string()
      .required('Designation is required')
      .nullable(),
    serviceProviderPhone: Yup.string()
      .min(12, 'Invalid Phone Number')
      .nullable(),
    surgeonPhone: Yup.string().min(12, 'Invalid Phone Number').nullable(),
  });
  const formik = useFormik({
    initialValues: formdata,
    enableReinitialize: true,
    validationSchema: validSchema,
    onSubmit: onSubmit,
  });
  let hydroceleFollowUps = () => {
    return (
      <div>
        {step5HFFollowupList()}

        {step5HFFollowupAdd()}
      </div>
    );
  };
  function hideHFFollowupLists() {
    setHideHFFollowupList(true);
    formik.resetForm({ values: lFdata });
  }
  function addNew() {
    setShowSurgeryDoneInfo(false);
    setHideHFFollowupList(true);
    setShowSurgeryDoneInfo(false);
    setShowDeathOfDate(false);
    setCheck1(false);
    setShowPlaceOfMigration(false);
    setShowReasonOthers(false);
    setShowOthersCoMorbity(false);
    setShowSurgeryNotPossibleInfo(true);
    formik.resetForm({ values: lFdata });
  }
  function showHFFollowupList() {
    setHideHFFollowupList(false);
    getHFFollowups();
  }
  function isSurgeryDoneCheck(e) {
    if (e === 'true') {
      setShowSurgeryDoneInfo(true);
      setShowSurgeryNotPossibleInfo(false);
    } else if (e === 'false') {
      setShowSurgeryDoneInfo(false);
      setShowSurgeryNotPossibleInfo(true);
      setShowDeathOfDate(false);
      setShowPlaceOfMigration(false);
      setShowReasonOthers(false);
    }
    formik.setFieldValue('dateOfSurgery', formik.values.dateOfSurgery);
    formik.setFieldValue('nameOfHospitalSurgeryDoneId', 0);
    formik.setFieldValue('stageOfHydrocele', 0);
    formik.setFieldValue('surgeryNotPossibleReasonsId', 0);
    formik.setFieldValue('reasonOthers', formik.values.reasonOthers);
  }
  function selectCoMorbidity(e) {
    if (e === 'true') {
      setShowOthersCoMorbity(true);
      setOthersCoMorbity(false);
      setCheck1(true)
    } else if (e === 'false') {
      setShowOthersCoMorbity(false);
      formik.setFieldValue('comorbidityType', '');
      formik.setFieldValue('otherComorbidity', '');
      setcoMorbidityTypselectedOption([]);
      setCheck1(false)
    }
  }
  let handleOptions = (e) => {
    if (e && e.label === 'Death') {
      setShowDeathOfDate(true);
      setShowPlaceOfMigration(false);
      setShowReasonOthers(false);
    } else if (e && e.label === 'Migrated') {
      setShowPlaceOfMigration(true);
      setShowDeathOfDate(false);
      setShowReasonOthers(false);
    } else if (e && e.label == 'Other - Specify') {
      formik.setFieldValue('reasonOthers', '');
      setShowReasonOthers(true);
    } else {
      setShowDeathOfDate(false);
      setShowPlaceOfMigration(false);
      setShowReasonOthers(false);
    }
  };
  let step5HFFollowupList = () => {
    return (
      <div className='in-left'>
        {!hideHFFollowupList && (
          <div>
            <div className='card'>
              <div className='row'>
                <div className='col-md-10 col-12'>
                  <div
                    className='formtitlenew font-chng'
                    style={{ marginLeft: '33px' }}
                  >
                    Hydrocele Follow-up List
                  </div>{' '}
                </div>
                {location && location.state && location.state.view ? (
                  ''
                ) : (
                  <div className='col-md-2 col-12 text-right'>
                    <Button
                      variant='secondary'
                      className='mt-m font-chng'
                      onClick={addNew}
                    >
                      <img src={plusImg} className='pe-2' alt='' />
                      Add New
                    </Button>
                  </div>
                )}
              </div>
              <div className='post-tablenew font-chng cus-table'>
                <DataTable
                  columns={hfFollowupcolumns}
                  data={hFFollowUpList}
                  expandableRows={true}
                  onRowExpandToggled={(expand, row) => {
                    console.log(expand);
                    console.log(row);
                  }}
                  expandOnRowClicked={false}
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
            </div>
            <div className='buttongrouprightend'>
              {props.activeStep !== 0 && (
                <ReactButton
                  type='submit'
                  className=' btn-cancel'
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                  onClick={() => props.handleBack(props)}
                >
                  <i className='fas fa-arrow-left'></i>&nbsp;Back
                </ReactButton>
              )}
              {!(location && location.state && location.state.id) && (
                <ReactButton
                  onClick={() => finish()}
                  className=' btn-cancel'
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
                </ReactButton>
              )}
              {isOnline && (
                <ReactButton
                  onClick={() => finishSave()}
                  className=' btn-cancel'
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                  disabled={!isOnline ? (isDisabled ? true : false) : false}
                >
                  Submit
                </ReactButton>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const showToast = (e) => {
    if (e.target.id == 'Submitbtnid5') {
      formik.validateForm().then((errors) => {
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

  let step5HFFollowupAdd = () => {
    return (
      <div>
        {hideHFFollowupList && (
          <div>
            <FormikProvider value={formik}>
              <form
                onClick={showToast}
                onSubmit={formik.handleSubmit}
                onChange={formik.handleChange}
              >
                <fieldset
                  disabled={
                    location.state && location.state.view ? true : false
                  }
                >
                  <div className='card'>
                    <div
                      className='formtitlenew font-chng'
                      style={{ marginLeft: '33px' }}
                    >
                      {' '}
                      Details of Service Provider
                    </div>
                    <div className='card-body'>
                      <Row className='mb-3 cardpadding'>
                        <div className='col-xl-3 col-md-6 col-12'>
                          {' '}
                          <div className='form-grp'>
                            <label
                              htmlFor='serviceProviderName'
                              className='form-label font-chng'
                            >
                              Name*
                            </label>
                            <input
                              type='text'
                              name='serviceProviderName'
                              className={
                                formik.errors.serviceProviderName &&
                                formik.touched.serviceProviderName
                                  ? 'form-control is-invalid'
                                  : 'form-control'
                              }
                              onChange={formik.handleChange}
                              onInput={(event) =>
                                commonFunction.onlyAlphabets(event)
                              }
                              onKeyPress={(e) => commonFunction.keyPress(e)}
                              value={formik.values.serviceProviderName}
                            />
                            <div className={'invalid-feedback'}>
                              {formik.errors.serviceProviderName
                                ? formik.errors.serviceProviderName
                                : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          {' '}
                          <div className='form-grp'>
                            <label
                              htmlFor='serviceProviderDesignation'
                              className='form-label font-chng'
                            >
                              Designation*
                            </label>
                            <input
                              type='text'
                              className={
                                formik.errors.serviceProviderDesignation &&
                                formik.touched.serviceProviderDesignation
                                  ? 'form-control is-invalid'
                                  : 'form-control'
                              }
                              name='serviceProviderDesignation'
                              value={formik.values.serviceProviderDesignation}
                              onInput={(event) =>
                                commonFunction.onlyAlphabets(event)
                              }
                              onKeyPress={(e) => commonFunction.keyPress(e)}
                              onChange={formik.handleChange}
                            />
                            <div className={'invalid-feedback'}>
                              {formik.errors.serviceProviderDesignation
                                ? formik.errors.serviceProviderDesignation
                                : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          {' '}
                          <div className='form-grp'>
                            <label
                              htmlFor='serviceProviderPlace'
                              className='form-label font-chng'
                            >
                              Place of Service Given
                            </label>
                            <input
                              type='text'
                              className={
                                formik.errors.serviceProviderPlace &&
                                formik.touched.serviceProviderPlace
                                  ? 'form-control is-invalid'
                                  : 'form-control'
                              }
                              name='serviceProviderPlace'
                              value={formik.values.serviceProviderPlace}
                              onInput={(event) =>
                                commonFunction.onlyAlphabets(event)
                              }
                              onKeyPress={(e) => commonFunction.keyPress(e)}
                              onChange={formik.handleChange}
                            />
                            <div className={'invalid-feedback'}>
                              {formik.errors.serviceProviderPlace
                                ? formik.errors.serviceProviderPlace
                                : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          {' '}
                          <div className='form-grp'>
                            <label
                              htmlFor='serviceProviderPhone'
                              className='form-label font-chng'
                            >
                              Phone Number
                            </label>
                            <NumberFormat
                              className={
                                formik.errors.serviceProviderPhone &&
                                formik.touched.serviceProviderPhone
                                  ? 'form-control is-invalid'
                                  : 'form-control'
                              }
                              name='serviceProviderPhone'
                              value={formik.values.serviceProviderPhone}
                              onChange={formik.handleChange}
                              format='#### #### ##'
                              mask=''
                              placeholder='Phone Number Here'
                            />
                            <div className={'invalid-feedback'}>
                              {formik.errors
                                ? formik.errors.serviceProviderPhone
                                : ''}
                            </div>
                          </div>
                        </div>
                      </Row>
                    </div>
                  </div>
                  <div className='card' style={{ marginTop: '10px' }}>
                    <div
                      className='formtitlenew font-chng'
                      style={{ marginLeft: '33px' }}
                    >
                      {' '}
                      Co-Morbidity{' '}
                    </div>
                    <div className='card-body'>
                      <Row className='mb-3 cardpadding'>
                        <div className='col-xl-3 col-md-6 col-12'>
                          {' '}
                          <div className='form-grp'>
                            <label
                              htmlFor='isAnyComorbidity'
                              className='form-label font-chng'
                            >
                              Any co-morbidity like DM/HT/Asthma?
                            </label>
                            <div
                              role='group'
                              aria-labelledby='my-radio-group'
                              className='form-radio'
                            >
                              <label className='form-label font-chng'>
                                <input
                                  type='radio'
                                  value='true'
                                  name='isAnyComorbidity'
                                  onChange={(e) => {
                                    selectCoMorbidity('true');
                                  }}
                                  checked={check1}
                                />
                                Yes
                              </label>
                              <label className='form-label font-chng'>
                                <input
                                  type='radio'
                                  value='false'
                                  name='isAnyComorbidity'
                                  onChange={(e) => {
                                    selectCoMorbidity('false');
                                  }}
                                  checked={!check1}
                                />
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        {showOthersCoMorbity && (
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='comorbidityType'
                                className='form-label font-chng'
                              >
                                Co-morbidity Type
                              </label>
                              <MultiSelect
                                options={CoMorbidityTypeOptions}
                                value={coMorbidityTypselectedOption}
                                onChange={changeCoMorbidity}
                                labelledBy='Select'
                              />
                            </div>
                          </div>
                        )}
                        {othersCoMorbity && showOthersCoMorbity && (
                          <div className='col-xl-3 col-md-6 col-12'>
                            <div className='form-grp'>
                              <label
                                htmlFor='otherComorbidity'
                                className='form-label font-chng'
                              >
                                Other Co-morbidity
                              </label>
                              <input
                                type='text'
                                onInput={(event) =>
                                  commonFunction.onlyAlphabets(event)
                                }
                                className='form-control'
                                name='otherComorbidity'
                                value={formik.values.otherComorbidity}
                                onChange={formik.handleChange}
                              />
                            </div>
                          </div>
                        )}
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='remarks'
                              className='form-label font-chng'
                            >
                              Remarks
                            </label>
                            <textarea
                              className='form-control'
                              name='remarks'
                              value={formik.values.remarks}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </div>
                      </Row>
                    </div>
                  </div>
                  <div className='card' style={{ marginTop: '10px' }}>
                    <div
                      className='formtitlenew font-chng'
                      style={{ marginLeft: '33px' }}
                    >
                      {' '}
                      Surgery Details{' '}
                    </div>{' '}
                    <div className='card-body'>
                      <Row className='mb-3 cardpadding'>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='isSurgeryDone'
                              className='form-label font-chng'
                            >
                              Is Surgery Done?
                            </label>
                            <div
                              role='group'
                              aria-labelledby='my-radio-group'
                              className='form-radio'
                            >
                              <label
                                className='form-label font-chng'
                                htmlFor='isSurgeryDone'
                              >
                                <input
                                  type='radio'
                                  value='true'
                                  name='isSurgeryDone'
                                  onChange={(e) => {
                                    isSurgeryDoneCheck('true');
                                  }}
                                  defaultChecked={check2 === true}
                                />
                                Yes
                              </label>
                              <label
                                className='form-label font-chng'
                                htmlFor='isSurgeryDone'
                              >
                                <input
                                  type='radio'
                                  value='false'
                                  name='isSurgeryDone'
                                  onChange={(e) => {
                                    isSurgeryDoneCheck('false');
                                  }}
                                  defaultChecked={check2 === false}
                                />
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        {showSurgeryDoneInfo && (
                          <div className='row'>
                            <div className='col-xl-3 col-md-6 col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='dateOfSurgery'
                                  className='form-label font-chng'
                                >
                                  Date of Surgery
                                </label>
                                <input
                                  type='Date'
                                  max={isValidDate}
                                  className='form-control'
                                  name='dateOfSurgery'
                                  onChange={formik.handleChange}
                                  value={formik.values.dateOfSurgery}
                                />
                              </div>
                            </div>
                            <div className='col-xl-3 col-md-6 col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='nameOfHospitalSurgeryDoneId'
                                  className='form-label font-chng'
                                >
                                  Name Of Hospital Where Surgery Done
                                </label>
                                <Select
                                  isDisabled={
                                    location.state && location.state.view
                                      ? true
                                      : false
                                  }
                                  className='custom-select'
                                  styles={commonFunction.customStyles}
                                  name='nameOfHospitalSurgeryDoneId'
                                  isClearable='true'
                                  value={
                                    facilityIdList
                                      ? facilityIdList.find(
                                          (option: any) =>
                                            option &&
                                            option.value ==
                                              formik.values
                                                .nameOfHospitalSurgeryDoneId
                                        )
                                      : ''
                                  }
                                  options={facilityIdList}
                                  onChange={(option: Option) => {
                                    console.log(
                                      'nameOfHospitalSurgeryDoneId',
                                      option
                                    );
                                    if (option) {
                                      formik.setFieldValue(
                                        'nameOfHospitalSurgeryDoneId',
                                        option.value
                                      );
                                      option?.value == '0'
                                        ? setnameOfHospitalSurgeryDonename(
                                            'Other'
                                          )
                                        : setnameOfHospitalSurgeryDonename(
                                            option.label
                                          );
                                    }
                                  }}
                                ></Select>
                              </div>
                            </div>
                            {(nameOfHospitalSurgeryDonename == 'Other' ||
                              formik.values.nameOfHospitalSurgeryDoneId ==
                                0) && (
                              <div className='col-xl-3 col-md-6 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='otherHospitalSurgeryDone'
                                    className='form-label font-chng'
                                  >
                                    Other Hospital
                                  </label>
                                  <input
                                    name='otherHospitalSurgeryDone'
                                    className='form-control font-chng'
                                    onChange={formik.handleChange}
                                    value={
                                      formik.values.otherHospitalSurgeryDone
                                        ? formik.values.otherHospitalSurgeryDone
                                        : ''
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            <div className={'invalid-feedback'}>
                              {formik.errors
                                ? formik.errors.otherHospitalSurgeryDone
                                : ''}
                            </div>

                            <div className='col-xl-3 col-md-6 col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='stageOfHydrocele'
                                  className='form-label font-chng'
                                >
                                  Stage of Hydrocele
                                </label>
                                <Select
                                  isDisabled={
                                    location.state && location.state.view
                                      ? true
                                      : false
                                  }
                                  styles={commonFunction.customStyles}
                                  className='custom-select'
                                  name='stageOfHydrocele'
                                  isClearable='true'
                                  value={
                                    StageHydrogele
                                      ? StageHydrogele.find(
                                          (option: any) =>
                                            option &&
                                            option.value ===
                                              formik.values.stageOfHydrocele
                                        )
                                      : ''
                                  }
                                  options={StageHydrogele}
                                  onChange={(option: Option) => {
                                    formik.setFieldValue(
                                      'stageOfHydrocele',
                                      option && option.value
                                    );
                                  }}
                                ></Select>
                              </div>
                            </div>
                          </div>
                        )}
                        {showSurgeryNotPossibleInfo && (
                          <>
                            <div className='col-xl-3 col-md-6 col-12'>
                              <div className='form-grp'>
                                <label
                                  htmlFor='surgeryNotPossibleReasonsId'
                                  className='form-label font-chng'
                                >
                                  Surgery Not Possible Reasons
                                </label>
                                <Select
                                  isDisabled={
                                    location.state && location.state.view
                                      ? true
                                      : false
                                  }
                                  className='custom-select'
                                  name='surgeryNotPossibleReasonsId'
                                  isClearable='true'
                                  value={
                                    surgeryNotPossibleReasonsList
                                      ? surgeryNotPossibleReasonsList.find(
                                          (option: any) =>
                                            option &&
                                            option.value ===
                                              formik.values
                                                .surgeryNotPossibleReasonsId
                                        )
                                      : ''
                                  }
                                  options={surgeryNotPossibleReasonsList}
                                  onChange={(option: Option) => {
                                    formik.setFieldValue(
                                      'surgeryNotPossibleReasonsId',
                                      option && option.value
                                    );
                                    handleOptions(option);
                                  }}
                                ></Select>
                              </div>
                            </div>
                            {showReasonOthers && (
                              <div className='col-xl-3 col-md-6 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='reasonOthers'
                                    className='form-label font-chng'
                                  >
                                    Reason Others
                                  </label>
                                  <input
                                    type='text'
                                    onInput={(event) =>
                                      commonFunction.onlyAlphabets(event)
                                    }
                                    className='form-control'
                                    name='reasonOthers'
                                    value={formik.values.reasonOthers}
                                  />
                                </div>
                              </div>
                            )}
                            {showDeathOfDate === true && (
                              <div className='col-xl-3 col-md-6 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='dateOfDeathSurgeryNotPossible'
                                    className='form-label font-chng'
                                  >
                                    Date of Death Surgery Not Possible
                                  </label>
                                  <input
                                    type='Date'
                                    max={isValidDate}
                                    className='form-control'
                                    name='dateOfDeathSurgeryNotPossible'
                                    onChange={formik.handleChange}
                                    value={
                                      formik.values
                                        .dateOfDeathSurgeryNotPossible
                                    }
                                  />
                                </div>
                              </div>
                            )}
                            {showPlaceOfMigration === true && (
                              <div className='col-xl-3 col-md-6 col-12'>
                                <div className='form-grp'>
                                  <label
                                    htmlFor='placeOfMigrationSurgeryNoPossible'
                                    className='form-label font-chng'
                                  >
                                    Place of Migration Surgery Not Possible
                                  </label>
                                  <input
                                    type='text'
                                    name='placeOfMigrationSurgeryNoPossible'
                                    className='form-control'
                                    onChange={formik.handleChange}
                                    onKeyPress={(e) =>
                                      commonFunction.keyPress(e)
                                    }
                                    onInput={(event) =>
                                      commonFunction.onlyAlphabets(event)
                                    }
                                    value={
                                      formik.values
                                        .placeOfMigrationSurgeryNoPossible
                                    }
                                  />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </Row>
                    </div>
                  </div>
                  <div className='card' style={{ marginTop: '10px' }}>
                    <div
                      className='formtitlenew font-chng'
                      style={{ marginLeft: '33px' }}
                    >
                      Surgeon Details
                    </div>
                    <div className='card-body'>
                      <Row className='mb-3 cardpadding'>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='nameOfSurgeon'
                              className='form-label font-chng'
                            >
                              Name of Surgeon
                            </label>
                            <div className='input-group'>
                              <div className='input-group-prepend'>
                                <img src={DoctorImg} />
                              </div>
                              <input
                                type='text'
                                className='form-control'
                                name='nameOfSurgeon'
                                value={formik.values.nameOfSurgeon}
                                onKeyPress={(e) => commonFunction.keyPress(e)}
                                onInput={(event) =>
                                  commonFunction.onlyAlphabets(event)
                                }
                                onChange={formik.handleChange}
                              />
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='surgeonPhone'
                              className='form-label font-chng'
                            >
                              Surgeon's Mobile Number
                            </label>
                            <NumberFormat
                              className={
                                formik.errors.surgeonPhone &&
                                formik.touched.surgeonPhone
                                  ? 'form-control is-invalid'
                                  : 'form-control'
                              }
                              name='surgeonPhone'
                              value={formik.values.surgeonPhone}
                              onChange={formik.handleChange}
                              format='#### #### ##'
                              mask=''
                              placeholder='Phone Number Here'
                            />
                            <div className={'invalid-feedback'}>
                              {formik.errors ? formik.errors.surgeonPhone : ''}
                            </div>
                          </div>
                        </div>
                      </Row>
                    </div>
                  </div>
                </fieldset>
                <div className='card' style={{ marginTop: '10px' }}>
                  <div
                    className='formtitlenew font-chng'
                    style={{ marginLeft: '33px' }}
                  >
                    Follow Ups
                  </div>
                  <div className='card-body'>
                    <fieldset
                      disabled={
                        location.state && location.state.view ? true : false
                      }
                    >
                      <Row className='mb-3 cardpadding'>
                        <div className='col-xl-3 col-md-6 col-12'>
                          {' '}
                          <div className='form-grp'>
                            <label
                              htmlFor='dateOfFollowUpAfterSurgery'
                              className='form-label font-chng'
                            >
                              Date of Follow up after surgery
                            </label>
                            <input
                              type='Date'
                              max={isValidDate}
                              className='form-control'
                              name='dateOfFollowUpAfterSurgery'
                              value={formik.values.dateOfFollowUpAfterSurgery}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          {' '}
                          <div className='form-grp'>
                            <label
                              htmlFor='findingsDuringSurgeryFollowUp'
                              className='form-label font-chng'
                            >
                              Findings During Follow up
                            </label>
                            <textarea
                              className='form-control'
                              name='findingsDuringSurgeryFollowUp'
                              value={
                                formik.values.findingsDuringSurgeryFollowUp
                              }
                              onInput={(event) =>
                                commonFunction.onlyAlphabets(event)
                              }
                              onChange={formik.handleChange}
                            />
                          </div>
                        </div>
                      </Row>
                    </fieldset>
                  </div>
                </div>
                <div className='buttongrouprightend'>
                  {props.activeStep !== 0 && (
                    <ReactButton
                      className=' btn-cancel'
                      style={{
                        marginRight: '10px',
                        backgroundColor: '#34c38f',
                        border: '0px',
                        color: ' #ffffff',
                      }}
                      onClick={showHFFollowupList}
                    >
                      <i className='fas fa-arrow-left'></i>&nbsp;Back
                    </ReactButton>
                  )}
                  {!(location && location.state && location.state.view) && (
                    <ReactButton
                      className=' btn-cancel'
                      type='submit'
                      style={{
                        marginRight: '10px',
                        backgroundColor: '#34c38f',
                        border: '0px',
                        color: ' #ffffff',
                      }}
                    >
                      Submit
                    </ReactButton>
                  )}
                </div>
              </form>
            </FormikProvider>{' '}
          </div>
        )}
      </div>
    );
  };
  return <div>{hydroceleFollowUps()}</div>;
};

export default Step5;
