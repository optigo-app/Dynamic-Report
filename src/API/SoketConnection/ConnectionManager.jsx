import React, { useEffect, useRef } from "react";
import io from "socket.io-client";
import config from "./config";
import { useDeviceStatus } from "../../DeviceStatusContext";

const MyComponent = () => {
  const { deviceStatus } = useDeviceStatus();
  const socketRef = useRef(null); // persistent socket reference

  // Emit signal when deviceStatus changes
  useEffect(() => {
    if (deviceStatus) {
      handleBtnClick(deviceStatus);
    }
  }, [deviceStatus]);

  // Setup socket connection
  useEffect(() => {
    const { address, SoPath, di } = config;
    const details = {
      path: SoPath,
      transports: ["websocket"],
    };

    try {
      const socket = io.connect(address, details);
      socketRef.current = socket; // save to ref

      socket.on("connect", () => {
        console.log("Socket connected");
        socket.emit("joinRoom", di);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      socket.on("connect_error", (error) => {
        console.error("Connection Error:", error);
      });

      socket.on("connectToRoom", (data) => {
        console.log("Connected to room:", data);
      });

      socket.on("ReceiveSignal", (data) => {
        try {
          if (data && data.tvar) {
            comboRebind(data.tvar, data.tparam);
          }
        } catch (error) {
          console.error("Error handling ReceiveSignal:", error);
        }
      });
    } catch (error) {
      console.error("Socket connection error:", error);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Emit signal to server
  const handleBtnClick = (signal) => {
    console.log("signalsignal", signal);
    const socket = socketRef.current;
    if (socket && socket.connected) {
      const data = { roomno: config.di, tmode: "SendSignal", tvar: signal };
      socket.emit("SendSignal", data);
    } else {
      console.error("Socket is not connected.");
    }
  };

  // Handle incoming signals
  const comboRebind = (_tvar, _tparam) => {
    try {
      switch (_tvar.toLowerCase().trim()) {
        case "reacttest":
          alert("This is testing for socket");
          break;
        case "devicedisabled":
          // alert("This is testing for deviceDisabled");
          break;
        case "deviceenabled":
          // alert("This is testing for deviceenabled");
          break;
        case "forcelogout":
          // alert("This is testing for forcelogout");
          break;
        case "accountdeleted":
          // alert("This is testing for accountdeleted");
        case "customerbindchanged":
          // alert("This is testing for customerbindchanged");
          break;
        case "metal":
          alert("Metal change happened");
          break;
        default:
          break;
      }
    } catch (error) {
      console.error("Error in comboRebind:", error);
    }
  };

  return (
    <div>
      {/* <button onClick={() => handleBtnClick("deviceDisabled")}>
        Socket Event
      </button> */}
    </div>
  );
};

export default MyComponent;

// import React, { useEffect } from "react";
// import io from "socket.io-client";
// import config from "./config";
// import { useDeviceStatus } from "../../DeviceStatusContext";

// const MyComponent = () => {
//   const { deviceStatus } = useDeviceStatus();
//   let socket;

//   useEffect(() => {
//     if (deviceStatus) {
//       handleBtnClick(deviceStatus);
//     }
//   }, [deviceStatus]);

//   useEffect(() => {
//     const { address, SoPath, di } = config;
//     const details = {
//       path: SoPath,
//       transports: ["websocket"],
//     };

//     try {
//       socket = io.connect(address, details);

//       socket.on("connect", () => {
//         console.log("Socket connected");
//         socket.emit("joinRoom", di);
//       });

//       socket.on("disconnect", () => {
//         console.log("Socket disconnected");
//       });

//       socket.on("connect_error", (error) => {
//         console.error("Connection Error:", error);
//       });

//       socket.on("connectToRoom", (data) => {
//         console.log("Connected to room:", data);
//       });

//       socket.on("ReceiveSignal", (data) => {
//         try {
//           if (data && data.tvar) {
//             comboRebind(data.tvar, data.tparam);
//           }
//         } catch (error) {
//           console.error("Error handling ReceiveSignal:", error);
//         }
//       });
//     } catch (error) {
//       console.error("Socket connection error:", error);
//     }

//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, []);

//   const handleBtnClick = (signal) => {
//     console.log("signalsignal", signal);
//     if (socket) {
//       const data = { roomno: config.di, tmode: "SendSignal", tvar: signal };
//       socket.emit("SendSignal", data);
//     } else {
//       console.error("Socket is not connected.");
//     }
//   };

//   const comboRebind = (_tvar, _tparam) => {
//     try {
//       switch (_tvar.toLowerCase().trim()) {
//         case "reacttest":
//           if (typeof stockNotification === "function") {
//             // stockNotification();
//           }
//           alert("This is testing for socket");
//           break;
//         case "devicedisabled":
//           if (typeof stockNotification === "function") {
//             // stockNotification();
//           }
//           alert("This is testing for deviceDisabled");
//           break;
//         case "deviceenabled":
//           if (typeof stockNotification === "function") {
//             // stockNotification();
//           }
//           alert("This is testing for deviceenabled");
//           break;

//         case "metal":
//           if (typeof _ComboListArray_Metal === "function") {
//             // _ComboListArray_Metal();
//           }
//           alert("Metal change happened");
//           break;
//         default:
//           break;
//       }
//     } catch (error) {
//       console.error("Error in comboRebind:", error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={() => handleBtnClick('deviceDisabled')}>Socket Event</button>
//     </div>
//   );
// };

// export default MyComponent;
