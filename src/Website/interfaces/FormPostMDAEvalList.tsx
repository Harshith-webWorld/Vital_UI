export interface postMDAEvalList {
  id?: string;
  year:any;
  month:any;
  stateId: any;
  districtId: any;
  corporationId: string;
  talukaId: string;
  facilityId: string;
  subCenterId: string;
  wardId: string;
  villageId: string;
  urbanArea: string;
  nameOfInvestigator: string;
  dateOfInvestigation: string;
  nameOfHeadOfFamily: string;
  nameOfPersonInterviewed: string;
  totalMembersInFamily?: any;
  noMembersInterviewed?: any;
  mdaUndertakenOnFrom?: string;
  mdaUndertakenOnTo?: string;
  isDECTabletsRecovered?: string;
  noDECTabletsRecovered?: any;
  resonNotTakingDrug?: string;
  isDrugAdministeredInHouse: string;
  isDDEnsureSwallowInPresence?: string;
  isDrugSwallowInDDPresence?: string;
  reasonForNotSwallowDrug?: string;
  reasonForNotSwallowDrugOther?: string;
  isDDPersuadeSwallowDrug?: string;
  isHelpedDDInDrugCompliance?: string;
  isReservationAboutDD?: string;
  reservationDrugAdmin?: string;
  reservationDrugAdminOther?: string;
  speciFyResponsibilityOfDD?: string;
  isDDExplainToYouDetails?: string;
  approachShouldFollow?: any;
  resonToFollowApproach?: string;
  isPriorInfoAboutMDAwithDE?: string;
  sourceOfInformation?: string;
  isReadOrSeeAnyInfo?: string;
  whereReadOrSeeInfo?: string;
  whereReadOrSeeInfoOthers?: string;
  whichIsMostEffective?: string;
  isYouExperienceSideEffects?: string;
  detailsOfSideEffects?: string;
  noMembersExperienceSideEffects?: any;
  isYouSeekRemedy?: string;
  detailsOfRemedyTaken?: string;
  detailsOfRemedyTakenOther?: string;
  detailsOfSideEffectsOther?: string;
  IsYouReceiveTreatmentOtherAilment?: string;
  IsAnyFamilySufferLF?: string;
  OtherRelevantInfoOnMDA?: string;
  DateOfEvaluation?: string;
  IsVerifiedByInvestigator?: string;
  // Remarks?: string;
  isActive: boolean;
  createdBy?: number;
  lastModifiedBy?: number;
  postMDAEvalListFMembers: Array<postMDAEvalListFamilyMember>;
  postMDAEvalListPersons: Array<postMDAEvalListPerson>;
}
export interface postMDAEvalListFamilyMember {
  // postMDAThirdPartyEvalListId:number;
  id?: number;
  nameOfPatient?: string;
  sex?: number;
  ageYears?: number;
  ageMonths?: number;
  elephantitisOrHydrocele?: string;
  isActive?: boolean;
  createdBy?: number;
  lastModifiedBy?: number;
}
export interface postMDAEvalListPerson {
  // postMDAThirdPartyEvalListId: number;
  id?: number;
  namePersonsEligibleForMDA?: string;
  ageYears?: number;
  ageMonths?: number;
  sex?: number;
  noOfDECTabletsConsumed?: any;
  noOfDECTabletsRecovered?: any;
  isActive?: boolean;
  createdBy?: number;
  lastModifiedBy?: number;
}

export interface mfPositiveInterface {
  id?: number;
  districtId: number;
  corporationId: number;
  talukaId: number;
  facilityId: number;
  subCenterId: number;
  villageId: number;
  zoneId: number;
  town: string;
  area: string;
  villagepopulation: number;
  areahouse: number;
  unitAction: number;
  antigenTest: number;
  fieldUnit: number;
  populationUnit: number;
  nbs: number;
  random: number;
  createdBy?: number;
  lastModifiedBy?: number;
  mfPositiveLineListSurveys: Array<positiveSurveyData>;
  mfPositiveLineListPatients: Array<positivePatients>;
  mfPositiveLineListBSFollowUps: Array<positiveFollowup>;
}

export interface positiveSurveyData {}
export interface positivePatients {
  bsNumber: number;
  patientName: string;
  headFamily: string;
  age: number;
  gender: string;
  patientPhNo: number;
  collectionDate: string;
  examinationDate: string;
  eueaName: string;
  schoolName: string;
  migrHistory: string;
  villageName: string;
  districtName: string;
  ageFromYear: number;
  ageFromMonth: number;
  ageFromDay: number;
  mfCount: number;
  treatment: string;
  tabletName: string;
  treatmentDate: string;
  reason: string;
  otherReasons: string;
  drugAdminName: string;
  designation: string;
  adminPhNo: string;
  createdBy?: number;
  lastModifiedBy?: number;
}
export interface positiveFollowup {
  patientList: number;
  followupYear: number;
  followupDate: string;
  result: string;
  tabletsCount: number;
  consumedTabletsCount: number;
  drugAdminName: string;
  designation: string;
  adminPhNo: number;
  createdBy?: number;
  lastModifiedBy?: number;
}
