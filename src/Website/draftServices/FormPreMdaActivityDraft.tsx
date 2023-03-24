import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import { applyEncryptionMiddleware, clearAllTables, cryptoOptions } from 'dexie-encrypted';
const DB_Name = "Form_PreMdaActivity";
export const offlineForms = new Dexie(DB_Name);
//offlineForms.open();
const nacl = require("tweetnacl");

const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

offlineForms.version(2).stores({});
offlineForms.version(1).stores({
  preMdaActivity: "++$$preMDAActivityUUID,createdBy",
  preMdaActivityDrug: "++$$preMDAActivityDrugUUID,preMDAActivityId,createdBy",
  // mdaIdaMopUp:"++$$mdaIdaMopUpUUID,mdaIDACoverageId,createdBy",
})

const configDE4Table: any = {
  preMdaActivity: cryptoOptions.NON_INDEXED_FIELDS,
  mdaIdaRepreMdaActivityDruggular: cryptoOptions.NON_INDEXED_FIELDS,

}
// applyEncryptionMiddleware(
//   offlineForms,
//   keyPair.publicKey,
//   configDE4Table,
//   clearAllTables
// );

// offlineForms.open().catch((err) => {
//  console.log(err.stack || err)
// })


const countPreMdaActvity = async (userId) => {
  let Response = await offlineForms['preMdaActivity'].where('createdBy').equals(userId).count();
  return Response;
};



const addPreMdaActivity = async (values) => {
  let Response = await offlineForms['preMdaActivity'].add(values);
  return Response;
};
const addPreMdaActivityDrug = async (values) => {
  let Response = await offlineForms['preMdaActivityDrug'].add(values);
  return Response;
};

const getListPreMdaActivity = async (userId) => {
  console.log("userId DE4 list", userId);
  let Response = await offlineForms['preMdaActivity'].where('createdBy').equals(userId).toArray();
  console.log("getList Coverages", Response)
  return Response;
};

const getAllPreMdaActivity = async () => {
  let Response = await offlineForms['preMdaActivity'].toArray();
  console.log("getList Coverages", Response)
  return Response;
};

const getListPreMdaActivityDrug = async (id) => {
  console.log(id)
  let Response = await offlineForms['preMdaActivityDrug'].where('preMDAActivityId').equals(id).toArray();
  console.log("getList Regular", Response)
  return Response;
};

const getAllPreMdaActivityDrug = async () => {
  let Response = await offlineForms['preMdaActivityDrug'].toArray();
  console.log("getList Regular", Response)
  return Response;
};


const getOnePreMdaActivity = async (id) => {
  let Response = await offlineForms['preMdaActivity'].get(id);
  console.log("getOne Coverages", Response)
  return Response;
}

const getOnePreMdaActivityDrug = async (id) => {
  let Response = await offlineForms['preMdaActivityDrug'].get(id);
  console.log("getOne regular", Response)
  return Response;
}

const updatePreMdaActivity = async (id, values) => {
  let Response = await offlineForms['preMdaActivity'].update(id, values);
  console.log("update mopup", Response)
  return Response;
};
const updatePreMdaActivityDrug = async (id, values) => {
  let Response = await offlineForms['preMdaActivityDrug'].update(id, values);
  console.log("update mopup", Response)
  return Response;
};

const deletePreMdaActivity = async (id) => {
  console.log("delete id offline mdaActivity", id)
  let Response = await offlineForms['preMdaActivity'].where('preMDAActivityUUID').equals(id).delete();
  return Response;
};
const deletePreMdaActivityDrug = async (id) => {
  console.log("delete id offline mdaActivity", id)
  let Response = await offlineForms['preMdaActivityDrug'].where('preMDAActivityDrugUUID').equals(id).delete();
  return Response;
};
const deleteGetListPreMdaActivityDrug = async (id) => {
  console.log(id)
  let Response = await offlineForms['preMdaActivityDrug'].where('preMDAActivityId').equals(id).delete();
  console.log("getList Regular", Response)
  return Response;
};

const emptyPreMdaActivity = async () => {
  let Response = await offlineForms['preMdaActivity'].clear();
  return Response;
};
const emptyPreMdaActivityDrug = async () => {
  let Response = await offlineForms['preMdaActivityDrug'].clear();
  return Response;
};




const DexieOfflineFormPreMdaActivity = {
  countPreMdaActvity,
  addPreMdaActivity,
  addPreMdaActivityDrug,
  getListPreMdaActivity,
  getAllPreMdaActivity,
  getListPreMdaActivityDrug,
  getAllPreMdaActivityDrug,
  getOnePreMdaActivity,
  getOnePreMdaActivityDrug,
  updatePreMdaActivity,
  updatePreMdaActivityDrug,
  deletePreMdaActivity,
  deletePreMdaActivityDrug,
  deleteGetListPreMdaActivityDrug,
  emptyPreMdaActivity,
  emptyPreMdaActivityDrug

}
export default DexieOfflineFormPreMdaActivity;