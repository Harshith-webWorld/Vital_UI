import React, { useState, useEffect } from "react";
import Analysis1 from "./LFandHydroceleReports/Analysis1";
import Analysis2 from "./LFandHydroceleReports/Analysis2";
import Analysis3 from "./LFandHydroceleReports/Analysis3";
import FSUAnalysis1 from "./FSUReports/FSUAnalysis1";
import FSUAnalysis2 from "./FSUReports/FSUAnalysis2";
import FSUAnalysis3 from "./FSUReports/FSUAnalysis3";
import FSUAnalysis4 from "./FSUReports/FSUAnalysis4";
import FSUAnalysis5 from "./FSUReports/FSUAnalysis5";
import VerticalStockAnalysis from "./VerticalStockAnalysis";
import SAEReport from "./MDAReports/SAEReport";
import TASReport1 from "./TASReports/TASReport1";
import TASReport2 from "./TASReports/TASReport2";
import Additional_MF_Survey_Report from "./MFReports/Additional_MF_Survey_Report";
import AdditionalEntomologicalReport from "./EntomologicalAndLarvicidalReports/AdditionalEntomologicalReport";
import AnalysisOne from "./FCUReports/AnalysisOne";
import AnalysisTwo from "./FCUReports/AnalysisTwo";
import AnalysisThree from "./AnalysisThree";
import AnalysisFour from "./FCUReports/AnalysisFour";
import AnalysisFive from "./FCUReports/AnalysisFive";
import AnalysisSix from "./FCUReports/AnalysisSix";
import AnalysisSeven from "./FCUReports/AnalysisSeven";
import AnalysisEight from "./FCUReports/AnalysisEight";
import AnalysisNine from "./AnalysisNine";
import AnalysisTen from "./FCUReports/AnalysisTen";
import BaselineEntomoligicalReport from "./EntomologicalAndLarvicidalReports/BaselineEntomoligicalReport";
import CoordinationcommitteReport from "./MDAReports/CoordinationcommitteReport";
import CoverageReport1 from "./MDAReports/CoverageReport1";
import DrugRequirementMDA from "./MDAReports/DrugRequirementMDA";
import Base_line_Survey from "./MFReports/Base_line_Survey/Base_line_Survey";
import InfrastructureandTraining from "./MDAReports/InfrastructureandTraining";
import LarvalDensityReport from "./EntomologicalAndLarvicidalReports/LarvalDensityReport";
import LarvicidalReport1 from "./EntomologicalAndLarvicidalReports/LarvicidalReport1";
import MDATrainingstatus1 from "./MDAReports/MDATrainingstatus1";
import Analysis1postMDAevaluation from "./MDAReports/PostMDAevaluation1/index";
import Analysis2postMDAevaluation from "./MDAReports/PostMDAevaluation2/index";
import NFCUMosquitoDisectionReport2 from "./EntomologicalAndLarvicidalReports/NFCUMosquitoDisectionReport2";
import NFCUMosquitoDisectionReport from "./EntomologicalAndLarvicidalReports/NFCUReportEntomology1";
import ProposalforwithdrawalofMDA from "./MDAReports/ProposalforwithdrawalofMDA";
const Tablelist = () => {
  return (
    <div>
      <Analysis1 />
      <Analysis2 />
      <Analysis3 />
      <FSUAnalysis1 />
      <FSUAnalysis2 />
      <FSUAnalysis3 />
      <FSUAnalysis4 />
      <FSUAnalysis5 />
      <NFCUMosquitoDisectionReport />
      <NFCUMosquitoDisectionReport2 />
      <ProposalforwithdrawalofMDA />
      <SAEReport />
      <TASReport1 />
      <TASReport2 />
      <VerticalStockAnalysis />
      <Additional_MF_Survey_Report />
      <AdditionalEntomologicalReport />
      <AnalysisOne />
      <AnalysisTwo />
      <AnalysisThree />
      <AnalysisFour />
      <AnalysisFive />
      <AnalysisSix />
      <AnalysisSeven />
      <AnalysisEight />
      <AnalysisNine />
      <AnalysisTen />
      <Base_line_Survey />
      <BaselineEntomoligicalReport />
      <CoordinationcommitteReport />
      <CoverageReport1 />
      <DrugRequirementMDA />
      <BaselineEntomoligicalReport />
      <InfrastructureandTraining />
      <LarvalDensityReport />
      <LarvicidalReport1 />
      <MDATrainingstatus1 />
      <Analysis1postMDAevaluation />
      <Analysis2postMDAevaluation />
    </div>
  );
};
export default Tablelist;
