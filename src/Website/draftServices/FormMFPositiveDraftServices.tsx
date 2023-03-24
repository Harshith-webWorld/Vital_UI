import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import { applyEncryptionMiddleware,clearAllTables,cryptoOptions } from 'dexie-encrypted';

const DB_Name = "Form_MFPositive";
 export const offlineForms = new Dexie(DB_Name);
 const nacl = require("tweetnacl");

 const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

 offlineForms.version(2).stores({});
offlineForms.version(1).stores({
    mfPositiveLineList:"++$$mfPositiveLineListUUID,createdBy",
    mfPositiveLineListPatients:"++$$mfPositiveLineListPatientsUUID,mfPositiveLineListId,createdBy",
    mfPositiveLineListBSFollowUps:"++$$mfPositiveLineListBSFollowUpsUUID,mfPositiveLineListId,createdBy",
})

const configDE8Table:any = {
    mfPositiveLineList: cryptoOptions.NON_INDEXED_FIELDS,
    mfPositiveLineListPatients:cryptoOptions.NON_INDEXED_FIELDS,
    mfPositiveLineListBSFollowUps:cryptoOptions.NON_INDEXED_FIELDS,
}
// applyEncryptionMiddleware(
//   offlineForms,
//   keyPair.publicKey,
//   configDE8Table,
//   clearAllTables
// );

//DE1------------------------------------------------------------------------------
    const countMFPositiveLineList = async (userId) => {
        let Response = await offlineForms['mfPositiveLineList'].where('createdBy').equals(userId).count();
        return Response;
    };
    const addMFPositiveLineList = async (values) => {
      let Response = await offlineForms['mfPositiveLineList'].add(values);
      return Response;
    };
    const addMFPositiveLineListPatients = async (values) => {
      let Response = await offlineForms['mfPositiveLineListPatients'].add(values);
      return Response;
    };
    const addMFPositiveLineListBSFollowUps = async (values) => {
      let Response = await offlineForms['mfPositiveLineListBSFollowUps'].add(values);
      return Response;
    };

    const getListMFPositiveLineList = async (userId) => {
        console.log("userId DE4 list",userId);
        let Response = await offlineForms['mfPositiveLineList'].where('createdBy').equals(userId).toArray();
        console.log("getList mfPositiveLineList",Response)
          return Response;
        };
    
    const getListMFPositiveLineListPatients = async (id) => {
            console.log(id)
            let Response = await offlineForms['mfPositiveLineListPatients'].where('mfPositiveLineListId').equals(id).toArray();
            console.log("getList mfPositiveLineListPatients",Response);
              return Response;
    };
    const getListMFPositiveLineListBSFollowUps = async (id) => {
        console.log(id)
        let Response = await offlineForms['mfPositiveLineListBSFollowUps'].where('mfPositiveLineListId').equals(id).toArray();
        console.log("getList mfPositiveLineListBSFollowUps",Response);
          return Response;
    };
  
  const getAllListMFPositiveLineListPatients = async () => {
          let Response = await offlineForms['mfPositiveLineListPatients'].toArray();
          console.log("getAllList mfPositiveLineListPatients",Response);
            return Response;
  };
  const getAllListMFPositiveLineListBSFollowUps = async () => {
      let Response = await offlineForms['mfPositiveLineListBSFollowUps'].toArray();
      console.log("getAllList mfPositiveLineListBSFollowUps",Response);
        return Response;
  };

    const getOneMFPositiveLineList = async (id) =>{
        let Response = await offlineForms['mfPositiveLineList'].get(id);
        console.log("getOne mfPositiveLineList",Response);
      return Response;
    }

    const getOneMFPositiveLineListPatients = async (id) =>{
        let Response = await offlineForms['mfPositiveLineListPatients'].get(id);
        console.log("getOne mfPositiveLineListPatients",Response);
      return Response;
    }
    const getOneMFPositiveLineListBSFollowUps = async (id) =>{
        let Response = await offlineForms['mfPositiveLineListBSFollowUps'].get(id);
        console.log("getOne mfPositiveLineListBSFollowUps",Response);
      return Response;
    }

    const updateMFPositiveLineList = async (id,values) => {
        let Response = await offlineForms['mfPositiveLineList'].update(id,values);
        console.log("update mfPositiveLineList",Response);
        return Response;
      };
    
    const updateMFPositiveLineListPatients = async (id,values) => {
        let Response = await offlineForms['mfPositiveLineListPatients'].update(id,values);
        console.log("update mfPositiveLineListPatients",Response);
        return Response;
      };
    const updateMFPositiveLineListBSFollowUps = async (id,values) => {
        let Response = await offlineForms['mfPositiveLineListBSFollowUps'].update(id,values);
        console.log("update mfPositiveLineListBSFollowUps",Response);
        return Response;
      };
    
      const deleteMFPositiveLineList = async (id) => {
        console.log("delete id offline mfPositiveLineList",id)
        let Response = await offlineForms['mfPositiveLineList'].where('mfPositiveLineListUUID').equals(id).delete();
        return Response;
      };

    const deleteMFPositiveLineListPatients = async (id) => {
        console.log("delete id offline mfPositiveLineListPatients",id)
        let Response = await offlineForms['mfPositiveLineListPatients'].where('mfPositiveLineListPatientsUUID').equals(id).delete();
        return Response;
      };
    const deleteMFPositiveLineListBSFollowUps = async (id) => {
        console.log("delete id offline mfPositiveLineListBSFollowUps",id)
        let Response = await offlineForms['mfPositiveLineListBSFollowUps'].where('mfPositiveLineListBSFollowUpsUUID').equals(id).delete();
        return Response;
      };

     
    const deleteListMFPositiveLineListPatients = async (id) => {
        console.log("delete id offline mfPositiveLineListPatients",id)
        let Response = await offlineForms['mfPositiveLineListPatients'].where('mfPositiveLineListId').equals(id).delete();
        return Response;
      };
    const deleteListMFPositiveLineListBSFollowUps = async (id) => {
        console.log("delete id offline mfPositiveLineListBSFollowUps",id)
        let Response = await offlineForms['mfPositiveLineListBSFollowUps'].where('mfPositiveLineListId').equals(id).delete();
        return Response;
      };

    const deleteDE1LocalDB = async () => {
        Dexie.delete(DB_Name).then(() => {
            console.log("Offline Form Database successfully deleted");
        }).catch((err) => {
            console.error("Could not delete database",err);
        })
      };

    const mfPositiveDraftServices = {
        countMFPositiveLineList,
        addMFPositiveLineList,
        addMFPositiveLineListPatients,
        addMFPositiveLineListBSFollowUps,

        getListMFPositiveLineList,
        getListMFPositiveLineListBSFollowUps,
        getListMFPositiveLineListPatients,

        getAllListMFPositiveLineListBSFollowUps,
        getAllListMFPositiveLineListPatients,

        getOneMFPositiveLineList,
        getOneMFPositiveLineListBSFollowUps,
        getOneMFPositiveLineListPatients,

        updateMFPositiveLineList,
        updateMFPositiveLineListBSFollowUps,
        updateMFPositiveLineListPatients,
        
        deleteMFPositiveLineList,
        deleteMFPositiveLineListBSFollowUps,
        deleteMFPositiveLineListPatients,

        deleteListMFPositiveLineListBSFollowUps,
        deleteListMFPositiveLineListPatients,

        deleteDE1LocalDB,
    }

export default mfPositiveDraftServices;