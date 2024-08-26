// import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../styles/theme";

import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/store/store";

import GlobalState from "@/components/GlobalState";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <GlobalState>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </GlobalState>
    </Provider>
  );
}
