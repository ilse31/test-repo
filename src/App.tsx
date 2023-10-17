import React from "react";
import Routed from "./routes";
import { ContactProvider } from "./context/contactdata";

type Props = {};

const App = (props: Props) => {
  return (
    <ContactProvider>
      <Routed />
    </ContactProvider>
  );
};

export default App;
