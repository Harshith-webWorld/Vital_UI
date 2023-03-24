import Dexie from 'dexie';
//set HTTPS=true&&set SSL_CRT_FILE=./.cert/cert.pem&&set SSL_KEY_FILE=./.cert/key.pem&&
import 'dexie-observable';
import { applyEncryptionMiddleware,clearAllTables,cryptoOptions } from 'dexie-encrypted';

const DB_Name = "Form_FSUTarget";
 export const offlineForms = new Dexie(DB_Name);
 const nacl = require("tweetnacl");

 const keyPair = nacl.sign.keyPair.fromSeed(new Uint8Array(32));

 offlineForms.version(2).stores({});
offlineForms.version(1).stores({
    fsuTargetAchievements:"++$$fsuTargetAchievementsUUID,createdBy",
    fsuTargetAchievementsSurveys:"++$$fsuTargetAchievementsSurveysUUID,fsuTargetAchievementId,createdBy",
})

const configDE12Table:any = {
    fsuTargetAchievements: cryptoOptions.NON_INDEXED_FIELDS,
    fsuTargetAchievementsSurveys:cryptoOptions.NON_INDEXED_FIELDS,
}
applyEncryptionMiddleware(
  offlineForms,
  keyPair.publicKey,
  configDE12Table,
  clearAllTables
);

//DE4------------------------------------------------------------------------------
const countFsuTargetAchievements = async (userId) => {
    let Response = await offlineForms['fsuTargetAchievements'].where('createdBy').equals(userId).count();
    return Response;
  };
  const addFsuTargetAchievements = async (values) => {
      let Response = await offlineForms['fsuTargetAchievements'].add(values);
      return Response;
    };
    const addFsuTargetAchievementsSurveys = async (values) => {
      let Response = await offlineForms['fsuTargetAchievementsSurveys'].add(values);
      return Response;
    };
  
    const getListFsuTargetAchievements = async (userId) => {
      console.log("userId DE12 list",userId);
      let Response = await offlineForms['fsuTargetAchievements'].where('createdBy').equals(userId).toArray();
      console.log("getList fsuTargetAchievements",Response)
        return Response;
      };
  
    const getListFsuTargetAchievementsSurveys = async (id) => {
      console.log(id)
      let Response = await offlineForms['fsuTargetAchievementsSurveys'].where('fsuTargetAchievementId').equals(id).toArray();
      console.log("getList fsuTargetAchievementsSurveys",Response)
        return Response;
      };

      const getAllListFsuTargetAchievementsSurveys = async () => {
        let Response = await offlineForms['fsuTargetAchievementsSurveys'].toArray();
        console.log("getList fsuTargetAchievementsSurveys",Response)
          return Response;
        };
  
      const getOneFsuTargetAchievements = async (id) =>{
          let Response = await offlineForms['fsuTargetAchievements'].get(id);
          console.log("getOne fsuTargetAchievements",Response)
        return Response;
      }
  
      const getOneFsuTargetAchievementsSurveys = async (id) =>{
          let Response = await offlineForms['fsuTargetAchievementsSurveys'].get(id);
          console.log("getOne fsuTargetAchievementsSurveys",Response)
        return Response;
      }
  
      const updateFsuTargetAchievements = async (id,values) => {
          let Response = await offlineForms['fsuTargetAchievements'].update(id,values);
          console.log("update fsuTargetAchievements",Response)
          return Response;
        };
      const updateFsuTargetAchievementsSurveys = async (id,values) => {
          let Response = await offlineForms['fsuTargetAchievementsSurveys'].update(id,values);
          console.log("update fsuTargetAchievementsSurveys",Response)
          return Response;
        };
  
      const deleteFsuTargetAchievements = async (id) => {
          let Response = await offlineForms['fsuTargetAchievements'].where('fsuTargetAchievementsUUID').equals(id).delete();
          return Response;
        };
      const deleteFsuTargetAchievementsSurveys = async (id) => {
          let Response = await offlineForms['fsuTargetAchievementsSurveys'].where('fsuTargetAchievementsSurveysUUID').equals(id).delete();
          return Response;
        };
  
      const deleteGetListFsuTargetAchievementsSurveys = async (id) => {
          console.log(id)
          let Response = await offlineForms['fsuTargetAchievementsSurveys'].where('fsuTargetAchievementId').equals(id).delete();
          console.log("getList Regular",Response)
            return Response;
      };
  
      const emptyFsuTargetAchievements = async (id) => {
          let Response = await offlineForms['fsuTargetAchievements'].where('createdBy').equals(id).delete();
          return Response;
        };

        const deleteDE12LocalDB = async () => {
            Dexie.delete(DB_Name).then(() => {
                console.log("Offline Form Database successfully deleted");
            }).catch((err) => {
                console.error("Could not delete database",err);
            })
          };

const fsuTargetDraftServices = {
    countFsuTargetAchievements,
    addFsuTargetAchievements,
    addFsuTargetAchievementsSurveys,

    getListFsuTargetAchievements,
    getListFsuTargetAchievementsSurveys,
    getAllListFsuTargetAchievementsSurveys,

    getOneFsuTargetAchievements,
    getOneFsuTargetAchievementsSurveys,

    updateFsuTargetAchievements,
    updateFsuTargetAchievementsSurveys,

    deleteFsuTargetAchievements,
    deleteFsuTargetAchievementsSurveys,

    deleteGetListFsuTargetAchievementsSurveys,
    emptyFsuTargetAchievements,

    deleteDE12LocalDB

}

export default fsuTargetDraftServices;