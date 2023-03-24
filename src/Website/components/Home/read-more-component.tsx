import React, { useState } from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import 'bootstrap/dist/css/bootstrap.css';
import { useLocation } from 'react-router-dom';
import Header from '../../Layout/NewHeader/Header';
import Footer from '../../Layout/NewFooter/Footer';
import { Container } from 'react-bootstrap';
import { WebsiteContent } from '../../../helpers/interfaces/websitecontent';
import WebsiteContentService from '../../../helpers/services/website-content.service';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../../helpers/config';
import ReactHtmlParser from 'react-html-parser';

const ReadMoreComponent: React.FC = () => {
  const location = useLocation<any>();
  let websiteReadMoreData: any[] = [];
  let WebsiteContentData: WebsiteContent[] = [];
  const [readMoreContent, setReadMoreContent] = useState(websiteReadMoreData);
  const [readMoreContentFilepath, setReadMoreContentFilepath] = useState('');
  const [readMoreContentLinkFilepath, setReadMoreContentLinkFilepath] =
    useState('');
  const [websiteContents, setWebsiteContent] = useState(WebsiteContentData);
  let sectionId: any;
  let linkpath: any;
  React.useEffect(() => {
    getWebsitecontent();
    readMore();
    console.log('location:: ', location);
  }, []);

  const options = {
    decodeEntities: true,
  };

  async function readMore() {
    if (location.state && location.state.id && location.state.field) {
      const response = await WebsiteContentService.readMore(
        location.state.field,
        location.state.id,
      );
      if (response) {
        console.log('read more:: ', response);
        setReadMoreContent(response.data);
        setReadMoreContentFilepath(response.filepath);
        setReadMoreContentLinkFilepath(
          `${BASE_URL}/websitecontent-programinfos/blogs/`,
        );
      }
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

  let readMoreContentPage = () => {
    if (
      readMoreContent &&
      readMoreContent[0] &&
      location &&
      location.state.field === 'websitecontent-image'
    ) {
      let websitecontentimage = `${readMoreContentFilepath}${readMoreContent[0].imageName}`;

      return (
        <div>
          <a style={{ marginLeft: 'auto', textDecoration: 'none' }}>
            <Link
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '16px',
                color: '#495057',
                marginRight: 'auto',
                marginBottom: '25px',
                marginTop: '100px',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              to={{
                pathname: location.state.prevPath,
                state: { prevPath: location.pathname },
              }}>
              <i className='fas fa-arrow-left'></i>{' '}
              {location.state.prevPath == '/' ? 'BACK TO HOME' : 'BACK'}
            </Link>
          </a>{' '}
          <div className='vido-box font-chng' style={{ paddingTop: '0px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                style={{ borderRadius: 9 }}
                src={websitecontentimage}
                alt=''
              />
            </div>
            <h3>{readMoreContent[0].imageHeader}</h3>
            <p>{ReactHtmlParser(readMoreContent[0].imageHtmlText, options)}</p>
          </div>
        </div>
      );
    } else if (
      readMoreContent &&
      readMoreContent[0] &&
      location &&
      location.state.field === 'websitecontent-blog'
    ) {
      let websitecontentblog = `${readMoreContentFilepath}${readMoreContent[0].programInfoImage}`;
      return (
        <div>
          <a style={{ marginLeft: 'auto', textDecoration: 'none' }}>
            <Link
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '16px',
                color: '#495057',
                marginRight: 'auto',
                marginBottom: '25px',
                marginTop: '100px',
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              to={{
                pathname: '/newhome',
                state: { prevPath: location.pathname },
              }}>
              <i className='fas fa-arrow-left'></i> BACK TO HOME
            </Link>
          </a>{' '}
          <div className='prginfo-box font-chng' style={{ paddingTop: '30px' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                src={websitecontentblog}
                alt=''
                style={{ marginTop: 0, borderRadius: 9 }}
              />
            </div>{' '}
            <h3>{readMoreContent[0].programInfoHeader}</h3>
          </div>
          <p>
            {ReactHtmlParser(
              readMoreContent[0].programInfoDescriptionShortHTML,
            )}
          </p>
          <p>
            {ReactHtmlParser(readMoreContent[0].programInfoDescriptionLongHTML)}
          </p>
          {readMoreContent[0].websiteContentProgramInfoSections.map(
            (section, id) => {
              sectionId = section.id;
              if (section.isActive) {
                return (
                  <div key={id}>
                    <h5 style={{ fontSize: '18px' }}>
                      <strong>{section.programInfoSectionName}</strong>
                    </h5>

                    {readMoreContent[0].websiteContentProgramInfoLinks.map(
                      (links, id) => {
                        if (
                          sectionId === links.programInfoSectionId &&
                          links.isActive
                        ) {
                          linkpath = `${readMoreContentLinkFilepath}${links.linkFileName}`;
                          return (
                            <ul key={id}>
                              <li style={{ fontSize: '16px' }}>
                                <a target='_blank' href={linkpath}>
                                  {links.linkName}
                                </a>
                              </li>
                            </ul>
                          );
                        }
                      },
                    )}
                  </div>
                );
              }
            },
          )}
        </div>
      );
    } else if (
      readMoreContent &&
      readMoreContent[0] &&
      location &&
      location.state.field === 'websitecontent-video'
    ) {
      let websitecontentvideo = `${readMoreContentFilepath}${readMoreContent[0].videoName}`;
      return (
        <div>
          <div className='vido-box font-chng' style={{ paddingTop: '30px' }}>
            <a style={{ marginLeft: 'auto', textDecoration: 'none' }}>
              <Link
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '16px',
                  color: '#495057',
                  marginRight: 'auto',
                  marginBottom: '25px',
                  marginTop: '100px',
                  textDecoration: 'none',
                }}
                to={{
                  pathname: location.state.prevPath,
                  state: { prevPath: location.pathname },
                }}>
                <i className='fas fa-arrow-left'></i>{' '}
                {location.state.prevPath == '/'
                  ? 'BACK TO HOME'
                  : 'BACK TO GALLERY'}
              </Link>
            </a>
            <video
              width='90%'
              height='90%'
              controls
              src={websitecontentvideo}></video>
            <h3>{readMoreContent[0].videoHeader}</h3>
            <p className='multitext-truncate'>
              {ReactHtmlParser(readMoreContent[0].videoHtmlText, options)}
            </p>
          </div>
        </div>
      );
    } else if (
      readMoreContent &&
      readMoreContent[0] &&
      location &&
      location.state.field === 'websitecontent-news'
    ) {
      let websitecontentNews;
      if (readMoreContent[0].isVideoContent) {
        websitecontentNews = `${readMoreContentFilepath}${readMoreContent[0].newsImageName}`;
      } else {
        websitecontentNews = `${readMoreContentFilepath}${readMoreContent[0].newsImageName}`;
      }
      return (
        <div>
          <div className='vido-box font-chng' style={{ paddingTop: '0px' }}>
            {!readMoreContent[0].isVideoContent && (
              <>
                <a
                  style={{
                    marginLeft: 'auto',
                    textDecoration: 'none',
                    float: 'left',
                  }}>
                  <Link
                    style={{
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '16px',
                      color: '#495057',
                      marginRight: 'auto',
                      marginBottom: '25px',
                      marginTop: '100px',
                      textDecoration: 'none',
                    }}
                    to={{
                      pathname: location.state.prevPath,
                      state: { prevPath: location.pathname },
                    }}>
                    <i className='fas fa-arrow-left'></i>{' '}
                    {location.state.prevPath == '/'
                      ? 'BACK TO HOME'
                      : 'BACK TO GALLERY'}
                  </Link>
                </a>
                <br></br>
                <img style={{ borderRadius: 9 }} src={websitecontentNews} />
              </>
            )}
            {readMoreContent[0].isVideoContent && (
              <>
                <a
                  style={{
                    marginLeft: 'auto',
                    textDecoration: 'none',
                    float: 'left',
                  }}>
                  <Link
                    style={{
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '16px',
                      color: '#495057',
                      marginRight: 'auto',
                      marginBottom: '25px',
                      marginTop: '100px',
                      textDecoration: 'none',
                    }}
                    to={{
                      pathname: location.state.prevPath,
                      state: { prevPath: location.pathname },
                    }}>
                    <i className='fas fa-arrow-left'></i>{' '}
                    {location.state.prevPath == '/'
                      ? 'BACK TO HOME'
                      : 'BACK TO GALLERY'}
                  </Link>
                </a>
                <br></br>
                <video
                  width='90%'
                  height='90%'
                  controls
                  src={websitecontentNews}></video>
              </>
            )}
            <h3>{readMoreContent[0].newsHeader}</h3>
            <p className='multitext-truncate'>
              {ReactHtmlParser(
                readMoreContent[0].newsDescriptionShortHTML,
                options,
              )}
            </p>
            <p className='multitext-truncate'>
              {ReactHtmlParser(
                readMoreContent[0].newsDescriptionLongHTML,
                options,
              )}
            </p>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {websiteContents && websiteContents[0] && <Header />}
      <Container style={{ marginTop: '50px' }}>
        {readMoreContentPage()}
      </Container>
      {websiteContents && websiteContents[0] && <Footer />}
    </div>
  );
};

export default ReadMoreComponent;
