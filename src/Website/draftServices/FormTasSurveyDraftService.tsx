import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import { applyEncryptionMiddleware, clearAllTables, cryptoOptions } from 'dexie-encrypted';
const DB_Name = "Form_TasSurvey";
export const offlineForms = new Dexie(DB_Name);
//offlineForms.open();
const nacl = require("tweetnacl");

const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

offlineForms.version(2).stores({});
offlineForms.version(1).stores({
  tasSurvey: "++$$tasSurveyUUID,createdBy",
  tasSurveyChild: "++$$tasSurveyChildUUID,tasSurveyId,createdBy",
  // mdaIdaMopUp:"++$$mdaIdaMopUpUUID,mdaIDACoverageId,createdBy",
})

const configDE4Table: any = {
  preMdaActivity: cryptoOptions.NON_INDEXED_FIELDS,
  mdaIdaRepreMdaActivityDruggular: cryptoOptions.NON_INDEXED_FIELDS,

}

applyEncryptionMiddleware(
  offlineForms,
  keyPair.publicKey,
  configDE4Table,
  clearAllTables
);

// offlineForms.open().catch((err) => {
//  console.log(err.stack || err)
// })


const countTasSurvey = async (userId :any) => {
  let Response = await offlineForms['tasSurvey'].where('createdBy').equals(userId).count();
  return Response;
};



const addTasSurvey = async (values) => {
  let Response = await offlineForms['tasSurvey'].add(values);
  return Response;
};
const addTasSurveyChild = async (values) => {
  let Response = await offlineForms['tasSurveyChild'].add(values);
  return Response;
};

const getListTasSurvey = async (userId) => {
  console.log("userId DE4 list", userId);
  let Response = await offlineForms['tasSurvey'].where('createdBy').equals(userId).toArray();
  console.log("getList Coverages", Response)
  return Response;
};

const getAllTasSurvey = async () => {
  let Response = await offlineForms['tasSurvey'].toArray();
  console.log("getList Coverages", Response)
  return Response;
};

const getListTasSurveyChild = async (id) => {
  console.log(id)
  let Response = await offlineForms['tasSurveyChild'].where('tasSurveyId').equals(id).toArray();
  console.log("getList Regular", Response)
  return Response;
};

const getAllTasSurveyChild = async () => {
  let Response = await offlineForms['tasSurveyChild'].toArray();
  console.log("getList Regular", Response)
  return Response;
};

const getOneTasSurvey = async (id) => {
  let Response = await offlineForms['tasSurvey'].get(id);
  console.log("getOne tas", Response)
  return Response;
}

const getOneTasSurveyChild = async (id) => {
  let Response = await offlineForms['tasSurveyChild'].get(id);
  console.log("getOne regular", Response)
  return Response;
}



const updateTasSurvey = async (id, values) => {
  let Response = await offlineForms['tasSurvey'].update(id, values);
  console.log("update mopup", Response)
  return Response;
};
const updateTasSurveyChild = async (id, values) => {
  let Response = await offlineForms['tasSurveyChild'].update(id, values);
  console.log("update mopup", Response)
  return Response;
};

const deleteTasSurvey = async (id) => {
  console.log("delete id offline mdaActivity", id)
  let Response = await offlineForms['tasSurvey'].where('tasSurveyUUID').equals(id).delete();
  return Response;
};
const deleteTasSurveyChild = async (id) => {
  console.log("delete id offline mdaActivity", id)
  let Response = await offlineForms['tasSurveyChild'].where('tasSurveyChildUUID').equals(id).delete();
  return Response;
};
const deleteGetListTasSurveyChild = async (id) => {
  console.log(id)
  let Response = await offlineForms['tasSurveyChild'].where('tasSurveyId').equals(id).delete();
  console.log("getList Regular", Response)
  return Response;
};

const emptyTasSurvey = async () => {
  let Response = await offlineForms['tasSurvey'].clear();
  return Response;
};
const emptyTasSurveyChild = async () => {
  let Response = await offlineForms['tasSurveyChild'].clear();
  return Response;
};




const DexieOfflineFormTasSurvey = {
  countTasSurvey,
  addTasSurvey,
  addTasSurveyChild,
  getListTasSurvey,
  getAllTasSurvey,
  getListTasSurveyChild,
  getAllTasSurveyChild,
  getOneTasSurvey,
  getOneTasSurveyChild,
  updateTasSurvey,
  updateTasSurveyChild,
  deleteTasSurvey,
  deleteTasSurveyChild,
  deleteGetListTasSurveyChild,
  emptyTasSurvey,
  emptyTasSurveyChild

}
export default DexieOfflineFormTasSurvey;