import {post,put,deleteService,get}from '../../helpers/fetchServicesMethods';
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";
import {objectToQueryString} from './utils';

async function createMDAActivity(values:any) {
    let url = BASE_URL+ENDPOINT.MDAActivityCreate;
    try {
        return await post(url,values)
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

async function listMDAActivity(params: any) {
    let url = BASE_URL+ENDPOINT.MDAActivityList;
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

async function editMDAActivity(id:any,values:any) {
    let url = BASE_URL+ENDPOINT.MDAActivityEdit+'?id='+id;
    try {
        return await put(url,values)
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

async function getOneMDAActivity(id:any) {
    let url = BASE_URL+ENDPOINT.MDAActivityGetOne+'?id='+id;
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

async function deleteMDAActivity(id:any) {
    let url = BASE_URL+ENDPOINT.MDAActivityDelete+'?id='+id;
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

const MDAActivityServices = {
    createMDAActivity,
    listMDAActivity,
    editMDAActivity,
    deleteMDAActivity,
    getOneMDAActivity
}
export default MDAActivityServices;