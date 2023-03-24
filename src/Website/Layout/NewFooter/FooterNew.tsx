import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Logo from '../../assets/img/mhlogo.png';
import AshokStambhYellow from '../../assets/img/sathyameva_jayathe@2x.png';
import Health from '../../assets/img/264217.svg';
import MHLogo from '../../assets/img/Maharashtra_shasan@2x.png';
import MHText from '../../assets/img/Maharashtra_shasan_logotype@2x.png';
import FBLogo from '../../../../../../SourceCode/admin/src/Admin/assets/Icon awesome-facebook-square@2x.png';
import TLogo from '../../../../../../SourceCode/admin/src/Admin/assets/twitter.png';
import LinkLogo from '../../../../../../SourceCode/admin/src/Admin/assets/Icon awesome-linkedin@2x.png';
import { Typography } from '@material-ui/core';
import { color } from 'html2canvas/dist/types/css/types/color';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      background: '#F7F7F7',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    footer_div: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '10%',
    },
    text_fam: {
      fontFamily: 'Poppins ,sans-serif !important',
      fontWeight: 600,
    },
    footer_box: {
      textAlign: 'center',
      color: '#333333',
      fontFamily: 'Poppins ,sans-serif !important',
      fontWeight: 600,
      height: '35px',
      fontSize: '12px',
      borderTop: 'solid 1px #9A9A9A',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
    },
  }),
);

export default function HomeFooter(props: any) {
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
    <div className={classes.root}>
      <Grid container>
        <Grid
          item
          xs={1}
          sm={1}
          md={1}
          lg={1}
          className='d-none d-sm-block'></Grid>
        <Grid item xs={12} sm={3} md={3} lg={3}>
          <div className={classes.footer_div}>
            <img src={MHLogo} style={{ height: '45px' }}></img> &nbsp;
            <img src={MHText} style={{ height: '35px' }}></img>
          </div>
        </Grid>
        <Grid item xs={12} sm={2} md={2} lg={2}>
          <div className={classes.footer_div}>
            <Typography
              className={classes.text_fam}
              style={{
                color: '#333333',
                textAlign: 'center',
                marginTop: '15px',
              }}></Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3}>
          <div className={classes.footer_div}>
            <img src={AshokStambhYellow} style={{ width: '35px' }}></img>
            <img
              src={Health}
              style={{ width: '50px', marginLeft: '15px' }}></img>
          </div>
        </Grid>
        <Grid item xs={12} sm={3} md={3} lg={3}>
          <Typography
            className={classes.text_fam}
            style={{
              fontSize: '12px',
              textAlign: 'center',
              margin: '10px',
              color: '#333333',
              fontWeight: 600,
            }}>
            Social Media Links
          </Typography>
          <div
            className=''
            style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={FBLogo}
              style={{
                width: '25px',
                height: '30px',
                marginLeft: '15px',
                borderRadius: '3px',
              }}
            />
            <img
              src={LinkLogo}
              style={{
                width: '25px',
                height: '30px',
                marginLeft: '15px',
                borderRadius: '3px',
              }}
            />
            <img
              src={TLogo}
              style={{
                width: '25px',
                height: '30px',
                marginLeft: '15px',
                borderRadius: '3px',
              }}
            />
          </div>
          <Typography
            style={{
              color: '#333333',
              textAlign: 'center',
              margin: '10px',
            }}>
            Toll free No.
            <span
              className='text_fam'
              style={{ color: '#333333', fontWeight: 600 }}>
              1800 0000 000
            </span>
          </Typography>
        </Grid>
        <Grid
          item
          xs={1}
          sm={1}
          md={1}
          lg={1}
          className='d-none d-sm-block'></Grid>
      </Grid>
      <div className={classes.footer_box}>
        Copyright © 2021. All rights reserved.
      </div>
    </div>
  );
}
