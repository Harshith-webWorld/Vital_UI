import mdaIecActivityDraftServices from "../draftServices/FormMdaIecActivityDraftServices";
import { post } from "../../helpers/fetchServicesMethods";
import { BASE_URL } from "../../helpers/config";

let url = BASE_URL + '/mdaActivity/bulkcreate';

const syncDraftData = async(userId) => {
    console.log("userId",userId);
    const draftCountResponse = await mdaIecActivityDraftServices.countMdaIecActivity(userId);
    console.log("count",draftCountResponse)
    if(draftCountResponse > 0){
        const Draftresponse = await mdaIecActivityDraftServices.getAllMdaIecActivity(userId);
        console.log("draft list",draftCountResponse);
        if (Draftresponse.length > 0) {
            let Obj:any = {};
            Obj.mdaIecActivityid = Draftresponse;
            const bulkCreateResult =  await post(url,Obj);
            console.log("bulk create result",bulkCreateResult);
            if(bulkCreateResult && bulkCreateResult.status === 200){
                const DraftEmptyresponse = await mdaIecActivityDraftServices.emptyMdaIecActivity(userId);
                console.log("empty",DraftEmptyresponse);
            }

        }
    }
}

let FormMdaIecActivityDraftSyncService ={
    syncDraftData
  };  

  


export default FormMdaIecActivityDraftSyncService;