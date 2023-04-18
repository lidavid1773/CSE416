import{App,GlobalGeoJsonContext} from "./App";
import LeaflletOnly from"./LeafletMap";
import Counter  from "./CounterButton"
import React from "react";
import ReactDOM from "react-dom/client";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
     {/* <App /> */}
    <LeaflletOnly />
  </div>
 
);
