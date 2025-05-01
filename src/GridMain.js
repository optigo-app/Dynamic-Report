import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { GetToken } from "./API/GetToken";
import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import Spliter from "./compoents/WorkerReportSpliterView/Spliter";
import DustCollector from "./compoents/DustCollector/DustCollector";
import ToolReport from "./compoents/ToolReport/ToolReport";
import MFGReturnJob from "./compoents/MFGReturnJob/MFGReturnJob";
import ConversionDeatil from "./compoents/ConversionDeatil/ConversionDeatil";
import FinishGoodsReport from "./compoents/FinishGoodsReport/FinishGoodsReport";
import MaterialWiseSaleReport from "./compoents/MaterialWiseSaleReport/MaterialWiseSaleReport";
import StcokReport from "./compoents/StcokReport/StcokReport";
import DeviceSpliter from "./compoents/DeviceManagementReport/DeviceSpliter";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import JobCompletion from "./compoents/JobCompletion/JobCompletion";
import { AlertTriangle } from "lucide-react";

// Test73  :-    http://nzen/testreport/?sv=/e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIwfX17e3Rlc3Q3M319e3t0ZXN0NzN9fQ==/1&ifid=WorkerReportPro&pid=18223
// http://localhost:3000/testreport/?sv=/e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIwfX17e3Rlc3Q3M319e3t0ZXN0NzN9fQ==/1&ifid=WorkerReportPro&pid=18223

const GridMain = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tokenMissing, setTokenMissing] = useState(false); // NEW
  const [searchParams] = useSearchParams();
  const pid = searchParams.get("pid");

  const getQueryParams = () => {
    const token = Cookies.get("skey");
    const decoded = jwtDecode(token);
    const decodedPayload = {
      ...decoded,
      uid: decodeBase64(decoded.uid),
    };
    if (decodedPayload) {
      sessionStorage.setItem("AuthqueryParams", JSON.stringify(decodedPayload));
    }
    fetchData(decoded);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const token = Cookies.get("skey");
      if (!token) {
        setTokenMissing(true);
      }
    }, 500);
    const token = Cookies.get("skey");
    if (token) {
      getQueryParams();
    } else {
      console.warn("Token cookie not found initially");
      setTokenMissing(true);
      setIsLoading(false);
    }

    return () => clearInterval(interval); // clean up on unmount
  }, []);

  useEffect(() => {
    // Cookies.set(
    //   "skey",
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpdGFzayIsImF1ZCI6ImFtVnVhWE5BWldjdVkyOXQiLCJleHAiOjE3NDU5MTEwNDcsInVpZCI6ImFtVnVhWE5BWldjdVkyOXQiLCJ5YyI6ImUzdHVlbVZ1ZlgxN2V6SXdmWDE3ZTI5eVlXbHNNalY5Zlh0N2IzSmhhV3d5TlgxOSIsInN2IjoiMCJ9.9n0tGL-CArkbq3sn0Bfh17xZC7sgubAOWaHDe7rl25w"
    // );
    const token = Cookies.get("skey");
    if (token) {
      getQueryParams();
    } else {
      console.warn("Token cookie not found");
    }
  }, []);

  const decodeBase64 = (str) => {
    if (!str) return null;
    try {
      return atob(str);
    } catch (e) {
      console.error("Error decoding base64:", e);
      return null;
    }
  };

  const fetchData = async (decoded) => {
    const sp = searchParams.get("sp");
    if (decoded) {
      const tokenPayload = {
        con: '{"id":"","mode":"gettoken"}',
        p: "{}",
        f: "m-test2.orail.co.in (ConversionDetail)",
      };
      try {
        const tokenResponse = await GetToken(
          tokenPayload,
          decoded?.yc,
          decoded?.sv,
          sp
        );
        const token = tokenResponse?.Data?.rd?.[0]?.token;
        if (token) {
          sessionStorage.setItem("Token", token);
        }
      } catch (err) {
        console.error("GetToken error:", err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderComponent = () => {
    if (pid == 18223) {
      return <Spliter isLoadingNew={isLoading} />; // 1315 Doc.
    } else if (pid == 18226) {
      return <DustCollector />; // 1383 Doc.
    } else if (pid == 18227) {
      return <ToolReport />; // 1382 Doc.
    } else if (pid == 18228) {
      return <MFGReturnJob />; // 1386 Doc.
    } else if (pid == 18229) {
      return <ConversionDeatil />; // 1385 Doc.
    } else if (pid == 18230) {
      return <FinishGoodsReport />; // 1388 Doc.
    } else if (pid == 18231) {
      return <MaterialWiseSaleReport />; // 1389 Doc.
    } else if (pid == 1000) {
      return <StcokReport />; // 1392 Doc.
    } else if (pid == 18233) {
      return <DeviceSpliter />; // 1045 Doc.
    } else if (pid == 18234) {
      return <JobCompletion />; // 1256 Doc.
    } else {
      return (
        <div style={{ textAlign: "center", marginTop: "20%" }}>Invalid PID</div>
      );
    }
  };

  return (
    <div>
      {tokenMissing ? (
        <div
          style={{ display: "flex", width: "100%", justifyContent: "center" }}
        >
          <Box
            minHeight="70vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={2}
          >
            <Paper
              elevation={3}
              sx={{
                maxWidth: 500,
                width: "100%",
                p: 4,
                borderRadius: "20px",
                textAlign: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                mb={2}
              >
                <AlertTriangle size={48} color="#f44336" />
              </Box>

              <Typography variant="h5" fontWeight={600} gutterBottom>
                You've been logged out
              </Typography>

              <Typography variant="body1" color="text.secondary" mb={3}>
                Your session has ended. Please log in again to continue.
              </Typography>
            </Paper>
          </Box>
        </div>
      ) : isLoading ? (
        <div style={{ textAlign: "center", marginTop: "20%" }}>
          <CircularProgress />
        </div>
      ) : (
        renderComponent()
      )}
    </div>
  );
};

export default GridMain;

// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { GetToken } from "./API/GetToken";
// import { CircularProgress } from "@mui/material";
// import Spliter from "./compoents/WorkerReportSpliterView/Spliter";
// import DustCollector from "./compoents/DustCollector/DustCollector";
// import ToolReport from "./compoents/ToolReport/ToolReport";
// import MFGReturnJob from "./compoents/MFGReturnJob/MFGReturnJob";
// import ConversionDeatil from "./compoents/ConversionDeatil/ConversionDeatil";
// import FinishGoodsReport from "./compoents/FinishGoodsReport/FinishGoodsReport";
// import MaterialWiseSaleReport from "./compoents/MaterialWiseSaleReport/MaterialWiseSaleReport";
// import StcokReport from "./compoents/StcokReport/StcokReport";
// import DeviceSpliter from "./compoents/DeviceManagementReport/DeviceSpliter";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import JobCompletion from "./compoents/JobCompletion/JobCompletion";

// // Test73  :-    http://nzen/testreport/?sv=/e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIwfX17e3Rlc3Q3M319e3t0ZXN0NzN9fQ==/1&ifid=WorkerReportPro&pid=18223
// // http://localhost:3000/testreport/?sv=/e3tsaXZlLm9wdGlnb2FwcHMuY29tfX17ezIwfX17e3Rlc3Q3M319e3t0ZXN0NzN9fQ==/1&ifid=WorkerReportPro&pid=18223

// const GridMain = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [searchParams] = useSearchParams();
//   const pid = searchParams.get("pid");

//   const getQueryParams = () => {
//     const token = Cookies.get("skey");
//     console.log("tokentoken", token);
//     const decoded = jwtDecode(token);
//     const decodedPayload = {
//       ...decoded,
//       uid: decodeBase64(decoded.uid),
//     };
//     if (decodedPayload) {
//       sessionStorage.setItem("AuthqueryParams", JSON.stringify(decodedPayload));
//     }
//     fetchData(decoded);
//   };

//   useEffect(() => {
//     // Cookies.set(
//     //   "skey",
//     //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpdGFzayIsImF1ZCI6ImFtVnVhWE5BWldjdVkyOXQiLCJleHAiOjE3NDU5MTEwNDcsInVpZCI6ImFtVnVhWE5BWldjdVkyOXQiLCJ5YyI6ImUzdHVlbVZ1ZlgxN2V6SXdmWDE3ZTI5eVlXbHNNalY5Zlh0N2IzSmhhV3d5TlgxOSIsInN2IjoiMCJ9.9n0tGL-CArkbq3sn0Bfh17xZC7sgubAOWaHDe7rl25w"
//     // );
//     const token = Cookies.get("skey");
//     if (token) {
//       getQueryParams();
//     } else {
//       console.warn("Token cookie not found");
//     }
//   }, []);

//   const decodeBase64 = (str) => {
//     if (!str) return null;
//     try {
//       return atob(str);
//     } catch (e) {
//       console.error("Error decoding base64:", e);
//       return null;
//     }
//   };

//   const fetchData = async (decoded) => {
//     console.log("decoded", decoded);
//     const sp = searchParams.get("sp");
//     if (decoded) {
//       const tokenPayload = {
//         con: '{"id":"","mode":"gettoken"}',
//         p: "{}",
//         f: "m-test2.orail.co.in (ConversionDetail)",
//       };
//       try {
//         const tokenResponse = await GetToken(
//           tokenPayload,
//           decoded?.yc,
//           decoded?.sv,
//           sp
//         );
//         const token = tokenResponse?.Data?.rd?.[0]?.token;
//         if (token) {
//           sessionStorage.setItem("Token", token);
//         }
//       } catch (err) {
//         console.error("GetToken error:", err);
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   const renderComponent = () => {
//     if (pid == 18223) {
//       return <Spliter isLoadingNew={isLoading} />; // 1315 Doc.
//     } else if (pid == 18226) {
//       return <DustCollector />; // 1383 Doc.
//     } else if (pid == 18227) {
//       return <ToolReport />; // 1382 Doc.
//     } else if (pid == 18228) {
//       return <MFGReturnJob />; // 1386 Doc.
//     } else if (pid == 18229) {
//       return <ConversionDeatil />; // 1385 Doc.
//     } else if (pid == 18230) {
//       return <FinishGoodsReport />; // 1388 Doc.
//     } else if (pid == 18231) {
//       return <MaterialWiseSaleReport />; // 1389 Doc.
//     } else if (pid == 1000) {
//       return <StcokReport />; // 1392 Doc.
//     } else if (pid == 18233) {
//       return <DeviceSpliter />; // 1392 Doc.
//     } else if (pid == 1001) {
//       return <JobCompletion />; // 1392 Doc.
//     } else {
//       return (
//         <div style={{ textAlign: "center", marginTop: "20%" }}>Invalid PID</div>
//       );
//     }
//   };

//   return (
//     <div>
//       {isLoading ? (
//         <div style={{ textAlign: "center", marginTop: "20%" }}>
//           <CircularProgress />
//         </div>
//       ) : (
//         renderComponent()
//       )}
//     </div>
//   );
// };

// export default GridMain;
