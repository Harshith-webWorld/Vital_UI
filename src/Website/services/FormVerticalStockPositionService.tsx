import { post, put, deleteService, get } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";
import {objectToQueryString} from './utils'

async function getStockPosition(params: any) {
    let url = BASE_URL + ENDPOINT.VERTICAL_STOCK_POSITION_LIST;
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


async function getoneStockPosition(id: any) {
    let url = BASE_URL + ENDPOINT.VERTICAL_STOCK_POSITION_GETONE + "/?id=" + id;;
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

async function postStockPosition(data) {
    console.log('Post Data', data)
    let url = BASE_URL + ENDPOINT.VERTICAL_STOCK_POSITION_CREATE;

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

async function updateStockPosition(data: any, id: any) {

    let url = BASE_URL + ENDPOINT.VERTICAL_STOCK_POSITION_UPDATE + "/?id=" + id;

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


async function deleteStockPosition(id) {
    let url = BASE_URL + ENDPOINT.VERTICAL_STOCK_POSITION_DELETE + "/?id=" + id;
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
    getStockPosition,
    getoneStockPosition,
    postStockPosition,
    updateStockPosition,
    deleteStockPosition
}

export default StockPositionService;
