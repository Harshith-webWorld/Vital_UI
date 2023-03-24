import mappingOfOperationTheatersDraftServices from "../draftServices/FormMappingOfOTDraftServices";
import { post } from "../../helpers/fetchServicesMethods";
import { BASE_URL } from "../../helpers/config";

let url = BASE_URL + '/mappingOfOT/bulkCreate';

const syncDraftData = async(userId) => {
    console.log("userId",userId);
    const draftCountResponse = await mappingOfOperationTheatersDraftServices.countMappingOfOperationTheaters(userId);
    console.log("count",draftCountResponse)
    if(draftCountResponse > 0){
        const Draftresponse = await mappingOfOperationTheatersDraftServices.getAllMappingOfOperationTheaters(userId);
        console.log("draft list",draftCountResponse);
        if (Draftresponse.length > 0) {
            let Obj:any = {};
            console.log("obj", Obj)
            Obj.mappingOfOT = Draftresponse;
            const bulkCreateResult =  await post(url,Obj);
            console.log("bulk create result",bulkCreateResult);
            if(bulkCreateResult && bulkCreateResult.status === 200){
                const DraftEmptyresponse = await mappingOfOperationTheatersDraftServices.emptyMappingOfOperationTheaters(userId);
                console.log("empty",DraftEmptyresponse);
            }

        }
    }
}

let FormMappingofOTDraftSyncService ={
    syncDraftData
  };  

export default FormMappingofOTDraftSyncService;