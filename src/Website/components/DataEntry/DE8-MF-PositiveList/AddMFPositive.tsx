import React, { useEffect, useRef, useState } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { ToastContainer } from 'react-toastify';
import * as Yup from 'yup';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import FilariaFieldUnitInfo from './CreateFilariaFieldUnitInfo';
import SurveyDetails from './CreateSurveyDetails';
import CreatePatient from './CreatePatient';
import CreateFollowUp from './CreateFollowUp';
import {
  ColorlibConnector,
  ColorlibStepIcon,
  mfPositiveList,
} from './MFPositiveStepperConfig';
import { useLocation } from 'react-router-dom';
import history from '../../../../helpers/history';
import { mfPositiveInterface } from '../../../interfaces/FormMFPositive';
import commonFunction from '../../../../helpers/common/common';

const AddMFPositive: React.FC<any> = (props) => {
  const location: any = useLocation();
  const step1Ref = useRef<any>(null);
  const userSessionId = props && props.userSessionId;
  const listDESheetName: any = props && props.listDESheetName;
  const [step1Valid, isStep1Valid] = React.useState(false);
  //const hideTas:any=props.props.hideTas;
  const [hideTas, setHideTas] = useState(false);
  const [bsState, setBSState] = useState('');
  let isOnline = window.navigator.onLine;

  const handleNext = (value: any) => {
    console.log('handle next value', value);
    if (
      value.districtId &&
      value.nameOfUnit &&
      value.unitOfAction &&
      value.corporationId &&
      value.talukaId &&
      value.zoneId &&
      value.facilityId &&
      value.subcenterId &&
      activeStep === 0
    ) {
      isStep1Valid(true);
    } else {
      isStep1Valid(true);
    }
    setFormData({ ...formData, ...value });
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = (value: any) => {
    console.log('handle back value', value);
    setFormData({ ...formData, ...value });
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleBSCollection = (e) => {
    if (e.label === 'TAS') {
      setHideTas(true);
    } else {
      setHideTas(false);
    }
  };

  const [activeStep, setActiveStep] = React.useState(() => {
    return location && location.state && location.state.goToStep
      ? location.state.goToStep
      : 0;
  });

  const steps = getSteps();
  function getSteps() {
    return [
      'Filaria Field Unit Info',
      'Survey Details',
      'Patient Info',
      'Follow-ups Details',
    ];
  }

  const handleStep = (step: number) => () => {
    if (location && location.state && location.state.view) {
      if (step1Valid || location.state) setActiveStep(step);
    }
  };

  const [formData, setFormData] = useState<mfPositiveInterface>(mfPositiveList);

  function getStepContent(step) {
    switch (step) {
      case 0:
        return (
          <div>
            <FilariaFieldUnitInfo
              {...formData}
              listDESheetName={listDESheetName}
              activeStep={activeStep}
              steps={steps}
              handleNext={handleNext}
              handleBack={handleBack}
              userSessionId={userSessionId}
              handleTas={handleBSCollection}
            ></FilariaFieldUnitInfo>
          </div>
        );
      case 1:
        return (
          <div>
            <SurveyDetails
              {...formData}
              activeStep={activeStep}
              steps={steps}
              handleNext={handleNext}
              handleBack={handleBack}
              userSessionId={userSessionId}
              setBSState={setBSState}
            ></SurveyDetails>
          </div>
        );
      case 2:
        return (
          <div>
            <CreatePatient
              {...formData}
              activeStep={activeStep}
              steps={steps}
              handleNext={handleNext}
              handleBack={handleBack}
              userSessionId={userSessionId}
              hideTas={hideTas}
              bsState={bsState}
            ></CreatePatient>
          </div>
        );
      case 3:
        return (
          <div>
            <CreateFollowUp
              {...formData}
              listDESheetName={listDESheetName}
              activeStep={activeStep}
              steps={steps}
              handleNext={handleNext}
              handleBack={handleBack}
              userSessionId={userSessionId}
            ></CreateFollowUp>
          </div>
        );
      default:
        return 'Unknown step';
    }
  }

  return (
    <div className='in-left'>
      <Breadcrumb>
        <Breadcrumb.Item
          className='font-chng'
          onClick={() => {
            history.push('/WebDashboard');
          }}
        >
          Data Entry
        </Breadcrumb.Item>
        <Breadcrumb.Item
          className='font-chng'
          onClick={() => {
            history.push('/mf-positive-list');
          }}
        >
          MF Positive
        </Breadcrumb.Item>
        {location && location.state && location.state.view ? (
          <Breadcrumb.Item active>View</Breadcrumb.Item>
        ) : (location && location.state && location.state.mfId) ||
          (location && location.state && location.state.UUID) ? (
          <Breadcrumb.Item active>Edit</Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item active>Add</Breadcrumb.Item>
        )}

        {activeStep === 0 && (
          <Breadcrumb.Item active className='font-chng'>
            {' '}
            Filaria Field Unit Info
          </Breadcrumb.Item>
        )}
        {activeStep === 1 && (
          <Breadcrumb.Item active className='font-chng'>
            Survey Details
          </Breadcrumb.Item>
        )}
        {activeStep === 2 && (
          <Breadcrumb.Item active className='font-chng'>
            Patient Info
          </Breadcrumb.Item>
        )}
        {activeStep === 3 && (
          <Breadcrumb.Item active className='font-chng'>
            Follow-ups Details
          </Breadcrumb.Item>
        )}
      </Breadcrumb>
      <div>
        <div className='card'>
          <h4 className='formtitlenew font-chng'>
            Add Filaria Field Unit Info
          </h4>
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
                <h4 className='font-chng'>Filaria Field Unit Info</h4>
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
            <Step>
              <StepLabel
                onClick={handleStep(2)}
                StepIconComponent={ColorlibStepIcon}
              >
                <h5 className='font-chng'>Step 3</h5>
                <h4 className='font-chng'>Patient Info</h4>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel
                onClick={handleStep(3)}
                StepIconComponent={ColorlibStepIcon}
              >
                <h5 className='font-chng'>Step 4</h5>
                <h4 className='font-chng'>Follow-ups Details</h4>
              </StepLabel>
            </Step>
          </Stepper>
        </div>
        <div>{getStepContent(activeStep)}</div>
      </div>
    </div>
  );
};

export default AddMFPositive;
