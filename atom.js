import {atom, selector} from "recoil";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@toDos";
const DATA = {
  "one": {message: "Message #1", category: true},
  "two": {message: "Message #2", category: false},
  "three": {message: "Message #3", category: true},
};

const getLocalData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log("load", e);
  }
}
export const storeData = async (value) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue)
  } catch (e) {
    console.log("store", e);
  }
}

export const TodoListState = atom({
  key: 'todoState',
  default: getLocalData(),
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
    return Object.keys(list).filter(key => list[key].category === filter);

  }
})