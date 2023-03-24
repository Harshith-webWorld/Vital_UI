import {post,put,deleteService,get} from '../../helpers/fetchServicesMethods';
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";
import {objectToQueryString} from './utils';
async function createMappingOfOT(data:any) {
    let url= BASE_URL+ENDPOINT.MAPPING_OF_OT_CREATE;
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
async function getAllMappingOfOT(params: any){
    let url= BASE_URL+ENDPOINT.MAPPING_OF_OT_LIST
    if (params) {
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
async function getOneMappingOfOT(id){
    let url= BASE_URL+ENDPOINT.MAPPING_OF_OT_GETONE+'?id='+id;
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
async function updateMappingOfOT(id:number,data:any){

    let url= BASE_URL+ENDPOINT.MAPPING_OF_OT_EDIT+"?id="+id;
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
async function deleteMappingOfOT(id:any){
    let url= BASE_URL+ENDPOINT.MAPPING_OF_OT_DELETE+"?id="+id;
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

async function deleteSurgeonMappingOfOT(id:any){
    let url= BASE_URL+ENDPOINT.SURGEON_MAPPING_OF_OT_DELETE+"?id="+id;
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

const MappingOfOTService={
    createMappingOfOT,
    getAllMappingOfOT,
    updateMappingOfOT,
    deleteMappingOfOT,
    getOneMappingOfOT,
    deleteSurgeonMappingOfOT
}
export default MappingOfOTService;