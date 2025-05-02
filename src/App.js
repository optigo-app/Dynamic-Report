import { RecoilRoot } from "recoil";
import "./App.css";
import GridMain from "./GridMain";
import { BrowserRouter } from "react-router-dom";
import ConnectionManager from "./API/SoketConnection/ConnectionManager";
import { DeviceStatusProvider } from "./DeviceStatusContext";

function App() {
  return (
    <RecoilRoot>
      <DeviceStatusProvider>
        <BrowserRouter basename="/testreport">
          <ConnectionManager />
          <GridMain />
        </BrowserRouter>
      </DeviceStatusProvider>
    </RecoilRoot>
  );
}

export default App;

// "homepage": "/testreport",

