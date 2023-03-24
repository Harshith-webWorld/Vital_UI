import {get}from '../fetchServicesMethods';
import { BASE_URL } from "../config";
import ENDPOINT from "../Api";

async function getUnitAction() {
    let url = BASE_URL+ENDPOINT.WEBSITE_DROPDOWN_UNITACTION;
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

async function getDesignation() {
    let url = BASE_URL+ENDPOINT.DESIGNATION_LIST;
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

async function getActivity() {
    let url = BASE_URL+ENDPOINT.ACTIVIITY_LIST;
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

async function getScreen() {
    let url = BASE_URL+ENDPOINT.SCREEN_LIST;
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
async function getRole() {
    let url = BASE_URL+ENDPOINT.ROLE_LIST;
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
async function getInstution() {
    let url = BASE_URL+ENDPOINT.INSTITUTIONTYPE_LIST;
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

async function getDistrictList() {
    let url = BASE_URL+ENDPOINT.WEBSITE_DROPDOWN_LIST_DISTRICT;
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




const DropdownService = {
    
   
    getUnitAction,
    getDesignation,
    getActivity,
    getScreen,
    getRole,
    getInstution,
    getDistrictList
  
    
}

export default DropdownService;