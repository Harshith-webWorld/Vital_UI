import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import { WebsiteContentNews } from '../../../helpers/interfaces/websitecontent-news';
import NewsService from '../../../helpers/services/website-news.service';
import history from '../../../helpers/history';
import { Button } from 'react-bootstrap';
import ReactHtmlParser from 'react-html-parser';
import { useLocation } from 'react-router-dom';
import SettingsService from '../../../helpers/services/website-settings.service';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Divider, Icon, Typography } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import DateRangeIcon from '@material-ui/icons/DateRange';
import calendar from '../../assets/img/calendar.png';
import arrow from '../../assets/img/Shape.png';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 500,
      fontSize: '16px',
      lineHeight: '24px',
      color: '#000000',
      textDecoration: 'none',
    },
    content: {
      color: '#74788D',
      fontFamily: 'Poppins',
      fontStyle: 'normal',
      fontWeight: 400,
      fontSize: '13px',
      lineHeight: '20px',
    },
    rmbtn: {
      background: '#34C38F',
      borderRadius: '3px',
      float: 'right',
      marginTop: '7%',
      marginBottom: '2%',
      marginRight: '20px',
      border: '0px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      '&:hover': {
        background: '#34C38F',
      },
    },

    viewbtn: {
      background: '#34C38F',
      borderRadius: '3px',
      float: 'right',
      border: '0px',
      marginRight: '82px',
      marginTop: '-3px',
    },
  })
);

const NewsComponent: React.FC = () => {
  const classes = useStyles();
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };
  const options = { decodeEntities: true };
  let websiteContentNewsData: WebsiteContentNews[] = [];
  var News: any = [];
  const location = useLocation<any>();
  const [autoPlaySpeed, setautoPlaySpeed] = useState(20000);
  const [autoPlay, setautoPlay] = useState(true);
  const [websiteContentNewsFilepath, setWebsiteContentNewsFilepath] =
    useState('');
  const [websiteContentNews, setWebsiteContentNews]: [
    WebsiteContentNews[],
    (websiteContentNews: WebsiteContentNews[]) => void
  ] = React.useState(websiteContentNewsData);

  async function getSettings() {
    const response = await SettingsService.getOneWebsiteSettingsDataInfo(3);
    if (response && response.data && response.data.length > 0) {
      if (response.data[0].isEnabled) {
        setautoPlaySpeed(response.data[0].settingValue);
        setautoPlay(true);
      } else {
        setautoPlay(false);
      }
    }
  }

  async function getWebsitesiteNews() {
    const response = await NewsService.getNewsInfo();
    if (response) {
      websiteContentNewsData = response.data;
      setWebsiteContentNews(response.data);
      setWebsiteContentNewsFilepath(response.filepath);
    }
  }

  if (websiteContentNews && websiteContentNewsFilepath) {
    News = websiteContentNews.map((news, id) => {
      let imagesrc = `${websiteContentNewsFilepath}${news.newsImageName}`;
      if (news.isShowPublic)
        return (
          <div
            className='news-boxnew'
            style={{ maxWidth: '415px', maxHeight: '456px' }}
            key={news.id}
          >
            <style>
              {`.multitext-truncatenew {
                  height: 14%;
                  -webkit-box-orient: vertical;
                  display: -webkit-box;
                  overflow: hidden !important;
                  text-overflow: ellipsis;
                  -webkit-line-clamp: 1; /* number of lines to show */
                  line-clamp: 1; 
                  -webkit-box-orient: vertical;
                     }
                .multitext-truncatenewhead {
                  display: -webkit-box;
                  text-overflow: ellipsis;
                  -webkit-line-clamp: 2; /* number of lines to show */
                  line-clamp: 2; 
                  -webkit-box-orient: vertical;
                  text-decoration: none;
                  padding: 4px 20px 0px;
                  overflow: hidden; 
                  color: #000000;
                  font-size: 16px;
                  font-style: normal;
                  font-family: Poppins;
                  font-weight: 500;
                  line-height: 24px;
                     } 
                .heading {
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 1; /* number of lines to show */
                  line-clamp: 1; 
                  -webkit-box-orient: vertical;
                       }`}
            </style>
            <div style={{ borderRadius: '9px', margin: '20px' }}>
              {news.isVideoContent && (
                <video
                  width='100%'
                  height='170px'
                  controls
                  style={{
                    borderRadius: '9px',
                    boxShadow: 'none',
                    maxHeight: '224px',
                    maxWidth: '328px',
                    marginTop: '20px',
                  }}
                  src={imagesrc}
                ></video>
              )}
              {!news.isVideoContent && (
                <img
                  alt=''
                  src={imagesrc}
                  style={{
                    borderRadius: '9px',
                    boxShadow: 'none',
                    maxHeight: '224px',
                    maxWidth: '328px',
                    marginTop: '20px',
                  }}
                />
              )}
            </div>
            <div style={{ display: 'flex' }}>
              {/* 
              <Icon>
                <DateRangeIcon style={{ color: '#74788D' }} />
              </Icon> */}

              <Typography
                style={{
                  height: 'fit-content',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '13px',
                  // lineHeight: '20px',
                  /* identical to box height */
                  color: '#74788D',
                  margin: '0px 0px 0px 20px',
                }}
              >
                <img
                  src={calendar}
                  alt=''
                  style={{
                    width: '1rem',
                    height: '1rem',
                    boxShadow: 'none',
                    borderRadius: '0px',
                  }}
                />
                04 Mar, 2020
              </Typography>
            </div>
            <div style={{ height: '15%' }}>
              <div className='multitext-truncatenewhead'>
                {news.newsHeader}
                {/* Communities `must be prepared to accept` MDA interventions */}
              </div>
            </div>
            <div className='multitext-truncatenew'>
              {/* To mark the publication of new research on mass drug
              administration to eliminate lymphatic */}
              {ReactHtmlParser(news.newsDescriptionShortHTML, options)}
            </div>
            <br />
            <Divider
              style={{
                background: '#EFF2F7',
                marginLeft: '13px',
                marginRight: '13px',
              }}
            />
            <Button
              className={classes.rmbtn}
              onClick={() =>
                history.push(`/newreadMore`, {
                  id: news.id,
                  field: 'websitecontent-news',
                  prevPath: location.pathname,
                })
              }
            >
              Read More
            </Button>
          </div>
        );
    });
  }
  React.useEffect(() => {
    getWebsitesiteNews();
    getSettings();
  }, []);

  const CustomButtonGroupAsArrows = (props) => {
    return (
      <div
        style={{
          textAlign: 'center',
          marginTop: '0px',
        }}
      >
        <Icon onClick={props.previous}>
          <ArrowLeftIcon
            style={{
              borderRadius: '50%',
              backgroundColor:
                props.carouselState.currentSlide == 0
                  ? 'rgba(28, 164, 242, 0.16)'
                  : '#34C38F',

              alignItems: 'center',
              color: 'white',
            }}
          />
        </Icon>
        <span
          style={{
            margin: '10px',
          }}
        ></span>
        <Icon onClick={props.next}>
          <ArrowRightIcon
            style={{
              borderRadius: '50%',
              backgroundColor:
                props.carouselState.currentSlide == websiteContentNews.length
                  ? 'rgba(28, 164, 242, 0.16)'
                  : '#34C38F',
              alignItems: 'center',
              color: 'white',
            }}
          />
        </Icon>
      </div>
    );
  };
  return (
    <div
      className='news-sec font-chng'
      style={{ backgroundColor: '#F8F8FB', padding: '35px 0px 70px 0px' }}
    >
      <style>{`
        @media only screen and (max-width: 320px) {
              .view_more {
                 margin-top:0px !important;
             }
           }`}</style>
      {/* <div className='container'> */}
      <div style={{ width: '96%', marginLeft: '7%' }}>
        <div style={{ width: '100%', textAlign: 'center', marginLeft: '2%' }}>
          <Button
            className='viewbtn'
            onClick={() => history.push(`/newnewsgallery`, {})}
            style={{ marginRight: '11.9em', whiteSpace: 'nowrap' }}
          >
            View all
          </Button>
          <p
            className='faq-head'
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '22px',
              lineHeight: '33px',
              color: '#495057',
              backgroundColor: 'tranparent',
              textAlign: 'center',
              alignItems: 'center',
              marginBottom: '0px',
              width: '85%',
              marginLeft: '5%',
            }}
          >
            Latest News
          </p>
        </div>
        <div
          style={{
            position: 'relative',
            width: '90%',
          }}
        >
          <Carousel
            additionalTransfrom={0}
            arrows={false}
            autoPlaySpeed={3000}
            centerMode={false}
            className=''
            customButtonGroup={<CustomButtonGroupAsArrows />}
            dotListClass=''
            draggable
            focusOnSelect={false}
            infinite={true}
            itemClass=''
            keyBoardControl
            minimumTouchDrag={80}
            renderButtonGroupOutside
            renderDotsOutside={false}
            responsive={responsive}
            showDots={false}
            sliderClass=''
            slidesToSlide={1}
            swipeable
          >
            {News}
          </Carousel>
        </div>
      </div>
      {/* // </div> */}
    </div>
  );
};

export default NewsComponent;
