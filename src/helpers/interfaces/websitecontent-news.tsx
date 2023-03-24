export interface WebsiteContentNews {
  id?: number;
  newsHeader: string;
  newsDescriptionShortHTML: string;
  newsDescriptionLongHTML: string;
  newsImageName: string;
  newsVideoName: string;
  createdBy: number;
  lastModifiedBy: number;
  isActive: boolean;
  isShowPublic: boolean;
  isVideoContent: boolean;
  isNewsPaperCutting: boolean;
}
