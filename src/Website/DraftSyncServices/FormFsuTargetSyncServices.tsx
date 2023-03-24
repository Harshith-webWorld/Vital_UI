import fsuTargetDraftServices from '../draftServices/FormFsuTargetDraftServices';
import { post } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from '../../helpers/config';

let step1BulkCreateResult:any;
const url1 = BASE_URL + '/fsuTarget/bulkCreateFsuTargetAchivements';

const SyncOfflineData = async(userId) => {

    let countStep1Response = await fsuTargetDraftServices.countFsuTargetAchievements(userId);
    if(countStep1Response > 0){
        const step1List = await fsuTargetDraftServices.getListFsuTargetAchievements(userId);
        const step2List = await fsuTargetDraftServices.getAllListFsuTargetAchievementsSurveys();

        let table = step1List.map((el)=>{
            let Obj:any = el;
            let Obj2 = step2List.filter((step2)=>{
              if(step2.fsuTargetAchievementId === el.fsuTargetAchievementsUUID){
                return step2;
              }
            })
            Obj.fsuTargetAchievementsSurveys = Obj2;
            return Obj;
        })
        console.log("tabel",table);
        const bulkAdd = table.map((Obj:any)=>{
            Obj && Obj.fsuTargetAchievementsSurveys && Obj.fsuTargetAchievementsSurveys.forEach((Obj2:any)=>{
              Obj2.fsuTargetAchievementId = 0;
            })
            return Obj;
        })
        console.log("bulkAdd",bulkAdd);
        step1BulkCreateResult =  await post(url1,bulkAdd)
        console.log("mdaBulkCreateResponse1111",step1BulkCreateResult);
        if(step1BulkCreateResult && step1BulkCreateResult.data){
            step1List.forEach(async(element) => {
                let id = element && element.fsuTargetAchievementsUUID;
                const step1Delete = await fsuTargetDraftServices.deleteFsuTargetAchievements(id);
                if(step1Delete){
                  const step2Delete = await fsuTargetDraftServices.deleteGetListFsuTargetAchievementsSurveys(id);
                }
              });
        }
        return step1BulkCreateResult;
          
    }

}

const FormFsuTargetSyncService ={ 
    syncOfflineData: SyncOfflineData
  };  

export default FormFsuTargetSyncService;