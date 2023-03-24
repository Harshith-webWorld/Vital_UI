import staffPositionDraftServices from '../../Website/draftServices/FormStaffPositionDraftServices';
import { post } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from '../../helpers/config';
import React from "react";

    let step1BulkCreateResult:any;
    let url1 = BASE_URL + '/staffPosVerticalUnits/bulkCreateStaffPosition';
 


    const SyncOfflineData = async(userId) => {
      
    let countStaffpositionResponse = await staffPositionDraftServices.countStaffPosunitStatus(userId);
      if(countStaffpositionResponse > 0){
        const step1List = await staffPositionDraftServices.getListStaffPosUnitStatus(userId);
        const step2List = await staffPositionDraftServices.getAllStaffPosTraningStatus();

        let table = step1List.map((el)=>{
          let Obj:any = el;
          let Obj2 = step2List.filter((step2)=>{
            if(step2.staffPosVerticalUnitId === el.staffPosUnitStatusUUID){
              return step2;
            }
          })
         
          Obj.staffPosVerticalUnitStaffs = Obj2;
          
          return Obj;
        })
        console.log("tabel",table);
        const bulkAdd = table.map((Obj:any)=>{
          Obj && Obj.staffPosVerticalUnitStaffs && Obj.staffPosVerticalUnitStaffs.forEach((Obj2:any)=>{
            Obj2.staffPosVerticalUnitId = 0;
            Obj2.staffPosVerticalUnitTrainingStatuses.map((Obj21)=>{
              Obj21.staffPosVerticalUnitId = 0;
            })
          })

          return Obj;
        })
        console.log("bulkAdd",bulkAdd);
        step1BulkCreateResult =  await post(url1,bulkAdd)
        console.log("mdaBulkCreateResponse1111",step1BulkCreateResult);
        if(step1BulkCreateResult && step1BulkCreateResult.data){
          step1List.forEach(async(element) => {
            let id = element && element.staffPosUnitStatusUUID;
            const step1Delete = await staffPositionDraftServices.deleteStaffPosUnitStatus(id);
            if(step1Delete){
              const step2Delete = await staffPositionDraftServices.deleteStaffPosTraningStatus(id);
            }
          });
        }

        return step1BulkCreateResult;
      }
        
    }
    
  let FormStaffPositionDraftSyncService ={
    syncOfflineData: SyncOfflineData
  };  

  


export default FormStaffPositionDraftSyncService;