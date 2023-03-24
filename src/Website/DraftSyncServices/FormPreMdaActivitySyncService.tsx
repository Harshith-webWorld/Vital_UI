import { post } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from '../../helpers/config';
import DexieOfflineFormPreMdaActivity from '../draftServices/FormPreMdaActivityDraft'
import { Default } from 'react-toastify/dist/utils';




let userInfo: any = {};
let step1BulkCreateResult: any;
let url1 = BASE_URL + '/preMDAActivity/bulkCreate';
//let url2 = BASE_URL + '/preMDAActivity/bulkCreatePreMDAActivityDrugLogistics';

const syncOfflineDataPreMdaActivity = async (userId) => {

  let countPreMdaResponse = await DexieOfflineFormPreMdaActivity.countPreMdaActvity(userId);
  if (countPreMdaResponse > 0) {
    let step1List = await DexieOfflineFormPreMdaActivity.getListPreMdaActivity(userId);
    let step2List = await DexieOfflineFormPreMdaActivity.getAllPreMdaActivityDrug();

    let Table = step1List.map((el) => {
      let Obj1: any = el;
      let Obj2: any = step2List.filter((step2) => {
        if (step2.preMDAActivityId ===   el.preMDAActivityUUID) {
          return step2;
        }
      })

      Obj1.preMDAActivityDrugLogistics = Obj2;

      return Obj1;
    })

    console.log("Table" , Table)
    const bulkAdd = Table.map((Obj1: any) => {
      Obj1 && Obj1.preMDAActivityDrugLogistics.forEach((Obj2: any) => {
        Obj2.preMDAActivityId = 0;
        // Obj2.preMDAActivityDrugLogistics.map((Obj3)=>{
        //   Obj3.preMDAActivityId=0;
        // })
      })
      return Obj1
    })

    step1BulkCreateResult = await post(url1, bulkAdd)
    if (step1BulkCreateResult && step1BulkCreateResult.data) {
      step1List.forEach(async (element) => {
        let id: any = element && element.preMDAActivityUUID
        const step1Delete = await DexieOfflineFormPreMdaActivity.deletePreMdaActivity(id);
        if (step1Delete) {
          const step2Delete = await DexieOfflineFormPreMdaActivity.deletePreMdaActivityDrug(id);
        }
      })
    }
    
  }
  return step1BulkCreateResult;
}


let FormPreMdaActivitySyncService = {
  syncOfflineData: syncOfflineDataPreMdaActivity
};
export default FormPreMdaActivitySyncService
