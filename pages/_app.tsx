import "../styles/globals.css";
import type { AppProps } from "next/app";
import { MetaChatProvider } from "../context/metaChat.context";
import { RecoilRoot } from "recoil";
import { AuthProvider } from "../context/auth.context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <RecoilRoot>
      <AuthProvider>
        <MetaChatProvider>
          <Component {...pageProps} />
        </MetaChatProvider>
      </AuthProvider>
    </RecoilRoot>
  );
}

export default MyApp;
