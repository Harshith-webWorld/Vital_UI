import React, { useEffect, useState, useCallback, useRef } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer } from 'react-leaflet/esm/MapContainer';
import { GeoJSON, useMap, useMapEvent } from 'react-leaflet';

const current_year = new Date().getFullYear();

const MdaTasData = (props) => {
  const geoRef = useRef();
  const [geoData, setGeoData] = useState(props.geoData);
  const [districtMap, setDistrictMap] = useState();
  const [map, setMap] = useState(null);
  const [endemicityData, setendemicityData] = useState(props.endemicityData);
  const districtStyle = {
    //fillColor: "#00631b",
    fillOpacity: 1,
    color: 'black',
    weight: 1,
  };

  function MapReset() {
    const map = useMap();
    const onClick = useCallback(
      (e) => {
        setTimeout(() => {
          map.setView([19, 76], props.zoomSize);
        }, 500);
      },
      [map]
    );
    useMapEvent('click', onClick);

    return (
      <div className='leaflet-top leaflet-right'>
        <div className='leaflet-control leaflet-bar'>
          <button>Reset</button>
        </div>
      </div>
    );
  }
  async function getEndemicityMapAllDistricts() {
    if (
      endemicityData &&
      endemicityData.length > 0 &&
      geoData &&
      geoData.length > 0
    ) {
      let updatedDistrictData = geoData;
      endemicityData.map((ele) => {
        updatedDistrictData.map((districtEle) => {});
      });
      setGeoData(updatedDistrictData);
      setTimeout(() => {
        setDistrictMap(
          <GeoJSON
            key={`geojson-01`}
            style={districtStyle}
            data={updatedDistrictData}
            onEachFeature={onEachDistrict}
            cursor={false}
            dragging={false}
            zoomControl={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            boxZoom={false}
          />
        );
      }, 500);
    }
  }

  const onEachDistrict = (district, layer) => {
    let avg = 10;
    const districtName = district.properties.DIST_NAME;
    let activityCode;
    if (
      districtName === 'Yavatmal' ||
      districtName === 'Nandurbar' ||
      districtName === 'Thane' ||
      districtName === 'Palghar' ||
      districtName === 'Bhandara' ||
      districtName === 'Gondia' ||
      districtName === 'Chandrapur' ||
      districtName === 'Gadchiroli' ||
      districtName === 'Nanded'
    ) {
      layer.options.fillColor = '#eb5ead';
      activityCode = 'MDA R5';
      if (districtName === 'Nandurbar') {
        activityCode = 'MDA R7';
      }
      if (districtName === 'Yavatmal') {
        layer.options.fillColor = '#a607eb';
        activityCode = 'MDA R5, TAS 3';
      }
    } else if (
      districtName === 'Akola' ||
      districtName === 'Jalgaon' ||
      districtName === 'Sindhudurg' ||
      districtName === 'Solapur' ||
      districtName === 'Wardha' ||
      districtName === 'Osmanabad' ||
      districtName === 'Yavatmal' ||
      districtName === 'Amrawati' ||
      districtName === 'Latur'
    ) {
      layer.options.fillColor = '#c4bf16';
      activityCode = 'TAS 3';
    } else {
      layer.options.fillColor = '#459e41';
      activityCode = '';
    }

    layer.options.districtName = districtName;
    layer.options.districtCode = district.properties.DIST_CODE;
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          color: 'Black',
          weight: 2,
        });
        e.target
          .bindPopup(`District: ${districtName} , ${activityCode}`)
          .openPopup();
      },
      mouseout: (e) => {
        e.target.setStyle({
          color: 'black',
          weight: 1,
        });
      },
    });
  };

  useEffect(() => {
    getEndemicityMapAllDistricts();
  }, [endemicityData, geoData]);
  useEffect(() => {
    setendemicityData(props.endemicityData);
  }, [props.endemicityData]);
  useEffect(() => {
    setGeoData(props.geoData);
  }, [props.geoData]);
  return (
    <div style={{ zoom: '1' }}>
      <MapContainer
        style={{ height: props.mapContainerHeight }}
        zoom={props.zoomSize}
        center={[19, 76]}
        whenCreated={setMap}
        ref={geoRef}
        cursor={false}
        dragging={true}
        zoomControl={false}
        scrollWheelZoom={false}
        doubleClickZoom={true}
        boxZoom={false}
        trackResize={true}
      >
        {districtMap}
        <MapReset />
      </MapContainer>
    </div>
  );
};

export default MdaTasData;
