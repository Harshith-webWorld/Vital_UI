import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import history from '../../../../helpers/history';
import { useLocation } from 'react-router-dom';
import { FormikProvider, useFormik } from 'formik';
import { positiveFollowup } from '../../../interfaces/FormMFPositive';
import { mfFollowupData } from './MFPositiveStepperConfig';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import MfPositiveService from '../../../services/MfPositiveService';
import { confirmAlert } from 'react-confirm-alert';
import Select, { Option } from 'react-select';
import NumberFormat from 'react-number-format';
import moment from 'moment';
import * as Yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonFunction from '../../../../helpers/common/common';
import AccordionFollowUpDetails from './AccordionFollowUpDetail';
import mfPositiveDraftServices from '../../../draftServices/FormMFPositiveDraftServices';

const CreateFollowUp = (props: any) => {
  const listDESheetName: any = props && props.listDESheetName;
  const [followUpList, setFollowUpList] =
    useState<positiveFollowup>(mfFollowupData);
  const [mfFollowupInitialData, setMfFollowupInitialData] =
    useState<positiveFollowup>(mfFollowupData);
  const [hideFollowupList, setHideFollowupList] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [MFFollowupsList, getMFFollowupsList] = useState([]);
  const location: any = useLocation();
  const [MFPatientList, getMFPatientList] = useState([]);
  let isValidDate = moment().format('YYYY-MM-DD');
  const [MFPatientListEmpty, setMFPatientListEmpty] = useState(false);
  const [dataSyncAlert, setdataSyncAlert] = useState(false);
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);
  let isOnline = window.navigator.onLine;
  const noDataComponentMessage = MFPatientListEmpty
    ? 'Patient Info Empty'
    : 'There are no records to display';
  useEffect(() => {
    getMFFollowups();
    getMFPatient();
  }, []);
  async function getMFPatient() {
    let step1FieldunitId: any;
    let step3PatientIdList = [];
    let step3OfflinePatientId = [];
    if (location && location.state && location.state.mfId) {
      step1FieldunitId = location.state.mfId;
      const response = await MfPositiveService.getMfPositivePatientList(
        step1FieldunitId
      );
      if (response && response.data) {
        if (response && response.data && response.data.length > 0) {
          setMFPatientListEmpty(false);
        } else {
          setMFPatientListEmpty(true);
        }
        getMFPatientList(response.data);
      }
    } else if (location && location.state && location.state.UUID) {
      step1FieldunitId = location.state.UUID;
      let step3List =
        await mfPositiveDraftServices.getListMFPositiveLineListPatients(
          step1FieldunitId
        );
      if (step3List && step3List.length > 0) {
        setMFPatientListEmpty(false);
        step3PatientIdList = step3List.filter((element) => {
          if (!(element.id === 0)) {
            return element;
          }
        });
        step3OfflinePatientId = step3List.filter((element) => {
          if (element && element.id === 0) {
            return element && element.mfPositiveLineListPatientsUUID;
          }
        });
        if (step3OfflinePatientId.length > 0) {
          setdataSyncAlert(true);
        } else {
          setdataSyncAlert(false);
        }
        getMFPatientList(step3PatientIdList);
      } else {
        setMFPatientListEmpty(true);
      }
    } else {
      step1FieldunitId = props.mfPositiveLineListUUID;
      let step3List =
        await mfPositiveDraftServices.getListMFPositiveLineListPatients(
          step1FieldunitId
        );
      if (step3List && step3List.length > 0) {
        setMFPatientListEmpty(false);
        step3PatientIdList = step3List.filter((element) => {
          if (!(element.id === 0)) {
            return element;
          }
        });
        step3OfflinePatientId = step3List.filter((element) => {
          if (element && element.id === 0) {
            return element && element.mfPositiveLineListPatientsUUID;
          }
        });
        if (step3OfflinePatientId.length > 0) {
          setdataSyncAlert(true);
        } else {
          setdataSyncAlert(false);
        }
        getMFPatientList(step3PatientIdList);
      } else {
        setMFPatientListEmpty(true);
      }
    }
  }
  async function getMFFollowups() {
    let step1FieldunitId: any;
    if (location && location.state && location.state.mfId) {
      step1FieldunitId = location.state.mfId;
      const response = await MfPositiveService.getMfPositiveFollowUpsList(
        step1FieldunitId
      );
      if (response && response.data) {
        console.log('response.data', response.data);
        getMFFollowupsList(response.data);
      }
    } else if (location && location.state && location.state.UUID) {
      step1FieldunitId = location.state.UUID;
      let step4List =
        await mfPositiveDraftServices.getListMFPositiveLineListBSFollowUps(
          step1FieldunitId
        );
      getMFFollowupsList(step4List);
    } else {
      step1FieldunitId = props.mfPositiveLineListUUID;
      let step4List =
        await mfPositiveDraftServices.getListMFPositiveLineListBSFollowUps(
          step1FieldunitId
        );
      getMFFollowupsList(step4List);
    }
  }

  const onSubmit = async (values) => {
    values.noOfDECTabletsGiven = values.noOfDECTabletsGiven
      ? values.noOfDECTabletsGiven
      : 0;
    values.noOfDECTabletsConsumed = values.noOfDECTabletsConsumed
      ? values.noOfDECTabletsConsumed
      : 0;
    if (location && location.state && location.state.view) {
      showMFFollowDetails();
    } else {
      let FollowUpResponse;
      if (location && location.state && location.state.mfId) {
        values.mfPositiveLineListId = location.state.mfId;
        values.lastModifiedBy = props && props.userSessionId;
        FollowUpResponse = await MfPositiveService.postMfPositiveFollowUpsList(
          values
        );
        showMFFollowDetails();
      } else if (location && location.state && location.state.UUID) {
        values.mfPositiveLineListId = location.state.UUID;
        if (values && values.mfPositiveLineListBSFollowUpsUUID) {
          values.lastModifiedBy = props && props.userSessionId;
          FollowUpResponse =
            await mfPositiveDraftServices.updateMFPositiveLineListBSFollowUps(
              values.mfPositiveLineListBSFollowUpsUUID,
              values
            );
          if (FollowUpResponse) {
            showMFFollowDetails();
          }
        } else {
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          FollowUpResponse =
            await mfPositiveDraftServices.addMFPositiveLineListBSFollowUps(
              values
            );
          if (FollowUpResponse) {
            showMFFollowDetails();
          }
        }
      } else {
        values.mfPositiveLineListId = props.mfPositiveLineListUUID;
        if (values && values.mfPositiveLineListBSFollowUpsUUID) {
          values.lastModifiedBy = props && props.userSessionId;
          FollowUpResponse =
            await mfPositiveDraftServices.updateMFPositiveLineListBSFollowUps(
              values.mfPositiveLineListBSFollowUpsUUID,
              values
            );
          if (FollowUpResponse) {
            showMFFollowDetails();
          }
        } else {
          values.createdBy = props && props.userSessionId;
          values.lastModifiedBy = 0;
          FollowUpResponse =
            await mfPositiveDraftServices.addMFPositiveLineListBSFollowUps(
              values
            );
          if (FollowUpResponse) {
            showMFFollowDetails();
          }
        }
      }
    }
  };

  const validationSchem = Yup.object().shape({
    mfPositiveLineListPatientId: Yup.string()
      .required('Patient Name is required')
      .nullable(),
    phoneNoOfDrugAdmin: Yup.string().min(12, 'Invalid Phone Number').nullable(),
  });

  const formik = useFormik({
    initialValues: followUpList,
    validationSchema: validationSchem,
    onSubmit: onSubmit,
    enableReinitialize: true,
  });

  function hideMFFollowDetails() {
    if (dataSyncAlert) {
      toast.error('That Draft Data Need to Save', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      setHideFollowupList(true);
      formik.resetForm({ values: mfFollowupInitialData });
    }
  }

  function showMFFollowDetails() {
    setHideFollowupList(false);
    getMFFollowups();
  }

  const hfFollowupcolumns = [
    {
      name: 'Follow up',
      selector: (row: any) => (row.followUpYear ? row.followUpYear : 'Nil'),
    },
    {
      name: 'follow up Date',
      selector: (row: any) => (row.followUpDate ? row.followUpDate : 'Nil'),
    },
    {
      name: 'No of Dec Tablets',
      selector: (row: any) =>
        row.noOfDECTabletsGiven ? row.noOfDECTabletsGiven : 'Nil',
    },
    {
      name: 'Name Drug Admin',
      selector: (row: any) =>
        row.nameOfDrugAdmin ? row.nameOfDrugAdmin : 'Nil',
    },

    {
      name: 'Phone Number of Drug Admin',
      selector: (row: any) =>
        row.phoneNoOfDrugAdmin ? row.phoneNoOfDrugAdmin : 'Nil',
    },
    {
      name: 'Name of Patient',
      selector: (row: any) => {
        if (location && location.state && location.state.mfId) {
          return row.mfPositiveLineListPatient
            ? row.mfPositiveLineListPatient.patientName
            : 'Nil';
        } else {
          if (MFPatientList.length > 0) {
            console.log('MFPatientList', MFPatientList);
            const find: any = MFPatientList.find(
              ({ id }) => id === row.mfPositiveLineListPatientId
            );
            return find && find.patientName;
          } else {
            return 'empty';
          }
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
            <button className='btn'>
              <img
                src={viewIcon}
                onClick={() => updateFollowUpList(row, 'viewOnly')}
              />
            </button>
          )}
          {location && location.state && location.state.view ? (
            ''
          ) : (
            <>
              {!dataSyncAlert && (
                <button className='btn'>
                  <img
                    src={editIcon}
                    onClick={() => updateFollowUpList(row, 'edit')}
                  />
                </button>
              )}
              {!dataSyncAlert && (
                <button
                  className='btn'
                  onClick={(event) => Delete(event, row.id)}
                >
                  <img src={deleteIcon} />
                </button>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  const AccordionComponent = (row) => {
    return <AccordionFollowUpDetails rowValues={row} />;
  };

  function updateFollowUpList(row, action) {
    hideMFFollowDetails();
    row.mfPositiveLineListPatientId = parseInt(row.mfPositiveLineListPatientId);
    setFollowUpList({ followUpList, ...row });
  }

  async function deleteFollowUp(id: number) {
    const response = await MfPositiveService.deleteMfPositiveFollowUpsList(id);
    if (response) {
      getMFFollowups();
      console.log('Delete Followups', response);
    }
  }
  let MFPatientFollowupList: any = [];
  MFPatientList &&
    MFPatientList.map((item: any, i: any) => {
      MFPatientFollowupList.push({
        label: item.patientName + ' ' + item.patientId,
        value: item.id,
      });
    });
  const Delete = (event: any, id: number) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to Delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deleteFollowUp(id);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };

  const followUpYearList: any = [];
  Array.from(Array(5), (e, i: any) => {
    followUpYearList.push({ label: i + 1, value: i + 1 });
  });

  function moveToListPage() {
    history.push(listDESheetName);
    toast.success('Form Submitted Successfully', {
      position: toast.POSITION.TOP_CENTER,
    });
  }

  async function finishSave() {
    let step1Id: any;
    let mfLineListJSON: any = {};
    if (
      (location && location.state && location.state.view) ||
      (location && location.state && location.state.mfId)
    ) {
      setIsDisabled(true);
      moveToListPage();
    } else if (location && location.state && location.state.UUID) {
      step1Id = location.state.UUID;
      let step1Values = await mfPositiveDraftServices.getOneMFPositiveLineList(
        step1Id
      );
      step1Values.mfPositiveLineListSurveys = step1Values.surveyInfo;
      mfLineListJSON = step1Values;
      delete mfLineListJSON['surveyInfo'];
      let step3Values =
        await mfPositiveDraftServices.getListMFPositiveLineListPatients(
          step1Id
        );
      if (step3Values && step3Values.length > 0) {
        step3Values.forEach((ele) => {
          ele.mfPositiveLineListId = 0;
        });
        mfLineListJSON.mfPositiveLineListPatients = step3Values;
      }
      let step4Values =
        await mfPositiveDraftServices.getListMFPositiveLineListBSFollowUps(
          step1Id
        );
      if (step4Values && step4Values.length > 0) {
        step4Values.forEach((ele) => {
          ele.mfPositiveLineListId = 0;
        });
        mfLineListJSON.mfPositiveLineListBSFollowUps = step4Values;
      }
      console.log('mfLineListJSON', mfLineListJSON);
      const createAllResponse = await MfPositiveService.createAllMfPositiveList(
        mfLineListJSON
      );
      setIsDisabled(false);
      if (createAllResponse && createAllResponse.data) {
        console.log('createAllMfPositiveList', createAllResponse);
        const step1Delete =
          await mfPositiveDraftServices.deleteMFPositiveLineList(step1Id);
        if (step1Delete) {
          moveToListPage();
          const step3Delete =
            await mfPositiveDraftServices.deleteListMFPositiveLineListPatients(
              step1Id
            );
          const step4Delete =
            await mfPositiveDraftServices.deleteListMFPositiveLineListBSFollowUps(
              step1Id
            );
        }
      }
    } else {
      if (props && props.mfPositiveLineListUUID) {
        step1Id = props.mfPositiveLineListUUID;
        let step1Values =
          await mfPositiveDraftServices.getOneMFPositiveLineList(step1Id);
        step1Values.mfPositiveLineListSurveys = step1Values.surveyInfo;
        mfLineListJSON = step1Values;
        delete mfLineListJSON['surveyInfo'];
        let step3Values =
          await mfPositiveDraftServices.getListMFPositiveLineListPatients(
            step1Id
          );
        if (step3Values && step3Values.length > 0) {
          step3Values.forEach((ele) => {
            ele.mfPositiveLineListId = 0;
          });
          mfLineListJSON.mfPositiveLineListPatients = step3Values;
        }
        let step4Values =
          await mfPositiveDraftServices.getListMFPositiveLineListBSFollowUps(
            step1Id
          );
        if (step4Values && step4Values.length > 0) {
          step4Values.forEach((ele) => {
            ele.mfPositiveLineListId = 0;
          });
          mfLineListJSON.mfPositiveLineListBSFollowUps = step4Values;
        }
        const createAllResponse =
          await MfPositiveService.createAllMfPositiveList(mfLineListJSON);
        setIsDisabled(false);
        if (createAllResponse && createAllResponse.data) {
          const step1Delete =
            await mfPositiveDraftServices.deleteMFPositiveLineList(step1Id);
          if (step1Delete) {
            moveToListPage();
            const step3Delete =
              await mfPositiveDraftServices.deleteListMFPositiveLineListPatients(
                step1Id
              );
            const step4Delete =
              await mfPositiveDraftServices.deleteListMFPositiveLineListBSFollowUps(
                step1Id
              );
          }
        }
      }
    }
  }

  let createFollowList = () => {
    return (
      <div>
        {!hideFollowupList && (
          <div>
            <div className='card'>
              <div className='row'>
                <div className='col-md-6 col-xl-3 col-12'>
                  <h6 className='formtitlenew font-chng'>Follow-ups Details</h6>
                </div>
                {(location && location.state && location.state.view) ||
                MFPatientListEmpty ? (
                  ''
                ) : (
                  <div
                    className='col-md-6 offset-xl-6 col-xl-3 col-12 d-flex flex-row-reverse'
                    style={{ paddingRight: '20px' }}
                  >
                    <Button
                      variant='secondary'
                      className='mt-m font-chng'
                      onClick={hideMFFollowDetails}
                      disabled={dataSyncAlert}
                    >
                      <img src={plusImg} className='pe-2' />
                      Add New
                    </Button>
                    {dataSyncAlert && (
                      <h6
                        className='form-title font-chng text-danger'
                        style={{ marginTop: '5px' }}
                      >
                        Draft data need to be saved!
                      </h6>
                    )}
                  </div>
                )}
              </div>
              <div className='post-tablenew font-chng'>
                <DataTable
                  columns={hfFollowupcolumns}
                  data={MFFollowupsList}
                  expandableRows={true}
                  //expandOnRowClicked={true}s
                  noDataComponent={noDataComponentMessage}
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
                {props.activeStep !== 0 &&
                  <Button
                    variant="contained"
                    onClick={() => props.handleBack(props)}
                    className="btn btn-outline-light font-chng"
                  >
                    <i className="fas fa-arrow-left"></i>Back
                  </Button>
                }
                {!(location && location.state && location.state.mfId) &&
                  <button
                    type="button"
                    onClick={() => moveToListPage()}
                    className="btn btn-secondary font-chng"
                    disabled={location && location.state && location.state.id ? true : false}
                    style={{ marginRight: 15 }}
                  >
                    Save as Draft
                  </button>
                }
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
            </div>
            <div className='buttongrouprightend mb-4'>
              {props.activeStep !== 0 && (
                <Button
                  variant='contained'
                  onClick={() => props.handleBack(props)}
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
              )}
              {!(location && location.state && location.state.mfId) && (
                <button
                  className='btn font-chng'
                  type='button'
                  onClick={() => moveToListPage()}
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
                  className='btn font-chng'
                  style={{
                    // marginRight: '10px',
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
        )}
      </div>
    );
  };

  const showToast = (e) => {
    if ((e.target.id = 'Submitbtnid3')) {
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
      {/* <ToastContainer /> */}
      {createFollowList()}
      {hideFollowupList && (
        <FormikProvider value={formik}>
          <form onChange={formik.handleChange} onSubmit={formik.handleSubmit}>
            <div className='card'>
              <div className='card-body'>
                <fieldset
                  disabled={
                    location.state && location.state.view ? true : false
                  }
                >
                  <Row className='mb-3'>
                    <div className='col-md-6 col-xl-3'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label'>
                          Patient Name*
                        </label>

                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='mfPositiveLineListPatientId'
                          isClearable='true'
                          className={
                            formik.errors.mfPositiveLineListPatientId &&
                            formik.touched.mfPositiveLineListPatientId
                              ? 'custom-select is-invalid'
                              : 'custom-select'
                          }
                          value={
                            MFPatientFollowupList
                              ? MFPatientFollowupList.find(
                                  (option: any) =>
                                    option &&
                                    option.value ===
                                      formik.values.mfPositiveLineListPatientId
                                )
                              : ''
                          }
                          options={MFPatientFollowupList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              `mfPositiveLineListPatientId`,
                              option && option.value
                            );
                          }}
                        ></Select>
                        <div className={'invalid-feedback'}>
                          {formik.errors.mfPositiveLineListPatientId
                            ? formik.errors.mfPositiveLineListPatientId
                            : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label'>
                          Follow up
                        </label>
                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='followupYear'
                          isClearable='true'
                          className='custom-select'
                          value={
                            followUpYearList
                              ? followUpYearList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.followUpYear
                                )
                              : ''
                          }
                          options={followUpYearList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              `followUpYear`,
                              option && option.value
                            );
                          }}
                        ></Select>
                      </div>
                    </div>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label'>
                          Follow up Date
                        </label>
                        <input
                          type='date'
                          max={isValidDate}
                          className='form-control'
                          name='followUpDate'
                          value={
                            formik.values.followUpDate
                              ? formik.values.followUpDate
                              : ''
                          }
                        />
                      </div>
                    </div>
                    <div className='col-md-12 col-xl-3'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label'>
                          Result
                        </label>
                        <textarea
                          className='form-control'
                          name='result'
                          value={formik.values.result}
                        ></textarea>
                      </div>
                    </div>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label'>
                          No of DEC Tablets Given
                        </label>
                        <input
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          className='form-control'
                          name='noOfDECTabletsGiven'
                          value={formik.values.noOfDECTabletsGiven}
                        />
                      </div>
                    </div>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label'>
                          No of DEC Tablets Consumed
                        </label>
                        <input
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          className='form-control'
                          name='noOfDECTabletsConsumed'
                          value={formik.values.noOfDECTabletsConsumed}
                        />
                      </div>
                    </div>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label'>
                          Name of Drug Admin
                        </label>
                        <input
                          type='text'
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          className='form-control'
                          name='nameOfDrugAdmin'
                          value={formik.values.nameOfDrugAdmin}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                        />
                      </div>
                    </div>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label'>
                          Designation
                        </label>
                        <input
                          type='text'
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          className='form-control'
                          name='designation'
                          value={formik.values.designation}
                        />
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-3'>
                      <div className='form-grp'>
                        <label htmlFor='email' className='form-label'>
                          Phone Number of Drug Admin
                        </label>
                        <NumberFormat
                          className={
                            formik.errors.phoneNoOfDrugAdmin &&
                            formik.touched.phoneNoOfDrugAdmin
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          format='#### #### ##'
                          mask=''
                          placeholder='Phone Number Here'
                          name='phoneNoOfDrugAdmin'
                          value={
                            formik.values.phoneNoOfDrugAdmin
                              ? formik.values.phoneNoOfDrugAdmin
                              : ''
                          }
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors
                            ? formik.errors.phoneNoOfDrugAdmin
                            : ''}
                        </div>
                      </div>
                    </div>
                  </Row>
                </fieldset>
              </div>
              {/* <div className="form-grp text-right">
                {props.activeStep !== 0 && (
                  <Button
                    variant="contained"
                    onClick={showMFFollowDetails}
                    className="btn btn-outline-light font-chng"
                  >
                   Back
                  </Button>
                )}
                {!(location && location.state && location.state.view) && <Button id="Submitbtnid3" onClick={showToast} className="btn btn-secondary font-chng" type="submit">
                  Submit
                </Button>}
              </div> */}
            </div>
            <div className='buttongrouprightend mb-4'>
              {props.activeStep !== 0 && (
                <Button
                  variant='contained'
                  onClick={showMFFollowDetails}
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
              )}
              {!(location && location.state && location.state.view) && (
                <Button
                  type='submit'
                  id='Submitbtnid3'
                  onClick={showToast}
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
          </form>
        </FormikProvider>
      )}
    </div>
  );
};

export default CreateFollowUp;
