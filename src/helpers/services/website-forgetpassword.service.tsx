import { post, put} from "../fetchServicesMethods";
import { BASE_URL } from "../config";
import ENDPOINT from "../Api";





async function sendOtp(userInfo: any) {
    let url = BASE_URL + ENDPOINT.FORGET_PASSWORD;
 
    
    try {

        return await post(url, userInfo)
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


async function verifyingOTP(userInfo: any) {
    let url = BASE_URL + ENDPOINT.VERIFY_OTP;
 
    
    try {

        return await post(url, userInfo)
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



async function updatePassword(userInfo:any, id:any) {
    
    let url = BASE_URL + ENDPOINT.RESET_PASSWORD+"/"+id;
   
    try {
        return await put(url,userInfo)
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

const ForgetPasswordService = {
    sendOtp,
    verifyingOTP,
    updatePassword
}

export default ForgetPasswordService;


