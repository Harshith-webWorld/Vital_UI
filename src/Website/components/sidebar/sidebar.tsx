import React, { useState, useEffect } from "react";
import "../../assets/sass/main.scss";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import { Link } from "react-router-dom";
import { userRoleScreenActivitiesUpdate } from '../WebLogin/siginslice';
import { ProSidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import Accordion from "react-bootstrap/Accordion";
import { useSelector,useDispatch } from "react-redux";
import userService from "../../../helpers/services/userService";
import { Item } from "react-bootstrap/lib/Breadcrumb";
import { sidebarInterface } from "../../interfaces/sidebarInterface";
import { useLocation } from "react-router-dom";

// export function Sidebar() {
const Sidebar: React.FC = () => {
 
  const dispatch = useDispatch();
  const signinInfo = useSelector( (state: any) => state && state.Admin && state.Admin.signin);
  const signinInfoId = signinInfo && signinInfo.data && signinInfo.data.id;
  const offlineScreens = signinInfo && signinInfo.data && signinInfo.data.userRoleScreenActivities;
  const isOnline = window.navigator.onLine;
  const [signInScreenActivities,setsignInScreenActivities] = useState([]);
  async function GetUserRoleScreenActivities(){
    if(signinInfoId){
      if(isOnline){
      const userRoleScreenActivitiesResponse = await userService.getUserRoleActivities(signinInfoId);
      if(userRoleScreenActivitiesResponse && userRoleScreenActivitiesResponse.data){
        dispatch(userRoleScreenActivitiesUpdate(userRoleScreenActivitiesResponse.data));
        setsignInScreenActivities(userRoleScreenActivitiesResponse.data); 
      }
    } else {
      setsignInScreenActivities(offlineScreens); 
    }
    }
  }
  useEffect(() => {
    GetUserRoleScreenActivities();
  }, []);
  const signinScreens: any = [];
  if (signInScreenActivities && signInScreenActivities.length > 0) {
    signInScreenActivities.map((Obj: any) => {
      signinScreens.push(Obj && Obj.screen);
    });
  }
  //   console.log("screens",signinScreens);
  signinScreens.sort((a, b) => {
    if(a && b){
      return a.id - b.id;
    }
});
// console.log("screens after",signinScreens);
  let SideBarLinks: any = [];
  let SideBarLinks2: any = [];
  let SideBarLinks3: any = [];
  let SideBarLinks4: any = [];
  let SideBarLinks5: any = [];
  function accordionExists() {
    return signinScreens.some(function (el) {
      return (
        (el && el.screenCode === 'DE2') ||
        (el && el.screenCode === 'DE3') ||
        (el && el.screenCode === 'DE4') ||
        (el && el.screenCode === 'DE5')
      );
    });
  }
  SideBarLinks =
    signinScreens &&
    signinScreens.map((element: any, i: any) => {
      if (element && element.screenCode === 'DE1') {
        return (
          <Accordion.Body key={i}>
            <Link to={`/` +element.urlPath} key={i}>
              <ListGroup.Item as="li" action href={`/` + element.urlPath}>
                {element && element.screenCode === `DE1` && <i className="fas fa-procedures updown"></i>}
                {element && element.screenName}
              </ListGroup.Item>
            </Link>
            </Accordion.Body>
        );
      }
    });
  SideBarLinks2 =
    signinScreens &&
    signinScreens.map((element: any, i: any) => {
      if (
        (element && element.screenCode === 'DE2') ||
        (element && element.screenCode === 'DE3') ||
        (element && element.screenCode === 'DE4') ||
        (element && element.screenCode === 'DE5')
      ) {
        return (
          <Accordion.Body key={i}>
            <Link to={`/` + element.urlPath}>
              <ListGroup.Item as='li' action href={`/` + element.urlPath}>
                {element && element.screenCode === `DE2` && (
                  <i className='fas fa-tasks updown'></i>
                )}
                {element && element.screenCode === `DE3` && (
                  <i className='fas fa-piggy-bank updown'></i>
                )}
                {element && element.screenCode === `DE4` && (
                  <i className='fas fa-file-medical-alt updown'></i>
                )}
                {element && element.screenCode === `DE5` && (
                  <i className='fas fa-user-check updown'></i>
                )}

                {element && element.screenName}
              </ListGroup.Item>
            </Link>
          </Accordion.Body>
        );
      }
    });
  SideBarLinks3 =
    signinScreens &&
    signinScreens.map((element: any,i:any) => {
      if(element && element.screenCode === 'DE6' || element && element.screenCode === 'DE7' || element && element.screenCode === 'DE8' || element && element.screenCode === 'DE9' || element && element.screenCode === 'DE10' || element && element.screenCode === 'DE11' || element && element.screenCode === 'DE12'){
        return(
          <Accordion.Body key={i}>
            <Link to={`/` +element.urlPath} key={i}>
              <ListGroup.Item as="li" action href={`/` +element.urlPath}>
                {element && element.screenCode === `DE6` && <i className="fas fa-map-marked-alt updown"></i>}
                {element && element.screenCode === `DE7` && <i className="fas fa-clipboard-list updown"></i>}
                {element && element.screenCode === `DE8` && <i className="fas fa-notes-medical updown"></i>}
                {element && element.screenCode === `DE9` && <i className="fas fa-industry updown"></i>}
                {element && element.screenCode === `DE10` && <i className="fas fa-user-friends updown"></i>}
                {element && element.screenCode === `DE11` && <i className="fas fa-bug updown"></i>}
                {element && element.screenCode === `DE12` && <i className="fas fa-bullseye updown"></i>}

              {element.screenName}
            </ListGroup.Item>
          </Link>
          </Accordion.Body>
        );
      }
    });
  SideBarLinks4 =
    signinScreens &&
    signinScreens.map((element: any, i: any) => {
      if (
        (element && element.screenCode === 'RP1') ||
        (element && element.screenCode === 'RP2') ||
        (element && element.screenCode === 'RP3') ||
        (element && element.screenCode === 'RP4') ||
        (element && element.screenCode === 'RP5') ||
        (element && element.screenCode === 'RP6') ||
        (element && element.screenCode === 'RP7') ||
        (element && element.screenCode === 'RP8') ||
        (element && element.screenCode === 'RP9') ||
        (element && element.screenCode === 'RP10') ||
        (element && element.screenCode === 'RP11') ||
        (element && element.screenCode === 'RP12') ||
        (element && element.screenCode === 'RP13') ||
        (element && element.screenCode === 'RP14') ||
        (element && element.screenCode === 'RP15') ||
        (element && element.screenCode === 'RP16') ||
        (element && element.screenCode === 'RP17') ||
        (element && element.screenCode === 'RP18') ||
        (element && element.screenCode === 'RP19') ||
        (element && element.screenCode === 'RP20') ||
        (element && element.screenCode === 'RP21') ||
        (element && element.screenCode === 'RP22') ||
        (element && element.screenCode === 'RP23') ||
        (element && element.screenCode === 'RP24') ||
        (element && element.screenCode === 'RP25') ||
        (element && element.screenCode === 'RP26') ||
        (element && element.screenCode === 'RP27') ||
        (element && element.screenCode === 'RP28') ||
        (element && element.screenCode === 'RP29') ||
        (element && element.screenCode === 'RP30') ||
        (element && element.screenCode === 'RP31') ||
        (element && element.screenCode === 'RP32') ||
        (element && element.screenCode === 'RP33') ||
        (element && element.screenCode === 'RP34') ||
        (element && element.screenCode === 'RP35') ||
        (element && element.screenCode === 'RP36') ||
        (element && element.screenCode === 'RP37') ||
        (element && element.screenCode === 'RP38') ||
        (element && element.screenCode === 'RP39') ||
        (element && element.screenCode === 'RP40') ||
        (element && element.screenCode === 'RP41')
      ) {
        return (
          <Accordion.Body key={i}>
            <Link to={`/` + element.urlPath}>
              <ListGroup.Item as='li' action href={`/` + element.urlPath}>
                {element && element.screenCode === `RP1` && (
                  <i className='fas fa-tasks updown'></i>
                )}
                {element && element.screenCode === `RP2` && (
                  <i className='fas fa-piggy-bank updown'></i>
                )}
                {element && element.screenCode === `RP3` && (
                  <i className='fas fa-file-medical-alt updown'></i>
                )}
                {element && element.screenCode === `RP4` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `RP5` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `RP6` && (
                  <i className='fas fa-map-marked-alt updown'></i>
                )}
                {element && element.screenCode === `RP7` && (
                  <i className='fas fa-clipboard-list updown'></i>
                )}
                {element && element.screenCode === `RP8` && (
                  <i className='fas fa-notes-medical updown'></i>
                )}
                {element && element.screenCode === `RP9` && (
                  <i className='fas fa-industry updown'></i>
                )}
                {element && element.screenCode === `RP10` && (
                  <i className='fas fa-user-friends updown'></i>
                )}
                {element && element.screenCode === `RP11` && (
                  <i className='fas fa-tasks updown'></i>
                )}
                {element && element.screenCode === `RP12` && (
                  <i className='fas fa-piggy-bank updown'></i>
                )}
                {element && element.screenCode === `RP13` && (
                  <i className='fas fa-file-medical-alt updown'></i>
                )}
                {element && element.screenCode === `RP14` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `RP15` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `RP16` && (
                  <i className='fas fa-map-marked-alt updown'></i>
                )}
                {element && element.screenCode === `RP17` && (
                  <i className='fas fa-clipboard-list updown'></i>
                )}
                {element && element.screenCode === `RP18` && (
                  <i className='fas fa-notes-medical updown'></i>
                )}
                {element && element.screenCode === `RP19` && (
                  <i className='fas fa-industry updown'></i>
                )}
                {element && element.screenCode === `RP20` && (
                  <i className='fas fa-user-friends updown'></i>
                )}
                {element && element.screenCode === `RP21` && (
                  <i className='fas fa-tasks updown'></i>
                )}
                {element && element.screenCode === `RP22` && (
                  <i className='fas fa-piggy-bank updown'></i>
                )}
                {element && element.screenCode === `RP23` && (
                  <i className='fas fa-file-medical-alt updown'></i>
                )}
                {element && element.screenCode === `RP24` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `RP25` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `RP26` && (
                  <i className='fas fa-map-marked-alt updown'></i>
                )}
                {element && element.screenCode === `RP27` && (
                  <i className='fas fa-clipboard-list updown'></i>
                )}
                {element && element.screenCode === `RP28` && (
                  <i className='fas fa-notes-medical updown'></i>
                )}
                {element && element.screenCode === `RP29` && (
                  <i className='fas fa-industry updown'></i>
                )}
                {element && element.screenCode === `RP30` && (
                  <i className='fas fa-user-friends updown'></i>
                )}
                {element && element.screenCode === `RP31` && (
                  <i className='fas fa-tasks updown'></i>
                )}
                {element && element.screenCode === `RP32` && (
                  <i className='fas fa-piggy-bank updown'></i>
                )}
                {element && element.screenCode === `RP33` && (
                  <i className='fas fa-file-medical-alt updown'></i>
                )}
                {element && element.screenCode === `RP34` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `RP35` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `RP36` && (
                  <i className='fas fa-map-marked-alt updown'></i>
                )}
                {element && element.screenCode === `RP37` && (
                  <i className='fas fa-clipboard-list updown'></i>
                )}
                {element && element.screenCode === `RP38` && (
                  <i className='fas fa-notes-medical updown'></i>
                )}
                {element && element.screenCode === `RP39` && (
                  <i className='fas fa-industry updown'></i>
                )}
                {element && element.screenCode === `RP40` && (
                  <i className='fas fa-user-friends updown'></i>
                )}{' '}
                {element && element.screenCode === `RP41` && (
                  <i className='fas fa-tasks updown'></i>
                )}
                {element.screenName}
              </ListGroup.Item>
            </Link>
            </Accordion.Body>
        )
      }
    });
    SideBarLinks5 =
    signinScreens &&
    signinScreens.map((element: any, i: any) => {
      if (
        (element && element.screenCode === 'AZ1') ||
        (element && element.screenCode === 'AZ2') ||
        (element && element.screenCode === 'AZ3') ||
        (element && element.screenCode === 'AZ4') ||
        (element && element.screenCode === 'AZ5') ||
        (element && element.screenCode === 'AZ6') ||
        (element && element.screenCode === 'AZ7') ||
        (element && element.screenCode === 'AZ8') ||
        (element && element.screenCode === 'AZ9') ||
        (element && element.screenCode === 'AZ10') ||
        (element && element.screenCode === 'AZ11') ||
        (element && element.screenCode === 'AZ12') ||
        (element && element.screenCode === 'AZ13') ||
        (element && element.screenCode === 'AZ14') ||
        (element && element.screenCode === 'AZ15') ||
        (element && element.screenCode === 'AZ16') ||
        (element && element.screenCode === 'AZ17') ||
        (element && element.screenCode === 'AZ18') ||
        (element && element.screenCode === 'AZ19') ||
        (element && element.screenCode === 'AZ20') ||
        (element && element.screenCode === 'AZ21') ||
        (element && element.screenCode === 'AZ22') ||
        (element && element.screenCode === 'AZ23') ||
        (element && element.screenCode === 'AZ24') ||
        (element && element.screenCode === 'AZ25') ||
        (element && element.screenCode === 'AZ26') ||
        (element && element.screenCode === 'AZ27') ||
        (element && element.screenCode === 'AZ28') ||
        (element && element.screenCode === 'AZ29') ||
        (element && element.screenCode === 'AZ30') ||
        (element && element.screenCode === 'AZ31') ||
        (element && element.screenCode === 'AZ32') ||
        (element && element.screenCode === 'AZ33') ||
        (element && element.screenCode === 'AZ34') ||
        (element && element.screenCode === 'AZ35') ||
        (element && element.screenCode === 'AZ36') ||
        (element && element.screenCode === 'AZ37') ||
        (element && element.screenCode === 'AZ38') ||
        (element && element.screenCode === 'AZ39') ||
        (element && element.screenCode === 'AZ40') ||
        (element && element.screenCode === 'AZ41')
      ) {
        return (
          <Accordion.Body key={i}>
            <Link to={`/` + element.urlPath}>
              <ListGroup.Item as='li' action href={`/` + element.urlPath}>
                {element && element.screenCode === `AZ1` && (
                  <i className='fas fa-tasks updown'></i>
                )}
                {element && element.screenCode === `AZ2` && (
                  <i className='fas fa-piggy-bank updown'></i>
                )}
                {element && element.screenCode === `AZ3` && (
                  <i className='fas fa-file-medical-alt updown'></i>
                )}
                {element && element.screenCode === `AZ4` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `AZ5` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `AZ6` && (
                  <i className='fas fa-map-marked-alt updown'></i>
                )}
                {element && element.screenCode === `AZ7` && (
                  <i className='fas fa-clipboard-list updown'></i>
                )}
                {element && element.screenCode === `AZ8` && (
                  <i className='fas fa-notes-medical updown'></i>
                )}
                {element && element.screenCode === `AZ9` && (
                  <i className='fas fa-industry updown'></i>
                )}
                {element && element.screenCode === `AZ10` && (
                  <i className='fas fa-user-friends updown'></i>
                )}
                {element && element.screenCode === `AZ11` && (
                  <i className='fas fa-tasks updown'></i>
                )}
                {element && element.screenCode === `AZ12` && (
                  <i className='fas fa-piggy-bank updown'></i>
                )}
                {element && element.screenCode === `AZ13` && (
                  <i className='fas fa-file-medical-alt updown'></i>
                )}
                {element && element.screenCode === `AZ14` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `AZ15` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `AZ16` && (
                  <i className='fas fa-map-marked-alt updown'></i>
                )}
                {element && element.screenCode === `AZ17` && (
                  <i className='fas fa-clipboard-list updown'></i>
                )}
                {element && element.screenCode === `AZ18` && (
                  <i className='fas fa-notes-medical updown'></i>
                )}
                {element && element.screenCode === `AZ19` && (
                  <i className='fas fa-industry updown'></i>
                )}
                {element && element.screenCode === `AZ20` && (
                  <i className='fas fa-user-friends updown'></i>
                )}
                {element && element.screenCode === `AZ21` && (
                  <i className='fas fa-tasks updown'></i>
                )}
                {element && element.screenCode === `AZ22` && (
                  <i className='fas fa-piggy-bank updown'></i>
                )}
                {element && element.screenCode === `AZ23` && (
                  <i className='fas fa-file-medical-alt updown'></i>
                )}
                {element && element.screenCode === `AZ24` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `AZ25` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `AZ26` && (
                  <i className='fas fa-map-marked-alt updown'></i>
                )}
                {element && element.screenCode === `AZ27` && (
                  <i className='fas fa-clipboard-list updown'></i>
                )}
                {element && element.screenCode === `AZ28` && (
                  <i className='fas fa-notes-medical updown'></i>
                )}
                {element && element.screenCode === `AZ29` && (
                  <i className='fas fa-industry updown'></i>
                )}
                {element && element.screenCode === `AZ30` && (
                  <i className='fas fa-user-friends updown'></i>
                )}
                {element && element.screenCode === `AZ31` && (
                  <i className='fas fa-tasks updown'></i>
                )}
                {element && element.screenCode === `AZ32` && (
                  <i className='fas fa-piggy-bank updown'></i>
                )}
                {element && element.screenCode === `AZ33` && (
                  <i className='fas fa-file-medical-alt updown'></i>
                )}
                {element && element.screenCode === `AZ34` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `AZ35` && (
                  <i className='fas fa-user-check updown'></i>
                )}
                {element && element.screenCode === `AZ36` && (
                  <i className='fas fa-map-marked-alt updown'></i>
                )}
                {element && element.screenCode === `AZ37` && (
                  <i className='fas fa-clipboard-list updown'></i>
                )}
                {element && element.screenCode === `AZ38` && (
                  <i className='fas fa-notes-medical updown'></i>
                )}
                {element && element.screenCode === `AZ39` && (
                  <i className='fas fa-industry updown'></i>
                )}
                {element && element.screenCode === `AZ40` && (
                  <i className='fas fa-user-friends updown'></i>
                )}{' '}
                {element && element.screenCode === `AZ41` && (
                  <i className='fas fa-tasks updown'></i>
                )}
                {element.screenName}
              </ListGroup.Item>
            </Link>
            </Accordion.Body>
        )
      }
    });
  return (
    <div className='sidebar-sec font-chng'>
      <ListGroup id='sidebar' as='ul'>
        <Link to={`/webdashboard`}>
          <ListGroup.Item as='li' action href='/webdashboard'>
            <i className='fas fa-chart-line updown'></i>Dashboard
          </ListGroup.Item>
        </Link>         

        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header><i className="fas fa-database updown"></i>Data Entry</Accordion.Header>
            {SideBarLinks}
            <Accordion.Body className="sub-menu">
            {accordionExists() &&
        <Accordion >
          <Accordion.Item eventKey="1">
            <Accordion.Header><i className="fas fa-database updown"></i>MDA</Accordion.Header>
            {SideBarLinks2}
            </Accordion.Item>
        </Accordion>
        }
        </Accordion.Body>
        {SideBarLinks3}
            </Accordion.Item>
        </Accordion>

        {accordionExists() && (
          <Accordion>
            <Accordion.Item eventKey='0'>
	            <Accordion.Header><i className="fas fa-database zblue updown"></i>Reports</Accordion.Header>
              {SideBarLinks4}
            </Accordion.Item>
          </Accordion>
        )}

        {accordionExists() && (
          <Accordion>
            <Accordion.Item eventKey='0'>
	            <Accordion.Header><i className="fas fa-database lorange updown"></i>Analysis</Accordion.Header>
              {SideBarLinks5}
            </Accordion.Item>
          </Accordion>
        )}
        <Accordion defaultActiveKey="0">
          <Accordion.Item eventKey="0">
            <Accordion.Header><i className="fas fa-user-circle updown"></i>User Profile</Accordion.Header>
            <Accordion.Body>
                <Link to={`/UserProfile`}>
                  <ListGroup.Item as="li" action href="/UserProfile">
                    <i className="fas fa-address-card updown"></i>User Information
                  </ListGroup.Item>
                </Link>
            </Accordion.Body>
            <Accordion.Body>
                <Link to={`/ChangePassword`}>
                    <ListGroup.Item as="li" action href="/ChangePassword">
                    <i className="fas fa-key updown"></i>Change Password
                  </ListGroup.Item>
                </Link>
              </Accordion.Body>
          </Accordion.Item>
        </Accordion> 
      </ListGroup>
    </div>
  );
};

export default Sidebar;
