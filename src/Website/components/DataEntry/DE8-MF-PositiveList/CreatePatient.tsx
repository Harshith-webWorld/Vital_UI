import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { FormikProvider, useFormik, Field } from 'formik';
import { useLocation } from 'react-router-dom';
import { mfPatientData } from './MFPositiveStepperConfig';
import { positivePatients } from '../../../interfaces/FormMFPositive';
import viewIcon from '../../../assets/img/view.png';
import editIcon from '../../../assets/img/pencilicon.png';
import deleteIcon from '../../../assets/img/closeicon.png';
import plusImg from '../../../assets/img/LEFP_Images/add_new.png';
import DoctorImg from '../../../assets/img/LEFP_Images/Doctor_icon.png';
import MfPositiveService from '../../../services/MfPositiveService';
import { confirmAlert } from 'react-confirm-alert';
import DropdownService from '../../../services/DropdownService';
import Select, { Option } from 'react-select';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import * as Yup from 'yup';
import commonFunction from '../../../../helpers/common/common';
import { ToastContainer, toast } from 'react-toastify';
import AccordionPatientInfo from './AccordionPatientInfo';
import mfPositiveDraftServices from '../../../draftServices/FormMFPositiveDraftServices';
import DexieOfflineDataBase from '../../../../helpers/Offline/OfflineDropdownServices';

const CreatePatient = (props: any, event: any) => {
  const { bsState } = props;
  console.log(bsState, 'testt');
  let isOnline = window.navigator.onLine;
  let isValidDate = moment().format('YYYY-MM-DD');
  const [showmigration, setShowMigration] = useState(false);
  const [hideNextStepButton, sethideNextStepButton] = useState(false);

  //const[hideTas,setHideTas]=useState(false)

  useEffect(() => {
    getMFPatient();
    getData();
    //handleTas()
    console.log('TA', props.hideTas);
  }, []);

  // async function handleTas(){
  //  if(props.bsCollectionAntigenTest === 89){
  //   setHideTas(true);
  // }
  // else{
  //   setHideTas(false)
  // }
  // }
  const [symbolsArr] = useState(['e', 'E', '+', '-', '.', 'Enter']);

  async function getMFPatient() {
    let step1FieldunitId: any;
    if (location && location.state && location.state.mfId) {
      step1FieldunitId = location.state.mfId;
      const response = await MfPositiveService.getMfPositivePatientList(
        step1FieldunitId
      );
      if (response && response.data) {
        let arr: any = response.data;
        getMFPatientList(response.data);
        // if (arr[0].isMigrationHistory == null) {
        //   arr[0].isMigrationHistory = ""
        // } else {
        //   arr[0].isMigrationHistory = arr[0].isMigrationHistory ? "true" : "false";
        // }
        // if (arr[0].isTreatmentGive == null) {
        //   arr[0].isTreatmentGive = ""
        // } else {
        //   arr[0].isTreatmentGive = arr[0].isTreatmentGive ? "true" : "false";
        // }
        // if (response.data[0].isMigrationHistory === "true") {
        //   setShowMigration(true)
        // }
        // else {
        //   setShowMigration(false)
        // }
      }
    } else if (location && location.state && location.state.UUID) {
      step1FieldunitId = location.state.UUID;
      let step3List =
        await mfPositiveDraftServices.getListMFPositiveLineListPatients(
          step1FieldunitId
        );
      getMFPatientList(step3List);
    } else {
      step1FieldunitId = props.mfPositiveLineListUUID;
      let step3List =
        await mfPositiveDraftServices.getListMFPositiveLineListPatients(
          step1FieldunitId
        );
      getMFPatientList(step3List);
    }
  }

  const [patientDetails, setPatientDetails] =
    useState<positivePatients>(mfPatientData);
  const [patientInitialDetails, setPatientInitialDetails] =
    useState<positivePatients>(mfPatientData);
  const [hidePatientList, setHidePatientList] = useState(false);
  const [MFPatientList, getMFPatientList] = useState([]);
  const [gender, setgender] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const location: any = useLocation();

  const isMigrationOnChange = (event) => {
    if (event.target.value === 'true') {
      setShowMigration(true);
    } else {
      setShowMigration(false);
      formik.setFieldValue('nameOfVillagTown', '');
      formik.setFieldValue('nameOfDistrictState', '');
      formik.setFieldValue('ageFromYears', 0);
      formik.setFieldValue('ageFromMonths', 0);
      formik.setFieldValue('ageFromDays', 0);
      formik.setFieldValue('ageToYears', 0);
      formik.setFieldValue('ageToMonths', 0);
      formik.setFieldValue('ageToDays', 0);
    }
  };

  async function savePatientInfo(postdata) {
    if (postdata.id) {
      postdata.lastModifiedBy = props && props.userSessionId;
    } else {
      postdata.createdBy = props && props.userSessionId;
      postdata.lastModifiedBy = 0;
    }
    let postResult = await MfPositiveService.postMfPositivePatientList(
      postdata
    );
    if (postResult && postResult.data) {
      console.log('post HF Followups info:: ', postResult.data);
      showPatientDetails();
    }
  }
  async function updatePatientInfo(postdata) {
    postdata.lastModifiedBy = props && props.userSessionId;
    let postResult = await MfPositiveService.updateMfPositivePatientList(
      postdata,
      postdata.id
    );
    if (postResult && postResult.data) {
      console.log('update HF Followups info:: ', postResult.data);
      showPatientDetails();
    }
  }

  let validSchema = Yup.object().shape({
    bsNumber: Yup.string().required('Required').nullable(),
    patientName: Yup.string().required('Required').nullable(),
    gender: Yup.number().required('Required').nullable(),
    patientPhoneNo: Yup.string()
      .required('Required')
      .min(12, 'Invalid Phone Number')
      .nullable(),
    phoneNoOfDrugAdmin: Yup.string().min(12, 'Invalid Phone Number').nullable(),
    dateOfCollection: Yup.date().nullable(),
    dateOfExamination: Yup.date()
      .min(
        Yup.ref('dateOfCollection'),
        ({ min }) =>
          `Date Of Examination should always be greater than Date Of Collection`
      )
      .nullable(),
  });

  const onSubmit = async (values) => {
    values.bsNumber = values.bsNumber ? values.bsNumber : '0';
    values.mfCount = values.mfCount ? values.mfCount : 0;
    values.noOfDECTabletsGiven = values.noOfDECTabletsGiven
      ? values.noOfDECTabletsGiven
      : 0;
    if (location && location.state && location.state.view) {
      props.handleNext(values);
      setIsDisabled(true);
    } else {
      let step1FieldunitId: any;
      if (location && location.state && location.state.mfId) {
        step1FieldunitId = location.state.mfId;
        values.mfPositiveLineListId = step1FieldunitId;
        values.id = values.id
          ? updatePatientInfo(values)
          : savePatientInfo(values);
        setIsDisabled(false);
      } else if (location && location.state && location.state.UUID) {
        step1FieldunitId = location.state.UUID;
        if (values && values.mfPositiveLineListPatientsUUID) {
          let step3Update =
            mfPositiveDraftServices.updateMFPositiveLineListPatients(
              values.mfPositiveLineListPatientsUUID,
              values
            );
          showPatientDetails();
        } else {
          if (isOnline) {
            let postResult = await MfPositiveService.postMfPositivePatientList(
              values
            );
            if (postResult && postResult.data) {
              postResult.data.mfPositiveLineListId = step1FieldunitId;
              let step3Add =
                await mfPositiveDraftServices.addMFPositiveLineListPatients(
                  postResult.data
                );
              showPatientDetails();
            }
          } else {
            values.mfPositiveLineListId = step1FieldunitId;
            let step3Add =
              await mfPositiveDraftServices.addMFPositiveLineListPatients(
                values
              );
            showPatientDetails();
            // toast.error("You are Offline can't add your form now,Please try when you are Online", { position: toast.POSITION.TOP_CENTER });
          }
        }
      } else {
        console.log('step 3 props--', props);
        step1FieldunitId = props.mfPositiveLineListUUID;
        if (values && values.mfPositiveLineListPatientsUUID) {
          let step3Update =
            await mfPositiveDraftServices.updateMFPositiveLineListPatients(
              values.mfPositiveLineListPatientsUUID,
              values
            );
          showPatientDetails();
        } else {
          if (isOnline) {
            let postResult = await MfPositiveService.postMfPositivePatientList(
              values
            );
            if (postResult && postResult.data) {
              postResult.data.mfPositiveLineListId = step1FieldunitId;
              let step3Add =
                await mfPositiveDraftServices.addMFPositiveLineListPatients(
                  postResult.data
                );
              showPatientDetails();
            }
          } else {
            values.mfPositiveLineListId = step1FieldunitId;
            let step3Add =
              await mfPositiveDraftServices.addMFPositiveLineListPatients(
                values
              );
            // toast.error("You are Offline can't add your form now,Please try when you are Online", { position: toast.POSITION.TOP_CENTER });
            showPatientDetails();
          }
        }
        // savePatientInfo(values);
      }
    }
  };

  const formik = useFormik({
    initialValues: patientDetails,
    validationSchema: validSchema,
    enableReinitialize: true,
    onSubmit: onSubmit,
  });

  function hidePatientDetails() {
    setHidePatientList(true);
    formik.resetForm({ values: patientInitialDetails });
  }
  function addPatientDetails() {
    setShowMigration(false);
    setHidePatientList(true);
    setgender(0);
    setShowTreatmentDetails(false);
    sethideNextStepButton(true);

    formik.resetForm({ values: patientInitialDetails });
  }

  function showPatientDetails() {
    setHidePatientList(false);
    getMFPatient();
    sethideNextStepButton(false);
  }
  function updatePatient(row, action) {
    console.log(row);
    if (
      (row && row.isMigrationHistory === true) ||
      (row && row.isMigrationHistory === 'true')
    ) {
      row.isMigrationHistory = 'true';
      setShowMigration(true);
    } else if (
      (row && row.isMigrationHistory === false) ||
      (row && row.isMigrationHistory === 'false')
    ) {
      row.isMigrationHistory = 'false';
      setShowMigration(false);
    } else if (row && row.isMigrationHistory === null) {
      setShowMigration(false);
    }
    if (
      (row && row.isTreatmentGive === true) ||
      (row && row.isTreatmentGive === 'true')
    ) {
      row.isTreatmentGive = 'true';
      setShowTreatmentDetails(true);
    } else if (
      (row && row.isTreatmentGive === false) ||
      (row && row.isMigrationHistory === 'false')
    ) {
      row.isTreatmentGive = 'false';
      setShowTreatmentDetails(false);
    } else if (row && row.isTreatmentGive === null) {
      setShowTreatmentDetails(false);
    }
    setgender(row.gender);
    hidePatientDetails();
    setPatientDetails({ patientDetails, ...row });
  }
  const PatientColumns = [
    {
      name: 'BS Number',
      selector: 'bsNumber',
    },
    {
      name: 'Name of patient',
      selector: 'patientName',
    },
    {
      name: 'Age',
      selector: (row: any) =>
        row.ageYears ? (
          <div>
            {row.ageYears} Years {row.ageMonths} Months
          </div>
        ) : null,
    },

    {
      name: 'Gender',
      selector: (row: any) => {
        if (location && location.state && location.state.mfId) {
          return row.Gender ? row.Gender.categoryOptionName : 'Nil';
        } else {
          if (row.gender === 0) {
            return 'Nil';
          } else {
            if (genderPersonValues.length > 0) {
              const find: any = genderPersonValues.find(
                ({ id }) => id === Number(row.gender)
              );
              return find && find.categoryOptionName;
            } else {
              return 'empty';
            }
          }
        }
      },
    },

    {
      name: 'Phone',
      selector: 'patientPhoneNo',
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
                onClick={() => updatePatient(row, 'viewOnly')}
              />
            </button>
          )}
          {location && location.state && location.state.view ? (
            ''
          ) : (
            <>
              <button className='btn'>
                <img
                  alt=''
                  src={editIcon}
                  onClick={() => updatePatient(row, 'edit')}
                />
              </button>
              <button
                className='btn'
                onClick={(event) => DeletePatient(event, row.id)}
              >
                <img alt='' src={deleteIcon} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const AccordionComponent = (row) => {
    return <AccordionPatientInfo rowValues={row} />;
  };

  async function deleteOnePatient(id: number) {
    const response = await MfPositiveService.deleteMfPositivePatientList(id);
    if (response) {
      getMFPatient();
    }
  }

  const DeletePatient = (event: any, id: number) => {
    confirmAlert({
      // title: "Confirm to Delete",
      message: 'Do you want to Delete ?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            deleteOnePatient(id);
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };
  const ageYearsList: any = [];
  Array.from(Array(100), (e, i: any) => {
    ageYearsList.push({ label: i + 1, value: i + 1 });
  });

  const ageMonthsList: any = [];
  Array.from(Array(12), (e, i: any) => {
    ageMonthsList.push({ label: i + 1, value: i + 1 });
  });

  const ageDaysList: any = [];
  Array.from(Array(31), (e, i: any) => {
    ageDaysList.push({ label: i + 1, value: i + 1 });
  });
  const [genderPersonValues, setgenderPersonValues] = useState([]);
  const [showReasonOthers, setShowReasonOthers] = useState(false);
  const [showTreatmentDetails, setShowTreatmentDetails] = useState(false);
  const [surgeryNotPossibleReasonsOption, setsurgeryNotPossibleReasonsOption] =
    useState([]);

  let surgeryNotPossibleReasonsList: any = [];
  surgeryNotPossibleReasonsOption &&
    surgeryNotPossibleReasonsOption.map((item: any, i: any) => {
      if (item && item.categoryCode === 1015) {
        surgeryNotPossibleReasonsList.push({
          label: item.categoryOptionName,
          value: item.id,
        });
      }
    });
  async function getData() {
    if (isOnline) {
      const genderPersonData: any = await DropdownService.getUnitAction();
      if (genderPersonData && genderPersonData.data) {
        setgenderPersonValues(genderPersonData.data);
        setsurgeryNotPossibleReasonsOption(genderPersonData.data);
      }
    } else {
      const genderDataOffline: any =
        await DexieOfflineDataBase.getCatagoryOption();
      if (genderDataOffline) {
        setgenderPersonValues(genderDataOffline);
        setsurgeryNotPossibleReasonsOption(genderDataOffline);
      }
    }
  }

  const genderPersonList =
    genderPersonValues &&
    genderPersonValues.map((item: any, i: any) => {
      if (item && item.categoryCode === 1000) {
        return (
          <label className='form-label' key={i}>
            <input
              type='radio'
              name='gender'
              className={
                formik.errors.gender && formik.touched.gender
                  ? 'form-radio is-invalid'
                  : 'form-radio'
              }
              value={item.id}
              checked={Number(formik.values.gender) === Number(item.id)}
              onChange={(event: any) => {
                setgender(event.target.value);
                formik.setFieldValue('gender', event.target.value);
              }}
            />
            {item.categoryOptionName}
          </label>
        );
      }
    });

  function changeReason(option) {
    if (option && option.label == 'Other - Specify') {
      setShowReasonOthers(true);
    } else {
      setShowReasonOthers(false);
    }
  }

  function isTreatmentGiven(event) {
    if (event === 'false') {
      setShowTreatmentDetails(false);
      formik.setFieldValue('noOfDECTabletsGiven', '');
      formik.setFieldValue(
        'dateOfTreatmentStarted',
        formik.values.dateOfTreatmentStarted
      );
    } else {
      setShowTreatmentDetails(true);
      formik.setFieldValue(
        'reasonsForNonTreating',
        formik.values.reasonsForNonTreating
      );
    }
  }
  let createPatientList = () => {
    return (
      <div>
        {!hidePatientList && (
          <div>
            <div className='card'>
              <div className='row'>
                <div className='col-md-9 col-12'>
                  <h6 className='formtitlenew font-chng'>Patient Info</h6>
                </div>
                {location && location.state && location.state.view ? (
                  ''
                ) : (
                  <div
                    className='col-md-3 col-12 text-right d-flex flex-row-reverse'
                    style={{ paddingRight: '20px' }}
                  >
                    <Button
                      variant='secondary'
                      className='mt-m font-chng'
                      style={{ backgroundColor: '#19D895', border: 'none' }}
                      onClick={addPatientDetails}
                    >
                      <img src={plusImg} className='pe-2' />
                      Add New
                    </Button>
                  </div>
                )}
              </div>
              <div className='post-tablenew font-chng'>
                <DataTable
                  columns={PatientColumns}
                  data={MFPatientList}
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
              {/* <div className='form-grp text-right'>
                {props.activeStep !== 0 && (
                  <Button
                    variant='contained'
                    onClick={() => props.handleBack(props)}
                    className='btn btn-outline-light'>
                    <i className='fas fa-arrow-left'></i>Back
                  </Button>
                )}
                {props.activeStep !== props.steps.length - 1 &&
                  props.activestep !== 0 ? (
                  <Button
                    onClick={() => props.handleNext(props)}
                    className='btn btn-secondary'>
                    Next
                  </Button>
                ) : (
                  <Button type='submit' className='btn btn-secondary'>
                    Finish
                  </Button>
                )}
              </div> */}
            </div>
          </div>
        )}
        {!hideNextStepButton && (
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
            {props.activeStep !== props.steps.length - 1 &&
            props.activestep !== 0 ? (
              <Button
                type='submit'
                onClick={() => props.handleNext(props)}
                style={{
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                }}
              >
                Next
              </Button>
            ) : (
              <Button
                type='submit'
                style={{
                  backgroundColor: '#34c38f',
                  border: '0px',
                  color: ' #ffffff',
                }}
              >
                Finish
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  const showToast = (e) => {
    if (e.target.id === 'Submitbtnid2') {
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
      {createPatientList()}
      {hidePatientList && (
        <FormikProvider value={formik}>
          <form
            onClick={showToast}
            onSubmit={formik.handleSubmit}
            onChange={formik.handleChange}
          >
            <fieldset
              disabled={location.state && location.state.view ? true : false}
            >
              <div className='card mt-4'>
                <h4 className='formtitlenew font-chng'>
                  Patient Information (MF +ve)
                </h4>
                <div className='card-body'>
                  <Row className='mb-3'>
                    <div className='col-md-4 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='patientName'
                          className='form-label font-chng'
                        >
                          Patient Name*
                        </label>
                        <input
                          type='text'
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          className={
                            formik.errors.patientName &&
                            formik.touched.patientName
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='patientName'
                          value={formik.values.patientName}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.patientName : ''}
                        </div>
                      </div>
                    </div>{' '}
                    <div className='col-md-4 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='patientRegistrationDate'
                          className='form-label font-chng'
                        >
                          Patient registration date
                        </label>
                        <input
                          type='date'
                          max={isValidDate}
                          className={
                            formik.errors.patientRegistrationDate &&
                            formik.touched.patientRegistrationDate
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='patientRegistrationDate'
                          // value={formik.values.patientRegistrationDate}
                          value={bsState}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors
                            ? formik.errors.patientRegistrationDate
                            : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-4 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='headOfFamily'
                          className='form-label font-chng'
                        >
                          Head of Family
                        </label>
                        <input
                          type='text'
                          onInput={(event) =>
                            commonFunction.onlyAlphabets(event)
                          }
                          className='form-control'
                          name='headOfFamily'
                          value={formik.values.headOfFamily}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                        />
                      </div>
                    </div>
                    <div className='col-md-4 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='bsNumber'
                          className='form-label font-chng'
                        >
                          BS Number*
                        </label>
                        <input
                          type='text'
                          className={
                            formik.errors.bsNumber && formik.touched.bsNumber
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='bsNumber'
                          value={
                            formik.values.bsNumber ? formik.values.bsNumber : ''
                          }
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.bsNumber : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-4 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='ageYears'
                          className='form-label font-chng'
                        >
                          Age - Years
                        </label>

                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='ageYears'
                          isClearable='true'
                          className='custom-select'
                          value={
                            ageYearsList
                              ? ageYearsList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.ageYears
                                )
                              : ''
                          }
                          options={ageYearsList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              `ageYears`,
                              option && option.value
                            );
                          }}
                        ></Select>
                      </div>
                    </div>
                    <div className='col-md-4 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='ageMonths'
                          className='form-label font-chng'
                        >
                          Age - Months
                        </label>

                        <Select
                          isDisabled={
                            location.state && location.state.view ? true : false
                          }
                          styles={commonFunction.customStyles}
                          name='ageMonths'
                          isClearable='true'
                          className='custom-select'
                          value={
                            ageMonthsList
                              ? ageMonthsList.find(
                                  (option: any) =>
                                    option &&
                                    option.value === formik.values.ageMonths
                                )
                              : ''
                          }
                          options={ageMonthsList}
                          onChange={(option: Option) => {
                            formik.setFieldValue(
                              `ageMonths`,
                              option && option.value
                            );
                          }}
                        ></Select>
                      </div>
                    </div>
                    <div className='col-md-4 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='gender'
                          className='form-label font-chng'
                        >
                          Gender
                        </label>
                        <div
                          role='group'
                          aria-labelledby='my-radio-group'
                          className={
                            formik.errors.gender && formik.touched.gender
                              ? 'form-radio is-invalid'
                              : 'form-radio'
                          }
                        >
                          {genderPersonList}
                        </div>
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.gender : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='patientPhoneNo'
                          className='form-label font-chng'
                        >
                          Patient Phone Number*
                        </label>
                        <NumberFormat
                          className={
                            formik.errors.patientPhoneNo &&
                            formik.touched.patientPhoneNo
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='patientPhoneNo'
                          format='#### #### ##'
                          mask=''
                          placeholder='Phone Number Here'
                          value={
                            formik.values.patientPhoneNo
                              ? formik.values.patientPhoneNo
                              : ''
                          }
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.patientPhoneNo : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='dateOfCollection'
                          className='form-label font-chng'
                        >
                          Date of Collection
                        </label>
                        <input
                          type='date'
                          max={isValidDate}
                          className={
                            formik.errors.dateOfCollection &&
                            formik.touched.dateOfCollection
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='dateOfCollection'
                          value={formik.values.dateOfCollection}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors.dateOfCollection
                            ? formik.errors.dateOfCollection
                            : ''}
                        </div>
                      </div>
                    </div>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='dateOfExamination'
                          className='form-label font-chng'
                        >
                          Date of Examination
                        </label>
                        <input
                          type='date'
                          max={isValidDate}
                          className={
                            formik.errors.dateOfExamination &&
                            formik.touched.dateOfExamination
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='dateOfExamination'
                          value={formik.values.dateOfExamination}
                        />
                        <div className={'invalid-feedback'}>
                          {formik.errors ? formik.errors.dateOfExamination : ''}
                        </div>
                      </div>
                    </div>
                    {/* <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='nameOfEU'
                          className='form-label font-chng'
                        >
                          Name of EU
                        </label>
                        <input
                          type='text'
                          disabled={props.hideTas ? false : true}
                          className='form-control'
                          name='nameOfEU'
                          value={formik.values.nameOfEU}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                        />
                      </div>
                    </div>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='nameOfEA'
                          className='form-label font-chng'
                        >
                          Name of EA
                        </label>
                        <input
                          type='text'
                          disabled={props.hideTas ? false : true}
                          className='form-control'
                          name='nameOfEA'
                          value={formik.values.nameOfEA}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                        />
                      </div>
                    </div> */}
                    {/* <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='nameOfSchool'
                          className='form-label font-chng'
                        >
                          Name of School
                        </label>
                        <input
                          type='text'
                          disabled={props.hideTas ? false : true}
                          className='form-control'
                          name='nameOfSchool'
                          value={formik.values.nameOfSchool}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                        />
                      </div>
                    </div> */}
                  </Row>
                </div>
              </div>

              <div className='card'>
                <h4 className='formtitlenew font-chng'>Migration Details</h4>
                <div className='card-body'>
                  <Row>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='isMigrationHistory'
                          className='form-label font-chng'
                        >
                          Is Migration History
                        </label>
                        <div
                          role='group'
                          aria-labelledby='my-radio-group'
                          className='form-radio'
                        >
                          <label className='form-label font-chng'>
                            <Field
                              type='radio'
                              name='isMigrationHistory'
                              value='true'
                              onChange={isMigrationOnChange}
                              defaultChecked={
                                formik.values.isMigrationHistory === 'true'
                              }
                            />
                            Yes
                          </label>
                          <label className='form-label font-chng'>
                            <Field
                              type='radio'
                              name='isMigrationHistory'
                              value='false'
                              onChange={isMigrationOnChange}
                              defaultChecked={
                                formik.values.isMigrationHistory === 'false'
                              }
                            />
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    {showmigration === true && (
                      <div className='col-md-4 col-xl-3'>
                        <div className='form-grp'>
                          <label
                            htmlFor='nameOfVillagTown'
                            className='form-label font-chng'
                          >
                            Name of Village/Town
                          </label>
                          <input
                            type='text'
                            className='form-control'
                            name='nameOfVillagTown'
                            value={formik.values.nameOfVillagTown}
                            onKeyPress={(e) => commonFunction.keyPress(e)}
                          />
                        </div>
                      </div>
                    )}
                    {showmigration === true && (
                      <>
                        <div className='col-md-4 col-xl-3'>
                          <div className='form-grp'>
                            <label
                              htmlFor='nameOfDistrictState'
                              className='form-label font-chng'
                            >
                              Name of District/State
                            </label>
                            <input
                              type='text'
                              className='form-control'
                              name='nameOfDistrictState'
                              value={formik.values.nameOfDistrictState}
                              onKeyPress={(e) => commonFunction.keyPress(e)}
                            />
                          </div>
                        </div>
                        <div className='col-md-2 col-xl-3'>
                          <div className='form-grp'>
                            <label
                              htmlFor='ageFromYears'
                              className='form-label font-chng'
                            >
                              Age - From Years
                            </label>

                            <Select
                              isDisabled={
                                location.state && location.state.view
                                  ? true
                                  : false
                              }
                              styles={commonFunction.customStyles}
                              name='ageFromYears'
                              isClearable='true'
                              className='custom-select'
                              value={
                                ageYearsList
                                  ? ageYearsList.find(
                                      (option: any) =>
                                        option &&
                                        option.value ===
                                          formik.values.ageFromYears
                                    )
                                  : ''
                              }
                              options={ageYearsList}
                              onChange={(option: Option) => {
                                formik.setFieldValue(
                                  `ageFromYears`,
                                  option && option.value
                                );
                              }}
                            ></Select>
                          </div>
                        </div>
                      </>
                    )}
                  </Row>
                  {showmigration === true && (
                    <Row className='mb-3'>
                      <div className='col-md-2 col-xl-3'>
                        <div className='form-grp'>
                          <label
                            htmlFor='ageFromMonths'
                            className='form-label font-chng'
                          >
                            Age - From Months
                          </label>

                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='ageFromMonths'
                            isClearable='true'
                            className='custom-select'
                            value={
                              ageMonthsList
                                ? ageMonthsList.find(
                                    (option: any) =>
                                      option &&
                                      option.value ===
                                        formik.values.ageFromMonths
                                  )
                                : ''
                            }
                            options={ageMonthsList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                `ageFromMonths`,
                                option && option.value
                              );
                            }}
                          ></Select>
                        </div>
                      </div>
                      <div className='col-md-2 col-xl-3'>
                        <div className='form-grp'>
                          <label
                            htmlFor='ageFromMonths'
                            className='form-label font-chng'
                          >
                            Age - From Days
                          </label>

                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='ageFromDays'
                            isClearable='true'
                            className='custom-select'
                            value={
                              ageDaysList
                                ? ageDaysList.find(
                                    (option: any) =>
                                      option &&
                                      option.value === formik.values.ageFromDays
                                  )
                                : ''
                            }
                            options={ageDaysList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                `ageFromDays`,
                                option && option.value
                              );
                            }}
                          ></Select>
                        </div>
                      </div>

                      <div className='col-md-2 col-xl-3'>
                        <div className='form-grp'>
                          <label
                            htmlFor='ageFromYears'
                            className='form-label font-chng'
                          >
                            Age - To Years
                          </label>

                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='ageToYears'
                            isClearable='true'
                            className='custom-select'
                            value={
                              ageYearsList
                                ? ageYearsList.find(
                                    (option: any) =>
                                      option &&
                                      option.value === formik.values.ageToYears
                                  )
                                : ''
                            }
                            options={ageYearsList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                `ageToYears`,
                                option && option.value
                              );
                            }}
                          ></Select>
                        </div>
                      </div>
                      <div className='col-md-2 col-xl-3'>
                        <div className='form-grp'>
                          <label
                            htmlFor='ageFromMonths'
                            className='form-label font-chng'
                          >
                            Age - To Months
                          </label>

                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='ageToMonths'
                            isClearable='true'
                            className='custom-select'
                            value={
                              ageMonthsList
                                ? ageMonthsList.find(
                                    (option: any) =>
                                      option &&
                                      option.value === formik.values.ageToMonths
                                  )
                                : ''
                            }
                            options={ageMonthsList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                `ageToMonths`,
                                option && option.value
                              );
                            }}
                          ></Select>
                        </div>
                      </div>
                      <div className='col-md-2 col-xl-3'>
                        <div className='form-grp'>
                          <label
                            htmlFor='ageToDays'
                            className='form-label font-chng'
                          >
                            Age - To Days
                          </label>

                          <Select
                            isDisabled={
                              location.state && location.state.view
                                ? true
                                : false
                            }
                            styles={commonFunction.customStyles}
                            name='ageToDays'
                            isClearable='true'
                            className='custom-select'
                            value={
                              ageDaysList
                                ? ageDaysList.find(
                                    (option: any) =>
                                      option &&
                                      option.value === formik.values.ageToDays
                                  )
                                : ''
                            }
                            options={ageDaysList}
                            onChange={(option: Option) => {
                              formik.setFieldValue(
                                `ageToDays`,
                                option && option.value
                              );
                            }}
                          ></Select>
                        </div>
                      </div>
                    </Row>
                  )}
                </div>
              </div>
            </fieldset>
            <div className='card'>
              <h4 className='formtitlenew font-chng'>Treatment Details</h4>
              <div className='card-body'>
                <fieldset
                  disabled={
                    location.state && location.state.view ? true : false
                  }
                >
                  <Row className='mb-3'>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='mfCount'
                          className='form-label font-chng'
                        >
                          MF Count
                        </label>
                        <input
                          type='number'
                          min='0'
                          onWheel={(e) => commonFunction.handleWheelEvent(e)}
                          onKeyDown={(e) =>
                            symbolsArr.includes(e.key) && e.preventDefault()
                          }
                          className='form-control'
                          name='mfCount'
                          value={formik.values.mfCount}
                        />
                      </div>
                    </div>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='isTreatmentGive'
                          className='form-label font-chng'
                        >
                          Is Treatment Given
                        </label>
                        <div
                          role='group'
                          aria-labelledby='my-radio-group'
                          className='form-radio'
                        >
                          <label className='form-label font-chng'>
                            <Field
                              type='radio'
                              name='isTreatmentGive'
                              value='true'
                              defaultChecked={
                                formik.values.isTreatmentGive === 'true'
                              }
                              onChange={(e) => {
                                isTreatmentGiven('true');
                              }}
                            />
                            Yes
                          </label>
                          <label className='form-label font-chng'>
                            <Field
                              type='radio'
                              name='isTreatmentGive'
                              value='false'
                              defaultChecked={
                                formik.values.isTreatmentGive === 'false'
                              }
                              onChange={(e) => {
                                isTreatmentGiven('false');
                              }}
                            />
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    {showTreatmentDetails === true ? (
                      <>
                        <div className='col-md-3 col-xl-3'>
                          <div className='form-grp'>
                            <label
                              htmlFor='noOfDECTabletsGiven'
                              className='form-label font-chng'
                            >
                              No of Dec Tablets Given
                            </label>
                            <input
                              type='number'
                              min='0'
                              onWheel={(e) =>
                                commonFunction.handleWheelEvent(e)
                              }
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
                            <label
                              htmlFor='dateOfTreatmentStarted'
                              className='form-label font-chng'
                            >
                              Date of Treatment Started
                            </label>
                            <input
                              type='date'
                              max={isValidDate}
                              className='form-control'
                              name='dateOfTreatmentStarted'
                              value={formik.values.dateOfTreatmentStarted}
                            />
                          </div>
                        </div>{' '}
                      </>
                    ) : (
                      <>
                        <div className='col-md-6 col-xl-3'>
                          <div className='form-grp'>
                            <label
                              htmlFor='reasonsForNonTreating'
                              className='form-label font-chng'
                            >
                              Reason for Not Treating
                            </label>

                            <Select
                              isDisabled={
                                location.state && location.state.view
                                  ? true
                                  : false
                              }
                              styles={commonFunction.customStyles}
                              name='reasonsForNonTreating'
                              isClearable='true'
                              className='custom-select'
                              value={
                                surgeryNotPossibleReasonsList
                                  ? surgeryNotPossibleReasonsList.find(
                                      (option: any) =>
                                        option &&
                                        option.value ===
                                          formik.values.reasonsForNonTreating
                                    )
                                  : ''
                              }
                              options={surgeryNotPossibleReasonsList}
                              onChange={(option: Option) => {
                                formik.setFieldValue(
                                  `reasonsForNonTreating`,
                                  option && option.value
                                );
                                changeReason(option);
                              }}
                            ></Select>
                          </div>
                        </div>
                        {showReasonOthers && (
                          <div className='col-md-6 col-xl-3'>
                            <div className='form-grp'>
                              <label
                                htmlFor='reasonOthers'
                                className='form-label font-chng'
                              >
                                Reason Others
                              </label>
                              <input
                                type='text'
                                className='form-control'
                                name='reasonOthers'
                                value={formik.values.reasonOthers}
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='nameOfDrugAdmin'
                          className='form-label font-chng'
                        >
                          Name of Drug Admin
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          name='nameOfDrugAdmin'
                          value={formik.values.nameOfDrugAdmin}
                          onKeyPress={(e) => commonFunction.keyPress(e)}
                        />
                      </div>
                    </div>
                    <div className='col-md-3 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='designation'
                          className='form-label font-chng'
                        >
                          Designation
                        </label>
                        <input
                          type='text'
                          className='form-control'
                          name='designation'
                          value={formik.values.designation}
                        />
                      </div>
                    </div>
                    <div className='col-md-6 col-xl-3'>
                      <div className='form-grp'>
                        <label
                          htmlFor='phoneNoOfDrugAdmin'
                          className='form-label font-chng'
                        >
                          Phone Number of Drug Admin
                        </label>
                        <NumberFormat
                          className={
                            formik.errors.phoneNoOfDrugAdmin &&
                            formik.touched.phoneNoOfDrugAdmin
                              ? 'form-control is-invalid'
                              : 'form-control'
                          }
                          name='phoneNoOfDrugAdmin'
                          format='#### #### ##'
                          mask=''
                          placeholder='Phone Number Here'
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
              {/* <div className='form-grp text-right'>
                {props.activeStep !== 0 && (
                  <Button
                    variant='contained'
                    onClick={showPatientDetails}
                    className='btn btn-outline-light font-chng'>
                    <i className='fas fa-arrow-left'></i>Back
                  </Button>
                )}
                {!(location && location.state && location.state.view) && <Button id="Submitbtnid2" className="btn btn-secondary font-chng" type="submit">
                  Submit
                </Button>}
              </div> */}
            </div>
            <div className='buttongrouprightend mb-4'>
              {props.activeStep !== 0 && (
                <Button
                  variant='contained'
                  onClick={showPatientDetails}
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
                  id='Submitbtnid2'
                  // className="btn btn-secondary font-chng"
                  style={{
                    // marginRight: '10px',
                    backgroundColor: '#34c38f',
                    border: '0px',
                    color: ' #ffffff',
                  }}
                  disabled={isDisabled}
                  type='submit'
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

export default CreatePatient;
