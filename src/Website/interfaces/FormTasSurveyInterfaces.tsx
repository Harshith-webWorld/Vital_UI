export interface TasSurvey {
    //tasSurveyUUID: any;
    id?:any;
    year:any,
    month:any,
    stateId: any;
    districtId: string;
    corporationId: string;
    talukaId: string;
    wardId: string;
    villageId: string;
    tasId:any;
    typeOfTAS?: any;
    nameOfEU?: string;
    euId:any;
    DateOfSurvey?: string;
    nameOfSchool?: string;
    typeOfSchool?: number;
    serialNoOfSchool?: string;
    tokenNumberSB?: string;
    nameOfEA:string;
    serialNumberOfEA?: number;
    tokenNumberCB?: string;
    result?: number;
    isFamilyHistory?: string;
    familyHistoryRemarks?: string;
    isActive?:boolean;
    createdBy?: number;
    lastModifiedBy?: number;

}
export interface tasSurveyChildren{
    tasSurveyId:number;
    nameOfStudent:string;
    tockenNumber:string;
    ageYears:number;
    ageMonths:number;
    sex:number;
    result:string;
    isFamilyHistory?: string;
    familyHistoryRemarks?: string;
    isActive?:boolean;
    createdBy?: number;
    lastModifiedBy?: number;
    


}