import React from 'react';
import StepConnector from '@material-ui/core/StepConnector';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { StepIconProps } from '@material-ui/core/StepIcon';
import DescriptionIcon from '@material-ui/icons/Description';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import PersonIcon from '@material-ui/icons/Search';
import clsx from 'clsx';
import {
  mfPositiveInterface,
  positiveSurveyData,
  positivePatients,
  positiveFollowup,
} from '../../../interfaces/FormMFPositive';
import moment from 'moment';

const currentdate = moment(new Date()).format('yyyy-MM-DD');

export const useColorlibStepIconStyles = makeStyles({
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

export const useColorlibStepIconStylesnew = makeStyles((theme) => ({
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

export function ColorlibStepIcon(props: StepIconProps) {
  const classes = useColorlibStepIconStylesnew();
  const { active, completed } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: (
      <div className='step-iconnew insect-iconnew'>
        <DescriptionIcon />
      </div>
    ),
    2: (
      <div className='step-iconnew person-iconnew'>
        <LocalShippingIcon />
      </div>
    ),
    3: (
      <div className='step-iconnew plan-iconnew'>
        <PersonIcon />
      </div>
    ),
    4: (
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

export const ColorlibConnector = withStyles({
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

export const mfPatientData: positivePatients = {
  id: 0,
  bsNumber: '',
  patientName: '',
  patientRegistrationDate: currentdate,
  headOfFamily: '',
  ageYears: 0,
  ageMonths: 0,
  gender: 0,
  patientPhoneNo: '',
  patientId: '',
  dateOfCollection: currentdate,
  dateOfExamination: currentdate,
  nameOfEU: '',
  nameOfEA: '',
  nameOfSchool: '',
  isMigrationHistory: 'false',
  nameOfVillagTown: '',
  nameOfDistrictState: '',
  ageFromYears: 0,
  ageFromMonths: 0,
  ageFromDays: 0,
  ageToYears: 0,
  ageToMonths: 0,
  ageToDays: 0,
  mfCount: '',
  isTreatmentGive: 'false',
  noOfDECTabletsGiven: '',
  dateOfTreatmentStarted: currentdate,
  reasonsForNonTreating: 0,
  reasonOthers: '',
  nameOfDrugAdmin: '',
  designation: '',
  phoneNoOfDrugAdmin: '',
};

export const mfFollowupData: positiveFollowup = {
  mfPositiveLineListPatientId: '',
  followUpYear: 0,
  followUpDate: currentdate,
  result: '',
  noOfDECTabletsGiven: '',
  noOfDECTabletsConsumed: '',
  nameOfDrugAdmin: '',
  designation: '',
  phoneNoOfDrugAdmin: '',
};
export const mfSurveyData: positiveSurveyData = {
  detailsOfSurveyId: 0,
  noOfPersonsMale0to4: '',
  noOfPersonsMale5to14: '',
  noOfPersonsMale15to39: '',
  noOfPersonsMale40Plus: '',
  noOfPersonsFemale0to4: '',
  noOfPersonsFemale5to14: '',
  noOfPersonsFemale15to39: '',
  noOfPersonsFemale40Plus: '',
  noOfPersonsTG0to4: '',
  noOfPersonsTG5to14: '',
  noOfPersonsTG15to39: '',
  noOfPersonsTG40Plus: '',
  dateOfAction: currentdate,
  mfPositiveLineListId: 0,
};

export const mfPositiveList: mfPositiveInterface = {
  id: 0,
  year: '',
  month: 0,
  districtId: '',
  corporationId: '',
  talukaId: '',
  facilityId: '',
  subCenterId: '',
  villageId: '',
  zoneId: 0,
  town: '',
  area: '',
  totalPopulationVillage: '',
  totalNoOfHousesInArea: '',
  unitOfAction: '',
  nameOfUnit: '',
  bsCollectionAntigenTest: 0,
  nameOfFilariaFieldUnit: '',
  populationCoveredByUnit: '',
  targetForCollectionOfNBS: '',
  fixOrRandom: 0,
  noOfBSFoundPositive: 0,
  nameOfEU: '',
  nameOfEA: '',
};
