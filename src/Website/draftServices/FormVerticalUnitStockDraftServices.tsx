import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import { applyEncryptionMiddleware,clearAllTables,cryptoOptions } from 'dexie-encrypted';

const DB_Name = "Form_VerticalUnitStock";
 export const offlineForms = new Dexie(DB_Name);
 const nacl = require("tweetnacl");

 const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

 offlineForms.version(2).stores({});
 offlineForms.version(1).stores({
    VerticalUnitStock :"++$$VerticalUnitStockUUID,createdBy",
});

const configDE09Table:any = {
    VerticalUnitStock: cryptoOptions.NON_INDEXED_FIELDS,
}

/* applyEncryptionMiddleware(
  offlineForms,
  keyPair.publicKey,
  configDE09Table,
  clearAllTables
); */

//DE3-------------------------------------------------------------------
const addVerticalUnitStock = async (values) => {
    let Response = await offlineForms['VerticalUnitStock'].add(values);
    return Response;
  };
  
  const getAllVerticalUnitStock = async (userId) => {
    let Response = await offlineForms['VerticalUnitStock'].where('createdBy').equals(userId).toArray();
    return Response;
  };

  const getListVerticalUnitStock = async () => {
    let Response = await offlineForms['VerticalUnitStock'].toArray();
    return Response;
  };
  
  
  const countVerticalUnitStock = async (userId) => {
    let Response = await offlineForms['VerticalUnitStock'].where('createdBy').equals(userId).count();
    return Response;
  };
  
  
  const getOneVerticalUnitStock = async (id) => {
    let Response = await offlineForms['VerticalUnitStock'].get(id);
    return Response;
  };
  
  const updateVerticalUnitStock = async (id,values) => {
    let Response = await offlineForms['VerticalUnitStock'].update(id,values);
    return Response;
  };
  
  const deleteVerticalUnitStock = async (id) => {
    console.log("delete id offline mdaActivity",id)
    let Response = await offlineForms['VerticalUnitStock'].where('VerticalUnitStockUUID').equals(id).delete();
    return Response;
  };
  
  const emptyVerticalUnitStock = async (id) => {
    let Response = await offlineForms['VerticalUnitStock'].where('createdBy').equals(id).delete();
    console.log("clear offline mdaActivity")
    return Response;
  };

  const VerticalUnitStockDraftServices = {
    addVerticalUnitStock,
    getAllVerticalUnitStock,
    getListVerticalUnitStock,
    countVerticalUnitStock,
    getOneVerticalUnitStock,
    updateVerticalUnitStock,
    deleteVerticalUnitStock,
    emptyVerticalUnitStock

}
export default VerticalUnitStockDraftServices;