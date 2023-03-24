import {post,put,deleteService,get} from '../../helpers/fetchServicesMethods';
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";
import {objectToQueryString} from './utils';

async function postFusTarget(data:any) {
    let url= BASE_URL+ENDPOINT.FSU_TARGET_STEPPER_ONE;
    try{
        return await post(url,data)
    .then((response) => {
        //console.log("data::",data)
        return response;
    })
    .catch((error) => {
        console.log("error::", error);
    });

} catch (error) {
console.error(error);
}
}    
async function getFusTarget(params: any){
    let url= BASE_URL+ENDPOINT.FSU_TARGET_LIST_STEPPER_ONE;
    if(params){
        url = url + `?${objectToQueryString(params)}`
    }
    
    try{
        return await get(url)
        .then((response) =>{
        console.log("get::",response)
        return response;
        })
        .catch((error) =>{
        console.log("error::",error);
        });
    }catch(error){
        console.error(error);
    }
}
async function getOneFusTarget(id){
    // let url= BASE_URL+ENDPOINT.FSU_TARGET_LIST_STEPPER_ONE;
    try{
        return await get((BASE_URL) + `/fsuTarget/getoneFsuTargetAchivements?id=${id}`)
        .then((response) =>{
        console.log("get::",response)
        return response;
        })
        .catch((error) =>{
        console.log("error::",error);
        });
    }catch(error){
        console.error(error);
    }
}
async function updateFusTarget(data:any,id:any){
    let url= BASE_URL+ENDPOINT.FSU_TARGET_UPDATE_STEPPER_ONE+`/?id=${id}`;
    try{
        return await put(url,data)
        .then((response) =>{
        console.log("update",response)
        return response;
        })
        .catch((error) =>{
        console.log("error::",error);
        });
    }catch(error){
        console.error(error);
    }   
}
async function deleteFusTarget(id:any){
  let url= BASE_URL+ENDPOINT.FSU_TARGET_DELETE_STEPPER_ONE+"/?id="+id;
    try{
        return await deleteService(url)
        .then((response) =>{
        console.log("update",response)
        return response;
        })
        .catch((error) =>{
        console.log("error::",error);
        });
    }catch(error){
        console.error(error);
    }   
}
async function postFsuSurveyDetails(data:any) {
    let url= BASE_URL+ENDPOINT.FSU_TARGET_STEPPER_TWO;
    try{
        return await post(url,data)
    .then((response) => {
        //console.log("data::",data)
        return response;
    })
    .catch((error) => {
        console.log("error::", error);
    });

} catch (error) {
console.error(error);
}
}    
async function getFusTargetStepper(){
    let url= BASE_URL+ENDPOINT.FSU_TARGET_LIST_STEPPER_TWO;
    try{
        return await get(url)
        .then((response) =>{
        console.log("get::",response)
        return response;
        })
        .catch((error) =>{
        console.log("error::",error);
        });
    }catch(error){
        console.error(error);
    }
}
async function getOneFusTargetStepper(id){
    // let url= BASE_URL+ENDPOINT.FSU_TARGET_LIST_STEPPER_TWO;
    try{
        return await get((BASE_URL) + `/fsuTarget/getoneFsuTargetAchievementsSurveys?fsuTargetAchievementId=${id}`)
        .then((response) =>{
        console.log("get::",response)
        return response;
        })
        .catch((error) =>{
        console.log("error::",error);
        });
    }catch(error){
        console.error(error);
    }
}
async function updateFusTargetStepper(data:any,id:any){
    let url= BASE_URL+ENDPOINT.FSU_TARGET_UPDATE_STEPPER_TWO+`/?id=${id}`;
    try{
        return await put(url,data)
        .then((response) =>{
        console.log("update",response)
        return response;
        })
        .catch((error) =>{
        console.log("error::",error);
        });
    }catch(error){
        console.error(error);
    }   
}

async function deleteFusTargetStepper(id:any){
    let url= BASE_URL+ENDPOINT.FSU_TARGET_DELETE_STEPPER_TWO+"/?id="+id;
      try{
          return await deleteService(url)
          .then((response) =>{
          console.log("update",response)
          return response;
          })
          .catch((error) =>{
          console.log("error::",error);
          });
      }catch(error){
          console.error(error);
      }   
  }

const FusTarget={
    postFusTarget,
    getFusTarget,
    updateFusTarget,
    deleteFusTarget,
    getOneFusTarget,
    postFsuSurveyDetails,
    getFusTargetStepper,
    updateFusTargetStepper,
    getOneFusTargetStepper,
    deleteFusTargetStepper


}
export default FusTarget;