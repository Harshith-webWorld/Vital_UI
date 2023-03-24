import entomologicalDraftServices from "../draftServices/FormEntomologicalDraftservice";
import { post } from "../../helpers/fetchServicesMethods";
import { BASE_URL } from "../../helpers/config";

let url = BASE_URL + '/entomologicalLarvical/bulkCreate';

const syncDraftData = async(userId) => {
    console.log("userId",userId);
    const draftCountResponse = await entomologicalDraftServices.countEntomological(userId);
    console.log("count",draftCountResponse)
    if(draftCountResponse > 0){
        const Draftresponse = await entomologicalDraftServices.getAllEntomological(userId);
        console.log("draft list",Draftresponse);
        if (Draftresponse.length > 0) {
            let Obj:any = {};
            Obj.entomologicalId = Draftresponse;
            const bulkCreateResult =  await post(url,Obj);
            console.log("bulk create result",bulkCreateResult);
            if(bulkCreateResult && bulkCreateResult.status === 200){
                const DraftEmptyresponse = await entomologicalDraftServices.emptyEntomological(userId);
                console.log("empty",DraftEmptyresponse);
            }
        }
    }
}

let FormEntomologicalDraftSyncService ={
    syncDraftData
  };  
export default FormEntomologicalDraftSyncService;