import { useState } from "react";
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Box, Grid, Popover, Paper, Chip } from "@mui/material";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import CustomTooltip from "./CustomTooltip";
import React from "react";
import { getChipColorStyles, generateDetails } from "../../libs/function";
import { COLORS } from "../../constants/data";

const lossData = [
  { range: "0 - 10%", count: 12, details: generateDetails(12) },
  { range: "10 - 15%", count: 9, details: generateDetails(9) },
  { range: "15 - 20%", count: 7, details: generateDetails(7) },
  { range: "20 - 25%", count: 5, details: generateDetails(5) },
  { range: "25 - 30%", count: 4, details: generateDetails(4) },
  { range: "30 - 40%", count: 3, details: generateDetails(3) },
  { range: "40 - 50%", count: 2, details: generateDetails(2) },
  { range: "Above 50%", count: 1, details: generateDetails(1) },
];

const LossTableWithPopover = ({ rangeAnalysis }) => {
  const [anchorPosition, setAnchorPosition] = useState(null);
  const [popoverItems, setPopoverItems] = useState([]);

  const formattedData = rangeAnalysis?.map((val) => {
    return {
      range: val?.range,
      count: Number(val?.items?.length),
      details: val?.items,
    };
  });

  const handleSliceClick = (event, items) => {
    setPopoverItems(items);
    setAnchorPosition({
      top: event.clientY,
      left: event.clientX,
    });
  };

  const handleClose = () => {
    setAnchorPosition(null);
    setPopoverItems([]);
  };

  const total = lossData.reduce((acc, row) => acc + row.count, 0);

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Design-wise Percentage
      </Typography>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <defs>
            {formattedData?.map((entry, index) => (
              <radialGradient id={`gradient-${index}`} cx="50%" cy="50%" r="80%" key={index}>
                <stop offset="0%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.4} />
                <stop offset="100%" stopColor={COLORS[index % COLORS.length]} stopOpacity={0.9} />
              </radialGradient>
            ))}
          </defs>

          <Pie data={formattedData} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={140} innerRadius={60} cornerRadius={6} paddingAngle={3} labelLine={false} label={({ name, value }) => `${name} (${value})`} onClick={(data, index, e) => handleSliceClick(e, data.payload.details)}>
            {formattedData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} stroke="#fff" strokeWidth={2} cursor="pointer" />
            ))}
          </Pie>

          <Tooltip
            content={<CustomTooltip ShowPer={false} />}
            formatter={(value, name) => [`${value} units`, name]}
            wrapperStyle={{
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              borderRadius: 8,
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <LossPopover anchorPosition={anchorPosition} onClose={handleClose} items={popoverItems} />
    </>
  );
};

export default LossTableWithPopover;

const LossPopover = ({ anchorPosition, onClose, items = [] }) => {
  const open = Boolean(anchorPosition);

  return (
    <Popover
      open={open}
      anchorReference="anchorPosition"
      anchorPosition={anchorPosition}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 4,
          width: 600,
          p: 2,
          bgcolor: (theme) => theme.palette.background.paper,
        },
      }}
    >
      <Box>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ mb: 1 }}>
          Loss Details
        </Typography>

        {items.length > 0 ? (
          <PremiumTable selectedItems={items} />
        ) : (
          <Typography variant="body2" color="text.secondary">
            No details available.
          </Typography>
        )}
      </Box>
    </Popover>
  );
};

function PremiumTable({ selectedItems }) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        maxHeight: 340,
        overflowY: "auto",
      }}
    >
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f9fafb" }}>
            <TableCell sx={headStyle}>#</TableCell>
            <TableCell sx={headStyle}>Item ID</TableCell>
            <TableCell sx={headStyle}>Item Name</TableCell>
            <TableCell sx={headStyle} align="right">
              Quantity
            </TableCell>
            <TableCell sx={headStyle} align="right">
              Delay %
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {selectedItems?.map((item, idx) => (
            <TableRow
              key={idx}
              hover
              sx={{
                backgroundColor: idx % 2 === 0 ? "#fafafa" : "transparent",
              }}
            >
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{`ITEM-${1000 + idx}`}</TableCell>
              <TableCell>{`Product ${String.fromCharCode(65 + idx)}`}</TableCell>
              <TableCell align="right">{item?.CustomerCode}</TableCell>
              <TableCell align="right">
                <Chip
                  label={`${(Math.random() * 100).toFixed(2)}%`}
                  size="small"
                  sx={{
                    fontWeight: 500,
                    fontSize: "0.75rem",
                    height: 22,
                    borderRadius: 4,
                    ...getChipColorStyles(item?.GrossWt),
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

const headStyle = {
  fontWeight: 600,
  fontSize: "0.75rem",
  color: "text.secondary",
  whiteSpace: "nowrap",
};
