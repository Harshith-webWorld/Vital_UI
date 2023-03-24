import React, { useState } from 'react';
// import Header  from '../Header/Header';
// import Sidebar from '../sidebar/sidebar';
import '../../assets/scss/admin.scss';
import Navbar from 'react-bootstrap/Navbar';
import CenLogo from '../../assets/images/mhlogo.png';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

import Accordion from 'react-bootstrap/Accordion';

const Sidebar: React.FC = () => {
  return (
    <div className='ad-sidebar'>
      <div className='logo'>
        <Navbar.Brand href='#home'>
          <img src={CenLogo} />
        </Navbar.Brand>
      </div>

      <ListGroup className='sidebar-wrapper' as='ul'>
        <Link className='nav-link' to={`/dashboardadmin`}>
          <ListGroup.Item action href='/dashboardadmin' as='li'>
            <i className='fas fa-chart-line updown'></i>Dashboard
          </ListGroup.Item>
        </Link>
        <Link className='nav-link' to={`/listUsers`}>
          <ListGroup.Item action href='/listUsers' as='li'>
            <i className='fas fa-user-alt updown'></i>User
          </ListGroup.Item>
        </Link>
        <Accordion>
          <Accordion.Item eventKey='0' style={{ border: 'none' }}>
            <Accordion.Header>
              <div className='nav-link' style={{ padding: '0' }}>
                <ListGroup.Item
                  action
                  as='li'
                  style={{ marginRight: '71px', paddingLeft: '12px' }}
                >
                  <i className='fas fa-bars updown'></i>Public Pages
                </ListGroup.Item>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <Link
                className='nav-link'
                style={{
                  width: '115%',
                }}
                to={`/imageList`}
              >
                <ListGroup.Item
                  action
                  href='/imageList'
                  as='li'
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  <i className='fas fa-image updown'></i>Banner Images
                </ListGroup.Item>
              </Link>
              <Link className='nav-link' to={`/videoList`}>
                <ListGroup.Item action href='/videoList' as='li'>
                  <i className='fas fa-video updown'></i>Videos
                </ListGroup.Item>
              </Link>
              <Link className='nav-link' to={`/newsList`}>
                <ListGroup.Item action href='/newsList' as='li'>
                  <i className='fas fa-newspaper updown'></i>Latest News
                </ListGroup.Item>
              </Link>
              <Link
                className='nav-link'
                style={{
                  width: '115%',
                }}
                to={`/programInfosList`}
              >
                <ListGroup.Item
                  action
                  href='/programInfosList'
                  as='li'
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  <i className='fas fa-info-circle updown'></i>Program
                  Information
                </ListGroup.Item>
              </Link>
              <Link className='nav-link' to={`/faqsList`}>
                <ListGroup.Item action href='/faqsList' as='li'>
                  <i className='fas fa-question-circle updown'></i>FAQs
                </ListGroup.Item>
              </Link>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        {/* <Link className='nav-link' to={`/imageList`}>
          <ListGroup.Item action href='/imageList' as='li'>
            <i className='fas fa-image updown'></i>Banner Images
          </ListGroup.Item>
        </Link>
        <Link className='nav-link' to={`/videoList`}>
          <ListGroup.Item action href='/videoList' as='li'>
            <i className='fas fa-video updown'></i>Videos
          </ListGroup.Item>
        </Link>
        <Link className='nav-link' to={`/newsList`}>
          <ListGroup.Item action href='/newsList' as='li'>
            <i className='fas fa-newspaper updown'></i>Latest News
          </ListGroup.Item>
        </Link>
        <Link className='nav-link' to={`/programInfosList`}>
          <ListGroup.Item action href='/programInfosList' as='li'>
            <i className='fas fa-info-circle updown'></i>Program Information
          </ListGroup.Item>
        </Link>
        <Link className='nav-link' to={`/faqsList`}>
          <ListGroup.Item action href='/faqsList' as='li'>
            <i className='fas fa-question-circle updown'></i>FAQs
          </ListGroup.Item>
        </Link> */}

        <Link className='nav-link' to={`/listMenu`}>
          <ListGroup.Item action href='/listMenu' as='li'>
            {' '}
            <i className='fas fa-bars updown'></i>Other Menus
          </ListGroup.Item>
        </Link>
        <Link className='nav-link' to={`/siteSettings`}>
          <ListGroup.Item action href='/siteSettings' as='li'>
            <i className='fas fa-bars updown'></i>Site Settings
          </ListGroup.Item>
        </Link>
        <Accordion>
          <Accordion.Item eventKey='0' style={{ border: 'none' }}>
            <Accordion.Header>
              <div className='nav-link' style={{ padding: '0' }}>
                <ListGroup.Item
                  action
                  as='li'
                  style={{
                    marginRight: '-5px',
                    paddingLeft: '12px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <i className='fas fa-database updown'></i>Administrative Zone
                </ListGroup.Item>
              </div>
            </Accordion.Header>
            <Accordion.Body>
              <Link className='nav-link' to={`/districtList`}>
                <ListGroup.Item action href='/districtList' as='li'>
                  {' '}
                  <i className='fas fa-bars updown'></i>Districts
                </ListGroup.Item>
              </Link>
              <Link className='nav-link' to={`/talukaList`}>
                <ListGroup.Item action href='/talukaList' as='li'>
                  {' '}
                  <i className='fas fa-bars updown'></i>Talukas
                </ListGroup.Item>
              </Link>
              <Link className='nav-link' to={`/facilityList`}>
                <ListGroup.Item action href='/facilityList' as='li'>
                  {' '}
                  <i className='fas fa-bars updown'></i>Facilities
                </ListGroup.Item>
              </Link>
              <Link className='nav-link' to={`/subcenterList`}>
                <ListGroup.Item action href='/subcenterList' as='li'>
                  {' '}
                  <i className='fas fa-bars updown'></i>Subcenters
                </ListGroup.Item>
              </Link>
              <Link className='nav-link' to={`/villageList`}>
                <ListGroup.Item action href='/villageList' as='li'>
                  {' '}
                  <i className='fas fa-bars updown'></i>villages
                </ListGroup.Item>
              </Link>
              <Link
                className='nav-link'
                style={{
                  width: '115%',
                }}
                to={`/VerticalControlUnitList`}
              >
                <ListGroup.Item
                  action
                  href='VerticalControlUnitList'
                  as='li'
                  style={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  {' '}
                  <i className='fas fa-bars updown'></i>Vertical Control Units
                </ListGroup.Item>
              </Link>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </ListGroup>
    </div>
  );
};

export default Sidebar;
