
import { styled } from "@mui/material/styles";
import { ToggleButtonGroup } from "@mui/material";
const ModernToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
    backgroundColor: "#f1f5f9",
    borderRadius: 22,
    padding: 4,
    transition: "all 0.2s ease-in-out",
    transform: "translateX(var(--slider-offset, 0))",
    "& .MuiToggleButton-root": {
      border: "none",
      borderRadius: 22,
      padding: "5px 18px",
      textTransform: "none",
      fontWeight: 500,
      color: "#64748b",
      "&.Mui-selected": {
        backgroundColor: "#fff",
        color: "#0f172a",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      },
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
    },
  }));

  export {ModernToggleButtonGroup}