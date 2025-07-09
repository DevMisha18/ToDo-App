import type { AppProps } from "next/app";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthUpdater } from "@/components/authUpdater";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <AuthUpdater />
        <Component {...pageProps} />
      </ThemeProvider>
    </ReduxProvider>
  );
}
