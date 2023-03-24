import {
  post,
  postFormData,
  putFormData,
  deleteService,
  get,
} from "../fetchServicesMethods";
import { BASE_URL } from "../config";
import ENDPOINT from "../Api";
async function getProgramInfosInfo() {
  let url = BASE_URL + ENDPOINT.WEBSITE_PROGRAMINFOS_LIST;
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

async function createProgramInfosInfo(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_PROGRAMINFOS_CREATE;
  const formdata = new FormData();
  if(values.id){formdata.append("id", values.id.toString());}
  formdata.append("programInfoHeader", values.programInfoHeader);
  formdata.append(
    "programInfoDescriptionShortHTML",
    values.programInfoDescriptionShortHTML
  );
  formdata.append(
    "programInfoDescriptionLongHTML",
    values.programInfoDescriptionLongHTML
  );
  formdata.append("programInfos", values.programInfoImage);
  if(values.createdBy){
    formdata.append("createdBy", values.createdBy.toString());
  }else{
    formdata.append("createdBy", "0");
  }
  if(values.lastModifiedBy){
  formdata.append("lastModifiedBy", values.lastModifiedBy.toString());
  }else{
    formdata.append("lastModifiedBy", "0");
  }
  if(values.isActive){
  formdata.append("isActive", values.isActive.toString());}

  try {
    return await postFormData(url, formdata)
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

async function editProgramInfosInfo(id, values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_PROGRAMINFOS_UPDATE + "/" + id;

  const formdata = new FormData();
  if(values.id){formdata.append("id", values.id.toString());}
  formdata.append("programInfoHeader", values.programInfoHeader);
  formdata.append(
    "programInfoDescriptionShortHTML",
    values.programInfoDescriptionShortHTML
  );
  formdata.append(
    "programInfoDescriptionLongHTML",
    values.programInfoDescriptionLongHTML
  );
  formdata.append("programInfos", values.programInfoImage);
  if(values.createdBy){
  formdata.append("createdBy", values.createdBy.toString());}
  if(values.lastModifiedBy){
  formdata.append("lastModifiedBy", values.lastModifiedBy.toString());}
  if(values.isActive){
  formdata.append("isActive", values.isActive.toString());}

  try {
    return await putFormData(url, formdata)
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

async function deleteProgramInfosInfo(id) {
  let url = BASE_URL + ENDPOINT.WEBSITE_PROGRAMINFOS_DELETE + "/" + id;
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

async function deleteProgramInfoSection(id) {
  let url = BASE_URL + ENDPOINT.WEBSITE_PROGRAMINFOSECTION_DELETE + "/" + id;
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
async function deleteProgramInfoLink(id) {
  let url =
    BASE_URL + ENDPOINT.WEBSITE_PROGRAMINFOSECTIONLINK_DELETE + "/" + id;
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

async function getOneProgramInfo(id) {
  let url = BASE_URL + ENDPOINT.WEBSITE_PROGRAMINFOS_GETONE + "/" + id;
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
async function getOneProgramInfoSection(id) {
  let url = BASE_URL + ENDPOINT.WEBSITE_PROGRAMINFOSECTION_GETONE + "/" + id;
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
async function getProgramSectionList(programmingInfoid) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_PROGRAMINFOSECTION_GET +
    "/" +
    programmingInfoid;
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

async function createProgramInfosInfoSection(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_PROGRAMINFOSECTION_CREATE;
  try {
    return await post(url, values)
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

async function createProgramInfosInfoLinks(values) {
  let url = BASE_URL + ENDPOINT.WEBSITE_PROGRAMINFOLINKS_CREATE;
  const formdata = new FormData();
  if(values.id){formdata.append("id", values.id.toString());}
  formdata.append("displayOrder", values.displayOrder);
  formdata.append("linkName", values.linkName);
  formdata.append("linkFileType", values.linkFileType);
  formdata.append("programInfoSectionId", values.programInfoSectionId);
  formdata.append("programInfoId", values.programInfoId);
  formdata.append("programInfoLinks", values.linkFileName);
  if(values.createdBy){formdata.append("createdBy", values.createdBy.toString());}
  if(values.lastModifiedBy){formdata.append("lastModifiedBy", values.lastModifiedBy.toString());}
  if(values.isActive){formdata.append("isActive", values.isActive.toString());}
  try {
    return await postFormData(url, formdata)
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
async function getProgramInfoSectionLinkList(ProgramInfoId) {
  let url =
    BASE_URL +
    ENDPOINT.WEBSITE_PROGRAMINFOSECTIONLINK_GETAll +
    "/" +
    ProgramInfoId;
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
const ProgramInfoServices = {
  getProgramInfosInfo,
  createProgramInfosInfo,
  getOneProgramInfo,
  editProgramInfosInfo,
  deleteProgramInfosInfo,
  deleteProgramInfoSection,
  deleteProgramInfoLink,
  createProgramInfosInfoSection,
  createProgramInfosInfoLinks,
  getProgramSectionList,
  getOneProgramInfoSection,
  getProgramInfoSectionLinkList,
};

export default ProgramInfoServices;
