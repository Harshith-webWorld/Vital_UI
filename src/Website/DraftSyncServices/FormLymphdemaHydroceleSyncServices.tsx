import { post } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from '../../helpers/config';
import lymphedemaLineListDraftServices from '../draftServices/FormLymphdemaHydroceleDraftServices';

let step1BulkCreateResult:any;
const url1 = BASE_URL + '/lymphedemaLineList/bulkcreate';

const SyncOfflineData = async(userId) => { 

    let countStep1Response = await lymphedemaLineListDraftServices.countLymphedemaLineList(userId);
    if(countStep1Response > 0){
        const step1List = await lymphedemaLineListDraftServices.getListLymphedemaLineList(userId);
        const step2List = await lymphedemaLineListDraftServices.getAllListLymphedemaLineListSurvey();
        const step3List = await lymphedemaLineListDraftServices.getAllListLymphedemaLineListFollowUpsLF();
        const step4List = await lymphedemaLineListDraftServices.getAllListLymphedemaLineListFollowUpsHF();

        let table = step1List.map((el)=>{
            let Obj:any = el;
            let Obj2 = step2List.filter((step2)=>{
              if(step2.lymphedemaLineListId === el.lymphedemaLineListUUID){
                return step2;
              }
            })
            let Obj3 = step3List.filter((step3)=>{
                if(step3.lymphedemaLineListId === el.lymphedemaLineListUUID){
                    return step3;
                }
            })
            let Obj4 = step4List.filter((step4)=>{
                if(step4.lymphedemaLineListId === el.lymphedemaLineListUUID){
                    return step4;
                }
            })
            Obj.LymphedemaLineListSurveys = Obj2;
            Obj.LymphedemaLineListFollowUpsLFs = Obj3;
            Obj.LymphedemaLineListFollowUpsHFs = Obj4;
            return Obj;
        })
        console.log("tabel",table);
        const bulkAdd = table.map((Obj:any)=>{
            Obj && Obj.LymphedemaLineListSurveys && Obj.LymphedemaLineListSurveys.forEach((Obj2:any)=>{
              Obj2.lymphedemaLineListId = 0;
            })
            Obj && Obj.LymphedemaLineListFollowUpsLFs && Obj.LymphedemaLineListFollowUpsLFs.forEach((Obj2:any)=>{
                Obj2.lymphedemaLineListId = 0;
            })
              Obj && Obj.LymphedemaLineListFollowUpsHFs && Obj.LymphedemaLineListFollowUpsHFs.forEach((Obj2:any)=>{
                Obj2.lymphedemaLineListId = 0;
            })
            return Obj;
        })
        let bulkAddObj:any = {};
        bulkAddObj.LymphedemaLineList = bulkAdd;
        console.log("bulkAdd",bulkAdd);
        step1BulkCreateResult =  await post(url1,bulkAddObj)
        console.log("mdaBulkCreateResponse1111",step1BulkCreateResult);
        if(step1BulkCreateResult && step1BulkCreateResult.data){
            step1List.forEach(async(element) => {
                let id = element && element.lymphedemaLineListUUID;
                const step1Delete = await lymphedemaLineListDraftServices.deleteLymphedemaLineList(id);
                if(step1Delete){
                    const step2Delete = await lymphedemaLineListDraftServices.deleteListLymphedemaLineListSurvey(id);
                    const step3Delete = await lymphedemaLineListDraftServices.deleteListLymphedemaLineListFollowUpsLF(id);
                    const step4Delete = await lymphedemaLineListDraftServices.deleteListLymphedemaLineListFollowUpsHF(id);
                }
            });
        }
        return step1BulkCreateResult;
    }

}

const FormLymphedemaHydroceleSyncService ={ 
    syncOfflineData: SyncOfflineData
  };  

export default FormLymphedemaHydroceleSyncService;