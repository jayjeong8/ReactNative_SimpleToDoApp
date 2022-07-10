import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, TouchableOpacity, TextInput} from 'react-native';
import {useEffect, useState} from 'react';
import {theme} from '../theme';
import {useRecoilState, useRecoilValue, useSetRecoilState} from 'recoil';
import List from "./List";
import {FilteredTodoListState, TodoListFilterState, TodoListState} from "../atom";


export default function TodoList() {
  const filteredTodoList = useRecoilValue(FilteredTodoListState);
  const [todoList, setTodoList] = useRecoilState(TodoListState);
  const [categoryState, setCategoryState] = useRecoilState(TodoListFilterState);
  const [text, setText] = useState("");

  const categoryDone = () => setCategoryState(false);
  const categoryToDo = () => setCategoryState(true);
  const onChangeText = (payload) => setText(payload);


  const addToDo = async () => {
    if (text === "") {
      return;
    }
    const tempTodos = {...todoList, [Date.now()]: {message: text, category: categoryState}};
    setTodoList(tempTodos);
    setText("");
  };


  return (
      <View style={styles.container}>
        <StatusBar style="light"/>
        <View style={styles.header}>
          <TouchableOpacity onPress={categoryToDo}>
            <Text style={{...styles.btnText, color: categoryState ? theme.white : theme.grey}}>To Do</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={categoryDone}>
            <Text style={{...styles.btnText, color: categoryState ? theme.grey : theme.white}}>Done</Text>
          </TouchableOpacity>
        </View>
        {
          categoryState && (
            <TextInput
              value={text}
              onSubmitEditing={addToDo}
              onChangeText={onChangeText}
              returnKeyType={"done"}
              placeholder={"What do you have to do?"}
              style={styles.input}>
            </TextInput>
          )
        }
        <List />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.black,
  },
  header: {
    flexDirection: "row",
    marginTop: 100,
    marginBottom: theme.gapL,
    marginHorizontal: theme.gapM,
  },
  btnText: {
    marginRight: theme.gapM,
    fontSize: 44,
    fontWeight: "600",
  },
  input: {
    backgroundColor: theme.white,
    marginHorizontal: theme.gapM,
    marginBottom: theme.gapL,
    paddingVertical: theme.gapS,
    paddingHorizontal: theme.gapM,
    borderRadius: 4,
    fontSize: 16,
  },
  toDo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.grey,
    paddingHorizontal: theme.gapM,
    paddingVertical: theme.gapM,
    marginBottom: theme.gapS,
    borderRadius: 4,
  },
  toDoText: {
    color: theme.white,
    fontSize: 16,
  },
});
