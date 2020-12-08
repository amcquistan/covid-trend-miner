import { ADD_TODO } from '../actions';
import { RENDER_TODO_LIST } from '../actions';

const initialState: any = {
    toDoList: []
};

export default function toDoApp(state = initialState, action: any) {
    switch (action.type) {
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