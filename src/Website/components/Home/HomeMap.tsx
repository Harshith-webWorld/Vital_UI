import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { Button } from 'react-bootstrap'
import { IconButton } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import MH1 from '../../assets/img/MH_Img/endemicity.jpeg'
import MH2 from '../../assets/img/MH_Img/mmdp.jpeg'
import MH3 from '../../assets/img/MH_Img/tas.jpeg'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '8%'
    },
    Tittletext_: {
      fontFamily: 'Poppins  !important',
      fontWeight: 600,
    },
  }),
)
export default function HomeMap() {
  const classes = useStyles()
  const [currentIndex, setCurrentIndex] = useState(0)
  const MapList = [MH1, MH2, MH3]
  const goToPrevSlide = () => {
    const newPointer =
      currentIndex === 0 ? MapList.length - 1 : currentIndex - 1
    setCurrentIndex(newPointer)
  }

  const goToNextSlide = () => {
    const newPointer =
      currentIndex === MapList.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newPointer)
  }
  return (
    <div className={classes.root}>
      <style>{`
   @media only screen 
   and (min-device-width: 320px) 
   and (max-device-width: 480px)
   and (-webkit-min-device-pixel-ratio: 2) {
 ._font{
   font-size:10px
 }
 }
  `}</style>
      <div
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          display: 'flex',
        }}
      >
        <Typography variant="h5"
         style={{fontSize:'2rem'}}
          className={classes.Tittletext_}
        >
          Lymphatic Filariasis Status In Maharashtra
        </Typography>
      </div>
      <Grid container >
        <Grid item xs={12} lg={12} md={12}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop:'40px'
            }}
          >
            <IconButton aria-label="pre" onClick={goToPrevSlide} style={{ marginLeft: '6%' }} className="d-none d-sm-block">
              <ArrowBackIcon fontSize={'small'} />
            </IconButton>
            <div>
              <h5
                style={{
                  position: 'absolute',
                  marginLeft: '6%',
                  marginTop: '15%',
                }}
                className='_font'
              >
                <i className="fas fa-map-marker-alt "></i>
                {currentIndex == 0 ? 'MH Endemicity' : 'MH MDA'}
                {currentIndex == 2 ? 'MH Endemicity' : ''}
              </h5>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={MapList[currentIndex]} style={{ width: '90%' }} className='class="col-xs-12' />
              </div>
            </div>
            <IconButton aria-label="next" onClick={goToNextSlide} className="d-none d-sm-block">
              <ArrowForwardIcon fontSize={'small'} />
            </IconButton>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}
