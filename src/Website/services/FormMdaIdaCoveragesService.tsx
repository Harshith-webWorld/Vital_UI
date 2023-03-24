import {post,put,deleteService,get}from '../../helpers/fetchServicesMethods';
import { BASE_URL } from "../../helpers/config";
import ENDPOINT from "../../helpers/Api";
import {objectToQueryString} from './utils';

async function createMdaIdaCoverages(data) {
    console.log('Post Data', data)
    let url = BASE_URL + ENDPOINT.MDA_IDA_COVERAGES_CREATE;

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
async function createAllMdaIdaCoverages(data) {
    console.log('Post Data', data)
    let url = BASE_URL + ENDPOINT.MDA_IDA_COVERAGES_CREATE_ALL;

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
async function createMdaIdaCoverageRegular(data) {
    console.log('Post Data', data)
    let url = BASE_URL + ENDPOINT.MDA_IDA_COVERAGE_REGULAR_CREATE;

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
async function createMdaIdaCoverageMopUp(data) {
    console.log('Post Data', data)
    let url = BASE_URL + ENDPOINT.MDA_IDA_COVERAGE_MOPUP_CREATE;

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

async function getAllMdaIdaCoverages(params: any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGES_LIST;
    if (params) {
        url = url + `?${objectToQueryString(params)}`
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
async function getAllMdaIdaCoverageRegular(id:any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGE_REGULAR_LIST+"/"+id;
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
async function getAllMdaIdaCoverageMopUp(id:any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGE_MOPUP_LIST+"/"+id;
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

async function getOneMdaIdaCoverages(id:any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGES_GETONE+"/"+id;
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

async function getOneMdaIdaCoverageRegular(id:any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGE_REGULAR_GETONE+"/"+id;
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

async function getOneMdaIdaCoverageMopUp(id:any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGE_MOPUP_GETONE+"/"+id;
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

async function updateMdaIdaCoverages(id:any,values:any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGES_UPDATE+"/"+id;
    try {
        return await put(url,values)
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

async function updateMdaIdaCoverageRegular(id:any,values:any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGE_REGULAR_UPDATE+"/"+id;
    try {
        return await put(url,values)
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

async function updateMdaIdaCoverageMopUp(id:any,values:any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGE_MOPUP_UPDATE+"/"+id;
    try {
        return await put(url,values)
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

async function deleteMdaIdaCoverages(id:any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGES_DELETE+"/"+id;
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

async function deleteMdaIdaCoverageRegular(id:any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGE_REGULAR_DELETE+"/"+id;
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

async function deleteMdaIdaCoverageMopUp(id:any) {
    let url = BASE_URL+ENDPOINT.MDA_IDA_COVERAGE_MOPUP_DELETE+"/"+id;
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


const MdaIdaCoveregareService = {
    createMdaIdaCoverages,
    createAllMdaIdaCoverages,
    createMdaIdaCoverageRegular,
    createMdaIdaCoverageMopUp,
    getAllMdaIdaCoverages,
    getAllMdaIdaCoverageRegular,
    getAllMdaIdaCoverageMopUp,
    getOneMdaIdaCoverages,
    getOneMdaIdaCoverageRegular,
    getOneMdaIdaCoverageMopUp,
    updateMdaIdaCoverages,
    updateMdaIdaCoverageRegular,
    updateMdaIdaCoverageMopUp,
    deleteMdaIdaCoverages,
    deleteMdaIdaCoverageRegular,
    deleteMdaIdaCoverageMopUp
}

export default MdaIdaCoveregareService;