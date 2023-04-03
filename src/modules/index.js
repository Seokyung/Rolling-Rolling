import { combineReducers } from "redux";
import userReducer from "./app";

const rootReducer = combineReducers({
	userReducer,
});

export default rootReducer;
