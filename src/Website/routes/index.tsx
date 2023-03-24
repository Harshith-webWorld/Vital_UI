import React, { useEffect, useState } from 'react';
import { BrowserRouter, Router, Switch, Route, Redirect } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Website from '../components/Home/Home';
//import NewWebsite from '../components/Newhome/Home';
// import Dashboardlogin from '../components/dashboard/dashboard';
import NewDashboardlogin from '../components/Dashboard/Newdashboard';

import ReadMoreComponent from '../components/Home/read-more-component';
import history from '../../helpers/history';
// import AddTASSurvey from '../components/TAS-Survey/AddTASSurvey';
//import DashboardRoute from '../components/dashboard/dashboard';
// import ViewPostMDAThirdParty from '../components/Pre-MDA/ViewPostMDAThirdParty';
// import AddPostMDAThirdParty from '../components/Pre-MDA/AddPostMDAThirdParty';
// import ViewTASSurvey from '../components/TAS-Survey/ViewTASSurvey';
// import ViewVerticalStockPosition from '../components/VerticalStockPosition/ViewVerticalStockPosition';
// import AddVerticalUnitStockPosition from '../components/VerticalStockPosition/addVerticalUnitStock';
// import AddMDAIECActivity from '../components/MDA-IEC activity and fund/AddMdaIecActivity';
// import ListMDAIECActivity from '../components/MDA-IEC activity and fund/listMdaIecActivity';
// import ViewLymphedemaPatients from '../components/LymphedemaHydrocelePatients/ViewLymphedemaPatients';
// import AddLymphedemaPatients from '../components/LymphedemaHydrocelePatients/AddLymphedemaPatients';
import { useOnlineStatus } from '../../helpers/networkconnection';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import AddFsuTarget from '../components/FUS-TARGET/add-FusTarget';
// import ViewFusTarget from '../components/FUS-TARGET/view-FusTarget';
// import ViewMFPositive from '../components/MFPositive/ViewMFPositive';
// import AddMFPositive from '../components/MFPositive/AddMFPositive';

import ModalSignin from '../components/WebLogin/NewModalSignin';
import ForgotPassword from '../components/WebLogin/ForgetPassword';
import ForgetPasswordModal from '../components/WebLogin/ForgetPasswordModal';

// import AddEntomologicalLarvicidal from '../components/EntomologicalLarvicidal/AddEntomologicalLarvicidal';
// import ViewEntomologicalLarvicidal from '../components/EntomologicalLarvicidal/ViewEntomologicalLarvicidal';
import VideoReadMore from '../components/Home/VideoReadMore';

// import AddMappingOfOperationTheaters from '../components/MappingofOperationTheatres/AddMappingofOperationTheaters';
// import ListMappingOfOperationTheaters from '../components/MappingofOperationTheatres/ListMappingOfOperationTheaters';
// import ViewCoverageReport from '../components/MDA&IDACoverageReport/ViewCoverageReport';
// import AddCoverageReport from '../components/MDA&IDACoverageReport/AddCoverageReport';

// import AddStaffPosition from '../components/Staff-Position-Vertical/addStaffPosition';
// import ViewStaffPosition from '../components/Staff-Position-Vertical/viewStaffPosition';
// import ViewPreMdaActivity from '../components/Pre-MDA/ViewPreMDAActivity';
// import AddPreMdaActivity from '../components/Pre-MDA/AddPreMDAActivity';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import userService from '../../helpers/services/userService';
import WebDashboard from '../components/WebDashboard/WebDashboard';
import { sidebarInterface } from '../interfaces/sidebarInterface';
//table
import Menudetails from '../components/Home/Menudetails';
import HomeMenudetails from '../components/Home/HomeMenuDetails';
import ViewMore from '../components/Home/view-more-component';
import Reportlist from '../components/Reports/index';
import Additional_MF_Survey_Report from '../components/Reports/MFReports/Additional_MF_Survey_Report';
import AdditionalEntomologicalReport from '../components/Reports/EntomologicalAndLarvicidalReports/AdditionalEntomologicalReport';
import AnalysisLymphedemaLinelist from '../components/Reports/AnalysisLymphedemaLinelist';
import Analysis1 from '../components/Reports/LFandHydroceleReports/Analysis1';
import Analysis2 from '../components/Reports/LFandHydroceleReports/Analysis2';
import Analysis3 from '../components/Reports/LFandHydroceleReports/Analysis3';
import AnalysisOne from '../components/Reports/FCUReports/AnalysisOne';
import AnalysisTwo from '../components/Reports/FCUReports/AnalysisTwo';
import AnalysisThree from '../components/Reports/AnalysisThree';
import AnalysisFour from '../components/Reports/FCUReports/AnalysisFour';
import AnalysisFive from '../components/Reports/FCUReports/AnalysisFive';
import AnalysisSix from '../components/Reports/FCUReports/AnalysisSix';
import AnalysisSeven from '../components/Reports/FCUReports/AnalysisSeven';
import AnalysisEight from '../components/Reports/FCUReports/AnalysisEight';
import AnalysisNine from '../components/Reports/AnalysisNine';
import AnalysisTen from '../components/Reports/FCUReports/AnalysisTen';
import Base_line_Survey from '../components/Reports/MFReports/Base_line_Survey/Base_line_Survey';
import BaselineEntomoligicalReport from '../components/Reports/EntomologicalAndLarvicidalReports/BaselineEntomoligicalReport';
import CoordinationcommitteReport from '../components/Reports/MDAReports/CoordinationcommitteReport';
import CoverageReport1 from '../components/Reports/MDAReports/CoverageReport1';
import DrugRequirementMDA from '../components/Reports/MDAReports/DrugRequirementMDA';
import FSUAnalysis1 from '../components/Reports/FSUReports/FSUAnalysis1';
import FSUAnalysis2 from '../components/Reports/FSUReports/FSUAnalysis2';
import FSUAnalysis2_Monthly from '../components/Reports/FSUAnalysis2_Monthly';
import FSUAnalysis3 from '../components/Reports/FSUReports/FSUAnalysis3';
import FSUAnalysis4 from '../components/Reports/FSUReports/FSUAnalysis4';
import FSUAnalysis5 from '../components/Reports/FSUReports/FSUAnalysis5';
import InfrastructureandTraining from '../components/Reports/MDAReports/InfrastructureandTraining';
import LarvalDensityReport from '../components/Reports/EntomologicalAndLarvicidalReports/LarvalDensityReport';
import LarvicidalReport1 from '../components/Reports/EntomologicalAndLarvicidalReports/LarvicidalReport1';
import MDATrainingstatus1 from '../components/Reports/MDAReports/MDATrainingstatus1';
import PostMDAevaluation1 from '../components/Reports/MDAReports/PostMDAevaluation1';
import PostMDAevaluation2 from '../components/Reports/MDAReports/PostMDAevaluation2/index';
import SAEReport from '../components/Reports/MDAReports/SAEReport';
import ProposalforwithdrawalofMDA from '../components/Reports/MDAReports/ProposalforwithdrawalofMDA';
import TASReport1 from '../components/Reports/TASReports/TASReport1';
import TASReport2 from '../components/Reports/TASReports/TASReport2';
import VerticalStockAnalysis from '../components/Reports/VerticalStockAnalysis';
import NFCUReportEntomology1 from '../components/Reports/EntomologicalAndLarvicidalReports/NFCUReportEntomology1';
import NFCUMosquitoDisectionReport2 from '../components/Reports/EntomologicalAndLarvicidalReports/NFCUMosquitoDisectionReport2';
import DiseaseCases from '../components/Analysis/LFandHydroceleAnalysis/DiseaseCases';
import Performanceofsurgeons from '../components/Analysis/LFandHydroceleAnalysis/PerformanceOfSurgeons';
import PatientsIneligibleForSurgery from '../components/Reports/PatientsIneligibleForSurgery';
import Performanceofinstitutes from '../components/Analysis/LFandHydroceleAnalysis/PerformanceOfInstitutes';
import HydroceleOperationLineList from '../components/Analysis/LFandHydroceleAnalysis/HydroceleOperationlinelist';
import Pendinghydrocelecases from '../components/Analysis/LFandHydroceleAnalysis/PendingHydroceleCases';
import MMDPActivityReport from '../components/Analysis/LFandHydroceleAnalysis/MMDPActivityReport';
import DiseaseRateVillageWise from '../components/Analysis/MFAnalysis/DiseaseRateVillageWise';
import VerifiedByMO from '../components/Analysis/LFandHydroceleAnalysis/VerifiedByMO';
import DrugAdminSupervisorAvaliability from '../components/Analysis/PlanningAndTraining/DrugAdminSupervisorAvaliability';
import PhcHrandTrainingStatus from '../components/Analysis/PlanningAndTraining/PhcHrAndTrainingStatus';
import PhcWiseDrugConsumption from '../components/Analysis/DrugStockAndConsumption/PhcWiseDrugConsumption';
import VspMonthlyVacancyStatus from '../components/Analysis/PlanningAndTraining/VspMonthlyVacancyStatus';
import VspTrainingStatus from '../components/Analysis/PlanningAndTraining/VspTrainingStatus';
import VspAvailabiltyConsumptionLabMaterials from '../components/Analysis/DrugStockAndConsumption/VspAvailabilityConsumptionLabMaterials';
import FSUPercentageTargetCompleted from '../components/Analysis/PlanningAndTraining/FSUPercentageTargetCompleted';
import BifurcationOfRegularAndMopUp from '../components/Analysis/MFAnalysis/BifurcationOfRegularAndMopUp';
import PlanningForOT from '../components/Analysis/PlanningAndTraining/PlanningForOT';
import ExpenditureBalanceReceivedFunds from '../components/Analysis/PlanningAndTraining/ExpenditureBalanceReceivedFunds';
import FollowUpServicesLFPatients from '../components/Analysis/LFandHydroceleAnalysis/FollowUpServicesLFPatients';
import FollowUpServicesHFPatients from '../components/Analysis/LFandHydroceleAnalysis/FollowUpServicesHFPatients';
import DrugStockAtPHC from '../components/Analysis/DrugStockAndConsumption/DrugStockAtPHC';
import DrugRequirementMDA2 from '../components/Reports/MDAReports/DrugRequirementMDA2';
import LFandHydroceleReports from '../components/Reports/LFandHydroceleReports';
import FSUReports from '../components/Reports/FSUReports';
import FCUReports from '../components/Reports/FCUReports';
import MFReports from '../components/Reports/MFReports';
import TASReports from '../components/Reports/TASReports';
import MDAReports from '../components/Reports/MDAReports';
import EntomologicalAndLarvicidalReports from '../components/Reports/EntomologicalAndLarvicidalReports';
import MISMTRReports from '../components/Reports/MIS-MTR-Reports';
import LFandHydroceleAnalysis from '../components/Analysis/LFandHydroceleAnalysis';
import MFAnalysis from '../components/Analysis/MFAnalysis';
import PlanningAndTraining from '../components/Analysis/PlanningAndTraining';
import DrugStockAndConsumption from '../components/Analysis/DrugStockAndConsumption';
// gallery
import Gallery from '../components/Home/Photo-Gallery';
import NewGallery from '../components/Home/Photo-Gallery';
import VideoGallery from '../components/Home/Video-Gallery';
import { userRoleScreenActivitiesUpdate } from '../../Website/components/WebLogin/siginslice';
import ChangePassword from '../components/ChangePassword/ChangePassword';
import UserProfile from '../components/UserProfile/UserProfile';
import PageNotFound from '../components/PageNotFound';
import InteractiveMap from '../../Components/InteractiveMap/InteractiveMap';

// toast-configuration method,
import HomeNew from '../components/Home/HomeNew';
import HomeNewsGallery from '../components/Home/Home-News-Gallery';
import HomeVideoGallery from '../components/Home/Home-Video-Gallery';
import HomePhotoGallery from '../components/Home/Home-Image-Gallery';
// read and view more
import HomeViewMore from '../components/Home/HomeViewMore';
import HomeReadMore from '../components/Home/HomeReadMore';

// New link for temp use


import NewReadMoreComponent from '../components/Home/read-more-component';
import NewMenudetails from '../components/Home/Menudetails';
import NewVideoGallery from '../components/Home/Video-Gallery';
import NewsGallery from '../components/Home/News-Gallery';
import NewNewsGallery from '../components/Home/News-Gallery';

import NewViewLymphedemaPatients from '../components/DataEntry/DE1-Lymphedema-Hydrocele-Patients/ViewLymphedemaPatients';
import NewAddLymphedemaPatients from '../components/DataEntry/DE1-Lymphedema-Hydrocele-Patients/AddLymphedemaPatients';
import NewViewPreMdaActivity from '../components/DataEntry/DE2-Pre-MDA-Activities/ViewPreMDAActivity';
import NewAddPreMdaActivity from '../components/DataEntry/DE2-Pre-MDA-Activities/AddPreMDAActivity';
import NewViewPostMDAThirdParty from '../components/DataEntry/DE5-Post-MDA-ThirdParty-Evaluation/ViewPostMDAThirdParty';
import NewAddPostMDAThirdParty from '../components/DataEntry/DE5-Post-MDA-ThirdParty-Evaluation/AddPostMDAThirdParty';
import NewAddMDAIECActivity from '../components/DataEntry/DE3-MDA-IEC-Activities/AddMdaIecActivity';
import NewListMDAIECActivity from '../components/DataEntry/DE3-MDA-IEC-Activities/listMdaIecActivity';
import NewViewCoverageReport from '../components/DataEntry/DE4-MDA-IDA-Coverages/ViewCoverageReport';
import NewAddCoverageReport from '../components/DataEntry/DE4-MDA-IDA-Coverages/AddCoverageReport';

import NewAddMappingOfOperationTheaters from '../components/DataEntry/DE6-Mapping-OperationTheatres/AddMappingofOperationTheaters';
import NewListMappingOfOperationTheaters from '../components/DataEntry/DE6-Mapping-OperationTheatres/ListMappingOfOperationTheaters';
import NewViewTASSurvey from '../components/DataEntry/DE7-TAS-Survey/ViewTASSurvey';
import NewAddTASSurvey from '../components/DataEntry/DE7-TAS-Survey/AddTASSurvey';
import NewViewMFPositive from '../components/DataEntry/DE8-MF-PositiveList/ViewMFPositive';
import NewAddMFPositive from '../components/DataEntry/DE8-MF-PositiveList/AddMFPositive';
import NewViewVerticalStockPosition from '../components/DataEntry/DE9-VerticalStockPosition/ViewVerticalStockPosition';
import NewAddVerticalUnitStockPosition from '../components/DataEntry/DE9-VerticalStockPosition/addVerticalUnitStock';
import NewAddStaffPosition from '../components/DataEntry/DE10-StaffPosition-VerticalUnit/addStaffPosition';
import NewViewStaffPosition from '../components/DataEntry/DE10-StaffPosition-VerticalUnit/viewStaffPosition';
import NewAddEntomologicalLarvicidal from '../components/DataEntry/DE11-Entomological-Larvicidal/AddEntomologicalLarvicidal';
import NewViewEntomologicalLarvicidal from '../components/DataEntry/DE11-Entomological-Larvicidal/ViewEntomologicalLarvicidal';
import NewAddFsuTarget from '../components/DataEntry/DE12-FSU-Targets/add-FusTarget';
import NewViewFusTarget from '../components/DataEntry/DE12-FSU-Targets/view-FusTarget';
import addHydrocelectomyOperations from '../components/DataEntry/DE13-HydrocelectomyOperations/AddHydrocelectomyOperations';
import viewHydrocelectomyOperations from '../components/DataEntry/DE13-HydrocelectomyOperations/ViewHydrocelectomyOperations';

// toast-configuration method,
// it is compulsory method.
toast.configure();

const AuthRoute = ({ component: Component, appProps, ...rest }: any) => {
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin,
  );
  const isAuthed = signinInfo.token;
  const routePath = useLocation();
  const onTop = () => {
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    onTop();
  }, [routePath]);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthed ? (
          // <Dashboardlogin>
          //   <Component {...props} />
          // </Dashboardlogin>
          <NewDashboardlogin>
            <Component {...props} />
          </NewDashboardlogin>
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  );
};

const Routes = () => {
  const isOnline = useOnlineStatus();
  //     useEffect(()=>{
  //       if(isOnline){
  //         FormMdaIdaCoveragesSyncService.syncOfflineData();
  //       }
  // },[isOnline])

  const dispatch = useDispatch();
  // window.addEventListener("onunload", function () {
  //   dispatch(onSignout());
  // })
  let DERoutes: any = [];
  let DESheetslist: any = {};
  let DESheetsadd: any = {};
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin,
  );
  const signinInfoId = signinInfo && signinInfo.data && signinInfo.data.id;
  const offlineScreens =
    signinInfo && signinInfo.data && signinInfo.data.userRoleScreenActivities;
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
              userRoleScreenActivitiesResponse.data,
            ),
          );
          setsignInScreenActivities(userRoleScreenActivitiesResponse.data);
        }
      } else {
        setsignInScreenActivities(offlineScreens);
      }
    }
  }
  useEffect(() => {
    GetUserRoleScreenActivities();
  }, [signinInfoId]);
  const signinScreens: any = [];
  if (signInScreenActivities && signInScreenActivities.length > 0) {
    signInScreenActivities.map((Obj: any) => {
      signinScreens.push(Obj && Obj.screen);
    });
  }

  for (let i = 1; i <= 13; i++) {
    if (signinScreens && signinScreens.length > 0) {
      signinScreens.map((element: any) => {
        if (element && element.screenCode === `DE${i}`) {
          DERoutes[i] = `DE${i}RouteName`;
          DESheetslist[DERoutes[i]] = '/' + element.urlPath;
          DESheetsadd[DERoutes[i]] = '/' + element.urlPath + '/add';
        }
      });
    }
  }
  return (
    <div className='App' id='wrapper'>
      <ToastContainer />
      <BrowserRouter>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Website}></Route>
          <Route path='/modalsignin' component={ModalSignin}></Route>
          <Route path='/videodetails' component={VideoReadMore}></Route>
          <Route path='/readMore' component={ReadMoreComponent}></Route>
          <Route path='/reportlist' component={Reportlist}></Route>
          <Route path='/gallery' component={Gallery}></Route>
          <Route path='/videogallery' component={VideoGallery}></Route>
          <Route path='/viewmore' component={ViewMore}></Route>
          <Route path='/menu_details' component={Menudetails}></Route>
          <Route path='/home_menu_details' component={HomeMenudetails}></Route>
          <Route path='/Homenewsgallery' component={HomeNewsGallery}></Route>
          <Route path='/HomePhotogallery' component={HomePhotoGallery}></Route>
          <Route path='/HomeVideogallery' component={HomeVideoGallery}></Route>
          <Route path='/homepageNew' component={HomeNew}></Route>
          <Route path='/Homeviewmore' component={HomeViewMore}></Route>
          <Route path='/Homereadmore' component={HomeReadMore}></Route>
          {/* <AuthRoute path="/mymap" component={MapPage} /> */}
          {/* <AuthRoute path="/map" component={MaharastraMap} /> */}
          <AuthRoute path='/webdashboard' component={WebDashboard} />
          {/* <AuthRoute
            path='/additionalMFSurveyReport'
            component={Additional_MF_Survey_Report}
          />
          <AuthRoute
            path='/additionalEntomologicalReport'
            component={AdditionalEntomologicalReport}
          />
          <AuthRoute
            path='/analysisLymphedemaLinelist'
            component={AnalysisLymphedemaLinelist}
          />
          <AuthRoute path='/analysis1' component={Analysis1} />
          <AuthRoute path='/analysis2' component={Analysis2} />
          <AuthRoute path='/analysis3' component={Analysis3} />
          <AuthRoute path='/analysisone' component={AnalysisOne} />
          <AuthRoute path='/analysistwo' component={AnalysisTwo} />
          <AuthRoute path='/analysisthee' component={AnalysisThree} />
          <AuthRoute path='/analysisfour' component={AnalysisFour} />
          <AuthRoute path='/analysisfive' component={AnalysisFive} />
          <AuthRoute path='/analysissix' component={AnalysisSix} />
          <AuthRoute path='/analysisseven' component={AnalysisSeven} />
          <AuthRoute path='/analysisEight' component={AnalysisEight} />
          <AuthRoute path='/analysisnine' component={AnalysisNine} />
          <AuthRoute path='/analysisten' component={AnalysisTen} />
          <AuthRoute path='/base_line_Survey' component={Base_line_Survey} />
          <AuthRoute
            path='/baselineEntomoligicalReport'
            component={BaselineEntomoligicalReport}
          />
          <AuthRoute
            path='/coordinationcommitteReport'
            component={CoordinationcommitteReport}
          />
          <AuthRoute path='/coverageReport1' component={CoverageReport1} />
          <AuthRoute
            path='/drugRequirementMDA'
            component={DrugRequirementMDA}
          />
          <AuthRoute path='/diseaseCases' component={DiseaseCases} />
          <AuthRoute path='/fsuAnalysis1' component={FSUAnalysis1} />
          <AuthRoute path='/fsuAnalysis2' component={FSUAnalysis2} />
          <AuthRoute
            path='/fsuAnalysis2_Monthly'
            component={FSUAnalysis2_Monthly}
          />
          <AuthRoute path='/fsuAnalysis3' component={FSUAnalysis3} />
          <AuthRoute path='/fsuAnalysis4' component={FSUAnalysis4} />
          <AuthRoute path='/fsuAnalysis5' component={FSUAnalysis5} />
          <AuthRoute
            path='/infrastructureandTraining'
            component={InfrastructureandTraining}
          />
          <AuthRoute
            path='/larvalDensityReport'
            component={LarvalDensityReport}
          />
          <AuthRoute
            path='/mdaTrainingstatus1'
            component={MDATrainingstatus1}
          />
          <AuthRoute
            path='/nfcuMosquitoDisectionReport'
            component={NFCUReportEntomology1}
          />
          <AuthRoute
            path='/nfcuMosquitoDisectionReport2'
            component={NFCUMosquitoDisectionReport2}
          />
          <AuthRoute path='/larvicidalReport1' component={LarvicidalReport1} />
          <AuthRoute
            path='/postMDAevaluation1'
            component={PostMDAevaluation1}
          />
          <AuthRoute
            path='/postMDAevaluation2'
            component={PostMDAevaluation2}
          />
          <AuthRoute
            path='/proposalforwithdrawalofMDA'
            component={ProposalforwithdrawalofMDA}
          />
          <AuthRoute path='/saeReport' component={SAEReport} />
          <AuthRoute path='/tasReport1' component={TASReport1} />
          <AuthRoute path='/tasReport2' component={TASReport2} />
          <AuthRoute
            path='/verticalStockAnalysis'
            component={VerticalStockAnalysis}
          />
          <AuthRoute
            path='/performanceofsurgeons'
            component={Performanceofsurgeons}
          />{' '}
          <AuthRoute
            path='/performanceofinstitutes'
            component={Performanceofinstitutes}
          />
          <AuthRoute
            path='/hydroceleoperationlinelist'
            component={HydroceleOperationLineList}
          />
          <AuthRoute
            path='/pendinghydrocelecases'
            component={Pendinghydrocelecases}
          />
          <AuthRoute
            path='/mmdpactivityreporting'
            component={MMDPActivityReport}
          />
          <AuthRoute
            path='/patientsIneligibleForSurgery'
            component={PatientsIneligibleForSurgery}
          />
          <AuthRoute
            path='/diseaseRateVillageWise'
            component={DiseaseRateVillageWise}
          />
          <AuthRoute path='/verifiedByMO' component={VerifiedByMO} />
          <AuthRoute
            path='/drugAdminSupervisorAvaliability'
            component={DrugAdminSupervisorAvaliability}
          />
          <AuthRoute
            path='/phcHrAndTrainingStatus'
            component={PhcHrandTrainingStatus}
          />
          <AuthRoute
            path='/phcWiseDrugConsumption'
            component={PhcWiseDrugConsumption}
          />
          <AuthRoute
            path='/vspMonthlyVacancyStatus'
            component={VspMonthlyVacancyStatus}
          />
          <AuthRoute
            path='/vspAvailabilityConsumptionLabMaterials'
            component={VspAvailabiltyConsumptionLabMaterials}
          />
          <AuthRoute path='/vspTrainingStatus' component={VspTrainingStatus} />
          <AuthRoute
            path='/FSUPercentageTargetCompleted'
            component={FSUPercentageTargetCompleted}
          />
          <AuthRoute
            path='/bifurcationOfRoundAndMopUp'
            component={BifurcationOfRegularAndMopUp}
          />
          <AuthRoute path='/planningForOT' component={PlanningForOT} />
          <AuthRoute
            path='/expenditureBalanceReceivedFunds'
            component={ExpenditureBalanceReceivedFunds}
          />
          <AuthRoute
            path='/followUpServicesLFPatients'
            component={FollowUpServicesLFPatients}
          />
          <AuthRoute
            path='/followUpServicesHFPatients'
            component={FollowUpServicesHFPatients}
          />
          <AuthRoute
            path='/drugRequirementMDA2'
            component={DrugRequirementMDA2}
          />
          <AuthRoute
            path='/lfAndHydroceleReports'
            component={LFandHydroceleReports}
          />
          <AuthRoute
            path='/lfAndHydroceleAnalysis'
            component={LFandHydroceleAnalysis}
          />
          <AuthRoute path='/drugStockAtPHC' component={DrugStockAtPHC} />
          <AuthRoute path='/fsuReports' component={FSUReports} />
          <AuthRoute path='/fcuReports' component={FCUReports} />
          <AuthRoute path='/mfReports' component={MFReports} />
          <AuthRoute path='/tasReports' component={TASReports} />
          <AuthRoute path='/mdaReports' component={MDAReports} />
          <AuthRoute
            path='/entomologicalAndLarvicidalReports'
            component={EntomologicalAndLarvicidalReports}
          />
          <AuthRoute path='/mfAnalysis' component={MFAnalysis} />
          <AuthRoute
            path='/planningAndTrainingAnalysis'
            component={PlanningAndTraining}
          />
          <AuthRoute
            path='/drugStockAndConsumption'
            component={DrugStockAndConsumption}
          /> */}
          <AuthRoute
            exact
            path='/endemicitymap'
            component={InteractiveMap}></AuthRoute>
          <Route exact path='/' component={Website}></Route>
          <Route exact path='/newhome' component={Website}></Route>
          <Route path='/modalsignin' component={ModalSignin}></Route>
          <Route path='/videodetails' component={VideoReadMore}></Route>
          <Route path='/readMore' component={ReadMoreComponent}></Route>
          <Route path='/viewmore' component={ViewMore}></Route>
          <Route path='/forgot-password' component={ForgotPassword} />
          <Route path='/forgetpassword' component={ForgetPasswordModal} />
          <Route path='/404error' component={PageNotFound} />
          {/* <AuthRoute path="/mymap" component={MapPage}></AuthRoute> */}
          {/* <AuthRoute path="/map" component={MaharastraMap}></AuthRoute> */}
          <AuthRoute path='/webdashboard' component={WebDashboard}></AuthRoute>
          <AuthRoute
            path='/ChangePassword'
            component={ChangePassword}></AuthRoute>
          <AuthRoute path='/UserProfile' component={UserProfile}></AuthRoute>
          {/* New paths for temp use start*/}
          <Route path='/newgallery' component={NewGallery}></Route>
          <Route path='/newvideogallery' component={NewVideoGallery}></Route>
          <Route path='/newsgallery' component={NewsGallery}></Route>
          <Route path='/newnewsgallery' component={NewNewsGallery}></Route>
          <Route path='/newmenu_details' component={NewMenudetails}></Route>
          <Route path='/newreadMore' component={NewReadMoreComponent}></Route>
          <AuthRoute
            path='/additionalMFSurveyReportnew'
            component={Additional_MF_Survey_Report}
          />
          <AuthRoute
            path='/additionalEntomologicalReportnew'
            component={AdditionalEntomologicalReport}
          />
          <AuthRoute
            path='/analysisLymphedemaLinelistnew'
            component={AnalysisLymphedemaLinelist}
          />
          <AuthRoute path='/analysis1new' component={Analysis1} />
          <AuthRoute path='/analysis2new' component={Analysis2} />
          <AuthRoute path='/analysis3new' component={Analysis3} />
          <AuthRoute path='/analysisonenew' component={AnalysisOne} />
          <AuthRoute path='/analysistwonew' component={AnalysisTwo} />
          <AuthRoute path='/analysistheenew' component={AnalysisThree} />
          <AuthRoute path='/analysisfournew' component={AnalysisFour} />
          <AuthRoute path='/analysisfivenew' component={AnalysisFive} />
          <AuthRoute path='/analysissixnew' component={AnalysisSix} />
          <AuthRoute path='/analysissevennew' component={AnalysisSeven} />
          <AuthRoute path='/analysisEightnew' component={AnalysisEight} />
          <AuthRoute path='/analysisninenew' component={AnalysisNine} />
          <AuthRoute path='/analysistennew' component={AnalysisTen} />
          <AuthRoute path='/base_line_Surveynew' component={Base_line_Survey} />
          <AuthRoute
            path='/baselineEntomoligicalReportnew'
            component={BaselineEntomoligicalReport}
          />
          <AuthRoute
            path='/coordinationcommitteReportnew'
            component={CoordinationcommitteReport}
          />
          <AuthRoute path='/coverageReport1new' component={CoverageReport1} />
          <AuthRoute
            path='/drugRequirementMDAnew'
            component={DrugRequirementMDA}
          />
          <AuthRoute path='/diseaseCasesnew' component={DiseaseCases} />
          <AuthRoute path='/fsuAnalysis1new' component={FSUAnalysis1} />
          <AuthRoute path='/fsuAnalysis2new' component={FSUAnalysis2} />
          <AuthRoute
            path='/fsuAnalysis2_Monthlynew'
            component={FSUAnalysis2_Monthly}
          />
          <AuthRoute path='/fsuAnalysis3new' component={FSUAnalysis3} />
          <AuthRoute path='/fsuAnalysis4new' component={FSUAnalysis4} />
          <AuthRoute path='/fsuAnalysis5new' component={FSUAnalysis5} />
          <AuthRoute
            path='/infrastructureandTrainingnew'
            component={InfrastructureandTraining}
          />
          <AuthRoute
            path='/larvalDensityReportnew'
            component={LarvalDensityReport}
          />
          <AuthRoute
            path='/mdaTrainingstatus1new'
            component={MDATrainingstatus1}
          />
          <AuthRoute
            path='/nfcuMosquitoDisectionReportnew'
            component={NFCUReportEntomology1}
          />
          <AuthRoute
            path='/nfcuMosquitoDisectionReport2new'
            component={NFCUMosquitoDisectionReport2}
          />
          <AuthRoute
            path='/larvicidalReport1new'
            component={LarvicidalReport1}
          />
          <AuthRoute
            path='/postMDAevaluation1new'
            component={PostMDAevaluation1}
          />
          <AuthRoute
            path='/postMDAevaluation2new'
            component={PostMDAevaluation2}
          />
          <AuthRoute
            path='/proposalforwithdrawalofMDAnew'
            component={ProposalforwithdrawalofMDA}
          />
          <AuthRoute path='/saeReportnew' component={SAEReport} />
          <AuthRoute path='/tasReport1new' component={TASReport1} />
          <AuthRoute path='/tasReport2new' component={TASReport2} />
          <AuthRoute
            path='/verticalStockAnalysisnew'
            component={VerticalStockAnalysis}
          />
          <AuthRoute
            path='/performanceofsurgeonsnew'
            component={Performanceofsurgeons}
          />
          <AuthRoute
            path='/performanceofinstitutesnew'
            component={Performanceofinstitutes}
          />
          <AuthRoute
            path='/hydroceleoperationlinelistnew'
            component={HydroceleOperationLineList}
          />
          <AuthRoute
            path='/pendinghydrocelecasesnew'
            component={Pendinghydrocelecases}
          />
          <AuthRoute
            path='/mmdpactivityreportingnew'
            component={MMDPActivityReport}
          />
          <AuthRoute
            path='/patientsIneligibleForSurgerynew'
            component={PatientsIneligibleForSurgery}
          />
          <AuthRoute
            path='/diseaseRateVillageWisenew'
            component={DiseaseRateVillageWise}
          />
          <AuthRoute path='/verifiedByMOnew' component={VerifiedByMO} />
          <AuthRoute
            path='/drugAdminSupervisorAvaliabilitynew'
            component={DrugAdminSupervisorAvaliability}
          />
          <AuthRoute
            path='/phcHrAndTrainingStatusnew'
            component={PhcHrandTrainingStatus}
          />
          <AuthRoute
            path='/phcWiseDrugConsumptionnew'
            component={PhcWiseDrugConsumption}
          />
          <AuthRoute
            path='/vspMonthlyVacancyStatusnew'
            component={VspMonthlyVacancyStatus}
          />
          <AuthRoute
            path='/vspAvailabilityConsumptionLabMaterialsnew'
            component={VspAvailabiltyConsumptionLabMaterials}
          />
          <AuthRoute
            path='/vspTrainingStatusnew'
            component={VspTrainingStatus}
          />
          <AuthRoute
            path='/FSUPercentageTargetCompletednew'
            component={FSUPercentageTargetCompleted}
          />
          <AuthRoute
            path='/bifurcationOfRoundAndMopUpnew'
            component={BifurcationOfRegularAndMopUp}
          />
          <AuthRoute path='/planningForOTnew' component={PlanningForOT} />
          <AuthRoute
            path='/expenditureBalanceReceivedFundsnew'
            component={ExpenditureBalanceReceivedFunds}
          />
          <AuthRoute
            path='/followUpServicesLFPatientsnew'
            component={FollowUpServicesLFPatients}
          />
          <AuthRoute
            path='/followUpServicesHFPatientsnew'
            component={FollowUpServicesHFPatients}
          />
          <AuthRoute
            path='/drugRequirementMDA2new'
            component={DrugRequirementMDA2}
          />
          <AuthRoute
            path='/lfAndHydroceleReportsnew'
            component={LFandHydroceleReports}
          />
          <AuthRoute
            path='/lfAndHydroceleAnalysisnew'
            component={LFandHydroceleAnalysis}
          />
          <AuthRoute path='/drugStockAtPHCnew' component={DrugStockAtPHC} />
          <AuthRoute path='/fsuReportsnew' component={FSUReports} />
          <AuthRoute path='/fcuReportsnew' component={FCUReports} />
          <AuthRoute path='/mfReportsnew' component={MFReports} />
          <AuthRoute path='/tasReportsnew' component={TASReports} />
          <AuthRoute path='/mdaReportsnew' component={MDAReports} />
          <AuthRoute
            path='/entomologicalAndLarvicidalReportsnew'
            component={EntomologicalAndLarvicidalReports}
          /><AuthRoute
          path='/mis-mtr-reportsnew'
          component={MISMTRReports}
        />
          <AuthRoute path='/mfAnalysisnew' component={MFAnalysis} />
          <AuthRoute
            path='/planningAndTrainingAnalysisnew'
            component={PlanningAndTraining}
          />
          <AuthRoute
            path='/drugStockAndConsumptionnew'
            component={DrugStockAndConsumption}
          />
          <AuthRoute
            exact
            path='/endemicitymapnew'
            component={InteractiveMap}></AuthRoute>
          <Route exact path='/new' component={Website}></Route>
          <Route exact path='/newhomenew' component={Website}></Route>
          <Route path='/modalsigninnew' component={ModalSignin}></Route>
          <Route path='/videodetailsnew' component={VideoReadMore}></Route>
          <Route path='/readMorenew' component={ReadMoreComponent}></Route>
          <Route path='/viewmorenew' component={ViewMore}></Route>
          <Route path='/forgot-passwordnew' component={ForgotPassword} />
          <Route path='/forgetpasswordnew' component={ForgetPasswordModal} />
          <Route path='/404errornew' component={PageNotFound} />
          {/* <AuthRoute path="/mymap" component={MapPage}></AuthRoute> */}
          {/* <AuthRoute path="/map" component={MaharastraMap}></AuthRoute> */}
          <AuthRoute
            path='/webdashboardnew'
            component={WebDashboard}></AuthRoute>
          <AuthRoute
            path='/ChangePasswordnew'
            component={ChangePassword}></AuthRoute>
          <AuthRoute path='/UserProfilenew' component={UserProfile}></AuthRoute>
          <AuthRoute
            exact
            path='/lymphedema-hydrocele-patients'
            component={NewViewLymphedemaPatients}></AuthRoute>
          <AuthRoute
            path='/lymphedema-hydrocele-patients/add'
            component={NewAddLymphedemaPatients}></AuthRoute>
          <AuthRoute
            exact
            path='/pre-mda-activities'
            component={NewViewPreMdaActivity}></AuthRoute>
          <AuthRoute
            path='/pre-mda-activities/add'
            component={NewAddPreMdaActivity}></AuthRoute>
          <AuthRoute
            exact
            path='/mda-iec-activities'
            component={NewListMDAIECActivity}></AuthRoute>
          <AuthRoute
            path='/mda-iec-activities/add'
            component={NewAddMDAIECActivity}></AuthRoute>
          <AuthRoute
            exact
            path='/mda-ida-coverages'
            component={NewViewCoverageReport}></AuthRoute>
          <AuthRoute
            path='/mda-ida-coverages/add'
            component={NewAddCoverageReport}></AuthRoute>
          <AuthRoute
            exact
            path='/post-mda-thirdparty-evaluation'
            component={NewViewPostMDAThirdParty}></AuthRoute>
          <AuthRoute
            path='/post-mda-thirdparty-evaluation/add'
            component={NewAddPostMDAThirdParty}></AuthRoute>
          <AuthRoute
            exact
            path='/mapping-operationtheatres'
            component={NewListMappingOfOperationTheaters}></AuthRoute>
          <AuthRoute
            path='/mapping-operationtheatres/add'
            component={NewAddMappingOfOperationTheaters}></AuthRoute>
          <AuthRoute
            exact
            path='/tas-survey'
            component={NewViewTASSurvey}></AuthRoute>
          <AuthRoute
            path='/tas-survey/add'
            component={NewAddTASSurvey}></AuthRoute>
          <AuthRoute
            exact
            path='/mf-positive-list'
            component={NewViewMFPositive}></AuthRoute>
          <AuthRoute
            path='/mf-positive-list/add'
            component={NewAddMFPositive}></AuthRoute>
          <AuthRoute
            exact
            path='/vertical-stock-position'
            component={NewViewVerticalStockPosition}></AuthRoute>
          <AuthRoute
            path='/vertical-stock-position/add'
            component={NewAddVerticalUnitStockPosition}></AuthRoute>
          <AuthRoute
            exact
            path='/staff-position-vertical-unit'
            component={NewViewStaffPosition}></AuthRoute>
          <AuthRoute
            path='/staff-position-vertical-unit/add'
            component={NewAddStaffPosition}></AuthRoute>
          <AuthRoute
            exact
            path='/entomological-larvicidal'
            component={NewViewEntomologicalLarvicidal}></AuthRoute>
          <AuthRoute
            path='/entomological-larvicidal/add'
            component={NewAddEntomologicalLarvicidal}></AuthRoute>{' '}
          <AuthRoute
            exact
            path='/fus-targets'
            component={NewViewFusTarget}></AuthRoute>
          <AuthRoute
            path='/fus-targets/add'
            component={NewAddFsuTarget}></AuthRoute>{' '}
          <AuthRoute
            exact
            path='/hydrocelectomy-operations'
            component={viewHydrocelectomyOperations}></AuthRoute>
          <AuthRoute
            path='/hydrocelectomy-operations/add'
            component={addHydrocelectomyOperations}></AuthRoute>{' '}
          {/* New paths for temp use end*/}

          {/* {DESheetslist && DESheetslist.DE1RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE1RouteName}
              component={ViewLymphedemaPatients}></AuthRoute>
          )}
          {DESheetslist && DESheetslist.DE2RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE2RouteName}
              component={ViewPreMdaActivity}></AuthRoute>
          )}
          {DESheetslist && DESheetslist.DE3RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE3RouteName}
              component={ListMDAIECActivity}></AuthRoute>
          )}
          {DESheetslist && DESheetslist.DE4RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE4RouteName}
              component={ViewCoverageReport}></AuthRoute>
          )}
          {DESheetslist && DESheetslist.DE5RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE5RouteName}
              component={ViewPostMDAThirdParty}></AuthRoute>
          )}
          {DESheetslist && DESheetslist.DE6RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE6RouteName}
              component={ListMappingOfOperationTheaters}></AuthRoute>
          )}
          {DESheetslist && DESheetslist.DE7RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE7RouteName}
              component={ViewTASSurvey}></AuthRoute>
          )}
          {DESheetslist && DESheetslist.DE8RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE8RouteName}
              component={ViewMFPositive}></AuthRoute>
          )}
          {DESheetslist && DESheetslist.DE9RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE9RouteName}
              component={ViewVerticalStockPosition}></AuthRoute>
          )}
          {DESheetslist && DESheetslist.DE10RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE10RouteName}
              component={ViewStaffPosition}></AuthRoute>
          )}
          {DESheetslist && DESheetslist.DE11RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE11RouteName}
              component={ViewEntomologicalLarvicidal}></AuthRoute>
          )}
          {DESheetslist && DESheetslist.DE12RouteName && (
            <AuthRoute
              exact
              path={DESheetslist && DESheetslist.DE12RouteName}
              component={ViewFusTarget}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE1RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE1RouteName}
              component={AddLymphedemaPatients}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE2RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE2RouteName}
              component={AddPreMdaActivity}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE3RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE3RouteName}
              component={AddMDAIECActivity}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE4RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE4RouteName}
              component={AddCoverageReport}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE5RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE5RouteName}
              component={AddPostMDAThirdParty}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE6RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE6RouteName}
              component={AddMappingOfOperationTheaters}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE7RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE7RouteName}
              component={AddTASSurvey}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE8RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE8RouteName}
              component={AddMFPositive}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE9RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE9RouteName}
              component={AddVerticalUnitStockPosition}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE10RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE10RouteName}
              component={AddStaffPosition}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE11RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE11RouteName}
              component={AddEntomologicalLarvicidal}></AuthRoute>
          )}
          {DESheetsadd && DESheetsadd.DE12RouteName && (
            <AuthRoute
              path={DESheetsadd && DESheetsadd.DE12RouteName}
              component={AddFsuTarget}></AuthRoute>
          )} */}
        </Switch>
      </Router>
      </BrowserRouter>
    </div>
  );
};
export default Routes;
