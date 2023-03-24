import React, { useEffect, useState, useCallback, useRef } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer } from "react-leaflet/esm/MapContainer";
import { GeoJSON, useMap, useMapEvent } from "react-leaflet";

const current_year = new Date().getFullYear();

const NewEndemicityData = (props) => {
  const geoRef = useRef();
  const [geoData, setGeoData] = useState(props.geoData);
  const [districtMap, setDistrictMap] = useState();
  const [map, setMap] = useState(null);
  const [lfcasesAvg, setlfcasesAvg] = useState([]);
  const [hydroceleCasesAvg, sethydroceleCasesAvg] = useState([]);
  const [mfPositiveAvg, setmfPositiveAvg] = useState([]);
  const [endemicityAvg, setendemicityAvg] = useState([]);
  const [infectionAvg, setinfectionAvg] = useState([]);
  const [infectivityAvg, setinfectivityAvg] = useState([]);
  const [endemicityData, setendemicityData] = useState(props.endemicityData);
  const districtStyle = {
    fillColor: "red",
    color: "black",
    weight: 1,
  };
  function MapReset() {
    const map = useMap();
    const onClick = useCallback(
      (e) => {
        setTimeout(() => {
          map.setView([19, 76], props.zoomSize)
        }, 500);
      },
      [map],
    )
    useMapEvent('click', onClick)

    return (
      <div className="leaflet-top leaflet-right">
        <div className="leaflet-control leaflet-bar">
          <button>Reset</button>
        </div>
      </div>
    )
  }
  function getEndemicityMapAllDistricts() {
    //console.log(endemicityData)
    if ((endemicityData && endemicityData.length > 0) && (geoData && geoData.length > 0)) {
      let updatedDistrictData = geoData;
      endemicityData.map((ele) => {
        updatedDistrictData.map((districtEle) => {
          if (ele.mapDistrictId == districtEle.properties.DIST_CODE) {
            districtEle.properties.NoOfLFCases = ele.NoOfLFCases;
            districtEle.properties.NoOfHydroceleCases = ele.NoOfHydroceleCases;
            districtEle.properties.NoOfHydroceleSurgeries = ele.NoOfHydroceleSurgeries;
            districtEle.properties.CulexInfection = ele.CulexInfection;
            districtEle.properties.CulexInfectivity = ele.CulexInfectivity;
            districtEle.properties.NoMFPosetive = ele.NoMFPosetive;
            districtEle.properties.NoOfLFCases > 0 &&
              lfcasesAvg.push(districtEle.properties.NoOfLFCases);
            districtEle.properties.NoOfHydroceleCases > 0 &&
              hydroceleCasesAvg.push(districtEle.properties.NoOfHydroceleCases);
            districtEle.properties.NoMFPosetive > 0 &&
              mfPositiveAvg.push(districtEle.properties.NoMFPosetive);
            districtEle.properties.CulexInfection > 0 && 
              infectionAvg.push(districtEle.properties.CulexInfection);
            districtEle.properties.CulexInfectivity > 0 && 
              infectivityAvg.push(districtEle.properties.CulexInfectivity);
                           
            districtEle.properties.NoOfLFCases +
              districtEle.properties.NoOfHydroceleCases +
              districtEle.properties.NoMFPosetive > 0 &&
              endemicityAvg.push(
              districtEle.properties.NoOfLFCases +
              districtEle.properties.NoOfHydroceleCases +
              districtEle.properties.NoMFPosetive
              );
          }
        });
      });
      setGeoData(updatedDistrictData);
      setlfcasesAvg(lfcasesAvg);
      sethydroceleCasesAvg(hydroceleCasesAvg);
      setmfPositiveAvg(mfPositiveAvg);
      setendemicityAvg(endemicityAvg);
      setinfectionAvg(infectionAvg);
      setinfectivityAvg(infectivityAvg);
      setTimeout(() => {
        setDistrictMap(
          <GeoJSON
            key={`${props.endemicityProps}`}
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
    let endemicity; let surg;
    if (props.endemicityProps === "LfCases") {
      endemicity = district.properties.NoOfLFCases;
      if (lfcasesAvg.length > 0) avg = Math.max(...lfcasesAvg);
    } else if (props.endemicityProps === "HydroceleCases") {
      endemicity = district.properties.NoOfHydroceleCases;
      surg = district.properties.NoOfHydroceleSurgeries;
      if (hydroceleCasesAvg.length > 0) avg = Math.max(...hydroceleCasesAvg);
    } else if (props.endemicityProps === "MfPositive") {
      endemicity = district.properties.NoMFPosetive;
      if (mfPositiveAvg.length > 0) avg = Math.max(...mfPositiveAvg);
    } else if (props.endemicityProps === "CulexInfection") {
      endemicity = district.properties.CulexInfection;
      if (mfPositiveAvg.length > 0) avg = Math.max(...infectionAvg);
    } else if (props.endemicityProps === "CulexInfectivity") {
      endemicity = district.properties.CulexInfectivity;
      if (mfPositiveAvg.length > 0) avg = Math.max(...infectivityAvg);
    } else {
      endemicity =
        district.properties.NoOfLFCases +
        district.properties.NoOfHydroceleCases +
        district.properties.NoMFPosetive;
      if (endemicityAvg.length > 0) avg = Math.max(...endemicityAvg);
      //endemicityAvg.reduce((a, b) => a + b) / endemicityAvg.length;
    }

    console.log(endemicity);
    layer.options.fillOpacity = (
      Math.floor((endemicity / avg) * 100) / 100
    ).toFixed(4);
    layer.options.districtName = districtName;
    layer.options.districtCode = district.properties.DIST_CODE;
    //layer.options.text = "District: " + districtName + ": Endemicity: " + endemicity;
    layer
      .bindTooltip("" + endemicity + "", {
        permanent: true,
        direction: "center",
      })
      .openTooltip();
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          color: "Black",
          weight: 2,
        });
        if (props.endemicityProps === "LfCases") {
          e.target
            .bindPopup(`District: ${districtName} , LF: ${endemicity}`)
            .openPopup();
        } else if (props.endemicityProps === "HydroceleCases") {
          e.target
            .bindPopup(`District: ${districtName} , Hydrocele: ${endemicity} - Surg.(${surg})`)
            .openPopup();            
        } else if (props.endemicityProps === "MfPositive") {
          e.target
            .bindPopup(`District: ${districtName} , MF: ${endemicity}`)
            .openPopup();
        } else if (props.endemicityProps === "CulexInfectivity") {
          e.target
            .bindPopup(`District: ${districtName} , Infectivity: ${endemicity}`)
            .openPopup();
        } else if (props.endemicityProps === "CulexInfection") {
          e.target
            .bindPopup(`District: ${districtName} , Infection: ${endemicity}`)
            .openPopup();
        } else {
          e.target
            .bindPopup(
              `District: ${districtName} , Endemicity: ${endemicity} , LF: ${district.properties.NoOfLFCases} , HC: ${district.properties.NoOfHydroceleCases} , MF: ${district.properties.NoMFPosetive}`
            )
            .openPopup();
        }
      },
      mouseout: (e) => {
        e.target.setStyle({
          color: "black",
          weight: 1,
        });
      },
    });
  };

  useEffect(() => {
    getEndemicityMapAllDistricts();
  }, [endemicityData, props.endemicityProps, geoData, props.geoData]);
  useEffect(() => {
    setendemicityData(props.endemicityData);
  }, [props.endemicityData]);
  useEffect(() => {
    setGeoData(props.geoData);
  }, [props.geoData]);
  return (
    <div style={{ zoom: "1" }}>
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

export default NewEndemicityData;
