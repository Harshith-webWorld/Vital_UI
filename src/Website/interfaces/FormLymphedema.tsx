export interface LymphedemaLineList {
  patientId?: string;
  nameOfPatient: string;
  patientRegistrationDate: string;
  headOfFamily?: string;
  year: any;
  month: any;
  unitOfAction?: any;
  nameOfUnit?: any;
  nameOfFiledUnit?: any;
  districtId: any;
  corporationId: any;
  talukaId: any;
  zoneId: any;
  facilityId: any;
  town?: string;
  subCenterId: any;
  wardId: any;
  villageId?: any;
  area?: string;
  ageYears: number;
  ageMonths: number;
  gender?: any;
  permanentAddressLine1?: string;
  permanentAddressLine2?: string;
  permanentAddressCity: any;
  permanentAddressState?: number;
  permanentAddressPINCode?: string;
  stayingInYears: number;
  stayingInMonths: number;
  isFromBirth:string;
  isActive?: boolean;
  createdBy?: number;
  lastModifiedBy?: number;
  patientMobileNumber?: string;
  ashaMobileNumber?: string;
  secondaryContactNumber?: string;
  // LymphedemaLineListSurveys: [LymphedemaLineListSurvey]
  // LymphedemaLineListFollowUpsHFs: [LymphedemaLineListFollowUpsHF]
  // LymphedemaLineListFollowUpsLFs: [LymphedemaLineListFollowUpsLF]
}
export interface DiseaseSymtoms {
  id: number;
  isAffectedLeftLeg?: boolean;
  isAffectedRightLeg?: boolean;
  isAffectedLeftHand?: boolean;
  isAffectedRightHand?: boolean;
  isAffectedLeftScrotum?: string;
  isAffectedRightScrotum?: string;
  isAffectedLeftBreast?: boolean;
  isAffectedRightBreast?: boolean;
  isAffectedOthers?: string;
  affectedOthersNotes?: string;
  diseaseType?: string;
  grading?: number;
  isPresenceOfBlisters?: string;
  diseaseLastedYears?: number;
  diseaseLastedMonths?: number;
  isActive?: boolean;
  createdBy?: number;
  lastModifiedBy?: number;
}
export interface LymphedemaLineListSurvey {
  lymphedemaLineListId?: number;
  srNo?: number;
  surveyDoneUnder?: any;
  dateOfSurvey?: string;
  isVerified?: boolean;
  verifiedByDoctorName?: string;
  verifiedByDoctorPhone?: string;
  dateOfVerification?: string;
  isActive?: boolean;
  createdBy?: number;
  lastModifiedBy?: number;
  Actions?: string;
}
export interface LymphedemaLineListFollowUpsHF {
  srNo?: string;
  lymphedemaLineListId?: bigint;
  lymphedemaLineListSurveyId?: bigint;
  serviceProviderName: string;
  serviceProviderDesignation: string;
  serviceProviderPlace: string;
  serviceProviderPhone: string;
  isAnyComorbidity: boolean;
  comorbidityType: string;
  otherComorbidity: string;
  isSurgeryDone: boolean;
  dateOfSurgery: string;
  nameOfSurgeon: string;
  surgeonPhone: string;
  nameOfHospitalSurgeryDoneId: number;
  otherHospitalSurgeryDone: string;
  stageOfHydrocele: number;
  surgeryNotPossibleReasonsId: number;
  dateOfDeathSurgeryNotPossible: string;
  placeOfMigrationSurgeryNoPossible: string;
  //remark will be 2 times
  dateOfFollowUpAfterSurgery: string;
  findingsDuringSurgeryFollowUp: string;
  remarks: string;
  isActive: boolean;
  createdBy?: number;
  lastModifiedBy?: number;
  reasonOthers: string;
}
export interface LymphedemaLineListFollowUpsLF {
  lymphedemaLineListId?: bigint;
  srNo?: string;
  lymphedemaLineListSurveyId?: bigint;
  serviceProviderName: string;
  serviceProviderDesignation: string;
  serviceProviderPlace: string;
  serviceProviderPhone: string;
  serviceDateOfVisit: string;
  isServiceMMDPTrainingGiven: boolean;
  serviceMMDPTrainingDate: string;
  isServicePatientFollowingMM: boolean;
  servicePatientFollowingDate: string;
  isServiceMMDPKitGiven: boolean;
  serviceMMDPKitGivenDate: string;
  isServiceMedicineGiven: boolean;
  serviceMedicineGivenDate: string;
  followUpLostReasonsId: number;
  followUpLostDateOfDeath: string;
  followUpLostPlaceOfMigration: string;
  isActive: boolean;
  createdBy: number;
  lastModifiedBy: number;
  reasonOthers: string;
}
