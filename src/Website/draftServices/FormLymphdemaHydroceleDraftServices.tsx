import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import { applyEncryptionMiddleware,clearAllTables,cryptoOptions } from 'dexie-encrypted';

const DB_Name = "Form_LymphdemaHydrocele";
 export const offlineForms = new Dexie(DB_Name);
 const nacl = require("tweetnacl");

 const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

 offlineForms.version(2).stores({});
offlineForms.version(1).stores({
    lymphedemaLineList:"++$$lymphedemaLineListUUID,createdBy",
    lymphedemaLineListSurvey:"++$$lymphedemaLineListSurveyUUID,lymphedemaLineListId,createdBy",
    lymphedemaLineListFollowUpsLF:"++$$lymphedemaLineListFollowUpsLFUUID,lymphedemaLineListId,createdBy",
    lymphedemaLineListFollowUpsHF:"++$$lymphedemaLineListFollowUpsHFUUID,lymphedemaLineListId,createdBy",
})

const configDE1Table:any = {
    lymphedemaLineList: cryptoOptions.NON_INDEXED_FIELDS,
    lymphedemaLineListSurvey:cryptoOptions.NON_INDEXED_FIELDS,
    lymphedemaLineListFollowUpsLF:cryptoOptions.NON_INDEXED_FIELDS,
    lymphedemaLineListFollowUpsHF:cryptoOptions.NON_INDEXED_FIELDS,
}
// applyEncryptionMiddleware(
//   offlineForms,
//   keyPair.publicKey,
//   configDE1Table,
//   clearAllTables
// );

//DE1------------------------------------------------------------------------------
    const countLymphedemaLineList = async (userId) => {
        let Response = await offlineForms['lymphedemaLineList'].where('createdBy').equals(userId).count();
        return Response;
    };
    const addLymphedemaLineList = async (values) => {
      let Response = await offlineForms['lymphedemaLineList'].add(values);
      return Response;
    };
    const addLymphedemaLineListSurvey = async (values) => {
      let Response = await offlineForms['lymphedemaLineListSurvey'].add(values);
      return Response;
    };
    const addLymphedemaLineListFollowUpsLF = async (values) => {
      let Response = await offlineForms['lymphedemaLineListFollowUpsLF'].add(values);
      return Response;
    };
    const addLymphedemaLineListFollowUpsHF = async (values) => {
      let Response = await offlineForms['lymphedemaLineListFollowUpsHF'].add(values);
      return Response;
    };

    const getListLymphedemaLineList = async (userId) => {
        console.log("userId DE4 list",userId);
        let Response = await offlineForms['lymphedemaLineList'].where('createdBy').equals(userId).toArray();
        console.log("getList lymphedemaLineList",Response)
          return Response;
        };
    
    const getListLymphedemaLineListSurvey = async (id) => {
        console.log(id)
        let Response = await offlineForms['lymphedemaLineListSurvey'].where('lymphedemaLineListId').equals(id).toArray();
        console.log("getList lymphedemaLineListSurvey",Response)
          return Response;
    };
    
    const getListLymphedemaLineListFollowUpsLF = async (id) => {
            console.log(id)
            let Response = await offlineForms['lymphedemaLineListFollowUpsLF'].where('lymphedemaLineListId').equals(id).toArray();
            console.log("getList lymphedemaLineListFollowUpsLF",Response);
              return Response;
    };
    const getListLymphedemaLineListFollowUpsHF = async (id) => {
        console.log(id)
        let Response = await offlineForms['lymphedemaLineListFollowUpsHF'].where('lymphedemaLineListId').equals(id).toArray();
        console.log("getList lymphedemaLineListFollowUpsHF",Response);
          return Response;
    };

    const getAllListLymphedemaLineListSurvey = async () => {
      let Response = await offlineForms['lymphedemaLineListSurvey'].toArray();
      console.log("getAllList lymphedemaLineListSurvey",Response)
        return Response;
  };
  
  const getAllListLymphedemaLineListFollowUpsLF = async () => {
          let Response = await offlineForms['lymphedemaLineListFollowUpsLF'].toArray();
          console.log("getAllList lymphedemaLineListFollowUpsLF",Response);
            return Response;
  };
  const getAllListLymphedemaLineListFollowUpsHF = async () => {
      let Response = await offlineForms['lymphedemaLineListFollowUpsHF'].toArray();
      console.log("getAllList lymphedemaLineListFollowUpsHF",Response);
        return Response;
  };

    const getOneLymphedemaLineList = async (id) =>{
        let Response = await offlineForms['lymphedemaLineList'].get(id);
        console.log("getOne lymphedemaLineList",Response);
      return Response;
    }

    const getOneLymphedemaLineListSurvey = async (id) =>{
        let Response = await offlineForms['lymphedemaLineListSurvey'].get(id);
        console.log("getOne lymphedemaLineListSurvey",Response);
      return Response;
    }

    const getOneLymphedemaLineListFollowUpsLF = async (id) =>{
        let Response = await offlineForms['lymphedemaLineListFollowUpsLF'].get(id);
        console.log("getOne lymphedemaLineListFollowUpsLF",Response);
      return Response;
    }
    const getOneLymphedemaLineListFollowUpsHF = async (id) =>{
        let Response = await offlineForms['lymphedemaLineListFollowUpsHF'].get(id);
        console.log("getOne lymphedemaLineListFollowUpsHF",Response);
      return Response;
    }

    const updateLymphedemaLineList = async (id,values) => {
        let Response = await offlineForms['lymphedemaLineList'].update(id,values);
        console.log("update lymphedemaLineList",Response);
        return Response;
      };
    const updateLymphedemaLineListSurvey = async (id,values) => {
        let Response = await offlineForms['lymphedemaLineListSurvey'].update(id,values);
        console.log("update lymphedemaLineListSurvey",Response);
        return Response;
      };
    const updateLymphedemaLineListFollowUpsLF = async (id,values) => {
        let Response = await offlineForms['lymphedemaLineListFollowUpsLF'].update(id,values);
        console.log("update lymphedemaLineListFollowUpsLF",Response);
        return Response;
      };
    const updateLymphedemaLineListFollowUpsHF = async (id,values) => {
        let Response = await offlineForms['lymphedemaLineListFollowUpsHF'].update(id,values);
        console.log("update lymphedemaLineListFollowUpsHF",Response);
        return Response;
      };
    
      const deleteLymphedemaLineList = async (id) => {
        console.log("delete id offline lymphedemaLineList",id)
        let Response = await offlineForms['lymphedemaLineList'].where('lymphedemaLineListUUID').equals(id).delete();
        return Response;
      };

    const deleteLymphedemaLineListSurvey = async (id) => {
        console.log("delete id offline lymphedemaLineListSurvey",id)
        let Response = await offlineForms['lymphedemaLineListSurvey'].where('lymphedemaLineListSurveyUUID').equals(id).delete();
        return Response;
      };
    const deleteLymphedemaLineListFollowUpsLF = async (id) => {
        console.log("delete id offline lymphedemaLineListFollowUpsLF",id)
        let Response = await offlineForms['lymphedemaLineListFollowUpsLF'].where('lymphedemaLineListFollowUpsLFUUID').equals(id).delete();
        return Response;
      };
    const deleteLymphedemaLineListFollowUpsHF = async (id) => {
        console.log("delete id offline lymphedemaLineListFollowUpsHF",id)
        let Response = await offlineForms['lymphedemaLineListFollowUpsHF'].where('lymphedemaLineListFollowUpsHFUUID').equals(id).delete();
        return Response;
      };

      const deleteListLymphedemaLineListSurvey = async (id) => {
        console.log("delete id offline lymphedemaLineListSurvey",id)
        let Response = await offlineForms['lymphedemaLineListSurvey'].where('lymphedemaLineListId').equals(id).delete();
        return Response;
      };
    const deleteListLymphedemaLineListFollowUpsLF = async (id) => {
        console.log("delete id offline lymphedemaLineListFollowUpsLF",id)
        let Response = await offlineForms['lymphedemaLineListFollowUpsLF'].where('lymphedemaLineListId').equals(id).delete();
        return Response;
      };
    const deleteListLymphedemaLineListFollowUpsHF = async (id) => {
        console.log("delete id offline lymphedemaLineListFollowUpsHF",id)
        let Response = await offlineForms['lymphedemaLineListFollowUpsHF'].where('lymphedemaLineListId').equals(id).delete();
        return Response;
      };

    const deleteDE1LocalDB = async () => {
        Dexie.delete(DB_Name).then(() => {
            console.log("Offline Form Database successfully deleted");
        }).catch((err) => {
            console.error("Could not delete database",err);
        })
      };

    const lymphedemaLineListDraftServices = {
        countLymphedemaLineList,
        addLymphedemaLineList,
        addLymphedemaLineListSurvey,
        addLymphedemaLineListFollowUpsLF,
        addLymphedemaLineListFollowUpsHF,

        getListLymphedemaLineList,
        getListLymphedemaLineListFollowUpsHF,
        getListLymphedemaLineListFollowUpsLF,
        getListLymphedemaLineListSurvey,

        getAllListLymphedemaLineListFollowUpsHF,
        getAllListLymphedemaLineListFollowUpsLF,
        getAllListLymphedemaLineListSurvey,

        getOneLymphedemaLineList,
        getOneLymphedemaLineListFollowUpsHF,
        getOneLymphedemaLineListFollowUpsLF,
        getOneLymphedemaLineListSurvey,

        updateLymphedemaLineList,
        updateLymphedemaLineListFollowUpsHF,
        updateLymphedemaLineListFollowUpsLF,
        updateLymphedemaLineListSurvey,
        
        deleteLymphedemaLineList,
        deleteLymphedemaLineListFollowUpsHF,
        deleteLymphedemaLineListFollowUpsLF,
        deleteLymphedemaLineListSurvey,

        deleteListLymphedemaLineListFollowUpsHF,
        deleteListLymphedemaLineListFollowUpsLF,
        deleteListLymphedemaLineListSurvey,

        deleteDE1LocalDB,
    }

export default lymphedemaLineListDraftServices;