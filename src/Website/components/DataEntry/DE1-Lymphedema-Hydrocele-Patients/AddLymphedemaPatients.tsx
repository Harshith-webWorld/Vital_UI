import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { ToastContainer } from 'react-toastify';
import * as Yup from 'yup';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import { LymphedemaLineList } from '../../../interfaces/FormLymphedema';
import DoctorImg from '../../../assets/img/LEFP_Images/Doctor_icon.png';
import Step1 from './step1-lymphdema';
import Step2 from './step2-lymphdema';
import Step3 from './step3-lymphdema';
import Step4 from './step4-lymphdema';
import Step5 from './step5-lymphdema';
import {
  ColorlibConnectornew,
  ColorlibStepIconnew,
  LineList,
} from './Form1-stepper-config';
import history from '../../../../helpers/history';
import { useLocation } from 'react-router-dom';
import LymphedemaPatientInfoService from '../../../services/FormLymphedemaService';
import { useSelector } from 'react-redux';
import userService from '../../../../helpers/services/userService';
import { Divider, withStyles } from '@material-ui/core';

const AddLymphedemaPatients: React.FC<any> = (props) => {
  const location: any = useLocation();
  const listDESheetName: any = props && props.listDESheetName;
  const userSessionId = props && props.userSessionId;

  const step1Ref = useRef<any>(null);
  useEffect(() => {
    getOneLymphedema();
  }, []);
  const [formValues, setFormValues] = useState<LymphedemaLineList>(LineList);
  const [lymphedemaLineListIdData, setLymphedemaLineListIdData] = useState({});
  const [genderState, setGenderState] = useState();

  const getOneLymphedema = async () => {
    if (location && location.state && location.state.id) {
      const getOneResult: any =
        await LymphedemaPatientInfoService.getOneLymphedemaPatientInformation(
          location.state.id,
        );
    }
  };

  const handleNext = (newValues: any) => {
    console.log('handleNext::', newValues);
    if (
      (newValues.districtId &&
        newValues.wardId &&
        newValues.corporationId &&
        newValues.talukaId &&
        newValues.zoneId &&
        newValues.facilityId &&
        newValues.subcenterId &&
        activeStep === 0) ||
      newValues[0] === 1
    ) {
      isStep1Valid(true);
      console.log('Next::', step1Valid);
    } else if (
      activeStep === 1 ||
      activeStep === 2 ||
      activeStep === 3 ||
      activeStep === 4
    ) {
      isStep1Valid(true);
      console.log('Next::', step1Valid);
    }
    setFormValues({ ...formValues, ...newValues });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (newValues) => {
    console.log('handleBack::', newValues);
    setFormValues({ ...formValues, ...newValues });
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const [step1Valid, isStep1Valid] = React.useState(false);
  const [step2Valid, isStep2Valid] = React.useState(false);
  const [step3Valid, isStep3Valid] = React.useState(false);
  const [step4Valid, isStep4Valid] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(() => {
    return (location && location.state && location.state.goToStep) ? location.state.goToStep : 0
  });

  const steps = getSteps();

  function getSteps() {
    return [
      'Patient Info',
      'Disease Symptoms',
      'Survey Details',
      'Filaria Follow-ups',
      'Hydrocele Follow-ups',
    ];
  }

  const handleStep = (step: number) => () => {
    if(location && location.state && location.state.view){
      if (step1Valid || location.state) setActiveStep(step);
    }
  };
  
  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div>
            <Step1
              {...formValues}
              listDESheetName={listDESheetName}
              activeStep={activeStep}
              steps={steps}
              handleNext={handleNext}
              handleBack={handleBack}
              userSessionId={userSessionId}
              setGenderState={setGenderState}  
            />
          </div>
        );
      case 1:
        return (
          <div>
            <Step2
              {...formValues}
              activeStep={activeStep}
              steps={steps}
              handleNext={handleNext}
              handleBack={handleBack}
              userSessionId={userSessionId}
              genderState={genderState}
              />
          </div>
        );
      case 2:
        return (
          <div>
            <Step3
              {...formValues}
              activeStep={activeStep}
              signinUserRole={props && props.userRole}
              steps={steps}
              handleNext={handleNext}
              handleBack={handleBack}
              userSessionId={userSessionId}></Step3>
          </div>
        );
      case 3:
        return (
          <div>
            <Step4
              {...formValues}
              activeStep={activeStep}
              steps={steps}
              handleNext={handleNext}
              handleBack={handleBack}
              userSessionId={userSessionId}></Step4>
          </div>
        );
      case 4:
        return (
          <div>
            <Step5
              {...formValues}
              listDESheetName={listDESheetName}
              activeStep={activeStep}
              steps={steps}
              handleNext={handleNext}
              handleBack={handleBack}
              userSessionId={userSessionId}></Step5>
          </div>
        );
      default:
        return 'Unknown step';
    }
  }

  return (
    <div className='in-left'>
      <Breadcrumb>
        <Breadcrumb.Item className='font-chng breadcrumbnew' onClick={() => {history.push('/WebDashboard')}}>
          Data Entry
        </Breadcrumb.Item>
        <Breadcrumb.Item
          className='font-chng breadcrumbnew'
          onClick={() => {history.push('/lymphedema-hydrocele-patients')}}
          >
          Lymphedema/Hydrocele Patients
        </Breadcrumb.Item>
        {location.state && location.state.view ? (
          <Breadcrumb.Item active className='font-chng breadcrumbnew'>
            View
          </Breadcrumb.Item>
        ) : (location && location.state && location.state.id) ||
          (location && location.state && location.state.UUID) ? (
          <Breadcrumb.Item active className='font-chng breadcrumbnew'>
            Edit
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active className='font-chng breadcrumbnew'>
            Add
          </Breadcrumb.Item>
        )}

        {activeStep === 0 &&
          (location.state && location.state.view ? (
            <Breadcrumb.Item active>View Patient Info</Breadcrumb.Item>
          ) : location.state && location.state.id ? (
            <Breadcrumb.Item active className='font-chng breadcrumbnew'>
              Patient Info
            </Breadcrumb.Item>
          ) : (
            <Breadcrumb.Item active className='font-chng breadcrumbnew'>
              Add Patient Info
            </Breadcrumb.Item>
          ))}

        {activeStep === 1 && (
          <Breadcrumb.Item active className='font-chng'>
            Disease Symptoms
          </Breadcrumb.Item>
        )}
        {activeStep === 2 && (
          <Breadcrumb.Item active className='font-chng'>
            Survey Details
          </Breadcrumb.Item>
        )}
        {activeStep === 3 && (
          <Breadcrumb.Item active className='font-chng'>
            Filaria Followups
          </Breadcrumb.Item>
        )}
        {activeStep === 4 && (
          <Breadcrumb.Item active className='font-chng'>
            Hydrocele Followups
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      <div>
        <div>
          <div className='cardnew'>
            <div className='formtitlenew font-chng'>
              Lymphedema/Hydrocele Patient
            </div>{' '}
            <Divider />
            <Stepper
              className={`${(location && location.state && location.state.view) ? "step-wrapnew" : "step-wrapnew-no-cursor"}`}
              activeStep={activeStep}
              alternativeLabel
              connector={<ColorlibConnectornew />}>
              <Step>
                <StepLabel
                  onClick={handleStep(0)}
                  StepIconComponent={ColorlibStepIconnew}
                  >
                  <h5 className='font-chng'>Step 1</h5>
                  <h4 className='font-chng'>Patient Info</h4>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel
                  onClick={handleStep(1)}
                  StepIconComponent={ColorlibStepIconnew}
                  >
                  <h5 className='font-chng'>Step 2</h5>
                  <h4 className='font-chng'> Disease Symptoms</h4>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel
                  onClick={handleStep(2)}
                  StepIconComponent={ColorlibStepIconnew}
                  >
                  <h5 className='font-chng'>Step 3</h5>
                  <h4 className='font-chng'>Survey Details</h4>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel
                  onClick={handleStep(3)}
                  StepIconComponent={ColorlibStepIconnew}>
                  <h5 className='font-chng'>Step 4</h5>
                  <h4 className='font-chng'>Filaria Follow-ups</h4>
                </StepLabel>
              </Step>
              <Step>
                <StepLabel
                  onClick={handleStep(4)}
                  StepIconComponent={ColorlibStepIconnew}>
                  <h5 className='font-chng'>Step 5</h5>
                  <h4 className='font-chng'>Hydrocele Follow-ups</h4>
                </StepLabel>
              </Step>
            </Stepper>
          </div>
          <div>{getStepContent(activeStep)}</div>
        </div>
      </div>
    </div>
  );
};

export default AddLymphedemaPatients;
