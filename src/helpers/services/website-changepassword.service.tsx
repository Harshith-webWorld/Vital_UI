import { post } from "../fetchServicesMethods";
import { BASE_URL } from "../config";
import ENDPOINT from "../Api";


async function updatePasswords(userInfo: any,id :any) {
  let url = BASE_URL + ENDPOINT.UPDATE_PASSWORD + "/" + id;

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

const ChangePasswordServices = {
  updatePasswords,
};

export default ChangePasswordServices;
