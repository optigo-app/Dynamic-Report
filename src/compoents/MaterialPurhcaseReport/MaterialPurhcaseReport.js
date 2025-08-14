// http://localhost:3000/testreport/?sp=9&ifid=ToolsReport&pid=18307

import React, { useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import "./MaterialPurhcaseReport.scss";
import OtherKeyData from "./MaterialPurhcaseReport.json";
import DatePicker from "react-datepicker";
// import masterData from "./masterData.json";
import mainButton from "../images/Mail_32.png";
import printButton from "../images/print.png";
import customerR from "../images/customerR.png";
import gridView from "../images/GriedView.png";
import imageView from "../images/ImageView2.png";
import { RiFullscreenLine } from "react-icons/ri";
import "react-datepicker/dist/react-datepicker.css";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  Drawer,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  Slide,
  TextField,
  Typography,
} from "@mui/material";
import emailjs from "emailjs-com";
import {
  MdExpandMore,
  MdOpenInFull,
  MdOutlineFilterAlt,
  MdOutlineFilterAltOff,
} from "react-icons/md";
import CustomTextField from "../text-field/index";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AiFillSetting } from "react-icons/ai";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DualDatePicker from "../DatePicker/DualDatePicker";
import { GetWorkerData } from "../../API/GetWorkerData/GetWorkerData";
import { useSearchParams } from "react-router-dom";
import { AlertTriangle, CircleX } from "lucide-react";
import { IoMdClose } from "react-icons/io";
import Warper from "../WorkerReportSpliterView/AllEmployeeDataReport/warper";
import dayjs from "dayjs";

let popperPlacement = "bottom-start";
const ItemType = {
  COLUMN: "COLUMN",
};
const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DraggableColumn = ({ col, index, checkedColumns, setCheckedColumns }) => {
  return (
    <Draggable draggableId={col.field.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "8px",
            border: "1px solid lightgray",
            marginBottom: "15px",
            height: "55px",
            background: snapshot.isDragging ? "#e0e0e0" : "rgb(234, 234, 234)",
            borderRadius: "4px",
            cursor: "grab",
            opacity: snapshot.isDragging ? 0.5 : 1,
            transition: "opacity 0.2s ease",
            ...provided.draggableProps.style,
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={checkedColumns[col.field]}
                onChange={() =>
                  setCheckedColumns((prev) => ({
                    ...prev,
                    [col.field]: !prev[col.field],
                  }))
                }
              />
            }
            label={col.headerName}
          />
        </div>
      )}
    </Draggable>
  );
};

const formatToMMDDYYYY = (date) => {
  const d = new Date(date);
  return `${(d.getMonth() + 1).toString().padStart(2, "0")}/${d
    .getDate()
    .toString()
    .padStart(2, "0")}/${d.getFullYear()}`;
};

export default function MaterialPurhcaseReport() {
  const [isLoading, setIsLoading] = useState(false);
  const [toDate, setToDate] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [open, setOpen] = useState(false);
  const gridContainerRef = useRef(null);
  const [showImageView, setShowImageView] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [columns, setColumns] = useState([]);
  const [openPDate, setOpenPDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRd3Name, setSelectedRd3Name] = useState("");
  const [masterKeyData, setMasterKeyData] = useState();
  const [allColumIdWiseName, setAllColumIdWiseName] = useState();
  const [allColumData, setAllColumData] = useState();
  const [allRowData, setAllRowData] = useState();
  const [checkedColumns, setCheckedColumns] = useState({});
  const [selectedDepartmentId, setSelectedDepartmentId] = useState();
  const [selectedEmployeeCode, setSelectedEmployeeCode] = useState();
  const [lastUpdated, setLastUpdated] = useState("");
  const gridRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [AllFinalData, setFinalData] = useState();
  const [status500, setStatus500] = useState(false);
  const [purchaseBtnDis, setPurchaseBtnDis] = useState(false);
  const [commonSearch, setCommonSearch] = useState("");
  const [sortModel, setSortModel] = React.useState([
    { field: "invoicedate", sort: "desc" },
  ]);

  const [allUserNameList, setAllUserNameList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("ALL Users");

  const [allCurrencyData, setAllCurrencyData] = useState([]);
  const [selectedDateColumn, setSelectedDateColumn] = useState("INR");

  const [selectedMetal, setSelectedMetal] = useState("Select Material");
  const [selectedDateColumnHyBrid, setSelectedDateColumnHyBrid] =
    useState("ALL");
  const [materialPurchase, setMaterialPurchase] = useState("ALL");
  const [purchaseAgainMemo, setPurchaseAgainMemo] = useState("ALL");
  const [currencyAdjustedRows, setCurrencyAdjustedRows] = useState([]);
  const [grupEnChekBox, setGrupEnChekBox] = useState({
    designation: true,
    dept: true,
    empname: true,
  });
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 20,
  });
  const [showAllData, setShowAllData] = useState(false);
  const [filterState, setFilterState] = useState({
    dateRange: { startDate: null, endDate: null },
  });

  const firstTimeLoadedRef = useRef(false);

  useEffect(() => {
    const now = new Date();
    const formattedDate = formatToMMDDYYYY(now);
    setStartDate(formattedDate);
    setEndDate(formattedDate);
    fetchData(formattedDate, formattedDate);
    getMasterData();
    setFilterState({
      dateRange: {
        startDate: now,
        endDate: now,
      },
    });
    setTimeout(() => {
      firstTimeLoadedRef.current = true;
    }, 0);
  }, []);

  useEffect(() => {
    if (!firstTimeLoadedRef.current) return;
    const { startDate: s, endDate: e } = filterState.dateRange;
    if (s && e) {
      const formattedStart = formatToMMDDYYYY(new Date(s));
      const formattedEnd = formatToMMDDYYYY(new Date(e));

      setStartDate(formattedStart);
      setEndDate(formattedEnd);

      fetchData(formattedStart, formattedEnd);
      getMasterData();
    }
  }, [filterState.dateRange]);

  const getMasterData = async () => {
    const sp = searchParams.get("sp");
    let AllData = JSON.parse(sessionStorage.getItem("AuthqueryParams"));
    const body = {
      con: `{"id":"","mode":"materialpurchasereport_master","appuserid":"${AllData?.uid}"}`,
      p: "",
      f: "Task Management (taskmaster)",
    };
    try {
      const fetchedData = await GetWorkerData(body, sp);
      setAllCurrencyData(fetchedData?.Data?.rd);
      setAllUserNameList(fetchedData?.Data?.rd2);
    } catch (error) {
      if (error?.status == 500) {
        setStatus500(true);
      }
      setIsLoading(false);
    }
  };

  const fetchData = async (stat, end) => {
    const sp = searchParams.get("sp");
    let AllData = JSON.parse(sessionStorage.getItem("AuthqueryParams"));

    setIsLoading(true);
    const body = {
      con: `{"id":"","mode":"materialpurchasereport","appuserid":"${AllData?.uid}"}`,
      p: `{"fdate":"${stat}","tdate":"${end}"}`,
      f: "Task Management (taskmaster)",
    };

    try {
      const fetchedData = await GetWorkerData(body, sp);
      if (showAllData) {
        setFilterState({
          ...filterState,
          dateRange: {
            startDate: null,
            endDate: null,
          },
        });
        setShowAllData(false);
      }
      setAllRowData(fetchedData?.Data?.rd1);
      setAllColumIdWiseName(fetchedData?.Data?.rd);
      setMasterKeyData(OtherKeyData?.rd);
      setAllColumData(OtherKeyData?.rd1);
      setFinalData(fetchedData?.Data);
      setIsLoading(false);
    } catch (error) {
      if (error?.status == 500) {
        setStatus500(true);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const now = new Date();
    const formatNumber = (n) => n.toString().padStart(2, "0");

    const formattedDate = `${formatNumber(now.getDate())}-${formatNumber(
      now.getMonth() + 1
    )}-${now.getFullYear()} ${formatNumber(now.getHours())}:${formatNumber(
      now.getMinutes()
    )}:${formatNumber(now.getSeconds())}`;

    setLastUpdated(formattedDate);
  }, []);

  useEffect(() => {
    if (allColumData) {
      const initialCheckedColumns = {};
      Object?.values(allColumData)?.forEach((col) => {
        initialCheckedColumns[col.field] = col.ColumShow;
      });
      setCheckedColumns(initialCheckedColumns);
    }
  }, [allColumData]);

  useEffect(() => {
    if (!allColumData) return;
    const columnData = Object?.values(allColumData)
      ?.filter((col) => col.ColumShow)
      ?.map((col, index) => {
        const isPriorityFilter = col.proiorityFilter === true;
        return {
          field: col.field,
          headerName: (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {col.GrupChekBox && (
                <Checkbox
                  checked={grupEnChekBox[col.field] ?? true} // 👉 Correct binding to grupEnChekBox
                  onChange={() => handleGrupEnChekBoxChange(col.field)} // 👉 Correct handler
                  size="small"
                  sx={{ p: 0 }}
                />
              )}
              {col.headerName}
            </div>
          ),
          headerNameSub: col?.headerName,
          width: col.Width,
          align: col.ColumAlign || "left",
          headerAlign: col.Align,
          filterable: col.ColumFilter,
          suggestionFilter: col.suggestionFilter,
          hrefLink: col.HrefLink,
          summuryValueKey: col.summuryValueKey,
          summaryTitle: col.summaryTitle,
          ToFixedValue: col.ToFixedValue,
          flex: 1,
          sortable: col.sortable,
          filterTypes: [
            col.NormalFilter && "NormalFilter",
            col.DateRangeFilter && "DateRangeFilter",
            col.multiSelection && "multiSelection",
            col.RangeFilter && "RangeFilter",
            col.suggestionFilter && "suggestionFilter",
            col.selectDropdownFilter && "selectDropdownFilter",
          ].filter(Boolean),

          renderCell: (params) => {
            if (col.ToFixedValue) {
              return (
                <span
                  style={{
                    color: col.Color || "inherit",
                    backgroundColor: col.BackgroundColor || "inherit",
                    fontSize: col.FontSize || "inherit",
                    textTransform: col.ColumTitleCapital ? "uppercase" : "none",
                    padding: "0px",
                    borderRadius: col.BorderRadius,
                  }}
                >
                  {params.value?.toFixed(col.ToFixedValue)}
                </span>
              );
            } else if (params?.field === "istorecust_customercode1") {
              return (
                <span
                  style={{
                    color: col.Color || "inherit",
                    backgroundColor: col.BackgroundColor || "inherit",
                    fontSize: col.FontSize || "inherit",
                    textTransform: col.ColumTitleCapital ? "uppercase" : "none",
                    padding: "0px",
                    borderRadius: col.BorderRadius,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <p className="osr_mainName">
                    <b>{params.value}</b>
                  </p>
                  <p className="osr_subname">
                    {params?.row?.istorecust_customercode}
                  </p>
                </span>
              );
            } else if (col.dateColumn == true) {
              const formattedDate =
                params.value && !isNaN(new Date(params.value).getTime())
                  ? new Date(params.value).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "";
              return (
                <span
                  style={{
                    color: col.Color || "inherit",
                    backgroundColor: col.BackgroundColor || "inherit",
                    fontSize: col.FontSize || "inherit",
                    textTransform: col.ColumTitleCapital ? "uppercase" : "none",
                    padding: "0px",
                    borderRadius: col.BorderRadius,
                  }}
                >
                  {formattedDate}
                </span>
              );
            } else if (col.hrefLink) {
              return (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: "blue",
                      textDecoration: "underline",
                      fontSize: col.FontSize || "inherit",
                      padding: "0px",
                      cursor: "pointer",
                      fontSize: col.FontSize || "inherit",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      width: "120px",
                    }}
                    onClick={() => handleClick(params)}
                  >
                    {params.value}
                  </a>

                  <img
                    src={customerR}
                    style={{ cursor: "pointer", width: "20px", height: "20px" }}
                    onClick={() => handleClickInvoiceImg(params)}
                  />
                </div>
              );
            } else {
              return (
                <span
                  style={{
                    color: col.Color || "inherit",
                    backgroundColor: col.BackgroundColor || "inherit",
                    fontSize: col.FontSize || "inherit",
                    textTransform: col.ColumTitleCapital ? "uppercase" : "none",
                    padding: "0px",
                    borderRadius: col.BorderRadius,
                  }}
                >
                  {params.value}
                </span>
              );
            }
          },
        };
      });

    const srColumn = {
      field: "sr",
      headerName: "Sr#",
      width: 70,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const indexOnPage = params.api.getRowIndexRelativeToVisibleRows(
          params.id
        );
        return (
          paginationModel.page * paginationModel.pageSize + indexOnPage + 1
        );
      },
    };

    setColumns([srColumn, ...columnData]);
  }, [allColumData, grupEnChekBox, sortModel, paginationModel]);

  //  if (params?.field === "ratecolum") {
  //           const totalWt = parseFloat(params?.row?.totalwt) || 0;
  //           const tunchWeight = parseFloat(params?.row?.tunchweight) || 0;
  //           const totalPrice = parseFloat(params?.row?.totalprice) || 0;

  //           const calculatedWeight = (totalWt * tunchWeight) / 100;
  //           const finalValue =
  //             calculatedWeight > 0 ? totalPrice / calculatedWeight : null;

  //           return (
  //             <span
  //               style={{
  //                 color: col.Color || "inherit",
  //                 backgroundColor: col.BackgroundColor || "inherit",
  //                 fontSize: col.FontSize || "inherit",
  //                 textTransform: col.ColumTitleCapital ? "uppercase" : "none",
  //                 padding: "0px",
  //                 borderRadius: col.BorderRadius,
  //               }}
  //             >
  //               {finalValue ? finalValue.toFixed(col.ToFixedValue ?? 2) : "-"}
  //             </span>
  //           );
  //         }

  const handleCellClick = (params) => {
    setSelectedDepartmentId(params?.row?.deptid);
    setSelectedEmployeeCode(params?.row?.employeecode);
    setOpen(true);
  };

  const originalRows =
    allColumIdWiseName &&
    allRowData?.map((row, index) => {
      const formattedRow = {};
      Object.keys(row).forEach((key) => {
        formattedRow[allColumIdWiseName[0][key]] = row[key];
      });
      return { id: index, ...formattedRow };
    });

  const [filteredRows, setFilteredRows] = useState(originalRows);
  const [filters, setFilters] = useState({});
  const uniqueCustomers = [
    "Select Material",
    ...Array.from(new Set(originalRows?.map((row) => row?.itemname))),
  ];

  useEffect(() => {
    const newFilteredRows = originalRows?.filter((row) => {
      let isMatch = true;

      if (materialPurchase === "MaterialPurchase") {
        isMatch = parseInt(row.isoldmetal) === 0;
      }

      if (materialPurchase === "OldMetalPurchase") {
        isMatch = parseInt(row.isoldmetal) === 1;
      }

      if (
        selectedDateColumnHyBrid === "Hybrid" &&
        parseInt(row.ishybridbill) !== 1
      ) {
        return false;
      }

      if (
        purchaseAgainMemo === "PurchaseAgainst" &&
        parseInt(row.ispurchaseagainstmemo) === 0
      ) {
        return false;
      }

      if (
        selectedUser !== "ALL Users" &&
        parseInt(selectedUser) !== row.salesrep_id
      ) {
        return false;
      }

      if (isMatch && selectedMetal !== "Select Material") {
        if (row.itemname !== selectedMetal) {
          isMatch = false;
        }
      }

      for (const filterField of Object.keys(filters)) {
        const filterValue = filters[filterField];
        if (!filterValue || filterValue.length === 0) continue;

        if (filterField.includes("_min") || filterField.includes("_max")) {
          const baseField = filterField.replace("_min", "").replace("_max", "");
          const rowValue = parseFloat(row[baseField]);
          if (isNaN(rowValue)) {
            isMatch = false;
            break;
          }
          if (
            filterField.includes("_min") &&
            parseFloat(filterValue) > rowValue
          ) {
            isMatch = false;
            break;
          }
          if (
            filterField.includes("_max") &&
            parseFloat(filterValue) < rowValue
          ) {
            isMatch = false;
            break;
          }
        } else if (Array.isArray(filterValue)) {
          if (!filterValue.includes(row[filterField])) {
            isMatch = false;
            break;
          }
        } else {
          const rowValue = row[filterField]?.toString().toLowerCase() || "";
          if (!rowValue.includes(filterValue.toLowerCase())) {
            isMatch = false;
            break;
          }
        }
      }
      if (isMatch && selectedColors.length > 0 && row.PriorityId) {
        if (!selectedColors.includes(row.PriorityId)) {
          isMatch = false;
        }
      }
      if (isMatch && fromDate && toDate) {
        const dateColumn = columns.find(
          (col) =>
            col.filterTypes && col.filterTypes.includes("DateRangeFilter")
        );
        if (dateColumn) {
          const rowDate = new Date(row[dateColumn.field]);
          if (
            isNaN(rowDate.getTime()) ||
            rowDate < fromDate ||
            rowDate > toDate
          ) {
            isMatch = false;
          }
        }
      }
      if (isMatch && commonSearch) {
        const searchText = commonSearch.toLowerCase();
        const hasMatch = Object.values(row).some((value) =>
          value?.toString().toLowerCase().includes(searchText)
        );
        if (!hasMatch) {
          isMatch = false;
        }
      }
      return isMatch;
    });
    const rowsWithSrNo = newFilteredRows?.map((row, index) => ({
      ...row,
      srNo: index + 1,
    }));
    setFilteredRows(rowsWithSrNo);

    const selectedCurrency = allCurrencyData?.find(
      (c) => c.Currencycode === selectedDateColumn
    );
    const rate = selectedCurrency?.CurrencyRate || 1;
    const safeRows = Array.isArray(rowsWithSrNo) ? rowsWithSrNo : [];
    const currencyUpdatedRows = safeRows.map((row) => ({
      ...row,
      totalprice: row.totalprice
        ? parseFloat((row.totalprice / rate).toFixed(2))
        : row.totalprice,
    }));
    const sorted = [...currencyUpdatedRows].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    setCurrencyAdjustedRows(sorted);
  }, [
    filters,
    commonSearch,
    fromDate,
    toDate,
    columns,
    originalRows,
    selectedColors,
    selectedDateColumn,
    selectedUser,
    selectedDateColumnHyBrid,
    purchaseAgainMemo,
    materialPurchase,
    selectedMetal,
    allCurrencyData,
  ]);

  const handleFilterChange = (field, value, filterType) => {
    setFilters((prevFilters) => {
      if (filterType === "multiSelection") {
        const selectedValues = prevFilters[field] || [];
        let newValues;

        if (value.checked) {
          newValues = [...selectedValues, value.value];
        } else {
          newValues = selectedValues.filter((v) => v !== value.value);
        }

        return {
          ...prevFilters,
          [field]: newValues,
        };
      }
      return {
        ...prevFilters,
        [field]: value,
      };
    });
  };

  const renderFilter = (col) => {
    if (!col.filterTypes || col.filterTypes.length === 0) return null;
    const filtersToRender = col.filterTypes;
    return filtersToRender.map((filterType) => {
      switch (filterType) {
        case "NormalFilter":
          return (
            <div style={{ margin: "10px", width: "100%" }} key={col.field}>
              <CustomTextField
                key={`filter-${col.field}-NormalFilter`}
                type="text"
                placeholder={`${col.headerNameSub}`}
                value={filters[col.field] || ""}
                onChange={(e) => handleFilterChange(col.field, e.target.value)}
                className="filter_column_box"
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  const [highlightedIndex, setHighlightedIndex] = useState({});
  const [suggestionVisibility, setSuggestionVisibility] = useState({});
  const suggestionRefs = useRef({});
  useEffect(() => {
    function handleClickOutside(event) {
      for (const field in suggestionRefs.current) {
        if (
          suggestionRefs.current[field] &&
          !suggestionRefs.current[field].contains(event.target)
        ) {
          setSuggestionVisibility((prev) => ({
            ...prev,
            [field]: false,
          }));
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderFilterSuggestionFilter = (col) => {
    if (!col.filterTypes || col.filterTypes.length === 0) return null;

    const filtersToRender = col.filterTypes;

    return filtersToRender.map((filterType) => {
      if (filterType !== "suggestionFilter") return null;
      const field = col.field;
      const inputValue = filters[field]?.toLowerCase() || "";
      const suggestions =
        inputValue.length > 0
          ? [
              ...new Set(
                originalRows
                  .map((row) => row[field])
                  .filter(
                    (val) =>
                      val && val.toString().toLowerCase().includes(inputValue)
                  )
              ),
            ]
          : [];

      const handleInputChange = (value) => {
        handleFilterChange(field, value.trimStart());
        setSuggestionVisibility((prev) => ({ ...prev, [field]: true }));
        setHighlightedIndex((prev) => ({ ...prev, [field]: 0 }));
      };

      const handleSelectSuggestion = (value) => {
        handleFilterChange(field, value);
        setSuggestionVisibility((prev) => ({ ...prev, [field]: false }));
        setHighlightedIndex((prev) => ({ ...prev, [field]: 0 }));
      };

      const handleKeyDown = (e) => {
        if (!suggestionVisibility[field] || suggestions.length === 0) return;

        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlightedIndex((prev) => ({
            ...prev,
            [field]: Math.min((prev[field] ?? 0) + 1, suggestions.length - 1),
          }));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlightedIndex((prev) => ({
            ...prev,
            [field]: Math.max((prev[field] ?? 0) - 1, 0),
          }));
        } else if (e.key === "Enter") {
          e.preventDefault();
          const current = suggestions[highlightedIndex[field] ?? 0];
          if (current) handleSelectSuggestion(current);
        }
      };

      const refCallback = (node) => {
        if (node) {
          suggestionRefs.current[field] = node;
        }
      };

      return (
        <div
          key={`filter-${field}-suggestionFilter`}
          ref={refCallback}
          style={{ margin: "10px", position: "relative" }}
        >
          <CustomTextField
            fullWidth
            placeholder={col?.headerNameSub}
            value={filters[field] || ""}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
              if ((filters[field] || "").trim().length > 0) {
                setSuggestionVisibility((prev) => ({ ...prev, [field]: true }));
              }
            }}
            onKeyDown={handleKeyDown}
            size="small"
            variant="filled"
            autoComplete="off"
          />

          {suggestionVisibility[field] && suggestions.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                width: "100%",
                maxHeight: "300px",
                overflowY: "auto",
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.1)",
                zIndex: 10,
                borderRadius: "4px",
              }}
            >
              {suggestions.map((value, index) => (
                <div
                  key={`suggestion-${field}-${value}`}
                  onClick={() => handleSelectSuggestion(value)}
                  style={{
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                    fontSize: "0.8125rem",
                    background:
                      index === highlightedIndex[field]
                        ? "#eee"
                        : "transparent",
                  }}
                >
                  {value}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  const renderDateFilter = (col) => {
    if (!col.filterTypes || col.filterTypes.length === 0) return null;
    const filtersToRender = col.filterTypes;

    return filtersToRender.map((filterType) => {
      switch (filterType) {
        case "DateRangeFilter":
          return (
            <DatePicker
              key={`filter-${col.field}-DateRangeFilter`}
              selectsRange
              showYearDropdown
              showMonthDropdown
              monthsShown={2}
              endDate={toDate}
              selected={fromDate}
              startDate={fromDate}
              shouldCloseOnSelect={false}
              id="date-range-picker-months"
              onChange={handleOnChangeRange}
              customInput={
                <CustomTextField
                  customBorderColor="rgba(47, 43, 61, 0.2)"
                  borderoutlinedColor="#00CFE8"
                  customTextColor="#2F2B3DC7"
                  customFontSize="0.8125rem"
                  label="Specific Date Range"
                />
              }
              popperPlacement={popperPlacement}
              dateFormat="dd-MM-yyyy"
              placeholderText={"dd-mm-yyyy dd-mm-yyyy"}
              className="rangeDatePicker"
            />
          );
        default:
          return null;
      }
    });
  };

  const renderFilterDropDown = (col) => {
    if (!col.filterTypes || col.filterTypes.length === 0) return null;
    const filtersToRender = col.filterTypes;

    return filtersToRender.map((filterType) => {
      switch (filterType) {
        case "selectDropdownFilter": {
          const uniqueValues = [
            ...new Set(originalRows.map((row) => row[col.field])),
          ];
          return (
            <div
              key={`filter-${col.field}-selectDropdownFilter`}
              style={{ width: "100%", margin: "20px" }}
            >
              <CustomTextField
                select
                fullWidth
                label={`Select ${col.headerName}`}
                value={filters[col.field] || ""}
                onChange={(e) => handleFilterChange(col.field, e.target.value)}
                customBorderColor="rgba(47, 43, 61, 0.2)"
                borderoutlinedColor="#00CFE8"
                customTextColor="#2F2B3DC7"
                customFontSize="0.8125rem"
                size="small"
                className="selectDropDownMain"
                variant="filled"
              >
                <MenuItem value="">
                  <em>{`Select Employee`}</em>
                </MenuItem>
                {uniqueValues.map((value) => (
                  <MenuItem key={`select-${col.field}-${value}`} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
          );
        }
        default:
          return null;
      }
    });
  };

  const renderFilterRange = (col) => {
    if (!col.filterTypes || col.filterTypes.length === 0) return null;
    const filtersToRender = col.filterTypes;
    return filtersToRender.map((filterType) => {
      switch (filterType) {
        case "RangeFilter":
          return (
            <div key={`filter-${col.field}-RangeFilter`}>
              <div>
                <Typography>{col.headerName} :</Typography>
              </div>
              <CustomTextField
                type="number"
                className="minTexBox"
                customBorderColor="rgba(47, 43, 61, 0.2)"
                placeholder="Min"
                value={filters[`${col.field}_min`] || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseFloat(e.target.value)
                    : "";
                  setFilters((prev) => ({
                    ...prev,
                    [`${col.field}_min`]: value,
                  }));
                }}
                InputLabelProps={{ shrink: true }}
              />

              <CustomTextField
                type="number"
                placeholder="Max"
                className="minTexBox"
                customBorderColor="rgba(47, 43, 61, 0.2)"
                value={filters[`${col.field}_max`] || ""}
                onChange={(e) => {
                  const value = e.target.value
                    ? parseFloat(e.target.value)
                    : "";
                  setFilters((prev) => ({
                    ...prev,
                    [`${col.field}_max`]: value,
                  }));
                }}
                InputLabelProps={{ shrink: true }}
                style={{ marginLeft: "10px" }}
              />
            </div>
          );
        default:
          return null;
      }
    });
  };

  const renderFilterMulti = (col) => {
    if (!col.filterTypes || col.filterTypes.length === 0) return null;
    const filtersToRender = col.filterTypes;
    return filtersToRender.map((filterType) => {
      switch (filterType) {
        case "multiSelection":
          const uniqueValues = [
            ...new Set(originalRows?.map((row) => row[col.field])),
          ];
          return (
            <div key={col.field} style={{ width: "100%", margin: "10px" }}>
              <Accordion>
                <AccordionSummary
                  expandIcon={<MdExpandMore />}
                  aria-controls={`${col.field}-content`}
                  id={`${col.field}-header`}
                >
                  <Typography>{col.headerName}</Typography>
                </AccordionSummary>
                <AccordionDetails className="gridMetalComboMain">
                  {uniqueValues.map((value) => (
                    <label key={value}>
                      <input
                        type="checkbox"
                        value={value}
                        checked={(filters[col.field] || []).includes(value)}
                        onChange={(e) =>
                          handleFilterChange(
                            col.field,
                            { value, checked: e.target.checked },
                            "multiSelection"
                          )
                        }
                      />
                      {value}
                    </label>
                  ))}
                </AccordionDetails>
              </Accordion>
            </div>
          );

        default:
          return null;
      }
    });
  };

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;
    setFromDate(start);
    setToDate(end);
  };

  const handleClose = () => setOpen(false);

  const [sideFilterOpen, setSideFilterOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setSideFilterOpen(newOpen);
  };

  const renderSummary = () => {
    const summaryConfig = {
      "SELECT MATERIAL": ["totalAmount"],

      METAL: ["totalAmount", "averageRate", "totalWeight", "totalWeightPure"],

      DIAMOND: ["totalAmount", "averageRate", "totalWeight"],

      "LAB GROWN": ["totalAmount", "averageRate", "totalWeight"],

      "COLOR STONE": ["totalAmount", "averageRate", "totalWeight"],

      MOUNT: [
        "totalAmount",
        "averageRate",
        "totalWeight",
        "totalWeightPure",
        "labourAmount",
        "materialAmount",
      ],

      FINDING: [
        "totalAmount",
        "averageRate",
        "totalWeight",
        "totalWeightPure",
        "labourAmount",
        "materialAmount",
      ],

      ALLOY: ["totalAmount", "averageRate", "totalWeight", "totalWeightPure"],

      MISC: ["totalAmount", "averageRate", "totalWeight"],
    };

    const calcTotalAmount = () =>
      filteredRows?.reduce(
        (sum, row) => sum + (parseFloat(row.totalprice) || 0),
        0
      );

    const calcTotalWeight = () =>
      filteredRows?.reduce(
        (sum, row) => sum + (parseFloat(row.totalwt) || 0),
        0
      );

    const calcTotalWeightPure = () =>
      filteredRows?.reduce(
        (sum, row) => sum + (parseFloat(row.purewt) || 0),
        0
      );

    const calcTotalTunchWeight = () =>
      filteredRows?.reduce(
        (sum, row) => sum + (parseFloat(row.tunchweight) || 0),
        0
      );

    const calcAverageRate = () => {
      const amount = calcTotalAmount();
      const weight = calcTotalWeight();
      const tounchWt = calcTotalTunchWeight();
      let findTunch = (tounchWt * 100) / weight;
      return weight > 0 ? amount / findTunch : 0;
    };

    const calcLabourAmount = () =>
      filteredRows?.reduce(
        (sum, row) => sum + (parseFloat(row.labouramount) || 0),
        0
      );

    const calcMaterialAmount = () => calcTotalAmount() - calcLabourAmount();

    const summaryCalcMap = {
      totalAmount: { label: "Total Amount", fn: calcTotalAmount, decimals: 2 },
      averageRate: { label: "Average Rate", fn: calcAverageRate, decimals: 2 },
      totalWeight: { label: "Total Weight", fn: calcTotalWeight, decimals: 3 },
      totalWeightPure: {
        label: "Total Weight (Pure)",
        fn: calcTotalWeightPure,
        decimals: 3,
      },
      labourAmount: { label: "L.Amount", fn: calcLabourAmount, decimals: 2 },
      materialAmount: {
        label: "M.Amount",
        fn: calcMaterialAmount,
        decimals: 2,
      },
    };

    const itemsToShow = summaryConfig[selectedMetal?.toUpperCase()] || [];

    const weightUnit = ["DIAMOND", "LAB GROWN", "COLOR STONE"].includes(
      selectedMetal?.toUpperCase()
    )
      ? " Ctw"
      : " Gm";

    return (
      <div className="summaryBox">
        {itemsToShow.map((key) => {
          const { label, fn, decimals } = summaryCalcMap[key];
          const value = fn();

          let displayValue;
          if (key === "totalWeight" || key === "totalWeightPure") {
            // Show decimal + unit
            displayValue = `${value?.toFixed(decimals)}${weightUnit}`;
          } else {
            // Add thousand separator
            displayValue = value
              ?.toFixed(decimals)
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }

          return (
            <div className="summaryItem" key={key}>
              <div className="AllEmploe_boxViewTotal">
                <div>
                  <p className="AllEmplo_boxViewTotalValue">{displayValue}</p>
                  <p className="boxViewTotalTitle">{label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (gridContainerRef.current.requestFullscreen) {
        gridContainerRef.current.requestFullscreen();
      } else if (gridContainerRef.current.mozRequestFullScreen) {
        gridContainerRef.current.mozRequestFullScreen();
      } else if (gridContainerRef.current.webkitRequestFullscreen) {
        gridContainerRef.current.webkitRequestFullscreen();
      } else if (gridContainerRef.current.msRequestFullscreen) {
        gridContainerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  function mapRowsToHeaders(columns, rows) {
    const isIsoDateTime = (str) =>
      typeof str === "string" && /^\d{4}-\d{2}-\d{2}T/.test(str);
    const fieldToHeader = {};

    columns?.forEach((col) => {
      let header = "";
      if (typeof col.headerName === "string") {
        header = col.headerName;
      } else if (col.headerNamesingle) {
        header = col.headerNamesingle;
      } else if (
        col.headerName?.props?.children &&
        Array.isArray(col.headerName.props.children)
      ) {
        header = col.headerName.props.children[1];
      }
      fieldToHeader[col.field] = header;
    });

    return rows?.map((row, idx) => {
      const ordered = {};
      columns?.forEach((col) => {
        const header = fieldToHeader[col.field];
        let value = row[col.field] ?? "";

        // Custom Supplier column logic
        if (col.field === "istorecust_customercode1") {
          if (value && String(value).trim() !== "") {
            // keep as is
          } else if (
            row.istorecust_customercode &&
            String(row.istorecust_customercode).trim() !== ""
          ) {
            value = row.istorecust_customercode;
          } else {
            value = ""; // keep blank if both empty
          }
        }

        if (header === "Sr#") {
          value = idx + 1;
        }

        if (col.field === "Venderfgage") {
          let finalDate = 0;
          const fgDateStr = row.fgdate;
          const outsourceDateStr = row.outsourcedate;
          if (fgDateStr && outsourceDateStr) {
            const diff =
              new Date(fgDateStr).getTime() -
              new Date(outsourceDateStr).getTime();
            finalDate = Math.floor(diff / (1000 * 60 * 60 * 24));
          }
          value = finalDate;
        } else if (col.field === "Fgage") {
          let finalDate = 0;
          const fgDateStr = row.fgdate;
          const orderDateStr = row.orderdate;
          if (fgDateStr && orderDateStr) {
            const diff =
              new Date(fgDateStr).getTime() - new Date(orderDateStr).getTime();
            finalDate = Math.floor(diff / (1000 * 60 * 60 * 24));
          }
          value = finalDate;
        }

        if (isIsoDateTime(value)) {
          const dateObj = new Date(value);
          const day = String(dateObj.getDate()).padStart(2, "0");
          const month = String(dateObj.getMonth() + 1).padStart(2, "0");
          const year = dateObj.getFullYear();
          value = `${day}-${month}-${year}`;
        }

        ordered[header] = value;
      });
      return ordered;
    });
  }
  const converted = mapRowsToHeaders(columns, filteredRows);
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(converted);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: EXCEL_TYPE });

    const now = new Date();
    const dateString = now
      .toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(/[/:]/g, "-")
      .replace(/, /g, "_");

    const fileName = `MaterialPurchaseReport_${dateString}.xlsx`;
    saveAs(data, fileName);
  };

  const handleClearFilter = () => {
    setFromDate(null);
    setToDate(null);
    setCommonSearch("");
    setFilters({});
  };

  const handleSendEmail = () => {
    const templateParams = {
      to_name: "Recipient",
      from_name: "Sender",
      message: "Your message content here",
    };
    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams,
        "YOUR_USER_ID"
      )
      .then(
        (response) => {
          console.log("Email sent successfully", response);
        },
        (error) => {
          console.log("Error sending email", error);
        }
      );
  };

  const handlePrint = () => {};

  const handleImg = () => {
    setShowImageView((prevState) => !prevState);
  };

  const toggleColorSelection = (colorId) => {
    setSelectedColors((prevSelected) => {
      if (prevSelected.includes(colorId)) {
        return prevSelected.filter((id) => id !== colorId);
      } else {
        return [...prevSelected, colorId];
      }
    });
  };

  const handleGrupEnChekBoxChange = (field) => {
    setGrupEnChekBox((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleClickOpenPoup = () => {
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleSave = () => {
    console.log("Saving data...");
    console.log("Selected Date:", selectedDate);
    console.log("Selected Rd3 Name:", selectedRd3Name);
  };

  const onDragEnd = () => {};

  const groupRows = (rows, groupCheckBox) => {
    const grouped = {};

    rows?.forEach((row) => {
      const newRow = { ...row };

      const deptChecked = groupCheckBox["dept"];
      const designationChecked = groupCheckBox["designation"];
      const empnameChecked = groupCheckBox["empname"];

      if (!deptChecked) newRow.dept = "-";
      if (!designationChecked) newRow.designation = "-";
      if (!empnameChecked) newRow.empname = "-";

      let keyParts = [];

      // 🔥 Always group by item at least
      if (deptChecked) keyParts.push(newRow.dept);
      if (designationChecked) keyParts.push(newRow.designation);
      if (empnameChecked) keyParts.push(newRow.empname);

      // 👉 Always push item into keyParts even if itemChecked is false
      keyParts.push(newRow.item);

      const groupKey = keyParts.join("|");

      if (!grouped[groupKey]) {
        grouped[groupKey] = { ...newRow };
      } else {
        grouped[groupKey].issqty += newRow.issqty || 0;
        grouped[groupKey].retqty += newRow.retqty || 0;
        grouped[groupKey].remqty += newRow.remqty || 0;
      }
    });

    return Object.values(grouped).map((item, index) => ({
      ...item,
      id: index,
      srNo: index + 1,
    }));
  };

  // function openInvoiceList(invoiceno) {
  //           if ($.trim(_hdn_invoiceof) == 'supplier') {
  //               parent.CloseTab('Material Purchase');
  //               parent.CloseTab('Customer Receive');
  //               parent.addTab('Material Purchase', 'icon-InventoryManagement_invoiceSummary', ADPT + 'mfg/app/InventoryManagement_invoiceList?invoiceof=supplier&invoiceno=' + invoiceno + '&IsOldMetal=' + IsOldMetal)
  //           }
  //           else {
  //               parent.CloseTab('Material Purchase');
  //               parent.CloseTab('Customer Receive');
  //               parent.addTab('Customer Receive', 'icon-InventoryManagement_invoiceSummary', ADPT + 'mfg/app/InventoryManagement_invoiceList?invoiceof=customer&invoiceno=' + invoiceno + '&IsOldMetal=' + IsOldMetal)
  //           }
  //       }
  // window.parent.addTab(
  //   "Job Completion Report",
  //   "tabs-icon icon-report",
  //   "http://nzen/R50B3/mfg/app/InventoryManagement_invoiceList?invoiceof=customer&invoiceno=Q1IvMTI3LzIwMjU=-AdQ2EGwrOJI=&IsOldMetal=0&ifid=CustomerReceive&pid=undefined"
  // );

  const handleClick = (params) => {
    let url_optigo = sessionStorage.getItem("url_optigo");
    window?.parent.addTab(
      "Material Purchase",
      "icon-InventoryManagement_invoiceSummary",
      url_optigo +
        "mfg/app/InventoryManagement_invoiceList?invoiceof=supplier&invoiceno=" +
        btoa(params?.formattedValue) +
        "&IsOldMetal=" +
        params?.row?.isoldmetal
    );
  };

  const handleClickInvoiceImg = (params) => {
    let url_optigo = sessionStorage.getItem("url_optigo");
    window.parent.addTab(
      "Transaction Log",
      "icon-TransactionLog",
      url_optigo +
        "login/app/LoginManagement_LogHistory?mode=logsearch&sf=" +
        params?.formattedValue
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="MaterialPurhcaseReportMain_mainGridView"
        sx={{ width: "100vw", display: "flex", flexDirection: "column" }}
        ref={gridContainerRef}
      >
        {isLoading && (
          <div className="loader-overlay">
            <CircularProgress className="loadingBarManage" />
          </div>
        )}

        <Dialog open={openPopup} onClose={handleClosePopup}>
          <div className="ConversionMain">
            <div className="filterDrawer">
              <p className="dataGridPopupColumSetting">Column Settings</p>
              <Droppable droppableId="columns-list" type="COLUMN">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {columns.map((col, index) => (
                      <DraggableColumn
                        key={col.field}
                        col={col}
                        index={index}
                        checkedColumns={checkedColumns}
                        handleCheckboxChange={() =>
                          setCheckedColumns((prev) => ({
                            ...prev,
                            [col.field]: !prev[col.field],
                          }))
                        }
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <Button>Save</Button>
            </div>
          </div>
        </Dialog>
        <Drawer
          open={sideFilterOpen}
          onClose={toggleDrawer(false)}
          className="drawerMain"
        >
          <div
            style={{
              margin: "20px 10px 0px 10px",
              fontSize: "25px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button onClick={handleClearFilter} className="ClearFilterButton">
              <MdOutlineFilterAltOff style={{ fontSize: "25px" }} />
              Clear
            </button>

            <CircleX
              style={{
                cursor: "pointer",
                height: "30px",
                width: "30px",
              }}
              onClick={() => setSideFilterOpen(false)}
            />
          </div>

          {columns
            .filter((col) => col.filterable)
            .map((col) => (
              <div key={col.field} style={{ display: "flex", gap: "10px" }}>
                {renderFilterMulti(col)}
              </div>
            ))}

          {columns
            .filter((col) => col.filterable)
            .map((col) => (
              <div key={col.field}>{renderFilterRange(col)}</div>
            ))}

          {columns
            .filter((col) => col.filterable)
            .map((col) => (
              <div key={col.field} style={{ display: "flex", gap: "10px" }}>
                {renderFilterDropDown(col)}
              </div>
            ))}

          {columns
            .filter((col) => col.filterable)
            .map((col) => (
              <div key={col.field} style={{ gap: "10px" }}>
                {renderFilterSuggestionFilter(col)}
              </div>
            ))}

          {columns
            .filter((col) => col.filterable)
            .map((col) => (
              <div key={col.field} style={{ display: "flex", gap: "10px" }}>
                {renderFilter(col)}
              </div>
            ))}
        </Drawer>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {renderSummary()}

          {masterKeyData?.ColumnSettingPopup && (
            <div className="topSettingBtnPopup" onClick={handleClickOpenPoup}>
              <AiFillSetting style={{ height: "25px", width: "25px" }} />
            </div>
          )}
          {masterKeyData?.fullScreenGridButton && (
            <button className="fullScreenButton" onClick={toggleFullScreen}>
              <RiFullscreenLine
                style={{ marginInline: "5px", fontSize: "30px" }}
              />
            </button>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 5px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "end" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <button onClick={toggleDrawer(true)} className="FiletrBtnOpen">
                <MdOutlineFilterAlt style={{ height: "30px", width: "30px" }} />
              </button>

              <div style={{ display: "flex", gap: "5px" }}>
                <DualDatePicker
                  filterState={filterState}
                  setFilterState={setFilterState}
                  validDay={186}
                  validMonth={6}
                  withountDateFilter={true}
                />
                <Button
                  onClick={() => {
                    fetchData("", "");
                    setFilterState({
                      ...filterState,
                      dateRange: {
                        startDate: "",
                        endDate: "",
                      },
                    });
                    setPurchaseAgainMemo("");
                    setPurchaseBtnDis(false);
                    setShowAllData(true);
                    setFromDate(null);
                    setToDate(null);
                    setCommonSearch("");
                    setFilters({});
                    setSelectedMetal("Select Material");
                    setPurchaseAgainMemo("ALL");
                    setMaterialPurchase("ALL");
                    setSelectedDateColumn("INR");
                    setSelectedUser("ALL Users");
                  }}
                  className="FiletrBtnAll"
                >
                  All
                </Button>
              </div>

              <TextField
                type="text"
                placeholder="Search..."
                value={commonSearch}
                onChange={(e) => setCommonSearch(e.target.value)}
                customBorderColor="rgba(47, 43, 61, 0.2)"
                InputProps={{
                  endAdornment: commonSearch && (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => setCommonSearch("")}
                        aria-label="clear"
                      >
                        <CircleX size={20} color="#888" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                style={{
                  width: "200px",
                }}
                sx={{
                  "& .MuiInputBase-input": {
                    padding: "5.5px !important",
                  },
                }}
              />
              <FormControl size="small" sx={{ width: 150, margin: "0px" }}>
                <Select
                  value={selectedMetal}
                  onChange={(e) => setSelectedMetal(e.target.value)}
                  displayEmpty
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 300,
                        overflowY: "auto",
                      },
                    },
                  }}
                  style={{
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  sx={{
                    "& .MuiSelect-select": {
                      padding: "7px !important",
                    },
                  }}
                >
                  {uniqueCustomers?.map((cust, index) => (
                    <MenuItem
                      key={index}
                      value={cust}
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {cust}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                className={purchaseBtnDis ? "PurchaseBtndis" : "PurchaseBtn"}
                disabled={purchaseBtnDis}
                onClick={() => {
                  setPurchaseAgainMemo("PurchaseAgainst");
                  setPurchaseBtnDis(true);
                }}
              >
                Purchase Against Memo
              </Button>
            </div>
            {columns
              .filter((col) => col.filterable)
              .map((col) => (
                <div key={col.field} style={{ display: "flex", gap: "10px" }}>
                  {renderDateFilter(col)}
                </div>
              ))}

            <div
              className="date-selector"
              style={{ display: "flex", gap: "10px" }}
            >
              {masterKeyData?.progressFilter && (
                <button
                  className="FiletrBtnOpen"
                  onClick={() => setOpenPDate(!openPDate)}
                >
                  Set P.Date
                </button>
              )}
              <div
                className={`transition-container ${
                  openPDate ? "open" : "closed"
                }`}
                style={{
                  transition: "0.5s ease",
                  opacity: openPDate ? 1 : 0,
                  maxHeight: openPDate ? "300px" : "0",
                  overflow: "hidden",
                  display: openPDate ? "flex" : "none",
                  gap: "10px",
                }}
              >
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  dateFormat="dd-MM-yyyy"
                  customInput={
                    <CustomTextField
                      customBorderColor="rgba(47, 43, 61, 0.2)"
                      borderoutlinedColor="#00CFE8"
                      customTextColor="#2F2B3DC7"
                      customFontSize="0.8125rem"
                      style={{ Width: "100px" }}
                    />
                  }
                  placeholderText="Select Date"
                />

                {/* <CustomTextField
                  select
                  fullWidth
                  value={filters.someField || ""}
                  onChange={(e) => handleFilterChange(e.target.value)}
                  customBorderColor="rgba(47, 43, 61, 0.2)"
                  borderoutlinedColor="#00CFE8"
                  customTextColor="#2F2B3DC7"
                  customFontSize="0.8125rem"
                  size="small"
                  className="selectDropDownMain"
                  variant="filled"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {masterData.rd3.map((item) => (
                    <MenuItem key={item.id} value={item.name}>
                      {item.name}
                    </MenuItem>
                  ))}
                </CustomTextField> */}

                <button
                  onClick={handleSave}
                  variant="contained"
                  className="FiletrBtnOpen"
                  sx={{ marginTop: 2 }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "end", gap: "10px" }}>
            {masterKeyData?.mailButton && (
              <img
                src={mainButton}
                style={{ cursor: "pointer" }}
                onClick={handleSendEmail}
              />
            )}

            {masterKeyData?.PrintButton && (
              <img
                src={printButton}
                style={{ cursor: "pointer", height: "40px", width: "40px" }}
                onClick={handlePrint}
              />
            )}

            {masterKeyData?.imageView && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {showImageView ? (
                  <img
                    src={gridView}
                    className="imageViewImgGrid"
                    onClick={handleImg}
                  />
                ) : (
                  <img
                    src={imageView}
                    className="imageViewImg"
                    onClick={handleImg}
                  />
                )}
              </div>
            )}

            {masterKeyData?.fullScreenGridButton && (
              <button className="fullScreenButton" onClick={toggleFullScreen}>
                <RiFullscreenLine
                  style={{ marginInline: "5px", fontSize: "30px" }}
                />
              </button>
            )}

            {masterKeyData?.ExcelExport && (
              <button onClick={exportToExcel} className="All_exportButton">
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  stroke-width="0"
                  viewBox="0 0 384 512"
                  height="2em"
                  width="2em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm60.1 106.5L224 336l60.1 93.5c5.1 8-.6 18.5-10.1 18.5h-34.9c-4.4 0-8.5-2.4-10.6-6.3C208.9 405.5 192 373 192 373c-6.4 14.8-10 20-36.6 68.8-2.1 3.9-6.1 6.3-10.5 6.3H110c-9.5 0-15.2-10.5-10.1-18.5l60.3-93.5-60.3-93.5c-5.2-8 .6-18.5 10.1-18.5h34.8c4.4 0 8.5 2.4 10.6 6.3 26.1 48.8 20 33.6 36.6 68.5 0 0 6.1-11.7 36.6-68.5 2.1-3.9 6.2-6.3 10.6-6.3H274c9.5-.1 15.2 10.4 10.1 18.4zM384 121.9v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"></path>
                </svg>
              </button>
            )}

            {/* <FormControl size="small" sx={{ width: 200, margin: "0px" }}>
              <Select
                value={purchaseAgainMemo}
                onChange={(e) => setPurchaseAgainMemo(e.target.value)}
              >
                <MenuItem value="ALL">ALL</MenuItem>
                <MenuItem value="PurchaseAgainst">
                  Purchase Against Memo
                </MenuItem>
              </Select>
            </FormControl> */}

            <FormControl size="small" sx={{ width: 150, margin: "0px" }}>
              <Select
                value={materialPurchase}
                onChange={(e) => setMaterialPurchase(e.target.value)}
                style={{
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                }}
                sx={{
                  "& .MuiSelect-select": {
                    padding: "7px !important",
                  },
                }}
              >
                <MenuItem
                  value="ALL"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  Voucher Type
                </MenuItem>
                <MenuItem
                  value="MaterialPurchase"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  Material Purchase
                </MenuItem>
                <MenuItem
                  value="OldMetalPurchase"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  Old Metal Purchase
                </MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 150, margin: "0px" }}>
              <Select
                value={selectedDateColumn}
                onChange={(e) => setSelectedDateColumn(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflowY: "auto",
                    },
                  },
                }}
                style={{
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                }}
                sx={{
                  "& .MuiSelect-select": {
                    padding: "7px !important",
                  },
                }}
              >
                {allCurrencyData?.map((col) => (
                  <MenuItem
                    key={col?.id}
                    value={col?.Currencycode}
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    {col?.Currencycode}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ width: 150, margin: "0px" }}>
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                      overflowY: "auto",
                    },
                  },
                }}
                style={{
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                }}
                sx={{
                  "& .MuiSelect-select": {
                    padding: "7px !important",
                  },
                }}
              >
                <MenuItem
                  value="ALL Users"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  ALL Users
                </MenuItem>
                {allUserNameList?.map((col) => (
                  <MenuItem
                    key={col["1"]}
                    value={col["1"]}
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    {col["2"]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div
          ref={gridRef}
          style={{ height: "calc(100vh - 170px)", margin: "5px" }}
        >
          {showImageView ? (
            <div>
              <img
                className="imageViewImgage"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVXLW1j3zO3UP6dIu96A3IpZihTe3fVRsm9g&s"
              />
              <img
                className="imageViewImgage"
                src="https://help.earthsoft.com/ent-data_grid_widget-sample.png"
              />
              <img
                className="imageViewImgage"
                src="https://i0.wp.com/thewwwmagazine.com/wp-content/uploads/2020/07/Screenshot-2020-07-09-at-7.36.56-PM.png?resize=1404%2C1058&ssl=1"
              />
              <img
                className="imageViewImgage"
                src="https://docs.devexpress.com/WPF/images/wpf-data-grid.png"
              />
              <img
                className="imageViewImgage"
                src="https://www.infragistics.com/products/ignite-ui-web-components/web-components/images/general/landing-grid-page.png"
              />
              <img
                className="imageViewImgage"
                src="https://i0.wp.com/angularscript.com/wp-content/uploads/2020/04/Angular-Data-Grid-For-The-Enterprise-nGrid.png?fit=1245%2C620&ssl=1"
              />
              <img
                className="imageViewImgage"
                src="https://angularscript.com/wp-content/uploads/2015/12/ng-bootstrap-grid-370x297.jpg"
              />
            </div>
          ) : (
            <Warper>
              <DataGrid
                rows={currencyAdjustedRows ?? []}
                columns={columns ?? []}
                autoHeight={false}
                rowHeight={40}
                headerHeight={40}
                columnBuffer={17}
                localeText={{ noRowsLabel: "No Data" }}
                initialState={{
                  columns: {
                    columnVisibilityModel: {
                      status: false,
                      traderName: false,
                    },
                  },
                  pagination: {
                    paginationModel: {
                      pageSize: 20,
                      page: 0,
                    },
                  },
                }}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                // sortingOrder={["asc", "desc"]} // For Sorting.....
                sortingOrder={["desc", "asc"]}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[20, 30, 50, 100, 200]}
                className="simpleGridView"
                pagination
                sx={{
                  "& .MuiDataGrid-menuIcon": {
                    display: "none",
                  },

                  "& .MuiTablePagination-selectLabel": {
                    margin: "0px",
                    padding: "0px",
                  },

                  "& .MuiTablePagination-displayedRows": {
                    margin: "0px",
                    padding: "0px",
                  },

                  "& .MuiTablePagination-actions .MuiButtonBase-root": {
                    padding: "0px",
                    margin: "0px",
                  },

                  "& .MuiDataGrid-footerContainer": {
                    minHeight: "30px",
                  },

                  "& .MuiTablePagination-toolbar": {
                    minHeight: "30px",
                  },
                  marginLeft: 2,
                  marginRight: 2,
                  marginBottom: 2,
                }}
              />
            </Warper>
          )}
        </div>

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
      </div>
    </DragDropContext>
  );
}
