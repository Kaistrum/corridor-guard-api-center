import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "@kaistrum/stratum-ui";
import { AuthProvider } from "@/lib/auth";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  );
}
