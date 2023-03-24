import {post,put,deleteService,get}from '../../helpers/fetchServicesMethods';
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";
import {objectToQueryString} from './utils';

async function getEvalList(params: any) {
    let url = BASE_URL + ENDPOINT.GET_MDA_EVALLIST;
    if (params) {
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
async function postEvalList(data:any) {
    
    let url =  BASE_URL+ENDPOINT.POST_MDA_EVALLIST;
    
 
    try {

        return await post(url, data)
    
        
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

async function editEvalList(id:any,values:any) {
    let url = BASE_URL+ENDPOINT.EDIT_MDA_EVALLIST+'?id='+id;
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

async function getOneEvalList(id:any) {
    let url = BASE_URL+ENDPOINT.GET_ONE_EVALLIST+'?id='+id;
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

async function deleteEvalList(id:any) {
    let url = BASE_URL+ENDPOINT.DELETE_MDA_EVALLIST+'?id='+id;
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

async function deleteperson(id:any) {
    let url = BASE_URL+ENDPOINT.DELETE_MDA_PERSON+'?id='+id;
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
    async function deletefamilymember(id:any) {
        let url = BASE_URL+ENDPOINT.DELETE_MDA_FAMILYMEMBER+'?id='+id;
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
    


const postMDAList = {
    getEvalList,
    postEvalList,
    editEvalList,
    getOneEvalList,
    deleteEvalList,
    deleteperson,
    deletefamilymember
}

export default postMDAList;
