import VerticalUnitStockDraftServices from "../draftServices/FormVerticalUnitStockDraftServices";
import { post } from "../../helpers/fetchServicesMethods";
import { BASE_URL } from "../../helpers/config";

let url = BASE_URL + '/verticalUnit/bulkcreate';

const syncDraftData = async(userId) => {
    console.log("userId",userId);
    const draftCountResponse = await VerticalUnitStockDraftServices.countVerticalUnitStock(userId);
    console.log("count",draftCountResponse)
    if(draftCountResponse > 0){
        const Draftresponse = await VerticalUnitStockDraftServices.getAllVerticalUnitStock(userId);
        console.log("draft list",Draftresponse);
        if (Draftresponse.length > 0) {
            let Obj:any = {};
            Obj.verticalStockid = Draftresponse;
            const bulkCreateResult =  await post(url,Obj);
            console.log("bulk create result",bulkCreateResult);
            if(bulkCreateResult && bulkCreateResult.status === 200){
                const DraftEmptyresponse = await VerticalUnitStockDraftServices.emptyVerticalUnitStock(userId);
                console.log("empty",DraftEmptyresponse);
            }
        }
    }
}

let FormVerticalUnitStockDraftSyncService ={
    syncDraftData
  };  
export default FormVerticalUnitStockDraftSyncService;