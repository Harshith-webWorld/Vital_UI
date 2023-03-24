export interface MdaIdaCoverages {
    id:number,
    year:any,
    month:any,
    districtId:any;
    corporationId: any;
    talukaId: any;
    zoneId: any;
    facilityId: any;
    subCenterId: any;
    wardId: any;
    villageId: any;
    area: string;
    totalPopulation: any;
    eligiblePopulation:any;
    isActive:boolean;
    createdBy?: number;
    lastModifiedBy?: number;
}

export interface MdaIdaCoverageRegular {
    mdaIDACoverageId:number;
    regular: any;
    noOfPeopleAdministered:any;
    noOfPersonsWithFever:any;
    noOfPersonsWithHeadache:any;
    noOfPersonsWithBodyache:any;
    noOfPersonsWithNausea:any;
    noOfPersonsWithVomiting:any;
    //clinicalOutcome:any;
    noOfPersonsRecovered:any;
    noOfPersonsNotRecovered:any
    isRequiredHospitalStay:any;
    noOfPersonsRequiredHospitalStay:any;
    remarks:string;
    createdBy?: number;
    lastModifiedBy?: number;
    mdaIDACoverageOthersLists:Array<MdaIdaCoverageOthers>
}

export interface MdaIdaCoverageMopUp {
    mdaIDACoverageId:number;
    mopUp: any;
    noOfPeopleAdministered:any;
    noOfPersonsWithFever:any;
    noOfPersonsWithHeadache:any;
    noOfPersonsWithBodyache:any;
    noOfPersonsWithNausea:any;
    noOfPersonsWithVomiting:any;
    clinicalOutcome:number;
    noOfPersonsRecovered:any;
    noOfPersonsNotRecovered:any
    isRequiredHospitalStay: any;
    noOfPersonsRequiredHospitalStay:any;
    remarks:string;
    createdBy?: number;
    lastModifiedBy?: number;
    mdaIDACoverageOthersLists:Array<MdaIdaCoverageOthers>
}

export interface MdaIdaCoverageOthers {
    mdaIDACoverageId:any;
    otherAdverseExp:string;
    noOfPersonsWithOtherAdverseExp:number;
    createdBy?: number;
    lastModifiedBy?: number;
}