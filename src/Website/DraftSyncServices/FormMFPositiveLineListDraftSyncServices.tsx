import { post } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from '../../helpers/config';
import mfPositiveDraftServices from '../draftServices/FormMFPositiveDraftServices';

let step1BulkCreateResult:any;
const url1 = BASE_URL + '/mfPositive/bulkcreateMfPositiveLineList';

const SyncOfflineData = async(userId) => { 

    let countStep1Response = await mfPositiveDraftServices.countMFPositiveLineList(userId);
    if(countStep1Response > 0){
        const step1List = await mfPositiveDraftServices.getListMFPositiveLineList(userId);
        const step3List = await mfPositiveDraftServices.getAllListMFPositiveLineListPatients();
        const step4List = await mfPositiveDraftServices.getAllListMFPositiveLineListBSFollowUps();

        let table = step1List.map((el)=>{
            let Obj:any = el;
            let Obj3 = step3List.filter((step3)=>{
                if(step3.mfPositiveLineListId === el.mfPositiveLineListUUID){
                    return step3;
                }
            })
            let Obj4 = step4List.filter((step4)=>{
                if(step4.mfPositiveLineListId === el.mfPositiveLineListUUID){
                    return step4;
                }
            })
            Obj.mfPositiveLineListSurveys = el && el.surveyInfo;
            Obj.mfPositiveLineListPatients = Obj3;
            Obj.mfPositiveLineListBSFollowUps = Obj4;
            return Obj;
        })
        const bulkAdd = table.map((Obj:any)=>{
            Obj && Obj.mfPositiveLineListPatients && Obj.mfPositiveLineListPatients.forEach((Obj2:any)=>{
                Obj2.mfPositiveLineListId = 0;
            })
              Obj && Obj.mfPositiveLineListBSFollowUps && Obj.mfPositiveLineListBSFollowUps.forEach((Obj2:any)=>{
                Obj2.mfPositiveLineListId = 0;
            })
            return Obj;
        })
        let bulkAddObj:any = {};
        bulkAddObj.mfPositiveLineList = bulkAdd;
        step1BulkCreateResult =  await post(url1,bulkAddObj)
        if(step1BulkCreateResult && step1BulkCreateResult.data){
            step1List.forEach(async(element) => {
                let id = element && element.mfPositiveLineListUUID;
                const step1Delete = await mfPositiveDraftServices.deleteMFPositiveLineList(id);
                if(step1Delete){
                    const step3Delete = await mfPositiveDraftServices.deleteListMFPositiveLineListPatients(id);
                    const step4Delete = await mfPositiveDraftServices.deleteListMFPositiveLineListBSFollowUps(id);
                }
            });
        }
        return step1BulkCreateResult;
    }

}

const FormMFPositiveLineListSyncService ={ 
    syncOfflineData: SyncOfflineData
  };  

export default FormMFPositiveLineListSyncService;