import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  ThemeProvider,
  Box,
  Chip,
  Typography,
} from "@mui/material";
import { Datetheme } from "../../libs/data";

const MAX_DISPLAY_CHIPS = 2;

export default function MetTypeSelect({ selected = [], onChange, MetalTypeList = [] }) {
  const renderSelected = (selectedItems) => {
    if (selectedItems.length === 0) return "";

    const visibleChips = selectedItems.slice(0, MAX_DISPLAY_CHIPS);
    const extraCount = selectedItems.length - MAX_DISPLAY_CHIPS;

    return (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {visibleChips.map((item) => (
          <Chip
            key={item}
            label={<Typography variant="caption">{item}</Typography>}
            size="small"
          />
        ))}
        {extraCount > 0 && (
          <Chip
            label={<Typography variant="caption">+{extraCount} more</Typography>}
            size="small"
          />
        )}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={Datetheme}>
      <Box sx={{ bgcolor: "#fff" }}>
        <FormControl sx={{ minWidth: 250 }} size="small">
          <InputLabel id="mettype-label">Metal Type</InputLabel>
          <Select
            labelId="mettype-label"
            multiple
            value={selected}
            onChange={onChange}
            input={<OutlinedInput label="Metal Type" />}
            renderValue={renderSelected}
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 300,
                },
              },
            }}
          >
            {MetalTypeList.map((type) => (
              <MenuItem key={type} value={type}>
                <Checkbox checked={selected.indexOf(type) > -1} />
                <ListItemText primary={type} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </ThemeProvider>
  );
}
