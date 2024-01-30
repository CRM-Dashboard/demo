import React from "react";
import "./theme";

import { CssBaseline } from "@mui/material";
import { ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import { SnackbarProvider } from "material-ui-snackbar-provider";
import { ErrorBoundary } from "react-error-boundary";
import { appTheme } from "./theme";

import CustomSnackbar from "./crm/components/snackbar/CustomSnackbar";
import ErrorCallback from "./routes/ErrorFallback";
import Content from "./routes";

const style = {
  autoHideDuration: 5000,
  anchorOrigin: { vertical: "top", horizontal: "center" },
};

export default function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={appTheme}>
        <SnackbarProvider
          SnackbarComponent={CustomSnackbar}
          SnackbarProps={style}
        >
          <ErrorBoundary FallbackComponent={ErrorCallback}>
            <CssBaseline />
            <Content />
          </ErrorBoundary>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
