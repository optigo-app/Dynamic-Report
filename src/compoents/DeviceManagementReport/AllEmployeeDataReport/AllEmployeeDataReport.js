import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import "./AllEmployeeDataReport.scss";
import DatePicker from "react-datepicker";
import mainButton from "../../images/Mail_32.png";
import printButton from "../../images/print.png";
import gridView from "../../images/GriedView.png";
import imageView from "../../images/ImageView2.png";
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
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Slide,
  Typography,
} from "@mui/material";
import emailjs from "emailjs-com";
import { MdDelete, MdExpandMore, MdOpenInFull } from "react-icons/md";
import CustomTextField from "../../text-field/index";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AiFillSetting } from "react-icons/ai";
import OtherKeyData from "./AllEmployeeData.json";
import OtherKeyDataAdmin from "./AdminApp.json";
import OtherKeyDataSales from "./SalesRep.json";
import OtherKeyDataIcate from "./IcateApp.json";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SingleEmployeeWiseData from "./SingleEmployeeWiseData/SingleEmployeeWiseData";
import { GetWorkerData } from "../../../API/GetWorkerData/GetWorkerData";
import { useSearchParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import CustomerBind from "./CustomerBind.json";
import { deviceOnorOff } from "../../../Recoil/atom";
import { useDeviceStatus } from "../../../DeviceStatusContext";
import { IoMdLogOut } from "react-icons/io";

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

export default function AllEmployeeDataReport({
  selectedFilterCategory,
  selectedFileter,
  AllFinalData,
}) {
  const [commonSearch, setCommonSearch] = React.useState("");
  const [toDate, setToDate] = React.useState(null);
  const [fromDate, setFromDate] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const gridContainerRef = React.useRef(null);
  const [showImageView, setShowImageView] = React.useState(false);
  const [selectedColors, setSelectedColors] = React.useState([]);
  const [openPopup, setOpenPopup] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const [columns, setColumns] = React.useState([]);
  const [openPDate, setOpenPDate] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [selectedRd3Name, setSelectedRd3Name] = React.useState("");

  const [masterKeyData, setMasterKeyData] = React.useState();
  const [allColumIdWiseName, setAllColumIdWiseName] = React.useState();
  const [allColumData, setAllColumData] = React.useState();
  const [allRowData, setAllRowData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [checkedColumns, setCheckedColumns] = React.useState({});
  const [selectedDepartmentId, setSelectedDepartmentId] = React.useState();
  const [selectedEmployeeCode, setSelectedEmployeeCode] = React.useState();
  const [selectedEmployeeName, setSelectedEmployeeName] = React.useState();
  const [searchParams] = useSearchParams();
  const [logoutRow, setLogoutRow] = React.useState(null);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [isDeleteModel, setIsDeleteMode] = React.useState(false);
  const { setDeviceStatus } = useDeviceStatus();

  const [selectedEmployeeBarCode, setSelectedEmployeeBarCode] =
    React.useState();
  const [lastUpdated, setLastUpdated] = React.useState("");
  const gridRef = React.useRef(null);

  const useDeviceSummary = (AllFinalData) => {
    const [summary, setSummary] = React.useState({
      totalDevices: 0,
      activeDevices: 0,
      deactiveDevices: 0,
      upcomingExpiryDevices: 0,
      enableCount: 0,
      disableCount: 0,
    });

    React.useEffect(() => {
      const records = AllFinalData?.rd1 || [];
      const now = new Date();
      const fifteenDaysLater = new Date(now);
      fifteenDaysLater.setDate(now.getDate() + 15);

      let activeCount = 0;
      let deactiveCount = 0;
      let upcomingExpiryCount = 0;
      let enable = 0;
      let disable = 0;

      for (const record of records) {
        const status = record["5"];
        const access = record["6"];
        const expiryDateStr = record["17"];

        if (status === "Active") activeCount++;
        if (status === "DeActive") deactiveCount++;

        if (access === 1) enable++;
        if (access === 0) disable++;

        if (expiryDateStr) {
          const expiryDate = new Date(expiryDateStr);
          if (expiryDate >= now && expiryDate <= fifteenDaysLater) {
            upcomingExpiryCount++;
          }
        }
      }

      setSummary({
        totalDevices: records.length,
        activeDevices: activeCount,
        deactiveDevices: deactiveCount,
        upcomingExpiryDevices: upcomingExpiryCount,
        enableCount: enable,
        disableCount: disable,
      });
    }, [AllFinalData]);

    return summary;
  };
  const summary = useDeviceSummary(AllFinalData);

  const records = AllFinalData?.rd1 || [];
  const employeeSummary = {
    connectedDevices: records.filter((r) => r["4"]).length,
    activeDevices: records.filter((r) => r["5"] === "Active").length,
    deactiveDevices: records.filter((r) => r["5"] === "DeActive").length,
    packages: [...new Set(records.map((r) => r["9"]).filter(Boolean))],
    appNames: [...new Set(records.map((r) => r["1"]).filter(Boolean))],
  };

  const deviceSummary = {
    activeDevices: records.filter((r) => r["5"] === "Active").length,
    deactiveDevices: records.filter((r) => r["5"] === "DeActive").length,
    connectedDevices: records.filter((r) => r["4"]).length,
    timeLeft: [...new Set(records.map((r) => r["15"]).filter(Boolean))].join(
      ", "
    ),
    connectedApps: [
      ...new Set(records.map((r) => r["1"]).filter(Boolean)),
    ].join(", "),
  };

  const summaryArray =
    selectedFileter === "App"
      ? [
          {
            field: "totalDevices",
            Title: summary.totalDevices,
            summaryTitle: "Total Devices",
          },
          {
            field: "activeDevices",
            Title: summary.activeDevices,
            summaryTitle: "Active Devices",
          },
          {
            field: "deactiveDevices",
            Title: summary.deactiveDevices,
            summaryTitle: "Deactive Devices",
          },
          {
            field: "upcomingExpiryDevices",
            Title: summary.upcomingExpiryDevices,
            summaryTitle: "Expiring Soon",
          },
          {
            field: "enableCount",
            Title: summary.enableCount,
            summaryTitle: "Enabled",
          },
          {
            field: "disableCount",
            Title: summary.disableCount,
            summaryTitle: "Disabled",
          },
        ]
      : selectedFileter === "Employee"
      ? [
          {
            field: "connectedDevices",
            Title: employeeSummary.connectedDevices,
            summaryTitle: "Connected Devices",
          },
          {
            field: "activeDevices",
            Title: employeeSummary.activeDevices,
            summaryTitle: "Active Devices",
          },
          {
            field: "deactiveDevices",
            Title: employeeSummary.deactiveDevices,
            summaryTitle: "Deactive Devices",
          },
          // ,
          // {
          //   field: "packages",
          //   Title: employeeSummary.packages.join(", "),
          //   summaryTitle: "Packages",
          // },
          {
            field: "appNames",
            Title: employeeSummary.appNames.join(", "),
            summaryTitle: "Apps",
          },
        ]
      : selectedFileter === "Device"
      ? [
          {
            field: "activeDevices",
            Title: deviceSummary.activeDevices,
            summaryTitle: "Active Devices",
          },
          {
            field: "deactiveDevices",
            Title: deviceSummary.deactiveDevices,
            summaryTitle: "Deactive Devices",
          },
          {
            field: "connectedDevices",
            Title: deviceSummary.connectedDevices,
            summaryTitle: "Connected Devices",
          },
          {
            field: "timeLeft",
            Title: deviceSummary.timeLeft,
            summaryTitle: "Time Left",
          },
          {
            field: "connectedApps",
            Title: deviceSummary.connectedApps,
            summaryTitle: "App Names",
          },
        ]
      : [];

  /*
{
  totalDevices: 3,
  activeDevices: 1,
  deactiveDevices: 2,
  upcomingExpiryDevices: 3,
  enableCount: 3,
  disableCount: 0
}
*/

  const APICall = () => {
    setIsLoading(true);
    const { rd, rd1 } = AllFinalData || {};
    if (!rd || !rd1) {
      console.warn("Invalid data format");
      return;
    }

    let filteredData = [];
    let filteredDataColumKey = [];

    switch (selectedFileter) {
      case "App":
        filteredData = rd1.filter(
          (entry) => entry["1"] === selectedFilterCategory
        );
        if (selectedFilterCategory === "Admin app") {
          filteredDataColumKey = OtherKeyDataAdmin?.rd1;
        } else if (selectedFilterCategory === "Sales rep app") {
          filteredDataColumKey = OtherKeyDataSales?.rd1;
        } else if (selectedFilterCategory === "ExpressApp") {
          filteredDataColumKey = OtherKeyDataSales?.rd1;
        } else {
          filteredDataColumKey = OtherKeyDataIcate?.rd1;
        }
        break;
      case "Employee":
        filteredData = rd1.filter(
          (entry) => entry["10"] === selectedFilterCategory
        );
        filteredDataColumKey = OtherKeyData?.rd1;
        break;

      case "Device":
        filteredData = rd1.filter(
          (entry) => entry["3"] === selectedFilterCategory
        );
        filteredDataColumKey = OtherKeyData?.rd1;
        break;

      default:
        console.warn("Unknown filter type");
    }

    setMasterKeyData(OtherKeyData?.rd);
    setAllColumData(filteredDataColumKey);
    setAllColumIdWiseName(AllFinalData?.rd);
    setAllRowData(filteredData);
    setIsLoading(false);
  };

  React.useEffect(() => {
    APICall();
  }, [selectedFileter, selectedFilterCategory]);

  React.useEffect(() => {
    const now = new Date();
    const formatNumber = (n) => n.toString().padStart(2, "0");

    const formattedDate = `${formatNumber(now.getDate())}-${formatNumber(
      now.getMonth() + 1
    )}-${now.getFullYear()} ${formatNumber(now.getHours())}:${formatNumber(
      now.getMinutes()
    )}:${formatNumber(now.getSeconds())}`;

    setLastUpdated(formattedDate);
  }, []);

  React.useEffect(() => {
    if (allColumData) {
      const initialCheckedColumns = {};
      Object?.values(allColumData)?.forEach((col) => {
        initialCheckedColumns[col.field] = col.ColumShow;
      });
      setCheckedColumns(initialCheckedColumns);
    }
  }, [allColumData]);

  const originalRows =
    allColumIdWiseName &&
    allRowData?.map((row, index) => {
      const formattedRow = {};
      Object.keys(row).forEach((key) => {
        formattedRow[allColumIdWiseName[0][key]] = row[key];
      });
      return { id: index, ...formattedRow };
    });

  const [pageSize, setPageSize] = React.useState(10);
  const [filteredRows, setFilteredRows] = React.useState(originalRows);
  const [filters, setFilters] = React.useState({});

  React.useEffect(() => {
    if (!allColumData) return;
    const columnData = Object?.values(allColumData)
      ?.filter((col) => col.ColumShow)
      ?.map((col, index) => {
        const isPriorityFilter = col.proiorityFilter === true;
        return {
          field: col.field,
          headerName: col.headerName,
          width: col.Width,
          align: col.ColumAlign || "left",
          headerAlign: col.Align,
          filterable: col.ColumFilter,
          suggestionFilter: col.suggestionFilter,
          hrefLink: col.HrefLink,
          summuryValueKey: col.summuryValueKey,
          summaryTitle: col.summaryTitle,
          ToFixedValue: col.ToFixedValue,
          filterTypes: [
            col.NormalFilter && "NormalFilter",
            col.DateRangeFilter && "DateRangeFilter",
            col.MultiSelection && "MultiSelection",
            col.RangeFilter && "RangeFilter",
            col.SuggestionFilter && "suggestionFilter",
            col.selectDropdownFilter && "selectDropdownFilter",
          ].filter(Boolean),

          renderCell: (params) => {
            if (col.ToFixedValue) {
              return (
                <p
                  style={{
                    fontSize: col.FontSize || "inherit",
                  }}
                >
                  {params.value?.toFixed(col.ToFixedValue)}
                </p>
              );
            } else if (col.field == "ActionDelete") {
              return (
                <div
                  style={{
                    fontSize: col.FontSize || "inherit",
                  }}
                >
                  <Button
                    className="row_delete_button"
                    onClick={() => {
                      setLogoutRow(params.row);
                      setShowLogoutModal(true);
                      setIsDeleteMode(true);
                    }}
                  >
                    <MdDelete style={{color: 'white', fontSize: '25px'}}/>
                  </Button>
                </div>
              );
            } else if (col.field == "ActionLogout") {
              return (
                <div
                  style={{
                    fontSize: col.FontSize || "inherit",
                  }}
                >
                  <Button
                    className="row_logout_button"
                    onClick={() => {
                      setLogoutRow(params.row);
                      setShowLogoutModal(true);
                      setIsDeleteMode(false);
                    }}
                  >
                    <IoMdLogOut style={{color: 'white', fontSize: '25px'}}/>
                  </Button>
                </div>
              );
            } else if (col.dateColumn == true) {
              const date = new Date(params.value);
              const formattedDate = date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              return (
                <span
                  style={{
                    fontSize: col.FontSize || "inherit",
                  }}
                >
                  {formattedDate}
                </span>
              );
            } else if (col.hrefLink) {
              return (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "blue",
                    textDecoration: "underline",
                    fontSize: col.FontSize || "inherit",
                    padding: "5px 20px",
                    cursor: "pointer",
                    width: "120px",
                    fontSize: col.FontSize || "inherit",
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  onClick={() => handleCellClick(params)}
                >
                  {params.value}
                </a>
              );
            } else {
              return (
                <span
                  style={{
                    color: col.Color || "inherit",
                    backgroundColor: col.BackgroundColor || "inherit",
                    fontSize: col.FontSize || "inherit",
                    textTransform: col.ColumTitleCapital ? "uppercase" : "none",
                    padding: "5px 20px",
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
    setColumns(columnData);
  }, [allColumData]);

  React.useEffect(() => {
    setColumns((prev) =>
      prev.map((col) => {
        if (col.field === "Access") {
          return {
            ...col,
            renderCell: (params) => (
              <Checkbox
                checked={params.row.Access == 1}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleAccessChange(e, params.row)}
              />
            ),
          };
        } else if (col.field === "customerBind") {
          return {
            ...col,
            renderCell: (params) => (
              <Select
                value={params.row.customerBind ?? ""}
                onChange={(e) =>
                  handleCustomerBindChange(e.target.value, params.row)
                }
                size="small"
                fullWidth
                className="MenuSelectItem"
              >
                {CustomerBind.map((item) => (
                  <MenuItem key={item.id} value={item.id} className="MenuSelectItem_select">
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            ),
          };
        }
        return col;
      })
    );
  }, [allColumData, allRowData]);

  console.log("AllFinalData ", AllFinalData);

  const handleCellClick = (params) => {
    setSelectedEmployeeName(params?.row?.employeename);
    setSelectedEmployeeBarCode(params?.row?.barcode);
    setSelectedDepartmentId(params?.row?.deptid);
    setSelectedEmployeeCode(params?.row?.employeecode);
    setOpen(true);
  };

  // React.useEffect(() => {
  //   const hasActiveFilters = Object.values(filters).some(
  //     (val) => val && (Array.isArray(val) ? val.length > 0 : val !== "")
  //   );
  //   if (!hasActiveFilters) {
  //     setFilteredRows(originalRows);
  //   }
  // }, [originalRows, filters]);

  React.useEffect(() => {
    const newFilteredRows = originalRows?.filter((row) => {
      let isMatch = true;
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
  }, [filters, commonSearch, fromDate, toDate, columns, selectedColors]);

  const handleLogoutDevice = async (id) => {
    const sp = searchParams.get("sp");

    const mode = isDeleteModel ? "DeviceDelete" : "DeviceForceLogOut";
    const soketMode = isDeleteModel ? "AccountDeleted" : "ForceLogout";

    const body = {
      con: `{"id":"","mode":"${mode}","appuserid":"amrut@eg.com"}`,
      p: `{\"AppDevRowId\":${id}}`,
      f: "Task Management (taskmaster)",
    };
    try {
      const response = await GetWorkerData(body, sp);
      if (response?.Data?.rd[0]?.msg === "Success") {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        setDeviceStatus(soketMode);
      }
    } catch (err) {
      console.error("Error updating customer bind:", err);
    }
  };

  const handleCustomerBindChange = async (newBindId, row) => {
    const body = {
      con: '{"id":"","mode":"DeviceCustomerBind","appuserid":"amrut@eg.com"}',
      p: `{\"AppDevRowId\":${row.Id},\"CustomerBindTypeId\":${newBindId}}`,
      f: "Task Management (taskmaster)",
    };
    const sp = searchParams.get("sp");
    try {
      const response = await GetWorkerData(body, sp);
      if (response?.Data?.rd[0]?.msg === "Success") {
        setAllRowData((prevData) => {
          return prevData.map((r) => {
            if (r["19"] === row.Id) {
              return {
                ...r,
                11: newBindId,
              };
            }
            return r;
          });
        });
        setDeviceStatus("CustomerBindChanged");
      }
    } catch (err) {
      console.error("Error updating customer bind:", err);
    }
  };

  const handleAccessChange = async (event, row) => {
    const isChecked = event.target.checked;

    const body = {
      con: '{"id":"","mode":"DeviceEnbDcb","appuserid":"amrut@eg.com"}',
      p: `{"AppDevRowId":${row?.Id},"IsEnable":${isChecked ? 1 : 0}}`,
      f: "Task Management (taskmaster)",
    };

    const sp = searchParams.get("sp");
    try {
      const fetchedData = await GetWorkerData(body, sp);

      if (fetchedData?.Data.rd[0]?.msg === "Success") {
        setAllRowData((prevData) => {
          return prevData.map((r) => {
            if (r["19"] === row.Id) {
              return {
                ...r,
                6: isChecked ? 1 : 0,
              };
            }
            return r;
          });
        });

        let isCheckedVal = isChecked ? "deviceEnabled" : "deviceDisabled";
        setDeviceStatus(isCheckedVal);
        setAllColumData((prev) => [...prev]); // If needed to refresh columns
      }
    } catch (error) {
      console.error("Failed to update Access:", error);
    }
  };

  const handleFilterChange = (field, value, filterType) => {
    setFilters((prevFilters) => {
      if (filterType === "MultiSelection") {
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
            <div style={{ width: "100%", margin: "10px 20px" }}>
              <CustomTextField
                key={`filter-${col.field}-NormalFilter`}
                type="text"
                placeholder={`Filter by ${col.headerName}`}
                value={filters[col.field] || ""}
                onChange={(e) => handleFilterChange(col.field, e.target.value)}
                className="filter_column_box"
              />
            </div>
          );
        case "suggestionFilter": {
          const uniqueValues = [
            ...new Set(originalRows.map((row) => row[col.field])),
          ];

          return (
            <div
              key={`filter-${col.field}-suggestionFilter`}
              style={{ width: "100%", margin: "10px 20px" }}
            >
              <CustomTextField
                fullWidth
                placeholder={`Search ${col.headerName}`}
                value={filters[col.field] || ""}
                onChange={(e) => handleFilterChange(col.field, e.target.value)}
                InputProps={{
                  inputProps: {
                    list: `suggestions-${col.field}`,
                  },
                }}
                customBorderColor="rgba(47, 43, 61, 0.2)"
                borderoutlinedColor="#00CFE8"
                customTextColor="#2F2B3DC7"
                customFontSize="0.8125rem"
                size="small"
                variant="filled"
              />
              <datalist id={`suggestions-${col.field}`}>
                {uniqueValues.map((value) => (
                  <option
                    key={`suggestion-${col.field}-${value}`}
                    value={value}
                  />
                ))}
              </datalist>
            </div>
          );
        }

        default:
          return null;
      }
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
    if (!col.filterTypes || !col.filterTypes.includes("MultiSelection"))
      return null;

    const uniqueValues = [
      ...new Set(originalRows.map((row) => row[col.field])),
    ];

    return (
      <div key={col.field}>
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
                      "MultiSelection"
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
  };

  const handleOnChangeRange = (dates) => {
    const [start, end] = dates;
    setFromDate(start);
    setToDate(end);
  };

  const handleClose = () => setOpen(false);

  const [sideFilterOpen, setSideFilterOpen] = React.useState(false);
  const toggleDrawer = (newOpen) => () => {
    setSideFilterOpen(newOpen);
  };

  const renderSummary = () => {
    return (
      <div className="summaryBox">
        {summaryArray?.map((col) => {
          return (
            <div className="summaryItem" key={col.field}>
              <div className="AllEmploe_boxViewTotal">
                <div>
                  <p className="AllEmplo_boxViewTotalValue">{col?.Title}</p>
                  <p className="boxViewTotalTitle">{col.summaryTitle}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // const renderSummary = () => {
  //   const summaryColumns = columns.filter((col) => {
  //     const columnData = Object.values(allColumData).find(
  //       (data) => data.field === col.field
  //     );
  //     return columnData?.summary;
  //   });

  //   return (
  //     <div className="summaryBox">
  //       {summaryColumns.map((col) => (
  //         <div className="summaryItem">
  //           <div key={col.field} className="AllEmploe_boxViewTotal">
  //             <div>
  //               <p className="AllEmplo_boxViewTotalValue">
  //                 {filteredRows
  //                   ?.reduce(
  //                     (sum, row) => sum + (parseFloat(row[col.field]) || 0),
  //                     0
  //                   )
  //                   .toFixed(col?.summuryValueKey)}
  //                 {/* {col.field === "jobCount"
  //                   ? filteredRows?.reduce(
  //                       (sum, row) => sum + (parseInt(row[col.field], 10) || 0),
  //                       0
  //                     )
  //                   : filteredRows?.length} */}
  //               </p>
  //               <p className="boxViewTotalTitle">{col.summaryTitle}</p>
  //             </div>
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };

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

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
    saveAs(data, "data.xlsx");
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

  const moveColumn = (fromIndex, toIndex) => {
    const newColumns = [...columns];
    const [movedColumn] = newColumns.splice(fromIndex, 1);
    newColumns.splice(toIndex, 0, movedColumn);
    setColumns(newColumns);
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

  // console.log("filteredRows", filteredRows);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div
        className="DeviceAllData_mainGridView"
        sx={{ width: "100vw", display: "flex", flexDirection: "column" }}
        ref={gridContainerRef}
      >
        {isLoading && (
          <div className="loader-overlay">
            {/* <CircularProgress className="loadingBarManage" /> */}
          </div>
        )}
        {showSuccess && (
          <div className="success-message">
            {" "}
            {isDeleteModel ? "Delete" : "Logout"} successful!
          </div>
        )}
        <Modal
          open={showLogoutModal}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "0px",
            outline: "0px",
          }}
        >
          <div style={{ backgroundColor: "white", padding: "5px 20px" }}>
            <p
              style={{
                margin: "10px 0px 20px 0px",
                fontWeight: 600,
              }}
            >
              Are you sure you want to {isDeleteModel ? "Delete" : "logout"}{" "}
              this device?
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <Button
                onClick={() => setShowLogoutModal("")}
                style={{
                  height: "35px",
                  width: "80px",
                  backgroundColor: "#e73838",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
                className="LogoutPopup_btn"
              >
                No
              </Button>
              <Button
                onClick={() => {
                  handleLogoutDevice(logoutRow?.Id); // Or whatever key
                  setShowLogoutModal(false);
                }}
                className="LogoutPopup_btn"
                style={{
                  height: "35px",
                  width: "80px",
                  backgroundColor: "#7568fb",
                  fontWeight: 600,
                  fontSize: "16px",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Yes
              </Button>
            </div>
          </div>
        </Modal>

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
                        setCheckedColumns={setCheckedColumns}
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
          <p style={{ margin: "20px 20px 0px 20px", fontSize: "25px" }}>
            Filter
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {columns
              .filter(
                (col) =>
                  col.filterable && col.filterTypes?.includes("MultiSelection")
              )
              .map((col) => renderFilterMulti(col))}
          </div>

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
            padding: "20px",
          }}
        >
          <div style={{ display: "flex", gap: "10px", alignItems: "end" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <Button onClick={toggleDrawer(true)} className="FiletrBtnOpen">
                Open Filter
              </Button>
              <Button className="SetDefault_pin">Set Default Pin</Button>
              <Button className="Re_CalculateButton">Recalculate</Button>
              {/* <p
                style={{ fontWeight: 600, color: "#696262", fontSize: "17px" }}
              >
                {" "}
                Last Updated :- {lastUpdated}
              </p> */}
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

            <CustomTextField
              type="text"
              placeholder="Common Search..."
              value={commonSearch}
              customBorderColor="rgba(47, 43, 61, 0.2)"
              onChange={(e) => setCommonSearch(e.target.value)}
            />

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

            <button onClick={handleClearFilter} className="ClearFilterButton">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 512 512"
                class="mr-2"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"></path>
              </svg>
              Clear Filters
            </button>
          </div>
        </div>

        <div
          ref={gridRef}
          style={{ height: "calc(100vh - 305px)", margin: "5px" }}
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
            <DataGrid
              rows={filteredRows ?? []}
              columns={columns ?? []}
              pageSize={pageSize}
              autoHeight={false}
              checkboxSelection
              columnBuffer={17}
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    status: false,
                    traderName: false,
                  },
                },
              }}
              loading={isLoading}
              components={{
                Toolbar: () => null,
                LoadingOverlay: () => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    {/* Loading... */}
                    <CircularProgress className="loadingBarManage" />
                  </div>
                ),
              }}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              rowsPerPageOptions={[5, 10, 15, 25, 50]}
              className="simpleGridView"
              pagination
              sx={{
                "& .MuiDataGrid-menuIcon": {
                  display: "none",
                },
                marginLeft: 2,
                marginRight: 2,
                marginBottom: 2,
              }}
            />
          )}
        </div>
      </div>

      {/* <Modal
        open={open}
        // onClose={handleClose}
        disableEnforceFocus
        disableAutoFocus
        hideBackdrop
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          border: "0px",
          outline: "0px",
          pointerEvents: "none",
        }}
      >
        <Slide in={open} direction="down" timeout={500}>
          <Box
            sx={{
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              width: "97%",
              maxHeight: "95vh",
              overflowY: "auto",
              border: "none",
              outline: "none",
              pointerEvents: "auto",
            }}
          >
            <SingleEmployeeWiseData
              selectedDepartmentId={selectedDepartmentId}
              selectedEmployeeCode={selectedEmployeeCode}
              // currentLocation={selectedLocation}
              startDate={startDate}
              endDate={endDate}
              handleClose={handleClose}
              selectedEmployeeBarCode={selectedEmployeeBarCode}
              selectedEmployeeName={selectedEmployeeName}
              selectedMetalType={selectedMetalType}
            />
          </Box>
        </Slide>
      </Modal> */}
    </DragDropContext>
  );
}
