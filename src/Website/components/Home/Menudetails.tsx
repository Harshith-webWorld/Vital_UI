import React, { useEffect, useState } from 'react';
import MenusService from '../../../helpers/services/website-otherMenu.service';
import { WebsiteOthersMenu } from '../../../helpers/interfaces/website-othersMenu';

import Header from '../../Layout/NewHeader/Header';
import Footer from '../../Layout/NewFooter/Footer';
import { WebsiteContent } from '../../../helpers/interfaces/websitecontent';
import { Container } from 'react-bootstrap';
import WebsiteContentService from '../../../helpers/services/website-content.service';
import { Redirect, useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import { BASE_URL } from '../../../helpers/config';

export default function Menudetails() {
  let WebsiteOthersMenus: any = [];
  let WebsiteContentData: WebsiteContent[] = [];
  let sectionId: any;
  let linkpath: any;
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
      let name = location.state.menuname;
      let temp = response.data.filter((item) => item.menuType === name);
      temp[0].websiteContentOthersLinks.sort(
        (a, b) => a.displayOrder - b.displayOrder,
      );
      temp[0].websiteContentOthersSections.sort(
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

      <Container style={{ marginTop: '50px' }}>
        {menuList && menuList.length > 0 && (
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
                <i className='fas fa-arrow-left'></i> {'BACK TO HOME'}
              </Link>
            </a>{' '}
            <div className='vido-boxnew font-chng'>
              <h3>{menuList[0].menuType}</h3>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  height:
                    menuList[0].websiteContentOthersSections.length == 0
                      ? '400px'
                      : '',
                }}>
                <img
                  alt=''
                  src={`${menuFilepath}${
                    menuList &&
                    menuList.length > 0 &&
                    menuList[0].menuContentImageName
                  }`}
                />
              </div>
              <p>
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
                    <h5 style={{ fontSize: '18px' }}>
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
