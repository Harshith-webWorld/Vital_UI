import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { Button as ReactButton } from '@material-ui/core';
import { Field, FieldArray, FormikProvider, useFormik } from 'formik';
import { useLocation } from 'react-router-dom';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import { LFFollowUps, str2boolean } from './Form1-stepper-config';
import React, { useEffect, useState } from 'react';
import { LymphedemaLineListFollowUpsLF } from '../../../interfaces/FormLymphedema';
import DropdownService from '../../../services/DropdownService';
import LymphedemaPatientInfoService from '../../../services/FormLymphedemaService';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import NumberFormat from 'react-number-format';
import * as Yup from 'yup';
import Select, { Option } from 'react-select';
import moment from 'moment';
import commonFunction from '../../../../helpers/common/common';
import { toast } from 'react-toastify';
import AccordionLymphedamaLineListFollowupsLF from './AccordionLymphedamaLineListFollowupsLF';
import lymphedemaLineListDraftServices from '../../../draftServices/FormLymphdemaHydroceleDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';

const Step4 = (props: any) => {
  let isOnline = window.navigator.onLine;
  const ExpandedComponent = (row) => {
    return <AccordionLymphedamaLineListFollowupsLF rowValues={row} />;
  };
  const lfFollowupcolumns = [
    {
      name: 'Service Provider',
      selector: 'serviceProviderName',
    },
    {
      name: 'Service Provider Place',
      selector: 'serviceProviderPlace',
    },

    {
      name: 'MMDP Training Given',
      selector: (row: any) => {
        if (location && location.state && location.state.id) {
          return row.isServiceMMDPTrainingGiven ? 'Yes' : 'No';
        } else {
          return row.isServiceMMDPTrainingGiven === true ||
            row.isServiceMMDPTrainingGiven === 'true'
            ? 'Yes'
            : 'No';
        }
      },
    },
    {
      name: 'MM Following',
      selector: (row: any) => {
        if (location && location.state && location.state.id) {
          return row.isServicePatientFollowingMM ? 'Yes' : 'No';
        } else {
          return row.isServicePatientFollowingMM === true ||
            row.isServicePatientFollowingMM === 'true'
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
      cell: (row, index) => (
        <div data-tag='allowRowEvents'>
          {location && location.state && location.state.view && (
            <button
              className='btn tooltip-wrap'
              onClick={() => viewLLSurvey(row)}
            >
              <img src={viewIcon} />
              <div className='tooltip'>
                <div className='tooltip-inner font-chng'>View</div>
              </div>
            </button>
          )}
          {location && location.state && location.state.view ? (
            ''
          ) : (
            <>
              <button
                className='btn tooltip-wrap'
                onClick={() => updateLLSurvey(row)}
              >
                <img src={editIcon} />
                <div className='tooltip'>
                  <div className='tooltip-inner font-chng'>Edit</div>
                </div>
              </button>
              <button
                className='btn tooltip-wrap'
                onClick={() => deleteLFSurvey(row)}
              >
                <img src={deleteIcon} />
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
  let isValidDate = moment().format('YYYY-MM-DD');
  const location: any = useLocation();
  const [hideLFFollowupList, setHideLFFollowupList] = useState(false);
  let [optionTableValues, setOptionTableValues] = useState([]);
  const [showDeathOfDate, setShowDeathOfDate] = useState(false);
  const [showPlaceOfMigration, setShowPlaceOfMigration] = useState(false);
  const [
    hideServiceMMDPTrainingGivenDate,
    setHideServiceMMDPTrainingGivenDate,
  ] = useState(true);
  const [
    hideChangeServicePatientFollowingDate,
    setHideChangeServicePatientFollowingDate,
  ] = useState(true);
  const [hideServiceMMDPKitGivenDate, setHideServiceMMDPKitGivenDate] =
    useState(true);
  const [hideServiceMedicineGivenDate, setHideServiceMedicineGivenDate] =
    useState(true);
  const [check1, setCheck1] = useState(false);
  const [check2, setCheck2] = useState(false);
  const [check3, setCheck3] = useState(false);
  const [check4, setCheck4] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [showReasonOthers, setShowReasonOthers] = useState(false);

  let [lFFollowUpList, setLFFollowUpList] = useState([]);
  const [formdata, setFormData] =
    useState<LymphedemaLineListFollowUpsLF>(LFFollowUps);
  const [lfData, setLFdata] =
    useState<LymphedemaLineListFollowUpsLF>(LFFollowUps);
  function viewLLSurvey(row) {
    row.isServiceMMDPKitGiven =
      typeof row.isServiceMMDPKitGiven === 'string'
        ? str2boolean(row.isServiceMMDPKitGiven)
        : row.isServiceMMDPKitGiven;
    row.isServiceMMDPTrainingGiven =
      typeof row.isServiceMMDPTrainingGiven === 'string'
        ? str2boolean(row.isServiceMMDPTrainingGiven)
        : row.isServiceMMDPTrainingGiven;
    row.isServiceMedicineGiven =
      typeof row.isServiceMedicineGiven === 'string'
        ? str2boolean(row.isServiceMedicineGiven)
        : row.isServiceMedicineGiven;
    row.isServicePatientFollowingMM =
      typeof row.isServicePatientFollowingMM === 'string'
        ? str2boolean(row.isServicePatientFollowingMM)
        : row.isServicePatientFollowingMM;
    hideLFFollowupLists();
    setFormData({ formdata, ...row });
    applyConditions(row);
  }
  function updateLLSurvey(row) {
    row.isServiceMMDPKitGiven =
      typeof row.isServiceMMDPKitGiven === 'string'
        ? str2boolean(row.isServiceMMDPKitGiven)
        : row.isServiceMMDPKitGiven;
    row.isServiceMMDPTrainingGiven =
      typeof row.isServiceMMDPTrainingGiven === 'string'
        ? str2boolean(row.isServiceMMDPTrainingGiven)
        : row.isServiceMMDPTrainingGiven;
    row.isServiceMedicineGiven =
      typeof row.isServiceMedicineGiven === 'string'
        ? str2boolean(row.isServiceMedicineGiven)
        : row.isServiceMedicineGiven;
    row.isServicePatientFollowingMM =
      typeof row.isServicePatientFollowingMM === 'string'
        ? str2boolean(row.isServicePatientFollowingMM)
        : row.isServicePatientFollowingMM;
    hideLFFollowupLists();
    setFormData({ formdata, ...row });
    applyConditions(row);
  }
  function applyConditions(row) {
    optionTableValues &&
      optionTableValues.map((item: any, i: any) => {
        if (item && item.categoryCode === 1005) {
          if (
            item.categoryOptionName === 'Migration' &&
            item.id === row.followUpLostReasonsId
          ) {
            setShowPlaceOfMigration(true);
            setShowDeathOfDate(false);
            setShowReasonOthers(false);
          } else if (
            item.categoryOptionName === 'Death' &&
            item.id === row.followUpLostReasonsId
          ) {
            setShowDeathOfDate(true);
            setShowPlaceOfMigration(false);
            setShowReasonOthers(false);
          } else if (
            item.categoryOptionName === 'Recovered' &&
            item.id === row.followUpLostReasonsId
          ) {
            setShowDeathOfDate(false);
            setShowPlaceOfMigration(false);
            setShowReasonOthers(false);
          }
        }
      });
    if (row.isServiceMMDPTrainingGiven) {
      setCheck1(true);
      setHideServiceMMDPTrainingGivenDate(false);
    } else {
      setCheck1(false);
      setHideServiceMMDPTrainingGivenDate(true);
    }
    if (row.isServicePatientFollowingMM) {
      setCheck2(true);
      setHideChangeServicePatientFollowingDate(false);
    } else {
      setCheck2(false);
      setHideChangeServicePatientFollowingDate(true);
    }
    if (row.isServiceMMDPKitGiven) {
      setCheck3(true);
      setHideServiceMMDPKitGivenDate(false);
    } else {
      setCheck3(false);
      setHideServiceMMDPKitGivenDate(true);
    }
    if (row.isServiceMedicineGiven) {
      setCheck4(true);
      setHideServiceMedicineGivenDate(false);
    } else {
      setCheck4(false);
      setHideServiceMedicineGivenDate(true);
    }
  }
  async function deleteLFSurvey(row) {
    if (location && location.state && location.state.id) {
      const deleteResult: any =
        await LymphedemaPatientInfoService.deleteLFFollowups(row);
      if (deleteResult.status === 200) {
        console.log('delete LF info:: ', deleteResult);
        getLFFollowups();
      }
    } else {
      console.log('delete uuid', row.lymphedemaLineListFollowUpsLFUUID);
      if (row && row.lymphedemaLineListFollowUpsLFUUID) {
        let deleteResult: any =
          await lymphedemaLineListDraftServices.deleteListLymphedemaLineListFollowUpsLF(
            row.lymphedemaLineListFollowUpsLFUUID
          );
        if (deleteResult) {
          console.log('post HF info:: ', deleteResult);
          getLFFollowups();
        }
      }
    }
  }
  async function saveLFFollowups(postdata) {
    let id;
    if (location && location.state && location.state.id) {
      if (postdata && postdata.id) {
        postdata.lastModifiedBy = props && props.userSessionId;
      } else {
        postdata.createdBy = props && props.userSessionId;
        postdata.lastModifiedBy = 0;
      }
      const postResult: any =
        await LymphedemaPatientInfoService.postLFFollowups(postdata);
      if (postResult && postResult.data) {
        console.log('post/update LF followup info:: ', postResult.data);
        showLFFollowupList();
      }
    } else if (location && location.state && location.state.UUID) {
      if (postdata && postdata.lymphedemaLineListFollowUpsLFUUID) {
        id = postdata.lymphedemaLineListFollowUpsLFUUID;
        postdata.lastModifiedBy = props && props.userSessionId;
        let updateResponse =
          await lymphedemaLineListDraftServices.updateLymphedemaLineListFollowUpsLF(
            id,
            postdata
          );
        if (updateResponse) {
          showLFFollowupList();
        }
      } else {
        postdata.createdBy = props && props.userSessionId;
        postdata.lastModifiedBy = 0;
        let addResponse =
          await lymphedemaLineListDraftServices.addLymphedemaLineListFollowUpsLF(
            postdata
          );
        if (addResponse) {
          showLFFollowupList();
        }
      }
    } else {
      if (postdata && postdata.lymphedemaLineListFollowUpsLFUUID) {
        id = postdata.lymphedemaLineListFollowUpsLFUUID;
        postdata.lastModifiedBy = props && props.userSessionId;
        let updateResponse =
          await lymphedemaLineListDraftServices.updateLymphedemaLineListFollowUpsLF(
            id,
            postdata
          );
        if (updateResponse) {
          showLFFollowupList();
        }
      } else {
        postdata.createdBy = props && props.userSessionId;
        postdata.lastModifiedBy = 0;
        let addResponse =
          await lymphedemaLineListDraftServices.addLymphedemaLineListFollowUpsLF(
            postdata
          );
        if (addResponse) {
          showLFFollowupList();
        }
      }
    }
  }

  const onSubmit = (values, actions) => {
    console.log('after values:: ', values);
    if (location && location.state && location.state.view) {
      console.log('api is not hitting');
      props.handleNext(values);
    } else {
      values.isServiceMMDPTrainingGiven = values.isServiceMMDPTrainingGiven
        ? values.isServiceMMDPTrainingGiven.toString()
        : 'false';
      values.isServicePatientFollowingMM = values.isServicePatientFollowingMM
        ? values.isServicePatientFollowingMM.toString()
        : 'false';
      values.isServiceMMDPKitGiven = values.isServiceMMDPKitGiven
        ? values.isServiceMMDPKitGiven.toString()
        : 'false';
      values.isServiceMedicineGiven = values.isServiceMedicineGiven
        ? values.isServiceMedicineGiven.toString()
        : 'false';

      let LymphedemaLineListId: any;
      setIsDisabled(true);
      if (location && location.state && location.state.id) {
        LymphedemaLineListId = location.state.id;
      } else if (location && location.state && location.state.UUID) {
        LymphedemaLineListId = location.state.UUID;
      } else {
        LymphedemaLineListId = props.lymphedemaLineListUUID;
      }
      values.lymphedemaLineListId = LymphedemaLineListId;
      saveLFFollowups(values);
      setIsDisabled(false);
    }
  };
  async function getLFFollowups() {
    let LymphedemaLineListId: any;
    let lFDetails: any;
    if (location && location.state && location.state.id) {
      LymphedemaLineListId = location.state.id;
      if (LymphedemaLineListId) {
        lFDetails = await LymphedemaPatientInfoService.getLFFollowups(
          LymphedemaLineListId
        );
      }
      if ((lFDetails && lFDetails.data) || (lFDetails && lFDetails.message)) {
        console.log('get LF Followups info:: ', lFDetails.data);
        setLFFollowUpList(lFDetails.data);
      }
    } else if (location && location.state && location.state.UUID) {
      LymphedemaLineListId = location.state.UUID;
      if (LymphedemaLineListId) {
        lFDetails =
          await lymphedemaLineListDraftServices.getListLymphedemaLineListFollowUpsLF(
            LymphedemaLineListId
          );
        if (lFDetails) {
          setLFFollowUpList(lFDetails);
        }
      }
    } else {
      LymphedemaLineListId = props.lymphedemaLineListUUID;
      if (LymphedemaLineListId) {
        lFDetails =
          await lymphedemaLineListDraftServices.getListLymphedemaLineListFollowUpsLF(
            LymphedemaLineListId
          );
        if (lFDetails) {
          setLFFollowUpList(lFDetails);
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
  });
  const formik = useFormik({
    initialValues: formdata,
    enableReinitialize: true,
    validationSchema: validSchema,
    //validationSchema:validationSchema ,
    onSubmit: onSubmit,
  });
  useEffect(() => {
    getpostcontent();
    getLFFollowups();
  }, []);
  async function getpostcontent() {
    if (isOnline) {
      const genderdata: any = await DropdownService.getUnitAction();
      if (genderdata && genderdata.data) {
        setOptionTableValues(genderdata.data);
      }
    } else {
      const genderDataOffline: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (genderDataOffline) {
        setOptionTableValues(genderDataOffline);
      }
    }
  }
  function showLFFollowupList() {
    setHideLFFollowupList(false);
    getLFFollowups();
  }
  function hideLFFollowupLists() {
    setHideLFFollowupList(true);
    formik.resetForm({ values: lfData });
  }
  function addNew() {
    setCheck1(false);
    setCheck2(false);
    setCheck3(false);
    setCheck4(false);
    setHideServiceMMDPTrainingGivenDate(true);
    setHideChangeServicePatientFollowingDate(true);
    setHideServiceMMDPKitGivenDate(true);
    setHideServiceMedicineGivenDate(true);
    setHideLFFollowupList(true);
    formik.resetForm({ values: lfData });
  }

  const lastFollowUpReasonIdList: any = [];
  optionTableValues &&
    optionTableValues.map((item: any, i: any, row: any) => {
      if (item && item.categoryCode === 1005) {
        lastFollowUpReasonIdList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
      // if (i + 1 === row.length) {
      //   lastFollowUpReasonIdList.push({ label: "Others", value: item.id++})
      // }
    });
  let fillarisFollowUps = () => {
    return (
      <div>
        {step4LFFollowupList()}

        {step4LFFollowupAdd()}
      </div>
    );
  };
  let handleOptions = (data, e) => {
    if (e && e.label === 'Death') {
      formik.setFieldValue(
        'followUpLostDateOfDeath',
        formik.values.followUpLostDateOfDeath
      );
      formik.setFieldValue('followUpLostPlaceOfMigration', '');
      formik.setFieldValue('reasonOthers', formik.values.reasonOthers);
      setShowDeathOfDate(true);
      setShowPlaceOfMigration(false);
      setShowReasonOthers(false);
    } else if (e && e.label === 'Migration') {
      formik.setFieldValue(
        'followUpLostDateOfDeath',
        formik.values.followUpLostDateOfDeath
      );
      formik.setFieldValue('followUpLostPlaceOfMigration', '');
      formik.setFieldValue('reasonOthers', '');
      setShowPlaceOfMigration(true);
      setShowDeathOfDate(false);
      setShowReasonOthers(false);
    } else if (e && e.label === 'Recovered') {
      setShowPlaceOfMigration(false);
      setShowDeathOfDate(false);
      setShowReasonOthers(false);
    } else if (e && e.label === 'Others') {
      formik.setFieldValue(
        'followUpLostDateOfDeath',
        formik.values.followUpLostDateOfDeath
      );
      formik.setFieldValue('followUpLostPlaceOfMigration', '');
      formik.setFieldValue('reasonOthers', '');
      setShowReasonOthers(true);
      setShowDeathOfDate(false);
      setShowPlaceOfMigration(false);
    }
  };
  let changeServiceMMDPTrainingGiven = (e) => {
    if (e.target.value == 'true') {
      setHideServiceMMDPTrainingGivenDate(false);
    } else if (e.target.value == 'false') {
      setHideServiceMMDPTrainingGivenDate(true);
      formik.setFieldValue(
        'serviceMMDPTrainingDate',
        formik.values.serviceMMDPTrainingDate
      );
    }
  };
  let changeServicePatientFollowing = (e) => {
    if (e.target.value == 'true') {
      setHideChangeServicePatientFollowingDate(false);
    } else if (e.target.value == 'false') {
      setHideChangeServicePatientFollowingDate(true);
      formik.setFieldValue(
        'servicePatientFollowingDate',
        formik.values.servicePatientFollowingDate
      );
    }
  };
  let changeServiceMMDPKitGiven = (e) => {
    if (e.target.value == 'true') {
      setHideServiceMMDPKitGivenDate(false);
    } else if (e.target.value == 'false') {
      setHideServiceMMDPKitGivenDate(true);
      formik.setFieldValue(
        'serviceMMDPKitGivenDate',
        formik.values.serviceMMDPKitGivenDate
      );
    }
  };
  let changeServiceMedicineGiven = (e) => {
    if (e.target.value == 'true') {
      setHideServiceMedicineGivenDate(false);
    } else if (e.target.value == 'false') {
      setHideServiceMedicineGivenDate(true);
      formik.setFieldValue(
        'serviceMedicineGivenDate',
        formik.values.serviceMedicineGivenDate
      );
    }
  };

  let step4LFFollowupList = () => {
    return (
      <div className='in-left'>
        {!hideLFFollowupList && (
          <div>
            <div className='card'>
              <div className='row'>
                <div className='col-md-10 col-12'>
                  <div
                    className='formtitlenew font-chng'
                    style={{ marginLeft: '33px' }}
                  >
                    Fillaris Follow-up List
                  </div>
                </div>
                {location && location.state && location.state.view ? (
                  ''
                ) : (
                  <div className='col-md-2 col-12 text-right'>
                    <Button
                      variant='secondary'
                      className='mt-m font-chng mr10'
                      style={{ backgroundColor: '#19D895', border: 'none' }}
                      onClick={addNew}
                    >
                      <img alt='' src={plusImg} className='pe-2' />
                      Add New
                    </Button>
                  </div>
                )}
              </div>
              <div className='post-tablenew font-chng cus-table'>
                <DataTable
                  columns={lfFollowupcolumns}
                  data={lFFollowUpList}
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
            </div>{' '}
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
              {props.activeStep !== props.steps.length - 1 &&
              props.activestep !== 0 ? (
                <ReactButton
                  onClick={props.handleNext}
                  className=' btn-cancel'
                  style={{
                    marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                    textTransform: 'none',
                  }}
                >
                  Next
                </ReactButton>
              ) : (
                <ReactButton type='submit' className=' btn-cancel'>
                  Finish
                </ReactButton>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const showToast = (e) => {
    if (e.target.id == 'Submitbtnid4') {
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

  let step4LFFollowupAdd = () => {
    return (
      <div>
        {hideLFFollowupList && (
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
                          <div className='form-grp'>
                            <label
                              htmlFor='serviceProviderName'
                              className='form-label font-chng'
                            >
                              Name*
                            </label>
                            <input
                              type='text'
                              onInput={(event) =>
                                commonFunction.onlyAlphabets(event)
                              }
                              className={
                                formik.errors.serviceProviderName &&
                                formik.touched.serviceProviderName
                                  ? 'form-control is-invalid'
                                  : 'form-control'
                              }
                              name='serviceProviderName'
                              value={formik.values.serviceProviderName}
                              onKeyPress={(e) => commonFunction.keyPress(e)}
                              onChange={formik.handleChange}
                            />
                            <div className={'invalid-feedback'}>
                              {formik.errors.serviceProviderName
                                ? formik.errors.serviceProviderName
                                : ''}
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='serviceProviderDesignation'
                              className='form-label font-chng'
                            >
                              Designation*
                            </label>
                            <input
                              type='text'
                              onInput={(event) =>
                                commonFunction.onlyAlphabets(event)
                              }
                              className={
                                formik.errors.serviceProviderDesignation &&
                                formik.touched.serviceProviderDesignation
                                  ? 'form-control is-invalid'
                                  : 'form-control'
                              }
                              name='serviceProviderDesignation'
                              value={formik.values.serviceProviderDesignation}
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
                              Place of service given
                            </label>
                            <input
                              type='text'
                              onInput={(event) =>
                                commonFunction.onlyAlphabets(event)
                              }
                              className={
                                formik.errors.serviceProviderPlace &&
                                formik.touched.serviceProviderPlace
                                  ? 'form-control is-invalid'
                                  : 'form-control'
                              }
                              name='serviceProviderPlace'
                              value={formik.values.serviceProviderPlace}
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
                              format='#### #### ##'
                              mask=''
                              placeholder='Phone Number Here'
                              name='serviceProviderPhone'
                              value={formik.values.serviceProviderPhone}
                              onChange={formik.handleChange}
                            />
                            <div className={'invalid-feedback'}>
                              {formik.errors.serviceProviderPhone
                                ? formik.errors.serviceProviderPhone
                                : ''}
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
                  <div className='card-body '>
                    <fieldset
                      className='cardpadding'
                      disabled={
                        location.state && location.state.view ? true : false
                      }
                    >
                      <Row>
                        <div className='col-xl-3 col-md-6 col-12'>
                          {' '}
                          <div className='form-grp'>
                            <label
                              htmlFor='serviceDateOfVisit'
                              className='form-label font-chng'
                            >
                              Date of Visit
                            </label>
                            <input
                              type='Date'
                              max={isValidDate}
                              className='form-control'
                              name='serviceDateOfVisit'
                              value={formik.values.serviceDateOfVisit}
                              onChange={formik.handleChange}
                            />
                          </div>
                        </div>
                      </Row>
                      <Row>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div>
                            <label
                              htmlFor='isServiceMMDPTrainingGiven'
                              className='form-label font-chng'
                            >
                              MMDP Training Given
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
                                  name='isServiceMMDPTrainingGiven'
                                  onChange={(e) => {
                                    changeServiceMMDPTrainingGiven(e);
                                  }}
                                  defaultChecked={check1 === true}
                                />
                                Yes
                              </label>
                              <label className='form-label font-chng'>
                                <input
                                  type='radio'
                                  value='false'
                                  name='isServiceMMDPTrainingGiven'
                                  onChange={(e) => {
                                    changeServiceMMDPTrainingGiven(e);
                                  }}
                                  defaultChecked={check1 === false}
                                />
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div>
                            <label
                              htmlFor='email'
                              className='form-label font-chng'
                            >
                              Patient following MM
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
                                  name='isServicePatientFollowingMM'
                                  onChange={(e) => {
                                    changeServicePatientFollowing(e);
                                  }}
                                  defaultChecked={check2 === true}
                                />
                                Yes
                              </label>
                              <label className='form-label font-chng'>
                                <input
                                  type='radio'
                                  value='false'
                                  name='isServicePatientFollowingMM'
                                  onChange={(e) => {
                                    changeServicePatientFollowing(e);
                                  }}
                                  defaultChecked={check2 === false}
                                />
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div>
                            <label
                              htmlFor='email'
                              className='form-label font-chng'
                            >
                              MMDP Kit Given
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
                                  name='isServiceMMDPKitGiven'
                                  onChange={(e) => {
                                    changeServiceMMDPKitGiven(e);
                                  }}
                                  defaultChecked={check3 === true}
                                />
                                Yes
                              </label>
                              <label className='form-label font-chng'>
                                <input
                                  type='radio'
                                  value='false'
                                  name='isServiceMMDPKitGiven'
                                  onChange={(e) => {
                                    changeServiceMMDPKitGiven(e);
                                  }}
                                  defaultChecked={check3 === false}
                                />
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div>
                            <label
                              htmlFor='email'
                              className='form-label font-chng'
                            >
                              Medicine Given
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
                                  name='isServiceMedicineGiven'
                                  onChange={(e) => {
                                    changeServiceMedicineGiven(e);
                                  }}
                                  defaultChecked={check4 === true}
                                />
                                Yes
                              </label>
                              <label className='form-label font-chng'>
                                <input
                                  type='radio'
                                  value='false'
                                  name='isServiceMedicineGiven'
                                  onChange={(e) => {
                                    changeServiceMedicineGiven(e);
                                  }}
                                  defaultChecked={check4 === false}
                                />
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                      </Row>
                      <Row>
                        {' '}
                        <div
                          className='col-xl-3  col-md-6 col-12'
                          style={{
                            visibility: hideServiceMMDPTrainingGivenDate
                              ? 'hidden'
                              : 'visible',
                          }}
                        >
                          <div className='form-grp'>
                            <label
                              htmlFor='serviceMMDPTrainingDate'
                              className='form-label font-chng'
                            >
                              MMDP Training Given On
                            </label>
                            <input
                              type='Date'
                              max={isValidDate}
                              className='form-control'
                              name='serviceMMDPTrainingDate'
                              value={formik.values.serviceMMDPTrainingDate}
                            />
                          </div>
                        </div>
                        <div
                          className='col-xl-3 col-md-6 col-12'
                          style={{
                            visibility: hideChangeServicePatientFollowingDate
                              ? 'hidden'
                              : 'visible',
                          }}
                        >
                          <div className='form-grp'>
                            <label
                              htmlFor='email'
                              className='form-label font-chng'
                            >
                              MM Followed On
                            </label>
                            <input
                              type='Date'
                              max={isValidDate}
                              className='form-control'
                              name='servicePatientFollowingDate'
                              value={formik.values.servicePatientFollowingDate}
                            />
                          </div>
                        </div>{' '}
                        <div
                          className='col-xl-3 col-md-6 col-12'
                          style={{
                            visibility: hideServiceMMDPKitGivenDate
                              ? 'hidden'
                              : 'visible',
                          }}
                        >
                          <div className='form-grp'>
                            <label
                              htmlFor='email'
                              className='form-label font-chng'
                            >
                              MMDP Kit Given On
                            </label>
                            <input
                              type='Date'
                              max={isValidDate}
                              onChange={formik.handleChange}
                              className='form-control'
                              name='serviceMMDPKitGivenDate'
                              value={formik.values.serviceMMDPKitGivenDate}
                            />
                          </div>
                        </div>{' '}
                        <div
                          className='col-xl-3 col-md-6 col-12'
                          style={{
                            visibility: hideServiceMedicineGivenDate
                              ? 'hidden'
                              : 'visible',
                          }}
                        >
                          <div className='form-grp'>
                            <label
                              htmlFor='email'
                              className='form-label font-chng'
                            >
                              Medicine Given On
                            </label>
                            <input
                              type='Date'
                              max={isValidDate}
                              onChange={formik.handleChange}
                              className='form-control'
                              name='serviceMedicineGivenDate'
                              value={formik.values.serviceMedicineGivenDate}
                            />
                          </div>
                        </div>
                      </Row>
                    </fieldset>
                  </div>
                </div>
                <div className='card' style={{ marginTop: '10px' }}>
                  <div
                    className='formtitlenew font-chng'
                    style={{ marginLeft: '33px' }}
                  >
                    Follow Up Reasons
                  </div>
                  <div className='card-body'>
                    <fieldset
                      disabled={
                        location.state && location.state.view ? true : false
                      }
                    >
                      <Row className='mb-3 cardpadding'>
                        <div className='col-xl-3 col-md-6 col-12'>
                          <div className='form-grp'>
                            <label
                              htmlFor='email'
                              className='form-label font-chng'
                            >
                              Lost Follow Up Reasons
                            </label>
                            <Select
                              isDisabled={
                                location.state && location.state.view
                                  ? true
                                  : false
                              }
                              styles={commonFunction.customStyles}
                              className='custom-select'
                              name='followUpLostReasonsId'
                              isClearable='true'
                              value={
                                lastFollowUpReasonIdList
                                  ? lastFollowUpReasonIdList.find(
                                      (option: any) =>
                                        option &&
                                        option.value ===
                                          formik.values.followUpLostReasonsId
                                    )
                                  : ''
                              }
                              options={lastFollowUpReasonIdList}
                              onChange={(option: Option) => {
                                formik.setFieldValue(
                                  'followUpLostReasonsId',
                                  option && option.value
                                );
                                handleOptions(
                                  formik.values.followUpLostReasonsId,
                                  option
                                );
                              }}
                            ></Select>
                          </div>
                        </div>
                        {showDeathOfDate === true && (
                          <div className='col-md-3'>
                            <div className='form-grp'>
                              <label
                                htmlFor='email'
                                className='form-label font-chng'
                              >
                                Date of Death
                              </label>
                              <input
                                type='Date'
                                max={isValidDate}
                                className='form-control'
                                name='followUpLostDateOfDeath'
                                value={formik.values.followUpLostDateOfDeath}
                                onChange={formik.handleChange}
                              />
                            </div>
                          </div>
                        )}
                        {showPlaceOfMigration === true && (
                          <div className='col-md-3'>
                            <div className='form-grp'>
                              <label
                                htmlFor='email'
                                className='form-label font-chng'
                              >
                                Place of Migration
                              </label>
                              <input
                                type='text'
                                onInput={(event) =>
                                  commonFunction.onlyAlphabets(event)
                                }
                                className='form-control'
                                name='followUpLostPlaceOfMigration'
                                value={
                                  formik.values.followUpLostPlaceOfMigration
                                }
                                onKeyPress={(e) => commonFunction.keyPress(e)}
                                onChange={formik.handleChange}
                              />
                            </div>
                          </div>
                        )}
                        {showReasonOthers && (
                          <div className='col-md-6'>
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
                      </Row>
                    </fieldset>
                  </div>{' '}
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
                      onClick={showLFFollowupList}
                    >
                      <i className='fas fa-arrow-left'></i> &nbsp;Back
                    </ReactButton>
                  )}
                  {!(location && location.state && location.state.view) && (
                    <ReactButton
                      // onClick={props.handleNext}
                      id='Submitbtnid'
                      disabled={isDisabled}
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
            </FormikProvider>
          </div>
        )}
      </div>
    );
  };

  return <div>{fillarisFollowUps()}</div>;
};

export default Step4;
