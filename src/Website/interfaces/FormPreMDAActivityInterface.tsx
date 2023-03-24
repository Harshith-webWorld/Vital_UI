import { AnySchema } from "yup";

export interface PreMDAActivity {
    id:number,
    srNo: string,
    year:any,
    month:any,
    districtId: string,
    corporationId: string,
    talukaId: string,
    zoneId: string,
    facilityId:string,
    subCenterId: string,
    wardId: string,
    villageId: string,
    area?: string,
    totalPopulationVillage?: any,
    totalStaffSanctioned?: any,
    totalStaffsUnit?: any,
    totalManDaysRequired?: any,
    requiredDrugAdmin?:any,
    cadreOfDrugAdminId?: number,
    actualAvailableDrugAdmin?: any,
    requiredSupervisors?: any,
    cadreOfSupervisorId?: number,
    actualAvailableSupervisor?: any,
    numberTrainedForMMDP?: any,
    batchesOfTrainingOrganizedMMDP?: any,
    numberTrainedForMDAIDA?: any,
    batchesOfTrainingOrganizedMDAIDA?: any,
    isActive: boolean,
    createdBy?: number,
    lastModifiedBy?: number,
    preMDAActivityDrugAdministrators:Array<preMDAActivityDrugAdministrators>
    preMDAActivitySupervisors:Array<preMDAActivitySupervisors>

  // preMDAActivityDrugLogistics: [preMDAActivityDrug ]
}
export interface preMDAActivityDrugLogistics {
  preMDAActivityId?: any;
  nameOfTablet?: string;
  batchNumberOfTablet?: string;
  dateOfExpiryTablet?: string;
  quantityTabletRquireForMDA?: any;
  quantityTabletInStockBeforeRound?: any;
  quantityOfTabletReceivedForRound?: any;
  batchNoOfTabletReceivedForRound?: string;
  dateOfExpiryTabletReceivedForRound?: string;
  sourceFromTabletReceivedForRound?: string;
  sourceFromTabletReceivedForRoundDist?: number;
  quantityOfTabletsDestroyedDuringRound?: any;
  quantityOfBalanceTabletsInStock?: any;
  batchNumberOfTabletInStock?: string;
  dateOfExpiryTabletInStock?: string;
  quantityOfBalanceTabletsStockIn: number;
  batchNumberOfTabletStockIn: string;
  dateOfExpiryTabletStockIn: string;
  dateOfExpiryTabletDestroyed: string;
  batchNumberOfTabletDestroyed: number;
  reasonForTabletsDestroyed: string;
  isActive: boolean;
  createdBy?: number;
  lastModifiedBy?: number;
}
export interface preMDAActivityDrugLogistics{
   
    preMDAActivityId?:any,
    nameOfTablet?: string,
    batchNumberOfTablet?: string,
    dateOfExpiryTablet?: string,
    quantityTabletRquireForMDA?: any,
    quantityTabletInStockBeforeRound?: any,
    quantityOfTabletReceivedForRound?: any,
    batchNoOfTabletReceivedForRound?: string,
    dateOfExpiryTabletReceivedForRound?: string,
    sourceFromTabletReceivedForRound?: string,
    sourceFromTabletReceivedForRoundDist?: number,
    quantityOfTabletsDestroyedDuringRound?: any,
    quantityOfBalanceTabletsInStock?: any,
    batchNumberOfTabletInStock?: string,
    dateOfExpiryTabletInStock?: string,
    quantityOfBalanceTabletsStockIn: number,
    batchNumberOfTabletStockIn: string,
    dateOfExpiryTabletStockIn: string,
    dateOfExpiryTabletDestroyed: string,
    batchNumberOfTabletDestroyed: number,
    reasonForTabletsDestroyed:string,
    isActive: boolean,
    createdBy?: number,
    lastModifiedBy?: number,

}

export interface preMDAActivityDrugAdministrators {
    preMDAActivityId?:number,
    cadreOfDrugAdminId?:any,
    otherDrugAdministrator?:string,
    noOfDrugAdministrator?:any,
    isActive?: boolean,
    createdBy?: number,
    lastModifiedBy?: number,
}

export interface preMDAActivitySupervisors {
    preMDAActivityId?:number,
    cadreOfSupervisorId?:any,
    otherDrugSupervisor?:string,
    noOfSupervisor?:any,
    isActive?: boolean,
    createdBy?: number,
    lastModifiedBy?: number,
}
