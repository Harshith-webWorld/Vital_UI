import React from 'react';
import 'react-multi-carousel/lib/styles.css';
import ImagesComponent from './website-images.component';
import NewsComponent from './website-news.component';
import BlogsComponent from './website-blogs.component';
import FaqsComponent from './website-faq.component';
import VideosComponent from './website-videos.component';
import Header from '../../Layout/NewHeader/Header';
import 'bootstrap/dist/css/bootstrap.css';
import '../../assets/sass/main.css';
import { WebsiteContent } from '../../../helpers/interfaces/websitecontent';
import WebsiteContentService from '../../../helpers/services/website-content.service';
import MapComponent from './website-map-component';
import HomeFooter from '../../Layout/Footer/FooterNew';
import Footer from '../../Layout/NewFooter/Footer';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  offset: theme.mixins.toolbar,
}));

const Home: React.FC = () => {
  const classes = useStyles();
  let WebsiteContentData: WebsiteContent[] = [];
  const [websiteContents, setWebsiteContent]: [
    WebsiteContent[],
    (websiteContents: WebsiteContent[]) => void,
  ] = React.useState(WebsiteContentData);

  React.useEffect(() => {
    getWebsitecontent();
  }, []);

  async function getWebsitecontent() {
    const response = await WebsiteContentService.getWebsiteContent();
    if (response) {
      WebsiteContentData = response.data;
      setWebsiteContent(response.data);
    }
  }

  return (
    <div>
      <Header />
      <div className={classes.offset}>
        {' '}
        <div
          className='home-wrap'
          style={{ paddingTop: 0, backgroundColor: '#F8F8FB' }}>
          <ImagesComponent />
          <VideosComponent />
          <NewsComponent />
          <MapComponent />
          <BlogsComponent />
          <FaqsComponent />
        </div>
      </div>

      {/* <HomeFooter webSiteContent={websiteContents && websiteContents[0]} /> */}
      <Footer />
    </div>
  );
};

export default Home;
