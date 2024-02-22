import reportWebVitals from "@/reportWebVitals";
import React, { FC } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@/config";

// font
// import "@fontsource/noto-sans-jp/400.css";

// styles
import "@/index.css";
import theme from "@/theme";
import { ChakraProvider } from "@chakra-ui/react";

// pages
import Home from "@/pages/Home";
import Lights from "@/pages/Lights";
import Groups from "@/pages/Groups";
import NotFound from "@/pages/misc/404";

const Router: FC = () => {
  return (
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {/* <ScrollToTop /> */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lights" element={<Lights />} />
              <Route path="/groups" element={<Groups />} />
              <Route path="*" element={<NotFound />} />
              <Route path="/404" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
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
