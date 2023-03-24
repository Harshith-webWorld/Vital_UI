import React, { useState, useEffect } from 'react';
import Logo from '../../assets/img/mhlogo.png';
import CenLogo from '../../assets/img/cenLogo.png';
import NHMLogo from '../../assets/img/national-health-mission-logo.png';
import Moment from 'react-moment';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import phoneImg from '../../assets/img/LEFP_Images/toll-free.png';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { Container } from 'react-bootstrap';
import closeImg from '../../assets/img/LEFP_Images/CloseMenu_icon.png';
import history from '../../../helpers/history';
import ModalSignin from '../../components/WebLogin/ModalSignin';
import Modal from 'react-bootstrap/Modal';
import { useSelector } from 'react-redux';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch } from 'react-redux';
import { onSignout } from '../../components/WebLogin/siginslice';
import { WebsiteOthersMenu } from '../../../helpers/interfaces/website-othersMenu';
import MenusService from '../../../helpers/services/website-otherMenu.service';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useLocation } from 'react-router-dom';
import FontSizeChanger from 'react-font-size-changer';
import { menuvalues } from './constant';
import DexieOfflineDataBase from '../../../helpers/Offline/OfflineDropdownServices';
import { BASE_URL, IP_INFO_URL } from '../../../helpers/config';
import { post, get, publicGet } from '../../../helpers/fetchServicesMethods';

const Header = (props: any) => {
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const signinInfo = useSelector((state: any) => state.Admin.signin);
  const userRoleScreens =
    signinInfo && signinInfo.data && signinInfo.data.userRoleScreenActivities;
  const [date, setDate] = useState(new Date());
  let smallSideBarLinks;
  const token = signinInfo.token;
  let WebsiteOthersMenus: WebsiteOthersMenu[] = [];
  const [menuList, setMenuList] = React.useState(WebsiteOthersMenus);

  let StyleLink = { textDecoration: 'none', color: 'black' };
  React.useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    getMenus();
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);
  async function getMenus() {
    const response = await MenusService.getWebsiteOtherMenuInfo();
    if (response && response.data) {
      WebsiteOthersMenus = response.data;
      setMenuList(response.data);
    }
  }
  async function Logout() {
    // sessionStorage.clear();
    console.log('Process.env Logout:', process.env);
    console.log(
      'REACT_APP_IP_INFO_URL Logout:',
      process.env.REACT_APP_IP_INFO_URL,
    );
    publicGet(IP_INFO_URL)
      .then(async (res) => {
        console.log('res---------', res);
        let clientIp = res;
        console.log('Logout-ip-: ', clientIp.ip);
        const result = await post(BASE_URL + '/auth/logout', {
          clientIp: clientIp.ip,
        });
        dispatch(onSignout());
        // let OfflineDropdownDelete = await DexieOfflineDataBase.deleteDexieDropdownDB();
        // console.log(OfflineDropdownDelete)
        history.push('/');
      })
      .catch(async (error) => {
        console.log('IP_INFO_URL_Logout: ', error.response);
        const result = await post(BASE_URL + '/auth/logout', {});
        dispatch(onSignout());
      });
  }

  let Websitecontent = props.webSiteContent;
  let tollFreeNumber = () => {
    if (Websitecontent && Websitecontent.tollFreeNumber) {
      return (
        <div className='d-flex justify-content-center'>
          <img alt='' src={phoneImg} className=' font-chng' />
          <h3 className='font-chng'>
            Toll free : {Websitecontent.tollFreeNumber}
          </h3>
        </div>
      );
    }
  };

  let websiteName = () => {
    if (Websitecontent && Websitecontent.websiteName) {
      return <h3 className='font-chng'>{Websitecontent.websiteName}</h3>;
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [formanchorEl, formsetAnchorEl] = React.useState(null);

  const formClick = (event: any) => {
    formsetAnchorEl(event.currentTarget);
  };

  const formClose = () => {
    formsetAnchorEl(null);
  };

  const signinModal = () => {
    history.push(`/modalsignin`);
  };

  const signinScreens: any = [];
  if (userRoleScreens && userRoleScreens.length > 0) {
    userRoleScreens.map((Obj: any) => {
      signinScreens.push(Obj && Obj.screen);
    });
  }

  smallSideBarLinks =
    signinScreens &&
    signinScreens.map((element: any, i: any) => {
      return (
        <MenuItem onClick={formClose} key={i}>
          <Link to={`/` + element.urlPath}>
            <ListGroup.Item as='li'>
              {element && element.screenName}
            </ListGroup.Item>
          </Link>
        </MenuItem>
      );
    });

  const [show, setShow] = useState(false);
  const handleCloseModal = () => setShow(false);
  const handleShowModal = () => setShow(true);
  const menulink = ({ id, label }: any) => {
    menuList.filter((data) => data.menuType === label).length > 0 &&
      history.push('/menu_details', {
        menuname: label,
        id: id,
      });
  };
  return (
    <div className='head-wrap'>
      <div className='head-sign'>
        <div className='container'>
          <div className='row'>
            <div className='col-sm-5 col-12'>
              <div className='head-left'>
                <h5 className='font-chng'>
                  <Moment format='LLLL'>{date}</Moment>
                </h5>
              </div>
            </div>
            <div className='col-sm-7 col-12'>
              <div className='head-right'>
                <div className='border-rit'>
                  <div>
                    <button
                      className={token ? 'd-none' : 'btn sign-btn font-chng'}
                      onClick={handleShowModal}>
                      Sign in
                    </button>
                  </div>
                  <div
                    className={
                      token ? 'btn sign-btn log-name font-chng' : 'd-none'
                    }>
                    <i className='fas fa-user'></i>
                    <DropdownButton
                      title={
                        signinInfo &&
                        signinInfo.data &&
                        signinInfo.data.fullName
                      }
                      id='collasible-nav-dropdown'>
                      <NavDropdown.Item href='#' key='userName'>
                        <i className='fas fa-user-circle'></i>
                        {signinInfo &&
                          signinInfo.data &&
                          signinInfo.data.userName}
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      {location.pathname === '/' && (
                        <div>
                          <NavDropdown.Item
                            href='/WebDashboard'
                            key='Dashboard'>
                            <i className='fas fa-chart-line'></i>
                            Dashboard
                          </NavDropdown.Item>
                          <NavDropdown.Divider />
                        </div>
                      )}
                      <NavDropdown.Divider />
                      <div>
                        <NavDropdown.Item href='/Userprofile'>
                          <i className='fas fa-user'></i>
                          User Profile
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                      </div>
                      <div>
                        <NavDropdown.Item href='/ChangePassword'>
                          <i className='fas fa-key'></i>
                          Change Password
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                      </div>
                      <NavDropdown.Item onClick={Logout}>
                        <i className='fas fa-sign-out-alt'></i>
                        Logout
                      </NavDropdown.Item>
                    </DropdownButton>
                  </div>

                  <Modal
                    show={show}
                    backdrop='static'
                    onHide={handleCloseModal}
                    dialogClassName='sign-modal in-down'
                    aria-labelledby='example-custom-modal-styling-title'>
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body>
                      <ModalSignin />
                    </Modal.Body>
                  </Modal>
                </div>

                <div>
                  <FontSizeChanger
                    targets={[
                      '.font-chng',
                      '.form-control',
                      'custom-select',
                      'step-icon',
                    ]}
                    onChange={(element, newValue, oldValue) => {
                      console.log(element, newValue, oldValue);
                    }}
                    options={{
                      stepSize: 1,
                      range: 2,
                    }}
                    customButtons={{
                      down: <span style={{ fontSize: '14px' }}>A-</span>,
                      middle: <span style={{ fontSize: '14px' }}>A</span>,
                      up: <span style={{ fontSize: '14px' }}>A+</span>,
                      style: {
                        backgroundColor: 'tranparent',
                        border: '1px solid #fff',
                        color: 'white',
                        WebkitBoxSizing: 'border-box',
                        WebkitBorderRadius: '0',
                        width: '36px',
                        height: '35px',
                        cursor: 'pointer',
                        lineheight: '2',
                        fontWeight: '600',
                      },
                      buttonsMargin: 10,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='head-free'>
        <div className='container'>{tollFreeNumber()}</div>
      </div>
      <div className='head-menu'>
        <div className='container'>
          <div className='row'>
            <div className='col-xl-3 col-12 col-md-5'>
              <div className='logo-lft font-chng'>
                <a href='/'>
                  <img alt='' src={Logo} />
                </a>
              </div>
            </div>
            <div className='col-xl-6 col-12 col-md-7'>
              <div className='head-title'>{websiteName()}</div>
            </div>
            <div className='col-xl-3 col-12 col-md-12'>
              <div className='head-end'>
                <div className='sidebar-mob-sec'>
                  <Button
                    aria-controls='sidebar-menu'
                    aria-haspopup='true'
                    onClick={formClick}>
                    Form <i className='fas fa-file-alt'></i>
                  </Button>
                  <Menu
                    id='form-menu'
                    anchorEl={formanchorEl}
                    keepMounted
                    open={Boolean(formanchorEl)}
                    onClose={formClose}>
                    <div className='sidebar-sec'>
                      <ListGroup id='sidebar' as='ul'>
                        <MenuItem onClick={formClose} key='WebDashboard'>
                          <Link to={`/WebDashboard`}>
                            <ListGroup.Item as='li'>Dashboard</ListGroup.Item>
                          </Link>
                        </MenuItem>
                        {smallSideBarLinks}
                        {/* <MenuItem onClick={formClose}>
                          <Link to={`/lymphedemaPatients`}>
                            <ListGroup.Item as='li'>
                              Lymphedema/Hydrocele Patient
                            </ListGroup.Item>
                          </Link>
                        </MenuItem>

                        <MenuItem onClick={formClose} key='viewpremdaactivity'>
                          <Link to={`/viewpremdaactivity`}>
                            <ListGroup.Item as='li'>
                              Pre-MDA activity
                            </ListGroup.Item>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={formClose} key='listMDAActivity'>
                          <Link to={`/listMDAActivity`}>
                            <ListGroup.Item as='li'>
                              MDA Activity and Fund Utilization
                            </ListGroup.Item>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={formClose} key='ViewCoverageReport'>
                          <Link to={`/ViewCoverageReport`}>
                            <ListGroup.Item as='li'>
                              MDA and IDA Coverage Report
                            </ListGroup.Item>
                          </Link>
                        </MenuItem>
                        <MenuItem
                          onClick={formClose}
                          key='postMdaThirdPartyList'>
                          <Link to={`/postMdaThirdPartyList`}>
                            <ListGroup.Item as='li'>
                              Third Party Evaluation for MDA
                            </ListGroup.Item>
                          </Link>
                        </MenuItem>
                        <MenuItem
                          onClick={formClose}
                          key='listmappingofoperationtheaters'>
                          <Link to={`/listmappingofoperationtheaters`}>
                            <ListGroup.Item as='li'>
                              Mapping of Operation Theaters
                            </ListGroup.Item>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={formClose} key='viewtassurvey'>
                          <Link to={`/viewtassurvey`}>
                            <ListGroup.Item as='li'> TAS Survey</ListGroup.Item>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={formClose} key='viewmfpositive'>
                          <Link to={`/viewmfpositive`}>
                            <ListGroup.Item as='li'>MF Positive</ListGroup.Item>
                          </Link>
                        </MenuItem>
                        <MenuItem
                          onClick={formClose}
                          key='viewverticalstockposition'>
                          <Link to={`/viewverticalstockposition`}>
                            <ListGroup.Item as='li'>
                              Vertical unit Stock Position
                            </ListGroup.Item>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={formClose} key='viewstaffposition'>
                          <Link to={`/viewstaffposition`}>
                            <ListGroup.Item as='li'>
                              Staff Position Vertical unit
                            </ListGroup.Item>
                          </Link>
                        </MenuItem>
                        <MenuItem
                          onClick={formClose}
                          key='viewentomologicallarvicidal'>
                          <Link to={`/viewentomologicallarvicidal`}>
                            <ListGroup.Item as='li'>
                              Entomological and Larvicidal
                            </ListGroup.Item>
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={formClose} key='viewfustarget'>
                          <Link to={`/viewfustarget`}>
                            <ListGroup.Item as='li'>
                              FSU Target & Achievement
                            </ListGroup.Item>
                          </Link>
                        </MenuItem> */}
                      </ListGroup>
                    </div>
                  </Menu>
                </div>

                <div className='menu-box font-chng'>
                  <Button
                    aria-controls='simple-menu'
                    aria-haspopup='true'
                    onClick={handleClick}>
                    Menu <i className='fas fa-bars'></i>
                  </Button>
                  <Menu
                    id='header-menu'
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    <Container>
                      <Row className='pt-4'>
                        <Col xs={12} lg={3} xl={3}>
                          <h3 className='ps-3'>Manyavaranche Sandesh</h3>
                          {menuvalues.map((item, index) => {
                            if (item.id < 8)
                              return (
                                <MenuItem
                                  onClick={handleClose}
                                  key={item.label + index}>
                                  <h4 onClick={() => menulink(item)}>
                                    {item.label}
                                  </h4>
                                </MenuItem>
                              );
                          })}
                        </Col>
                        <Col xs={12} lg={3} xl={3}>
                          {menuvalues.map((item, index) => {
                            if (item.id === 8)
                              return (
                                <MenuItem
                                  onClick={handleClose}
                                  key={item.label + index}>
                                  <h4 onClick={() => menulink(item)}>
                                    {item.label}
                                  </h4>
                                </MenuItem>
                              );
                          })}
                        </Col>
                        <Col xs={12} lg={6} xl={3}>
                          <h3 className='ps-3'>Quick Links</h3>
                          <MenuItem onClick={handleClose}>
                            <h4>
                              <a style={StyleLink} target='_blank' href='#'>
                                Alerts & Notifications
                              </a>
                            </h4>
                            <h4>
                              <a style={StyleLink} target='_blank' href='#'>
                                Private Practitioner Entry
                              </a>
                            </h4>
                            <h4>
                              <a style={StyleLink} target='_blank' href='#'>
                                Technical Advisor
                              </a>
                            </h4>
                            <h4>
                              <a style={StyleLink} target='_blank' href='#'>
                                Resources
                              </a>
                            </h4>
                          </MenuItem>
                        </Col>
                      </Row>
                      <Row className='pt-4'>
                        {menuvalues.map((item, index) => {
                          if (item.id > 8)
                            return (
                              <Col xs={12} lg={3} xl={3}>
                                <MenuItem onClick={handleClose}>
                                  <h4 onClick={() => menulink(item)}>
                                    {item.label}
                                  </h4>
                                </MenuItem>
                              </Col>
                            );
                        })}
                        <Col xs={12} lg={6} xl={3}>
                          <h3 className='ps-3'>About LFEP</h3>
                          <MenuItem onClick={handleClose}></MenuItem>
                        </Col>
                        <Col xs={12} lg={6} xl={3}>
                          <h3 className='ps-3'>Contact Us</h3>
                          <MenuItem onClick={handleClose}></MenuItem>
                        </Col>
                      </Row>
                    </Container>
                    <div className='menu-close'>
                      <button onClick={handleClose} className='btn font-chng'>
                        Close <img src={closeImg} />
                      </button>
                    </div>
                  </Menu>
                </div>
                <div className='logo-rit font-chng'>
                  <img src={CenLogo} />
                  <img src={NHMLogo} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
