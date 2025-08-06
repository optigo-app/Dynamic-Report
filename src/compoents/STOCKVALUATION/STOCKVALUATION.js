// http://localhost:3000/testreport/?sp=9&ifid=ToolsReport&pid=18312

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./StockValuation.scss";
import { GetWorkerData } from "../../API/GetWorkerData/GetWorkerData";
import StockModal from "./StockModal";

const STOCKVALUATION = () => {
  const [filterDate, setFilterDate] = useState(new Date());
  const [inData, setInData] = useState([]);
  const [outData, setOutData] = useState([]);
  const [itemMaster, setItemMaster] = useState({});
  const [mergedData, setMergedData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMaterialTypeId, setSelectedMaterialTypeId] = useState(null);

  const formatToMMDDYYYY = (date) => format(date, "MM/dd/yyyy");

  const fetchAll = async (dateObj) => {
    const formattedDate = formatToMMDDYYYY(dateObj);
    const AllData = JSON.parse(sessionStorage.getItem("AuthqueryParams"));
    const sp = new URLSearchParams(window.location.search).get("sp");

    setIsLoading(true);
    try {
        const [inRes, outRes, masterRes] = await Promise.all([
               GetWorkerData(
                 {
                   con: `{"id":"","mode":"STOCK_VALUATION_IN","appuserid":"${AllData?.uid}"}`,
                   p: `{"fdate":"${formattedDate}","tdate":"${formattedDate}"}`,
                   f: "Task Management (taskmaster)",
                 },
                 sp
               ),
               GetWorkerData(
                 {
                   con: `{"id":"","mode":"STOCK_VALUATION_OUT","appuserid":"${AllData?.uid}"}`,
                   p: `{"fdate":"${formattedDate}","tdate":"${formattedDate}"}`,
                   f: "Task Management (taskmaster)",
                 },
                 sp
               ),
               GetWorkerData(
                 {
                   con: `{"id":"","mode":"itam_master","appuserid":"${AllData?.uid}"}`,
                   p: "",
                   f: "Task Management (taskmaster)",
                 },
                 sp
               ),
             ]);

      const inList = inRes?.Data?.rd1 || [];
      const outList = outRes?.Data?.rd1 || [];
      const masterList = masterRes?.Data?.rd1 || [];

      const masterMap = {};
      masterList.forEach((item) => {
        masterMap[item["1"]] = item["2"];
      });

      setItemMaster(masterList); // store full master list
      setInData(inList);
      setOutData(outList);

      mergeData(inList, outList, masterMap);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const mergeData = (inList, outList, masterMap) => {
    const result = {};

    inList.forEach((item) => {
      const id = item["17"];
      if (!result[id]) {
        result[id] = createEmptyItem(id, masterMap);
      }
      result[id].in_weight += parseFloat(item["5"] || 0);
      result[id].in_amount += parseFloat(item["8"] || 0);
    });

    outList.forEach((item) => {
      const id = item["17"];
      if (!result[id]) {
        result[id] = createEmptyItem(id, masterMap);
      }
      result[id].out_weight += parseFloat(item["5"] || 0);
      result[id].out_amount += parseFloat(item["8"] || 0);
    });

    setMergedData(Object.values(result));
  };

  const createEmptyItem = (id, masterMap) => ({
    itemid: id,
    itemname: masterMap[id] || '',
    opening_weight: 0,
    opening_amount: 0,
    in_weight: 0,
    in_amount: 0,
    out_weight: 0,
    out_amount: 0,
    closing_weight: 0,
    closing_amount: 0,
  });

  const handleDateChange = (date) => {
    setFilterDate(date);
    fetchAll(date);
  };

  const handleTypeClick = (itemid) => {
    const item = itemMaster.find((x) => x["1"] === itemid);
    const materialTypeId = item?.["1"];
    const itemName = item?.["2"];

    const filteredIn = inData.filter((x) => x["17"] === itemid);
    const filteredOut = outData.filter((x) => x["17"] === itemid);

    const combined = [
      ...filteredIn.map((item) => ({
        type: `(+)${item["4"]}`,
        weight: parseFloat(item["5"] || 0),
        amount: parseFloat(item["8"] || 0),
      })),
      ...filteredOut.map((item) => ({
        type: `(-)${item["4"]}`,
        weight: parseFloat(item["5"] || 0),
        amount: parseFloat(item["8"] || 0),
      })),
    ];

    setModalData(combined);
    setSelectedItem(itemName);
    setSelectedMaterialTypeId(materialTypeId);
    setModalOpen(true);
  };

  useEffect(() => {
    fetchAll(filterDate);
  }, []);

  return (
    <div className="stock-valuation">
      <h2>Stock Valuation Report</h2>

      <div className="date-picker-container">
        <label>Select Date: </label>
        <DatePicker selected={filterDate} onChange={handleDateChange} />
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <table className="valuation-table">
          <thead>
            <tr>
              <th rowSpan="2">Type</th>
              <th colSpan="2">Opening</th>
              <th colSpan="2">Stock Valuation In</th>
              <th colSpan="2">Stock Valuation Out</th>
              <th colSpan="2">Closing</th>
            </tr>
            <tr>
              <th>Weight</th>
              <th>Amount</th>
              <th>Weight</th>
              <th>Amount</th>
              <th>Weight</th>
              <th>Amount</th>
              <th>Weight</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {mergedData.map((item, index) => (
              <tr key={index}>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleTypeClick(item.itemid);
                    }}
                  >
                    {item.itemname}
                  </a>
                </td>
                <td>{item.opening_weight.toFixed(3)}</td>
                <td>{item.opening_amount.toFixed(2)}</td>
                <td>{item.in_weight.toFixed(3)}</td>
                <td>{item.in_amount.toFixed(2)}</td>
                <td>{item.out_weight.toFixed(3)}</td>
                <td>{item.out_amount.toFixed(2)}</td>
                <td>{item.closing_weight.toFixed(3)}</td>
                <td>{item.closing_amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <StockModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Stock Details: ${selectedItem}`}
        data={modalData}
        selectedMaterialTypeId={selectedMaterialTypeId}
      />
    </div>
  );
};

export default STOCKVALUATION;
