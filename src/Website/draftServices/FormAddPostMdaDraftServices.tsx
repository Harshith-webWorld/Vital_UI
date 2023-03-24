import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import nacl from "tweetnacl";
import { applyEncryptionMiddleware,clearAllTables,cryptoOptions } from 'dexie-encrypted';

const DB_Name = "Form_AddPostMdaThirdParty";
export const offlineForms = new Dexie(DB_Name);

const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

 offlineForms.version(2).stores({});
offlineForms.version(1).stores({
    postMdaEval:"++$$postMdaEvalUUID,createdBy",
})

const configDE5Table:any = {
    postMdaEval: cryptoOptions.NON_INDEXED_FIELDS
}
applyEncryptionMiddleware(
  offlineForms,
  keyPair.publicKey,
  configDE5Table,
  clearAllTables
);


//DE5 ---------------------------------------------------------------------------------
const addPostMdaEval = async (values) => {
  let Response = await offlineForms['postMdaEval'].add(values);
  return Response;
};

const getAllPostMdaEvaly = async () => {
  let Response = await offlineForms['postMdaEval'].toArray();
  return Response;
};

const getListPostMdaEvaly = async (userId) => {
  let Response = await offlineForms['postMdaEval'].where('createdBy').equals(userId).toArray();
  return Response;
};



const countPostMdaEval = async (userId) => {
  let Response = await offlineForms['postMdaEval'].where('createdBy').equals(userId).count();
  return Response;
};


const getOnePostMdaEval = async (id) => {
  let Response = await offlineForms['postMdaEval'].get(id);
  return Response;
};

const updatePostMdaEval = async (id,values) => {
  let Response = await offlineForms['postMdaEval'].update(id,values);
  return Response;
};

const deletePostMdaEval = async (id) => {
  let Response = await offlineForms['postMdaEval'].where('postMdaEvalUUID').equals(id).delete();
  return Response;
};

const emptyPostMdaEval = async (id) => {
  let Response = await offlineForms['postMdaEval'].where('createdBy').equals(id).delete();
  return Response;
};


const AddPostMdaDraftServices = {
  addPostMdaEval,
  getAllPostMdaEvaly,
  getListPostMdaEvaly,
  countPostMdaEval,
  getOnePostMdaEval,
  updatePostMdaEval,
  deletePostMdaEval,
  emptyPostMdaEval
}
export default AddPostMdaDraftServices;