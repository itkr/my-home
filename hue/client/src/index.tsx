import reportWebVitals from "@/reportWebVitals";
import React, { FC } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// font
// import "@fontsource/noto-sans-jp/400.css";

// styles
import "@/index.css";
import theme from "@/theme";
import { ChakraProvider } from "@chakra-ui/react";

// pages
import Home from "@/pages/Home";
import NotFound from "@/pages/misc/404";

const Router: FC = () => {
  return (
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          {/* <ScrollToTop /> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/404" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </React.StrictMode>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<Router />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
