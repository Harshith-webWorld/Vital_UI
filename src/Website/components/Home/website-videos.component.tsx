import React, { useState } from 'react';
import Image from 'react-bootstrap/Image';
import { WebsiteContentVideos } from '../../../helpers/interfaces/websitecontent-videos';
import videoServices from '../../../helpers/services/website-videos.service';
import { useLocation } from 'react-router-dom';
import SettingsService from '../../../helpers/services/website-settings.service';
import history from '../../../helpers/history';
import { Button } from 'react-bootstrap';
// import VideoImageThumbnail from 'react-video-thumbnail-image';
import ReactHtmlParser from 'react-html-parser';

const VideosComponent: React.FC = () => {
  const location = useLocation<any>();
  const options = { decodeEntities: true };
  var Videos: any = [];
  var thumbnails: any = [];
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
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
  let websiteContentVideosData: WebsiteContentVideos[] = [];
  const [websiteContentVideosFilepath, setWebsiteContentVideosFilepath] =
    useState('');
  const [websiteContentVideos, setWebsiteContentVideos]: [
    WebsiteContentVideos[],
    (websiteContentVideos: WebsiteContentVideos[]) => void
  ] = React.useState(websiteContentVideosData);
  const [videostatus, setvideoostatus] = useState(true);
  const [videostatusisEnabled, setvideoostatusisEnabled] = useState(true);
  const [transitionDuration, settransitionDuration] = useState(500);
  const [autoPlaySpeed, setautoPlaySpeed] = useState(4000);
  const [videoindex, setvideoindex] = useState(0);
  async function getWebsiteVideos() {
    const response = await videoServices.getVideoInfo();
    if (response) {
      websiteContentVideosData = response.data;
      let resdata: any = [];
      response.data?.map((item: any) => {
        if (item.isShowPublic) resdata.push(item);
      });
      setWebsiteContentVideos(resdata);
      setWebsiteContentVideosFilepath(response.filepath);
    }
  }

  async function getSettings() {
    const response = await SettingsService.getOneWebsiteSettingsDataInfo(2);
    if (response && response.data && response.data.length > 0) {
      if (response.data[0].isEnabled) {
        setautoPlaySpeed(response.data[0].settingValue);
        setvideoostatusisEnabled(true);
      } else {
        setvideoostatusisEnabled(false);
      }
    }
  }
  const play = () => {
    settransitionDuration(0);
    setautoPlaySpeed(0);
    setvideoostatus(false);
    document.body.style.overflow = 'hidden';
  };
  const pause = () => {
    setvideoostatus(true);
    settransitionDuration(500);
    setautoPlaySpeed(3000);
    document.body.style.overflow = 'auto';
  };
  const end = () => {
    setvideoostatus(true);
    settransitionDuration(500);
    setautoPlaySpeed(3000);
    document.body.style.overflow = 'auto';
  };

  function CustomRightArrow({ onClick }: any) {
    function handleClick() {
      onClick();
    }

    return (
      <button
        onClick={handleClick}
        aria-label='Go to previous slide'
        className='react-multiple-carousel__arrow react-multiple-carousel__arrow--right'
      />
    );
  }
  function CustomLeftArrow({ onClick }: any) {
    function handleClick() {
      onClick();
    }
    return (
      <button
        onClick={handleClick}
        aria-label='Go to previous slide'
        className='react-multiple-carousel__arrow react-multiple-carousel__arrow--left'
        type='button'
      />
    );
  }

  if (websiteContentVideos && websiteContentVideosFilepath) {
    let videosrc = `${websiteContentVideosFilepath}${websiteContentVideos[videoindex].videoName}`;
    if (websiteContentVideos[videoindex].isShowPublic)
      if (videosrc) {
        Videos = (
          <div key={websiteContentVideos[videoindex].id} className='row'>
            <div className='vido-ht'>
              <video
                width='100%'
                height='90%'
                className='Videocontent'
                controls
                id={`myVideo${websiteContentVideos[videoindex].id}`}
                onPlay={() => play()}
                onPause={() => pause()}
                onEnded={() => end()}
                onTouchMoveCapture={() => pause()}
              >
                <source src={videosrc} />
              </video>
            </div>
          </div>
        );
      }
  }

  if (websiteContentVideos && websiteContentVideosFilepath) {
    websiteContentVideos.map((item, index) => {
      let thumbSrc = `${websiteContentVideosFilepath}${item.thumbnailName}`;
      if (item.isShowPublic) {
        if (thumbSrc && index !== 0 && index < 5) {
          thumbnails.push(
            <div className='videothumb' onClick={() => setvideoindex(index)}>
              <Image src={thumbSrc} thumbnail></Image>
              {/* <VideoImageThumbnail
                videoUrl={videosrc}
                // thumbnailHandler={(thumbnail) => {
                //   console.log(thumbnail, 'thumbnail');
                // }}
                // width={1200}
                // height={700}
                alt='video'
              /> */}
            </div>
          );
        }
      }
    });
  }

  React.useEffect(() => {
    getWebsiteVideos();
    getSettings();
  }, []);
  return (
    <div
      className='vido-sec'
      id='videotab'
      style={{ backgroundColor: '#F8F8FB', padding: '35px 0px 35px 0px' }}
    >
      <div className='container'>
        <h4
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
            marginBottom: '20px',
          }}
        >
          Latest Videos
          <h4
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '18.1805px',
              lineHeight: '27px',
              /* identical to box height */
              color: '#74788D',
            }}
          >
            {websiteContentVideos?.length > 0 &&
              websiteContentVideos[videoindex]?.videoHeader}
          </h4>
        </h4>
        {/* <Carousel
        swipeable={false}
        draggable={false}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        showDots={false}
        customLeftArrow={videostatus ? <CustomLeftArrow /> : <></>}
        customRightArrow={videostatus ? <CustomRightArrow /> : <></>}
        autoPlay={videostatus && videostatusisEnabled}
        autoPlaySpeed={autoPlaySpeed * 1000}
        keyBoardControl={videostatus}
        customTransition='all 1.2s ease 0s'
        transitionDuration={transitionDuration}
        containerClass='carousel-container'
        removeArrowOnDeviceType={['tablet', 'mobile']}
        dotListClass='custom-dot-list-style'
        itemClass='carousel-item-padding-40-px'> */}
        {Videos}
        {/* </Carousel> */}
        <p
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '18px',
            lineHeight: '27px',
            color: '#74788D',
          }}
        >
          {websiteContentVideos?.length > 0 &&
            ReactHtmlParser(websiteContentVideos[videoindex]?.videoHtmlText, {
              decodeEntities: true,
            })}
          <hr />
        </p>
        <div>
          <div style={{ display: 'flex' }}>
            <p
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '18px',
                lineHeight: '27px',
                color: '#495057',
              }}
            >
              More Videos
            </p>
            <Button
              className='videoBtn'
              style={{
                background: '#34C38F',
                borderRadius: '3px',
                float: 'right',
                border: '0px',
                color: 'white',
                textTransform: 'none',
                marginLeft: 'auto',
                marginRight: 9,
                height: 'fit-content',
              }}
              onClick={() => history.push(`/newvideogallery`, {})}
            >
              View all
            </Button>
          </div>
          <div className='videosMobile' style={{ display: 'flex' }}>
            {thumbnails}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideosComponent;
