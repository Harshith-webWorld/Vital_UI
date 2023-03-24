import React, { useEffect, useState } from 'react';
import MenusService from '../../../helpers/services/website-otherMenu.service';
import { WebsiteOthersMenu } from '../../../helpers/interfaces/website-othersMenu';
import Header from '../../Layout/Header/HomeHeader';
import Footer from '../../Layout/Footer/FooterNew';
import { WebsiteContent } from '../../../helpers/interfaces/websitecontent';
import { Container } from 'react-bootstrap';
import WebsiteContentService from '../../../helpers/services/website-content.service';
import { Redirect, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import { BASE_URL } from '../../../helpers/config';
import {
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import history from '../../../helpers/history';

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
      marginBottom: '10px',
      '&:hover': {
        boxShadow: '0px 1px 7px 0px #E68839'
      },
    },
    card_: {
      '&:hover': {
        boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
      },
    },
    Tittletext_: {
      fontFamily: 'Poppins  !important',
      fontWeight: 600,
    },
    text_fam: {
      fontFamily: 'Poppins,sans-serif !important',
    }
  }),
)
export default function HomeMenudetails() {
  let WebsiteOthersMenus: any = [];
  let WebsiteContentData: WebsiteContent[] = [];
  let sectionId: any;
  let linkpath: any;
  const classes = useStyles()
  const location = useLocation<any>();
  const [menuFilepath, setmenuFilepath] = useState('');
  const [menuList, setMenuList]: any = useState(WebsiteOthersMenus);
  const [websiteContents, setWebsiteContent] = useState(WebsiteContentData);
  async function getWebsitecontent() {
    const response = await WebsiteContentService.getWebsiteContent();
    if (response) {
      console.log('website content:: ', response.data);
      WebsiteContentData = response.data;
      setWebsiteContent(response.data);
    }
  }

  async function getMenus() {
    const response = await MenusService.getWebsiteOtherMenuInfo();
    if (response && response.data) {
      console.log('website newlist :: ', response);
      WebsiteOthersMenus = response.data;
      let name: any = location?.state?.menuname;
      let temp: any = response?.data?.filter((item) => item.menuType === name);
      temp[0]?.websiteContentOthersLinks.sort(
        (a, b) => a.displayOrder - b.displayOrder,
      );
      temp[0]?.websiteContentOthersSections.sort(
        (a, b) => a.displayOrder - b.displayOrder,
      );
      setMenuList(temp);
      setmenuFilepath(`${BASE_URL}/websitecontent-others/blogs/`);
      console.log(temp);
    }
  }
  useEffect(() => {
    getWebsitecontent();
    getMenus();
  }, []);

  return (
    <div>
      {websiteContents && websiteContents[0] && (
        <Header webSiteContent={websiteContents[0]} />
      )}
      <Container style={{ marginBottom: '20px' }}>
        {menuList && menuList.length > 0 && (
          <div>
            <div className='vido-box font-chng'>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 className={classes.Tittletext_}>{menuList[0].menuType}</h3>
                <button className={classes.button_back} onClick={() => {
                  history.push(
                    '/homepageNew',
                     { prevPath: location.pathname },
                  );
                }}>
                  <i className="fas fa-arrow-left"></i> BACK TO HOME
                </button>
              </div>
              <br />
              {console.log(menuList[0],'dattat>>>>')}
              <div
                style={{
                  height:menuList[0].websiteContentOthersSections.length ==0 ?"400px":'',
                  display: 'flex',
                  justifyContent: 'center',
                  background:menuList &&
                  menuList.length > 0 &&
                  menuList[0].menuContentImageName ? '#EBFFE3':"",
                }}
              >
                <img
                  alt=''
                  src={`${menuFilepath}${menuList &&
                    menuList.length > 0 &&
                    menuList[0].menuContentImageName
                    }`}
                  style={{ width: '-webkit-fill-available', margin: '50px' }}
                />
              </div>
              <p
                className={classes.text_fam} style={{ textAlign: 'initial' }}>
                {ReactHtmlParser(menuList[0].menuContentHTML, {
                  decodeEntities: true,
                })}
              </p>
            </div>
            {menuList[0].websiteContentOthersSections.map((section, id) => {
              sectionId = section.id;
              if (section.isActive) {
                return (
                  <div key={id}>
                    <h5  className={classes.Tittletext_} style={{ fontSize: '18px' }}>
                      <strong>{section.menuSectionName}</strong>
                    </h5>

                    {menuList[0].websiteContentOthersLinks.map((links, id) => {
                      if (
                        sectionId === links.otherMenuSectionId &&
                        links.isActive
                      ) {
                        linkpath = `${BASE_URL}/websitecontent-others/otherslink/${links.linkFileName}`;
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
                    })}
                  </div>
                );
              }
            })}
          </div>
        )}
      </Container>
      {websiteContents && websiteContents[0] && (
        <Footer webSiteContent={websiteContents[0]} />
      )}
    </div>
  );
}
