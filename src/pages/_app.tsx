import { AppProps } from "next/app";
import "nextra-theme-docs/style.css";
import "../../styles/global.css"

export default function Nextra({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
