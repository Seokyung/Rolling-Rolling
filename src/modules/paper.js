// action type
export const GET_PAPER = "paper/GET_PAPER";

// action function
export const getPaper = ({
	paperId,
	paperName,
	createdAt,
	creatorId,
	isPrivate,
	// paperCode,
}) => {
	return {
		type: GET_PAPER,
		paperId,
		paperName,
		createdAt,
		creatorId,
		isPrivate,
		// paperCode,
	};
};

// initial state
const initialState = {};

// reducer
function paperReducer(state = initialState, action) {
	switch (action.type) {
		case GET_PAPER:
			return {
				paperId: action.paperId,
				paperName: action.paperName,
				createdAt: action.createdAt,
				creatorId: action.creatorId,
				isPrivate: action.isPrivate,
				// paperCode: action.paperCode
			};
		default:
			return state;
	}
}

export default paperReducer;
