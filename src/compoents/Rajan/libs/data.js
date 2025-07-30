import { createTheme } from "@mui/material";

export const Datetheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#7B61FF", // Classy indigo (Linear-esque)
      contrastText: "#fff",
    },
    secondary: {
      main: "#FF8577", // Coral / playful soft red
    },
    background: {
      default: "#F9FAFB", // Clean SaaS-like background
      paper: "#ffffff", // For cards/panels
    },
    text: {
      primary: "#1E1E1E",
      secondary: "#6B7280",
    },
    divider: "rgba(0,0,0,0.08)",
  },

  typography: {
    fontFamily: `"Inter", "Poppins", "Roboto", "Helvetica", "Arial", sans-serif`,
    fontSize: 14,
    h1: { fontWeight: 700, fontSize: "2.25rem" },
    h2: { fontWeight: 600, fontSize: "1.875rem" },
    h3: { fontWeight: 600, fontSize: "1.5rem" },
    h4: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 500 },
    caption: {
      fontSize: "0.75rem",
      fontWeight: 500,
      letterSpacing: "0.03em",
    },
  },

  shape: {
    borderRadius: 4,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F9FAFB",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
          boxShadow: "none",
        },
        containedPrimary: {
          backgroundColor: "#7B61FF",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#6246EA",
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: "#fff",
          "& .MuiOutlinedInput-root": {
            borderRadius: 4,
            "& fieldset": {
              borderColor: "#E0E0E0",
            },
            "&:hover fieldset": {
              borderColor: "#BDBDBD",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#7B61FF",
            },
          },
          "& .MuiInputBase-input": {
            padding: "10px 14px",
          },
          "& .MuiInputLabel-root": {
            color: "#757575",
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#7B61FF",
          },
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.08)",
          maxHeight: "200px",
          overflowY: "auto",
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: 13,
          backgroundColor: "#111827",
          borderRadius: 6,
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          boxShadow: "0 6px 24px rgba(0, 0, 0, 0.04)",
        },
      },
    },

    // Enhanced Typography for weekday labels
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-caption": {
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#6B7280",
            textAlign: "center",
            padding: "4px 6px",
            minWidth: "32px",
            display: "inline-block",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          },
        },
      },
    },

    MuiPickersCalendarHeader: {
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
          marginTop: "8px",
          marginBottom: "8px",
        },
        labelContainer: {
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "#1E1E1E",
        },
      },
    },

    // Month/Year navigation buttons
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&.MuiPickersArrowSwitcher-button": {
            backgroundColor: "transparent",
            border: "1px solid #E5E7EB",
            borderRadius: "8px",
            width: "32px",
            height: "32px",

            "&:hover": {
              backgroundColor: "rgba(123, 97, 255, 0.08)",
              borderColor: "#7B61FF",
            },
          },
        },
      },
    },
  },
});
