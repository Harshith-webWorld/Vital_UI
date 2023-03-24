import { post, put, deleteService, get } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";
import {objectToQueryString} from './utils';

async function getHydrocelectomyOperations(params: any) {
    let url = BASE_URL + ENDPOINT.HYDROCELECTOMY_OPERATIONS_LIST;
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


async function getoneHydrocelectomyOperations(id: any) {
    let url = BASE_URL + ENDPOINT.HYDROCELECTOMY_OPERATIONS_GETONE + "/?id=" + id;;
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

async function postHydrocelectomyOperations(data) {
    console.log('Post Data', data)
    let url = BASE_URL + ENDPOINT.HYDROCELECTOMY_OPERATIONS_CREATE;

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

async function updateHydrocelectomyOperations(data: any, id: any) {

    let url = BASE_URL + ENDPOINT.HYDROCELECTOMY_OPERATIONS_UPDATE;

    try {
        return await put(url, data)
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


async function deleteHydrocelectomyOperations(id) {
    let url = BASE_URL + ENDPOINT.HYDROCELECTOMY_OPERATIONS_DELETE + "/?id=" + id;
    try {
        return await deleteService(url)
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



const StockPositionService = {
    getHydrocelectomyOperations,
    getoneHydrocelectomyOperations,
    postHydrocelectomyOperations,
    updateHydrocelectomyOperations,
    deleteHydrocelectomyOperations
}

export default StockPositionService;
