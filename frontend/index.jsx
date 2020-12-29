import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "./index.css"

if (module.hot) {
  module.hot.accept();
}

window.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(<App />, document.getElementById("root"));
});
