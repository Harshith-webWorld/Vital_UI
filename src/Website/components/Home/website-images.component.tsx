import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { WebsiteContentImages } from '../../../helpers/interfaces/websitecontent-images';
import 'bootstrap/dist/css/bootstrap.css';
import '../../assets/sass/main.css';
import history from '../../../helpers/history';
import ImagesService from '../../../helpers/services/website-images.service';
import SettingsService from '../../../helpers/services/website-settings.service';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { Grid } from '@material-ui/core';
import ReactHtmlParser, {
  convertNodeToElement,
  processNodes,
} from 'react-html-parser';
import { useLocation } from 'react-router-dom';
import FlagBanner from '../../../../../../SourceCode/admin/src/Website/assets/img/bg.png';
import overlayer from '../../../../../../SourceCode/admin/src/Website/assets/img/Image.png';
import { backgroundImage } from 'html2canvas/dist/types/css/property-descriptors/background-image';

const ImagesComponent: React.FC = (props) => {
  let websiteContentImagesData: WebsiteContentImages[] = [];
  const [autoPlaySpeed, setautoPlaySpeed] = useState(3000);
  const [autoPlay, setautoPlay] = useState(true);
  const options = {
    decodeEntities: true,
    transform,
  };
  const [websiteContentImages, setWebsiteContentImages]: [
    WebsiteContentImages[],
    (websiteContentImages: WebsiteContentImages[]) => void
  ] = React.useState(websiteContentImagesData);
  const [websiteContentImagesFilepath, setWebsiteContentImagesFilepath] =
    useState('');
  const location = useLocation<any>();
  function transform(node, index) {
    if (node.type === 'tag' && node.name === 'img') {
      return null;
    }
  }

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

  React.useEffect(() => {
    getWebsitesiteImages();
    getSettings();
  }, []);

  var contentlist: any = [];
  async function getSettings() {
    const response = await SettingsService.getOneWebsiteSettingsDataInfo(1);
    if (response && response.data && response.data.length > 0) {
      if (response.data[0].isEnabled) {
        setautoPlaySpeed(response.data[0].settingValue);
        setautoPlay(true);
      } else {
        setautoPlay(false);
      }
    }
  }
  async function getWebsitesiteImages() {
    const response = await ImagesService.getImagesInfo();
    if (response) {
      websiteContentImagesData = response.data;
      setWebsiteContentImages(response.data);
      setWebsiteContentImagesFilepath(response.filepath);
    }
  }

  if (websiteContentImages && websiteContentImagesFilepath) {
    contentlist = websiteContentImages.map((image, id) => {
      let imagesrc = `${websiteContentImagesFilepath}${image.imageName}`;
      if (image.isShowPublic)
        return (
          <Grid
            container
            xs={12}
            spacing={2}
            style={{
              margin: '20px 80px 20px 80px',
              overflow: 'hidden',
            }}
            className='WebsiteImageContainer'
          >
            <Grid item xs={12} lg={4} md={4}>
              <div
                className='webContent'
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  background: `linear-gradient( rgba(25, 216, 149, 0.6596) 49.57%, rgba(53, 188, 210, 0.68) 81.78%, rgba(33, 150, 243, 0.68) 98.6%, rgba(33, 150, 243, 0.68) 99.7%, rgba(24, 88, 186, 0.0115109) 102.15%, rgba(33, 150, 243, 0.68) 102.15%, rgba(23, 184, 242, 0.68) 102.17%)`,
                  borderRadius: '26px',
                  padding: '20px',
                  height: '100%',
                  position: 'relative',
                  float: 'left',
                  opacity: 0.8,
                }}
              >
                <div style={{ minHeight: '30em' }}>
                  <label
                    className='labelCarousel'
                    style={{
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: '36px',
                      lineHeight: '54px',
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      history.push(`/newreadMore`, {
                        id: image.id,
                        field: 'websitecontent-image',
                        prevPath: location.pathname,
                      })
                    }
                  >
                    {/* {image.imageHeader} */}Lymphatic Filaria Elimination
                    Program &nbsp;
                  </label>
                  <p
                    style={{
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '24px',
                      lineHeight: '36px',
                      textAlign: 'justify',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                    }}
                    onClick={() =>
                      history.push(`/newreadMore`, {
                        id: image.id,
                        field: 'websitecontent-image',
                        prevPath: location.pathname,
                      })
                    }
                  >
                    MDA - Minister
                  </p>
                  <div
                    className='des'
                    style={{
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 400,
                      fontSize: '18px',
                      lineHeight: '27px',
                      textAlign: 'justify',
                      color: 'rgba(255, 255, 255, 0.9)',
                    }}
                  >
                    {/* Minister Mr. Vijay vadettivar To mark the publication of new
                    research on mass drug administration to eliminate lymphatic
                    filariasis, the director of India`s National Vector Borne
                    Disease Control Program, Dr. Neeraj Dhingra, explains how he
                    and his team addressed community fears, and highlights the
                    power of partnerships.To mark the publication of new
                    research on mass drug administration to eliminate lymphatic
                    filariasis, the director of India`s National Vector Borne
                    Disease... */}
                    {ReactHtmlParser(image.imageHtmlText, options)}
                    <Button
                      style={{
                        backgroundColor: '#1F9BF2',
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: '13px',
                        lineHeight: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        textAlign: 'center',
                        color: '#FFFFFF',
                        border: 'none',
                        marginBottom: '10px',
                        position: 'absolute',
                        bottom: 0,
                      }}
                      onClick={() =>
                        history.push(`/newgallery`, {
                          id: image.id,
                          field: 'websitecontent-image',
                        })
                      }
                    >
                      View More
                    </Button>{' '}
                  </div>
                </div>
              </div>{' '}
            </Grid>
            <Grid item xs={12} lg={8} md={8}>
              <div key={image.id} className='webImage'>
                <img
                  alt=''
                  src={imagesrc}
                  style={{
                    objectPosition: 'unset',
                    borderRadius: '26px',
                    width: '85%',
                    height: '500px',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </Grid>
          </Grid>
        );
    });
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <div
          className='webimg-sec'
          style={{
            maxHeight: 'fit-content',
            backgroundImage: `url(${FlagBanner})`,
            position: 'relative',
          }}
        >
          <style>{`
          .des{
             overflow: hidden;
             text-overflow: ellipsis;
             display: -webkit-box;
             -webkit-line-clamp: 6; /* number of lines to show */
             line-clamp: 6; 
             -webkit-box-orient: vertical;
          }
          `}</style>
          <Carousel
            swipeable={false}
            draggable={false}
            responsive={responsive}
            ssr={true} // means to render carousel on server-side.
            infinite={true}
            showDots={true}
            arrows={false}
            // autoPlay={autoPlay}
            autoPlaySpeed={autoPlaySpeed * 1000}
            keyBoardControl={true}
            renderDotsOutside={false}
            customTransition='all 1.2s ease 0s'
            transitionDuration={500}
            containerClass='carousel-container'
            // dotListClass='custom-dot-list-style'
            itemClass='carousel-item-padding-40-px'
          >
            {contentlist}
          </Carousel>
        </div>
      </Grid>
    </Grid>
  );
};

export default ImagesComponent;
