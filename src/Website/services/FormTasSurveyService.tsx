import {post,put,deleteService,get}from '../../helpers/fetchServicesMethods';
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";
import {objectToQueryString} from './utils';

async function getTASSurvey(params: any) {
    let url = BASE_URL + ENDPOINT.TASSURVEY_LIST;
    if(params){
        url = url + `?${objectToQueryString(params)}`
    }
    try {
        return await get(url)
            .then((response) => {
                //console.log(JSON.stringify(response));
                return response;
                
            })
            .catch((error) => {
                console.log("error::", error);
            });

    } catch (error) {
        console.error(error);
    }

}
async function postTassurvey(data) {
    console.log('Preethi',data)
    // return false;
    
    let url =  BASE_URL+ENDPOINT.TASSURVEY_ADD;
    
 
    try {

        return await post(url,data)
    
        
            .then((response) => {
                //console.log(JSON.stringify(response));
                return response;
            })
            .catch((error) => {
                console.log("error::", error);
            });

    } catch (error) {
        console.error(error);
    }

}
async function updateTASSurvey(data:any, id:any) {
    
    let url = BASE_URL + ENDPOINT.TASSURVEY_UPDATE+"/?id="+id;
   
    try {
        return await put(url,data)
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
async function deleteTasSurvey(id) {
    let url = BASE_URL + ENDPOINT.TASSURVEY_DELETE+ "/?id=" + id;
    try {
        return await deleteService(url)
            .then((response) => {
                //console.log(JSON.stringify(response));
                return response;
            })
            .catch((error) => {
                console.log("error::", error);
            });

    } catch (error) {
        console.error(error);
    }

}
async function getOneTasSurvey(id:any) {
    let url = BASE_URL+ENDPOINT.TASSURVEY_GETONE+'?id='+id;
    try {
        return await get(url)
        .then((response) => {
            //console.log(JSON.stringify(response));
            return response;
        })
        .catch((error) => {
            console.log("error::", error);
        });
    
    } catch (error) {
        console.error(error);
    }

}

async function postTassurveyChildren(data) {
    console.log('Preethi',data)
    // return false;
    
    let url =  BASE_URL+ENDPOINT.TASSURVEYCHILDREN_ADD;
    
 
    try {

        return await post(url,data)
    
        
            .then((response) => {
                //console.log(JSON.stringify(response));
                return response;
            })
            .catch((error) => {
                console.log("error::", error);
            });

    } catch (error) {
        console.error(error);
    }

}
async function getTASSurveyChildren(id:any) {
    let url = BASE_URL + ENDPOINT.TASSURVEYCHILDREN_LIST+'?tasSurveyId='+id;
    try {
        return await get(url)
            .then((response) => {
                //console.log(JSON.stringify(response));
                return response;
                
            })
            .catch((error) => {
                console.log("error::", error);
            });

    } catch (error) {
        console.error(error);
    }

}
async function getOneTasSurveyChildren(id:any) {
    let url = BASE_URL+ENDPOINT.TASSURVEYCHILDREN_GETONE+'?id='+id;
    try {
        return await get(url)
        .then((response) => {
            //console.log(JSON.stringify(response));
            return response;
        })
        .catch((error) => {
            console.log("error::", error);
        });
    
    } catch (error) {
        console.error(error);
    }

}
async function updateTASSurveyChildren(data:any, id:any) {
    
    let url = BASE_URL + ENDPOINT.TASSURVEYCHILDREN_UPDATE+"/?id="+id;
   
    try {
        return await put(url,data)
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
async function deleteTasSurveyChildren(id) {
    let url = BASE_URL + ENDPOINT.TASSURVEYCHILDREN_DELETE+ "/?id=" + id;
    try {
        return await deleteService(url)
            .then((response) => {
                //console.log(JSON.stringify(response));
                return response;
            })
            .catch((error) => {
                console.log("error::", error);
            });

    } catch (error) {
        console.error(error);
    }

}

async function createAllTasSurvey(data) {
    console.log('Post Data', data)
    let url = BASE_URL + ENDPOINT.TASSURVEY_CREATEALL;

    try {

        return await post(url, data)
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

const TassurveyService = {
    getTASSurvey,
    postTassurvey,
    updateTASSurvey,
    deleteTasSurvey,
    getOneTasSurvey,
    postTassurveyChildren,
    updateTASSurveyChildren,
    getOneTasSurveyChildren,
    getTASSurveyChildren,
    deleteTasSurveyChildren,
    createAllTasSurvey
}

export default TassurveyService;
