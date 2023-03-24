import * as React from 'react';
import { useState } from 'react';
import { WebsiteContentNews } from '../../../helpers/interfaces/websitecontent-news';
import NewsService from '../../../helpers/services/website-news.service';
import history from '../../../helpers/history';
import ReactHtmlParser from 'react-html-parser';
import Header from '../../Layout/Header/HomeHeader';
import Footer from '../../Layout/Footer/FooterNew';
import { WebsiteContent } from '../../../helpers/interfaces/websitecontent';
import WebsiteContentService from '../../../helpers/services/website-content.service';
import { useLocation } from 'react-router-dom';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
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
    News_head: {
      fontFamily: 'Poppins ,sans-serif !important',
      fontWeight: 600,
    },
    text_fam: {
      fontFamily: 'Poppins ,sans-serif !important',
      fontWeight: 600,
    },
  })
);

const HomeNewsGallery = () => {
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
    <>
      <style>{`
 p {
    line-height: 1.5em;
    height: 3em;
    overflow: hidden;
}

  `}</style>
      {websiteContents && websiteContents[0] && (
        <Header webSiteContent={websiteContents[0]} />
      )}
      <div className='container mb_100 mb_40'>
        <div className='row'>
          <div className='row' style={{ marginTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 className={classes.News_head}>News Gallery</h3>
              <button
                className={classes.button_back}
                onClick={() => {
                  history.push(
                    'homepageNew',
                     { prevPath: location.pathname },
                  );
                }}
              >
                <i className='fas fa-arrow-left'></i> BACK TO HOME
              </button>
            </div>

            {websiteContentNews.map((news: any, index) => (
              <div className='col-12 col-sm-8 col-md-6 col-lg-3' key={index}>
                <div
                  className={`${'card'} ${classes.card_}`}
                  style={{ marginTop: '10px', height: '400px' }}
                >
                  {news.isVideoContent && (
                    <video
                      width='100%'
                      height='180px'
                      controls
                      src={`${websiteContentNewsFilepath}${news.newsImageName}`}
                    ></video>
                  )}
                  {!news.isVideoContent && (
                    <img
                      style={{ height: '180px' }}
                      className='card-img-top Photoimage'
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

                  <div
                    className='card-body'
                    style={{ height: '100px', overflow: 'hidden' }}
                  >
                    <h5
                      className={`${classes.News_head} card-subtitle mb-2`}
                      onClick={() =>
                        history.push(`/Homereadmore`, {
                          id: news.id,
                          field: 'websitecontent-news',
                          prevPath: location.pathname,
                        })
                      }
                    >
                      {news.newsHeader}
                    </h5>
                    <p
                      className={`${classes.text_fam} text-muted`}
                      style={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {ReactHtmlParser(news.newsDescriptionShortHTML, options)}
                    </p>
                    <p
                      className={`${classes.text_fam} multitext-truncate`}
                      style={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                      }}
                    >
                      {ReactHtmlParser(news.newsDescriptionLongHTML, options)}
                    </p>
                  </div>
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

export default HomeNewsGallery;
