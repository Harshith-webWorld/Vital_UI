import React, { useEffect, useRef, useState } from "react";
import Routes from "./Admin/routes";
import WebRoutes from "./Website/routes";
import { OnlineStatusProvider } from "./helpers/networkconnection";

const App: React.FC = () => {
  return (
    <div className="App" id="wrapper">
      <OnlineStatusProvider>
        <Routes />
        <WebRoutes />
      </OnlineStatusProvider>
    </div>
  );
};

export default App;
