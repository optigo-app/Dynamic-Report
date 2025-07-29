import React from "react";
import { Paper, Box, Typography, Divider, Chip, IconButton, Popover, Tooltip, TableCell, Table, TableBody, TableHead, TableRow } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { styled } from "@mui/material/styles";
import { getChipColorStyles } from "../../libs/function";



const CompanyRow = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0.6, 0),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
    borderRadius: theme.spacing(1),
  },
}));

const CompanyDetails = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
}));

const ValueGroup = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
}));

const FooterSummary = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  padding: theme.spacing(1, 2),
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.default,
  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  position: "sticky",
  bottom: 0,
}));

const CompanyTypeList = ({ companyTypeSummary }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedItems, setSelectedItems] = React.useState([]);
  const [selectedType, setSelectedType] = React.useState(null);
  const formattedData = companyTypeSummary?.map((item) => ({
    type: item?.companyType,
    orders: item?.totalJobs,
    delayed: item?.delayedJobs,
    delayPercent: item?.delayPercent,
    items: item?.items,
  }));

  const handleOpen = (e, items, type) => {
    setAnchorEl(e.currentTarget);
    setSelectedItems(items);
    setSelectedType(type);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedItems([]);
    setSelectedType(null);
  };

  const open = Boolean(anchorEl);

  const totalOrders = formattedData?.reduce((sum, c) => sum + c.orders, 0);
  const totalDelayed = formattedData?.reduce((sum, c) => sum + c.delayed, 0);
  const overallDelayPercent = totalOrders > 0 ? (totalDelayed / totalOrders) * 100 : 0;

  return (
    <>
      <Typography variant="h6" mb={2}>
        Company Type Wise Details
      </Typography>
      <Box sx={{ height: 380, width: "100%" ,overflowY:"auto" }}>
        {formattedData?.map((row, index) => (
          <React.Fragment key={index}>
            <CompanyRow>
              <CompanyDetails>
                <Tooltip title="View Items" arrow>
                  <IconButton size="small" onClick={(e) => handleOpen(e, row.items, row.type)}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography fontWeight={500}>{row?.type}</Typography>
              </CompanyDetails>

              <ValueGroup>
                <Typography variant="body2" color="text.secondary">
                  Orders: <strong>{row?.orders?.toLocaleString()}</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Delayed: <strong>{row?.delayed?.toLocaleString()}</strong>
                </Typography>
                <Chip
                  label={`${row?.delayPercent?.toFixed(2)}%`}
                  size="small"
                  sx={{
                    fontWeight: 600,
                    borderRadius: 3,
                    ...getChipColorStyles(row?.delayPercent),
                  }}
                />

              </ValueGroup>
            </CompanyRow>
            {index !== formattedData?.length - 1 && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}

        <FooterSummary>
          <Typography variant="subtitle1" fontWeight={600}>
            Total Orders: {totalOrders?.toLocaleString()}
          </Typography>
          <Typography variant="subtitle1" fontWeight={600}>
            Total Delayed: {totalDelayed?.toLocaleString()}
          </Typography>
          <Chip
            label={
              <Typography variant="subtitle1" fontWeight={600}>
                Overall Delay: {overallDelayPercent?.toFixed(2)}%
              </Typography>
            }
            size="medium"
            sx={{ fontWeight: 600, fontSize: "1rem", ...getChipColorStyles(overallDelayPercent) }}
          />
        </FooterSummary>
      </Box>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          sx: {
            p: 2,
            borderRadius: 2,
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.1)",
            minWidth: 200,
          },
        }}
      >
        <PremiumTable selectedType={selectedType} selectedItems={selectedItems} />
      </Popover>
    </>
  );
};

export default CompanyTypeList;
function PremiumTable({ selectedItems, selectedType }) {
  const totalQty = selectedItems.length;
  const totalDelayOrders = selectedItems.filter(
    (item) => parseFloat(item["Delivery Age"]) < 0
  ).length;

  const avgDelayPercent = totalQty
    ? (totalDelayOrders / totalQty) * 100
    : 0;

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 2,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        minWidth: 460,
        maxHeight: 340,
        overflowY: "auto",
      }}
    >
      {/* HEADER */}
      <Box
        px={2}
        py={1.5}
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: "#f9fafb",
          position: "sticky",
          top: 0,
          zIndex: 1,
        }}
      >
        <Typography variant="subtitle2" fontWeight={600}>
          {selectedType}
        </Typography>

        <Box display="flex" gap={2} mt={0.5} flexWrap="wrap">
          <Typography variant="caption" color="text.secondary">
            Total Items: <strong>{totalQty}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Delay Orders: <strong>{totalDelayOrders}</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Delay %:
            <Chip
              label={`${avgDelayPercent.toFixed(2)}%`}
              size="small"
              sx={{
                fontWeight: 500,
                fontSize: "0.75rem",
                height: 20,
                borderRadius: 2,
                ml: 0.5,
                ...getChipColorStyles(avgDelayPercent),
              }}
            />
          </Typography>
        </Box>
      </Box>

      {/* TABLE */}
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f9fafb" }}>
            <TableCell sx={headStyle}>#</TableCell>
            <TableCell sx={headStyle}>Job No.</TableCell>
            <TableCell sx={headStyle}>Design No.</TableCell>
            <TableCell sx={headStyle} align="right">
              Customer
            </TableCell>
            <TableCell sx={headStyle} align="right">
              Delay Age
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {selectedItems?.map((item, idx) => {
            const delayAge = parseFloat(item["Delivery Age"]) || 0;
            return (
              <TableRow
                key={idx}
                hover
                sx={{
                  backgroundColor: idx % 2 === 0 ? "#fafafa" : "transparent",
                }}
              >
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{item["Job No."]}</TableCell>
                <TableCell>{item["Design No."]}</TableCell>
                <TableCell align="right">{item["Customer Code"]}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={delayAge}
                    size="small"
                    sx={{
                      fontWeight: 500,
                      fontSize: "0.75rem",
                      height: 22,
                      borderRadius: 4,
                      ...getChipColorStyles(delayAge),
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
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

