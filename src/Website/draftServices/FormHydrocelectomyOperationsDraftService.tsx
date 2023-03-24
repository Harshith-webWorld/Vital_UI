import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import { applyEncryptionMiddleware,clearAllTables,cryptoOptions } from 'dexie-encrypted';

const DB_Name = "Form_HydrocelectomyOperations";
 export const offlineForms = new Dexie(DB_Name);
 const nacl = require("tweetnacl");

 const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

 offlineForms.version(2).stores({});
 offlineForms.version(1).stores({
  HydrocelectomyOperations :"++$$HydrocelectomyOperationsUUID,createdBy",
});

const configDE09Table:any = {
  HydrocelectomyOperations: cryptoOptions.NON_INDEXED_FIELDS,
}

/* applyEncryptionMiddleware(
  offlineForms,
  keyPair.publicKey,
  configDE09Table,
  clearAllTables
); */

//DE3-------------------------------------------------------------------
const addHydrocelectomyOperations = async (values) => {
    let Response = await offlineForms['HydrocelectomyOperations'].add(values);
    return Response;
  };
  
  const getAllHydrocelectomyOperations = async (userId) => {
    let Response = await offlineForms['HydrocelectomyOperations'].where('createdBy').equals(userId).toArray();
    return Response;
  };

  const getListHydrocelectomyOperations = async () => {
    let Response = await offlineForms['HydrocelectomyOperations'].toArray();
    return Response;
  };
  
  
  const countHydrocelectomyOperations = async (userId) => {
    let Response = await offlineForms['HydrocelectomyOperations'].where('createdBy').equals(userId).count();
    return Response;
  };
  
  
  const getOneHydrocelectomyOperations = async (id) => {
    let Response = await offlineForms['HydrocelectomyOperations'].get(id);
    return Response;
  };
  
  const updateHydrocelectomyOperations = async (id,values) => {
    let Response = await offlineForms['HydrocelectomyOperations'].update(id,values);
    return Response;
  };
  
  const deleteHydrocelectomyOperations = async (id) => {
    console.log("delete id offline mdaActivity",id)
    let Response = await offlineForms['HydrocelectomyOperations'].where('HydrocelectomyOperationsUUID').equals(id).delete();
    return Response;
  };
  
  const emptyHydrocelectomyOperations = async (id) => {
    let Response = await offlineForms['HydrocelectomyOperations'].where('createdBy').equals(id).delete();
    console.log("clear offline mdaActivity")
    return Response;
  };

  const HydrocelectomyOperationsDraftServices = {
    addHydrocelectomyOperations,
    getAllHydrocelectomyOperations,
    getListHydrocelectomyOperations,
    countHydrocelectomyOperations,
    getOneHydrocelectomyOperations,
    updateHydrocelectomyOperations,
    deleteHydrocelectomyOperations,
    emptyHydrocelectomyOperations

}
export default HydrocelectomyOperationsDraftServices;