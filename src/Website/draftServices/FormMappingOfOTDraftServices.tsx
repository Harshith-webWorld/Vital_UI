import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import { applyEncryptionMiddleware,clearAllTables,cryptoOptions } from 'dexie-encrypted';

const DB_Name = "Form_MappingOfOperationTheaters";
 export const offlineForms = new Dexie(DB_Name);
 const nacl = require("tweetnacl");

 const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

 offlineForms.version(2).stores({});
offlineForms.version(1).stores({
  mappingOfOperationTheaters:"++$$mappingOfOperationTheatersUUID,createdBy",
});

const configDE6Table:any = {
    mappingOfOperationTheaters: cryptoOptions.NON_INDEXED_FIELDS,
}
applyEncryptionMiddleware(
  offlineForms,
  keyPair.publicKey,
  configDE6Table,
  clearAllTables
);

//DE3-------------------------------------------------------------------
const addMappingOfOperationTheaters = async (values) => {
    let Response = await offlineForms['mappingOfOperationTheaters'].add(values);
    return Response;
  };
  
  const getAllMappingOfOperationTheaters = async (userId) => {
    let Response = await offlineForms['mappingOfOperationTheaters'].where('createdBy').equals(userId).toArray();
    return Response;
  };
  
  
  const countMappingOfOperationTheaters = async (userId) => {
    let Response = await offlineForms['mappingOfOperationTheaters'].where('createdBy').equals(userId).count();
    return Response;
  };
  
  
  const getOneMappingOfOperationTheaters = async (id) => {
    let Response = await offlineForms['mappingOfOperationTheaters'].get(id);
    return Response;
  };
  
  const updateMappingOfOperationTheaters = async (id,values) => {
    let Response = await offlineForms['mappingOfOperationTheaters'].update(id,values);
    return Response;
  };
  
  const deleteMappingOfOperationTheaters = async (id) => {
    console.log("delete id offline mappingOfOperationTheaters",id)
    let Response = await offlineForms['mappingOfOperationTheaters'].where('mappingOfOperationTheatersUUID').equals(id).delete();
    return Response;
  };
  
  const emptyMappingOfOperationTheaters = async (id) => {
    let Response = await offlineForms['mappingOfOperationTheaters'].where('createdBy').equals(id).delete();
    console.log("clear offline mappingOfOperationTheaters")
    return Response;
  };

  const mappingOfOperationTheatersDraftServices = {
    addMappingOfOperationTheaters,
    getAllMappingOfOperationTheaters,
    getOneMappingOfOperationTheaters,
    updateMappingOfOperationTheaters,
    deleteMappingOfOperationTheaters,
    emptyMappingOfOperationTheaters,
    countMappingOfOperationTheaters

}
export default mappingOfOperationTheatersDraftServices;