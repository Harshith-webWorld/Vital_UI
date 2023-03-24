import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import { applyEncryptionMiddleware,clearAllTables,cryptoOptions } from 'dexie-encrypted';

const DB_Name = "Form_MdaIecActivity";
 export const offlineForms = new Dexie(DB_Name);
 const nacl = require("tweetnacl");

 const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

 offlineForms.version(2).stores({});
offlineForms.version(1).stores({
  mdaIecActivity:"++$$mdaIecActivityUUID,createdBy",
});

const configDE3Table:any = {
    mdaIecActivity: cryptoOptions.NON_INDEXED_FIELDS,
}
applyEncryptionMiddleware(
  offlineForms,
  keyPair.publicKey,
  configDE3Table,
  clearAllTables
);

//DE3-------------------------------------------------------------------
const addMdaIecActivity = async (values) => {
    let Response = await offlineForms['mdaIecActivity'].add(values);
    return Response;
  };
  
  const getAllMdaIecActivity = async (userId) => {
    let Response = await offlineForms['mdaIecActivity'].where('createdBy').equals(userId).toArray();
    return Response;
  };
  
  
  const countMdaIecActivity = async (userId) => {
    let Response = await offlineForms['mdaIecActivity'].where('createdBy').equals(userId).count();
    return Response;
  };
  
  
  const getOneMdaIecActivity = async (id) => {
    let Response = await offlineForms['mdaIecActivity'].get(id);
    return Response;
  };
  
  const updateMdaIecActivity = async (id,values) => {
    let Response = await offlineForms['mdaIecActivity'].update(id,values);
    return Response;
  };
  
  const deleteMdaIecActivity = async (id) => {
    console.log("delete id offline mdaActivity",id)
    let Response = await offlineForms['mdaIecActivity'].where('mdaIecActivityUUID').equals(id).delete();
    return Response;
  };
  
  const emptyMdaIecActivity = async (id) => {
    let Response = await offlineForms['mdaIecActivity'].where('createdBy').equals(id).delete();
    console.log("clear offline mdaActivity")
    return Response;
  };

  const mdaIecActivityDraftServices = {
    addMdaIecActivity,
    getAllMdaIecActivity,
    countMdaIecActivity,
    getOneMdaIecActivity,
    updateMdaIecActivity,
    deleteMdaIecActivity,
    emptyMdaIecActivity
}
export default mdaIecActivityDraftServices;