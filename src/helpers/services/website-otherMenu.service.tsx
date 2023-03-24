import {
  post,
  postFormData,
  putFormData,
  deleteService,
  get,
} from '../fetchServicesMethods';
import { BASE_URL } from '../config';
import ENDPOINT from '../Api';
import { WebsiteOthersMenu } from '../interfaces/website-othersMenu';

async function getWebsiteOtherMenuInfo() {
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_GETLIST;
  try {
    return await get(url)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function getOneWebsiteOtherMenuInfo(id: any) {
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_GETONE + '/' + id;
  try {
    return await get(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function postWebsiteOtherMenu(menuData: WebsiteOthersMenu) {
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_POST;
  const formdata = new FormData();
  formdata.append('menuType', menuData.menuType);
  formdata.append('menuPageTitle', menuData.menuPageTitle);
  formdata.append('others', menuData.menuContentImageName);
  formdata.append('menuContentHTML', menuData.menuContentHTML);
  formdata.append('createdBy', menuData.createdBy.toString());
  formdata.append('lastModifiedBy', menuData.lastModifiedBy.toString());
  formdata.append('isActive', menuData.isActive.toString());

  try {
    return await postFormData(url, formdata)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function updateWebsiteOtherMenu(menuData: WebsiteOthersMenu, id) {
  const formdata = new FormData();
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_UPDATE + '/' + id;
  formdata.append('menuType', menuData.menuType);
  formdata.append('menuPageTitle', menuData.menuPageTitle);
  formdata.append('others', menuData.menuContentImageName);
  formdata.append('menuContentHTML', menuData.menuContentHTML);
  formdata.append('createdBy', menuData.createdBy.toString());
  formdata.append('lastModifiedBy', menuData.lastModifiedBy.toString());
  formdata.append('isActive', menuData.isActive.toString());

  try {
    return await putFormData(url, formdata)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function deleteWebsiteOtherMenu(id) {
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_DELETE + '/' + id;
  try {
    return await deleteService(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function getWebsiteOtherMenuSectionInfo(id) {
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_SECTION_GETLIST + '/' + id;
  try {
    return await get(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function getOneWebsiteOtherMenuSectionInfo(id: any) {
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_SECTION_GETONE + '/' + id;
  try {
    return await get(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function postWebsiteOtherMenuSection(menuData) {
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_SECTION_POST;
  try {
    return await post(url, menuData)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function updateWebsiteOtherMenuSection(menuData: WebsiteOthersMenu, id) {
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_SECTION_UPDATE + '/' + id;

  try {
    return await putFormData(url, menuData)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}

async function deleteWebsiteOtherMenuSection(id) {
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_SECTION_DELETE + '/' + id;
  try {
    return await deleteService(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function getOtherMenuSectionList(programmingInfoid) {
  let url =
    BASE_URL + ENDPOINT.ADMIN_MENUS_LINK_GETONE + '/' + programmingInfoid;
  try {
    return await get(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function createOtherMenuInfoLinks(values) {
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_LINK_POST;
  const formdata = new FormData();
  if (values.id) {
    formdata.append('id', values.id.toString());
  }
  formdata.append('displayOrder', values.displayOrder);
  formdata.append('linkName', values.linkName);
  formdata.append('linkFileType', values.linkFileType);
  formdata.append('otherMenuId', values.otherMenuId);
  formdata.append('otherMenuSectionId', values.otherMenuSectionId);
  formdata.append('otherslink', values.otherslink);
  formdata.append('createdBy', values.createdBy.toString());
  formdata.append('lastModifiedBy', values.lastModifiedBy.toString());
  formdata.append('isActive', values.isActive.toString());

  try {
    return await postFormData(url, formdata)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function getOtherMenuInfoLinkListALL(OtherMenuInfoId) {
  let url =
    BASE_URL + ENDPOINT.ADMIN_MENUS_LINK_GETLIST + '/' + OtherMenuInfoId;
  try {
    return await get(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
async function deleteOtherMenuInfoLink(id) {
  let url = BASE_URL + ENDPOINT.ADMIN_MENUS_LINK_DELETE + '/' + id;
  try {
    return await deleteService(url)
      .then((response) => {
        //console.log(JSON.stringify(response));
        return response;
      })
      .catch((error) => {
        console.log('error::', error);
      });
  } catch (error) {
    console.error(error);
  }
}
const ImagesService = {
  getWebsiteOtherMenuInfo,
  getOneWebsiteOtherMenuInfo,
  postWebsiteOtherMenu,
  updateWebsiteOtherMenu,
  deleteWebsiteOtherMenu,

  getWebsiteOtherMenuSectionInfo,
  getOneWebsiteOtherMenuSectionInfo,
  postWebsiteOtherMenuSection,
  updateWebsiteOtherMenuSection,
  deleteWebsiteOtherMenuSection,

  createOtherMenuInfoLinks,
  getOtherMenuSectionList,
  getOtherMenuInfoLinkListALL,
  deleteOtherMenuInfoLink,
};

export default ImagesService;
