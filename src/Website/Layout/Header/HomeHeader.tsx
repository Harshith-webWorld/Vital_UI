import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Logo from '../../assets/img/mhlogo.png';
import AshokStambhYellow from '../../assets/img/sathyameva_jayathe@2x.png';
import Health from '../../assets/img/264217.svg';
import MHLogo from '../../assets/img/Maharashtra_shasan@2x.png';
import MHText from '../../assets/img/Maharashtra_shasan_logotype@2x.png';
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
import ModalSignin from '../../components/WebLogin/NewModalSignin';
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
import { menuvalues } from './constant';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { DialogTitle, ListItemAvatar } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      fontFamily: 'Poppins  !important',
      fontWeight: 800,
    },
    menuButton: {
      marginRight: theme.spacing(2),
      color: '#333333',
      fontSize: '12px',
      fontFamily: 'Poppins !important',
      fontWeight: 800,
      '&:hover': {
        background: 'none',
      },
    },
    title: {
      flexGrow: 1,
    },
    ml_5: {
      marginLeft: '5px',
      color: '#333333',
    },
    user_name: {
      fontSize: '14px',
      background: '#E68839',
      borderRadius: '5px',
      marginTop: '3px',
      height: '50px',
      '&:hover': {
        background: '#E68839',
      },
    },
    drawerPaper: {
      width: '80%',
      // background: '#daf2cc',
    },
    img_: {
      objectFit: 'cover',
      width: '35px',
      marginLeft: '5%',
    },
    img_health: {
      objectFit: 'cover',
      width: '50px',
      marginLeft: '20px',
    },
  }),
);

export default function HomeHeader(props: any) {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  let screenWidth: any = window.screen.availWidth;
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const signinInfo = useSelector((state: any) => state.Admin.signin);
  const [date, setDate] = useState(new Date());
  const token = signinInfo.token;
  let WebsiteOthersMenus: WebsiteOthersMenu[] = [];
  const [menuList, setMenuList] = React.useState(WebsiteOthersMenus);
  const [websiteContentNewsFilepath, setWebsiteContentNewsFilepath] =
    useState('');
  let StyleLink = { textDecoration: 'none', color: 'black' };

  useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    getMenus();
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);
  async function getMenus() {
    const response = await MenusService.getWebsiteOtherMenuInfo();
    if (response && response.data) {
      console.log('website newlist :: ', response);
      WebsiteOthersMenus = response.data;
      setMenuList(response.data);
      setWebsiteContentNewsFilepath(response.filepath);
    }
  }
  function Logout() {
    localStorage.clear();
    dispatch(onSignout());
    history.push('/');
  }

  let Websitecontent = props.webSiteContent;
  let currentDate = new Date();
  let tollFreeNumber = () => {
    if (Websitecontent && Websitecontent.tollFreeNumber) {
      return (
        <div className='d-flex justify-content-center'>
          <img src={phoneImg} className=' font-chng' />
          <h3 className='font-chng'>
            Toll free : {Websitecontent.tollFreeNumber}
          </h3>
        </div>
      );
    }
  };

  let websiteName = () => {
    if (Websitecontent && Websitecontent.websiteName) {
      return (
        <Typography
          variant='h4'
          style={{
            fontWeight: 500,
            fontSize: screenWidth < 786 ? '14px' : '20px',
            textAlign: 'center',
            marginTop: '3%',
          }}>
          {Websitecontent.websiteName}
        </Typography>
      );
    }
  };

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
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
  const [show, setShow] = useState(false);
  const handleCloseModal = () => setShow(false);
  const handleShowModal = () => setShow(true);
  const menulink = ({ id, label }: any) => {
    menuList.filter((data) => data.menuType == label).length > 0 &&
      history.push('/home_menu_details', {
        menuname: label,
        id: id,
      });
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorElMenu, setAnchorElMenu] = React.useState<null | HTMLElement>(
    null,
  );

  const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenu(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
  };
  type Anchor = 'top' | 'left' | 'bottom' | 'right';
  const [openDrawer, setOpenDrawer] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setOpenDrawer({ ...openDrawer, [anchor]: open });
    };

  function ListItemLink(props: ListItemProps<'a', { button?: true }>) {
    return <ListItem button component='a' {...props} />;
  }

  return (
    <div className={classes.root}>
      <AppBar position='static' style={{ boxShadow: 'none' }}>
        <Toolbar style={{ background: '#EBFFE3', border: 'none' }}>
          <Grid container>
            <Grid item xs={12} sm={4} lg={5} md={5}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: screenWidth < 786 ? '' : '100px',
                }}>
                <img src={AshokStambhYellow} className={classes.img_} />
                <img src={Health} className={classes.img_health}></img>
                <Typography
                  style={{
                    color: '#333333',
                    fontFamily: 'Poppins !important',
                    marginLeft: '20px',
                  }}>
                  Toll free No.
                  {/* <br
                    style={{
                      display: screenWidth < 786 ? '' : 'none',
                    }}
                  ></br> */}
                  <span style={{ color: '#333333', fontWeight: 600 }}>
                    1800 0000 000
                  </span>
                </Typography>
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              lg={3}
              md={3}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <div>
                <a href='/homepageNew'>
                  <img src={MHLogo} style={{ height: '45px' }}></img> &nbsp;
                </a>
                <img src={MHText} style={{ height: '35px' }}></img>
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              lg={4}
              md={4}
              style={{
                display: 'flex',
                justifyContent: screenWidth < 786 ? 'space-evenly' : 'flex-end',
              }}>
              <div style={{ marginRight: screenWidth < 786 ? '' : '70px' }}>
                <IconButton
                  className={token ? `${classes.user_name}` : 'd-none'}
                  style={{ height: '40px', marginLeft: '30px' }}
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleClickMenu}
                  color='inherit'>
                  <AccountCircle /> &nbsp;
                  {signinInfo && signinInfo.data && signinInfo.data.fullName}
                </IconButton>
                <Menu
                  style={{ marginTop: '3%' }}
                  id='simple-menu'
                  anchorEl={anchorElMenu}
                  keepMounted
                  open={Boolean(anchorElMenu)}
                  onClose={handleCloseMenu}>
                  <MenuItem onClick={handleCloseMenu} className={classes.ml_5}>
                    <i className='fas fa-envelope'></i>
                    &nbsp;{'Menu '}
                    {signinInfo && signinInfo.data && signinInfo.data.email}
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      history.push('/WebDashboard', {});
                    }}
                    className={classes.ml_5}>
                    <i className='fas fa-chart-line'></i>
                    &nbsp;Dashboard
                  </MenuItem>
                  <Divider />
                  <MenuItem
                    onClick={() => {
                      handleCloseMenu();
                      history.push('/', {});
                    }}
                    className={classes.ml_5}>
                    <i className='fas fa-sign-out-alt'></i>
                    &nbsp;Logout
                  </MenuItem>
                </Menu>

                {(['right'] as Anchor[]).map((anchor) => (
                  <React.Fragment key={anchor}>
                    <IconButton
                      className={classes.menuButton}
                      color='inherit'
                      aria-label='menu'
                      // onClick={handleClick}
                      onClick={toggleDrawer(anchor, true)}>
                      <MenuIcon
                        style={{ color: '#333333', fontFamily: 'Poppins' }}
                      />
                      &nbsp;Menu
                    </IconButton>
                    <Drawer
                      anchor={anchor}
                      open={openDrawer[anchor]}
                      onClose={toggleDrawer(anchor, false)}
                      style={{ width: '80%' }}
                      classes={{
                        paper: classes.drawerPaper,
                      }}>
                      <DialogTitle
                        disableTypography
                        style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IconButton
                          onClick={() => {
                            setOpenDrawer({ ...openDrawer, [anchor]: false });
                          }}>
                          <HighlightOffIcon
                            style={{ color: '#FF6C00', fontSize: '30px' }}
                          />
                        </IconButton>
                      </DialogTitle>
                      <Grid container spacing={3}>
                        <Grid item xs={12} lg={3} xl={3}>
                          <i
                            style={{
                              marginLeft: '15px',
                              fontSize: '30px',
                              color: '#E68839',
                            }}
                            className='fa fa-university'
                            aria-hidden='true'></i>
                          <Typography
                            variant='h5'
                            style={{
                              marginLeft: '15px',
                              fontWeight: 600,
                              color: '#138808',
                            }}>
                            Manyavaranche Sandesh
                          </Typography>
                          {menuvalues.map((item, index) => {
                            if (item.id < 8)
                              return (
                                <List
                                  key={index}
                                  style={{ height: '40px', padding: '0px' }}
                                  component='nav'
                                  aria-label='secondary mailbox folders'>
                                  <ListItemLink href='' onClick={handleClose}>
                                    <ListItemIcon style={{ minWidth: '25px' }}>
                                      <i
                                        className='fa fa-arrow-right'
                                        aria-hidden='true'></i>
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={item.label}
                                      onClick={() => menulink(item)}
                                    />
                                  </ListItemLink>
                                </List>
                              );
                          })}
                        </Grid>
                        <Grid item xs={12} lg={3} xl={3}>
                          <i
                            className='fa fa-universal-access'
                            style={{
                              fontSize: '30px',
                              marginLeft: '15px',
                              color: '#E68839',
                            }}
                            aria-hidden='true'></i>
                          {menuvalues.map((item, index) => {
                            if (item.id == 8)
                              return (
                                <List
                                  key={index}
                                  component='nav'
                                  aria-label='secondary mailbox folders'>
                                  <Typography
                                    variant='h5'
                                    style={{
                                      marginLeft: '15px',
                                      fontWeight: 600,
                                      color: '#138808',
                                    }}
                                    onClick={() => menulink(item)}>
                                    {item.label}
                                  </Typography>
                                  <ListItemLink href='' onClick={handleClose}>
                                    {/* <ListItemText
                                    primary={item.label}
                                    onClick={() => menulink(item)}
                                  /> */}
                                  </ListItemLink>
                                </List>
                              );
                          })}
                        </Grid>
                        <Grid item xs={12} lg={3} xl={3}>
                          <i
                            className='fa fa-cogs'
                            aria-hidden='true'
                            style={{
                              fontSize: '25px',
                              marginLeft: '15px',
                              color: '#E68839',
                            }}></i>
                          <Typography
                            variant='h5'
                            style={{
                              marginLeft: '15px',
                              fontWeight: 600,
                              color: '#138808',
                            }}>
                            Quick Links
                          </Typography>
                          <List
                            component='nav'
                            aria-label='secondary mailbox folders'>
                            <ListItemLink href=''>
                              <ListItemIcon style={{ minWidth: '25px' }}>
                                <i
                                  className='fa fa-arrow-right'
                                  aria-hidden='true'></i>
                              </ListItemIcon>
                              <ListItemText
                                primary={'Alerts & Notifications'}
                              />
                            </ListItemLink>
                            <ListItemLink href=''>
                              <ListItemIcon style={{ minWidth: '25px' }}>
                                <i
                                  className='fa fa-arrow-right'
                                  aria-hidden='true'></i>
                              </ListItemIcon>
                              <ListItemText
                                primary={'Private Practitioner Entry'}
                              />
                            </ListItemLink>
                            <ListItemLink href=''>
                              <ListItemIcon style={{ minWidth: '25px' }}>
                                <i
                                  className='fa fa-arrow-right'
                                  aria-hidden='true'></i>
                              </ListItemIcon>
                              <ListItemText primary={'Technical Advisor'} />
                            </ListItemLink>
                            <ListItemLink href=''>
                              <ListItemIcon style={{ minWidth: '25px' }}>
                                <i
                                  className='fa fa-arrow-right'
                                  aria-hidden='true'></i>
                              </ListItemIcon>
                              <ListItemText primary={'Resources'} />
                            </ListItemLink>
                          </List>
                        </Grid>

                        {menuvalues.map((item, index) => {
                          if (item.id > 8)
                            return (
                              <Grid item xs={12} lg={3} xl={3} key={index}>
                                {item.label == 'Others' ? (
                                  <i
                                    className='fa fa-globe'
                                    aria-hidden='true'
                                    style={{
                                      fontSize: '25px',
                                      marginLeft: '15px',
                                      color: '#E68839',
                                    }}></i>
                                ) : (
                                  <i
                                    className='fa fa-download'
                                    aria-hidden='true'
                                    style={{
                                      fontSize: '25px',
                                      marginLeft: '15px',
                                      color: '#E68839',
                                    }}></i>
                                )}
                                <Typography
                                  variant='h5'
                                  style={{
                                    marginLeft: '15px',
                                    fontWeight: 600,
                                    color: '#138808',
                                  }}
                                  onClick={() => menulink(item)}>
                                  {item.label}
                                </Typography>
                              </Grid>
                            );
                        })}

                        <Grid item xs={12} lg={3} xl={3}>
                          <i
                            className='fa fa-info'
                            aria-hidden='true'
                            style={{
                              fontSize: '25px',
                              marginLeft: '15px',
                              color: '#E68839',
                            }}></i>
                          <Typography
                            variant='h5'
                            style={{
                              marginLeft: '15px',
                              fontWeight: 600,
                              color: '#138808',
                            }}>
                            About LFEP
                          </Typography>
                        </Grid>
                        <Grid item xs={12} lg={3} xl={3}>
                          <i
                            className='fa fa-user'
                            aria-hidden='true'
                            style={{
                              fontSize: '25px',
                              marginLeft: '15px',
                              color: '#E68839',
                            }}></i>
                          <Typography
                            variant='h5'
                            style={{
                              marginLeft: '15px',
                              fontWeight: 600,
                              color: '#138808',
                            }}>
                            Contact Us
                          </Typography>
                        </Grid>
                      </Grid>
                    </Drawer>
                  </React.Fragment>
                ))}

                {!token && (
                  <Button
                    style={{ color: 'white', background: '#E68839' }}
                    className={token ? 'd-none' : ''}>
                    Sign in
                  </Button>
                )}
              </div>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div></div>
    </div>
  );
}
