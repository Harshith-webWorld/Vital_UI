import * as React from 'react';
import { useState } from 'react';
import { WebsiteContentVideos } from '../../../helpers/interfaces/websitecontent-videos';
import history from '../../../helpers/history';
import videoServices from '../../../helpers/services/website-videos.service';
import ReactHtmlParser from 'react-html-parser';
import { WebsiteContent } from '../../../helpers/interfaces/websitecontent';
import WebsiteContentService from '../../../helpers/services/website-content.service';
import Header from '../../Layout/Header/HomeHeader';
import Footer from '../../Layout/Footer/FooterNew';
import { useLocation } from 'react-router-dom';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button_back: {
      float: 'right',
      padding: '7px 10px',
      border: 'solid 1px #E68839',
      background: '#fff',
      borderRadius: '5px',
      display: 'block',
      color: '#E68839',
      margin: '20px',
      '&:hover': {
        boxShadow: '0px 1px 7px 0px #E68839',
      },
    },
    card_: {
      '&:hover': {
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      },
    },
    Video_head: {
      fontFamily: 'Poppins ,sans-serif !important',
      fontWeight: 600,
    },
    text_fam: {
      fontFamily: 'Poppins ,sans-serif !important',
      fontWeight: 600,
    },
  })
);
const HomeVideoGallery = () => {
  const [websiteContentVideosFilepath, setWebsiteContentVideosFilepath] =
    useState('');
  const classes = useStyles();

  let websiteContentVideosData: WebsiteContentVideos[] = [];
  const [websiteContentVideos, setWebsiteContentVideos]: [
    WebsiteContentVideos[],
    (websiteContentVideos: WebsiteContentVideos[]) => void
  ] = React.useState(websiteContentVideosData);
  const location = useLocation<any>();
  React.useEffect(() => {
    getWebsiteVideos();
    getWebsitecontent();
  }, []);

  const options = {
    decodeEntities: true,
  };
  let WebsiteContentData: WebsiteContent[] = [];

  const [websiteContents, setWebsiteContent] = useState(WebsiteContentData);

  async function getWebsiteVideos() {
    const response = await videoServices.getVideoInfo();
    if (response) {
      websiteContentVideosData = response.data;
      console.log('website content videos:: ', websiteContentVideosData);
      setWebsiteContentVideos(response.data);
      setWebsiteContentVideosFilepath(response.filepath);
    }
  }
  async function getWebsitecontent() {
    const response = await WebsiteContentService.getWebsiteContent();
    if (response) {
      console.log('website content:: ', response.data);
      WebsiteContentData = response.data;
      setWebsiteContent(response.data);
      // setReadMoreContentFilepath(response.filepath);
    }
  }
  console.log(websiteContents, 'websiteContentVideos', websiteContentVideos);

  return (
    <>
      {websiteContents && websiteContents[0] && (
        <Header webSiteContent={websiteContents[0]} />
      )}
      <div className='container mb_100 mb_40'>
        <div className='row'>
          <div className='row' style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 className={classes.Video_head}>Video Gallery</h3>

              <button
                className={classes.button_back}
                onClick={() => {
                  history.push(
                     '/homepageNew',
                    { prevPath: location.pathname },
                  );
                }}
              >
                <i className='fas fa-arrow-left'></i> BACK TO HOME
              </button>
            </div>
            {websiteContentVideos.map((video: any, index) => (
              <div className='col-12 col-sm-8 col-md-6 col-lg-3' key={index}>
                <div
                  className={`${'card'} ${classes.card_}`}
                  style={{ marginTop: '15px' }}
                >
                  <>
                    <div className='vido-ht'>
                      <video
                        style={{ height: !video.videoName ? '167px' : '150px' }}
                        width='100%'
                        height='100%'
                        controls
                        id={`myVideo${video.id}`}
                        className='Videocontent'
                        //   onPlay={() => play()}
                        //   onPause={() => pause()}
                        //   onEnded={() => end()}
                        //   onTouchMoveCapture={() => pause()}
                      >
                        <source
                          // src={`https://mhslfep.tvsnext.io:447/websitecontent-videos/videos/1635177684050.MOV`}
                          src={`${websiteContentVideosFilepath}${video.videoName}`}
                        ></source>
                      </video>
                    </div>
                    <div className='card-body' style={{ height: '150px' }}>
                      <h4
                        className={`${classes.Video_head} card-title`}
                        style={{ fontSize: '20px' }}
                        onClick={() =>
                          history.push(`/Homereadmore`, {
                            id: video.id,
                            field: 'websitecontent-video',
                            prevPath: location.pathname,
                          })
                        }
                      >
                        {video.videoHeader}
                      </h4>
                      {/* <h6 className="card-subtitle mb-2 text-muted">
                                                {video.videoHeader}
                                            </h6> */}
                      <Typography
                        className={`${classes.text_fam} multitext-truncate card-subtitle mb-2 `}
                        variant='body2'
                        // color="textSecondary"
                        style={{ width: '90%' }}
                      >
                        {ReactHtmlParser(video.videoHtmlText, options)}
                      </Typography>
                    </div>
                  </>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {websiteContents && websiteContents[0] && (
        <Footer webSiteContent={websiteContents[0]} />
      )}
    </>
  );
};
export default HomeVideoGallery;
