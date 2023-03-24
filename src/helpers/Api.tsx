const WEBSITE_NEWS_LIST = '/websitecontent-news/list';
const WEBSITE_IMAGES_LIST = '/websitecontent-images/list';
const WEBSITE_VIDEOS_LIST = '/websitecontent-videos/list';
const WEBSITE_VIDEOS_CREATE = '/websitecontent-videos/create';
const WEBSITE_VIDEOS_UPDATE = '/websitecontent-videos/update';
const WEBSITE_VIDEOS_DELETE = '/websitecontent-videos/delete';
const WEBSITE_VIDEOS_GETONE = '/websitecontent-videos/getone';
const WEBSITE_FAQS_LIST = '/websitecontent-faq/list';
const WEBSITE_FAQS_CREATE = '/websitecontent-faq/create';
const WEBSITE_FAQS_UPDATE = '/websitecontent-faq/update';
const WEBSITE_FAQS_DELETE = '/websitecontent-faq/delete';
const WEBSITE_FAQS_GETONE = '/websitecontent-faq/getone';
const WEBSITE_CONTENT_LIST = '/websitecontent/list';
const IMAGES_READMORE = '/websitecontent-images/getone';
const BLOGS_READMORE = '/websitecontent-programinfos/getone-programInfo';
const VIDEOS_READMORE = '/websitecontent-videos/getone';
const NEWS_READMORE = '/websitecontent-news/getone';
const FORGET_PASSWORD = '/auth/forgotPassword';
const VERIFY_OTP = '/auth/verifyOtp';
const RESET_PASSWORD = '/auth/resetPassword';
const UPDATE_PASSWORD = '/auth/updatePassword';
const ADMIN_NEWS_GETLIST = '/websitecontent-news/list';
const ADMIN_NEWS_GETONE = '/websitecontent-news/getone';
const ADMIN_NEWS_POSTLIST = '/websitecontent-news/create';
const ADMIN_NEWS_UPDATE = '/websitecontent-news/update';
const ADMIN_NEWS_DELETE = '/websitecontent-news/delete';
const ADMIN_IMAGE_GETONE = '/websitecontent-images/getone';
const ADMIN_IMAGE_POSTLIST = '/websitecontent-images/create';
const ADMIN_IMAGE_UPDATE = '/websitecontent-images/update';
const ADMIN_IMAGE_DELETE = '/websitecontent-images/delete';
const ADMIN_MENUS_GETLIST = '/websitecontent-others/listMenu';
const ADMIN_MENUS_GETONE = '/websitecontent-others/getoneMenu';
const ADMIN_MENUS_POST = '/websitecontent-others/createMenu';
const ADMIN_MENUS_UPDATE = '/websitecontent-others/updateMenu';
const ADMIN_MENUS_DELETE = '/websitecontent-others/deleteMenu';
const ADMIN_SETTINGS_GETLIST = '/sitesettings/list';
const ADMIN_SETTINGS_GETONE = '/sitesettings/getOne';
const ADMIN_SETTINGS_POST = '/sitesettings/create';
const ADMIN_SETTINGS_UPDATE = '/sitesettings/update';
const ADMIN_SETTINGS_DELETE = '/sitesettings/delete';
const ADMIN_MENUS_SECTION_GETLIST = '/websitecontent-others/listOthersSections';
const ADMIN_MENUS_SECTION_GETONE =
  '/websitecontent-others/getone-OthersSection';
const ADMIN_MENUS_SECTION_POST = '/websitecontent-others/create-OthersSection';
const ADMIN_MENUS_SECTION_UPDATE =
  '/websitecontent-others/update-OthersSection';
const ADMIN_MENUS_SECTION_DELETE =
  '/websitecontent-others/delete-OthersSection';
const ADMIN_MENUS_LINK_GETLIST = '/websitecontent-others/listOthersLinks';
const ADMIN_MENUS_LINK_GETONE = '/websitecontent-others/getone-OthersLink';
const ADMIN_MENUS_LINK_POST = '/websitecontent-others/create-OthersLink';
const ADMIN_MENUS_LINK_UPDATE = '/websitecontent-others/update-OthersLink';
const ADMIN_MENUS_LINK_DELETE = '/websitecontent-others/delete-OthersLink';
const ADMIN_ZONE_DISTRICT_CREATE_OR_UPDATE = '/district/create';
const ADMIN_ZONE_FACILITY_GET_ONLY_ONE = '/facilities/getone';
const ADMIN_ZONE_FACILITY_CREATE_OR_UPDATE = '/facilities/create';
const ADMIN_ZONE_VERTICALCONTROLUNIT_GET_ONLY_ONE =
  '/verticalControl/getoneVerticalControlUnits';
const ADMIN_ZONE_VERTICALCONTROLUNIT_CREATE_OR_UPDATE =
  '/verticalControl/createverticalControlUnits';

const WEBSITE_DROPDOWN_LIST_STATE = '/state/list';
const WEBSITE_DROPDOWN_GETONE_STATE = 'state/getOne';
const WEBSITE_DROPDOWN_LIST_DISTRICT = '/district/list';
const WEBSITE_DROPDOWN_GET_DISTRICT_BY_VCU = '/getDistrictByVerticalControlUnit/getOne';
const WEBSITE_DROPDOWN_GET_DISTRICT_BY_FSU = '/getDistrictByVerticalControlUnit/fsu';
const WEBSITE_DROPDOWN_LIST_CORPORATION = '/corporation/list';
const WEBSITE_DROPDOWN_LIST_TALUKA = '/taluka/list';
const WEBSITE_DROPDOWN_LIST_FACILITY = '/facilities/list';
const WEBSITE_DROPDOWN_LIST_SUBCENTER = '/subcenters/list';
const WEBSITE_DROPDOWN_LIST_WARD = '/ward/list';
const WEBSITE_DROPDOWN_LIST_VILLAGE = '/village/list';
const WEBSITE_DROPDOWN_LIST_DISTRICT_GETONE = '/district/get';
const WEBSITE_DROPDOWN_LIST_CORPORATION_GETONE = '/corporation/get';
const WEBSITE_DROPDOWN_LIST_TALUKA_GETONE = '/taluka/get';
const WEBSITE_DROPDOWN_LIST_FACILITY_GETONE = '/facilities/get';
const FACILITY_LIST = '/facilities/filter';
const WEBSITE_DROPDOWN_LIST_SUBCENTER_GETONE = '/subcenters/get';
const WEBSITE_DROPDOWN_LIST_WARD_GETONE = '/ward/get';
const WEBSITE_DROPDOWN_LIST_VILLAGE_GETONE = '/village/get';
const WEBSITE_DROPDOWN_LIST_VILLAGE_GETBYDISTRICT = '/village/getbydistrict';
const WEBSITE_DROPDOWN_LIST_VILLAGE_GETONEBYTALUKAID = '/village/getByTalukaId';
const WEBSITE_DROPDOWN_LIST_VILLAGE_GETONEBYSUBCENTERID =
  '/village/getBySubCenterId';
const WEBSITE_DROPDOWN_LIST_ZONE_GETONE = '/zone/get';
const WEBSITE_DROPDOWN_ZONE = '/zone/list';
const WEBSITE_DROPDOWN_UNITACTION = '/udCategoryOptions/list';
const WEBSITE_DROPDOWN_LIST_ZONE = '/zone/list';
const WEBSITE_DROPDOWN_LIST_DESIGNATION = '/designations/list';
const VERTICAL_CONTROL_UNIT_LIST = '/verticalControl/listVerticalControlUnits';
const VERTICAL_CONTROL_FIELD_UNIT_LIST =
  '/verticalControl/listVerticalControlFieldUnits';

const TASSURVEY_ADD = '/tassurvey/create';
const TASSURVEY_LIST = '/tassurvey/list';
const TASSURVEY_UPDATE = '/tassurvey/update';
const TASSURVEY_DELETE = '/tassurvey/delete';
const TASSURVEY_GETONE = '/tassurvey/getone';
const TASSURVEYCHILDREN_ADD = '/tassurvey/createTasSurveyChildrens';
const TASSURVEYCHILDREN_LIST = '/tassurvey/listTasSurveyChildrens';
const TASSURVEYCHILDREN_UPDATE = '/tassurvey/updateTasSurveyChildrens';
const TASSURVEYCHILDREN_GETONE = '/tassurvey/getoneTasSurveyChildrens';
const TASSURVEYCHILDREN_DELETE = '/tassurvey/deleteTasSurveyChildrens';
const TASSURVEY_CREATEALL = '/tassurvey/createAllTasSurvey';

const VERTICAL_STOCK_POSITION_CREATE = '/verticalUnit/create';
const VERTICAL_STOCK_POSITION_LIST = '/verticalUnit/list';
const VERTICAL_STOCK_POSITION_GETONE = '/verticalUnit/getone';
const VERTICAL_STOCK_POSITION_UPDATE = '/verticalUnit/update';
const VERTICAL_STOCK_POSITION_DELETE = '/verticalUnit/delete';
const MDAActivityCreate = '/mdaActivity/create';
const MDAActivityList = '/mdaActivity/list';
const MDAActivityEdit = '/mdaActivity/update';
const MDAActivityDelete = '/mdaActivity/delete';
const MDAActivityGetOne = '/mdaActivity/getone';
const ENTOMOLOGICALLARVICIDAL_GET = '/entomologicalLarvical/list';
const ENTOMOLOGICALLARVICIDAL_GETONE = '/entomologicalLarvical/getone';
const ENTOMOLOGICALLARVICIDAL_POST = '/entomologicalLarvical/create';
const ENTOMOLOGICALLARVICIDAL_UPDATE = '/entomologicalLarvical/update';
const ENTOMOLOGICALLARVICIDAL_DELETE = '/entomologicalLarvical/delete';
const ENTOMOLOGICALLARVICIDAL_FIELD_ARRAY_DELETE =
  '/entomologicalLarvical/deleteCounts';

const PREMDAACTIVITY_CREATE = '/preMDAActivity/createPreMDAActivities';
const PREMDAACTIVITY_LIST = '/preMDAActivity/listPreMDAActivities';
const PREMDAACTIVITY_UPDATE = '/preMDAActivity/updatePreMDAActivities';
const PREMDAACTIVITY_DELETE = '/preMDAActivity/deletePreMDAActivities';
const PREMDAACTIVITYDRUGADMINISTRATORS_DELETE =
  '/preMDAActivity/deletePreMDAActivityDrugAdministrators';
const PREMDAACTIVITYSUPERVISORS_DELETE =
  '/preMDAActivity/deletePreMDAActivitySupervisors';
const PREMDAACTIVITY_GETONE = '/preMDAActivity/getonePreMDAActivities';
const PREMDAACTIVITYDRUGLOGISTICS_CREATE =
  '/preMDAActivity/createPreMDAActivityDrugLogistics';
const PREMDAACTIVITYDRUGLOGISTICS_LIST =
  '/preMDAActivity/listPreMDAActivityDrugLogistics';
const PREMDAACTIVITYDRUGLOGISTICS_UPDATE =
  '/preMDAActivity/updatePreMDAActivityDrugLogistics';
const PREMDAACTIVITYDRUGLOGISTICS_DELETE =
  '/preMDAActivity/deletePreMDAActivityDrugLogistics';
const PREMDAACTIVITYDRUGLOGISTICS_GETONE =
  '/preMDAActivity/getonePreMDAActivityDrugLogistics';
const PREMDAACTIVITY_CREATEALL = '/preMDAActivity/createAllPreMDAActivities';
const MAPPING_OF_OT_CREATE = '/mappingOfOT/create';
const MAPPING_OF_OT_DELETE = '/mappingOfOT/delete';
const SURGEON_MAPPING_OF_OT_DELETE = '/mappingOfOT/deletesurgeon';
const MAPPING_OF_OT_EDIT = '/mappingOfOT/update';
const MAPPING_OF_OT_GETONE = '/mappingOfOT/getone';
const MAPPING_OF_OT_LIST = '/mappingOfOT/list';

const FSU_TARGET_STEPPER_ONE = '/fsuTarget/createFsuTargetAchivements';
const FSU_TARGET_LIST_STEPPER_ONE = '/fsuTarget/listFsuTargetAchivements';
const FSU_TARGET_UPDATE_STEPPER_ONE = '/fsuTarget/updateFsuTargetAchivements';
const FSU_TARGET_DELETE_STEPPER_ONE = '/fsuTarget/deleteFsuTargetAchivements';

const FSU_TARGET_STEPPER_TWO = '/fsuTarget/createFsuTargetAchievementsSurveys';
const FSU_TARGET_LIST_STEPPER_TWO =
  '/fsuTarget/listFsuTargetAchievementsSurveys';
const FSU_TARGET_UPDATE_STEPPER_TWO =
  '/fsuTarget/updateFsuTargetAchievementsSurveys';
const FSU_TARGET_DELETE_STEPPER_TWO =
  '/fsuTarget/deleteFsuTargetAchievementsSurveys';

const GET_MDA_EVALLIST = '/PostMDAEvalList/list';
const POST_MDA_EVALLIST = '/PostMDAEvalList/create';
const EDIT_MDA_EVALLIST = '/PostMDAEvalList/update';
const GET_ONE_EVALLIST = '/PostMDAEvalList/getone';
const DELETE_MDA_EVALLIST = '/PostMDAEvalList/delete';
const DELETE_MDA_FAMILYMEMBER = '/PostMDAEvalList/deleteEvalListFmembers';
const DELETE_MDA_PERSON = '/PostMDAEvalList/deleteEvalListPersons';
const LYMPHEDEMA_CREATE = '/lymphedemaLineList/create';
const LYMPHEDEMA_LIST = '/lymphedemaLineList/list';
const LYMPHEDEMA_UPDATE = '/lymphedemaLineList/update';
const LYMPHEDEMA_DELETE = '/lymphedemaLineList/delete';
const LYMPHEDEMA_GETONE = '/lymphedemaLineList/getone';
const STAFF_POSITION = '/staffPosVerticalUnits/createStaffPosVerticalUnits';
const STAFF_POSITION_CREATEALL = '/staffPosVerticalUnits/createStaffPosVerticalUnits';
const STAFF_POSITION_LIST = '/staffPosVerticalUnits/listStaffPosVerticalUnits';
const STAFF_POSITION_UPDATE =
  '/staffPosVerticalUnits/updateStaffPosVerticalUnits';
const STAFF_POSITION_DELETE =
  '/staffPosVerticalUnits/deleteStaffPosVerticalUnits';
const STAFF_POSITION_TRAINING =
  '/staffPosVerticalUnits/createStaffPosVerticalTraining';
const STAFF_POSITION_TRAINING_LIST =
  '/staffPosVerticalUnits/listStaffPosVerticalTraining';
const STAFF_POSITION_TRAINING_UPDATE =
  '/staffPosVerticalUnits/updateStaffPosVerticalTraining';
const STAFF_POSITION_TRAINING_DELETE =
  '/staffPosVerticalUnits/deleteStaffPosVerticalTraining';

const LYMPHEDEMA_POST_PATIENT_INFORMATION =
  '/lymphedemaLineList/savePatientInformation';
const LYMPHEDEMA_UPDATE_PATIENT_INFORMATION =
  '/lymphedemaLineList/updatePatientInformation';
const LYMPHEDEMA_POST_SURVEY = '/lymphedemaLineList/saveSurvey';
const GET_SURVEY_LIST = '/lymphedemaLineList/getSurveyList';
const LYMPHEDEMA_POST_LF_FOLLOWUP = '/lymphedemaLineList/saveLfFollowup';
const GET_LF_FOLLOWUPS_LIST = '/lymphedemaLineList/getLFFollowups';
const LYMPHEDEMA_POST_HF_FOLLOWUP = '/lymphedemaLineList/saveHFFollowup';
const GET_HF_FOLLOWUPS_LIST = '/lymphedemaLineList/getHFFollowups';
const GET_LYMPHEDEMA_PATIENT_INFO = '/lymphedemaLineList/getPatientInfo';
const DELETE_HF_FOLLOWUP = '/lymphedemaLineList/deleteHFFollowup';
const DELETE_LF_FOLLOWUP = '/lymphedemaLineList/deleteLFFollowup';
const DELETE_SURVEY = '/lymphedemaLineList/deleteSurvey';

const MDA_IDA_COVERAGES_CREATE = '/mdaIdaCoverageReport/createMDACoverage';
const MDA_IDA_COVERAGES_CREATE_ALL =
  '/mdaIdaCoverageReport/createAllMDACoverage';
const MDA_IDA_COVERAGE_REGULAR_CREATE =
  '/mdaIdaCoverageReport/createMdaIDACoverageRegularList';
const MDA_IDA_COVERAGE_MOPUP_CREATE =
  '/mdaIdaCoverageReport/createMdaIDACoverageMopUpList';

const MDA_IDA_COVERAGES_LIST = '/mdaIdaCoverageReport/getAllMdaIDACoverageList';
const MDA_IDA_COVERAGE_REGULAR_LIST =
  '/mdaIdaCoverageReport/getAllMdaIDACoverageRegularLists';
const MDA_IDA_COVERAGE_MOPUP_LIST =
  '/mdaIdaCoverageReport/getAllMdaIDACoverageMopUpLists';

const MDA_IDA_COVERAGES_GETONE = '/mdaIdaCoverageReport/getOneMDACoverage';
const MDA_IDA_COVERAGE_REGULAR_GETONE =
  '/mdaIdaCoverageReport/getOneMdaIDACoverageRegularList';
const MDA_IDA_COVERAGE_MOPUP_GETONE =
  '/mdaIdaCoverageReport/getOneMdaIDACoverageMopUpList';

const MDA_IDA_COVERAGES_UPDATE = '/mdaIdaCoverageReport/updateMDACoverage';
const MDA_IDA_COVERAGE_REGULAR_UPDATE =
  '/mdaIdaCoverageReport/updateMdaIDACoverageRegularList';
const MDA_IDA_COVERAGE_MOPUP_UPDATE =
  '/mdaIdaCoverageReport/updateMdaIDACoverageMopUpList';

const MDA_IDA_COVERAGES_DELETE = '/mdaIdaCoverageReport/getMDACoverage';
const MDA_IDA_COVERAGE_REGULAR_DELETE =
  '/mdaIdaCoverageReport/deleteMdaIDACoverageRegularList';
const MDA_IDA_COVERAGE_MOPUP_DELETE =
  '/mdaIdaCoverageReport/deleteMdaIDACoverageMopUpList';

const MFPOSITIVE_LIST = '/mfPositive/listMfPositiveLineList';
const MFPOSITIVE_CREATE = '/mfPositive/createMfPositiveLineList';
const MFPOSITIVE_CREATE_ALL = '/mfPositive/createAllMfPositiveLineList';
const MFPOSITIVE_UPDATE = '/mfPositive/updateMfPositiveLineList';
const MFPOSITIVE_DELETE = '/mfPositive/deleteMfPositiveLineList';
const MFPOSITIVE_SURVEY_LIST = '/mfPositive/listMfPositiveLineListSurvey';
const MFPOSITIVE_SURVEY_CREATE = '/mfPositive/createMfPositiveLineListSurvey';
const MFPOSITIVE_SURVEY_UPDATE = '/mfPositive/updateMfPositiveLineListSurvey';
const MFPOSITIVE_SURVEY_DELETE = '/mfPositive/deleteMfPositiveLineListSurvey';
const MFPOSITIVE_PATIENT_LIST =
  '/mfPositive/getAlllistMfPositiveLineListPatients';
const MFPOSITIVE_PATIENT_CREATE =
  '/mfPositive/createMfPositiveLineListPatients';
const MFPOSITIVE_PATIENT_UPDATE =
  '/mfPositive/updateMfPositiveLineListPatients';
const MFPOSITIVE_PATIENT_DELETE =
  '/mfPositive/deleteMfPositiveLineListPatients';
const MFPOSITIVE_BSFollowUps_LIST =
  '/mfPositive/getAlllistMfPositiveLineListBSFollowUps';
const MFPOSITIVE_BSFollowUps_CREATE =
  '/mfPositive/createMfPositiveLineListBSFOllowUps';
const MFPOSITIVE_BSFollowUps_UPDATE =
  '/mfPositive/updateMfPositiveLineListBSFOllowUps';
const MFPOSITIVE_BSFollowUps_DELETE =
  '/mfPositive/deleteMfPositiveLineListBSFOllowUps';

const HYDROCELECTOMY_OPERATIONS_CREATE = '/hydrocelectomyOperations/create';
const HYDROCELECTOMY_OPERATIONS_BULKCREATE = '/hydrocelectomyOperations/bulkCreate';
const HYDROCELECTOMY_OPERATIONS_UPDATE = '/hydrocelectomyOperations/update';
const HYDROCELECTOMY_OPERATIONS_DELETE = '/hydrocelectomyOperations/delete';
const HYDROCELECTOMY_OPERATIONS_GETONE = '/hydrocelectomyOperations/getone';
const HYDROCELECTOMY_OPERATIONS_LIST = '/hydrocelectomyOperations/list';

const DESIGNATION_LIST = '/designations/list';
const ACTIVIITY_LIST = '/activities/list';
const SCREEN_LIST = '/screens/list';
const ROLE_LIST = '/role/list';
const INSTITUTIONTYPE_LIST = '/institutiontypes/list';
const USERS_CREATE = '/users/create';
const USERS_LIST = '/users/list';
const USERS_DELETE = '/users/delete';
const USERS_GETONE = '/users/getone';
const USERS_UPDATE = '/users/update';
const GET_USER_ROLE_SCREEN_ACTIVITIES = '/userRoleScreenActivities/getuser';
const NAME_UNIT_FILED = '/verticalControl/listVerticalControlFieldUnits';
const WEBSITE_PROGRAMINFOSECTION_CREATE =
  '/websitecontent-programinfos/create-programInfoSection';
const WEBSITE_PROGRAMINFOLINKS_CREATE =
  '/websitecontent-programinfos/create-programInfoLink';
const WEBSITE_PROGRAMINFOSECTION_GETONE =
  '/websitecontent-programinfos/getone-programInfoSection';
const WEBSITE_PROGRAMINFOSECTION_GET =
  '/websitecontent-programinfos/listProgramInfoSections';
const WEBSITE_PROGRAMINFOSECTIONLINK_GETAll =
  '/websitecontent-programinfos/listProgramInfoLinks';
const WEBSITE_PROGRAMINFOSECTIONLINK_GETONE =
  '/websitecontent-programinfos/getone-programInfoLink';
const WEBSITE_PROGRAMINFOSECTION_DELETE =
  '/websitecontent-programinfos/delete-programInfoSection';
const WEBSITE_PROGRAMINFOSECTIONLINK_DELETE =
  '/websitecontent-programinfos/delete-programInfoLink';
const WEBSITE_PROGRAMINFOS_CREATE =
  '/websitecontent-programinfos/create-programInfo';
const WEBSITE_PROGRAMINFOS_UPDATE =
  '/websitecontent-programinfos/update-programInfo';
const WEBSITE_PROGRAMINFOS_DELETE =
  '/websitecontent-programinfos/delete-programInfo';
const WEBSITE_PROGRAMINFOS_LIST =
  '/websitecontent-programinfos/listProgramInfos';
const WEBSITE_PROGRAMINFOS_GETONE =
  '/websitecontent-programinfos/getone-programInfo';

const REPORT_GET_LF_ANALYSIS1 = '/LFReport/get_LF_Analysis1';
const REPORT_GET_LF_ANALYSIS2 = '/LFReport/get_LF_Analysis2';
const REPORT_GET_LF_ANALYSIS3 = '/LFReport/get_LF_Analysis3List';
const REPORT_GET_LF_DIESEASECASES = '/LFReport/get_LF_DieseaseCasesList';
const REPORT_GET_LF_HYDROCELE_OP_LINE_LIST =
  '/LFReport/get_LF_HydroceleOPLineList';
const REPORT_GET_LF_PENDING_HYDROCELE_CASES =
  '/LFReport/get_LF_PendingHydroceleCases';
const REPORT_GET_GRADING_OF_LF_PATIENTS =
  '/LFReport/get_GradingOfLFPatients'
const REPORT_GET_PATIENT_INELIGIBLE_FOR_SURGERY =
  '/LFReport/get_LF_Patientsineligibleforsurgery';
const REPORT_GET_ADDITIONAL_MF_SURVEY_REPORT_LIST =
  '/MFReport/get_AdditionalMFSurveyReportList';
const REPORT_GET_PROPOSAL_FOR_WITHDRAWAL_REPORT_LIST =
  '/MDAReport/ProposalWithdrawalOfMDA';
const REPORT_GET_MF_BASE_LINE_SURVEY_LIST =
  '/MFReport/get_MFBaseLineSurveyList';
  const REPORT_GET_HYDROCELECTOMY_OPERATIONS =
  '/hydrocelectomyOperationsReport/getHydroceleOperationsReport';
  const REPORT_GET_MMDP_KITS_GIVEN =
  '/mmdpKitsReport/getMMDPKitsReport';
const REPORT_GET_PERFORMANCE_OF_SURGEONS = '/LFReport/LF_PerformanceOfSurgeons';
const REPORT_GET_PERFORMANCE_OF_INSTITUTES =
  '/LFReport/LF_PerformanceOfInstitutes';
const REPORT_LF_MMDP_ACTIVITY_REPORT = '/LFReport/get_LF_MMDPActivityReporting';
const REPORT_GET_FSU_ANALYSIS1 = '/FSUReport/get_FSUAnalysis1';
const REPORT_GET_FSU_ANALYSIS2 = '/FSUReport/get_FSUAnalysis2';
const REPORT_GET_FSU_ANALYSIS3 = '/FSUReport/get_FSUAnalysis3';
const REPORT_GET_FSU_ANALYSIS4 = '/FSUReport/get_FSUAnalysis4';
const REPORT_GET_FSU_ANALYSIS5 = '/FSUReport/get_FSUAnalysis5';
const REPORT_GET_FCU_ANALYSIS_ONE = '/FCUReport/get_FCUAnalysis1';
const REPORT_GET_FCU_ANALYSIS_TWO = '/FCUReport/get_FCUAnalysis2';
const REPORT_GET_FCU_ANALYSIS_FOUR = '/FCUReport/get_FCUAnalysis4';
const REPORT_GET_FCU_ANALYSIS_FIVE = '/FCUReport/get_FCUAnalysis5';
const REPORT_GET_FCU_ANALYSIS_SIX = '/FCUReport/get_FCUAnalysis6';
const REPORT_GET_TAS_REPORT1 = '/TASReport/get_TASReport1';
const REPORT_GET_TAS_REPORT2 = '/TASReport/get_TASReport2';
const REPORT_GET_MDA_TRAINING_STATUS1 = '/MDAReport/get_MDATrainingStatus1';
const REPORT_GET_MDA_COVERAGEREPORT1 = '/MDAReport/coverageReport1';
const REPORT_GET_MDA_INFRASTRUCTURE = '/MDAReport/infrastructure';
const REPORT_GET_MDA_POSTMDA_EVALUATION1 =
  '/MDAReport/analysis1_postMDAEvaluation';
const REPORT_GET_MDA_POSTMDA_EVALUATION2 =
  '/MDAReport/analysis2_postMDAEvaluation';
const REPORT_GET_MDA_COORDINATION_COMMITTE_REPORT =
  '/MDAReport/get_Co_ordinationCommitteReport';
const REPORT_GET_SAE_REPORT = '/SAEReport/saereport';
const REPORT_GET_ENTOMOLOGY_LARVICIDAL_REPORT1 =
  '/EntomologyReport/LarvicidalReport1';
const REPORT_GET_ENTOMOLOGY_NFCU_REPORT1 =
  '/EntomologyReport/NFCUReportEntomology1';
const REPORT_GET_VERTICAL_ANALYSIS_REPORT =
  '/VerticalStockReport/VerticalStockAnalysis';
const REPORT_GET_ADDITIONAL_ENTOMOLOGICAL_REPORT =
  '/EntomologyReport/AdditionalEntomologicalReport';
const REPORT_GET_BASE_LINE_ENTOMOLOGICAL_REPORT =
  '/EntomologyReport/BaselineEntomoligicalReport';
const REPORT_GET_NFCU_MOSQUITO_DISECTION_REPORT =
  '/EntomologyReport/NFCUMosquitoDisectionReport';
const REPORT_GET_LARVAL_DENSITY_REPORT =
  '/EntomologyReport/LarvalDensityReport';
const REPORT_GET_FCU_ANALYSIS_TEN = '/FCUReport/get_FCUAnalysis10';
const REPORT_GET_DRUG_REQUIREMENT_MDA = '/MDAReport/DrugRequirementMDA1';
const REPORT_GET_DISEASE_RATE_VILLAGE_WISE =
  '/MFReport/get_DiseaseRateVillagewise';
const REPORT_GET_VERIFIED_BY_MO = '/LFReport/VerifiedbyMO';
const REPORT_GET_MDA_DRUG_ADMIN_SUPERVISOR_AVALIABILITY =
  '/MDAReport/DrugAdminSupervisorAvailability';
const REPORT_GET_MDA_PHC_HR_AND_TRAINING_STATUS =
  '/MDAReport/PhcHrAndTrainingStatus';
const REPORT_GET_MDA_PHC_WISE_DRUG_CONSUMPTION =
  '/MDAReport/PHCwiseDrugConsumption';
const REPORT_GET_MDA_BIFURCATION_OF_REGULAR_AND_MOPUP =
  '/MDAReport/BifurcationOfRegularAndMopup';
const REPORT_GET_VERTICAL_STOCK_MONTHLY_VACANCY_STATUS =
  '/VerticalStockReport/vspMonthlyVacancyStatus';
const REPORT_GET_VERTICAL_STOCK_TRAINING_STATUS =
  '/VerticalStockReport/vspTrainingStatus';
const REPORT_GET_VERTICAL_STOCK_COMSUMPTION_LAB_MATERIALS =
  '/VerticalStockReport/vspAvailabilityConsumptionLabmaterials';
const REPORT_GET_FSU_PERCENTAGE_TARGET_COMPLETED =
  '/FSUReport/FSUPercentageTargetCompleted';
const REPORT_GET_LF_PLANNING_FOR_OT = '/LFReport/PlanningForOT';
const REPORT_GET_MDA_EXPENDITURE_BALANCE_RECEIVED_FUNDS =
  '/MDAReport/ExpenditureBalanceReceivedFunds';
const REPORT_GET_LF_FOLLOW_UP_SERVICES_LF_PATIENTS =
  '/LFReport/get_FollowUpservicesToLFpatients';
const REPORT_GET_LF_FOLLOW_UP_SERVICES_HF_PATIENTS =
  '/LFReport/get_FollowUpservicesToHydrocelePatients';
const REPORT_GET_FCU_ANALYSIS_SEVEN = '/FCUReport/get_FCUAnalysis7';
const REPORT_GET_MDA_DRUG_STOCK_AT_PHC = '/MDAReport/DrugStockAtPHC';
const REPORT_GET_DRUG_REQUIREMENT_MDA_2 = '/MDAReport/DrugRequirementMDA2';
const REPORT_GET_FCU_ANALYSIS_EIGHT = '/FCUReport/get_FCUAnalysis8';
const REPORT_GET_POSTMDAEVALIST = '/MDAReport/postMDAEvalList';
const REPORT_GET_FSU_ZONEWISE = '/fsuZoneReport/getFSUZoneReport';
const REPORT_GET_FCU_MISMTR = '/fcuMisMtrReport/getFCUMisMtrReport';
const REPORT_GET_NC_MISMTR = '/ncMisMtrReport/getNCMisMtrReport';
const REPORT_GET_RCO_MISMTR = '/rcoMisMtrReport/getRCOMisMtrReport';
const REPORT_GET_YEARWISE_MISMTR = '/yearwiseMisMtrReport/getYearwiseMisMtrReport';
const REPORT_GET_INVENTORY_MISMTR = '/inventoryMisMtrReport/getInventoryMisMtrReport';
const REPORT_GET_ENTOMOLOGICAL_MISMTR = '/entomologicalMisMtrReport/getEntomologicalMisMtrReport';
const REPORT_GET_HYDROCELEOPS_MISMTR = '/hydroceleOpsMisMtrReport/getHydroceleOpsMisMtrReport';
const WEBSITE_GET_ENDEMICITY_GRAPH_ALLDISTRICTS =
  '/Graph/GetEndemicityGraphAllDistricts';
const WEBSITE_GET_MF_ENDEMICITY_GRAPH_ALLDISTRICTS =
  '/Graph/GetMFEndemicityGraphAllDistricts';
const WEBSITE_GET_LFCASES_GRAPH_DISTRICT_WISE =
  '/Graph/GetLFCasesGraphDistwise';
const WEBSITE_GET_HYDROCELECASES_GRAPH_DISTRICT_WISE =
  '/Graph/GetHydroceleCasesGraphDistwise';
const WEBSITE_GET_HYDROCELEOPERATED_GRAPH_DISTRICT_WISE =
  '/Graph/GetHydroceleOperatedGraphDistwise';
const WEBSITE_GET_PENDINGAPPROVALMO_GRAPH_DISTRICT_WISE =
  '/Graph/GetPendingApprovalMOGraphDistwise';
const WEBSITE_GET_MF_POSITIVE_DISTRICT_WISE =
  '/Graph/GetMFEndemicityGraphMFPosetive';
const WEBSITE_GET_BS_COLLECTED_DISTRICT_WISE =
  '/Graph/GetMFEndemicityGraphBSCollected';
const WEBSITE_GET_BS_EXAMINED_DISTRICT_WISE =
  '/Graph/GetMFEndemicityGraphBSExamined';
const WEBSITE_GET_MF_RATE_DISTRICT_WISE = '/Graph/GetMFEndemicityGraphMfRate';
const WEBSITE_GET_MMDP_PERCENT_DISTRICT_WISE =
  '/Graph/GetMMDPDetailsInPercentage';

const GET_DASHBOARDTODAYENTRY = '/dashboard/get_DashboardTodayEntry';
const DASHBOARDBSCOLLECTEDTODAY = '/dashboard/DashboardBSCollectedToday';
const DASHBOARDLFTHISMONTH = '/dashboard/DashboardLFThisMonth';
const DASHBOARDMFPOSITIVE12MONTHS = '/dashboard/DashboardMFPositive12Months';
const DASHBOARDLFCASES12MONTHS = '/dashboard/DashboardLFCases12Months';
const DASHBOARDMONOTVERIFIED = '/dashboard/DashboardMONotVerified';
const DASHBOARDMFRATES = '/dashboard/DashboardMFRates';
const DASHBOARDFSUTARGETS = '/dashboard/DashboardFSUTargets';
const DASHBOARDDRUGCONSUMPTION = '/dashboard/DashboardDrugConsumption';
const DASHBOARDEndemicityTotalAllDistricts =
  '/dashboard/get_EndemicityTotalAllDistricts';

// Map
const GET_ENDEMICITYMAPALL_DISTRICTS = '/map/GetEndemicityMapAllDistricts';
const GET_ENDEMICITYMAPALL_VILLAGESBYTALUKA =
  '/map/GetEndemicityMapAllVillagesByTaluka';
const GET_ENDEMICITYMAPALL_VILLAGESBY_DISTRICT =
  '/map/GetEndemicityMapAllTaluksByDistrict';
const GET_GEODATA_DISTRICT = '/map/GetDistrictsGeo';
const GET_GEODATA_TALUKA = '/map/GetTalukasGeo';
const GET_ENDEMICITYMAP_HOME = '/map/GetEndemicityMapHome';
const GET_GEODATA_VILLAGE = '/map/GetVillagesGeo';
const GET_GEODATA_TOWN = '/map/GetTownsGeo';
const DASHBOARDMFRATETIMETREND = '/dashboard/GetMFRateTimeTrend';
const DASHBOARDGetMFRateTimeTrendList = '/dashboard/GetMFRateTimeTrendList';
const GET_LYMPHEDEMA_CASES_DISTRICTS = '/dashboard/GetLymphedemaCasesDistricts';
const GET_HYDROCELE_CASES_DISTRICTS = '/dashboard/GetHydroceleCasesDistricts';
const GET_HYDROCELE_SURGERIES_DISTRICTS = '/dashboard/GetHydroceleSurgeriesDistricts';
const GET_MFPOSITIVE_CASES_DISTRICTS = '/dashboard/GetMFPositiveCasesDistricts';
const GET_MDA_IDA_COVERAGE_CONSUMPTION = '/dashboard/GetMDAIDACoverageAndConsumption';
const GET_MMDP_GRAPH = '/dashboard/GetMMDPGraph';
const GET_MDA_TAS_ACTIVITY_STATUS = '/dashboard/GetMdaTasActivityStatus';
const GET_FSU_FCU_NC_PERFORMANCE = '/dashboard/GetFilariaUnitPerformance'
const GET_ALERTS_FOR_USER = '/dashboard/GetAlertsForUser'
const ENDPOINT = {
  REPORT_GET_POSTMDAEVALIST,
  GET_DASHBOARDTODAYENTRY,
  DASHBOARDMONOTVERIFIED,
  DASHBOARDLFCASES12MONTHS,
  DASHBOARDLFTHISMONTH,
  DASHBOARDMFPOSITIVE12MONTHS,
  DASHBOARDBSCOLLECTEDTODAY,
  DASHBOARDFSUTARGETS,
  DASHBOARDMFRATES,
  DASHBOARDMFRATETIMETREND,
  DASHBOARDDRUGCONSUMPTION,
  DASHBOARDEndemicityTotalAllDistricts,
  DASHBOARDGetMFRateTimeTrendList,
  WEBSITE_GET_ENDEMICITY_GRAPH_ALLDISTRICTS,
  WEBSITE_GET_MF_ENDEMICITY_GRAPH_ALLDISTRICTS,
  WEBSITE_GET_HYDROCELECASES_GRAPH_DISTRICT_WISE,
  WEBSITE_GET_HYDROCELEOPERATED_GRAPH_DISTRICT_WISE,
  WEBSITE_GET_LFCASES_GRAPH_DISTRICT_WISE,
  WEBSITE_GET_PENDINGAPPROVALMO_GRAPH_DISTRICT_WISE,
  WEBSITE_GET_MF_POSITIVE_DISTRICT_WISE,
  WEBSITE_GET_BS_COLLECTED_DISTRICT_WISE,
  WEBSITE_GET_BS_EXAMINED_DISTRICT_WISE,
  WEBSITE_GET_MF_RATE_DISTRICT_WISE,
  WEBSITE_GET_MMDP_PERCENT_DISTRICT_WISE,
  WEBSITE_NEWS_LIST,
  WEBSITE_FAQS_LIST,
  WEBSITE_FAQS_CREATE,
  WEBSITE_FAQS_UPDATE,
  WEBSITE_FAQS_GETONE,
  WEBSITE_FAQS_DELETE,
  WEBSITE_VIDEOS_LIST,
  WEBSITE_VIDEOS_CREATE,
  WEBSITE_VIDEOS_GETONE,
  WEBSITE_VIDEOS_UPDATE,
  WEBSITE_VIDEOS_DELETE,
  WEBSITE_PROGRAMINFOS_LIST,
  WEBSITE_PROGRAMINFOS_CREATE,
  WEBSITE_PROGRAMINFOS_UPDATE,
  WEBSITE_PROGRAMINFOS_DELETE,
  WEBSITE_IMAGES_LIST,
  WEBSITE_CONTENT_LIST,
  IMAGES_READMORE,
  BLOGS_READMORE,
  VIDEOS_READMORE,
  FORGET_PASSWORD,
  VERIFY_OTP,
  RESET_PASSWORD,
  UPDATE_PASSWORD,

  ADMIN_NEWS_GETLIST,
  ADMIN_NEWS_GETONE,
  ADMIN_NEWS_POSTLIST,
  ADMIN_NEWS_UPDATE,
  ADMIN_NEWS_DELETE,
  NEWS_READMORE,
  ADMIN_IMAGE_GETONE,
  ADMIN_IMAGE_POSTLIST,
  ADMIN_IMAGE_UPDATE,
  ADMIN_IMAGE_DELETE,
  ADMIN_ZONE_DISTRICT_CREATE_OR_UPDATE,
  ADMIN_ZONE_FACILITY_GET_ONLY_ONE,
  ADMIN_ZONE_FACILITY_CREATE_OR_UPDATE,
  ADMIN_ZONE_VERTICALCONTROLUNIT_GET_ONLY_ONE,
  ADMIN_ZONE_VERTICALCONTROLUNIT_CREATE_OR_UPDATE,

  WEBSITE_DROPDOWN_LIST_STATE,
  WEBSITE_DROPDOWN_GETONE_STATE,
  WEBSITE_DROPDOWN_LIST_DISTRICT,
  WEBSITE_DROPDOWN_LIST_CORPORATION,
  WEBSITE_DROPDOWN_LIST_TALUKA,
  WEBSITE_DROPDOWN_LIST_FACILITY,
  WEBSITE_DROPDOWN_LIST_SUBCENTER,
  WEBSITE_DROPDOWN_LIST_WARD,
  WEBSITE_DROPDOWN_LIST_VILLAGE,
  WEBSITE_DROPDOWN_ZONE,
  WEBSITE_DROPDOWN_LIST_DISTRICT_GETONE,
  WEBSITE_DROPDOWN_GET_DISTRICT_BY_VCU,
  WEBSITE_DROPDOWN_GET_DISTRICT_BY_FSU,
  WEBSITE_DROPDOWN_LIST_CORPORATION_GETONE,
  WEBSITE_DROPDOWN_LIST_TALUKA_GETONE,
  WEBSITE_DROPDOWN_LIST_FACILITY_GETONE,
  FACILITY_LIST,
  WEBSITE_DROPDOWN_LIST_SUBCENTER_GETONE,
  WEBSITE_DROPDOWN_LIST_WARD_GETONE,
  WEBSITE_DROPDOWN_LIST_VILLAGE_GETONE,
  WEBSITE_DROPDOWN_LIST_VILLAGE_GETBYDISTRICT,
  WEBSITE_DROPDOWN_LIST_VILLAGE_GETONEBYSUBCENTERID,
  WEBSITE_DROPDOWN_LIST_VILLAGE_GETONEBYTALUKAID,
  WEBSITE_DROPDOWN_LIST_ZONE_GETONE,
  WEBSITE_DROPDOWN_UNITACTION,
  WEBSITE_DROPDOWN_LIST_ZONE,
  DESIGNATION_LIST,
  ACTIVIITY_LIST,
  ROLE_LIST,
  SCREEN_LIST,
  INSTITUTIONTYPE_LIST,
  TASSURVEY_ADD,
  TASSURVEY_LIST,
  TASSURVEY_UPDATE,
  TASSURVEY_DELETE,
  TASSURVEY_GETONE,
  TASSURVEYCHILDREN_ADD,
  TASSURVEYCHILDREN_LIST,
  TASSURVEYCHILDREN_UPDATE,
  TASSURVEYCHILDREN_GETONE,
  TASSURVEYCHILDREN_DELETE,
  TASSURVEY_CREATEALL,
  MAPPING_OF_OT_CREATE,
  MAPPING_OF_OT_DELETE,
  SURGEON_MAPPING_OF_OT_DELETE,
  MAPPING_OF_OT_EDIT,
  MAPPING_OF_OT_GETONE,
  MAPPING_OF_OT_LIST,
  VERTICAL_STOCK_POSITION_CREATE,
  VERTICAL_STOCK_POSITION_LIST,
  VERTICAL_STOCK_POSITION_GETONE,
  VERTICAL_STOCK_POSITION_UPDATE,
  VERTICAL_STOCK_POSITION_DELETE,
  ENTOMOLOGICALLARVICIDAL_GET,
  ENTOMOLOGICALLARVICIDAL_GETONE,
  ENTOMOLOGICALLARVICIDAL_POST,
  ENTOMOLOGICALLARVICIDAL_UPDATE,
  ENTOMOLOGICALLARVICIDAL_DELETE,
  ENTOMOLOGICALLARVICIDAL_FIELD_ARRAY_DELETE,

  MDAActivityCreate,
  MDAActivityList,
  MDAActivityEdit,
  MDAActivityDelete,
  MDAActivityGetOne,

  FSU_TARGET_STEPPER_ONE,
  FSU_TARGET_LIST_STEPPER_ONE,
  FSU_TARGET_UPDATE_STEPPER_ONE,
  FSU_TARGET_DELETE_STEPPER_ONE,
  FSU_TARGET_STEPPER_TWO,
  FSU_TARGET_LIST_STEPPER_TWO,
  FSU_TARGET_UPDATE_STEPPER_TWO,
  FSU_TARGET_DELETE_STEPPER_TWO,

  GET_MDA_EVALLIST,
  POST_MDA_EVALLIST,

  LYMPHEDEMA_CREATE,
  LYMPHEDEMA_LIST,
  LYMPHEDEMA_UPDATE,
  LYMPHEDEMA_DELETE,
  LYMPHEDEMA_GETONE,
  LYMPHEDEMA_POST_HF_FOLLOWUP,
  LYMPHEDEMA_POST_PATIENT_INFORMATION,
  LYMPHEDEMA_UPDATE_PATIENT_INFORMATION,
  LYMPHEDEMA_POST_SURVEY,
  GET_SURVEY_LIST,
  LYMPHEDEMA_POST_LF_FOLLOWUP,
  GET_LF_FOLLOWUPS_LIST,
  GET_HF_FOLLOWUPS_LIST,
  GET_LYMPHEDEMA_PATIENT_INFO,
  DELETE_LF_FOLLOWUP,
  DELETE_HF_FOLLOWUP,
  DELETE_SURVEY,

  STAFF_POSITION,
  STAFF_POSITION_CREATEALL,
  STAFF_POSITION_LIST,
  STAFF_POSITION_UPDATE,
  STAFF_POSITION_DELETE,
  STAFF_POSITION_TRAINING,
  STAFF_POSITION_TRAINING_LIST,
  STAFF_POSITION_TRAINING_UPDATE,
  STAFF_POSITION_TRAINING_DELETE,
  EDIT_MDA_EVALLIST,
  GET_ONE_EVALLIST,
  DELETE_MDA_EVALLIST,
  DELETE_MDA_PERSON,
  DELETE_MDA_FAMILYMEMBER,

  PREMDAACTIVITY_CREATE,
  PREMDAACTIVITY_LIST,
  PREMDAACTIVITY_UPDATE,
  PREMDAACTIVITY_DELETE,
  PREMDAACTIVITY_GETONE,
  PREMDAACTIVITYDRUGLOGISTICS_CREATE,
  PREMDAACTIVITYDRUGLOGISTICS_LIST,
  PREMDAACTIVITYDRUGLOGISTICS_UPDATE,
  PREMDAACTIVITYDRUGLOGISTICS_DELETE,
  PREMDAACTIVITYDRUGLOGISTICS_GETONE,
  PREMDAACTIVITY_CREATEALL,
  PREMDAACTIVITYDRUGADMINISTRATORS_DELETE,
  PREMDAACTIVITYSUPERVISORS_DELETE,

  MDA_IDA_COVERAGES_CREATE,
  MDA_IDA_COVERAGES_CREATE_ALL,
  MDA_IDA_COVERAGE_REGULAR_CREATE,
  MDA_IDA_COVERAGE_MOPUP_CREATE,
  VERTICAL_CONTROL_UNIT_LIST,
  VERTICAL_CONTROL_FIELD_UNIT_LIST,
  MDA_IDA_COVERAGES_LIST,
  MDA_IDA_COVERAGE_REGULAR_LIST,
  MDA_IDA_COVERAGE_MOPUP_LIST,
  MDA_IDA_COVERAGES_GETONE,
  MDA_IDA_COVERAGE_REGULAR_GETONE,
  MDA_IDA_COVERAGE_MOPUP_GETONE,
  MDA_IDA_COVERAGES_UPDATE,
  MDA_IDA_COVERAGE_REGULAR_UPDATE,
  MDA_IDA_COVERAGE_MOPUP_UPDATE,
  MDA_IDA_COVERAGES_DELETE,
  MDA_IDA_COVERAGE_REGULAR_DELETE,
  MDA_IDA_COVERAGE_MOPUP_DELETE,

  USERS_CREATE,
  USERS_LIST,
  USERS_DELETE,
  USERS_GETONE,
  USERS_UPDATE,
  GET_USER_ROLE_SCREEN_ACTIVITIES,
  NAME_UNIT_FILED,
  MFPOSITIVE_LIST,
  MFPOSITIVE_CREATE,
  MFPOSITIVE_UPDATE,
  MFPOSITIVE_DELETE,
  MFPOSITIVE_SURVEY_LIST,
  MFPOSITIVE_SURVEY_CREATE,
  MFPOSITIVE_CREATE_ALL,
  MFPOSITIVE_SURVEY_UPDATE,
  MFPOSITIVE_SURVEY_DELETE,
  MFPOSITIVE_PATIENT_LIST,
  MFPOSITIVE_PATIENT_CREATE,
  MFPOSITIVE_PATIENT_UPDATE,
  MFPOSITIVE_PATIENT_DELETE,
  MFPOSITIVE_BSFollowUps_LIST,
  MFPOSITIVE_BSFollowUps_CREATE,
  MFPOSITIVE_BSFollowUps_UPDATE,
  MFPOSITIVE_BSFollowUps_DELETE,
  ADMIN_MENUS_GETLIST,
  ADMIN_MENUS_GETONE,
  ADMIN_MENUS_POST,
  ADMIN_MENUS_UPDATE,
  ADMIN_MENUS_DELETE,
  ADMIN_SETTINGS_GETLIST,
  ADMIN_SETTINGS_GETONE,
  ADMIN_SETTINGS_POST,
  ADMIN_SETTINGS_UPDATE,
  ADMIN_SETTINGS_DELETE,
  ADMIN_MENUS_SECTION_GETLIST,
  ADMIN_MENUS_SECTION_GETONE,
  ADMIN_MENUS_SECTION_POST,
  ADMIN_MENUS_SECTION_UPDATE,
  ADMIN_MENUS_SECTION_DELETE,
  ADMIN_MENUS_LINK_GETLIST,
  ADMIN_MENUS_LINK_GETONE,
  ADMIN_MENUS_LINK_POST,
  ADMIN_MENUS_LINK_UPDATE,
  ADMIN_MENUS_LINK_DELETE,

  WEBSITE_PROGRAMINFOSECTION_CREATE,
  WEBSITE_PROGRAMINFOLINKS_CREATE,
  WEBSITE_PROGRAMINFOSECTION_GETONE,
  WEBSITE_PROGRAMINFOSECTION_GET,
  WEBSITE_PROGRAMINFOSECTIONLINK_GETAll,
  WEBSITE_PROGRAMINFOSECTIONLINK_GETONE,
  WEBSITE_PROGRAMINFOS_GETONE,
  WEBSITE_PROGRAMINFOSECTION_DELETE,
  WEBSITE_PROGRAMINFOSECTIONLINK_DELETE,
  REPORT_GET_LF_ANALYSIS1,
  REPORT_GET_LF_ANALYSIS2,
  REPORT_GET_LF_DIESEASECASES,
  REPORT_GET_LF_ANALYSIS3,
  REPORT_GET_LF_HYDROCELE_OP_LINE_LIST,
  REPORT_GET_LF_PENDING_HYDROCELE_CASES,
  REPORT_GET_GRADING_OF_LF_PATIENTS,
  REPORT_GET_PATIENT_INELIGIBLE_FOR_SURGERY,
  REPORT_GET_ADDITIONAL_MF_SURVEY_REPORT_LIST,
  REPORT_GET_MF_BASE_LINE_SURVEY_LIST,
  REPORT_GET_PERFORMANCE_OF_SURGEONS,
  REPORT_GET_PERFORMANCE_OF_INSTITUTES,
  REPORT_LF_MMDP_ACTIVITY_REPORT,
  REPORT_GET_FSU_ANALYSIS1,
  REPORT_GET_FSU_ANALYSIS2,
  REPORT_GET_FSU_ANALYSIS3,
  REPORT_GET_FSU_ANALYSIS4,
  REPORT_GET_FSU_ANALYSIS5,
  REPORT_GET_FCU_ANALYSIS_ONE,
  REPORT_GET_FCU_ANALYSIS_TWO,
  REPORT_GET_FCU_ANALYSIS_FOUR,
  REPORT_GET_FCU_ANALYSIS_FIVE,
  REPORT_GET_FCU_ANALYSIS_SIX,
  REPORT_GET_TAS_REPORT1,
  REPORT_GET_TAS_REPORT2,
  REPORT_GET_MDA_TRAINING_STATUS1,
  REPORT_GET_MDA_COVERAGEREPORT1,
  REPORT_GET_MDA_POSTMDA_EVALUATION1,
  REPORT_GET_MDA_POSTMDA_EVALUATION2,
  REPORT_GET_MDA_INFRASTRUCTURE,
  REPORT_GET_MDA_COORDINATION_COMMITTE_REPORT,
  REPORT_GET_SAE_REPORT,
  REPORT_GET_ENTOMOLOGY_LARVICIDAL_REPORT1,
  REPORT_GET_ENTOMOLOGY_NFCU_REPORT1,
  REPORT_GET_VERTICAL_ANALYSIS_REPORT,
  REPORT_GET_ADDITIONAL_ENTOMOLOGICAL_REPORT,
  REPORT_GET_BASE_LINE_ENTOMOLOGICAL_REPORT,
  REPORT_GET_NFCU_MOSQUITO_DISECTION_REPORT,
  REPORT_GET_LARVAL_DENSITY_REPORT,
  REPORT_GET_FCU_ANALYSIS_TEN,
  REPORT_GET_DRUG_REQUIREMENT_MDA,
  REPORT_GET_DISEASE_RATE_VILLAGE_WISE,
  REPORT_GET_VERIFIED_BY_MO,
  REPORT_GET_MDA_DRUG_ADMIN_SUPERVISOR_AVALIABILITY,
  REPORT_GET_MDA_PHC_HR_AND_TRAINING_STATUS,
  REPORT_GET_MDA_PHC_WISE_DRUG_CONSUMPTION,
  REPORT_GET_VERTICAL_STOCK_MONTHLY_VACANCY_STATUS,
  REPORT_GET_VERTICAL_STOCK_TRAINING_STATUS,
  REPORT_GET_VERTICAL_STOCK_COMSUMPTION_LAB_MATERIALS,
  REPORT_GET_FSU_PERCENTAGE_TARGET_COMPLETED,
  REPORT_GET_MDA_BIFURCATION_OF_REGULAR_AND_MOPUP,
  REPORT_GET_LF_PLANNING_FOR_OT,
  REPORT_GET_MDA_EXPENDITURE_BALANCE_RECEIVED_FUNDS,
  REPORT_GET_LF_FOLLOW_UP_SERVICES_LF_PATIENTS,
  REPORT_GET_LF_FOLLOW_UP_SERVICES_HF_PATIENTS,
  REPORT_GET_FCU_ANALYSIS_SEVEN,
  REPORT_GET_MDA_DRUG_STOCK_AT_PHC,
  REPORT_GET_DRUG_REQUIREMENT_MDA_2,
  REPORT_GET_FCU_ANALYSIS_EIGHT,
  REPORT_GET_HYDROCELECTOMY_OPERATIONS,
  REPORT_GET_MMDP_KITS_GIVEN,
  REPORT_GET_FSU_ZONEWISE,
  REPORT_GET_FCU_MISMTR,
  REPORT_GET_NC_MISMTR,
  REPORT_GET_RCO_MISMTR,
  REPORT_GET_INVENTORY_MISMTR,
  REPORT_GET_ENTOMOLOGICAL_MISMTR,
  REPORT_GET_YEARWISE_MISMTR,
  REPORT_GET_HYDROCELEOPS_MISMTR,
  GET_ENDEMICITYMAPALL_DISTRICTS,
  GET_ENDEMICITYMAPALL_VILLAGESBYTALUKA,
  GET_ENDEMICITYMAPALL_VILLAGESBY_DISTRICT,
  GET_GEODATA_DISTRICT,
  GET_GEODATA_TALUKA,
  GET_ENDEMICITYMAP_HOME,
  REPORT_GET_PROPOSAL_FOR_WITHDRAWAL_REPORT_LIST,
  GET_GEODATA_VILLAGE,
  GET_GEODATA_TOWN,
  GET_LYMPHEDEMA_CASES_DISTRICTS,
  GET_HYDROCELE_CASES_DISTRICTS,
  GET_HYDROCELE_SURGERIES_DISTRICTS,
  GET_MFPOSITIVE_CASES_DISTRICTS,
  GET_MDA_IDA_COVERAGE_CONSUMPTION,
  GET_MMDP_GRAPH,
  GET_MDA_TAS_ACTIVITY_STATUS,
  GET_FSU_FCU_NC_PERFORMANCE,
  GET_ALERTS_FOR_USER,
  HYDROCELECTOMY_OPERATIONS_CREATE,
  HYDROCELECTOMY_OPERATIONS_BULKCREATE,
  HYDROCELECTOMY_OPERATIONS_UPDATE,
  HYDROCELECTOMY_OPERATIONS_DELETE,
  HYDROCELECTOMY_OPERATIONS_GETONE,
  HYDROCELECTOMY_OPERATIONS_LIST,
};

export default ENDPOINT;
