let reducer = (state, action) => {
    switch (action.type) {
        case 'WRONG':
            return {
                ...state,
                wrong: action.payload
            };
        case 'RIGHT':
            return {
                ...state,
                right: action.payload
            };
        case 'MESSAGE':
            return {
                ...state,
                message: action.payload
            };
        case 'GAMEOVER':
            return {
                ...state,
                gameover: action.payload
            };
        case 'RESET':
            return {
                ...state,
                gameover: 0,
                message: '',
                right:0,
                wrong:0
            };
        case 'ACTIVE_CARDS':
            return {
                ...state,
                activeCardsArr:action.payload
            }

        default: return state;
    }
}

export default reducer
