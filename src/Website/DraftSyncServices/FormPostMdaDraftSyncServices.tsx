import AddPostMdaDraftServices from "../draftServices/FormAddPostMdaDraftServices";
import { post } from "../../helpers/fetchServicesMethods";
import { BASE_URL } from "../../helpers/config";

let url = BASE_URL + '/PostMDAEvalList/bulkcreate';

const syncDraftData = async(userId) => {
    console.log("userId",userId);
    const draftCountResponse = await AddPostMdaDraftServices.countPostMdaEval(userId);
    console.log("count",draftCountResponse)
    if(draftCountResponse > 0){
        const Draftresponse = await AddPostMdaDraftServices.getListPostMdaEvaly(userId);
        console.log("draft list",Draftresponse);
        if (Draftresponse.length > 0) {
            let Obj:any = {};
            Obj.postMdaEvaId = Draftresponse;
            const bulkCreateResult =  await post(url,Obj);
            console.log("bulk create result",bulkCreateResult);
            if(bulkCreateResult && bulkCreateResult.status === 200){
                const DraftEmptyresponse = await AddPostMdaDraftServices.emptyPostMdaEval(userId);
                console.log("empty",DraftEmptyresponse);
            }
        }
    }
}

let FormPostMdaDraftSyncServices ={
    syncDraftData
  };  
export default FormPostMdaDraftSyncServices;