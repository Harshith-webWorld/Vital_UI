import React, { useState } from 'react';
import {
  alpha,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { Grid, Typography } from '@material-ui/core';
import AshokStambhYellow from '../../assets/img/sathyameva_jayathe@2x.png';
import Logo from '../../assets/img/mhlogo.png';
import Health from '../../assets/img/264217.svg';
import FontSizeChanger from 'react-font-size-changer';
import { useSelector } from 'react-redux';
import Moremenu from './Moremenu';
import SideMenu from './SideMenu';
import logouticon from '../../assets/img/logout.png';
import Button from '@material-ui/core/Button';
import history from '../../../helpers/history';
import { useDispatch } from 'react-redux';
import { onSignout } from '../../components/WebLogin/siginslice';
import { WebsiteOthersMenu } from '../../../helpers/interfaces/website-othersMenu';
import MenusService from '../../../helpers/services/website-otherMenu.service';
import { BASE_URL, IP_INFO_URL } from '../../../helpers/config';
import { post, publicGet } from '../../../helpers/fetchServicesMethods';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import NewModalSignin from '../../components/WebLogin/NewModalSignin';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
    menuButton: { marginRight: theme.spacing(2) },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    img: {
      objectFit: 'cover',
      width: '3%',
      backgroundColor: 'white',
    },
    logo: { height: '35px', marginRight: '16px' },
    menuoption: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '13px',
      lineHeight: '20px',
      /* identical to box height */
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: 'rgba(255, 255, 255, 0.898039)',
      alignItems: 'center',
      textAlign: 'center',
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'none',
      [theme.breakpoints.up('md')]: {
        display: 'flex',
      },
    },
    sectionMobile: {
      display: 'flex',
      [theme.breakpoints.up('md')]: {
        display: 'none',
      },
    },
    tollnumber: {
      fontFamily: 'Poppins',
      fontStyle: 'bold',
      fontWeight: 600,
      fontSize: '17.1196px',
      lineHeight: '26px',
      display: 'contents',
    },
    tolltext: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '17.1196px',
      lineHeight: '26px',
      display: 'contents',
    },
    signinbtn: {
      backgroundColor: '#123962',
      color: '#FFFFFF',
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '13px',
      lineHeight: '20px',
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
    },
  })
);
let StyleLink = { textDecoration: 'none', color: 'black' };

export default function PrimarySearchAppBar(props) {
  let Websitecontent = props.webSiteContent;
  let smallSideBarLinks;
  let WebsiteOthersMenus: WebsiteOthersMenu[] = [];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const signinInfo = useSelector((state: any) => state.Admin.signin);
  const token = signinInfo.token;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [date, setDate] = useState(new Date());
  const [menuList, setMenuList] = React.useState(WebsiteOthersMenus);
  const [show, setShow] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [title, settitle] = useState('Sign in');

  const userRoleScreens =
    signinInfo && signinInfo.data && signinInfo.data.userRoleScreenActivities;

  const signinScreens: any = [];
  if (userRoleScreens && userRoleScreens.length > 0) {
    userRoleScreens.map((Obj: any) => {
      signinScreens.push(Obj && Obj.screen);
    });
  }
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleCloseModal = () => setShow(false);
  const handleShowModal = () => setShow(true);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton aria-label='show 4 new mails' color='inherit'>
          <Badge badgeContent={4} color='secondary'>
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton aria-label='show 11 new notifications' color='inherit'>
          <Badge badgeContent={11} color='secondary'>
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label='account of current user'
          aria-controls='primary-search-account-menu'
          aria-haspopup='true'
          color='inherit'
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  async function Logout() {
    publicGet(IP_INFO_URL)
      .then(async (res) => {
        let clientIp = res;
        console.log('Logout-ip-: ', clientIp.ip);
        const result = await post(BASE_URL + '/auth/logout', {
          clientIp: clientIp.ip,
        });
        dispatch(onSignout());
        history.push('/');
      })
      .catch(async (error) => {
        console.log('IP_INFO_URL_Logout: ', error.response);
        const result = await post(BASE_URL + '/auth/logout', {});
        dispatch(onSignout());
      });
  }

  async function getMenus() {
    const response = await MenusService.getWebsiteOtherMenuInfo();
    if (response && response.data) {
      WebsiteOthersMenus = response.data;
      setMenuList(response.data);
    }
  }

  React.useEffect(() => {
    var timer = setInterval(() => setDate(new Date()), 1000);
    getMenus();
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  return (
    // <div className={classes.grow}>
    <>
      <AppBar
        position='sticky'
        style={{
          background:
            'linear-gradient(89.98deg, #19D895 50.02%, #2196F3 80.93%, #17B8F2 99.99%, rgba(193, 195, 197, 0.0169278) 100%)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <img
          alt=''
          src={AshokStambhYellow}
          className='logoimg'
          onClick={() => history.push('/newhome')}
        />
        <div className={token ? 'lg-block' : 'd-none'}>
          <SideMenu />
        </div>

        <Toolbar style={{ width: '97%' }}>
          <img alt='' src={Logo} className='LogoImgsymbol' />
          <img alt='' src={Health} className='LogoImgHealth' />
          <Typography component={'span'} className='tolltext'>
            Toll free :
            <Typography component={'span'} className='tollnumber'>
              1800 0000 000
            </Typography>{' '}
          </Typography>
          <div style={{ marginLeft: 'auto', marginRight: 0 }}>
            <Grid container spacing={1} alignItems='center'>
              <Grid item xs className='xs-none'>
                <button
                  className={'btn sign-btn font-chng'}
                  style={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '13px',
                    lineHeight: '20px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: '#FFFFFF',
                  }}
                  onClick={() => history.push('/newhome')}
                >
                  Home
                </button>
              </Grid>
              <Grid item xs className='xs-none'>
                <button
                  className={token ? 'btn sign-btn font-chng' : 'd-none'}
                  style={{
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '13px',
                    lineHeight: '20px',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    alignItems: 'center',
                    textAlign: 'center',
                    color: '#FFFFFF',
                  }}
                  onClick={() => history.push('/webdashboard')}
                >
                  Dashboard
                </button>
              </Grid>
              {/* <Grid item xs>
                <Typography className={classes.menuoption}>About Us</Typography>
              </Grid>*/}
              {/* <Grid item xs>
                <Typography className={classes.menuoption}>
                  Manyavaranche Sandesh
                </Typography>
              </Grid> */}
              {/*<Grid item xs>
                <Typography
                  className={classes.menuoption}
                  onClick={() => {
                    history.push('/newmenu_details', {
                      menuname: 'Shasan Katta',
                      id: 8,
                    });
                  }}>
                  Shasan Katta
                </Typography>
              </Grid>
               <Grid item xs>
                <Typography className={classes.menuoption}>
                  Downloads
                </Typography>
              </Grid> */}
              {/*<Grid item xs>
                <Typography className={classes.menuoption}>
                  Contact Us
                </Typography>
              </Grid> */}
            </Grid>
          </div>
          <div
            className={token ? 'd-none' : 'xs-block'}
            onClick={handleShowModal}
          >
            {' '}
            <i className='fas fa-user'></i>
          </div>

          <div className={token ? 'lg-block' : 'd-none'}>
            {' '}
            <i className='fa fa-home' onClick={Logout}></i>
          </div>

          <Moremenu />

          <div className='xs-none'>
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
                  border: 'none',
                  WebkitBorderRadius: '2.25px',
                  width: '36px',
                  height: '15px',
                  cursor: 'pointer',
                  lineheight: '14.63px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '9.75px',
                  lineHeight: '15px',
                  color: '#555B6D',
                  backgroundColor: '#F3F3F9',
                },
                buttonsMargin: 10,
              }}
            />
          </div>
          <button
            onClick={handleShowModal}
            className={token ? 'd-none' : 'btn sign-btn font-chng xs-none'}
            style={{
              backgroundColor: '#123962',
              color: '#FFFFFF',
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '13px',
              lineHeight: '20px',
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              marginLeft: '10px',
              width: '80px',
              filter: 'drop-shadow(0px 4px 4px #108AC0)',
              border: '1px solid #19D795',
            }}
          >
            Sign in
          </button>
          {token && (
            <img
              src={logouticon}
              onClick={Logout}
              alt=''
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '13px',
                lineHeight: '20px',
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center',
                marginLeft: '10px',
                cursor: 'pointer',
              }}
            />
          )}
        </Toolbar>
      </AppBar>
      {renderMenu}
      <Dialog
        fullWidth={true}
        maxWidth={'sm'}
        fullScreen={fullScreen}
        open={show}
        onClose={handleCloseModal}
        aria-labelledby='responsive-dialog-title'
      >
        <DialogTitle id='responsive-dialog-title'>
          <div
            className='formtitlenew font-chng'
            style={{ marginLeft: '19px' }}
          >
            {title}
          </div>
        </DialogTitle>
        <DialogContent>
          <NewModalSignin onChangetitle={(name: any) => settitle(name)} />
        </DialogContent>
        {/* <DialogActions>
          <Button autoFocus onClick={handleCloseModal} color='primary'>
            Disagree
          </Button>
          <Button onClick={handleCloseModal} color='primary' autoFocus>
            Agree
          </Button>
        </DialogActions> */}
      </Dialog>
    </>
    // </div>
  );
}
