import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "index.css";

import { Provider } from "react-redux";
import { legacy_createStore } from "@reduxjs/toolkit";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "modules";

const root = ReactDOM.createRoot(document.getElementById("root"));

const store = legacy_createStore(rootReducer, composeWithDevTools());

root.render(
	<Provider store={store}>
		<App />
	</Provider>
);
