// action type
export const GET_USER = "app/GET_USER";

// action function
export const getUser = ({ uid, displayName, photoURL }) => {
	return { type: GET_USER, uid, displayName, photoURL };
};

// initial state
const initialState = { uid: "" };

// reducer
function userReducer(state = initialState, action) {
	switch (action.type) {
		case GET_USER:
			return {
				uid: action.uid,
				displayName: action.displayName,
				photoURL: action.photoURL,
			};
		default:
			return state;
	}
}

export default userReducer;
