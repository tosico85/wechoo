import { createStore } from "redux";
import { authService } from "fbase";

const reducer = (state = {}, action) => {
  switch (action.type) {
    case "LOGIN":
      return (state = [...state, { text: action.text, id: Date.now() }]);
    case "LOGOUT":
      return state.filter((item) => item.id !== action.id);
    default:
      return state;
  }
};

const store = createStore(reducer);

const addToDo = (text) => {
  return { type: "ADD", text };
};

const deleteToDo = (id) => {
  return { type: "DELETE", id };
};

export const actionCreators = {
  addToDo,
  deleteToDo,
};

//store.subscribe();

export default store;
