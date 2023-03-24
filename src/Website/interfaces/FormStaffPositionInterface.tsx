export interface WebsiteStaffPosition{
        year: any,
        month: any,
        stateId: number,
        districtId: number ,
        typeOfUnit: any,
        nameOfUnit: any,
        cadre: number,
        cadreOther: number,
        sanctioned: any,
        filled: any,
        vacant: any,
        id:number,
        createdBy?: number,
        lastModifiedBy?: number,
       
}

export interface WebsiteStaffPositionTraining{
    id:number,
    staffPosVerticalUnitId:number,
    nameOfStaff: string,
    designationId: number,
    designationOther: string,
    createdBy?: number,
    lastModifiedBy?: number,
    staffPosVerticalUnitTrainingStatuses:[{
        staffPosVerticalUnitId:number,
        staffPosVerticalUnitStaffId:number,
        typeOfTraining: string,
        placeOfTraining: string,
        dateOfTraining:   string,
        isTrained: string,
        createdBy?: number,
        lastModifiedBy?: number,
    }]
}