export interface WebsiteUserFsuTarget {
      id:number,
      nameOfFilariaSurveyUnit:string,
      year:any,
      month:any,
      districtId:any,
      facilityId:any,
      noOfVillagesOrTowns:any,
      createdBy?: number,
      lastModifiedBy?: number,
    }
    export interface WebsiteSurveyFsuTarget
    {
      id?:number
      fsuTargetAchievementId:number,
      namesOfVillagesOrTowns:string,
      targetedPopulation:any,
      surveyedPopulation:any,
      noOfBSCollected:any,
      noOfBSExamined:any,
      noOfMFPositiveCases:any,
      createdBy?: number,
      lastModifiedBy?: number,
    }