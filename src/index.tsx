import App from "./App";
import { createRoot } from "react-dom/client";
import "./index.css";
import * as React from "react";
import { registerServiceWorker } from "./registerServiceWorker";
import { BrowserRouter } from "react-router-dom";
import { SWRConfig } from "swr";
import LoadingSpiner from "./components/Loading/LoadingSpiner";
import { ApolloProvider } from "@apollo/client";
import client from "./services/Apollo";
const root = createRoot(document.getElementById("root") as HTMLElement);
console.log("root", process.env.NODE_ENV);
root.render(
  // <SWRConfig>
  <ApolloProvider client={client}>
    <BrowserRouter>
      <React.Suspense fallback={<LoadingSpiner />}>
        <App />
      </React.Suspense>
    </BrowserRouter>
  </ApolloProvider>
  // </SWRConfig>
);
registerServiceWorker();
