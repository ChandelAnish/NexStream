"use client";

import * as React from "react";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "@mui/x-date-pickers/themeAugmentation";

const PRIMARY_COLOR = "#086861";

const theme = createTheme({
  components: {
    MuiPickersDay: {
      styleOverrides: {
        root: {
          borderRadius: 5, // square shape
          "&:hover": {
            backgroundColor: PRIMARY_COLOR,
            color: "#ffffff",
          },
          "&.Mui-selected": {
            backgroundColor: PRIMARY_COLOR,
            color: "#ffffff",
            "&:hover": {
              backgroundColor: PRIMARY_COLOR, // same as selected
            },
          },
        },
      },
    },
    MuiPickersCalendarHeader: {
      styleOverrides: {
        label: {
          color: PRIMARY_COLOR,
          fontWeight: "bold",
        },
        switchViewButton: {
          color: PRIMARY_COLOR,
        },
        root: {
          "& .MuiIconButton-root": {
            color: PRIMARY_COLOR, // nav arrows
          },
        },
      },
    },
  },
});

export default function CustomCalendar() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs());

  return (
    <div className="bg-white h-1/3 w-auto float-right">
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={value}
            onChange={(newValue) => setValue(newValue)}
          />
        </LocalizationProvider>

        <div className="-mt-10 p-3 bg-teal-50 rounded-lg flex justify-between">
          <div>
            <div className="text-xs">Today</div>
            <div className="text-md font-semibold text-teal-800">Mumbai</div>
          </div>

          <div className="text-3xl font-medium text-teal-800">
            12:54 <span className="text-sm">PM</span>
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
