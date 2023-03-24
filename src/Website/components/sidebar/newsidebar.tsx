import React, { useState, useEffect } from 'react';
import '../../assets/sass/main.scss';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import { userRoleScreenActivitiesUpdate } from '../WebLogin/siginslice';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import Accordion from 'react-bootstrap/Accordion';
import { useSelector, useDispatch } from 'react-redux';
import userService from '../../../helpers/services/userService';
import { Item } from 'react-bootstrap/lib/Breadcrumb';
import { sidebarInterface } from '../../interfaces/sidebarInterface';
import { useLocation } from 'react-router-dom';
import bxfile from '../../assets/img/bx-file.svg';
import bxhomecircle from '../../assets/img/bx-home-circle.svg';
import bxlayout from '../../assets/img/bx-layout.svg';
import bxshape from '../../assets/img/bxs-bar-chart-alt-2.svg';
import bxusercircle from '../../assets/img/bx-user-circle.svg';
import calendar from '../../assets/img/calendar.png';
import listchecksolid from '../../assets/img/list-check-solid.svg';
import bx_receipt from '../../assets/img/bx-receipt.svg';
import filewaveformsolid from '../../assets/img/file-waveform-solid.svg';
import piggybanksolid from '../../assets/img/piggy-bank-solid.svg';
// export function Sidebar() {
const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const signinInfo = useSelector(
    (state: any) => state && state.Admin && state.Admin.signin
  );
  const signinInfoId = signinInfo && signinInfo.data && signinInfo.data.id;
  const offlineScreens =
    signinInfo && signinInfo.data && signinInfo.data.userRoleScreenActivities;
  const isOnline = window.navigator.onLine;
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
  useEffect(() => {
    GetUserRoleScreenActivities();
  }, []);
  const signinScreens: any = [];
  if (signInScreenActivities && signInScreenActivities.length > 0) {
    signInScreenActivities.map((Obj: any) => {
      signinScreens.push(Obj && Obj.screen);
    });
  }
  signinScreens.sort((a, b) => {
    if (a && b) {
      return a.id - b.id;
    }
  });
  let FindRP9 = signinScreens.findIndex((el) => el.screenCode === 'RP9');
  if (FindRP9 !== -1) {
    let picked = signinScreens.splice(FindRP9, 1);
    signinScreens.unshift(picked[0]);
  }

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
            <Link to={`/` + element.urlPath} key={i}>
              <ListGroup.Item as='li' action href={`/` + element.urlPath}>
                {element && element.screenCode === `DE1` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
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
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `DE3` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `DE4` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `DE5` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
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
    signinScreens.map((element: any, i: any) => {
      if (
        (element && element.screenCode === 'DE6') ||
        (element && element.screenCode === 'DE7') ||
        (element && element.screenCode === 'DE8') ||
        (element && element.screenCode === 'DE9') ||
        (element && element.screenCode === 'DE10') ||
        (element && element.screenCode === 'DE11') ||
        (element && element.screenCode === 'DE12') ||
        (element && element.screenCode === 'DE13')
      ) {
        return (
          <Accordion.Body key={i}>
            <Link to={`/` + element.urlPath} key={i}>
              <ListGroup.Item as='li' action href={`/` + element.urlPath}>
                {element && element.screenCode === `DE6` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `DE7` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `DE8` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `DE9` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `DE10` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `DE11` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `DE12` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `DE13` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}

                <div>{element.screenName}</div>
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
        (element && element.screenCode === 'RP9') ||
        (element && element.screenCode === 'RP1') ||
        (element && element.screenCode === 'RP2') ||
        (element && element.screenCode === 'RP3') ||
        (element && element.screenCode === 'RP4') ||
        (element && element.screenCode === 'RP5') ||
        (element && element.screenCode === 'RP6') ||
        (element && element.screenCode === 'RP7') ||
        (element && element.screenCode === 'RP8') ||
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
            <Link to={`/` + element.urlPath + 'new'}>
              <ListGroup.Item
                as='li'
                action
                href={`/` + element.urlPath + 'new'}
              >
                {element && element.screenCode === `RP9` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP1` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP2` && (
                  <img src={piggybanksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP3` && (
                  <img
                    src={filewaveformsolid}
                    alt=''
                    className='navsidebaricon'
                  />
                )}
                {element && element.screenCode === `RP4` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP5` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP6` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP7` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP8` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP10` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP11` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP12` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP13` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP14` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP15` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP16` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP17` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP18` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP19` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP20` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP21` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP22` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP23` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP24` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP25` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP26` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP27` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP28` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP29` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP30` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP31` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP32` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP33` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP34` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP35` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP36` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP37` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP38` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP39` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `RP40` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}{' '}
                {element && element.screenCode === `RP41` && (
                  <img src={bx_receipt} alt='' className='navsidebaricon' />
                )}
                <div>{element.screenName}</div>
              </ListGroup.Item>
            </Link>
          </Accordion.Body>
        );
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
            <Link to={`/` + element.urlPath + 'new'}>
              <ListGroup.Item
                as='li'
                action
                href={`/` + element.urlPath + 'new'}
              >
                {element && element.screenCode === `AZ1` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ2` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ3` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ4` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ5` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ6` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ7` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ8` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ9` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ10` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ11` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ12` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ13` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ14` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ15` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ16` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ17` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ18` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ19` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ20` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ21` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ22` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ23` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ24` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ25` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ26` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ27` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ28` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ29` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ30` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ31` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ32` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ33` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ34` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ35` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ36` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ37` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ38` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ39` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                {element && element.screenCode === `AZ40` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}{' '}
                {element && element.screenCode === `AZ41` && (
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                )}
                <div>{element.screenName}</div>
              </ListGroup.Item>
            </Link>
          </Accordion.Body>
        );
      }
    });
  return (
    <div className='sidebar-sec font-chng'>
      <ListGroup id='sidebarnew' as='ul'>
        <Link to={`/webdashboard`}>
          <ListGroup.Item as='li' action href='/webdashboard'>
            <img src={bxhomecircle} alt='' className='navsidebaricon' />
            Dashboard
          </ListGroup.Item>
        </Link>

        <Accordion>
          <Accordion.Item eventKey='0'>
            <Accordion.Header>
              <img src={bxlayout} alt='' className='navsidebaricon' />
              Data Entry
            </Accordion.Header>
            {SideBarLinks}
            <Accordion.Body className='sub-menu'>
              {accordionExists() && (
                <Accordion>
                  <Accordion.Item eventKey='1'>
                    <Accordion.Header>
                      {' '}
                      <img
                        src={listchecksolid}
                        alt=''
                        className='navsidebaricon'
                      />
                      MDA
                    </Accordion.Header>
                    {SideBarLinks2}
                  </Accordion.Item>
                </Accordion>
              )}
            </Accordion.Body>
            {SideBarLinks3}
          </Accordion.Item>

          {accordionExists() && (
            <Accordion.Item eventKey='1'>
              <Accordion.Header>
                <img src={bxfile} alt='' className='navsidebaricon' />
                Reports
              </Accordion.Header>
              {SideBarLinks4}
            </Accordion.Item>
          )}

          {accordionExists() && (
            <Accordion.Item eventKey='2'>
              <Accordion.Header>
                <img src={bxshape} alt='' className='navsidebaricon' />
                Analysis
              </Accordion.Header>
              {SideBarLinks5}
            </Accordion.Item>
          )}
          <Accordion.Item eventKey='3'>
            <Accordion.Header>
              <img src={bxusercircle} alt='' className='navsidebaricon' />
              User Profile
            </Accordion.Header>
            <Accordion.Body>
              <Link to={`/UserProfile`}>
                <ListGroup.Item as='li' action href='/UserProfile'>
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                  User Information
                </ListGroup.Item>
              </Link>
            </Accordion.Body>
            <Accordion.Body>
              <Link to={`/ChangePassword`}>
                <ListGroup.Item as='li' action href='/ChangePassword'>
                  <img src={listchecksolid} alt='' className='navsidebaricon' />
                  Change Password
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
