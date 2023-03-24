import React from 'react';
import StepConnector from '@material-ui/core/StepConnector';
import {
  makeStyles,
  Theme,
  createStyles,
  withStyles,
} from '@material-ui/core/styles';
import { StepIconProps } from '@material-ui/core/StepIcon';
import DescriptionIcon from '@material-ui/icons/Description';
import PersonSearchIcon from '@material-ui/icons/Search';
import SavedSearchIcon from '@material-ui/icons/Search';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import VideoLabelIcon from '@material-ui/icons/VideoLabel';
import PersonIcon from '@material-ui/icons/Person';
import ListAlt from '@material-ui/icons/ListAlt';
import clsx from 'clsx';

import Step3 from './step3-lymphdema';

import {
  LymphedemaLineList,
  LymphedemaLineListSurvey,
  LymphedemaLineListFollowUpsHF,
  LymphedemaLineListFollowUpsLF,
  DiseaseSymtoms,
} from '../../../interfaces/FormLymphedema';
import moment from 'moment';

const currentdate = moment(new Date()).format('yyyy-MM-DD');

export const useColorlibStepIconStyles = makeStyles((theme) => ({
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
    color: '#0D9206',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  completed: {
    backgroundColor: '#DAF2CC',
    color: '#0D9206',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

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

export const ColorlibConnector = withStyles({
  alternativeLabel: {
    top: 22,
  },
  active: {
    '& $line': {
      backgroundColor: '#DAF2CC',
    },
  },
  completed: {
    '& $line': {
      backgroundColor: '#DAF2CC',
    },
  },
  line: {
    height: 3,
    border: 0,
    backgroundColor: '#DAF2CC',
    borderRadius: 1,
  },
})(StepConnector);

export const ColorlibConnectornew = withStyles({
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

export function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: (
      <div className='step-icon person-icon'>
        <PersonIcon />
      </div>
    ),
    2: (
      <div className='step-icon reg-icon'>
        <PersonSearchIcon />
      </div>
    ),
    3: (
      <div className='step-icon plan-icon'>
        <ListAlt />
      </div>
    ),
    4: (
      <div className='step-icon insect-icon'>
        <SavedSearchIcon />
      </div>
    ),
    5: (
      <div className='step-icon search-icon'>
        <SavedSearchIcon />
      </div>
    ),
  };
  const classes = useColorlibStepIconStyles();

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
export function ColorlibStepIconnew(props: StepIconProps) {
  const { active, completed } = props;
  const icons: { [index: string]: React.ReactElement } = {
    1: (
      <div className='step-iconnew person-iconnew'>
        <PersonIcon style={{ color: 'white' }} />
      </div>
    ),
    2: (
      <div className='step-iconnew reg-iconnew'>
        <PersonSearchIcon />
      </div>
    ),
    3: (
      <div className='step-iconnew plan-iconnew'>
        <ListAlt />
      </div>
    ),
    4: (
      <div className='step-iconnew insect-iconnew'>
        <SavedSearchIcon />
      </div>
    ),
    5: (
      <div className='step-iconnew search-iconnew'>
        <SavedSearchIcon />
      </div>
    ),
  };
  const classes = useColorlibStepIconStylesnew();

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

export const HFFollowUps: LymphedemaLineListFollowUpsHF = {
  serviceProviderName: '',
  serviceProviderDesignation: '',
  serviceProviderPlace: '',
  serviceProviderPhone: '',
  isAnyComorbidity: false,
  comorbidityType: '',
  otherComorbidity: '',
  isSurgeryDone: false,
  dateOfSurgery: currentdate,
  nameOfSurgeon: '',
  surgeonPhone: '',
  nameOfHospitalSurgeryDoneId: 0,
  otherHospitalSurgeryDone: '',
  stageOfHydrocele: 0,
  dateOfFollowUpAfterSurgery: currentdate,
  findingsDuringSurgeryFollowUp: '',
  surgeryNotPossibleReasonsId: 0,
  dateOfDeathSurgeryNotPossible: currentdate,
  placeOfMigrationSurgeryNoPossible: '',
  reasonOthers: '',
  remarks: '',
  isActive: true,
  createdBy: 0,
  lastModifiedBy: 0,
};
export const LFFollowUps: LymphedemaLineListFollowUpsLF = {
  serviceProviderName: '',
  serviceProviderDesignation: '',
  serviceProviderPlace: '',
  serviceProviderPhone: '',
  serviceDateOfVisit: currentdate,
  isServiceMMDPTrainingGiven: false,
  serviceMMDPTrainingDate: currentdate,
  isServicePatientFollowingMM: false,
  servicePatientFollowingDate: currentdate,
  isServiceMMDPKitGiven: false,
  serviceMMDPKitGivenDate: currentdate,
  isServiceMedicineGiven: false,
  serviceMedicineGivenDate: currentdate,
  followUpLostReasonsId: 0,
  followUpLostDateOfDeath: currentdate,
  followUpLostPlaceOfMigration: '',
  isActive: true,
  createdBy: 0,
  lastModifiedBy: 0,
  reasonOthers: '',
};
export const Survey: LymphedemaLineListSurvey = {
  surveyDoneUnder: '',
  dateOfSurvey: currentdate,
  isVerified: false,
  verifiedByDoctorName: '',
  verifiedByDoctorPhone: '',
  dateOfVerification: currentdate,
  isActive: true,
  createdBy: 0,
  lastModifiedBy: 0,
};

export const LineList: LymphedemaLineList = {
  patientId: '',
  nameOfPatient: '',
  patientRegistrationDate: '',
  headOfFamily: '',
  year: '',
  month: '',
  districtId: '',
  corporationId: '',
  talukaId: '',
  zoneId: '',
  facilityId: '',
  town: '',
  subCenterId: '',
  wardId: '',
  villageId: '',
  unitOfAction: '',
  nameOfUnit: '',
  nameOfFiledUnit: '',
  area: '',
  ageYears: 0,
  ageMonths: 0,
  gender: '',
  permanentAddressLine1: '',
  permanentAddressLine2: '',
  permanentAddressCity: '',
  permanentAddressState: 14,
  permanentAddressPINCode: '',
  stayingInYears: 0,
  stayingInMonths: 0,
  isFromBirth: 'true',
  isActive: true,
  createdBy: 0,
  lastModifiedBy: 0,
  patientMobileNumber: '',
  ashaMobileNumber: '',
  secondaryContactNumber: '',
};
export const Symtoms: DiseaseSymtoms = {
  isAffectedLeftLeg: false,
  isAffectedRightLeg: false,
  isAffectedLeftHand: false,
  isAffectedRightHand: false,
  isAffectedLeftScrotum: '',
  isAffectedRightScrotum: '',
  isAffectedLeftBreast: false,
  isAffectedRightBreast: false,
  isAffectedOthers: '',
  affectedOthersNotes: '',
  diseaseType: '',
  grading: 0,
  isPresenceOfBlisters: 'false',
  diseaseLastedYears: 0,
  diseaseLastedMonths: 0,
  isActive: true,
  createdBy: 0,
  lastModifiedBy: 0,
  id: 0,
};

// export const months = [1,2,3,4,5,6,7,8,9,10,11,12];
// export const monthsText = ["JAN","FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
export const months = [
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
export const corporationNone = {
  id: 0,
  corporationName: 'None',
  districtId: 0,
  stateId: null,
  isActive: true,
  createdBy: null,
  lastModifiedBy: null,
};
export const talukaNone = {
  id: 0,
  talukaName: 'None',
  districtId: 0,
  stateId: null,
  isActive: true,
  createdBy: null,
  lastModifiedBy: null,
};
export const zoneNone = {
  id: 0,
  zoneName: 'None',
  corporationId: 0,
  districtId: null,
  stateId: null,
  isActive: true,
  createdBy: null,
  lastModifiedBy: null,
};
export const villageNone = {
  id: 0,
  villageName: 'None',
  talukaId: 0,
  districtId: null,
  stateId: null,
  isActive: true,
  createdBy: null,
  lastModifiedBy: null,
};
export const wardNone = {
  id: 0,
  wardName: 'None',
  zoneId: 0,
  corporationId: null,
  districtId: null,
  stateId: null,
  isActive: true,
  createdBy: null,
  lastModifiedBy: null,
};
const currentYear = new Date().getFullYear();
const range = (start, stop, step) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
export const years = range(currentYear, currentYear - 50, -1);

//radio button
export const str2boolean = (value) => {
  if (value && typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  } else if (value && typeof value === 'boolean') {
    if (value === true) return true;
    if (value === false) return false;
  }
  return value;
};
// checkbox
export const boolean2str = (value) => {
  if (typeof value === 'boolean') {
    if (value === true) return 'true';
    if (value === false) return 'false';
  }
  return value;
};
