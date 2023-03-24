import React from 'react';
import Header from '../header/header';
import Sidebar from '../sidebar/sidebar';
import '../../assets/scss/admin.scss';
import { Route, Switch } from 'react-router-dom';
import WebsiteNewsList from '../website-news/website-newslist';
import WebsiteNewsform from '../website-news/add-websitenewslist';
import WebsiteImageList from '../website-images/website-imagelist';
import WebsiteImageform from '../website-images/add-websiteimage';
import WebsiteProgramInfosform from '../website-ProgramInfos/add-websiteProgramInfos';
import WebsiteProgramInfosList from '../website-ProgramInfos/list-websiteProgramInfos';
import WebsiteVideoform from '../website-video/add-websitevideo';
import WebsiteVideoList from '../website-video/list-websitevideo';
import WebsiteFaqsform from '../website-FAQ/add-websitefaq';
import WebsiteFaqsList from '../website-FAQ/list-websitefaq';
import UserManagement from '../UserManagement/users';
import ListUser from '../UserManagement/usersList';
import ListMenu from '../../components/website-OthersMenu/website-OthersMenuList';
import AddOthersMenu from '../../components/website-OthersMenu/add-websiteOthersMenu';
import ListSiteSettings from '../../components/website-settings/website-settingsList';
import AddSiteSettings from '../../components/website-settings/add-websitesettings';
import Login from '../../components/Login/login';
import DistrictList from '../../components/districts';
import DistictForm from '../districts/add-district';
import TalukaList from '../../components/talukas';
import TalukaForm from '../talukas/add-taluka';
import FacilitiesList from '../facilities';
import FacilityForm from '../facilities/add-facility';
import SubcenterList from '../subcenters';
import SubcenterForm from '../subcenters/add-subcenter';
import VillageList from '../villages';
import VillageForm from '../villages/add-village';
import VerticalControlUnitList from '../verticalcontrolunit';
import VerticalControlUnitForm from '../verticalcontrolunit/add-verticalControlUnit';
import InteractiveMap from '../../../Components/InteractiveMap/InteractiveMap';
import MFChart from '../Graphs/MFRateGraph';
import LFCasesGraph from '../Graphs/LFCasesGraph';
import EndemicityGraph from '../Graphs/EndemicityGraph';
import DashboardLayout from '../../../Components/NewDashboard';

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className='ad-wrapper'>
        {/* Sidebar */}
        <Sidebar></Sidebar>
        {/* Main content section */}
        <div className='ad-mainpanel'>
          {/* header */}
          <Header></Header>
          <div className='container-fluid'>
            <Switch>
              <Route exact path={`/admin`}>
                <Login />
              </Route>
              <Route path={`/endemicityGraph`}>
                <EndemicityGraph />
              </Route>
              <Route path={`/lfchart`}>
                <LFCasesGraph />
              </Route>{' '}
              <Route path={`/mfChart`}>
                <MFChart />
              </Route>
              <Route path={`/dashboardadmin`}>
                <DashboardLayout />
              </Route>
              <Route path={`/newsList`}>
                <WebsiteNewsList />
              </Route>
              <Route path={`/newsForm`}>
                <WebsiteNewsform />
              </Route>
              <Route path={`/imageList`}>
                <WebsiteImageList />
              </Route>
              <Route path={`/imageForm`}>
                <WebsiteImageform />
              </Route>
              <Route path={`/programInfosForm`}>
                <WebsiteProgramInfosform />
              </Route>
              <Route path={`/programInfosList`}>
                <WebsiteProgramInfosList />
              </Route>
              <Route path={`/AddVideoForm`}>
                <WebsiteVideoform />
              </Route>
              <Route path={`/videoList`}>
                <WebsiteVideoList />
              </Route>
              <Route path={`/faqsForm`}>
                <WebsiteFaqsform />
              </Route>
              <Route path={`/faqsList`}>
                <WebsiteFaqsList />
              </Route>
              <Route path={`/users`}>
                <UserManagement />
              </Route>
              <Route path={`/listUsers`}>
                <ListUser />
              </Route>
              <Route path={`/listMenu`}>
                <ListMenu />
              </Route>
              <Route path={`/addMenu`}>
                <AddOthersMenu />
              </Route>{' '}
              <Route path={`/siteSettings`}>
                <ListSiteSettings />
              </Route>
              <Route path={`/addsiteSettings`}>
                <AddSiteSettings />
              </Route>
              <Route path={`/districtList`}>
                <DistrictList />
              </Route>
              <Route path={`/districtForm`}>
                <DistictForm />
              </Route>
              <Route path={`/talukaList`}>
                <TalukaList />
              </Route>
              <Route path={`/talukaForm`}>
                <TalukaForm />
              </Route>
              <Route path={`/facilityList`}>
                <FacilitiesList />
              </Route>
              <Route path={`/facilityForm`}>
                <FacilityForm />
              </Route>
              <Route path={`/subcenterList`}>
                <SubcenterList />
              </Route>
              <Route path={`/subcenterForm`}>
                <SubcenterForm />
              </Route>
              <Route path={`/villageList`}>
                <VillageList />
              </Route>
              <Route path={`/villageForm`}>
                <VillageForm />
              </Route>
              <Route path={`/VerticalControlUnitList`}>
                <VerticalControlUnitList />
              </Route>
              <Route path={`/VerticalControlUnitForm`}>
                <VerticalControlUnitForm />
              </Route>
              <Route  exact path={`/endemicitymapadmin`}>
                <InteractiveMap />
              </Route>
            </Switch>
          </div>
          {/* Content */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
