import React, { useState } from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import 'bootstrap/dist/css/bootstrap.css'
import { useLocation } from 'react-router-dom'
import Header from '../../Layout/Header/HomeHeader'
import Footer from '../../Layout/Footer/FooterNew'
import { Container } from 'react-bootstrap'
import { WebsiteContent } from '../../../helpers/interfaces/websitecontent'
import WebsiteContentService from '../../../helpers/services/website-content.service'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../../../helpers/config'
import ReactHtmlParser from 'react-html-parser'
import {
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from '@material-ui/core/styles'
import { boxShadow } from 'html2canvas/dist/types/css/property-descriptors/box-shadow'
import history from '../../../helpers/history'

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
    head_: {
      fontFamily: 'Poppins ,sans-serif !important',
      fontWeight: 600,
    },
    text_fam: {
      fontFamily: 'Poppins ,sans-serif !important',
      fontWeight: 600,
    },
  }),
)
const HomeReadMoreComponent: React.FC = () => {
  const location = useLocation<any>()
  const classes = useStyles()
  let websiteReadMoreData: any[] = []
  let WebsiteContentData: WebsiteContent[] = []
  const [readMoreContent, setReadMoreContent] = useState(websiteReadMoreData)
  const [readMoreContentFilepath, setReadMoreContentFilepath] = useState('')
  const [
    readMoreContentLinkFilepath,
    setReadMoreContentLinkFilepath,
  ] = useState('')
  const [websiteContents, setWebsiteContent] = useState(WebsiteContentData)
  let sectionId: any
  let linkpath: any
  React.useEffect(() => {
    getWebsitecontent()
    readMore()
    console.log('location:: ', location)
  }, [])

  const options = {
    decodeEntities: true,
  }

  async function readMore() {
    if (location.state && location.state.id && location.state.field) {
      const response = await WebsiteContentService.readMore(
        location.state.field,
        location.state.id,
      )
      if (response) {
        console.log('read more:: ', response)
        setReadMoreContent(response.data)
        setReadMoreContentFilepath(response.filepath)
        setReadMoreContentLinkFilepath(
          `${BASE_URL}/websitecontent-programinfos/blogs/`,
        )
      }
    }
  }

  async function getWebsitecontent() {
    const response = await WebsiteContentService.getWebsiteContent()
    if (response) {
      console.log('website content:: ', response.data)
      WebsiteContentData = response.data
      setWebsiteContent(response.data)
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
      let websitecontentimage = `${readMoreContentFilepath}${readMoreContent[0].imageName}`

      return (
        <div>
          <div className="vido-box font-chng" style={{ marginBottom: '50px' }}>
            <button
              className={classes.button_back}
              style={{ position: 'absolute', right: '20px' }}
              onClick={() => {
                history.push(
                   location.state.prevPath,
                   { prevPath: location.pathname },
                )
              }}
            >
              <i className="fas fa-arrow-left"></i>{' '}
              {location.state.prevPath == '/homepageNew'
                ? 'BACK TO HOME'
                : 'BACK TO GALLERY'}
            </button>
            <br />
            <br />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '30px',
                background: '#EBFFE3',
              }}
            >
              <img
                src={websitecontentimage}
                style={{ width: '-webkit-fill-available', margin: '30px' }}
              />
            </div>
            <h3 className={classes.head_} style={{ textAlign: 'initial' }}>
              {readMoreContent[0].imageHeader}
            </h3>
            <p className={classes.text_fam} style={{ textAlign: 'initial' }}>
              {ReactHtmlParser(readMoreContent[0].imageHtmlText, options)}
            </p>
          </div>
        </div>
      )
    } else if (
      readMoreContent &&
      readMoreContent[0] &&
      location &&
      location.state.field === 'websitecontent-blog'
    ) {
      let websitecontentblog = `${readMoreContentFilepath}${readMoreContent[0].programInfoImage}`
      return (
        <div>
          <div
            className="prginfo-box font-chng"
            style={{ marginBottom: '50px' }}
          >
            <button
              className={classes.button_back}
              style={{ position: 'absolute', right: '20px' }}
              onClick={() => {
                history.push(
                   '/homepageNew',
                 { prevPath: location.pathname },
                )
              }}
            >
              <i className="fas fa-arrow-left"></i> BACK TO HOME
            </button>
            <br></br>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '65px',
                background: '#EBFFE3',
              }}
            >
              <img
                src={websitecontentblog}
                style={{ margin: '30px', objectFit: 'cover' }}
              />
            </div>
            <h3 className={classes.head_} style={{ textAlign: 'initial' }}>
              {readMoreContent[0].programInfoHeader}
            </h3>
            <p className={classes.text_fam} style={{ textAlign: 'initial' }}>
              {ReactHtmlParser(
                readMoreContent[0].programInfoDescriptionShortHTML,
              )}
            </p>
            <p className={classes.text_fam} style={{ textAlign: 'initial' }}>
              {ReactHtmlParser(
                readMoreContent[0].programInfoDescriptionLongHTML,
              )}
            </p>
          </div>
          {readMoreContent[0].websiteContentProgramInfoSections.map(
            (section, id) => {
              sectionId = section.id
              if (section.isActive) {
                return (
                  <div key={id}>
                    <h5 className={classes.head_} style={{ fontSize: '18px' }}>
                      <strong>{section.programInfoSectionName}</strong>
                    </h5>

                    {readMoreContent[0].websiteContentProgramInfoLinks.map(
                      (links, id) => {
                        if (
                          sectionId === links.programInfoSectionId &&
                          links.isActive
                        ) {
                          linkpath = `${readMoreContentLinkFilepath}${links.linkFileName}`
                          return (
                            <ul key={id}>
                              <li style={{ fontSize: '16px' }}>
                                <a target="_blank" href={linkpath}>
                                  {links.linkName}
                                </a>
                              </li>
                            </ul>
                          )
                        }
                      },
                    )}
                  </div>
                )
              }
            },
          )}
        </div>
      )
    } else if (
      readMoreContent &&
      readMoreContent[0] &&
      location &&
      location.state.field === 'websitecontent-video'
    ) {
      let websitecontentvideo = `${readMoreContentFilepath}${readMoreContent[0].videoName}`
      return (
        <div>
          <div className="vido-box font-chng" style={{ marginBottom: '50px' }}>
            <button
              className={classes.button_back}
              onClick={() => {
                history.push(
                  location.state.prevPath,
                   { prevPath: location.pathname },
                )
              }}
            >
              <i className="fas fa-arrow-left"></i>{' '}
              {location.state.prevPath == '/homepageNew'
                ? 'BACK TO HOME'
                : 'BACK TO GALLERY'}
            </button>
            <br/>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '65px',
                background: '#EBFFE3',
              }}
            >
              <video
                style={{ margin: "25px" }}
                width="90%"
                height="90%"
                controls
                src={websitecontentvideo}
              ></video>
            </div>
          </div>
          <div>
            <h3 className={classes.head_} style={{ textAlign: 'initial' }}>
              {readMoreContent[0].videoHeader}
            </h3>
            <p
              className={`${classes.text_fam}multitext-truncate`}
              style={{ textAlign: 'initial' }}
            >
              {ReactHtmlParser(readMoreContent[0].videoHtmlText, options)}
            </p>
          </div>
        </div>
      )
    } else if (
      readMoreContent &&
      readMoreContent[0] &&
      location &&
      location.state.field === 'websitecontent-news'
    ) {
      let websitecontentNews
      if (readMoreContent[0].isVideoContent) {
        websitecontentNews = `${readMoreContentFilepath}${readMoreContent[0].newsImageName}`
      } else {
        websitecontentNews = `${readMoreContentFilepath}${readMoreContent[0].newsImageName}`
      }
      return (
        <div>
          <div className="vido-box font-chng" style={{ marginBottom: '50px' }}>
            {!readMoreContent[0].isVideoContent && (
              <>
                <button
                  className={classes.button_back}
                  onClick={() => {
                    history.push(
                       location.state.prevPath,
                       { prevPath: location.pathname },
                    )
                  }}
                >
                  <i className="fas fa-arrow-left"></i>{' '}
                  {location.state.prevPath == '/homepageNew'
                    ? 'BACK TO HOME'
                    : 'BACK TO GALLERY'}
                </button>
                <br></br>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '65px',
                    background: '#EBFFE3',
                  }}
                >
                  <img
                    src={websitecontentNews}
                    style={{ margin: '30px', objectFit: 'cover' }}
                  />
                </div>
              </>
            )}
            {readMoreContent[0].isVideoContent && (
              <>
                <button
                  className={classes.button_back}
                  onClick={() => {
                    history.push(
                    location.state.prevPath,
                      { prevPath: location.pathname },
                    )
                  }}
                >
                  <i className="fas fa-arrow-left"></i>{' '}
                  {location.state.prevPath == '/homepageNew'
                    ? 'BACK TO HOME'
                    : 'BACK TO GALLERY'}
                </button>
                <br></br>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '65px',
                    background: '#EBFFE3',
                  }}
                >
                  <video
                    style={{ margin: "25px" }}
                    width="90%"
                    height="90%"
                    controls
                    src={websitecontentNews}
                  ></video>
                </div>

              </>
            )}
            <h3 className={`${classes.head_}`} style={{ textAlign: 'initial' }}>
              {readMoreContent[0].newsHeader}
            </h3>
            <p
              className={`${classes.text_fam} multitext-truncate`}
              style={{ textAlign: 'initial', fontWeight: 'normal' }}
            >
              {ReactHtmlParser(
                readMoreContent[0].newsDescriptionShortHTML,
                options,
              )}
            </p>
            <p
              className={`${classes.text_fam} multitext-truncate`}
              style={{ textAlign: 'initial', fontWeight: 'normal' }}
            >
              {ReactHtmlParser(
                readMoreContent[0].newsDescriptionLongHTML,
                options,
              )}
            </p>
          </div>
        </div>
      )
    }
  }

  return (
    <div>
      {websiteContents && websiteContents[0] && (
        <Header webSiteContent={websiteContents[0]} />
      )}
      <Container>{readMoreContentPage()}</Container>
      {websiteContents && websiteContents[0] && (
        <Footer webSiteContent={websiteContents[0]} />
      )}
    </div>
  )
}

export default HomeReadMoreComponent
