import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import { applyEncryptionMiddleware,clearAllTables,cryptoOptions } from 'dexie-encrypted';

const DB_Name = "Form_MdaIdaCoverages";
 export const offlineForms = new Dexie(DB_Name);
 const nacl = require("tweetnacl");

 const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

 offlineForms.version(2).stores({});
offlineForms.version(1).stores({
    mdaIdaCoverages:"++$$mdaIDACoveragesUUID,createdBy",
    mdaIdaRegular:"++$$mdaIdaRegularUUID,mdaIDACoverageId,createdBy",
    mdaIdaMopUp:"++$$mdaIdaMopUpUUID,mdaIDACoverageId,createdBy",
})

const configDE4Table:any = {
  mdaIdaCoverages: cryptoOptions.NON_INDEXED_FIELDS,
  mdaIdaRegular:cryptoOptions.NON_INDEXED_FIELDS,
  mdaIdaMopUp:cryptoOptions.NON_INDEXED_FIELDS,
}
applyEncryptionMiddleware(
  offlineForms,
  keyPair.publicKey,
  configDE4Table,
  clearAllTables
);

//DE4------------------------------------------------------------------------------
const countMdaCoverageReport = async (userId) => {
    let Response = await offlineForms['mdaIdaCoverages'].where('createdBy').equals(userId).count();
    return Response;
  };
  const addMdaIdaCoverages = async (values) => {
      let Response = await offlineForms['mdaIdaCoverages'].add(values);
      return Response;
    };
    const addMdaIdaRegular = async (values) => {
      let Response = await offlineForms['mdaIdaRegular'].add(values);
      return Response;
    };
    const addMdaIdaMopUp = async (values) => {
      let Response = await offlineForms['mdaIdaMopUp'].add(values);
      return Response;
    };
  
    const getListMdaIdaCoverages = async (userId) => {
      console.log("userId DE4 list",userId);
      let Response = await offlineForms['mdaIdaCoverages'].where('createdBy').equals(userId).toArray();
      console.log("getList Coverages",Response)
        return Response;
      };

      const getAllListMdaIdaCoveragesRegular = async () => {
        let Response = await offlineForms['mdaIdaRegular'].toArray();
          return Response;
        };

        const getAllListMdaIdaCoveragesMopUp = async () => {
          let Response = await offlineForms['mdaIdaMopUp'].toArray();
            return Response;
          };
  
    const getListMdaIdaRegular = async (id) => {
      console.log(id)
      let Response = await offlineForms['mdaIdaRegular'].where('mdaIDACoverageId').equals(id).toArray();
      console.log("getList Regular",Response)
        return Response;
      };
  
      const getListMdaIdaMopUp = async (id) => {
          console.log(id)
          let Response = await offlineForms['mdaIdaMopUp'].where('mdaIDACoverageId').equals(id).toArray();
          console.log("getList MopUp",Response);
            return Response;
      };
  
      const getOneMdaIdaCoverages = async (id) =>{
          let Response = await offlineForms['mdaIdaCoverages'].get(id);
          console.log("getOne Coverages",Response)
        return Response;
      }
  
      const getOneMdaIdaRegular = async (id) =>{
          let Response = await offlineForms['mdaIdaRegular'].get(id);
          console.log("getOne regular",Response)
        return Response;
      }
  
      const getOneMdaIdaMopUp = async (id) =>{
          let Response = await offlineForms['mdaIdaMopUp'].get(id);
          console.log("getOne mopup",Response)
        return Response;
      }
  
      const updateMdaIdaCoverages = async (id,values) => {
          let Response = await offlineForms['mdaIdaCoverages'].update(id,values);
          console.log("update mopup",Response)
          return Response;
        };
      const updateMdaIdaRegular = async (id,values) => {
          let Response = await offlineForms['mdaIdaRegular'].update(id,values);
          console.log("update mopup",Response)
          return Response;
        };
      const updateMdaIdaMopUp = async (id,values) => {
          let Response = await offlineForms['mdaIdaMopUp'].update(id,values);
          console.log("update mopup",Response)
          return Response;
        };
  
      const deleteMdaIdaCoverages = async (id) => {
          console.log("delete id offline mdaActivity",id)
          let Response = await offlineForms['mdaIdaCoverages'].where('mdaIDACoveragesUUID').equals(id).delete();
          return Response;
        };
      const deleteMdaIdaRegular = async (id) => {
          console.log("delete id offline mdaActivity",id)
          let Response = await offlineForms['mdaIdaRegular'].where('mdaIdaRegularUUID').equals(id).delete();
          return Response;
        };
      const deleteMdaIdaMopUp = async (id) => {
          console.log("delete id offline mdaActivity",id)
          let Response = await offlineForms['mdaIdaMopUp'].where('mdaIdaMopUpUUID').equals(id).delete();
          return Response;
        };
  
      const deleteGetListMdaIdaRegular = async (id) => {
          console.log(id)
          let Response = await offlineForms['mdaIdaRegular'].where('mdaIDACoverageId').equals(id).delete();
          console.log("getList Regular",Response)
            return Response;
      };
      
      const deleteGetListMdaIdaMopUp = async (id) => {
          console.log(id)
          let Response = await offlineForms['mdaIdaMopUp'].where('mdaIDACoverageId').equals(id).delete();
          console.log("getList MopUp",Response);
            return Response;
      };
  
      const emptyMdaIDACoverageActivity = async (id) => {
          let Response = await offlineForms['mdaIdaCoverages'].where('createdBy').equals(id).delete();
          return Response;
        };
      const emptyStep3Store = async () => {
          let Response = await offlineForms['mdaIdaMopUp'].clear();
          return Response;
        };
     const emptyStep2Store = async () => {
          let Response = await offlineForms['mdaIdaRegular'].clear();
          return Response;
        };

        const deleteOfflineFormsDB = async () => {
            Dexie.delete(DB_Name).then(() => {
                console.log("Offline Form Database successfully deleted");
            }).catch((err) => {
                console.error("Could not delete database",err);
            })
          };

const mdaIdaCoveragesDraftServices = {
        
            addMdaIdaCoverages,
            addMdaIdaRegular,
            addMdaIdaMopUp,
            getListMdaIdaRegular,
            getListMdaIdaMopUp,
            getListMdaIdaCoverages,
            getAllListMdaIdaCoveragesRegular,
            getAllListMdaIdaCoveragesMopUp,
            getOneMdaIdaCoverages,
            getOneMdaIdaRegular,
            getOneMdaIdaMopUp,
            updateMdaIdaCoverages,
            updateMdaIdaRegular,
            updateMdaIdaMopUp,
            deleteMdaIdaCoverages,
            deleteMdaIdaRegular,
            deleteMdaIdaMopUp,
            deleteGetListMdaIdaRegular,
            deleteGetListMdaIdaMopUp,
            countMdaCoverageReport,
            emptyMdaIDACoverageActivity,
            deleteOfflineFormsDB,
            emptyStep3Store,
            emptyStep2Store
        }

export default mdaIdaCoveragesDraftServices;