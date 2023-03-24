import React, { useState } from 'react'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import videoServices from '../../../helpers/services/website-videos.service'
import { WebsiteContentVideos } from '../../../helpers/interfaces/websitecontent-videos'
import { useLocation } from 'react-router-dom'
import history from '../../../helpers/history'
import ReactHtmlParser, {
  convertNodeToElement,
  processNodes,
} from 'react-html-parser'
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '2%',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },

    vertical_dash: {
      top: '50%',
      bottom: 'auto',
      flexDirection: 'column',
      width: '3px',
      height: 'auto',
      margin: 0,
      transform: 'translateY(-50%)',
    },
    dashed_lines: {
      right: 'auto',
      left: '12px',
    },
    Tittletext_: {
      fontFamily: 'Poppins !important',
      fontWeight: 700,
    },
    video_text_: {
      fontFamily: 'Poppins  !important',
      fontWeight: 800,
    },
    video_ds_txt:{
      fontFamily: 'Poppins  !important',
      fontWeight: 600,
    }
  }),
)

export default function HomeVideo() {
  const classes = useStyles()
  const [videostatus, setvideoostatus] = useState(true)
  const [videoIndex, setVideoIndex] = useState(1)
  const [transitionDuration, settransitionDuration] = useState(500)
  const [autoPlaySpeed, setautoPlaySpeed] = useState(3000)
  const [
    websiteContentVideosFilepath,
    setWebsiteContentVideosFilepath,
  ] = useState('')
  let websiteContentVideosData: WebsiteContentVideos[] = []
  const [websiteContentVideos, setWebsiteContentVideos]: [
    WebsiteContentVideos[],
    (websiteContentVideos: WebsiteContentVideos[]) => void,
  ] = React.useState(websiteContentVideosData)
  const location = useLocation<any>()
  const options = {
    decodeEntities: true,
  }

  React.useEffect(() => {
    getWebsiteVideos()
  }, [])
  var Videos: any = []

  async function getWebsiteVideos() {
    const response = await videoServices.getVideoInfo()
    if (response) {
      websiteContentVideosData = response.data
      console.log('website content videos:: ', websiteContentVideosData)
      setWebsiteContentVideos(response.data)
      setWebsiteContentVideosFilepath(response.filepath)
    }
  }
  const play = () => {
    settransitionDuration(0)
    setautoPlaySpeed(0)
    setvideoostatus(false)
    document.body.style.overflow = 'hidden'
  }
  const pause = () => {
    setvideoostatus(true)
    settransitionDuration(500)
    setautoPlaySpeed(3000)

    document.body.style.overflow = 'auto'
  }
  const end = () => {
    setvideoostatus(true)
    settransitionDuration(500)
    setautoPlaySpeed(3000)
    document.body.style.overflow = 'auto'
  }

  return (
    <div className={classes.root}>
      {websiteContentVideos.map((video: any, index: any) => {
        if (index == videoIndex) {
          let videosrc = `${websiteContentVideosFilepath}${video.videoName}`

          return (
            <Grid container style={{ padding: '10px' }} key={index}>
              <Grid
                item
                xs={1}
                md={1}
                lg={1}
                className="d-none d-sm-block d-md-block"
              >
                <ul
                  className="d-none d-sm-block list_home"
                  style={{ marginLeft: '35%' }}
                >
                  <li onClick={() => setVideoIndex(0)}></li>
                  <li onClick={() => setVideoIndex(1)}></li>
                  <li onClick={() => setVideoIndex(2)}></li>
                </ul>
              </Grid>
              <Grid
                item
                xs={10}
                md={5}
                lg={5}
                style={{ display: 'flex', marginTop: '10px' }}
              >
                <video
                  width="100%"
                  height="100%"
                  controls
                  //   id={`myVideo${video.id}`}
                  onPlay={() => play()}
                  onPause={() => pause()}
                  onEnded={() => end()}
                  onTouchMoveCapture={() => pause()}
                >
                  <source src={videosrc} />
                </video>
              </Grid>
              <Grid item xs={10} md={4} lg={4} style={{ marginLeft: '2%' }}>
                <Typography
                  gutterBottom
                  className={classes.video_text_}
                  style={{
                    color: '#439322',
                    textAlign: 'initial',
                    fontSize: 'Medium',
                  }}
                >
                  LATEST VIDEO
                </Typography>
                <Typography
                  style={{ textAlign: 'initial' }}
                  className={classes.Tittletext_}
                  variant="h5"
                  onClick={() =>
                    history.push(`/Homereadmore`, {
                      id: video.id,
                      field: 'websitecontent-video',
                      prevPath: location.pathname,
                    })
                  }
                >
                  {video.videoHeader}
                </Typography>
                <Typography
                  className={`${classes.video_ds_txt} multitext-truncate`}
                  style={{
                    marginTop: '5px',
                    height: '100px',
                  }}
                >
                  {ReactHtmlParser(video.videoHtmlText, options)}
                </Typography>
                <Typography
                  style={{
                    textDecoration: 'underline',
                    letterSpacing: '0px',
                    marginTop: '10px',
                    marginBottom: '20px',
                    marginLeft: '10px',
                    color: '#E68839',
                    fontFamily: 'Poppins !important',
                  }}
                  onClick={() =>
                    history.push(`/HomeVideogallery`, {
                      id: video.id,
                      field: 'websitecontent-video',
                    })
                  }
                >
                  Read More
                </Typography>
              </Grid>
              <Grid item xs={1} md={1} lg={1}></Grid>
            </Grid>
          )
        }
      })}
    </div>
  )
}
