// action type
export const GET_MESSAGE = "message/GET_MESSAGE";

// action function
export const getMessage = ({
	id,
	msgTitle,
	msgWriter,
	msgContent,
	paperId,
	createdAt,
	isPrivate,
}) => {
	return {
		type: GET_MESSAGE,
		id,
		msgTitle,
		msgWriter,
		msgContent,
		paperId,
		createdAt,
		isPrivate,
	};
};

// initial state
const initialState = {};

// reducer
function messageReducer(state = initialState, action) {
	switch (action.type) {
		case GET_MESSAGE:
			return {
				id: action.id,
				msgTitle: action.msgTitle,
				msgWriter: action.msgWriter,
				msgContent: action.msgContent,
				paperId: action.paperId,
				createdAt: action.createdAt,
				isPrivate: action.isPrivate,
			};
		default:
			return state;
	}
}

export default messageReducer;
