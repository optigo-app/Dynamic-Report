import { Paper, Typography, Box } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { styled } from "@mui/material/styles";

const CompactLossCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0.5, 1.5),
  background: theme.palette.background.paper,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  minWidth: 200,
  height: 40,
  borderRadius: 8,
  boxShadow: "none", // keep it flat for navbar
  border: `1px solid ${theme.palette.divider}`,
}));

export default function PureLossAnalyticsCard({ PureGrossLoss }) {
  return (
    <CompactLossCard>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <TrendingDownIcon color="error" fontSize="small" />
        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={500}
          noWrap
        >
          Pure Loss
        </Typography>
      </Box>
      <Typography
        variant="body2"
        color="error"
        fontWeight={600}
        sx={{ whiteSpace: "nowrap" }}
      >
        {PureGrossLoss?.factoryLoss?.toFixed(2) || 0}%
      </Typography>
    </CompactLossCard>
  );
}
