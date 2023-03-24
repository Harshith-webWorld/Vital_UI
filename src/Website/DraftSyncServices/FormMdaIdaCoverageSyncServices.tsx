import mdaIdaCoveragesDraftServices from '../../Website/draftServices/FormMadIdaCoveragesDraftServices';
import { post } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from '../../helpers/config';

    let userInfo:any ={};
    let step1BulkCreateResult:any;
    let url1 = BASE_URL + '/mdaIdaCoverageReport/bulkCreateMDACoverage';
    let url2 = BASE_URL + '/mdaIdaCoverageReport/bulkCreateMdaIDACoverageRegularList';
    let url3 = BASE_URL + '/mdaIdaCoverageReport/bulkCreateMdaIDACoverageMopUpList';


    const SyncOfflineData = async(userId) => {
      // let countResponse = await mdaIdaCoveragesDraftServices.countMdaIecActivity();
      // console.log(countResponse)
      // if(countResponse > 0){
      //   let response = await mdaIdaCoveragesDraftServices.getAllMdaIecActivity();
      //   console.log(response)
      //   userInfo.mdaIecActivityid = response;
      //   console.log(userInfo)
      //   let url = BASE_URL + '/mdaActivity/bulkcreate';
      //   let mdaBulkCreateResponse =  await post(url,userInfo)
      //   console.log("mdaBulkCreateResponse",mdaBulkCreateResponse);
      //   if(mdaBulkCreateResponse && mdaBulkCreateResponse.status === 200) {
      //     let deleteDB =  await mdaIdaCoveragesDraftServices.emptyMdaIecActivity();
      //     console.log(deleteDB)
      //   }
      // }
      // const [mdaIdaCoverageBulkCreateTable,setMdaIdaCoverageBulkCreateTable]:any = React.useState([]);
      
    let countCoverageReportResponse = await mdaIdaCoveragesDraftServices.countMdaCoverageReport(userId);
      if(countCoverageReportResponse > 0){
        const step1List = await mdaIdaCoveragesDraftServices.getListMdaIdaCoverages(userId);
        const step2List = await mdaIdaCoveragesDraftServices.getAllListMdaIdaCoveragesRegular();
        const step3List = await mdaIdaCoveragesDraftServices.getAllListMdaIdaCoveragesMopUp();

        let table = step1List.map((el)=>{
          let Obj:any = el;
          let Obj2 = step2List.filter((step2)=>{
            if(step2.mdaIDACoverageId === el.mdaIDACoveragesUUID){
              return step2;
            }
          })
          let Obj3 = step3List.filter((step3)=>{
            if(step3.mdaIDACoverageId === el.mdaIDACoveragesUUID){
              return step3;
            }
          })
          Obj.mdaIDACoverageRegularLists = Obj2;
          Obj.mdaIDACoverageMopUpLists = Obj3;
          return Obj;
        })
        console.log("tabel",table);
        const bulkAdd = table.map((Obj:any)=>{
          console.log("regular",Obj.mdaIDACoverageRegularLists);
          console.log("mopup",Obj.mdaIDACoverageMopUpLists);
          Obj && Obj.mdaIDACoverageMopUpLists && Obj.mdaIDACoverageMopUpLists.forEach((Obj2:any)=>{
            Obj2.mdaIDACoverageId = 0;
            Obj2.mdaIDACoverageOthersLists.map((Obj21)=>{
              Obj21.mdaIDACoverageId = 0;
            })
          })
          Obj.mdaIDACoverageRegularLists.map((Obj2:any)=>{
            Obj2.mdaIDACoverageId = 0;
            Obj2.mdaIDACoverageOthersLists.map((Obj21)=>{
              Obj21.mdaIDACoverageId = 0;
            })
          })
          return Obj;
        })
        console.log("bulkAdd",bulkAdd);
        step1BulkCreateResult =  await post(url1,bulkAdd)
        console.log("mdaBulkCreateResponse1111",step1BulkCreateResult);
        if(step1BulkCreateResult && step1BulkCreateResult.data){
          step1List.forEach(async(element) => {
            let id = element && element.mdaIDACoveragesUUID;
            const step1Delete = await mdaIdaCoveragesDraftServices.deleteMdaIdaCoverages(id);
            if(step1Delete){
              const step2Delete = await mdaIdaCoveragesDraftServices.deleteGetListMdaIdaRegular(id);
              const step3Delete = await mdaIdaCoveragesDraftServices.deleteGetListMdaIdaMopUp(id);
            }
          });
        }

        return step1BulkCreateResult;
        
        
        // console.log(response)
        // userInfo.mdaIDACoverages = response;
        // console.log("userinfoo",userInfo)
        // step1BulkCreateResult =  await post(url1,userInfo)
        // console.log("mdaBulkCreateResponse1111",step1BulkCreateResult);
        // if(step1BulkCreateResult && step1BulkCreateResult.status === 200) {
        //   step1BulkCreateResult.data.map(async function(item) {
        //     let step1Result = await mdaIdaCoveragesDraftServices.getListMdaIdaRegular(item.mdaIDACoveragesOfflineId);
        //     if(step1Result){
        //       let deleteDB =  await mdaIdaCoveragesDraftServices.emptyMdaIDACoverageActivity(userId);
        //       console.log(deleteDB)
        //     }
            
        //     userInfo.mdaIDACoverageRegularList = step1Result;
        //     if(userInfo.mdaIDACoverageRegularList.length > 0){
        //       userInfo.mdaIDACoverageRegularList.map(async function(regularItem) {
        //         regularItem.mdaIDACoverageId = item.id;
        //         regularItem.mdaIDACoverageOthersLists.map(async function(regularOtherItem) {
        //           regularOtherItem.mdaIDACoverageId = item.id;
        //         });
        //       });
        //     }
        //     console.log("mdaBulkCreateResponse data 222",userInfo);
        //       let Step2Result =  await post(url2,userInfo)
        //       console.log("mdaBulkCreateResponse222",Step2Result);  
        //       if(Step2Result){
        //         let deleteDB =  await mdaIdaCoveragesDraftServices.emptyStep2Store();
        //         console.log(deleteDB)
        //       }
        //     let response3 = await mdaIdaCoveragesDraftServices.getListMdaIdaMopUp(item.mdaIDACoveragesOfflineId);
        //     userInfo.mdaIDACoverageMopUpList = response3;
        //     console.log("mdaBulkCreateResponse data 333",userInfo);
        //     if(userInfo.mdaIDACoverageMopUpList.length > 0){
        //       userInfo.mdaIDACoverageMopUpList.map(async function(mopupItem) {
        //         mopupItem.mdaIDACoverageId = item.id;
        //         mopupItem.mdaIDACoverageOthersLists.map(async function(regularMopupItem) {
        //           regularMopupItem.mdaIDACoverageId = item.id;
        //         });
        //       });
        //     }
        //     console.log("mdaCoverageBulkCreateResponse data 333",userInfo);
        //     let Step3Result =  await post(url3,userInfo)
        //     console.log("Step3Result33",Step3Result);
        //     if(Step3Result){
        //       let deleteDB =  await mdaIdaCoveragesDraftServices.emptyStep3Store();
        //       console.log(deleteDB)
        //     }
           
        //   });
          
         
        // }
      }
        
    }
    
  let FormMdaIdaCoveragesSyncService ={
    syncOfflineData: SyncOfflineData
  };  

  


export default FormMdaIdaCoveragesSyncService;