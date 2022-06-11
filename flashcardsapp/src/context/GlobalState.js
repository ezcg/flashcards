import React, { createContext, useReducer } from 'react';
import AppReducer from './AppReducer'

const initialState = {
    right:0,
    wrong:0,
    message:'',
    gameover:0,
    activeCardsArr:[]
}

export const GlobalContext = createContext(initialState);
export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState);

    function setRight(value) {
        dispatch({
            type: 'RIGHT',
            payload: value
        });
    };

    function setWrong(value) {
        dispatch({
            type: 'WRONG',
            payload: value
        });
    };

    function setMessage(message) {
        dispatch({
            type: 'MESSAGE',
            payload: message
        });
    };

    function setGameover(value) {
        dispatch({
            type: 'GAMEOVER',
            payload: value
        });
    };

    function reset() {
        dispatch({
            type: 'RESET',
            payload: 0
        });
    }

    function setActiveCardsArr(arr) {
        dispatch({
            type: 'ACTIVE_CARDS',
            payload: arr
        });

    }

    return (<GlobalContext.Provider value={{
        right:state.right,
        wrong:state.wrong,
        message:state.message,
        gameover:state.gameover,
        activeCardsArr:state.activeCardsArr,
        setRight,
        setWrong,
        setMessage,
        setGameover,
        reset,
        setActiveCardsArr
    }}>
        {children}
    </GlobalContext.Provider>);
}
