import {get}from '../fetchServicesMethods';
import { BASE_URL } from "../config";
import ENDPOINT from "../Api";

async function getWebsiteContent() {
    let url = BASE_URL+ENDPOINT.WEBSITE_CONTENT_LIST;
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

async function readMore(field:string,id:string) {
    let url ='';
    if (field === "websitecontent-image") {
        url = BASE_URL+ENDPOINT.IMAGES_READMORE+'/?id='+id;
      } else if (field === "websitecontent-blog") {
        url = BASE_URL+ENDPOINT.BLOGS_READMORE+'/'+id;
      } else if (field === "websitecontent-video") {
        url = BASE_URL+ENDPOINT.VIDEOS_READMORE+'/?id='+id;
      }else if (field === "websitecontent-news") {
        url = BASE_URL+ENDPOINT.NEWS_READMORE+'/?id='+id;
      }
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







const WebsiteContentService = {
    getWebsiteContent,
    readMore,
    
    
}

export default WebsiteContentService;