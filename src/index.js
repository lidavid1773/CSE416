import{App,GlobalGeoJsonContext} from "./App";
import LeafletOnly from"./LeafletMap";
import Edit from"./editable";
import Counter  from "./CounterButton"
import React from "react";
import ReactDOM from "react-dom/client";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
    {/* <App /> */}
    {/* <LeafletOnly /> */}
    <Edit />
  </div>
 
);
