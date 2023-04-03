import { combineReducers } from "redux";
import userReducer from "./user";
import messageReducer from "./message";

const rootReducer = combineReducers({
	userReducer,
	messageReducer,
});

export default rootReducer;
