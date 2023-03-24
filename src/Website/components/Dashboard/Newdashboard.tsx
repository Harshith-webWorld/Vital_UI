import React, { useState } from 'react';
import NewHeader from '../../Layout/NewHeader/Header';
import NewFooter from '../../Layout/NewFooter/Footer';
import Sidebar from '../sidebar/newsidebar';
import history from '../../../helpers/history';

import { WebsiteContent } from '../../../helpers/interfaces/websitecontent';
import WebsiteContentService from '../../../helpers/services/website-content.service';
import { Router, Switch, Route } from 'react-router-dom';

import ViewLymphedemaPatients from '../DataEntry/DE1-Lymphedema-Hydrocele-Patients/ViewLymphedemaPatients';
import AddLymphedemaPatients from '../DataEntry/DE1-Lymphedema-Hydrocele-Patients/AddLymphedemaPatients';
import ViewPreMDAActivity from '../DataEntry/DE2-Pre-MDA-Activities/ViewPreMDAActivity';
import AddPreMDAActivity from '../DataEntry/DE2-Pre-MDA-Activities/AddPreMDAActivity';
import AddMDAIECActivity from '../DataEntry/DE3-MDA-IEC-Activities/AddMdaIecActivity';
import ListMDAIECActivity from '../DataEntry/DE3-MDA-IEC-Activities/listMdaIecActivity';
import ViewCoverageReport from '../DataEntry/DE4-MDA-IDA-Coverages/ViewCoverageReport';
import AddCoverageReport from '../DataEntry/DE4-MDA-IDA-Coverages/AddCoverageReport';
import ViewPostMDAThirdParty from '../DataEntry/DE5-Post-MDA-ThirdParty-Evaluation/ViewPostMDAThirdParty';
import AddPostMDAThirdParty from '../DataEntry/DE5-Post-MDA-ThirdParty-Evaluation/AddPostMDAThirdParty';
import AddMappingOfOperationTheaters from '../DataEntry/DE6-Mapping-OperationTheatres/AddMappingofOperationTheaters';
import ListMappingOfOperationTheaters from '../DataEntry/DE6-Mapping-OperationTheatres/ListMappingOfOperationTheaters';
import AddTasSurvey from '../DataEntry/DE7-TAS-Survey/AddTASSurvey';
import ViewTASSurvey from '../DataEntry/DE7-TAS-Survey/ViewTASSurvey';
import ViewMFPositive from '../DataEntry/DE8-MF-PositiveList/ViewMFPositive';
import AddMFPositive from '../DataEntry/DE8-MF-PositiveList/AddMFPositive';
import ViewVerticalStockPosition from '../DataEntry/DE9-VerticalStockPosition/ViewVerticalStockPosition';
import AddVerticalUnit from '../DataEntry/DE9-VerticalStockPosition/addVerticalUnitStock';
// import ViewVerticalStockPosition from '../DataEntry/DE13-HydrocelectomyOperations/ViewHydrocelectomyOperations';
// import AddVerticalUnit from '../DataEntry/DE13-HydrocelectomyOperations/AddHydrocelectomyOperations';
import AddStaffPosition from '../DataEntry/DE10-StaffPosition-VerticalUnit/addStaffPosition';
import ViewStaffPosition from '../DataEntry/DE10-StaffPosition-VerticalUnit/viewStaffPosition';
import ViewEntomologicalLarvicidal from '../DataEntry/DE11-Entomological-Larvicidal/ViewEntomologicalLarvicidal';
import AddEntomologicalLarvicidal from '../DataEntry/DE11-Entomological-Larvicidal/AddEntomologicalLarvicidal';
import AddFsuTarget from '../DataEntry/DE12-FSU-Targets/add-FusTarget';
import ViewFusTarget from '../DataEntry/DE12-FSU-Targets/view-FusTarget';
import ViewHydrocelectomyOperations from '../DataEntry/DE13-HydrocelectomyOperations/ViewHydrocelectomyOperations';
import AddHydrocelectomyOperations from '../DataEntry/DE13-HydrocelectomyOperations/AddHydrocelectomyOperations';

import userService from '../../../helpers/services/userService';
import WebDashboard from '../WebDashboard/WebDashboard';
import ChangePassword from '../ChangePassword/ChangePassword';
import UserProfile from '../UserProfile/UserProfile';
import PageNotFound from '../PageNotFound';
import { useSelector, useDispatch } from 'react-redux';

import Additional_MF_Survey_Report from '../Reports/MFReports/Additional_MF_Survey_Report';
import AdditionalEntomologicalReport from '../Reports/EntomologicalAndLarvicidalReports/AdditionalEntomologicalReport';
import AnalysisLymphedemaLinelist from '../Reports/AnalysisLymphedemaLinelist';
import Analysis1 from '../Reports/LFandHydroceleReports/Analysis1';
import Analysis2 from '../Reports/LFandHydroceleReports/Analysis2';
import Analysis3 from '../Reports/LFandHydroceleReports/Analysis3';
import AnalysisOne from '../Reports/FCUReports/AnalysisOne';
import AnalysisTwo from '../Reports/FCUReports/AnalysisTwo';
import AnalysisThree from '../Reports/AnalysisThree';
import AnalysisFour from '../Reports/FCUReports/AnalysisFour';
import AnalysisFive from '../Reports/FCUReports/AnalysisFive';
import AnalysisSix from '../Reports/FCUReports/AnalysisSix';
import AnalysisSeven from '../Reports/FCUReports/AnalysisSeven';
import AnalysisEight from '../Reports/FCUReports/AnalysisEight';
import AnalysisNine from '../Reports/AnalysisNine';
import AnalysisTen from '../Reports/FCUReports/AnalysisTen';
import Base_line_Survey from '../Reports/MFReports/Base_line_Survey/Base_line_Survey';
import BaselineEntomoligicalReport from '../Reports/EntomologicalAndLarvicidalReports/BaselineEntomoligicalReport';
import CoordinationcommitteReport from '../Reports/MDAReports/CoordinationcommitteReport';
import CoverageReport1 from '../Reports/MDAReports/CoverageReport1';
import DrugRequirementMDA from '../Reports/MDAReports/DrugRequirementMDA';
import FSUAnalysis1 from '../Reports/FSUReports/FSUAnalysis1';
import FSUAnalysis2 from '../Reports/FSUReports/FSUAnalysis2';
import FSUAnalysis2_Monthly from '../Reports/FSUAnalysis2_Monthly';
import FSUAnalysis3 from '../Reports/FSUReports/FSUAnalysis3';
import FSUAnalysis4 from '../Reports/FSUReports/FSUAnalysis4';
import FSUAnalysis5 from '../Reports/FSUReports/FSUAnalysis5';
import InfrastructureandTraining from '../Reports/MDAReports/InfrastructureandTraining';
import LarvalDensityReport from '../Reports/EntomologicalAndLarvicidalReports/LarvalDensityReport';
import LarvicidalReport1 from '../Reports/EntomologicalAndLarvicidalReports/LarvicidalReport1';
import MDATrainingstatus1 from '../Reports/MDAReports/MDATrainingstatus1';
import PostMDAevaluation1 from '../Reports/MDAReports/PostMDAevaluation1';
import PostMDAevaluation2 from '../Reports/MDAReports/PostMDAevaluation2';
import SAEReport from '../Reports/MDAReports/SAEReport';
import ProposalforwithdrawalofMDA from '../Reports/MDAReports/ProposalforwithdrawalofMDA';
import TASReport1 from '../Reports/TASReports/TASReport1';
import TASReport2 from '../Reports/TASReports/TASReport2';
import VerticalStockAnalysis from '../Reports/VerticalStockAnalysis';
import NFCUReportEntomology1 from '../Reports/EntomologicalAndLarvicidalReports/NFCUReportEntomology1';
import NFCUMosquitoDisectionReport2 from '../Reports/EntomologicalAndLarvicidalReports/NFCUMosquitoDisectionReport2';
import DiseaseCases from '../Analysis/LFandHydroceleAnalysis/DiseaseCases';
import Performanceofsurgeons from '../Analysis/LFandHydroceleAnalysis/PerformanceOfSurgeons';
import Performanceofinstitutes from '../Analysis/LFandHydroceleAnalysis/PerformanceOfInstitutes';
import HydroceleOperationlinelist from '../Analysis/LFandHydroceleAnalysis/HydroceleOperationlinelist';
import PendingHydroceleCases from '../Analysis/LFandHydroceleAnalysis/PendingHydroceleCases';
import MMDPActivityReport from '../Analysis/LFandHydroceleAnalysis/MMDPActivityReport';
import PatientsIneligibleForSurgery from '../Reports/PatientsIneligibleForSurgery';
import DiseaseRateVillageWise from '../Analysis/MFAnalysis/DiseaseRateVillageWise';
import VerifiedByMO from '../Analysis/LFandHydroceleAnalysis/VerifiedByMO';
import DrugAdminSupervisorAvaliability from '../Analysis/PlanningAndTraining/DrugAdminSupervisorAvaliability';
import PhcHrAndTrainingStatus from '../Analysis/PlanningAndTraining/PhcHrAndTrainingStatus';
import PhcWiseDrugConsumption from '../Analysis/DrugStockAndConsumption/PhcWiseDrugConsumption';
import VspMonthlyVacancyStatus from '../Analysis/PlanningAndTraining/VspMonthlyVacancyStatus';
import VspTrainingStatus from '../Analysis/PlanningAndTraining/VspTrainingStatus';
import VspAvailabiltyConsumptionLabMaterials from '../Analysis/DrugStockAndConsumption/VspAvailabilityConsumptionLabMaterials';
import FSUPercentageTargetCompleted from '../Analysis/PlanningAndTraining/FSUPercentageTargetCompleted';
import BifurcationOfRegularAndMopUp from '../Analysis/MFAnalysis/BifurcationOfRegularAndMopUp';
import PlanningForOT from '../Analysis/PlanningAndTraining/PlanningForOT';
import ExpenditureBalanceReceivedFunds from '../Analysis/PlanningAndTraining/ExpenditureBalanceReceivedFunds';
import FollowUpServicesLFPatients from '../Analysis/LFandHydroceleAnalysis/FollowUpServicesLFPatients';
import FollowUpServicesHFPatients from '../Analysis/LFandHydroceleAnalysis/FollowUpServicesHFPatients';
import DrugStockAtPHC from '../Analysis/DrugStockAndConsumption/DrugStockAtPHC';
import DrugRequirementMDA2 from '../Reports/MDAReports/DrugRequirementMDA2';
import LFandHydroceleReports from '../Reports/LFandHydroceleReports';
import FSUReports from '../Reports/FSUReports';
import FCUReports from '../Reports/FCUReports';
import MFReports from '../Reports/MFReports';
import TASReports from '../Reports/TASReports';
import MDAReports from '../Reports/MDAReports';
import EntomologicalAndLarvicidalReports from '../Reports/EntomologicalAndLarvicidalReports';
import MISMTRReports from '../Reports/MIS-MTR-Reports';
import LFandHydroceleAnalysis from '../Analysis/LFandHydroceleAnalysis';
import MFAnalysis from '../Analysis/MFAnalysis';
import PlanningAndTraining from '../Analysis/PlanningAndTraining';
import DrugStockAndConsumption from '../Analysis/DrugStockAndConsumption';
import { userRoleScreenActivitiesUpdate } from '../WebLogin/siginslice';
import InteractiveMap from '../../../Components/InteractiveMap/InteractiveMap';

const Dashboard: React.FC = (props) => {
  let WebsiteContentData: WebsiteContent[] = [];
  const dispatch = useDispatch();
  const [websiteContents, setWebsiteContent] =
    React.useState(WebsiteContentData);
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const signinInfoId = signinInfo && signinInfo.data && signinInfo.data.id;
  const signinInfoRoleId =
    signinInfo && signinInfo.data && signinInfo.data.roleId;
  const offlineScreens =
    signinInfo && signinInfo.data && signinInfo.data.userRoleScreenActivities;

  const isOnline = window.navigator.onLine;
  let DERoutes: any = [];
  let DESheetslist: any = {};
  let DESheetsadd: any = {};
  const [signInScreenActivities, setsignInScreenActivities] = useState([]);
  async function GetUserRoleScreenActivities() {
    if (signinInfoId) {
      if (isOnline) {
        const userRoleScreenActivitiesResponse =
          await userService.getUserRoleActivities(signinInfoId);
        if (
          userRoleScreenActivitiesResponse &&
          userRoleScreenActivitiesResponse.data
        ) {
          dispatch(
            userRoleScreenActivitiesUpdate(
              userRoleScreenActivitiesResponse.data
            )
          );
          setsignInScreenActivities(userRoleScreenActivitiesResponse.data);
        }
      } else {
        setsignInScreenActivities(offlineScreens);
      }
    }
  }
  React.useEffect(() => {
    GetUserRoleScreenActivities();
    getWebsitecontent();
  }, []);

  const signinScreens: any = [];
  const signinUserRole: any = [];
  if (signInScreenActivities && signInScreenActivities.length > 0) {
    signInScreenActivities.map((Obj: any) => {
      signinScreens.push(Obj && Obj.screen);
      signinUserRole.push(Obj && Obj.role);
    });
  }

  for (let i = 1; i <= 13; i++) {
    if (signinScreens && signinScreens.length > 0) {
      signinScreens.map((element: any) => {
        if (element && element.screenCode === `DE${i}`) {
          DERoutes[i] = `DE${i}RouteName`;
          DESheetslist[DERoutes[i]] = '/' + element.urlPath; //+ 'new'
          DESheetsadd[DERoutes[i]] = '/' + element.urlPath + '/add'; //+ 'new'
        }
      });
    }
  }
  async function getWebsitecontent() {
    const response = await WebsiteContentService.getWebsiteContent();
    if (response) {
      WebsiteContentData = response.data;
      setWebsiteContent(response.data);
    }
  }
  return (
    <div>
      {/* <Header /> */}
      <NewHeader />
      {/* <div className='main-wrapper light-green'> */}
      <div className='main-wrapper'>
        <div className='d-flex'>
          <div
            className='sidebar-wrapnew'
            style={{ top: '0px', marginBottom: '0px' }}
          >
            <Sidebar />
          </div>
          {/* <div className='lg-block'>
            <i
              onClick={() => history.push('/newhome')}
              className='fa fa-bars'
            ></i>
          </div> */}
          <div className=' main-wrap' style={{ top: '0px' }}>
            <div className='right-wrappernew'>
              <div id='content-wrapper'>
                <Router history={history}>
                  <Switch>
                    <Route path={`/webdashboard`}>
                      <WebDashboard />
                    </Route>
                    <Route exact path={'/additionalMFSurveyReportnew'}>
                      <Additional_MF_Survey_Report />
                    </Route>
                    <Route path='/additionalEntomologicalReportnew'>
                      <AdditionalEntomologicalReport />
                    </Route>
                    <Route path='/analysisLymphedemaLinelistnew'>
                      <AnalysisLymphedemaLinelist />
                    </Route>
                    <Route path='/analysis1new'>
                      <Analysis1 />
                    </Route>
                    <Route path='/analysis2new'>
                      <Analysis2 />
                    </Route>
                    <Route path='/analysis3new'>
                      <Analysis3 />
                    </Route>
                    <Route path='/analysisonenew'>
                      <AnalysisOne />
                    </Route>
                    <Route path='/analysistwonew'>
                      <AnalysisTwo />
                    </Route>
                    <Route path='/analysistheenew'>
                      <AnalysisThree />
                    </Route>
                    <Route path='/analysisfournew'>
                      <AnalysisFour />
                    </Route>
                    <Route path='/analysisfivenew'>
                      <AnalysisFive />
                    </Route>
                    <Route path='/analysissixnew'>
                      <AnalysisSix />
                    </Route>
                    <Route path='/analysissevennew'>
                      <AnalysisSeven />
                    </Route>
                    <Route path='/analysisEightnew'>
                      <AnalysisEight />
                    </Route>
                    <Route path='/analysisninenew'>
                      <AnalysisNine />
                    </Route>
                    <Route path='/analysistennew'>
                      <AnalysisTen />
                    </Route>
                    <Route path='/base_line_Surveynew'>
                      <Base_line_Survey />
                    </Route>
                    <Route path='/baselineEntomoligicalReportnew'>
                      <BaselineEntomoligicalReport />
                    </Route>
                    <Route path='/coordinationcommitteReportnew'>
                      <CoordinationcommitteReport />
                    </Route>
                    <Route path='/coverageReport1new'>
                      <CoverageReport1 />
                    </Route>
                    <Route path='/drugRequirementMDAnew'>
                      <DrugRequirementMDA />
                    </Route>
                    <Route path='/diseaseCasesnew'>
                      <DiseaseCases />
                    </Route>
                    <Route path='/fsuAnalysis1new'>
                      <FSUAnalysis1 />
                    </Route>
                    <Route path='/fsuAnalysis2new'>
                      <FSUAnalysis2 />
                    </Route>
                    <Route path='/fsuAnalysis2_Monthlynew'>
                      <FSUAnalysis2_Monthly />
                    </Route>
                    <Route path='/fsuAnalysis3new'>
                      <FSUAnalysis3 />
                    </Route>
                    <Route path='/fsuAnalysis4new'>
                      <FSUAnalysis4 />
                    </Route>
                    <Route path='/fsuAnalysis5new'>
                      <FSUAnalysis5 />
                    </Route>
                    <Route path='/infrastructureandTrainingnew'>
                      <InfrastructureandTraining />
                    </Route>
                    <Route path='/larvalDensityReportnew'>
                      <LarvalDensityReport />
                    </Route>
                    <Route path='/larvicidalReport1new'>
                      <LarvicidalReport1 />
                    </Route>
                    <Route path='/mdaTrainingstatus1new'>
                      <MDATrainingstatus1 />
                    </Route>
                    <Route path='/nfcuMosquitoDisectionReportnew'>
                      <NFCUReportEntomology1 />
                    </Route>
                    <Route path='/nfcuMosquitoDisectionReport2new'>
                      <NFCUMosquitoDisectionReport2 />
                    </Route>
                    <Route path='/postMDAevaluation1new'>
                      <PostMDAevaluation1 />
                    </Route>
                    <Route path='/postMDAevaluation2new'>
                      <PostMDAevaluation2 />
                    </Route>
                    <Route path='/proposalforwithdrawalofMDAnew'>
                      <ProposalforwithdrawalofMDA />
                    </Route>
                    <Route path='/saeReportnew'>
                      <SAEReport />
                    </Route>
                    <Route path='/tasReport1new'>
                      <TASReport1 />
                    </Route>
                    <Route path='/tasReport2new'>
                      <TASReport2 />
                    </Route>
                    <Route path='/verticalStockAnalysisnew'>
                      <VerticalStockAnalysis />
                    </Route>
                    <Route path='/performanceofsurgeonsnew'>
                      <Performanceofsurgeons />
                    </Route>
                    <Route path='/performanceofinstitutesnew'>
                      <Performanceofinstitutes />
                    </Route>
                    <Route path='/fsuAnalysis1new'>
                      <FSUAnalysis1 />
                    </Route>
                    <Route path='/fsuAnalysis2new'>
                      <FSUAnalysis2 />
                    </Route>
                    <Route path='/hydroceleoperationlinelistnew'>
                      <HydroceleOperationlinelist />
                    </Route>
                    <Route path='/pendinghydrocelecasesnew'>
                      <PendingHydroceleCases />
                    </Route>
                    <Route path='/mmdpactivityreportingnew'>
                      <MMDPActivityReport />
                    </Route>
                    <Route path='/patientsIneligibleForSurgerynew'>
                      <PatientsIneligibleForSurgery />
                    </Route>
                    <Route path='/diseaseRateVillageWisenew'>
                      <DiseaseRateVillageWise />
                    </Route>
                    <Route path='/verifiedByMOnew'>
                      <VerifiedByMO />
                    </Route>
                    <Route path='/drugAdminSupervisorAvaliabilitynew'>
                      <DrugAdminSupervisorAvaliability />
                    </Route>
                    <Route path='/phcHrAndTrainingStatusnew'>
                      <PhcHrAndTrainingStatus />
                    </Route>
                    <Route path='/phcWiseDrugConsumptionnew'>
                      <PhcWiseDrugConsumption />
                    </Route>
                    <Route path='/vspMonthlyVacancyStatusnew'>
                      <VspMonthlyVacancyStatus />
                    </Route>
                    <Route path='/vspTrainingStatusnew'>
                      <VspTrainingStatus />
                    </Route>
                    <Route path='/vspAvailabilityConsumptionLabMaterialsnew'>
                      <VspAvailabiltyConsumptionLabMaterials />
                    </Route>
                    <Route path='/FSUPercentageTargetCompletednew'>
                      <FSUPercentageTargetCompleted />
                    </Route>
                    <Route path='/bifurcationOfRoundAndMopUpnew'>
                      <BifurcationOfRegularAndMopUp />
                    </Route>
                    <Route path='/planningForOTnew'>
                      <PlanningForOT />
                    </Route>
                    <Route path='/expenditureBalanceReceivedFundsnew'>
                      <ExpenditureBalanceReceivedFunds />
                    </Route>
                    <Route path='/followUpServicesLFPatientsnew'>
                      <FollowUpServicesLFPatients />
                    </Route>
                    <Route path='/followUpServicesHFPatientsnew'>
                      <FollowUpServicesHFPatients />
                    </Route>
                    <Route path='/drugStockAtPHCnew'>
                      <DrugStockAtPHC />
                    </Route>
                    <Route path='/drugRequirementMDA2new'>
                      <DrugRequirementMDA2 />
                    </Route>
                    <Route path='/lfAndHydroceleReportsnew'>
                      <LFandHydroceleReports />
                    </Route>
                    <Route path='/lfAndHydroceleAnalysisnew'>
                      <LFandHydroceleAnalysis />
                    </Route>
                    <Route path='/fsuReportsnew'>
                      <FSUReports />
                    </Route>
                    <Route path='/fcuReportsnew'>
                      <FCUReports />
                    </Route>
                    <Route path='/mfReportsnew'>
                      <MFReports />
                    </Route>
                    <Route path='/mis-mtr-reportsnew'>
                      <MISMTRReports />
                    </Route>
                    <Route path='/tasReportsnew'>
                      <TASReports />
                    </Route>
                    <Route path='/mdaReportsnew'>
                      <MDAReports />
                    </Route>
                    <Route path='/entomologicalAndLarvicidalReportsnew'>
                      <EntomologicalAndLarvicidalReports />
                    </Route>
                    <Route path='/mfAnalysisnew'>
                      <MFAnalysis />
                    </Route>
                    <Route path='/planningAndTrainingAnalysisnew'>
                      <PlanningAndTraining />
                    </Route>
                    <Route path='/drugStockAndConsumptionnew'>
                      <DrugStockAndConsumption />
                    </Route>
                    <Route path={`/changepassword`}>
                      <ChangePassword />
                    </Route>
                    <Route path={`/UserProfile`}>
                      <UserProfile />
                    </Route>
                    <Route path='/404error' component={PageNotFound} />
                    <Route
                      exact
                      path='/endemicitymap'
                      component={InteractiveMap}
                    />
                    {DESheetslist && DESheetslist.DE1RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE1RouteName}
                      >
                        <ViewLymphedemaPatients
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE1RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE2RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE2RouteName}
                      >
                        <ViewPreMDAActivity
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE2RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE3RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE3RouteName}
                      >
                        <ListMDAIECActivity
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE3RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE4RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE4RouteName}
                      >
                        <ViewCoverageReport
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE4RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE5RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE5RouteName}
                      >
                        <ViewPostMDAThirdParty
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE5RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE6RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE6RouteName}
                      >
                        <ListMappingOfOperationTheaters
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE6RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE7RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE7RouteName}
                      >
                        <ViewTASSurvey
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE7RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE8RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE8RouteName}
                      >
                        <ViewMFPositive
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE8RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE9RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE9RouteName}
                      >
                        <ViewVerticalStockPosition
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE9RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE10RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE10RouteName}
                      >
                        <ViewStaffPosition
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE10RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE11RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE11RouteName}
                      >
                        <ViewEntomologicalLarvicidal
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE11RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE12RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE12RouteName}
                      >
                        <ViewFusTarget
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE12RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetslist && DESheetslist.DE13RouteName && (
                      <Route
                        exact
                        path={DESheetslist && DESheetslist.DE13RouteName}
                      >
                        <ViewHydrocelectomyOperations
                          addDESheetName={
                            DESheetsadd && DESheetsadd.DE13RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE1RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE1RouteName}>
                        <AddLymphedemaPatients
                          listDESheetName={
                            DESheetslist && DESheetslist.DE1RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE2RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE2RouteName}>
                        <AddPreMDAActivity
                          listDESheetName={
                            DESheetslist && DESheetslist.DE2RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE3RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE3RouteName}>
                        <AddMDAIECActivity
                          listDESheetName={
                            DESheetslist && DESheetslist.DE3RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE4RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE4RouteName}>
                        <AddCoverageReport
                          listDESheetName={
                            DESheetslist && DESheetslist.DE4RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE5RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE5RouteName}>
                        <AddPostMDAThirdParty
                          listDESheetName={
                            DESheetslist && DESheetslist.DE5RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE6RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE6RouteName}>
                        <AddMappingOfOperationTheaters
                          listDESheetName={
                            DESheetslist && DESheetslist.DE6RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE7RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE7RouteName}>
                        <AddTasSurvey
                          listDESheetName={
                            DESheetslist && DESheetslist.DE7RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE8RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE8RouteName}>
                        <AddMFPositive
                          listDESheetName={
                            DESheetslist && DESheetslist.DE8RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE9RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE9RouteName}>
                        <AddVerticalUnit
                          listDESheetName={
                            DESheetslist && DESheetslist.DE9RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE10RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE10RouteName}>
                        <AddStaffPosition
                          listDESheetName={
                            DESheetslist && DESheetslist.DE10RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE11RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE11RouteName}>
                        <AddEntomologicalLarvicidal
                          listDESheetName={
                            DESheetslist && DESheetslist.DE11RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE12RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE12RouteName}>
                        <AddFsuTarget
                          listDESheetName={
                            DESheetslist && DESheetslist.DE12RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                    {DESheetsadd && DESheetsadd.DE13RouteName && (
                      <Route path={DESheetsadd && DESheetsadd.DE13RouteName}>
                        <AddHydrocelectomyOperations
                          listDESheetName={
                            DESheetslist && DESheetslist.DE13RouteName
                          }
                          userRole={signinInfoRoleId}
                          userSessionId={signinInfoId}
                        />
                      </Route>
                    )}
                  </Switch>
                </Router>
              </div>
            </div>
          </div>
          {/* End-section */}
        </div>
      </div>
      <NewFooter />
      {/* <HomeFooter webSiteContent={websiteContents && websiteContents[0]} /> */}
    </div>
  );
};

export default Dashboard;
