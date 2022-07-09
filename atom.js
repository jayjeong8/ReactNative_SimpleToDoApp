import {atom, selector} from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";
const DATA = {
  "one": {message: "Message #1", category: true},
  "two": {message: "Message #2", category: false},
  "three": {message: "Message #3", category: true},
};

const loadLocalTodoList = AsyncStorage.getItem(STORAGE_KEY);
let parsedLocalTodoList;
if (loadLocalTodoList !== null) {
  console.log(loadLocalTodoList)
  // parsedLocalTodoList = JSON.parse(loadLocalTodoList);
} else {
  parsedLocalTodoList = DATA
}

export const TodoListState = atom({
  key: 'todoState',
  default: DATA,
})

export const TodoListFilterState = atom({
  key: 'todoListFilterState',
  default: true,
})

export const FilteredTodoListState = selector({
  key: 'filteredTodoListState',
  get: ({get}) => {
    const filter = get(TodoListFilterState);
    const list = get(TodoListState);
    console.log(list);
    return Object.keys(list).filter(key => list[key].category === filter);

  }
})

const SaveTodoState = selector({ //콘솔 찍어보기
  key: 'saveTodoState',
  get: async ({get}) => {
    const todoList = get(TodoListState);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(todoList));
  }
})