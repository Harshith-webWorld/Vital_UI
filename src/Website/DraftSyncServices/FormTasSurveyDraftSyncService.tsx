import { post } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from '../../helpers/config';
import DexieOfflineFormTasSurvey from '../draftServices/FormTasSurveyDraftService';




let userInfo: any = {};
let step1BulkCreateResult: any;
let url1 = BASE_URL + '/tassurvey/bulkCreate';


const syncOfflineDataPreMdaActivity = async (userId) => {

  let countPreMdaResponse = await DexieOfflineFormTasSurvey.countTasSurvey(userId);
  if (countPreMdaResponse > 0) {
    let step1List = await DexieOfflineFormTasSurvey.getListTasSurvey(userId);
    let step2List = await DexieOfflineFormTasSurvey.getAllTasSurveyChild();

    let Table = step1List.map((el) => {
      let Obj1: any = el;
      let Obj2: any = step2List.filter((step2) => {
        if (el.tasSurveyUUID === step2.tasSurveyId) {
          return step2;
        }
      })

      Obj1.tasSurveyChildrens = Obj2;

      return Obj1;
    })

    console.log("Table" , Table)
    const bulkAdd = Table.map((Obj1: any) => {
      Obj1 && Obj1.tasSurveyChildrens.forEach((Obj3: any) => {
        Obj3.tasSurveyId = 0;
      })
      return Obj1
    })

    step1BulkCreateResult = await post(url1, bulkAdd)
    if (step1BulkCreateResult && step1BulkCreateResult.data) {
      step1List.forEach(async (element) => {
        let id: any = element && element.tasSurveyUUID
        const step1Delete = await DexieOfflineFormTasSurvey.deleteTasSurvey(id);
        if (step1Delete) {
          const step2Delete = await DexieOfflineFormTasSurvey.deleteTasSurveyChild(id);
        }
      });
    }
    
  }
  return step1BulkCreateResult;
}


let FormTasSurveyDraftSyncService = {
  syncOfflineData: syncOfflineDataPreMdaActivity
};
export default FormTasSurveyDraftSyncService
