import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import nacl from "tweetnacl";
import { applyEncryptionMiddleware, clearAllTables, cryptoOptions } from 'dexie-encrypted';

const DB_Name = "Form_StaffPosition";
export const offlineForms = new Dexie(DB_Name);

const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

offlineForms.version(2).stores({});
offlineForms.version(1).stores({
    staffPosUnitStatus: "++$$staffPosUnitStatusUUID,createdBy",
    staffPosTraningStatus: "++$$staffPositionTraningUUID,staffPosVerticalUnitId,createdBy",
})

const configDE10Table: any = {
    StaffPosUnitStatus: cryptoOptions.NON_INDEXED_FIELDS,
    staffPosTraningStatus: cryptoOptions.NON_INDEXED_FIELDS,
}

applyEncryptionMiddleware(
    offlineForms,
    keyPair.publicKey,
    configDE10Table,
    clearAllTables
);

//DE 10----------------------------------------------------------------------

// StaffPosUnitStatus ------------------------------

const countStaffPosunitStatus = async (userId) => {
    let Response = await offlineForms['staffPosUnitStatus'].where('createdBy').equals(userId).count();
    return Response;
};

const addStaffPosUnitStatus = async (values) => {
    let Response = await offlineForms['staffPosUnitStatus'].add(values);
    return Response;
};

const getAllStaffPosUnitStatus = async () => {
    let Response = await offlineForms['staffPosUnitStatus'].toArray();
    return Response;
  };
  

const getListStaffPosUnitStatus = async (userId) => {
    console.log("userId DE4 list", userId);
    let Response = await offlineForms['staffPosUnitStatus'].where('createdBy').equals(userId).toArray();
    console.log("getList staff", Response)
    return Response;
};

const getOneStaffPosUnitStatus = async (id) => {
    let Response = await offlineForms['staffPosUnitStatus'].get(id);
    console.log("getOne Coverages", Response)
    return Response;
};

const updateStaffPosUnitStatus = async (id, values) => {
    let Response = await offlineForms['staffPosUnitStatus'].update(id, values);
    return Response;
};

const deleteStaffPosUnitStatus = async (id) => {
    console.log("delete id offline mdaActivity", id)
    let Response = await offlineForms['staffPosUnitStatus'].where('staffPosUnitStatusUUID').equals(id).delete();
    return Response;
};

const emptyStaffPosUnitStatus = async (id) => {
    let Response = await offlineForms['staffPosUnitStatus'].where('createdBy').equals(id).delete();
    return Response;
};

//staffPosTraningStatus---------------------------------------------------------------

const countStaffPosTraningStatus = async (userId) => {
    let Response = await offlineForms['staffPosTraningStatus'].count();
    return Response;
};

const addStaffPosTraningStatus = async (values) => {
    let Response = await offlineForms['staffPosTraningStatus'].add(values);
    return Response;
};

const getAllStaffPosTraningStatus = async () => {
    let Response = await offlineForms['staffPosTraningStatus'].toArray();
    return Response;
};

const getListStaffPosTraningStatus = async (userId) => {
    console.log("userId DE4 list", userId);
    let Response = await offlineForms['staffPosTraningStatus'].where('staffPosVerticalUnitId').equals(userId).toArray();
    console.log("getList staff", Response)
    return Response;
};

const getOneStaffPosTraningStatus = async (id) => {
    let Response = await offlineForms['staffPosTraningStatus'].get(id);
    console.log("getOne staff", Response)
    return Response;
};

const updateStaffPosTraningStatus = async (id, values) => {
    let Response = await offlineForms['staffPosTraningStatus'].update(id, values);
    console.log("update training status", Response)
    return Response;
};

const deleteStaffPosTraningStatus = async (id) => {
    console.log("delete id offline ", id)
    let Response = await offlineForms['staffPosTraningStatus'].where('staffPositionTraningUUID').equals(id).delete();
    return Response;
};

const emptyStaffPosTraningStatus = async (id) => {
    let Response = await offlineForms['staffPosTraningStatus'].where('createdBy').equals(id).delete();
    return Response;
};


const staffPositionDraftServices = {
    addStaffPosUnitStatus,
    countStaffPosunitStatus,
    getListStaffPosUnitStatus,
    getOneStaffPosUnitStatus,
    updateStaffPosUnitStatus,
    deleteStaffPosUnitStatus,
    emptyStaffPosUnitStatus,
    getAllStaffPosUnitStatus,

    countStaffPosTraningStatus,
    addStaffPosTraningStatus,
    getListStaffPosTraningStatus,
    getAllStaffPosTraningStatus,
    getOneStaffPosTraningStatus,
    updateStaffPosTraningStatus,
    deleteStaffPosTraningStatus,
    emptyStaffPosTraningStatus

}
export default staffPositionDraftServices;