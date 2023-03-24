import { post, put, deleteService, get } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";
import {objectToQueryString} from './utils';

async function getEntomologicalLarvicidal(params: any) {
    let url = BASE_URL + ENDPOINT.ENTOMOLOGICALLARVICIDAL_GET;
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

async function getoneEntomologicalLarvicidal(id: any) {
    let url = BASE_URL + ENDPOINT.ENTOMOLOGICALLARVICIDAL_GETONE + "/?id=" + id;;
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

async function postEntomologicalLarvicidal(data) {
    console.log('Post Data', data)
    let url = BASE_URL + ENDPOINT.ENTOMOLOGICALLARVICIDAL_POST;

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

async function updateEntomologicalLarvicidal(data: any, id: any) {

    let url = BASE_URL + ENDPOINT.ENTOMOLOGICALLARVICIDAL_UPDATE + "/?id=" + id;

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


async function deleteEntomologicalLarvicidal(id) {
    let url = BASE_URL + ENDPOINT.ENTOMOLOGICALLARVICIDAL_DELETE + "/?id=" + id;
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

async function deleteEntomologicalLarvicidalFieldArray(id) {
    let url = BASE_URL + ENDPOINT.ENTOMOLOGICALLARVICIDAL_FIELD_ARRAY_DELETE + "/?id=" + id;
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


const EntomologicalLarvicidalService = {
    getEntomologicalLarvicidal,
    getoneEntomologicalLarvicidal,
    postEntomologicalLarvicidal,
    updateEntomologicalLarvicidal,
    deleteEntomologicalLarvicidal,
    deleteEntomologicalLarvicidalFieldArray
}

export default EntomologicalLarvicidalService;