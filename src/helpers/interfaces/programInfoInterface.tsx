
export interface WebsiteContentProgramInfos {
    id: number,
    programInfoHeader: string,
    programInfoDescriptionShortHTML: string,
    programInfoDescriptionLongHTML: string,
    programInfoImage: string;
    createdBy: number,
    lastModifiedBy: number,
    isActive:boolean,
  }
  export interface ProgramInfoSection { 
    id?: number,
    programInfoId:number,
    displayOrder:string,
    programInfoSectionName:string,
    createdBy: number,
    lastModifiedBy: number,
    isActive:boolean,
}


export interface ProgramInfoLinks {
    id?: number,
    programInfoId:number,
    programInfoSectionId:any,
    displayOrder:string,
    linkName:string,
    linkFileName:string,
    linkFileType:string,
    createdBy: number,
    lastModifiedBy: number;
    isActive:boolean,  

}