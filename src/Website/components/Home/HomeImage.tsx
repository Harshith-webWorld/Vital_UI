import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import { Button } from 'react-bootstrap'
import { IconButton } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import { Divider } from '@material-ui/core'
import FlagBanner from '../../../../../../SourceCode/admin/src/Admin/assets/bg_increased_opactiy@2x.png'
import "./home.scss";
import FontSizeChanger from 'react-font-size-changer'
import { WebsiteContentImages } from '../../../helpers/interfaces/websitecontent-images'
import 'bootstrap/dist/css/bootstrap.css'
import '../../assets/sass/main.css'
import history from '../../../helpers/history'
import ImagesService from '../../../helpers/services/website-images.service'
import ReactHtmlParser from 'react-html-parser'
import { useLocation } from 'react-router-dom'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    img_: {
      objectFit: 'cover'
    },
    Tittletext_: {
      fontFamily: 'Poppins  !important',
      fontWeight: 600,
    },
    text_fam: {
      fontFamily: 'Poppins,sans-serif !important',
      fontWeight: 600,
    }
  }),
)

export default function HomeImage() {
  const classes = useStyles()
  let websiteContentImagesData: WebsiteContentImages[] = []
  const options = { decodeEntities: true }
  const [websiteContentImages, setWebsiteContentImages]: [
    WebsiteContentImages[],
    (websiteContentImages: WebsiteContentImages[]) => void,
  ] = React.useState(websiteContentImagesData)
  const [
    websiteContentImagesFilepath,
    setWebsiteContentImagesFilepath,
  ] = useState('')
  const location = useLocation<any>()

  React.useEffect(() => {
    getWebsitesiteImages()
  }, [])

  async function getWebsitesiteImages() {
    const response = await ImagesService.getImagesInfo()
    console.log('getWebsitesiteImages:: ', response)
    if (response) {
      websiteContentImagesData = response.data
      setWebsiteContentImages(response.data)
      setWebsiteContentImagesFilepath(response.filepath)
    }
  }
  const [currentIndex, setCurrentIndex] = useState(0)
  const goToPrevSlide = () => {
    const newPointer = currentIndex === 0 ? websiteContentImages.length - 1 : currentIndex - 1
    setCurrentIndex(newPointer)
  }

  const goToNextSlide = () => {
    const newPointer = currentIndex === websiteContentImages.length - 1 ? 0 : currentIndex + 1
    setCurrentIndex(newPointer)
  }
  return (
    <div className={classes.root}>
      <style>{`
.font_changer_btn{
  display:inline-grid,
}
  `}</style>
      {websiteContentImages?.map((image: any, index: any) => {
        if (currentIndex === index) {
          let imagesrc = `${websiteContentImagesFilepath}${image.imageName}`

          return <Grid
            container
            spacing={3}
            style={{
              marginTop: '5%',
              backgroundImage: `url(${FlagBanner})`,
              backgroundSize: '1493px 617px ',
            }}
            key={index}
          >
            <Grid item md={1} lg={1} className="d-none d-sm-block" >
            </Grid>
            <Grid item xs={12} md={5} lg={4} style={{ height: '5%' }}>
              <Typography
                variant="h5"
                className={classes.Tittletext_}
                style={{
                  color: '#138808',
                  textAlign: 'left',
                  letterSpacing: '0px',
                  fontSize: '2.5rem'
                }}
              >
                Lymphatic Filaria Elimination Program
              </Typography>
              <Paper className={classes.paper} style={{ marginTop: '10px', }}>
                <Typography
                  className={classes.Tittletext_}
                  variant="h5"
                  gutterBottom
                  style={{ color: '#333333', textAlign: 'initial', fontWeight: 'bolder', }}
                  onClick={() =>
                    history.push(`/Homereadmore`, {
                      id: image.id,
                      field: 'websitecontent-image',
                      prevPath: location.pathname,
                    })
                  }
                >
                  {image.imageHeader}
                </Typography>
                <Typography
                  className={`${classes.text_fam} multitext-truncate`}
                  variant="body2"
                  color="textSecondary"
                  style={{ textAlign: 'initial', height: '130px', fontSize: '18px', }}
                >
                  {ReactHtmlParser(image.imageHtmlText, options)}
                </Typography>

                <Button
                  variant="contained"
                  className={classes.text_fam}
                  style={{
                    background: '#FFFFFF',
                    color: '#E68839',
                    borderRadius: '5px',
                    border: '1px solid #E68839',
                    alignItems: 'initial',
                    display: 'flex',
                    marginTop: '10px',
                  }}
                  onClick={() =>
                    history.push(`/HomePhotogallery`, {
                      id: image.id,
                      field: 'websitecontent-image',
                    })
                  }
                >
                  View More
                </Button>
                <Divider style={{ marginTop: '12%' }} />
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  <IconButton aria-label="pre" onClick={goToPrevSlide}>
                    <ArrowBackIcon fontSize={'small'} />
                  </IconButton>
                  <span>
                    {currentIndex + 1}/{websiteContentImages.length}
                  </span>
                  <IconButton aria-label="next" onClick={goToNextSlide}>
                    <ArrowForwardIcon fontSize={'small'} />
                  </IconButton>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5} lg={6}>
              <div style={{}}>
                <img
                  src={imagesrc}
                  className={classes.img_}
                  alt="Responsive"
                  height="500"
                  style={{borderRadius:'5px' ,width:'100%'  }}
                ></img>
              </div>
            </Grid>
            <Grid item md={1} lg={1} className="d-none d-sm-block">
              <div className='d-none d-sm-block font_style_changer'>
                <FontSizeChanger
                  targets={[
                    '.font-chng',
                    '.form-control',
                    'custom-select',
                    'step-icon',
                  ]}
                  onChange={(element, newValue, oldValue) => {
                    console.log(element, newValue, oldValue)
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
                      backgroundColor: '#333333',
                      border: '1px solid #fff',
                      color: '#FFFFFF',
                      WebkitBoxSizing: 'border-box',
                      WebkitBorderRadius: '0',
                      width: '36px',
                      height: '35px',
                      cursor: 'pointer',
                      lineHeight: '2',
                      fontWeight: '600',
                      // marginTop: '10px',
                      display: 'inline-grid',
                    },
                    buttonsMargin: 0,
                  }}
                />
              </div>

            </Grid>
          </Grid>
        }
      })}
    </div>
  )
}
