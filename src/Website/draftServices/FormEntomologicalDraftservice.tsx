import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import { applyEncryptionMiddleware,clearAllTables,cryptoOptions } from 'dexie-encrypted';

const DB_Name = "Form_Entomological";
 export const offlineForms = new Dexie(DB_Name);
 const nacl = require("tweetnacl");

 const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

 offlineForms.version(2).stores({});
offlineForms.version(1).stores({
    entomological :"++$$entomologicalUUID,createdBy",
});

const configDE11Table:any = {
    entomological: cryptoOptions.NON_INDEXED_FIELDS,
}
applyEncryptionMiddleware(
  offlineForms,
  keyPair.publicKey,
  configDE11Table,
  clearAllTables
);

//DE3-------------------------------------------------------------------
const addEntomological = async (values) => {
    let Response = await offlineForms['entomological'].add(values);
    return Response;
  };
  
  const getAllEntomological = async (userId) => {
    let Response = await offlineForms['entomological'].where('createdBy').equals(userId).toArray();
    return Response;
  };

  const getListEntomological = async () => {
    let Response = await offlineForms['entomological'].toArray();
    return Response;
  };
  
  
  const countEntomological = async (userId) => {
    let Response = await offlineForms['entomological'].where('createdBy').equals(userId).count();
    return Response;
  };
  
  
  const getOneEntomological = async (id) => {
    let Response = await offlineForms['entomological'].get(id);
    return Response;
  };
  
  const updateEntomological = async (id,values) => {
    let Response = await offlineForms['entomological'].update(id,values);
    return Response;
  };
  
  const deleteEntomological = async (id) => {
    let Response = await offlineForms['entomological'].where('entomologicalUUID').equals(id).delete();
    return Response;
  };
  
  const emptyEntomological = async (id) => {
    let Response = await offlineForms['entomological'].where('createdBy').equals(id).delete();
    return Response;
  };

  const entomologicalDraftServices = {
    addEntomological,
    getAllEntomological,
    getListEntomological,
    countEntomological,
    getOneEntomological,
    updateEntomological,
    deleteEntomological,
    emptyEntomological

}
export default entomologicalDraftServices;