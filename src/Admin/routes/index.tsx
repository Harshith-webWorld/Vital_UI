import React from 'react';
import { Switch, Route, Router, Redirect } from 'react-router-dom';
import Login from '../components/Login/login';
import Dashboardadmin from '../components/dashboard/dashboard';
import history from '../../helpers/history';
import { useOnlineStatus } from '../../helpers/networkconnection';
import WebsiteNewsAddList from '../components/website-news/website-newslist';
import WebsiteNewsForm from '../components/website-news/add-websitenewslist';
import WebsiteProgramInfosform from '../components/website-ProgramInfos/add-websiteProgramInfos';
import WebsiteProgramInfosList from '../components/website-ProgramInfos/list-websiteProgramInfos';
import WebsiteVideoform from '../components/website-video/add-websitevideo';
import WebsiteVideoList from '../components/website-video/list-websitevideo';
import WebsiteFaqsform from '../components/website-FAQ/add-websitefaq';
import WebsiteFaqsList from '../components/website-FAQ/list-websitefaq';
import { useSelector } from 'react-redux';
import WebsiteImageform from '../components/website-images/add-websiteimage';
import WebsiteImageList from '../components/website-images/website-imagelist';
import UserManagement from '../components/UserManagement/users';
import ListUsers from '../components/UserManagement/usersList';
import ListMenus from '../components/website-OthersMenu/website-OthersMenuList';
import addOthersMenu from '../components/website-OthersMenu/add-websiteOthersMenu';
import SiteSettings from '../components/website-settings/website-settingsList';
import addSiteSettings from '../components/website-settings/add-websitesettings';
import districtlists from '../components/districts';
import DistrictForm from '../components/districts/add-district';
import TalukaLists from '../components/talukas';
import TalukaForm from '../components/talukas/add-taluka';
import FacilitiesList from '../components/facilities';
import FacilityForm from '../components/facilities/add-facility';
import SubcenterList from '../components/subcenters';
import SubcenterForm from '../components/subcenters/add-subcenter';
import VerticalControlUnitList from '../components/verticalcontrolunit';
import VerticalControlUnitForm from '../components/verticalcontrolunit/add-verticalControlUnit';
import VillageList from '../components/villages';
import VillageForm from '../components/villages/add-village';
import InteractiveMap from '../../Components/InteractiveMap/InteractiveMap';
import MFChart from '../components/Graphs/MFRateGraph';
import EndemicityGraph from '../components/Graphs/EndemicityGraph';
import LFCasesGraph from '../components/Graphs/LFCasesGraph';
import DashboardLayout from '../../Components/NewDashboard';

const AuthRoute = ({ component: Component, ...rest }: any) => {
  const user: any = useSelector((state: any) => state);
  const isAuthed = user?.Admin?.login?.entities?.token;
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthed ? (
          <Dashboardadmin>
            <Component {...props} />
          </Dashboardadmin>
        ) : (
          <Redirect
            to={{ pathname: '/admin', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

const Routes = () => {
  const isOnline = useOnlineStatus();

  return (
    <div className='App' id='wrapper'>
      <Router history={history}>
        <Switch>
          {/* Admin Routes */}
          <Route exact path='/admin' component={Login}></Route>
          <AuthRoute path='/endemicityGraph' component={EndemicityGraph} />
          <AuthRoute path='/lfchart' component={LFCasesGraph} />
          <AuthRoute path='/mfChart' component={MFChart} />
          <AuthRoute path='/dashboardadmin' component={DashboardLayout} />
          <AuthRoute path='/newsList' component={WebsiteNewsAddList} />
          <AuthRoute path='/newsForm' component={WebsiteNewsForm} />
          <AuthRoute path='/imageList' component={WebsiteImageList} />
          <AuthRoute path='/imageForm' component={WebsiteImageform} />
          <AuthRoute
            path='/programInfosForm'
            component={WebsiteProgramInfosform}
          />
          <AuthRoute
            path='/programInfosList'
            component={WebsiteProgramInfosList}
          />
          <AuthRoute path='/AddVideoForm' component={WebsiteVideoform} />
          <AuthRoute path='/videoList' component={WebsiteVideoList} />
          <AuthRoute path='/faqsForm' component={WebsiteFaqsform} />
          <AuthRoute path='/faqsList' component={WebsiteFaqsList} />
          <AuthRoute path='/users' component={UserManagement} />
          <AuthRoute path='/listUsers' component={ListUsers} />
          <AuthRoute path='/listMenu' component={ListMenus} />
          <AuthRoute path='/addMenu' component={addOthersMenu} />
          <AuthRoute path='/siteSettings' component={SiteSettings} />
          <AuthRoute path='/addsiteSettings' component={addSiteSettings} />
          <AuthRoute path='/districtList' component={districtlists} />
          <AuthRoute path='/districtForm' component={DistrictForm} />
          <AuthRoute path='/talukaList' component={TalukaLists} />
          <AuthRoute path='/talukaForm' component={TalukaForm} />
          <AuthRoute path='/facilityList' component={FacilitiesList} />
          <AuthRoute path='/facilityForm' component={FacilityForm} />
          <AuthRoute path='/subcenterList' component={SubcenterList} />
          <AuthRoute path='/subcenterForm' component={SubcenterForm} />
          <AuthRoute path='/villageList' component={VillageList} />
          <AuthRoute path='/villageForm' component={VillageForm} />
          <AuthRoute
            path='/VerticalControlUnitList'
            component={VerticalControlUnitList}
          />
          <AuthRoute
            path='/VerticalControlUnitForm'
            component={VerticalControlUnitForm}
          />
          <AuthRoute exact path='/endemicitymapadmin' component={InteractiveMap} />
        </Switch>
      </Router> 
    </div>
  );
};
export default Routes;
