export interface WebsiteOthersMenu {
  linkFileName: any;
  id: number;
  menuType: string;
  menuPageTitle: string;
  menuContentImageName: string;
  menuContentHTML: string;
  isActive: boolean;
  createdBy: number;
  lastModifiedBy: number;
}

export interface OtherMenuInfoSection {
  id?: number;
  otherMenuId: number;
  displayOrder: string;
  menuSectionName: string;
  createdBy: number;
  lastModifiedBy: number;
  isActive: boolean;
}

export interface OtherMenuInfoLinks {
  id?: number;
  otherMenuId: number;
  otherMenuSectionId: string;
  displayOrder: string;
  linkName: string;
  linkFileName: string;
  linkFileType: string;
  createdBy: number;
  lastModifiedBy: number;
  isActive: boolean;
}
