import { post, put, get, deleteService } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from '../../helpers/config';
import ENDPOINT from '../../helpers/Api';
import {objectToQueryString} from './utils';

async function postStaffPostion(data: any) {
    let url = BASE_URL + ENDPOINT.STAFF_POSITION;
    try {
        return await post(url, data)
            .then((response) => {
                console.log(response)
                return response;
            })
            .catch((error) => {
                console.log(error)
            });
    } catch (error) {
        console.error(error);

    }
}

async function postAllStaffPostion(data: any) {
    let url = BASE_URL + ENDPOINT.STAFF_POSITION_CREATEALL;
    try {
        return await post(url, data)
            .then((response) => {
                console.log(response)
                return response;
            })
            .catch((error) => {
                console.log(error)
            });
    } catch (error) {
        console.error(error);

    }
}

async function postStaffPostionTraining(data: any) {
    let url = BASE_URL + ENDPOINT.STAFF_POSITION_TRAINING;
    try {
        return await post(url, data)
            .then((response) => {
                console.log(response)
                return response;
            })
            .catch((error) => {
                console.log(error)
            });
    } catch (error) {
        console.error(error);

    }
}


async function getStaffPostion(params: any) {
    let url = BASE_URL + ENDPOINT.STAFF_POSITION_LIST;
    if(params){
        url = url + `?${objectToQueryString(params)}`
    }
    try {
        return await get(url)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);

            });
    } catch (error) {
        console.error(error);
    }
}

async function getStaffPostionTraining(id) {
    let url = BASE_URL + ENDPOINT.STAFF_POSITION_TRAINING_LIST + "/" + id;
    try {
        return await get(url)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);

            });
    } catch (error) {
        console.error(error);
    }
}


async function listStaffPostionTraining(id: any) {
    let url = BASE_URL + "/staffPosVerticalUnits/listStaffPosVerticalTraining/" + id;
    try {
        return await get(url)
            .then((response) => {
                return response;
            })
            .catch((error) => {
                console.log(error);

            });
    } catch (error) {
        console.error(error);
    }
}


async function getOneStaffPOstion(id: any) {
    let url = BASE_URL + "/staffPosVerticalUnits/getoneStaffPosVerticalUnits/?id=" + id;
    try {
        return await get(url)
            .then((response) => {
                console.log(response)
                return response;
            })
            .catch((error) => {
                console.log(error);
            })
    } catch (error) {
        console.log(error)
    }
}


async function getOneStaffPOstionTraining(id: any) {
    let url = BASE_URL + "/staffPosVerticalUnits/getoneStaffPosVerticalTraining/?id=" + id;
    try {
        return await get(url)
            .then((response) => {
                console.log(response)
                return response;
            })
            .catch((error) => {
                console.log(error);
            })
    } catch (error) {
        console.log(error)
    }
}


async function updateStaffPostion(data: any, id: any) {
    let url = BASE_URL + ENDPOINT.STAFF_POSITION_UPDATE + "/?id=" + id;
    try {
        return await put(url, data)
            .then((response) => {
                console.log(response)
                return response;
            })
            .catch((error) => {
                console.log(error)
            });
    } catch (error) {

        console.log(error)
    }
}


async function updateStaffPostionTraining(data: any) {
    let url = BASE_URL + ENDPOINT.STAFF_POSITION_TRAINING_UPDATE + "/?id=" + data.id;
    try {
        return await put(url, data)
            .then((response) => {
                console.log(response)
                return response;
            })
            .catch((error) => {
                console.log(error)
            });
    } catch (error) {

        console.log(error)
    }
}


async function deleteStaffPosition(id: any) {
    let url = BASE_URL + ENDPOINT.STAFF_POSITION_DELETE + "/?id=" + id;
    try {

        return await deleteService(url)
            .then((response) => {
                console.log(response)
                return response;
            })
            .catch((error) => {
                console.log(error)
            });
    } catch (error) {
        console.log(error)
    }

}


async function deleteStaffPositionTraining(id: any) {
    let url = BASE_URL + ENDPOINT.STAFF_POSITION_TRAINING_DELETE + "/?id=" + id;
    try {

        return await deleteService(url)
            .then((response) => {
                console.log(response)
                return response;
            })
            .catch((error) => {
                console.log(error)
            });
    } catch (error) {
        console.log(error)
    }

}


const StaffPositionService = {
    getStaffPostion,
    postStaffPostion,
    postAllStaffPostion,
    updateStaffPostion,
    deleteStaffPosition,
    getOneStaffPOstion,
    postStaffPostionTraining,
    deleteStaffPositionTraining,
    updateStaffPostionTraining,
    getOneStaffPOstionTraining,
    getStaffPostionTraining,
    listStaffPostionTraining
}

export default StaffPositionService;