import * as React from 'react';
import { useState, useEffect } from 'react';
import { WebsiteContentNews } from '../../../helpers/interfaces/websitecontent-news';
import NewsService from '../../../helpers/services/website-news.service';
import history from '../../../helpers/history';
import { Button } from 'react-bootstrap';
import ReactHtmlParser, {
  convertNodeToElement,
  processNodes,
} from 'react-html-parser';
import { Link } from 'react-router-dom';
import Header from '../../Layout/NewHeader/Header';
import Footer from '../../Layout/NewFooter/Footer';
import { WebsiteContent } from '../../../helpers/interfaces/websitecontent';
import WebsiteContentService from '../../../helpers/services/website-content.service';
import { useLocation } from 'react-router-dom';
import {
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import { Divider, Icon, Typography } from '@material-ui/core';
import calendar from '../../assets/img/calendar.png';

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
      marginTop: '2%',
      marginBottom: '2%',
      marginRight: '20px',
      border: '0px',
    },
  })
);

const NewsGallery = () => {
  const [websiteContentNewsFilepath, setWebsiteContentNewsFilepath] =
    useState('');
  const classes = useStyles();
  let WebsiteContentData: WebsiteContent[] = [];
  let websiteContentNewsData: WebsiteContentNews[] = [];
  const [websiteContentNews, setWebsiteContentNews]: [
    WebsiteContentNews[],
    (websiteContentNews: WebsiteContentNews[]) => void
  ] = React.useState(websiteContentNewsData);
  const options = {
    decodeEntities: true,
  };
  const location = useLocation<any>();

  const [websiteContents, setWebsiteContent] = useState(WebsiteContentData);
  React.useEffect(() => {
    getWebsitesiteNews();
    getWebsitecontent();
  }, []);
  var News: any = [];
  async function getWebsitecontent() {
    const response = await WebsiteContentService.getWebsiteContent();
    if (response) {
      WebsiteContentData = response.data;
      setWebsiteContent(response.data);
      // setReadMoreContentFilepath(response.filepath);
    }
  }
  async function getWebsitesiteNews() {
    const response = await NewsService.getNewsInfo();
    console.log('getWebsitesiteNews:: ', response);
    if (response) {
      websiteContentNewsData = response.data;
      setWebsiteContentNews(response.data);
      setWebsiteContentNewsFilepath(response.filepath);
    }
  }
  return (
    <div style={{ background: '#E5E5E5' }}>
      {websiteContents && websiteContents[0] && <Header />}
      <div
        style={{
          marginBottom: '20px',
          marginLeft: '50px',
          marginRight: '50px',
        }}
      >
        <div className='row'>
          <div className='row' style={{ marginTop: '20px' }}>
            <Link
              to='/newhome'
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '16px',
                color: '#495057',
                marginRight: 'auto',
                marginBottom: '25px',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
            >
              <i className='fas fa-arrow-left'></i> BACK
            </Link>{' '}
            <div style={{ display: 'flex' }}>
              <h3
                className={'font-chng'}
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '22px',
                  lineHeight: '33px',
                  /* identical to box height */

                  color: '#495057',
                }}
              >
                News Gallery
              </h3>
            </div>
            {websiteContentNews?.map((news: any) => (
              <div className='col-12 col-sm-8 col-md-6 col-lg-3'>
                <div
                  className='card'
                  style={{
                    marginTop: '10px',
                    padding: '15px',
                    minHeight: '304px',
                    borderRadius: '9px',
                  }}
                >
                  <style>
                    {`.multitext-truncatenew {
  overflow: hidden;
  -webkit-box-orient: vertical;
  display: block;
  display: -webkit-box;
  overflow: hidden !important;
  text-overflow: ellipsis;
  -webkit-line-clamp: 3;
}
.multitext-truncatenewhead {
  overflow: hidden;
  -webkit-box-orient: vertical;
  display: block;
  display: -webkit-box;
  overflow: hidden !important;
  text-overflow: ellipsis;
  -webkit-line-clamp:2;
}
.heading{
            overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 2; /* number of lines to show */
           line-clamp: 2; 
   -webkit-box-orient: vertical;
   font-family: 'Poppins';
font-style: normal;
font-weight: 500;
font-size: 16.25px;
line-height: 24px;
color: #000000;
min-height: 48px;
max-height: 48px;
       }`}
                  </style>{' '}
                  <>
                    <div
                      style={{
                        padding: '15px 15px15px 0px',
                      }}
                    >
                      {news.isVideoContent && (
                        <video
                          width='100%'
                          height='90%'
                          controls
                          className='Videocontent'
                          id={`myVideo${news.id}`}
                          //   onPlay={() => play()}
                          //   onPause={() => pause()}
                          //   onEnded={() => end()}
                          //   onTouchMoveCapture={() => pause()}
                          style={{
                            borderRadius: '11px',
                            boxShadow: 'none',
                            background: 'rgba(0, 0, 0, 0.51)',
                            minWidth: '250px',
                            minHeight: '150px',
                            maxWidth: '250px',
                            maxHeight: '150px',
                          }}
                        >
                          <source
                            // src={`https://mhslfep.tvsnext.io:447/websitecontent-videos/videos/1635177684050.MOV`}
                            src={`${websiteContentNewsFilepath}${news.videoName}`}
                          ></source>
                        </video>
                      )}

                      {!news.isVideoContent && (
                        <img
                          className='Photoimage'
                          style={{
                            borderRadius: '11px',
                            boxShadow: 'none',
                            background: 'rgba(0, 0, 0, 0.51)',
                            minWidth: '250px',
                            minHeight: '150px',
                            maxWidth: '250px',
                            maxHeight: '150px',
                          }}
                          alt='Bologna'
                          onClick={() =>
                            history.push(`/Homereadmore`, {
                              id: news.id,
                              field: 'websitecontent-news',
                              prevPath: location.pathname,
                            })
                          }
                          src={`${websiteContentNewsFilepath}${news.newsImageName}`}
                        />
                      )}
                    </div>

                    <div className='card-body' style={{ padding: '0px' }}>
                      <div style={{ display: 'flex', marginTop: '10' }}>
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
                          />{' '}
                          04 Mar, 2020
                        </Typography>{' '}
                      </div>
                      <div
                        className='multitext-truncatenewhead'
                        style={{ height: '18%' }}
                      >
                        <h4
                          className='heading'
                          style={{
                            textDecoration: 'none',
                            overflow: 'hidden',
                          }}
                          onClick={() =>
                            history.push(`/readMore`, {
                              id: news.id,
                              field: 'websitecontent-video',
                              prevPath: location.pathname,
                            })
                          }
                        >
                          {news.newsHeader}
                        </h4>
                      </div>{' '}
                      {/* <h6 className="card-subtitle mb-2 text-muted">
                                                {news.videoHeader}
                                            </h6> */}
                      <div
                        className='multitext-truncatenew'
                        style={{
                          // padding: '13px 20px 0px 20px',
                          overflow: 'hidden',
                          minHeight: '71px',
                        }}
                      >
                        {ReactHtmlParser(
                          news.newsDescriptionShortHTML,
                          options
                        )}
                      </div>{' '}
                    </div>
                  </>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* {websiteContents && websiteContents[0] && <Footer />} */}
      <Footer />
    </div>
  );
};

export default NewsGallery;
