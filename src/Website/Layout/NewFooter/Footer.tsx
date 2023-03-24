import { Grid } from '@material-ui/core';
import React, { useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import facebook from '../../assets/img/footer/facebookicon.png';
import twitter from '../../assets/img/footer/twittericon.png';
import linkedin from '../../assets/img/footer/linkedinicon.png';
import ellipse from '../../assets/img/footer/Ellipse.png';
import AshokStambhYellow from '../../assets/img/sathyameva_jayathe@2x.png';
import Logo from '../../assets/img/mhlogo.png';
import Health from '../../assets/img/264217.svg';
import history from '../../../helpers/history';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menu: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '13px',
      lineHeight: '20px',
      color: '#123962',
      whiteSpace: 'nowrap',
    },
    img: { objectFit: 'cover', width: '35px', marginRight: theme.spacing(2) },
    logo: { height: '35px', marginRight: '16px' },
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
  })
);

const Footer = (props: any) => {
  const classes = useStyles();
  const Websitecontent = props.webSiteContent;
  let contactUsText = () => {
    if (Websitecontent && Websitecontent.contactUsText) {
      return (
        <div className='con-box font-chng'>
          <h4>Contact Us</h4>
          <p>{Websitecontent.contactUsText}</p>
        </div>
      );
    }
  };

  return (
    <div className='foot-secnew'>
      <div className='footerblock'>
        <Grid container>
          <Grid
            container
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              backgroundColor: 'rgba(205, 210, 213, 0.32)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              className='container containerlatest'
              style={{
                display: 'flex',
                paddingTop: '15px',
                paddingBottom: '15px',
              }}
            >
              <Grid container item xs={6} className='menuitem'>
                <Grid item xs={4}>
                  <p
                    className='menu'
                    style={{ cursor: 'pointer' }}
                    onClick={() => history.push('/newhome', {})}
                  >
                    Home
                  </p>
                </Grid>
                <Grid item xs={4}>
                  <p className='menu_About'>About Us</p>
                </Grid>
                <Grid item xs={4}>
                  <p className='menu_Contact'>Contact Us</p>
                </Grid>
                {/* <Grid item xs={4}></Grid> */}
              </Grid>
              <Grid container item xs={4}></Grid>
              <Grid
                container
                style={{ verticalAlign: 'middle', alignItems: 'center' }}
                item
                xs={6}
              >
                <Grid item xs={4}>
                  <img alt='' src={facebook} />
                </Grid>
                <Grid item xs={4}>
                  <img alt='' src={twitter} className='twitter' />
                </Grid>
                <Grid item xs={4}>
                  <img alt='' src={linkedin} />
                </Grid>
                {/* <Grid item xs={3}></Grid> */}
              </Grid>
            </div>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sm={12}
            md={12}
            style={{
              backgroundColor: 'rgba(205, 210, 213, 0.1)',
              paddingTop: '15px',
              paddingBottom: '15px',
            }}
          >
            <div className='container'>
              <img alt='' src={AshokStambhYellow} className={classes.img} />
              <img alt='' src={Logo} className='logofooter' />
              <img alt='' src={Health} className={classes.logo} />
              <p className='tolltextfooter'>
                Toll free :<p className='tollnumberfooter'>1800 0000 000</p>
              </p>
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};
export default Footer;
