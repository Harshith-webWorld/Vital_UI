import {post,put,deleteService,get}from '../../helpers/fetchServicesMethods';
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";

async function postUsers(data:any) {
    let url= BASE_URL+ENDPOINT.USERS_CREATE;
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


async function getUsersList() {
    let url = BASE_URL+ENDPOINT.USERS_LIST;
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

async function deleteUsers(id) {
    let url = BASE_URL + ENDPOINT.USERS_DELETE+ "/?id=" + id;
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
async function getOneUser(id:any) {
    let url = BASE_URL+ENDPOINT.USERS_GETONE+'/?id='+id;
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

async function getUserRoleActivities(id:any) {
    let url = BASE_URL+ENDPOINT.GET_USER_ROLE_SCREEN_ACTIVITIES+'/'+id;
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

async function updateUser(data:any, id:any) {
    
    let url = BASE_URL + ENDPOINT.USERS_UPDATE+"/?id="+id;
   
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



const userService = {
    postUsers,
    getUsersList,
    getUserRoleActivities,
    deleteUsers,
    getOneUser,
    updateUser
}

export default userService;