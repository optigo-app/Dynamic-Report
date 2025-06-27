// http://localhost:3000/testreport/?sp=9&ifid=ToolsReport&pid=18279

import React, { useEffect, useState, useRef } from "react";
import Box from "@mui/material/Box";
import "./OSRReportSpliter.scss";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import "react-datepicker/dist/react-datepicker.css";
import { GetWorkerData } from "../../API/GetWorkerData/GetWorkerData";
import { IoRefreshCircle } from "react-icons/io5";
import AllEmployeeDataReport from "./AllEmployeeDataReport/AllEmployeeDataReport";
import DualDatePicker from "../DatePicker/DualDatePicker";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const formatToMMDDYYYY = (date) => {
  const d = new Date(date);
  return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d
    .getDate()
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

export default function OSRReportSpliter() {
  const [selectCustomerCode, setSelectCustomerCode] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [totalCount, setTotalCount] = useState();
  const [paneWidths, setPaneWidths] = useState(["25%", "75%"]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [status500, setStatus500] = useState(false);
  const [showSalesRep, setShowSalesRep] = useState(true);
  const [searchParams] = useSearchParams();
  const [selectedSalesRepCode, setSelectedSalesRepCode] = useState();
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [allEmployeeDataMain, setAllEmployeeDataMain] = useState([]);
  const [allEmployeeData, setAllEmployeeData] = useState([]);
  const [locationSummaryData, setLocationSummaryData] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [AllFinalData, setFinalData] = useState();
  const [selectedDateColumn, setSelectedDateColumn] = useState("");
  const [dateColumnOptions, setDateColumnOptions] = useState([]);
  const [isRefreshEnabled, setIsRefreshEnabled] = useState(false);
  const [filterState, setFilterState] = useState({
    dateRange: { startDate: null, endDate: null },
  });
  const firstTimeLoadedRef = useRef(false);
  const containerRef = useRef();
  const [uniqueMetalTypes, setUniqueMetalTypes] = useState([]);
  const rawDataRef = useRef([]); // hold raw data from API (merged and mapped)
  const [isPaneCollapsed, setIsPaneCollapsed] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const items = document.querySelectorAll(
        ".MuiButtonBase-root.MuiListItem-root.MuiListItem-gutters.MuiListItem-padding.MuiListItem-button"
      );
      items.forEach((item) => {
        const textElement = item.querySelector(".MuiListItemText-root");
        if (textElement) {
          const text = textElement.textContent.trim();
          if (text === "Last Year" || text === "This Year") {
            item.style.display = "none";
          }
        }
      });
    }, 100);
  }, []);

  useEffect(() => {
    startEnableTimer();
  }, []);

  useEffect(() => {
    const allColumData = [
      {
        colid: 2,
        headerName: "Order Date",
        field: "entrydate",
        Width: 150,
        hrefLink: "",
        dateColumn: true,
        summaryTitle: "",
        summuryValueKey: 0,
      },
      {
        colid: 3,
        headerName: "Promise Date",
        field: "promisedate",
        Width: 150,
        Align: "center",
        hrefLink: "",
        ColumFilter: true,
        NormalFilter: false,
        EditData: true,
        dateColumn: true,
        summaryTitle: "",
        summuryValueKey: 0,
      },
    ];
    if (allColumData) {
      const dateCols = allColumData.filter((col) => col.dateColumn === true);
      setDateColumnOptions(
        dateCols.map((col) => ({
          field: col.field,
          label: col.headerName,
        }))
      );

      if (dateCols.length > 0) {
        setSelectedDateColumn(dateCols[0].field);
      }
    }
  }, []);

  useEffect(() => {
    const now = new Date();
    const formattedDate = formatToMMDDYYYY(now);
    setStartDate(formattedDate);
    setEndDate(formattedDate);
    setFilterState({
      dateRange: {
        startDate: now,
        endDate: now,
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedDateColumn || !filterState?.dateRange?.startDate) return;
    fetchDataOnce(); // only on first mount
  }, [selectedDateColumn, filterState.dateRange]);

  const fetchDataOnce = async () => {
    if (firstTimeLoadedRef.current) return;
    firstTimeLoadedRef.current = true;

    const sp = searchParams.get("sp");
    setIsLoading(true);
    const body = {
      con: '{"id":"","mode":"osrreport","appuserid":"amrut@eg.com"}',
      p: "{}",
      f: "Task Management (taskmaster)",
    };

    try {
      const fetchedData = await GetWorkerData(body, sp);
      const { rd, rd1 } = fetchedData?.Data || {};
      if (Array.isArray(rd) && Array.isArray(rd1)) {
        const keyMap = Object.entries(rd[0]).reduce((acc, [numKey, name]) => {
          acc[numKey] = name.toLowerCase();
          return acc;
        }, {});
        const mergedData = rd1.map((record) => {
          const mapped = {};
          for (const [key, value] of Object.entries(record)) {
            const newKey = keyMap[key] || key;
            mapped[newKey] = value;
          }
          return mapped;
        });

        rawDataRef.current = mergedData;
        filterData();
        setFinalData(fetchedData?.Data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      if (error?.status == 500) setStatus500(true);
      setAllEmployeeData([]);
      setFinalData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const normalizeDateOnly = (d) => {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    return dt;
  };

  const filterData = () => {
    const { startDate: s, endDate: e } = filterState.dateRange;
    if (!s || !e || !selectedDateColumn) {
      console.warn("Missing filter dates or selected date column");
      return;
    }

    const from = normalizeDateOnly(new Date(s));
    const to = normalizeDateOnly(new Date(e));

    const parseDate = (value) => {
      if (!value) return null;

      if (Object.prototype.toString.call(value) === "[object Date]") {
        return isNaN(value.getTime()) ? null : normalizeDateOnly(value);
      }

      if (typeof value === "string") {
        const parts = value.trim().split(" ");
        if (parts.length !== 3) return null;

        const [day, monthStr, year] = parts;
        const dateStr = `${day} ${monthStr} ${year}`;
        const parsed = new Date(dateStr);
        return isNaN(parsed.getTime()) ? null : normalizeDateOnly(parsed);
      }

      return null;
    };

    const dateFiltered = rawDataRef.current.filter((item) => {
      const rawDateValue = item[selectedDateColumn.trim()];
      const itemDate = parseDate(rawDateValue);
      return itemDate && itemDate >= from && itemDate <= to;
    });

    const totalCount = dateFiltered.reduce(
      (sum, item) => sum + item.totalcnt,
      0
    );
    setTotalCount(totalCount);

    const filteredData = dateFiltered?.filter((item) =>
      showSalesRep ? item.isdefaultcustomer === 0 : item.isdefaultcustomer === 1
    );

    if (!showSalesRep) {
      setAllEmployeeDataMain(dateFiltered);
      setAllEmployeeData(filteredData);
      GetTotlaData(filteredData);
    } else {
      const uniqueSalesReps = [
        ...new Set(
          filteredData?.map((item) => item.salesrepcode).filter(Boolean)
        ),
      ];

      setUniqueMetalTypes(uniqueSalesReps);

      const defaultRepCode = selectedSalesRepCode || uniqueSalesReps[0];
      setSelectedSalesRepCode(defaultRepCode);

      const finalFiltered = dateFiltered.filter(
        (item) =>
          item.salesrepcode?.toLowerCase() === defaultRepCode?.toLowerCase()
      );

      setAllEmployeeDataMain(dateFiltered);
      setAllEmployeeData(finalFiltered);
      GetTotlaData(finalFiltered);
    }
  };

  useEffect(() => {
    if (firstTimeLoadedRef.current) {
      filterData();
    }
  }, [selectedDateColumn, filterState, selectedSalesRepCode, showSalesRep]);

  const GetTotlaData = (allEmployeeData) => {
    console.log(
      "allEmployeeDataallEmployeeDataallEmployeeData",
      allEmployeeData
    );

    if (!allEmployeeData?.length) {
      setLocationSummaryData([]);
      return;
    }
    const summaryMap = new Map();
    allEmployeeData.forEach((item) => {
      const { customerfirmname, customercode, totalcnt } = item;

      const key = `${customerfirmname}_${customercode}`;
      if (!summaryMap.has(key)) {
        summaryMap.set(key, {
          customerfirmname,
          customercode,
          totalcnt: 0,
        });
      }
      const existing = summaryMap.get(key);
      existing.totalcnt += Number(totalcnt) || 0;
    });

    const summaryList = Array.from(summaryMap.values()).map((item) => ({
      customerfirmname: item.customerfirmname,
      customercode: item.customercode,
      totalcnt: item.totalcnt,
    }));
    setLocationSummaryData(summaryList);
    setSelectCustomerCode(summaryList[0]?.customercode);
  };

  const handleDrag = (index, e) => {
    const startX = e.clientX;
    const startWidths = [...paneWidths.map((w) => parseFloat(w))];
    const containerWidth = containerRef.current.offsetWidth;

    const onMouseMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      const percentDelta = (delta / containerWidth) * 100;

      const newWidths = [...startWidths];
      newWidths[index] = Math.max(5, startWidths[index] + percentDelta);
      newWidths[index + 1] = Math.max(5, startWidths[index + 1] - percentDelta);
      const total = newWidths.reduce((a, b) => a + b, 0);

      if (total <= 100) {
        setPaneWidths(newWidths.map((w) => `${w}%`));
      }
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const handleToggle = (location) => {
    setExpandedEmployee((prev) => (prev === location ? null : location));
  };

  const startEnableTimer = () => {
    setIsRefreshEnabled(false); // disable right away
    setTimeout(() => {
      setIsRefreshEnabled(true); // enable after 2 mins
    }, 2 * 60 * 1000); // 2 minutes in ms
  };

  const handleRefresh = () => {
    if (!isRefreshEnabled) return;
    window.location.reload();
    startEnableTimer();
  };

  const handleClose = () => {
    setIsPaneCollapsed(true);
    setPaneWidths(["0%", "100%"]);
  };

  const handleOpen = () => {
    setIsPaneCollapsed(false);
    setPaneWidths(["25%", "75%"]);
  };

  const handleToggleNew = () => {
    setShowSalesRep(!showSalesRep);
  };

  return (
    <div className="OSRReportSpliter_top">
      {isLoading && (
        <div className="loader-overlay">
          <CircularProgress className="loadingBarManage" />
        </div>
      )}
      <Box
        sx={{ height: "100vh", display: "flex", flexDirection: "row" }}
        ref={containerRef}
      >
        {!status500 && (
          <div className="pane" style={{ width: paneWidths[0] }}>
            <div style={{ height: "100vh" }}>
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  justifyContent: "space-between",
                  height: "10vh",
                  padding: "8px 8px 0px 8px",
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <FormControl
                      size="small"
                      sx={{ minWidth: 100, margin: "0px" }}
                    >
                      <InputLabel>Date Type</InputLabel>
                      <Select
                        label="Date Type"
                        value={selectedDateColumn}
                        onChange={(e) => setSelectedDateColumn(e.target.value)}
                      >
                        {dateColumnOptions.map((col) => (
                          <MenuItem key={col.field} value={col.field}>
                            {col.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <DualDatePicker
                      filterState={filterState}
                      setFilterState={setFilterState}
                      validDay={31}
                      validMonth={1}
                    />
                  </div>
                  <div
                    style={{ display: "flex", marginTop: "10px", gap: "10px" }}
                  >
                    <div className="toggle_wrapper">
                      {!isLoading && (
                        <div
                          className="slider-container"
                          onClick={handleToggleNew}
                        >
                          <div
                            className={`active-indicator ${
                              showSalesRep ? "left" : "right"
                            }`}
                          ></div>
                          <div className={`panel department-panel`}>
                            <p>Sales Rep</p>
                          </div>
                          <div className={`panel employee-panel`}>
                            <p>Company</p>
                          </div>
                        </div>
                      )}
                    </div>
                    {showSalesRep && uniqueMetalTypes?.length !== 0 && (
                      <select
                        value={selectedSalesRepCode}
                        onChange={(e) =>
                          setSelectedSalesRepCode(e.target.value)
                        }
                        className="dropdownList_metal"
                      >
                        {uniqueMetalTypes.map((metal) => (
                          <option key={metal} value={metal}>
                            {metal}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", height: "100%" }}>
                  <IoRefreshCircle
                    onClick={handleRefresh}
                    style={{
                      color: "rebeccapurple",
                      fontSize: "29px",
                      cursor: isRefreshEnabled ? "pointer" : "not-allowed",
                      opacity: isRefreshEnabled ? 1 : 0.5,
                    }}
                  />
                </div>
              </div>
              <div
                className="employee-list"
                style={{ padding: "0px 8px 0px 8px" }}
              >
                {locationSummaryData?.length != 0
                  ? locationSummaryData?.map((emp) => {
                      const isExpanded = expandedEmployee === emp.customercode;
                      return (
                        <div
                          key={emp.customercode}
                          className={
                            selectCustomerCode == emp.customercode
                              ? "employee_card_selected"
                              : "employee-card"
                          }
                        >
                          <div
                            className="employee-header"
                            onClick={() => {
                              handleToggle(emp.customercode);
                              setSelectCustomerCode(emp.customercode);
                            }}
                          >
                            <div className="location_first">
                              <span
                                className={
                                  selectCustomerCode == emp.customercode &&
                                  "location_top_name"
                                }
                              >
                                {emp?.customerfirmname}({emp.customercode})
                              </span>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                gap: "15px",
                                marginTop: "10px",
                              }}
                            >
                              <p
                                className={
                                  selectCustomerCode == emp.customercode
                                    ? "employee_detail_title"
                                    : "employee_detail"
                                }
                                style={{ width: "50%" }}
                              >
                                Total : <b>{emp?.totalcnt}</b>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : !isLoading && (
                      <div
                        style={{
                          height: "60vh",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "column",
                        }}
                      >
                        <p
                          style={{
                            fontWeight: 600,
                            fontSize: "17px",
                            margin: "0px",
                          }}
                        >
                          No Sales Rep Available
                        </p>
                        {/* <p
                          style={{
                            fontWeight: 600,
                            color: "#7a7676",
                            margin: "0px",
                          }}
                        >
                          Select Month & Year
                        </p> */}
                      </div>
                    )}
              </div>
              <div
                style={{
                  margin: "5px",
                }}
              >
                <div className="bottomTotla_main">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div className="bottomTotal_box_main">
                      <p className="bottomTotal_box_title">Total Count</p>
                      <p className="bottomTotal_box_title">{totalCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {paneWidths[1] !== "0%" && (
          <>
            <div className="splitter" onMouseDown={(e) => handleDrag(0, e)} />
            <div className="pane" style={{ width: paneWidths[1] }}>
              <AllEmployeeDataReport
                AllFinalData={allEmployeeData}
                selectCustomerCode={selectCustomerCode}
                onClosePane={handleClose}
                onOpenPane={handleOpen}
                isPaneCollapsed={isPaneCollapsed}
              />
            </div>
          </>
        )}

        {status500 && (
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
                  Something Went Wrong
                </Typography>

                <Typography variant="body1" color="text.secondary" mb={3}>
                  We're sorry, but an unexpected error has occurred. Please try
                  again later.
                </Typography>

                {/* <Button
                  variant="contained"
                  color="error"
                  sx={{ textTransform: "none", borderRadius: "10px", px: 4 }}
                >
                  Try Again
                </Button> */}
              </Paper>
            </Box>
          </div>
        )}
      </Box>
    </div>
  );
}
