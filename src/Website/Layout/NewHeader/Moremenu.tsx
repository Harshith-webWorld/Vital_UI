import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Icon, IconButton } from '@material-ui/core';
import MoreIcon from '@material-ui/icons/MoreVert';
import Grid from '@material-ui/core/Grid';
import {
  alpha,
  makeStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import history from '../../../helpers/history';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuheading: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
      color: '#00AEE6',
      cursor: 'pointer',
    },
    menu: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '13px',
      lineHeight: '20px',
      color: '#123962',
    },
    popup: {
      paddingLeft: '10px',
      maxWidth: '850px !important',
      '&.MuiMenu-paper': {
        maxWidth: '850px !important',
      },
    },
  })
);

export default function MenuPopupState() {
  let classes = useStyles();

  return (
    <PopupState variant='popover' popupId='demo-popup-menu'>
      {(popupState) => (
        <div>
          <IconButton
            aria-label='display more actions'
            edge='end'
            color='inherit'
            {...bindTrigger(popupState)}
          >
            <MoreIcon />
          </IconButton>{' '}
          <Menu {...bindMenu(popupState)} style={{ padding: '0px' }}>
            {' '}
            <div className={classes.popup}>
              <div style={{ display: 'flex' }}>
                <Icon onClick={popupState.close}>
                  <CloseIcon style={{ width: '0.8rem' }} />
                </Icon>{' '}
                <Grid container>
                  <Grid item xs={12}>
                    <MenuItem className={classes.menuheading}>
                      Manyavaranche Sandesh
                    </MenuItem>
                  </Grid>
                  <Grid container item xs={12} spacing={1}>
                    <Grid item xs={12} sm={3}>
                      <MenuItem
                        onClick={() => {
                          history.push('/newmenu_details', {
                            menuname: 'Health Minister (Cabinet)',
                            id: 1,
                          });
                          popupState.close();
                        }}
                      >
                        Health Minister (Cabinet)
                      </MenuItem>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MenuItem
                        onClick={() => {
                          history.push('/newmenu_details', {
                            menuname: 'Pricipal Secretary Of Health',
                            id: 3,
                          });
                          popupState.close();
                        }}
                      >
                        Principal Secretary of Health
                      </MenuItem>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MenuItem
                        onClick={() => {
                          history.push('/newmenu_details', {
                            menuname: 'Director Of Health(I)',
                            id: 5,
                          });
                          popupState.close();
                        }}
                      >
                        Director of Health (|)
                      </MenuItem>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <MenuItem
                        onClick={() => {
                          history.push('/newmenu_details', {
                            menuname: 'JTDHS',
                            id: 7,
                          });
                          popupState.close();
                        }}
                      >
                        JTDHS
                      </MenuItem>
                    </Grid>
                  </Grid>
                  <Grid container item xs={12} spacing={1}>
                    <Grid item xs={12} sm={3}>
                      <MenuItem
                        onClick={() => {
                          history.push('/newmenu_details', {
                            menuname: 'Health Minister (State)',
                            id: 2,
                          });
                          popupState.close();
                        }}
                      >
                        Health Minister (State)
                      </MenuItem>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MenuItem
                        onClick={() => {
                          history.push('/newmenu_details', {
                            menuname: 'Commissioner Of Health',
                            id: 4,
                          });
                          popupState.close();
                        }}
                      >
                        Commissioner of Health
                      </MenuItem>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MenuItem
                        onClick={() => {
                          history.push('/newmenu_details', {
                            menuname: 'Director Of Health(II)',
                            id: 6,
                          });
                          popupState.close();
                        }}
                      >
                        Director of Health (||)
                      </MenuItem>
                    </Grid>
                    {/* <Grid item xs={12} sm={2}>
                      <MenuItem onClick={popupState.close}></MenuItem>
                    </Grid> */}
                  </Grid>
                  <Grid container item xs={12} spacing={1}>
                    <Grid item xs={12} sm={3}>
                      <MenuItem
                        onClick={() => {
                          history.push('/newmenu_details', {
                            menuname: 'Others',
                            id: 9,
                          });
                          popupState.close();
                        }}
                        className={classes.menuheading}
                      >
                        Others
                      </MenuItem>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MenuItem
                        onClick={popupState.close}
                        className={classes.menuheading}
                      >
                        Quick Links
                      </MenuItem>
                    </Grid>
                    {/* <Grid item xs={12} sm={3}>
                      <MenuItem onClick={popupState.close}></MenuItem>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <MenuItem onClick={popupState.close}></MenuItem>
                    </Grid> */}
                  </Grid>
                  <Grid container item xs={12} spacing={1}>
                    <Grid item xs={12} sm={3}>
                      <MenuItem
                        onClick={popupState.close}
                        className={classes.menuheading}
                      >
                        About LFEP
                      </MenuItem>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <MenuItem onClick={popupState.close}>
                        Alerts and Notifications
                      </MenuItem>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <MenuItem onClick={popupState.close}>
                        Technical Advisor
                      </MenuItem>
                    </Grid>
                    {/* <Grid item xs={12} sm={2}>
                      <MenuItem onClick={popupState.close}></MenuItem>
                    </Grid> */}
                  </Grid>
                  <Grid container item xs={12} spacing={1}>
                    {/* <Grid item xs={12} sm={3}>
                      <MenuItem onClick={popupState.close}></MenuItem>
                    </Grid> */}
                    <Grid item xs={12} sm={4}>
                      <MenuItem onClick={popupState.close}>
                        Private Partitioner Entry
                      </MenuItem>
                    </Grid>
                    {/* <Grid item xs={12} sm={3}>
                      <MenuItem onClick={popupState.close}>Resources</MenuItem>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <MenuItem onClick={popupState.close}></MenuItem>
                    </Grid> */}
                  </Grid>
                </Grid>
              </div>
            </div>
          </Menu>
        </div>
      )}
    </PopupState>
  );
}
