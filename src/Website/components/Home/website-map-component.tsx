import React, { useState, useEffect } from 'react';
import Carousel from 'react-multi-carousel';
import EndemicityData from '../../../Components/EndemicityData';
import MapService from '../../../helpers/services/MapService';
import { Divider, Icon, Typography } from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
const current_year = new Date().getFullYear();

const MapComponent: React.FC = () => {
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
  const [districtEndemicity, setDistrictEndemicity] = useState([]);
  const [geoData, setGeoData] = useState([]);

  async function getDistrictEndemicity() {
    const response = await await MapService.GetEndemicityMapHome();
    if (response && response.data) {
      setDistrictEndemicity(response.data);
    }
  }
  async function getDistrictsGeo() {
    const response = await MapService.GetDistrictsGeo();
    if (response && response.data && response.data.features) {
      setGeoData(response.data.features);
    }
  }
  useEffect(() => {
    getDistrictsGeo();
    getDistrictEndemicity();
  }, []);
  const CustomButtonGroupAsArrows = (props) => {
    return (
      <div
        style={{
          textAlign: 'center',
        }}>
        {' '}
        <Icon onClick={props.previous}>
          <ArrowLeftIcon
            style={{
              borderRadius: '50%',
              backgroundColor: '#34C38F',
              // props.carouselState.currentSlide == 0
              //   ? 'rgba(28, 164, 242, 0.16)'
              //   : '#34C38F',

              alignItems: 'center',
              color: 'white',
            }}
          />
        </Icon>{' '}
        <span
          style={{
            margin: '10px',
          }}></span>
        <Icon onClick={props.next}>
          <ArrowRightIcon
            style={{
              borderRadius: '50%',
              backgroundColor: '#34C38F',
              // props.carouselState.currentSlide == 3
              //   ? 'rgba(28, 164, 242, 0.16)'
              //   : '#34C38F',
              alignItems: 'center',
              color: 'white',
            }}
          />
        </Icon>
      </div>
    );
  };
  return (
    <div className='map-secnew'>
      <div
        style={{
          backgroundColor: '#F8F8FB',
          // padding: '0px 0px 70px 0px',
        }}>
        <div className='container'>
          <h4
            style={{
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '22px',
              lineHeight: '33px',
              /* identical to box height */
              color: '#495057',
              backgroundColor: 'transparent',
              width: '100%',
              textAlign: 'center',
            }}>
            Lymphatic Filariasis Status In Maharashtra
          </h4>
          <Carousel
            additionalTransfrom={0}
            arrows={false}
            autoPlaySpeed={3000}
            centerMode={false}
            className=''
            customButtonGroup={<CustomButtonGroupAsArrows />}
            dotListClass=''
            draggable
            focusOnSelect={false}
            infinite={true}
            itemClass=''
            keyBoardControl
            minimumTouchDrag={80}
            renderButtonGroupOutside
            renderDotsOutside={false}
            responsive={responsive}
            showDots={false}
            sliderClass=''
            slidesToSlide={1}
            swipeable>
            <div style={{ padding: '0px 0px 35px 0px' }}>
              <EndemicityData
                reset='false'
                endemicityProps={'LfCases'}
                endemicityData={districtEndemicity}
                geoData={geoData}
                zoomSize={7}
                mapContainerHeight={'650px'}
              />
              <h5 style={{ backgroundColor: 'transparent' }}>
                <i className='fas fa-map-marker-alt'></i>LF Cases
              </h5>
            </div>
            <div style={{ padding: '0px 0px 35px 0px' }}>
              <EndemicityData
                reset='false'
                endemicityProps={'HydroceleCases'}
                endemicityData={districtEndemicity}
                geoData={geoData}
                zoomSize={7}
                mapContainerHeight={'650px'}
              />
              <h5 style={{ backgroundColor: 'transparent' }}>
                <i className='fas fa-map-marker-alt'></i>Hydrocele Cases
              </h5>
            </div>
            <div style={{ padding: '0px 0px 35px 0px' }}>
              <EndemicityData
                reset='false'
                endemicityProps={'MfPositive'}
                endemicityData={districtEndemicity}
                geoData={geoData}
                zoomSize={7}
                mapContainerHeight={'650px'}
              />
              <h5 style={{ backgroundColor: 'transparent' }}>
                <i className='fas fa-map-marker-alt'></i>MF Positive
              </h5>
            </div>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;
