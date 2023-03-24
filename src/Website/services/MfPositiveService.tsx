import {post,put,deleteService,get}from '../../helpers/fetchServicesMethods';
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";

let  objectToQueryString = (obj) => {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }
  

async function getMfPositiveList(params: any) {
    let url = BASE_URL + ENDPOINT.MFPOSITIVE_LIST;
    if(params){
        url = url + `?${objectToQueryString(params)}`
      }
    try {
        return await get(url)
            .then((response) => {
                return response;
                
            })
            .catch((error) => {
                console.log("error::", error);
            });

    } catch (error) {
        console.error(error);
    }

}
async function getOneMfPositiveList(FieldUnitId) {
    let url = BASE_URL + ENDPOINT.MFPOSITIVE_LIST+"/"+FieldUnitId;
    try {
      return await get(url)
        .then((response) => {
          return response;
        })
        .catch((error) => {
          console.log("error::", error);
        });
    } catch (error) {
      console.error(error);
    }
  }
async function postMfPositiveList(data:any){
    let url=BASE_URL+ENDPOINT.MFPOSITIVE_CREATE;
    try{
        return await post(url,data)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){
        console.error(error);
        
    }
}

async function createAllMfPositiveList(data:any){
    let url=BASE_URL+ENDPOINT.MFPOSITIVE_CREATE_ALL;
    try{
        return await post(url,data)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){
        console.error(error);
        
    }
}


async function updateMfPositiveList(data:any,id:any){
    let url = BASE_URL+ENDPOINT.MFPOSITIVE_UPDATE+"/"+id;
    
    try{
        return await put(url,data)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){

        console.log(error)
    }
}

async function deleteMfPositiveList(id:any){
    let url= BASE_URL+ENDPOINT.MFPOSITIVE_DELETE+"/?id="+id;
    try{

        return await deleteService(url)
        .then((response)=>{
            console.log(response)
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){
        console.log(error)
    }

}


async function getMfPositiveSurveyList(fieldUnitId) {
    let url = BASE_URL + ENDPOINT.MFPOSITIVE_SURVEY_LIST+"/"+fieldUnitId;
    try {
        return await get(url)
            .then((response) => {
                return response;
                
            })
            .catch((error) => {
                console.log("error::", error);
            });

    } catch (error) {
        console.error(error);
    }

}

async function postMfPositiveSurveyList(data:any,fieldUnitId){
    let url=BASE_URL+ENDPOINT.MFPOSITIVE_SURVEY_CREATE+"/"+fieldUnitId;
    try{
        return await post(url,data)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){
        console.error(error);
        
    }
}


async function updateMfPositiveSurveyList(data:any,id:any){
    let url = BASE_URL+ENDPOINT.MFPOSITIVE_SURVEY_UPDATE+"/"+id;
    try{
        return await put(url,data)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){

        console.log(error)
    }
}

async function deleteMfPositiveSurveyList(id:any){
    let url= BASE_URL+ENDPOINT.MFPOSITIVE_SURVEY_DELETE+"/?id="+id;
    try{

        return await deleteService(url)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){
        console.log(error)
    }

}

async function getMfPositivePatientList(fieldunitId) {
    let url = BASE_URL + ENDPOINT.MFPOSITIVE_PATIENT_LIST+"/"+fieldunitId;
    try {
        return await get(url)
            .then((response) => {
                return response;
                
            })
            .catch((error) => {
                console.log("error::", error);
            });

    } catch (error) {
        console.error(error);
    }

}

async function postMfPositivePatientList(data:any){
    let url=BASE_URL+ENDPOINT.MFPOSITIVE_PATIENT_CREATE;
    try{
        return await post(url,data)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){
        console.error(error);
        
    }
}


async function updateMfPositivePatientList(data:any,id:any){
    let url = BASE_URL+ENDPOINT.MFPOSITIVE_PATIENT_UPDATE+"/"+id;
    try{
        return await put(url,data)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){

        console.log(error)
    }
}

async function deleteMfPositivePatientList(id:any){
    let url= BASE_URL+ENDPOINT.MFPOSITIVE_PATIENT_DELETE+"/?id="+id;
    try{

        return await deleteService(url)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){
        console.log(error)
    }

}


async function getMfPositiveFollowUpsList(fieldUnitId) {
    let url = BASE_URL + ENDPOINT.MFPOSITIVE_BSFollowUps_LIST+"/"+fieldUnitId;
    try {
        return await get(url)
            .then((response) => {
                return response;
                
            })
            .catch((error) => {
                console.log("error::", error);
            });

    } catch (error) {
        console.error(error);
    }

}

async function postMfPositiveFollowUpsList(data:any){
    let url=BASE_URL+ENDPOINT.MFPOSITIVE_BSFollowUps_CREATE;
    try{
        return await post(url,data)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){
        console.error(error);
        
    }
}


async function updateMfPositiveFollowUpsList(data:any,id:any){
    let url = BASE_URL+ENDPOINT.MFPOSITIVE_BSFollowUps_UPDATE+"/?id="+id;
    try{
        return await put(url,data)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){

        console.log(error)
    }
}

async function deleteMfPositiveFollowUpsList(id:any){
    let url= BASE_URL+ENDPOINT.MFPOSITIVE_BSFollowUps_DELETE+"/?id="+id;
    try{

        return await deleteService(url)
        .then((response)=>{
            return response;
        })
        .catch((error)=>{
            console.log(error)
        });
    }catch(error){
        console.log(error)
    }

}


const MfPositiveService = {
    getMfPositiveList,
    postMfPositiveList,
    createAllMfPositiveList,
    updateMfPositiveList,
    deleteMfPositiveList,
    getMfPositiveSurveyList,
    postMfPositiveSurveyList,
    updateMfPositiveSurveyList,
    deleteMfPositiveSurveyList,
    getMfPositivePatientList,
    postMfPositivePatientList,
    updateMfPositivePatientList,
    deleteMfPositivePatientList,
    getMfPositiveFollowUpsList,
    postMfPositiveFollowUpsList,
    updateMfPositiveFollowUpsList,
    deleteMfPositiveFollowUpsList,
    getOneMfPositiveList
}

export default MfPositiveService;
