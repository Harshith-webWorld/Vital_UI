import { post } from '../../helpers/fetchServicesMethods';
import { BASE_URL } from '../../helpers/config';
import ENDPOINT from '../../helpers/Api';

async function getReportLfAnalysis1(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_LF_ANALYSIS1;
  try {
    return await post(url, data)
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
async function getReportLfAnalysis2(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_LF_ANALYSIS2;
  try {
    return await post(url, data)
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
async function getReportLfAnalysis3(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_LF_ANALYSIS3;
  try {
    return await post(url, data)
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
async function getReportLFDieseaseCases(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_LF_DIESEASECASES;
  try {
    return await post(url, data)
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
async function getReportLFHydroceleOPLineList(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_LF_HYDROCELE_OP_LINE_LIST;
  try {
    return await post(url, data)
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
async function getReportLFPendingHydroceleCases(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_LF_PENDING_HYDROCELE_CASES;
  try {
    return await post(url, data)
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

async function getGradingOfLFPatients(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_GRADING_OF_LF_PATIENTS;
  try {
    return await post(url, data)
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

async function getReportPatientIneligibleForSurgery(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_PATIENT_INELIGIBLE_FOR_SURGERY;
  try {
    return await post(url, data)
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

async function getReportAdditionalMFSurveryReportList(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_ADDITIONAL_MF_SURVEY_REPORT_LIST;
  try {
    return await post(url, data)
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
async function getProposalforwithdrawalofMDAList(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_PROPOSAL_FOR_WITHDRAWAL_REPORT_LIST;
  try {
    return await post(url, data)
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

async function getReportMFBaseLineSurveryList(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MF_BASE_LINE_SURVEY_LIST;
  try {
    return await post(url, data)
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

async function getReportHydrocelectomyOperations(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_HYDROCELECTOMY_OPERATIONS;
  try {
    return await post(url, data)
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

async function getReportMMDPKitsGiven(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MMDP_KITS_GIVEN;
  try {
    return await post(url, data)
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

async function getPerformanceofsurgeons(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_PERFORMANCE_OF_SURGEONS;
  try {
    return await post(url, data)
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
async function getPerformanceOfInstitutes(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_PERFORMANCE_OF_INSTITUTES;
  try {
    return await post(url, data)
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
async function getPatientsineligibleforsurgery(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_PATIENT_INELIGIBLE_FOR_SURGERY;
  try {
    return await post(url, data)
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
async function getMMDPActivityReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_LF_MMDP_ACTIVITY_REPORT;
  try {
    return await post(url, data)
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

async function getFSUAnalysis1(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FSU_ANALYSIS1;
  try {
    return await post(url, data)
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

async function getFSUAnalysis2(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FSU_ANALYSIS2;
  try {
    return await post(url, data)
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

async function getFSUAnalysis3(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FSU_ANALYSIS3;
  try {
    return await post(url, data)
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
async function getFSUAnalysis4(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FSU_ANALYSIS4;
  try {
    return await post(url, data)
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
async function getFSUAnalysis5(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FSU_ANALYSIS5;
  try {
    return await post(url, data)
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
async function getFcuAnalysisOne(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FCU_ANALYSIS_ONE;
  try {
    return await post(url, data)
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

async function getFCUAnalysis2(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FCU_ANALYSIS_TWO;
  try {
    return await post(url, data)
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
async function getFcuAnalysisFour(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FCU_ANALYSIS_FOUR;
  try {
    return await post(url, data)
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
async function getFcuAnalysisFive(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FCU_ANALYSIS_FIVE;
  try {
    return await post(url, data)
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

async function getFcuAnalysisSix(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FCU_ANALYSIS_SIX;
  try {
    return await post(url, data)
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
async function tasReport2(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_TAS_REPORT2;
  try {
    return await post(url, data)
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

async function coverageReport1(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MDA_COVERAGEREPORT1;
  try {
    return await post(url, data)
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
async function postMDAEvaluation1(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MDA_POSTMDA_EVALUATION1;
  try {
    return await post(url, data)
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

async function postMDAEvaluation2(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MDA_POSTMDA_EVALUATION2;
  try {
    return await post(url, data)
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

async function getTASReport1(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_TAS_REPORT1;
  try {
    return await post(url, data)
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

async function getMDATrainingStatus1(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MDA_TRAINING_STATUS1;
  try {
    return await post(url, data)
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

async function getMDAInfrastructure(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MDA_INFRASTRUCTURE;
  try {
    return await post(url, data)
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

async function getSaeReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_SAE_REPORT;
  try {
    return await post(url, data)
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
async function getMDAcoordCommitteReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MDA_COORDINATION_COMMITTE_REPORT;
  try {
    return await post(url, data)
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

async function getEntologyLaravicidalReport1(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_ENTOMOLOGY_LARVICIDAL_REPORT1;
  try {
    return await post(url, data)
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
async function getVerticalAnalysisReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_VERTICAL_ANALYSIS_REPORT;
  try {
    return await post(url, data)
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
async function getNFCUReportEntomology1(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_ENTOMOLOGY_NFCU_REPORT1;
  try {
    return await post(url, data)
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
async function getAdditionalEntomologyReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_ADDITIONAL_ENTOMOLOGICAL_REPORT;
  try {
    return await post(url, data)
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
async function getBaselineEntomologyReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_BASE_LINE_ENTOMOLOGICAL_REPORT;
  try {
    return await post(url, data)
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
async function getNfcuMosquitoDisectionReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_NFCU_MOSQUITO_DISECTION_REPORT;
  try {
    return await post(url, data)
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
async function getLarvalDensityReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_LARVAL_DENSITY_REPORT;
  try {
    return await post(url, data)
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

async function getFcuAnalysisTen(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FCU_ANALYSIS_TEN;
  try {
    return await post(url, data)
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

async function getDrugRequirementMDA1(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_DRUG_REQUIREMENT_MDA;
  try {
    return await post(url, data)
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

async function getDiseaseRateVillageWise(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_DISEASE_RATE_VILLAGE_WISE;
  try {
    return await post(url, data)
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

async function getVerifiedbyMO(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_VERIFIED_BY_MO;
  try {
    return await post(url, data)
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

async function getMdaDrugAdminSupervisorAvaliablity(data) {
  let url =
    BASE_URL + ENDPOINT.REPORT_GET_MDA_DRUG_ADMIN_SUPERVISOR_AVALIABILITY;
  try {
    return await post(url, data)
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

async function getMdaphcHrAndTainingStatus(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MDA_PHC_HR_AND_TRAINING_STATUS;
  try {
    return await post(url, data)
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

async function getMdaphcWiseDrugConsumption(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MDA_PHC_WISE_DRUG_CONSUMPTION;
  try {
    return await post(url, data)
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

async function getVspMonthlyVacancyStatus(data) {
  let url =
    BASE_URL + ENDPOINT.REPORT_GET_VERTICAL_STOCK_MONTHLY_VACANCY_STATUS;
  try {
    return await post(url, data)
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

async function getVspTrainingStatus(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_VERTICAL_STOCK_TRAINING_STATUS;
  try {
    return await post(url, data)
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

async function getVspAvailabilityConsumptionLabMaterials(data) {
  let url =
    BASE_URL + ENDPOINT.REPORT_GET_VERTICAL_STOCK_COMSUMPTION_LAB_MATERIALS;
  try {
    return await post(url, data)
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

async function getFSUPercentageTargetCompleted(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FSU_PERCENTAGE_TARGET_COMPLETED;
  try {
    return await post(url, data)
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

async function getMDAbifurcationOfRegularAndMopup(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MDA_BIFURCATION_OF_REGULAR_AND_MOPUP;
  try {
    return await post(url, data)
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

async function getPlanningForOT(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_LF_PLANNING_FOR_OT;
  try {
    return await post(url, data)
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

async function getExpenditureBalanceReceivedFunds(data) {
  let url =
    BASE_URL + ENDPOINT.REPORT_GET_MDA_EXPENDITURE_BALANCE_RECEIVED_FUNDS;
  try {
    return await post(url, data)
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

async function getFollowUpServicesLFPatients(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_LF_FOLLOW_UP_SERVICES_LF_PATIENTS;
  try {
    return await post(url, data)
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

async function getFollowUpServicesHFPatients(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_LF_FOLLOW_UP_SERVICES_HF_PATIENTS;
  try {
    return await post(url, data)
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

async function getFcuAnalysisSeven(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FCU_ANALYSIS_SEVEN;
  try {
    return await post(url, data)
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

async function getDrugStockAtPHC(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_MDA_DRUG_STOCK_AT_PHC;
  try {
    return await post(url, data)
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

async function getDrugRequirementMDA2(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_DRUG_REQUIREMENT_MDA_2;
  try {
    return await post(url, data)
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

async function getFcuAnalysisEight(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FCU_ANALYSIS_EIGHT;
  try {
    return await post(url, data)
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
async function getpostMDAEvalListdropdown() {
  let url = BASE_URL + ENDPOINT.REPORT_GET_POSTMDAEVALIST;
  try {
    return await post(url, {})
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

async function getFSUZonewiseReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FSU_ZONEWISE;
  try {
    return await post(url, data)
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

async function getFCUMISMTRReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_FCU_MISMTR;
  try {
    return await post(url, data)
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

async function getNCMISMTRReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_NC_MISMTR;
  try {
    return await post(url, data)
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

async function getRCOMISMTRReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_RCO_MISMTR;
  try {
    return await post(url, data)
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

async function getYearwiseMISMTRReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_YEARWISE_MISMTR;
  try {
    return await post(url, data)
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

async function getInventoryMISMTRReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_INVENTORY_MISMTR;
  try {
    return await post(url, data)
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

async function getEntomologicalMISMTRReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_ENTOMOLOGICAL_MISMTR;
  try {
    return await post(url, data)
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
async function getHydroceleOpsMISMTRReport(data) {
  let url = BASE_URL + ENDPOINT.REPORT_GET_HYDROCELEOPS_MISMTR;
  try {
    return await post(url, data)
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
const ReportService = {
  getpostMDAEvalListdropdown,
  getReportLfAnalysis1,
  getReportLfAnalysis2,
  getReportLFDieseaseCases,
  getReportLfAnalysis3,
  getReportLFHydroceleOPLineList,
  getReportLFPendingHydroceleCases,
  getGradingOfLFPatients,
  getReportPatientIneligibleForSurgery,
  getReportAdditionalMFSurveryReportList,
  getReportMFBaseLineSurveryList,
  getReportHydrocelectomyOperations,
  getReportMMDPKitsGiven,
  getPerformanceofsurgeons,
  getPatientsineligibleforsurgery,
  getPerformanceOfInstitutes,
  getFSUAnalysis1,
  getFSUAnalysis2,
  getFSUAnalysis3,
  getMMDPActivityReport,
  getFSUAnalysis4,
  getFSUAnalysis5,
  getFcuAnalysisOne,
  getFcuAnalysisFour,
  getFcuAnalysisFive,
  getFcuAnalysisSix,
  getFCUAnalysis2,
  getTASReport1,
  tasReport2,
  coverageReport1,
  postMDAEvaluation1,
  postMDAEvaluation2,
  getMDAInfrastructure,
  getMDATrainingStatus1,
  getSaeReport,
  getMDAcoordCommitteReport,
  getEntologyLaravicidalReport1,
  getNFCUReportEntomology1,
  getVerticalAnalysisReport,
  getAdditionalEntomologyReport,
  getBaselineEntomologyReport,
  getNfcuMosquitoDisectionReport,
  getLarvalDensityReport,
  getFcuAnalysisTen,
  getDrugRequirementMDA1,
  getDiseaseRateVillageWise,
  getVerifiedbyMO,
  getMdaDrugAdminSupervisorAvaliablity,
  getMdaphcHrAndTainingStatus,
  getMdaphcWiseDrugConsumption,
  getMDAbifurcationOfRegularAndMopup,
  getVspMonthlyVacancyStatus,
  getVspTrainingStatus,
  getVspAvailabilityConsumptionLabMaterials,
  getFSUPercentageTargetCompleted,
  getPlanningForOT,
  getExpenditureBalanceReceivedFunds,
  getFollowUpServicesLFPatients,
  getFollowUpServicesHFPatients,
  getFcuAnalysisSeven,
  getDrugStockAtPHC,
  getDrugRequirementMDA2,
  getFcuAnalysisEight,
  getProposalforwithdrawalofMDAList,
  getFSUZonewiseReport,
  getFCUMISMTRReport,
  getNCMISMTRReport,
  getRCOMISMTRReport,
  getYearwiseMISMTRReport,
  getInventoryMISMTRReport,
  getEntomologicalMISMTRReport,
  getHydroceleOpsMISMTRReport
};

export default ReportService;
