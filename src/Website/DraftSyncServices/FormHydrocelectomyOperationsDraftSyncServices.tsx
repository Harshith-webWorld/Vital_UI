import HydrocelectomyOperationsDraftService from "../draftServices/FormHydrocelectomyOperationsDraftService";
import { post } from "../../helpers/fetchServicesMethods";
import { BASE_URL } from "../../helpers/config";

let url = BASE_URL + '/hydrocelectomyOperations/bulkCreate';

const syncDraftData = async(userId) => {
    console.log("userId",userId);
    const draftCountResponse = await HydrocelectomyOperationsDraftService.countHydrocelectomyOperations(userId);
    console.log("count",draftCountResponse)
    if(draftCountResponse > 0){
        const Draftresponse = await HydrocelectomyOperationsDraftService.getAllHydrocelectomyOperations(userId);
        console.log("draft list",Draftresponse);
        Draftresponse.forEach(item => {
            delete item["HydrocelectomyOperationsUUID"];
            delete item["status"];
            delete item["stateId"];
        })
        if (Draftresponse.length > 0) {
            let Obj:any = {};
            Obj.hydrocelectomyOperations = Draftresponse;
            const bulkCreateResult =  await post(url,Obj);
            console.log("bulk create result",bulkCreateResult);
            if(bulkCreateResult && bulkCreateResult.status === 200){
                const DraftEmptyresponse = await HydrocelectomyOperationsDraftService.emptyHydrocelectomyOperations(userId);
                console.log("empty",DraftEmptyresponse);
            }
        }
    }
}

let FormHydrocelectomyOperationsDraftService ={
    syncDraftData
  };  
export default FormHydrocelectomyOperationsDraftService;