import Dexie from 'dexie';
import 'dexie-observable';
import { applyEncryptionMiddleware,clearAllTables,cryptoOptions } from 'dexie-encrypted';
 const nacl = require("tweetnacl");
 const DB_Name = "Offline_Dropdown_Data_Database";
const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));
export const DropdownDBExists = "IndexedDBDropdownDBExists";
export const DropdownDBNotExists = "IndexedDBDropdownDBNotExists";

// offlineForms.open().catch((err) => {
//   console.log(err.stack || err)
// })

const Dropdowndb = new Dexie(DB_Name);

// interface Dropdowndb {
//   states:string
// }

Dropdowndb.version(3).stores({
    states: "++id",
    districts:"++id,stateId",
    catagoryOptions:"++id,categoryCode,categoryOptionEnum",
    corporation:"++id,districtId",
    taluka:"++id,districtId",
    zone:"++id,corporationId,districtId",
    facility:"++id,districtId",
    subCenter:"++id,facilityId,districtId",
    ward:"++id,corporationId,districtId",
    villages:"++id,facilityId,districtId,subCenterId,[facilityId+districtId+subCenterId]",
    verticalControlUnits:"++id,nameOfControlUnit,unitType",
    verticalControlFieldUnits:"++id,verticalControlUnitId,fieldUnitName,fieldUnitType",
    designation:"++id",
  });
let configDropdownTable:any =  {
    states: cryptoOptions.NON_INDEXED_FIELDS,
    districts:cryptoOptions.UNENCRYPTED_LIST,
    catagoryOptions:cryptoOptions.UNENCRYPTED_LIST,
    corporation:cryptoOptions.NON_INDEXED_FIELDS,
    taluka:cryptoOptions.NON_INDEXED_FIELDS,
    zone:cryptoOptions.NON_INDEXED_FIELDS,
    facility:cryptoOptions.NON_INDEXED_FIELDS,
    subCenter:cryptoOptions.NON_INDEXED_FIELDS,
    ward:cryptoOptions.NON_INDEXED_FIELDS,
    villages:cryptoOptions.NON_INDEXED_FIELDS,
    verticalControlFieldUnits:cryptoOptions.NON_INDEXED_FIELDS,
    verticalControlUnits:cryptoOptions.NON_INDEXED_FIELDS,
    designation:cryptoOptions.NON_INDEXED_FIELDS
};
  applyEncryptionMiddleware(
    Dropdowndb,
    keyPair.publicKey,
    configDropdownTable,
    clearAllTables
  );
 
Dropdowndb.open().catch((err) => {
    console.log(err.stack || err)
})

//Dropdown---------------------------------------------------------------------------------------

const checkOfflineDropdownDBExist = async() =>{
  return Dexie.exists("Offline_Dropdown_Data_Database").then(function(exists) {
    if (exists){
      return DropdownDBExists;
    }
    else {
      return DropdownDBNotExists;
    }
});
}

const getCorporationOffline = async (districtId:number) => { 
  let corporationId: any = await  Dropdowndb['corporation'].where('districtId').equals(districtId).toArray();
  return corporationId;
}

const getTalukaOffline = async (districtId:number) => { 
  let talukaId: any = await  Dropdowndb['taluka'].where('districtId').equals(districtId).toArray();
  return talukaId;
}
const getAllFacilityOffline = async () => { 
  let facilityId: any = await Dropdowndb['facility'].toArray();
  return facilityId;
}

const getFacilityOffline = async (districtId:number) => { 
  let facilityId: any = await Dropdowndb['facility'].where('districtId').equals(districtId).toArray();
  return facilityId;
}

const getAllDesignationOffline = async () => { 
  let getAllDesignation: any = await Dropdowndb['designation'].toArray();
  return getAllDesignation;
}
const getAllVertiocalControlUnitsOffline = async () => { 
  let getAllVertiocalControlUnits: any = await Dropdowndb['verticalControlUnits'].toArray();
  return getAllVertiocalControlUnits;
}
const getAllVertiocalControlFieldUnitsOffline = async () => { 
  let getAllVertiocalControlFieldUnits: any = await Dropdowndb['verticalControlFieldUnits'].toArray();
  return getAllVertiocalControlFieldUnits;
}

const getSubCenterOffline = async (facilityId:any,districtId:any) => {
  facilityId = facilityId === null ? 0 : facilityId;
  districtId = districtId === null ? 0 : districtId;  
  let subCenterId: any = await Dropdowndb['subCenter'].where('facilityId','districtId').equals(facilityId,districtId).toArray();
  return subCenterId;
}

const getNameOfUnitOffline = async (unitType:any) => {
  unitType = unitType === null ? 0 : unitType;
  let nameofUnitId: any = await Dropdowndb['verticalControlUnits'].where('unitType').equals(unitType).toArray();
  return nameofUnitId;
}

const getNameOfFieldUnitOffline = async (verticalControlUnitId:any) => {
  verticalControlUnitId = verticalControlUnitId === null ? 0 : verticalControlUnitId;
  let nameofFieldUnitId: any = await Dropdowndb['verticalControlFieldUnits'].where('verticalControlUnitId').equals(verticalControlUnitId).toArray();
  return nameofFieldUnitId;
}

const getUnitActionOffline = async () => {
  let nameofUnitId: any = await Dropdowndb['catagoryOptions'].where('categoryOptionEnum').toArray();
  return nameofUnitId;
}

const getUnitActionCatagoryCodeOffline = async (categoryCode) => {
  let nameofUnitId: any = await Dropdowndb['catagoryOptions'].where('categoryCode').equals(categoryCode).toArray();
  return nameofUnitId;
}

const getWardOffline = async (corporationId:any,districtId:any) => {
  corporationId = corporationId === null ? 0 : corporationId;
  districtId = districtId === null ? 0 : districtId;  
  let wardId: any = await Dropdowndb['ward'].where('corporationId','districtId').equals(corporationId,districtId).toArray();
  return wardId;
}

const getVillageOffline = async (facilityId:number,districtId:any) => { 
 // let district=parseInt(districtId)
 facilityId = facilityId === null ? 0 : facilityId;
  districtId = districtId === null ? 0 : districtId;  
  let villageId: any = await Dropdowndb['villages'].where('facilityId','districtId').equals(facilityId,districtId).toArray();
  return villageId;
}
const getVillageByTalukaOffline = async (talukaId:number,districtId:any) => { 
  // let district=parseInt(districtId)
  talukaId = talukaId === null ? 0 : talukaId;
   districtId = districtId === null ? 0 : districtId;  
   let villageId: any = await Dropdowndb['villages'].where('talukaId','districtId').equals(talukaId,districtId).toArray();
   return villageId;
 }

const getVillageBySubCenterOffline = async (districtId:any,facilityId:any,subCenterId:any) => { 
  // let district=parseInt(districtId)
  facilityId = facilityId === null ? 0 : facilityId;
   districtId = districtId === null ? 0 : districtId;  
   subCenterId = subCenterId === null ? 0 : subCenterId;
   let villageId: any = await Dropdowndb['villages'].where('[facilityId+districtId+subCenterId]').equals([facilityId,districtId,subCenterId]).toArray();
   return villageId;
 }

const getZoneOffline = async (corporationId:any,districtId:any) => { 
 // let district =parseInt(districtId)
  corporationId = corporationId === null ? 0 : corporationId;
  districtId = districtId === null ? 0 : districtId;  
  let zoneData: any = await Dropdowndb['zone'].where('corporationId','districtId').equals(corporationId,districtId).toArray();
  return zoneData;
}



const addCorporationOffline = async (values) => { 
  let corporationId: any = await  Dropdowndb['corporation'].bulkAdd(values);
  return corporationId;
}

const countCorporation = async () => {
  let CorporationResponse = await Dropdowndb['corporation'].count();
    return CorporationResponse;
};

const bulkUpdateCorporation = async (values) => {
  let corporationResponse = await Dropdowndb['corporation'].bulkPut(values).then(function(lastKey) {
    return lastKey;
    }).catch(Dexie.BulkError, function (e) {
      console.error ("Some corporation did not succeed. However, " + e.failures.length + " corporation was added successfully");
      return e;
    });
    return corporationResponse;
}

const addTalukaOffline = async (values) => { 
  let talukaId: any = await  Dropdowndb['taluka'].bulkAdd(values);
  return talukaId;
}

const bulkUpdateTaluka = async (values) => {
  let talukaResponse = await Dropdowndb['taluka'].bulkPut(values).then(function(lastKey) {
    console.log("Last Taluka's id was: " + lastKey)
    return lastKey;
    }).catch(Dexie.BulkError, function (e) {
      console.error ("Some Taluka did not succeed. However, " + e.failures.length + " Taluka was added successfully");
      return e;
    });
    return talukaResponse;
}

const countTaluka = async () => {
  let TalukaResponse = await Dropdowndb['taluka'].count();
    return TalukaResponse;
};

const addFacilityOffline = async (values) => { 
  let facilityId: any = await Dropdowndb['facility'].bulkAdd(values);
  return facilityId;
}

const bulkUpdateFacility = async (values) => {
  let facilityResponse = await Dropdowndb['facility'].bulkPut(values).then(function(lastKey) {
    console.log("Last Facility's id was: " + lastKey)
    return lastKey;
    }).catch(Dexie.BulkError, function (e) {
      console.error ("Some Facility did not succeed. However, " + e.failures.length + " Facility was added successfully");
      return e;
    });
    return facilityResponse;
}

const countFacility = async () => {
  let FacilityResponse = await Dropdowndb['facility'].count();
    return FacilityResponse;
};

const addSubCenterOffline = async (values) => { 
  let subCenterId: any = await Dropdowndb['subCenter'].bulkAdd(values);
  return subCenterId;
}

const bulkUpdateSubCenter= async (values) => {
  let subCenterResponse = await Dropdowndb['subCenter'].bulkPut(values).then(function(lastKey) {
    console.log("Last SubCenter's id was: " + lastKey)
    return lastKey;
    }).catch(Dexie.BulkError, function (e) {
      console.error ("Some SubCenter did not succeed. However, " + e.failures.length + " SubCenter was added successfully");
      return e;
    });
    return subCenterResponse;
}

const countSubCenter = async () => {
  let SubCenterResponse = await Dropdowndb['subCenter'].count();
    return SubCenterResponse;
};

const addWardOffline = async (values) => { 
  let wardId: any = await Dropdowndb['ward'].bulkAdd(values);
  return wardId;
}

const bulkUpdateWard = async (values) => {
  let wardResponse = await Dropdowndb['ward'].bulkPut(values).then(function(lastKey) {
    console.log("Last Ward's id was: " + lastKey)
    return lastKey;
    }).catch(Dexie.BulkError, function (e) {
      console.error ("Some Ward did not succeed. However, " + e.failures.length + " Ward was added successfully");
      return e;
    });
    return wardResponse;
}

const countWard = async () => {
  let WardResponse = await Dropdowndb['ward'].count();
    return WardResponse;
};

const addVerticalControlFieldUnitsOffline = async (values) => { 
  let wardId: any = await Dropdowndb['verticalControlFieldUnits'].bulkAdd(values);
  return wardId;
}

const bulkUpdateVerticalControlFieldUnits = async (values) => {
  let verticalControlFieldUnitsResponse = await Dropdowndb['verticalControlFieldUnits'].bulkPut(values).then(function(lastKey) {
    console.log("Last verticalControlFieldUnits's id was: " + lastKey)
    return lastKey;
    }).catch(Dexie.BulkError, function (e) {
      console.error ("Some verticalControlFieldUnits did not succeed. However, " + e.failures.length + " verticalControlFieldUnits was added successfully");
      return e;
    });
    return verticalControlFieldUnitsResponse;
}

const countVerticalControlFieldUnits = async () => {
  let VerticalControlFieldUnitsResponse = await Dropdowndb['verticalControlFieldUnits'].count();
    return VerticalControlFieldUnitsResponse;
};

const addVerticalControlUnitsOffline = async (values) => { 
  let VerticalControlUnitsId: any = await Dropdowndb['verticalControlUnits'].bulkAdd(values);
  return VerticalControlUnitsId;
}

const bulkUpdateVerticalControlUnits = async (values) => {
  let verticalControlUnitsResponse = await Dropdowndb['verticalControlUnits'].bulkPut(values).then(function(lastKey) {
    console.log("Last verticalControlUnits's id was: " + lastKey)
    return lastKey;
    }).catch(Dexie.BulkError, function (e) {
      console.error ("Some verticalControlUnits did not succeed. However, " + e.failures.length + " verticalControlUnits was added successfully");
      return e;
    });
    return verticalControlUnitsResponse;
}

const countVerticalControlUnits = async () => {
  let VerticalControlUnitsResponse = await Dropdowndb['verticalControlUnits'].count();
    return VerticalControlUnitsResponse;
};

const addVillageOffline = async (values) => { 
  let villageId: any = await Dropdowndb['villages'].bulkAdd(values);
  return villageId;
}

const bulkUpdateVillage = async (values) => {
  let villageResponse = await Dropdowndb['villages'].bulkPut(values).then(function(lastKey) {
    console.log("Last village's id was: " + lastKey)
    return lastKey;
    }).catch(Dexie.BulkError, function (e) {
      console.error ("Some village did not succeed. However, " + e.failures.length + " village was added successfully");
      return e;
    });
    return villageResponse;
}

const countVillage = async () => {
  let VillageResponse = await Dropdowndb['villages'].count();
    return VillageResponse;
};

const addZoneOffline = async (values) => { 
  let zoneData: any = await Dropdowndb['zone'].bulkAdd(values);
  return zoneData;
}

const bulkUpdateZone = async (values) => {
  let zoneResponse = await Dropdowndb['zone'].bulkPut(values).then(function(lastKey) {
    console.log("Last zone's id was: " + lastKey)
    return lastKey;
    }).catch(Dexie.BulkError, function (e) {
      console.error ("Some zone did not succeed. However, " + e.failures.length + " zone was added successfully");
      return e;
    });
    return zoneResponse;
}

const countZone = async () => {
  let zoneResponse = await Dropdowndb['zone'].count();
    return zoneResponse;
};


const getStates = async () => {
  let statesResponse = await Dropdowndb['states'].toArray();
    return statesResponse;
  };

const addStates = async (values) => {
  let statesResponse = await Dropdowndb['states'].bulkAdd(values);
    return statesResponse;
  };

  const bulkUpdateStates = async (values) => {
    let statesResponse = await Dropdowndb['states'].bulkPut(values).then(function(lastKey) {
      console.log("Last state's id was: " + lastKey)
      return lastKey;
      }).catch(Dexie.BulkError, function (e) {
        console.error ("Some states did not succeed. However, " + e.failures.length + " states was added successfully");
        return e;
      });
      return statesResponse;
  }

  const countStates = async () => {
    let StatesResponse = await Dropdowndb['states'].count();
      return StatesResponse;
  };

  const getDistricts = async () => {
  let districtsResponse = await Dropdowndb['districts'].toArray();
    return districtsResponse;
  };

  const getAllTaluka = async () => {
    let talukaResponse = await Dropdowndb['taluka'].toArray();
      return talukaResponse;
    };

  const getAllVillage = async () => {
    let VillageResponse = await Dropdowndb['villages'].toArray();
      return VillageResponse;
    };

  const getAllFacility = async () => {
    let FacilityResponse = await Dropdowndb['facility'].toArray();
        return FacilityResponse;
    };

  const getOneDistrict = async (id) => {
    let idNum = parseInt(id)
    let districtResponse = await Dropdowndb['districts'].where('stateId').equals(idNum).toArray();
      return districtResponse;
    };

  const getOneStateName = async (id) => {
      let Response = await Dropdowndb['states'].get(id);
      return Response;
  };

const addDistricts = async (values) => {
  let districtsResponse = await Dropdowndb['districts'].bulkAdd(values);
    return districtsResponse;
  };

  const bulkUpdateDistricts = async (values) => {
    let districtsResponse = await Dropdowndb['districts'].bulkPut(values).then(function(lastKey) {
      console.log("Last district's id was: " + lastKey)
      return lastKey;
      }).catch(Dexie.BulkError, function (e) {
        console.error ("Some districts did not succeed. However, " + e.failures.length + " districts was added successfully");
        return e;
      });
      return districtsResponse;
  }

  const countDistricts = async () => {
    let DistrictsResponse = await Dropdowndb['districts'].count();
      return DistrictsResponse;
  };

  const addDesignation = async (values) => {
    let districtsResponse = await Dropdowndb['designation'].bulkAdd(values);
      return districtsResponse;
    };

  const countDesignation = async () => {
    let DesignationResponse = await Dropdowndb['designation'].count();
      return DesignationResponse;
  };

  const bulkUpdateDesiganation = async (values) => {
    let districtsResponse = Dropdowndb['designation'].bulkPut(values).then(function(lastKey) {
      console.log("Last designation's id was: " + lastKey)
      return lastKey;
      }).catch(Dexie.BulkError, function (e) {
        console.error ("Some designation did not succeed. However, " + e.failures.length + " designation was added successfully");
        return e;
      });
      return districtsResponse;
  }

const getCatagoryOption = async () => {
  let catagoryResponse = await Dropdowndb['catagoryOptions'].toArray();
    return catagoryResponse;
  };

const addCatagoryOption = async (values) => {
  let catagoryResponse = await Dropdowndb['catagoryOptions'].bulkAdd(values);
    return catagoryResponse;
  };

  const bulkUpdateCatagoryOption = async (values) => {
    let catagoryOptionsResponse = await Dropdowndb['catagoryOptions'].bulkPut(values).then(function(lastKey) {
      console.log("Last catagoryOption's id was: " + lastKey)
      return lastKey;
      }).catch(Dexie.BulkError, function (e) {
        console.error ("Some catagoryOptions did not succeed. However, " + e.failures.length + " catagoryOptions was added successfully");
        return e;
      });
      return catagoryOptionsResponse;
  }
const countCatagoryOption = async () => {
    let CatagoryOptionResponse = await Dropdowndb['catagoryOptions'].count();
      return CatagoryOptionResponse;
  };


const deleteDexieDropdownDB = async () => {
    Dexie.delete('Offline_Dropdown_Data_Database').then(() => {
        console.log("Offline Dropdown Database successfully deleted");
    }).catch((err) => {
        console.error("Could not delete database",err);
    })
};


const DexieOfflineDataBase = {
    deleteDexieDropdownDB,
    checkOfflineDropdownDBExist,

    getCorporationOffline,
    getTalukaOffline,
    getFacilityOffline,
    getAllFacilityOffline,
    getSubCenterOffline,
    getVillageOffline,
    getVillageBySubCenterOffline,
    getVillageByTalukaOffline,
    getWardOffline,
    getZoneOffline,

    addCorporationOffline,
    addTalukaOffline,
    addFacilityOffline,
    addSubCenterOffline,
    addVillageOffline,
    addWardOffline,
    addZoneOffline,

    getStates,
    addStates,
    addDistricts,
    getDistricts,
    getOneDistrict,
    getOneStateName,
    getCatagoryOption,
    addCatagoryOption,
    getAllFacility,
    getAllTaluka,
    getAllVillage,

    bulkUpdateDesiganation,
    bulkUpdateCorporation,
    bulkUpdateVerticalControlUnits,
    bulkUpdateCatagoryOption,
    bulkUpdateDistricts,
    bulkUpdateFacility,
    bulkUpdateStates,
    bulkUpdateSubCenter,
    bulkUpdateTaluka,
    bulkUpdateVerticalControlFieldUnits,
    bulkUpdateVillage,
    bulkUpdateWard,
    bulkUpdateZone,

    countDesignation,
    countCatagoryOption,
    countCorporation,
    countDistricts,
    countFacility,
    countStates,
    countSubCenter,
    countTaluka,
    countVerticalControlFieldUnits,
    countVerticalControlUnits,
    countVillage,
    countWard,
    countZone,

    addDesignation,
    getAllDesignationOffline,

    addVerticalControlFieldUnitsOffline,
    addVerticalControlUnitsOffline,
    getAllVertiocalControlFieldUnitsOffline,
    getAllVertiocalControlUnitsOffline,
    getNameOfUnitOffline,
    getUnitActionOffline,
    getUnitActionCatagoryCodeOffline,
    getNameOfFieldUnitOffline,


}
export default DexieOfflineDataBase;