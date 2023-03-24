import React, { useEffect, useState, useCallback } from 'react';
import { GeoJSON, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css"
import "./InteractiveMap.css"
import { MapContainer } from 'react-leaflet/esm/MapContainer';
import {
  Box,
  IconButton,
  Typography,
  FormControl,
  Select,
  makeStyles,
  styled,
  SwipeableDrawer,
} from "@material-ui/core";
import {
  current_month,
  current_year,
  monthList,
  endMonthList,
  NoneList,
  yearList,
  previous_month,
} from "../constant";
import * as Yup from 'yup';
import { FormikProvider, useFormik } from 'formik';
import FilterListIcon from "@material-ui/icons/FilterList";
import CloseIcon from "@material-ui/icons/Close";
import { MultiSelect } from "react-multi-select-component";
import { grey } from "@material-ui/core/colors";
import MapService from "../../helpers/services/MapService";
import Button from 'react-bootstrap/Button';
const MDP = styled(Typography)(({ theme }) => ({
  fontFamily: "Poppins !important",
  fontStyle: "normal",
  fontWeight: "600",
  fontSize: "13px",
  lineHeight: "20px",
  color: "#74788D",

  display: "flex",
  alignContent: "flex-end",
  alignItems: "center",
  height: "29px",

  "@media (max-width: 1640px)": {
    fontSize: "10px",
  },
}));

const CustomSelectField = styled(Select)(({ theme }) => ({
  border: "none",
  outline: "none",
  background: "#EFF2F7",
  fontSize: "13px",
  fontFamily: "poppins",
  fontWeight: "500",
  "&:before": {
    border: "none",
    outline: "none",
  },
  "&:after": {
    border: "none",
    outline: "none",
  },
  // "&.MuiInput-underline:hover:not(.Mui-disabled):before": {
  //   border: "none",
  //   outline: "none",
  // },
  "&.MuiFilledInput-root:hover": {
    border: "none",
    outline: "none",
  },
  "&.MuiFilledInput-underline:hover:before": {
    border: "none",
    outline: "none",
  },

  "& .MuiSelect-filled.MuiSelect-filled": {
    paddingTop: "9px",
  },

  "& option": {
    fontWeight: "500", fontSize: "13px",

  },
}));

const InteractiveMap = (props) => {
  const [districtHasChanged, setDistrictHasChanged] = useState(false);
  const [selectedDistrictCode, setSelectedDistrictCode] = useState('');
  const [thalukHasChanged, setThalukHasChanged] = useState(false);
  const [selectedThaulkCode, setSelectedThaulkCode] = useState('');
  const [thaulkCode, setThaulkCode] = useState('');
  const [villageCode, setVillageCode] = useState('');

  const [districtMap, setDistrictMap] = useState();
  const [thalukMap, setThalukMap] = useState([]);
  const [townMap, setTownMap] = useState([]);
  const [villageMap, setVillageMap] = useState([]);
  const [endemicityMapSelect, setEndemicityMapSelect] = useState("LfCases");

  const [districtGeoData, setDistrictGeoData] = useState([]); //mapDataDist.features
  const [thalukaGeoData, setThalukaGeoData] = useState([]);//
  const [townGeoData, setTownGeoData] = useState([]);//
  const [villageGeoData, setVillageGeoData] = useState([]);//
  const [districtLayer, setDistrictLayer] = useState([]);
  const [thalukLayer, setThalukLayer] = useState([]);
  const [villageLayer, setVillageLayer] = useState([]);

  const [defaultDistrictName, setDefaultDistrictName] = useState('');
  const [checked, setChecked] = useState('');
  const [center, setCenter] = useState([20, 76]);
  const [zoom, setZoom] = useState(7);
  const [map, setMap] = useState(null)
  const initialState = {
    districtDefaultValue: "--- Select ---",
    thalukDefaultValue: "--- Select ---",
  };
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedThaulk, setSelectedThaulk] = useState("");
  const [districtDefaultValue, setDistrictDefaultValue] = useState(initialState.districtDefaultValue);
  const [thalukDefaultValue, setThalukDefaultValue] = useState(initialState.thalukDefaultValue);
  //--Districts
  const [lfcasesAvg, setlfcasesAvg] = useState([]);
  const [hydroceleCasesAvg, sethydroceleCasesAvg] = useState([]);
  const [mfPositiveAvg, setmfPositiveAvg] = useState([]);
  const [infectionAvg, setinfectionAvg] = useState([]);
  const [infectivityAvg, setinfectivityAvg] = useState([]);
  //---Talukas
  const [lfcasesTalukaAvg, setlfcasesTalukaAvg] = useState([]);
  const [hydroceleCasesTalukaAvg, sethydroceleCasesTalukaAvg] = useState([]);
  const [mfPositiveTalukaAvg, setmfPositiveTalukaAvg] = useState([]);
  const [infectionTalukaAvg, setinfectionTalukaAvg] = useState([]);
  const [infectivityTalukaAvg, setinfectivityTalukaAvg] = useState([]);
  //---Villages
  const [lfcasesVillageAvg, setlfcasesVillageAvg] = useState([]);
  const [hydroceleCasesVillageAvg, sethydroceleCasesVillageAvg] = useState([]);
  const [mfPositiveVillageAvg, setmfPositiveVillageAvg] = useState([]);
  const [infectionVillageAvg, setinfectionVillageAvg] = useState([]);
  const [infectivityVillageAvg, setinfectivityVillageAvg] = useState([]);

  const currentYear = new Date().getFullYear().toString();
  const initialFilterValue = useCallback(() => {
    return {
      year: currentYear,
      startMonth: "1",
      endMonth: "12",
      district: "",
    };
  }, []);
  const initialValueForTalukByDis = useCallback(() => {
    return {
      year: currentYear,
      startMonth: "1",
      endMonth: "12",
      mapDistrictId: "",
    };
  }, []);
  const initialValueForVillagesTownsByTaluka = useCallback(() => {
    return {
      year: currentYear,
      startMonth: "1",
      endMonth: "12",
      mapTalukaId: "",
      mapDistrictId: "",
    };
  }, []);

  async function GetDistrictsGeo() {
    const response = await MapService.GetDistrictsGeo();
    if (response) {
      setDistrictGeoData(response.data.features);
    }
  }

  const mapDataTalukasGeo = async (districtMapId) => {
    const response = await MapService.GetTalukasGeo(districtMapId);
    if (response && response.data) {
      return response.data.features;
    }
    else {
      return [];
    }
  }

  const mapDataVilllagesGeo = async (talukaMapId) => {
    const response = await MapService.GetVillagesGeo(talukaMapId);
    if (response && response.data) {
      return response.data.features;
    }
    else {
      return [];
    }
  }

  const mapDataTownsGeo = async (talukaMapId) => {
    const response = await MapService.GetTownsGeo(talukaMapId);
    if (response && response.data) {
      return response.data.features;
    }
    else {
      return [];
    }
  }


  useEffect(() => {
    const data = initialFilterValue();
    const params1 = initialValueForTalukByDis()
    const params2 = initialValueForVillagesTownsByTaluka()
    GetEndemicityMapAllDistricts(data);
    GetEndemicityMapAllTaluksByDistrict({ ...params1, mapDistrictId: selectedDistrictCode });
    GetEndemicityMapAllVillagesByTaluka({ ...params2, mapDistrictId: selectedDistrictCode, mapTalukaId: selectedThaulkCode });
    //GetEndemicityMapAllTownsByTaluka({ ...params2, mapDistrictId: selectedDistrictCode, mapTalukaId: selectedThaulkCode });
  }, [initialFilterValue, initialValueForTalukByDis, initialValueForVillagesTownsByTaluka, selectedDistrictCode, selectedThaulkCode]);

  const endemicityMapSelectHandler = (e) => {
    setEndemicityMapSelect(e.target.value);
    setChecked(e.target.value)
  };
  const [villagesByTalukData, setVillagesByTalukData] = useState();

  async function GetEndemicityMapAllDistricts(filterData) {
    let districtGeoData = await MapService.GetDistrictsGeo();
    const allDistrictData = await MapService.GetEndemicityMapAllDistricts(filterData);
    if ((allDistrictData && allDistrictData.data) && (districtGeoData && districtGeoData.data)) {
      let updatedDistrictData = districtGeoData.data.features;
      allDistrictData.data.map((ele) => {
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
            districtEle.properties.CulexInfection > 0 && 
              infectionAvg.push(districtEle.properties.CulexInfection);
            districtEle.properties.CulexInfectivity > 0 && 
              infectivityAvg.push(districtEle.properties.CulexInfectivity);
            districtEle.properties.NoMFPosetive > 0 && 
              mfPositiveAvg.push(districtEle.properties.NoMFPosetive);
          }
        })
      })
      setDistrictGeoData(updatedDistrictData);
      setlfcasesAvg(lfcasesAvg);
      sethydroceleCasesAvg(hydroceleCasesAvg);
      setmfPositiveAvg(mfPositiveAvg);
      setinfectionAvg(infectionAvg);
      setinfectivityAvg(infectivityAvg);
      setTimeout(() => {
        setDistrictMap(<GeoJSON key={`geojson-01`} style={districtStyle} data={updatedDistrictData} onEachFeature={onEachDistrict} cursor={false} />)
      }, 500);
    }
  }

  async function GetEndemicityMapAllTaluksByDistrict(filterData) {
    let talukaGeoData = await MapService.GetTalukasGeo(filterData.mapDistrictId);
    let talukaByDistrictData = await MapService.GetEndemicityMapAllTaluksByDistrict(filterData);
     if ((talukaByDistrictData && talukaByDistrictData.data) && (talukaGeoData && talukaGeoData.data)) {
      let updatedTalukaData = talukaGeoData.data.features;
      talukaByDistrictData.data.map((ele) => {
        updatedTalukaData.map((talukaEle) => {
          if (ele.mapTalukaId == talukaEle.properties.SUB_DIST_C) {
            talukaEle.properties.NoOfLFCases = ele.NoOfLFCases;
            talukaEle.properties.NoOfHydroceleCases = ele.NoOfHydroceleCases;
            talukaEle.properties.NoOfHydroceleSurgeries = ele.NoOfHydroceleSurgeries;
            talukaEle.properties.CulexInfection = ele.CulexInfection;
            talukaEle.properties.CulexInfectivity = ele.CulexInfectivity;
            talukaEle.properties.NoMFPosetive = ele.NoMFPosetive;
            talukaEle.properties.NoOfLFCases > 0 && 
              lfcasesTalukaAvg.push(talukaEle.properties.NoOfLFCases);
            talukaEle.properties.NoOfHydroceleCases > 0 && 
              hydroceleCasesTalukaAvg.push(talukaEle.properties.NoOfHydroceleCases);
            talukaEle.properties.CulexInfection > 0 && 
              infectionTalukaAvg.push(talukaEle.properties.CulexInfection);
            talukaEle.properties.CulexInfectivity > 0 && 
              infectivityTalukaAvg.push(talukaEle.properties.CulexInfectivity);
            talukaEle.properties.NoMFPosetive > 0 && 
              mfPositiveTalukaAvg.push(talukaEle.properties.NoMFPosetive);
          }
        })
      })
      setThalukaGeoData(updatedTalukaData);
      setlfcasesTalukaAvg(lfcasesTalukaAvg);
      sethydroceleCasesTalukaAvg(hydroceleCasesTalukaAvg);
      setmfPositiveTalukaAvg(mfPositiveTalukaAvg);
      setinfectionTalukaAvg(infectionTalukaAvg);
      setinfectivityTalukaAvg(infectivityTalukaAvg);
      if (updatedTalukaData)
      {
        setThalukMap([]);
        setTownMap([]);
        setVillageMap([]);
        setTimeout(() => {
          setThalukMap(<GeoJSON key={`geojson-02`} style={talukaStyle} data={updatedTalukaData} onEachFeature={onEachTaluka} cursor={false} />)
        }, 500);
      }
    }
  }

  async function GetEndemicityMapAllVillagesByTaluka(filterData) {
    let villagesGeoData = await MapService.GetVillagesGeo(filterData.mapTalukaId);
    let villagesByTalukaData = await MapService.GetEndemicityMapAllVillagesByTaluka(filterData);
     if ((villagesByTalukaData && villagesByTalukaData.data) && (villagesGeoData && villagesGeoData.data)) {
      let updatedVillageData = villagesGeoData.data.features;
      villagesByTalukaData.data.map((ele) => {
        updatedVillageData.map((villageEle) => {
          if (ele.mapVillageId == villageEle.properties.VILLAGE_CO) {
            villageEle.properties.NoOfLFCases = ele.NoOfLFCases;
            villageEle.properties.NoOfHydroceleCases = ele.NoOfHydroceleCases;
            villageEle.properties.NoOfHydroceleSurgeries = ele.NoOfHydroceleSurgeries;
            villageEle.properties.CulexInfection = ele.CulexInfection;
            villageEle.properties.CulexInfectivity = ele.CulexInfectivity;
            villageEle.properties.NoMFPosetive = ele.NoMFPosetive;
            villageEle.properties.NoOfLFCases > 0 && 
              lfcasesVillageAvg.push(villageEle.properties.NoOfLFCases);
            villageEle.properties.NoOfHydroceleCases > 0 && 
              hydroceleCasesVillageAvg.push(villageEle.properties.NoOfHydroceleCases);
            villageEle.properties.CulexInfection > 0 && 
              infectionVillageAvg.push(villageEle.properties.CulexInfection);
            villageEle.properties.CulexInfectivity > 0 && 
              infectivityVillageAvg.push(villageEle.properties.CulexInfectivity);
            villageEle.properties.NoMFPosetive > 0 && 
              mfPositiveVillageAvg.push(villageEle.properties.NoMFPosetive);
          }          
        })
      })
      setVillageGeoData(updatedVillageData);
      setlfcasesVillageAvg(lfcasesVillageAvg);
      sethydroceleCasesVillageAvg(hydroceleCasesVillageAvg);
      setmfPositiveVillageAvg(mfPositiveVillageAvg);
      setinfectionVillageAvg(infectionVillageAvg);
      setinfectivityVillageAvg(infectivityVillageAvg);
      if (updatedVillageData)
      {
        setVillageMap([]);
        setTimeout(() => {
          setVillageMap(<GeoJSON style={villageStyle} data={updatedVillageData} onEachFeature={onEachVillage} cursor={false} />)
        }, 500);
      }
    }

  }
  async function GetEndemicityMapAllTownsByTaluka(filterData) {
    const VillagesByTaluka_Data = await MapService.GetEndemicityMapAllVillagesByTaluka(filterData);
    if (VillagesByTaluka_Data && VillagesByTaluka_Data.data) {
      setVillagesByTalukData(VillagesByTaluka_Data.data);
    }
  }

  function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
      moveend(e) {
        if (map.getZoom() < 7) {
          onClickReset();
        }
      },
      locationfound(e) {
        setPosition(e.latlng)
        map.flyTo(e.latlng, map.getZoom())
      },
    })

    return position === null ? null : (
      <Marker position={position}>
        <Popup>You are here</Popup>
      </Marker>
    )
  }
  const [initialFilterValueEndemicityMap]= useState({
    year: `${current_year}`,
    startMonth:`1`,
    endMonth: `${previous_month}`,
    district: ""
  });

  let validSchemaEndemicityMap = Yup.object().shape({
    year: Yup.string(),
    startMonth: Yup.string(),
    endMonth: Yup.string(),
    district:Yup.string(),
  });
  
  const formikEndemicityMap = useFormik({
    initialValues: initialFilterValueEndemicityMap,
    enableReinitialize: true,
    validationSchema: validSchemaEndemicityMap,
    onSubmit: (values) => {
      GetEndemicityMapAllDistricts(values)
    }
  });

  const districtStyle = {
    fillColor: "#ffc4c4",
    color: "black",
    weight: 1,
  };
  const talukaStyle = {
    fillColor: "#ff5959",
    color: "black",
    weight: 1,
  };
  const townStyle = {
    fillColor: "#ff0000",
    color: "black",
    weight: .5,
  };

  const villageStyle = {
    fillColor: "#ff0000",
    color: "black",
    weight: .5,
  };

  function zoomThaulk(e, layer, talukaCode) {
    const params1 = initialValueForVillagesTownsByTaluka();    
    GetEndemicityMapAllTaluksByDistrict({ ...params1, mapDistrictId: selectedDistrictCode, mapTalukaId: talukaCode });
    if (e.target !== undefined) {
      layer._map.fitBounds(e.target.getBounds());
    } else {
      layer._map.fitBounds(e.getBounds());
    }
    setSelectedThaulkCode(talukaCode);
    // setTimeout(() => {
    //   layer._map.setView(layer._map.getCenter(), 11);
    // }, 1000);

  }
  async function zoomDistrict(e, layer, districtCode) {
      const params1 = initialValueForTalukByDis();
      GetEndemicityMapAllTaluksByDistrict({ ...params1, mapDistrictId: districtCode });
      if (e.target !== undefined) {
        layer._map.fitBounds(e.target.getBounds());
      } else {
        layer._map.fitBounds(e.getBounds());
      }
      setSelectedDistrictCode(districtCode)    
  }

  const onEachVillage = (village, layer) => {
    let avg = 10;
    //console.log("onEachVillage",village);
    setVillageLayer(oldArr => [...oldArr, layer]);
    const villageName = village.properties.NAME;
    let villageCode;let endemicity=0; let surg=0;
    villageCode = village.properties.VILLAGE_CO;

    if (villageName ==='Bot')
    {console.log("onEachVillage",village); }

    if (checked === "LfCases") {
      if (typeof village.properties.NoOfLFCases !== 'undefined')
          endemicity = village.properties.NoOfLFCases;
      if (lfcasesVillageAvg.length > 0) 
        avg = Math.max(...lfcasesVillageAvg);
    } else if (checked === "HydroceleCases") {
      endemicity = village.properties.NoOfHydroceleCases;
      surg = village.properties.NoOfHydroceleSurgeries;
      if (hydroceleCasesVillageAvg.length > 0) avg = Math.max(...hydroceleCasesVillageAvg);
    } else if (checked === "MfPositive") {
      endemicity = village.properties.NoMFPosetive;
      if (mfPositiveVillageAvg.length > 0) avg = Math.max(...mfPositiveVillageAvg);
    } else if (checked === "CulexInfection") {
      endemicity = village.properties.CulexInfection;
      if (infectionVillageAvg.length > 0) avg = Math.max(...infectionVillageAvg);
    } else if (checked === "CulexInfectivity") {
      endemicity = village.properties.CulexInfectivity;
      if (infectivityVillageAvg.length > 0) avg = Math.max(...infectivityVillageAvg);  
    } else {
      if (typeof village.properties.NoOfLFCases !== 'undefined')
          endemicity = village.properties.NoOfLFCases;
      if (lfcasesVillageAvg.length > 0) avg = Math.max(...lfcasesVillageAvg);
    }

    layer.options.fillOpacity = (
      Math.floor((endemicity / avg) * 100) / 100
    ).toFixed(4);
    //layer.options.fillColor = "#ccff33";
    // layer.bindTooltip(villageName, { permanent: true, direction: "center" }).openTooltip()
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          color: "black",
          weight: 2
        });
        //e.target.bindPopup("Village: " + villageName + ": Endemicity: " + endemicity).openPopup();
        if (checked === "LfCases") {
          e.target
            .bindPopup(`Village: ${villageName} , LF: ${endemicity}`)
            .openPopup();
        } else if (checked === "HydroceleCases") {
          e.target
            .bindPopup(`Village: ${villageName} , Hydrocele: ${endemicity} - Surg.(${surg})`)
            .openPopup();            
        } else if (checked === "MfPositive") {
          e.target
            .bindPopup(`Village: ${villageName} , MF: ${endemicity}`)
            .openPopup();
        } else if (checked === "CulexInfectivity") {
          e.target
            .bindPopup(`Village: ${villageName} , Infectivity: ${endemicity}`)
            .openPopup();
        } else if (checked === "CulexInfection") {
          e.target
            .bindPopup(`Village: ${villageName} , Infection: ${endemicity}`)
            .openPopup();
        }
        else  {
          e.target
            .bindPopup(`Village: ${villageName} , LF: ${endemicity}`)
            .openPopup();
        } 
      },
      click: (e) => {
        e.target.bringToFront();
      },
      click: (e) => {
        setVillageCode(villageCode);
      },
      mouseout: (e) => {
        e.target.setStyle({
          color: "black",
          weight: 1
        });
      },
    });
  }

  const onEachTown = (town, layer) => {
    const townName = town.properties.NAME;
    let endemicity=0; let surg=0;
    let avg = 10;
    if (checked === "LfCases") {
      town.properties.NoOfLFCases > 0 &&
        lfcasesAvg.push(town.properties.NoOfLFCases)
      avg = lfcasesAvg.length > 0 &&
        lfcasesAvg.reduce((a, b) => a + b) / lfcasesAvg.length;
      endemicity = town.properties.NoOfLFCases;
    } else if (checked == "HydroceleCases") {
      town.properties.NoOfHydroceleCases > 0 &&
        hydroceleCasesAvg.push(town.properties.NoOfHydroceleCases)
      avg = hydroceleCasesAvg.length > 0 &&
        hydroceleCasesAvg.reduce((a, b) => a + b) / hydroceleCasesAvg.length;
      endemicity = town.properties.NoOfHydroceleCases;
    } else if (checked == "MfPositive") {
      town.properties.NoMFPosetive > 0 &&
        mfPositiveAvg.push(town.properties.NoMFPosetive)
      avg = mfPositiveAvg.length > 0 &&
        mfPositiveAvg.reduce((a, b) => a + b) / mfPositiveAvg.length;
      endemicity = town.properties.NoMFPosetive;
    } else {
      endemicity = 0
    }
    layer.options.fillOpacity = (Math.floor((endemicity / avg) * 100) / 100).toFixed(4);
    //layer.options.fillColor = "#000080";
    //layer.bindTooltip(townName, { permanent: true, direction: "center" }).openTooltip()
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          color: "white",
          weight: 2
        });
        //e.target.bindPopup("Town: " + townName + ": Endemicity: " + endemicity).openPopup();
        if (checked === "LfCases") {
          e.target
            .bindPopup(`Town: ${townName} , LF: ${endemicity}`)
            .openPopup();
        } else if (checked === "HydroceleCases") {
          e.target
            .bindPopup(`Town: ${townName} , Hydrocele: ${endemicity} - Surg.(${surg})`)
            .openPopup();            
        } else if (checked === "MfPositive") {
          e.target
            .bindPopup(`Town: ${townName} , MF: ${endemicity}`)
            .openPopup();
        } else if (checked === "CulexInfectivity") {
          e.target
            .bindPopup(`Town: ${townName} , Infectivity: ${endemicity}`)
            .openPopup();
        } else if (checked === "CulexInfection") {
          e.target
            .bindPopup(`Town: ${townName} , Infection: ${endemicity}`)
            .openPopup();
        }
        else  {
          e.target
            .bindPopup(`Town: ${townName} , LF: ${endemicity}`)
            .openPopup();
        } 
      },
      mouseout: (e) => {
        e.target.setStyle({
          color: "black",
          weight: 1
        });
      },
    });
  }

  const onEachTaluka = (taluka, layer) => {
    let avg = 10;
    //console.log("onEachTaluka",taluka);
    setThalukLayer(oldArr => [...oldArr, layer]);
    const talukaName = taluka.properties.SUB_DIST_N;
    let talukaCode;let endemicity=0 ; let surg=0;
    if (selectedThaulkCode !== taluka.properties.SUB_DIST_C) {
      setThalukHasChanged(true);
      talukaCode = taluka.properties.SUB_DIST_C;
    } else {
      setThalukHasChanged(false);
      talukaCode = selectedThaulkCode;
    }    
    if (checked === "LfCases") {
      endemicity = taluka.properties.NoOfLFCases;
      if (lfcasesTalukaAvg.length > 0) avg = Math.max(...lfcasesTalukaAvg);
    } else if (checked === "HydroceleCases") {
      endemicity = taluka.properties.NoOfHydroceleCases;
      surg = taluka.properties.NoOfHydroceleSurgeries;
      if (hydroceleCasesTalukaAvg.length > 0) avg = Math.max(...hydroceleCasesTalukaAvg);
    } else if (checked === "MfPositive") {
      endemicity = taluka.properties.NoMFPosetive;
      if (mfPositiveTalukaAvg.length > 0) avg = Math.max(...mfPositiveTalukaAvg);
    } else if (checked === "CulexInfection") {
      endemicity = taluka.properties.CulexInfection;
      if (infectionTalukaAvg.length > 0) avg = Math.max(...infectionTalukaAvg);
    } else if (checked === "CulexInfectivity") {
      endemicity = taluka.properties.CulexInfectivity;
      if (infectivityTalukaAvg.length > 0) avg = Math.max(...infectivityTalukaAvg);  
    } else {
      endemicity = taluka.properties.NoOfLFCases;
      if (lfcasesAvg.length > 0) avg = Math.max(...lfcasesAvg);
    }
    layer.options.fillOpacity = (
      Math.floor((endemicity / avg) * 100) / 100
    ).toFixed(4);
    //layer.options.fillColor = "#800000";
    // layer.bindTooltip(talukaName, { permanent: true, direction: "center" }).openTooltip();
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          color: "black",
          weight: 2
        });
        //e.target.bindPopup("Taluka: " + talukaName + ": Endemicity: " + endemicity).openPopup();
        if (checked === "LfCases") {
          e.target
            .bindPopup(`Taluka: ${talukaName} , LF: ${endemicity}`)
            .openPopup();
        } else if (checked === "HydroceleCases") {
          e.target
            .bindPopup(`Taluka: ${talukaName} , Hydrocele: ${endemicity} - Surg.(${surg})`)
            .openPopup();            
        } else if (checked === "MfPositive") {
          e.target
            .bindPopup(`Taluka: ${talukaName} , MF: ${endemicity}`)
            .openPopup();
        } else if (checked === "CulexInfectivity") {
          e.target
            .bindPopup(`Taluka: ${talukaName} , Infectivity: ${endemicity}`)
            .openPopup();
        } else if (checked === "CulexInfection") {
          e.target
            .bindPopup(`Taluka: ${talukaName} , Infection: ${endemicity}`)
            .openPopup();
        }
        else  {
          e.target
            .bindPopup(`Taluka: ${talukaName} , LF: ${endemicity}`)
            .openPopup();
        } 
      },
      click: (e) => {
        if (thalukHasChanged) {
          setTownGeoData([]);
          setVillageGeoData([]); //shyam
          setTownMap([]);
          setVillageMap([]);
        }
        setThaulkCode(talukaCode);
        setThalukDefaultValue(talukaName);
        zoomThaulk(e, layer, talukaCode);
      },
      mouseout: (e) => {
        e.target.setStyle({
          color: "black",
          weight: 1
        });
      },
    });
  }
  const onEachDistrict = (district, layer) => {
    let avg = 10;
    setDistrictLayer(oldArr => [...oldArr, layer]);
    const districtName = district.properties.DIST_NAME;
    let districtCode; let endemicity=0; let surg=0;
    if (selectedDistrictCode !== district.properties.DIST_CODE) {
      setDistrictHasChanged(true);
      districtCode = district.properties.DIST_CODE
    } else {
      setDistrictHasChanged(false);
      districtCode = selectedDistrictCode
    }
    if (checked === "LfCases") {
      endemicity = district.properties.NoOfLFCases;
      if (lfcasesAvg.length > 0) avg = Math.max(...lfcasesAvg);
    } else if (checked === "HydroceleCases") {
      endemicity = district.properties.NoOfHydroceleCases;
      surg = district.properties.NoOfHydroceleSurgeries;
      if (hydroceleCasesAvg.length > 0) avg = Math.max(...hydroceleCasesAvg);
    } else if (checked === "MfPositive") {
      endemicity = district.properties.NoMFPosetive;
      if (mfPositiveAvg.length > 0) avg = Math.max(...mfPositiveAvg);
    } else if (checked === "CulexInfection") {
      endemicity = district.properties.CulexInfection;
      if (mfPositiveAvg.length > 0) avg = Math.max(...infectionAvg);
    } else if (checked === "CulexInfectivity") {
      endemicity = district.properties.CulexInfectivity;
      if (mfPositiveAvg.length > 0) avg = Math.max(...infectivityAvg);  
    } else {
      endemicity = district.properties.NoOfLFCases;
      if (lfcasesAvg.length > 0) avg = Math.max(...lfcasesAvg);
    }
    layer.options.fillOpacity = (
      Math.floor((endemicity / avg) * 100) / 100
    ).toFixed(4);
    layer.options.districtName = districtName
    layer.options.districtCode = district.properties.DIST_CODE
    //layer.options.text = "District: " + districtName + ": Endemicity: " + endemicity;
    //layer.bindTooltip(districtName, { permanent: true, direction: "center" }).openTooltip()
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
          weight: 2
        });
        // e.target.bindPopup("District: " + districtName + ": Endemicity: " + endemicity).openPopup();
        if (checked === "LfCases") {
          e.target
            .bindPopup(`District: ${districtName} , LF: ${endemicity}`)
            .openPopup();
        } else if (checked === "HydroceleCases") {
          e.target
            .bindPopup(`District: ${districtName} , Hydrocele: ${endemicity} - Surg.(${surg})`)
            .openPopup();            
        } else if (checked === "MfPositive") {
          e.target
            .bindPopup(`District: ${districtName} , MF: ${endemicity}`)
            .openPopup();
        } else if (checked === "CulexInfectivity") {
          e.target
            .bindPopup(`District: ${districtName} , Infectivity: ${endemicity}`)
            .openPopup();
        } else if (checked === "CulexInfection") {
          e.target
            .bindPopup(`District: ${districtName} , Infection: ${endemicity}`)
            .openPopup();
        }
        else  {
          e.target
            .bindPopup(`District: ${districtName} , LF: ${endemicity}`)
            .openPopup();
        } 
         
      },
      click: (e) => {
        if (districtHasChanged) {
          setThalukaGeoData([]);
          setTownGeoData([]);
          setVillageGeoData([]); //shyam
          setThalukMap([]);
          setTownMap([]);
          setVillageMap([]);
        }
        setDefaultDistrictName(districtName)
        setDistrictDefaultValue(districtName)
        zoomDistrict(e, layer, districtCode);
      },
      mouseout: (e) => {
        e.target.setStyle({
          color: "black",
          weight: 1
        });
      },
    });
  }

  // shyam
  useEffect(() => {
    if (!selectedDistrict)
    {
      setThaulkCode('');
      setSelectedThaulkCode('');
      setSelectedDistrictCode('');
      onClickReset();
      setDistrictMap([]);
      setTimeout(() => {
        setDistrictMap(<GeoJSON key={`geojson-01`} style={districtStyle} data={districtGeoData} onEachFeature={onEachDistrict} cursor={false} />)
      }, 500);
    }
  }, [checked,districtGeoData]);

  const updateCategory = (e) => {
    let checkedValue;
    if (e && e.target.checked) {
      checkedValue = e.target.value;
      setChecked(checkedValue);
    } else {
      setChecked('');
    }
  }

  function onClickReset() {
    if (map) map.setView(center, zoom);
    setChecked('');
    setThalukaGeoData([]);
    setVillageGeoData([]); //shyam
    setThalukMap([]);
    setTownMap([]);
    setVillageMap([]);
    setTimeout(() => {
      setSelectedDistrict("");
      setSelectedThaulk("")
      setDistrictDefaultValue(initialState.districtDefaultValue);
      setThalukDefaultValue(initialState.thalukDefaultValue);
      setZoom(7);
    }, 500);
  }

  const handleDropdownChange = (e) => {
    let districtValue = JSON.parse(e.target.value);
    let layerData = districtLayer.filter((ele) => {
      if (ele.feature.properties.DIST_CODE == districtValue.properties.DIST_CODE && ele._map) {
        return ele
      }
    })
    setSelectedDistrict(e.target.value)
    onEachDistrict(districtValue, layerData[0]);
    zoomDistrict(layerData[0], layerData[0], districtValue.properties.DIST_CODE);
  }

  const handleDropdownChangeThaulk = (e) => {
    let districtValue = JSON.parse(e.target.value);
    //console.log("districtValue",districtValue);
    let layerData = thalukLayer.filter((ele) => {
      if (ele.feature.properties.SUB_DIST_C == districtValue.properties.SUB_DIST_C && ele._map) {
        return ele
      }
    })
    setSelectedThaulk(e.target.value)
    onEachTaluka(districtValue, layerData[0]);
    setThaulkCode(districtValue.properties.SUB_DIST_C)
    zoomThaulk(layerData[0], layerData[0], districtValue.properties.SUB_DIST_C);
  }



  const drawerBleeding = 56;
  const Puller = styled(Box)(({ theme }) => ({
    width: 30,
    height: 6,
    backgroundColor: grey[300],
    borderRadius: 3,
    position: "absolute",
    top: 8,
    left: "calc(50% - 15px)",
    display: "inline-block",
    marginRight: "10px",
  }));
  const useStyles = makeStyles((theme) => ({
    drawerPaper: {
      width: "15%",
    },
    iconbutton: {
      float: "right",
      display: "inline-block",
    },
  }));

  const [open, setOpen] = React.useState(false);
  const [monthoption, setmonthoption] = React.useState(monthList);
  const [yearoption, setyearoption] = React.useState(yearList);
  const [selectedYList, setSelectedYList] = React.useState('');
  const [selectedMList, setSelectedMList] = React.useState('');


  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };
  const classes = useStyles();
  // const container =
  //   window !== undefined ? () => window().document.body : undefined;
  const changeMonth = (selected) => {
    setmonthoption(selected);
    const mlist = selected.map((x) => x.value)
    let myVar = mlist.join();
    setSelectedMList(myVar)
    selected.length === 0 && setmonthoption(current_month);
  };
  const changeYear = (selected) => {
    selected.length === 51 && setmonthoption(monthList);
    setyearoption(selected);
    const ylist = selected.map((x) => x.value)
    let myVar1 = ylist.join();
    setSelectedYList(myVar1)
    selected.length === 0 &&
      setyearoption([{ label: current_year, value: current_year }]);

  };

  const applyFliter = () => {
    GetEndemicityMapAllDistricts({
      year: selectedYList,
      //month: selectedMList,
      startMonth: "1",
      endMonth: "12",
      district: "",
    })
    setOpen(false);
  }
  return (
    <div >
      <br/>
      <h4 style={{ textAlign: "center" }}>Maharashtra State - Endemicity & Entomology Status</h4>
      <br/>
      <div className="whole-wrapper">
        <div className="map-wrapper_">
          <MapContainer style={{ height: "100vh" }} zoom={7} center={[19.663280, 75.300293]} whenCreated={setMap} cursor={false}>
            <LocationMarker />
            {districtMap}
            {thalukMap}
            {townMap}
            {villageMap}
          </MapContainer>
        </div>
        <div
          style={{
            marginTop: '2%',
            marginBottom: '1%',
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'relative',
            cursor: 'pointer'
          }}>
          {/* <button
            style={{ marginRight: '15px', height: '40px' }}
            className='mt-m font-chng btn btn-secondary'
            // onClick={onClickReset}
            onClick={toggleDrawer(true)}
          >
            Reset
          </button> */}
          <FilterListIcon
            style={{ marginRight: '25px',
             position: 'absolute',
             top: '0px',
             right: '0px' }}
            onClick={toggleDrawer(true)}>
            Filter
          </FilterListIcon>
        </div>
        <SwipeableDrawer
          classes={{ paper: classes.drawerPaper }}
          // container={container}
          anchor='right'
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
          swipeAreaWidth={drawerBleeding}
          disableSwipeToOpen={false}
          ModalProps={{ keepMounted: true }}>
          <div className='card' style={{ padding: 20 }}>
            <div>
              <Puller />
              <IconButton
                onClick={toggleDrawer(false)}
                aria-label='settings'
                className={classes.iconbutton}>
                <CloseIcon />
              </IconButton>
            </div>
            <div>
              <div >
                <MDP>Year</MDP>
                <div style={{ display: 'flex' }}>
                  <div className='form-grp' style={{ marginRight: 10 }}>
                    <FormControl variant="filled">
                      <CustomSelectField
                        native    
                        value={formikEndemicityMap.values.year}
                        onChange={(e) => {
                          formikEndemicityMap.setFieldValue(
                            'year',
                            e?.target?.value ? e.target.value : '',
                          )
                          GetEndemicityMapAllDistricts({
                            ...formikEndemicityMap.values,
                            'year':
                              e?.target?.value ? e.target.value : '',
                          })
                        }}
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                      >
                        {yearList.map((item) => <option value={`${item.value}`} id={`${item.value}`} key={`${item.value}`}>{item.label}</option>)}
                      </CustomSelectField>
                    </FormControl>
                  </div>
                </div>
              </div>
              <div >
                <MDP>Month (From : To)</MDP>
                <div style={{ display: 'flex' }}>
                  <div className='form-grp' style={{ marginRight: 10 }}>
                    <FormControl variant="filled">
                      <CustomSelectField
                        native
                        value={formikEndemicityMap.values.startMonth}
                        onChange={(e) => {
                          formikEndemicityMap.setFieldValue(
                            'startMonth',
                            e?.target?.value ? e.target.value : '',
                          )
                          GetEndemicityMapAllDistricts({
                            ...formikEndemicityMap.values,
                            'startMonth':
                              e?.target?.value ? e.target.value : '',
                          })
                        }}
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                      >
                        {monthList?.length !== 0 ? monthList.map((item) => <option value={`${item.value}`} id={`${item.value}`} key={`${item.value}`}>{item.label}</option>) :
                          NoneList.map((item) => <option value={`${item.value}`} id={`${item.value}`} key={`${item.value}`}>{item.label}</option>)}
                      </CustomSelectField>
                    </FormControl>
                    <div className={'invalid-feedback'}>
                      {formikEndemicityMap.errors ? formikEndemicityMap.errors.startMonth : ''}
                    </div>
                  </div>
                  <div className='form-grp' style={{ marginRight: 10 }}>
                    <FormControl variant="filled">
                      <CustomSelectField
                        native
                        value={formikEndemicityMap.values.endMonth}
                        onChange={(e) => {
                          formikEndemicityMap.setFieldValue(
                            'endMonth',
                            e?.target?.value ? e.target.value : '',
                          )
                          GetEndemicityMapAllDistricts({
                            ...formikEndemicityMap.values,
                            'endMonth':
                              e?.target?.value ? e.target.value : '',
                          })
                        }}
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                      >
                        {formikEndemicityMap.values.startMonth && endMonthList(formikEndemicityMap.values.startMonth)?.length !== 0 ? endMonthList(formikEndemicityMap.values.startMonth).map((item) => <option value={`${item.value}`} id={`${item.value}`} key={`${item.value}`}>{item.label}</option>) :
                          NoneList.map((item) => <option value={`${item.value}`} id={`${item.value}`} key={`${item.value}`}>{item.label}</option>)}
                      </CustomSelectField>
                    </FormControl>
                  </div>
                </div>
              </div>
              <div >
                <MDP></MDP>
                <div style={{ display: 'flex' }}>
                  <div className='form-grp' style={{ marginRight: 10 }}>
                    <FormControl variant="filled">
                      <CustomSelectField
                        native
                        value={endemicityMapSelect}
                        onChange={endemicityMapSelectHandler}
                        >
                        <option value={"LfCases"}>Lymphedema</option>
                        <option value={"HydroceleCases"}>Hydrocele</option>
                        <option value={"MfPositive"}>MF Positive</option>
                        <option value={"CulexInfection"}>Culex Infection</option>
                        <option value={"CulexInfectivity"}>Culex Infectivity</option>
                      </CustomSelectField>
                    </FormControl>
                  </div>
                </div>                
              </div>
            </div>

            <div >
                <MDP>District</MDP>
                <div style={{ display: 'flex' }}>
                  <div className='form-grp' style={{ marginRight: 10 }}>
                    <FormControl variant="filled">
                      <CustomSelectField
                        native    
                        value={selectedDistrict}
                        onChange={handleDropdownChange}
                        style={{
                          outline: "none",
                          border: "none",
                        }}
                      >
                        <option value="default" hidden> {districtDefaultValue}</option>                {
                        districtGeoData.map((obj) => {
                        return <option value={JSON.stringify(obj)}>{obj.properties.DIST_NAME}</option>})
                      }
                      </CustomSelectField>
                    </FormControl>
                  </div>
                </div>
            </div>
              {thalukaGeoData && thalukaGeoData.length > 0 &&
                <div >
                  <MDP> Select thaluk:</MDP> 
                  <div style={{ display: 'flex' }}>
                    <div className='form-grp' style={{ marginRight: 10 }}>
                      <FormControl variant="filled">
                          <CustomSelectField
                          native    
                          value={selectedThaulk}
                          onChange={handleDropdownChangeThaulk}
                          style={{
                            outline: "none",
                            border: "none",
                          }}
                        > <option value="default" hidden> {thalukDefaultValue} </option>
                        {
                          thalukaGeoData.map((obj) => {
                            return <option value={JSON.stringify(obj)}>{obj.properties.SUB_DIST_N}</option>
                          })
                        }
                        </CustomSelectField>
                      </FormControl>
                    </div>
                  </div>
                </div>
              }
              <div >
                <MDP></MDP>
                <div style={{ display: 'flex' }}>
                  <div className='form-grp' style={{ marginRight: 10 }}>
                    <Button
                      className='mt-m font-chng'
                      type='submit'
                      style={{ backgroundColor: '#19D895', border: 'none', fontWeight: 500, color: '#FFFFFF', fontSize: 13 }}
                      onClick={onClickReset}
                      >                       
                      Reset                  
                    </Button>
                  </div>
                </div>
              </div> 
            </div>   
        </SwipeableDrawer>
      </div>
    </div>
  )
}

export default InteractiveMap;