import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import { WebsiteContentProgramInfos } from '../../../helpers/interfaces/programInfoInterface';
import { Button } from 'react-bootstrap';
import history from '../../../helpers/history';
import ProgramInfoServices from '../../../helpers/services/website-programInfos.service';
import ReactHtmlParser, {
  convertNodeToElement,
  processNodes,
} from 'react-html-parser';
import { useLocation } from 'react-router-dom';
import { divIcon } from 'leaflet';
import { Grid } from '@material-ui/core';
import arrow from '../../assets/img/Shape.png';

const BlogsComponent: React.FC = () => {
  let websiteContentBlogsData: WebsiteContentProgramInfos[] = [];
  const [websiteContentBlogs, setWebsiteContentBlogs] = useState(
    websiteContentBlogsData
  );
  const [websiteContentBlogsFilepath, setWebsiteContentBlogsFilepath] =
    useState('');
  const location = useLocation<any>();

  const blogresponsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const options = {
    decodeEntities: true,
  };

  React.useEffect(() => {
    getWebsitesiteBlogs();
  }, []);

  var Blogs: any = [];

  async function getWebsitesiteBlogs() {
    const response = await ProgramInfoServices.getProgramInfosInfo();
    if (response) {
      websiteContentBlogsData = response.data;
      setWebsiteContentBlogs(response.data);
      setWebsiteContentBlogsFilepath(response.filepath);
    }
  }

  if (websiteContentBlogs && websiteContentBlogsFilepath) {
    Blogs = websiteContentBlogs.map((blogs, id) => {
      let blogsrc = `${websiteContentBlogsFilepath}${blogs.programInfoImage}`;
      return (
        <Grid item xs={6} md={6} sm={12} key={`blog+${id}`}>
          {' '}
          <style>{` .heading{
            overflow: hidden;
   text-overflow: ellipsis;
   display: -webkit-box;
   -webkit-line-clamp: 1; /* number of lines to show */
           line-clamp: 1; 
   -webkit-box-orient: vertical;
          }`}</style>
          <div
            key={blogs.id}
            style={{
              border: '1px solid #F2F0F0',
              boxSizing: 'border-box',
              borderRadius: '4px',
              padding: '20px',
            }}
          >
            <h4
              className='heading'
              style={{ cursor: 'pointer' }}
              onClick={() =>
                history.push(`/newreadmore`, {
                  id: blogs.id,
                  field: 'websitecontent-blog',
                  prevPath: location.pathname,
                })
              }
            >
              {blogs.programInfoHeader}
            </h4>
            <p
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 400,
                fontSize: '13px',
                lineHeight: '20px',
                color: '#74788D',
              }}
            >
              10 Apr, 2020
            </p>
            <img
              alt=''
              src={blogsrc}
              width='100%'
              height='100%'
              style={{
                filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.05))',
                borderRadius: '9px',
                maxHeight: '330px',
                objectFit: 'cover',
              }}
            />
            <div className='blog-txt'>
              <div
                className='multitext-truncate'
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '13px',
                  lineHeight: '19px',
                  color: '#495057',
                  marginTop: '20px',
                }}
              >
                {ReactHtmlParser(
                  blogs.programInfoDescriptionShortHTML,
                  options
                )}
              </div>
            </div>
            {/* <Button
              variant='info'
              onClick={() =>
                history.push(`/newreadmore`, {
                  id: blogs.id,
                  field: 'websitecontent-blog',
                })
              }>
            </Button> */}
            <p
              onClick={() =>
                history.push(`/newreadmore`, {
                  id: blogs.id,
                  field: 'websitecontent-blog',
                })
              }
              style={{
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: '14px',
                lineHeight: '20px',
                color: '#00AEE6',
                marginTop: '10px',
              }}
            >
              {' '}
              Read More &nbsp;
              <img alt='' src={arrow} />
            </p>
          </div>
        </Grid>
      );
    });
  }
  return (
    <div
      className='blog-sec font-chng'
      style={{ backgroundColor: '#F8F8FB', padding: '35px 0px 70px 0px' }}
    >
      <style>{`
    .carousel_box {
     align-items: center;
    justify-content: center; 
    display: flex;
    }
  `}</style>
      <div
        className='container'
        style={{
          background: '#FFFFFF',
          borderRadius: '4px',
          padding: '20px',
          maxWidth: '1134px',
        }}
      >
        <h4
          style={{
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 500,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#495057',
            backgroundColor: 'tranparent',
            marginBottom: '20px',
          }}
        >
          Program Information{' '}
        </h4>
        <hr />
        <Grid container spacing={3}>
          {Blogs}
        </Grid>
      </div>
    </div>
  );
};

export default BlogsComponent;
