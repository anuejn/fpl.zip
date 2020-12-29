import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

if (module.hot) {
  module.hot.accept();
}

window.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App />, document.getElementById("root"));
});
