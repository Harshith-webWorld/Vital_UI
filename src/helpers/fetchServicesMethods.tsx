import axios from 'axios';
import history from './history';
const headers = {
  Accept: 'application/json',
  contentType: 'application/json',
};

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  if (sessionStorage.getItem("userToken") && sessionStorage.getItem("userToken") !== "undefined") {
    config.headers.Authorization = sessionStorage.getItem("userToken");
  }
  return config;
});

function HandleResponse(response: any) {
  const contentType = response.headers['content-type'];
  if (contentType && contentType.indexOf('application/json') !== -1) {
    if (response.status === 200) {
      if (response.data.response_status === 1) {
        let getMsg = response.data.response_content.message;
        if (getMsg === 'REQUIRED_LOGIN' || getMsg === 'SESSION_EXPIRED') {
          history.push('/admin');
        }
      }
      return response.data;
    } else {
      if (response.status === 401) {
        history.push('/admin');
      }
      if (response.status === 503) {
      }
      if (response.status === 200) {
      }

      const error = response.data;

      return error;
    }
  } else if (contentType && contentType.indexOf('text/html') !== -1) {
    return response.data;
  }
}

export function get(url: any) {
  return axios
    .get(url, { headers })
    .then((resp) => {
      return HandleResponse(resp);
    })
    .catch((error) => {
      console.log(error.response);
      return HandleResponse(error.response);
    });
}

export function publicGet(url: any){
      const requestOptions = {
      method: 'GET',
    };

    return fetch("https://api.ipify.org/?format=json", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log("ipp", result)
        return result;
      })
      .catch(error => {
        console.log(error)
        return error.response;
      });

  //   var config = {
  //     method: 'get',
  //     url: 'https://api.ipify.org/?format=json',
  //   };
  // return axios
  //   .get(url)
  //   .then((resp) => {
  //     return HandleResponse(resp);
  //   })
  //   .catch((error) => {
  //     console.log("errorr", error);
  //     return HandleResponse(error.response);
  //   });
}

export function post(url: any, postdata: any) {
  return axios
    .post(url, postdata, { headers })
    .then((resp) => {
      return HandleResponse(resp);
    })
    .catch((error) => {
      console.log(error.response);
      return HandleResponse(error.response);
    });
}

export function postFormData(url: any, postdata: any) {
  const headers = { 'Content-Type': 'multipart/form-data' };
  return axios
    .post(url, postdata, { headers })
    .then((resp) => {
      return HandleResponse(resp);
    })
    .catch((error) => {
      console.log(error.response);
      return HandleResponse(error.response);
    });
}

export function put(url: any, updatedata: any) {
  return axios
    .put(url, updatedata, { headers })
    .then((resp) => {
      console.log(updatedata);
      return HandleResponse(resp);
    })
    .catch((error) => {
      console.log(error.response);
      return HandleResponse(error.response);
    });
}

export function putFormData(url: any, postdata: any) {
  const headers = { 'Content-Type': 'multipart/form-data' };
  return axios
    .put(url, postdata, { headers })
    .then((resp) => {
      return HandleResponse(resp);
    })
    .catch((error) => {
      console.log(error.response);
      return HandleResponse(error.response);
    });
}

export function deleteService(url: any) {
  return axios
    .delete(url, { headers })
    .then((resp) => {
      return HandleResponse(resp);
    })
    .catch((error) => {
      console.log(error.response);
      return HandleResponse(error.response);
    });
}
