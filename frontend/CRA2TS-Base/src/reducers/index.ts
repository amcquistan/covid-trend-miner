import { GET_COUNTRIES, ADD_TODO } from '../actions';
import { RENDER_TODO_LIST } from '../actions';

const initialState: any = {
    toDoList: []
};

export default function COVIDMiner(state = initialState, action: any) {
    switch (action.type) {
        case GET_COUNTRIES:
            return {
                ...state,
                toDoList: action.toDoList
            };
        case ADD_TODO:
            let newToDoList = [
                ...state.toDoList,
                {
                    ...action.toDoItem
                }
            ];
            return {
                ...state,
                toDoList: newToDoList
            };
        case RENDER_TODO_LIST:
            return {
                ...state,
                toDoList: action.toDoList
            };
        default:
            return state;
    }
}