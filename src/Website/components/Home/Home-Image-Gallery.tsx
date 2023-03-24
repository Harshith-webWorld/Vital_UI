import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../Layout/Header/HomeHeader';
import Footer from '../../Layout/Footer/FooterNew';
import ImagesService from '../../../helpers/services/website-images.service';
import { WebsiteContentImages } from '../../../helpers/interfaces/websitecontent-images';
import ReactHtmlParser from 'react-html-parser';
import history from '../../../helpers/history';
import { WebsiteContent } from '../../../helpers/interfaces/websitecontent';
import WebsiteContentService from '../../../helpers/services/website-content.service';
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
    Img_head: {
      fontFamily: 'Poppins ,sans-serif !important',
      fontWeight: 600,
    },
    text_fam: {
      fontFamily: 'Poppins ,sans-serif !important',
      // fontWeight: 600,
      fontSize: 'unset',
    },
  }),
);

const HomePhotoGallery = () => {
  const classes = useStyles();
  const location = useLocation<any>();

  let WebsiteContentData: WebsiteContent[] = [];
  let websiteContentImagesData: WebsiteContentImages[] = [];
  const options = { decodeEntities: true };
  const [websiteContentImages, setWebsiteContentImages]: [
    WebsiteContentImages[],
    (websiteContentImages: WebsiteContentImages[]) => void,
  ] = React.useState(websiteContentImagesData);
  const [websiteContentImagesFilepath, setWebsiteContentImagesFilepath] =
    useState('');
  const [websiteContents, setWebsiteContent] = useState(WebsiteContentData);

  useEffect(() => {
    getWebsitesiteImages();
    getWebsitecontent();
  }, []);

  async function getWebsitesiteImages() {
    const response = await ImagesService.getImagesInfo();
    if (response) {
      websiteContentImagesData = response.data;
      setWebsiteContentImages(response.data);
      setWebsiteContentImagesFilepath(response.filepath);
    }
  }

  async function getWebsitecontent() {
    const response = await WebsiteContentService.getWebsiteContent();
    if (response) {
      console.log('website content:: ', response.data);
      WebsiteContentData = response.data;
      setWebsiteContent(response.data);
    }
  }

  return (
    <>
      {websiteContents && websiteContents[0] && (
        <Header webSiteContent={websiteContents[0]} />
      )}
      <div>
        {/* <Container> */}
        <div className='container mb_100 mb_40'>
          <div className='row'>
            <div className='row' style={{ marginTop: '30px' }}>
              <div style={{ display: 'flex', marginBottom: '20px' }}>
                <h3 className={`${classes.Img_head} font-chng`}>
                  Photo Gallery
                </h3>
                <button
                  className={classes.button_back}
                  style={{ position: 'absolute', right: '20px' }}
                  onClick={() => {
                    history.push(
                     '/homepageNew',
                      { prevPath: location.pathname },
                    );
                  }}>
                  <i className='fas fa-arrow-left'></i> BACK TO HOME
                </button>
              </div>
              {websiteContentImages.map((item: any, index) => (
                <div className='col-12 col-sm-8 col-md-6 col-lg-3' key={index}>
                  <div
                    className={`${'card'} ${classes.card_}`}
                    style={{ marginTop: '10px' }}>
                    <img
                      className='card-img-top'
                      style={{ height: '180px' }}
                      src={`${websiteContentImagesFilepath}${item.imageName}`}
                      alt='Bologna'
                      onClick={() =>
                        history.push(`/Homereadmore`, {
                          id: item.id,
                          field: 'websitecontent-image',
                          prevPath: location.pathname,
                        })
                      }
                    />
                    <div className='card-body' style={{ height: '200px' }}>
                      <Typography
                        variant='h5'
                        className={`${classes.Img_head} card-title`}>
                        {item.title}
                      </Typography>
                      <Typography
                        className={`${classes.Img_head} 
                                                card-subtitle mb-2 
                                                `}
                        variant='h5'
                        onClick={() =>
                          history.push(`/Homereadmore`, {
                            id: item.id,
                            field: 'websitecontent-image',
                            prevPath: location.pathname,
                          })
                        }
                        // style={{height:'60px'}}
                      >
                        {item.imageHeader}
                      </Typography>
                      <Typography
                        className={`${classes.Img_head} multitext-truncate card-subtitle mb-2 `}
                        variant='body2'
                        // color="textSecondary"
                        style={{ height: '100px', width: '90%' }}>
                        {ReactHtmlParser(item.imageHtmlText, options)}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* </Container> */}
        {websiteContents && websiteContents[0] && (
          <Footer webSiteContent={websiteContents[0]} />
        )}
      </div>
    </>
  );
};
export default HomePhotoGallery;
