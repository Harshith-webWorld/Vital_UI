export default interface MappingOfOT {
  year: any;
  month: any;
  districtId: any;
  corporationId: any;
  talukaId: any;
  nameOfInstitutionOT: any;
  govtOrPrivate: string;
  privateHospitalName: string;
  noOfAvailableSurgeons: any;
  noOfAvailableAnaesthetist: any;
  mappingOfOTPhcAttachedToTheaters: any;
  isActive: boolean;
  createdBy?: number;
  lastModifiedBy?: number;
  mappingOfOTSurgeons: Array<MappingOfOTSurgeons>;
}

export interface MappingOfOTSurgeons {
  surgeonOrAnesthetist: string;
  nameOfDoctor: string;
  headquarter: string;
  headquarterOther: string;
  createdBy?: number;
  lastModifiedBy?: number;
}
