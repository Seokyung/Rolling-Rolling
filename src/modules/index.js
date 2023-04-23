import { combineReducers } from "redux";
import userReducer from "./user";
import paperReducer from "./paper";
import messageReducer from "./message";

const rootReducer = combineReducers({
	userReducer,
	paperReducer,
	messageReducer,
});

export default rootReducer;
