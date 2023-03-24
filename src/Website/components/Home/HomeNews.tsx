import React, { useState } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Collapse from '@material-ui/core/Collapse'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { red } from '@material-ui/core/colors'
import FavoriteIcon from '@material-ui/icons/Favorite'
import ShareIcon from '@material-ui/icons/Share'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { WebsiteContentNews } from '../../../helpers/interfaces/websitecontent-news'
import NewsService from '../../../helpers/services/website-news.service'
import history from '../../../helpers/history'
import ReactHtmlParser, {
  convertNodeToElement,
  processNodes,
} from 'react-html-parser'
import { useLocation } from 'react-router-dom'
import { Height } from '@material-ui/icons'
import NextArrow from '../../../../../../SourceCode/admin/src/Admin/assets/Icon metro-arrow-right@2x.png'
import Carousel from 'react-multi-carousel'
import { Button } from 'react-bootstrap'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      maxWidth: 'auto',
      // padding: '10px',
      height: '100%',
      fontFamily: 'Poppins !important',
    },
    media: {
      height: 0,
      paddingTop: '56.25%', // 16:9
    },
    expand: {
      transform: 'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    root_: {
      flexGrow: 1,
      marginTop: '3%',
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    _disabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      pointerEvents: 'none',
      // cursor: 'not-allowed',
      // pointer-events: 'none',
    },
    img_: {
      objectFit: 'cover',
    },
    New_ds_txt:{
      fontFamily: 'Poppins !important',
    },
    Tittletext_: {
      fontFamily: 'Poppins !important',
      fontWeight: 600,
      letterSpacing:'0px'
    },
    text_fam:{
      fontFamily:'Poppins,sans-serif !important',
      color:'#333333 !important',
      letterSpacing:'0px',
      fontWeight: 600,
    },
    text_Rm:{
      fontFamily:'Poppins,sans-serif !important',
      letterSpacing:'0px'
    }
  }),
)

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
    slidesToSlide: 2, // optional, default to 1.
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 768 },
    items: 2,
    slidesToSlide: 1, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
}

export default function HomePageNews() {
  const classes = useStyles()
  const options = {
    decodeEntities: true,
  }
  const [expanded, setExpanded] = React.useState(false)
  const location = useLocation<any>()
  const [websiteContentNewsFilepath, setWebsiteContentNewsFilepath] = useState(
    '',
  )
  let websiteContentNewsData: WebsiteContentNews[] = []
  const [websiteContentNews, setWebsiteContentNews]: [
    WebsiteContentNews[],
    (websiteContentNews: WebsiteContentNews[]) => void,
  ] = React.useState(websiteContentNewsData)
  let screenWidth: any = window.screen.availWidth

  const [startVal, setStartVal] = useState(0)
  const [endVal, setEndVal] = useState(3)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  React.useEffect(() => {
    getWebsitesiteNews()
  }, [])
  var News: any = []

  async function getWebsitesiteNews() {
    const response = await NewsService.getNewsInfo()
    if (response) {
      websiteContentNewsData = response.data
      setWebsiteContentNews(response.data)
      setWebsiteContentNewsFilepath(response.filepath)
    }
  }

  const goToPrevSlide = () => {
    setStartVal(startVal - 3)
    setEndVal(endVal - 3)
  }

  const goToNextSlide = () => {
    setStartVal(startVal + 3)
    setEndVal(endVal + 3)
  }
  const ButtonGroup = ({ next, previous, goToSlide, ...rest }: any) => {
    const {
      carouselState: { currentSlide },
    } = rest
    return (
      <div
        className="carousel-button-group Carousel_buttons"
        style={{
          position: 'absolute',
          justifyContent: 'space-between',
          width: '85%',
        }}
      >
        <div
          className={currentSlide === 0 ? 'disable' : ''}
          style={{ color: '#FFFFFF' }}
        >
          <i
            className="fa fa-arrow-left"
            aria-hidden="true"
            style={{ width: '20px' }}
            onClick={() => previous()}
          ></i>
        </div>

        <div style={{ color: '#FFFFFF' }}>
          <i
            className="fa fa-arrow-right"
            aria-hidden="true"
            onClick={() => next()}
            style={{ width: '20px' }}
          ></i>
        </div>
      </div>
    )
  }

  if (websiteContentNews && websiteContentNewsFilepath) {
    News = websiteContentNews.map((news, id) => {
      let imagesrc = `${websiteContentNewsFilepath}${news.newsImageName}`
      return (
        <div
        key={id}
          className="card"
          style={{
            marginTop: '8%',
            border: 'none',
            height: '450px',
            margin:'5px',
            borderRadius:'5px'
          }}
        >
          {news.isVideoContent && (
            <video
              className="card-img-top"
              width="100%"
              height="190px"
              controls
              src={imagesrc}
              style={{ objectFit: 'cover' }}
            ></video>
          )}
          {!news.isVideoContent && (
            <img
              className="card-img-top"
              src={imagesrc}
              width="100%"
              height="190px"
              style={{ objectFit: 'cover' }}
            />
          )}
          <div className="card-body">
            <h5
              className={`${classes.Tittletext_} card-title multitext-truncate`}
              onClick={() =>
                history.push(`/Homereadmore`, {
                  id: news.id,
                  field: 'websitecontent-news',
                  prevPath: location.pathname,
                })
              }
              style={{ height: '50px' }}
            >
              {news.newsHeader}
            </h5>
            <Typography
              className={`${classes.text_fam} multitext-truncate`}
              variant="body2"
              color="textSecondary"
              style={{ height: '125px' }}
            >
              {ReactHtmlParser(news.newsDescriptionShortHTML, options)}
            </Typography>
            <Typography
              style={{
                textDecoration: 'underline',
                letterSpacing: '0px',
                marginTop: '10px',
                marginBottom: '20px',
                marginLeft: '10px',
                color: '#E68839',
              }}
              onClick={() =>
                history.push(`/Homenewsgallery`, {
                  // id: image.id,
                  field: 'websitecontent-image',
                })
              }
            >
              View More
            </Typography>
          </div>
        </div> 
      )
    })
  }

  return (
    <div style={{ background: '#6C9B59', height: '600px' }}>
      <Grid container>
        <Grid item xs={1} style={{ background: '#6C9B59',}}></Grid>
        <Grid item xs={10}>
          <Typography
            variant="h5"
            className={classes.New_ds_txt}
            style={{
              color: '#FFFFFF',
              textTransform: 'capitalize',
              letterSpacing: '0px',
              // fontSize:'18px',
              position: 'relative',
              top: '15px',
              fontWeight:600,
              marginBottom:'20px',
              fontSize:'2rem'
            }}
          >
            Latest News
          </Typography>
          <Carousel
            className={'carousel_list'}
            responsive={responsive}
            arrows={false}
            customButtonGroup={News.length > 1 ? <ButtonGroup /> : <></>}
            swipeable={false}
            draggable={false}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            showDots={false}
            keyBoardControl={true}
            customTransition="all 1.2s ease 0s"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={['tablet', 'mobile']}
            // dotListClass='custom-dot-list-style'
            // itemClass='carousel-item-padding-40-px'
          >
            {News}
          </Carousel>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </div>
  )
}
