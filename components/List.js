import {StyleSheet, ScrollView, LayoutAnimation, Platform, UIManager, View, Alert} from "react-native";
import Item from "./Item";
import {useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {FilteredTodoListState, TodoListState} from "../atom";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function List() {
  const filteredTodoList = useRecoilValue(FilteredTodoListState);
  const [todoList, setTodoList] = useRecoilState(TodoListState);
  const [swipingState, setSwiping] = useState(false);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }, [todoList]);

  const DoneTodo = (key) => { //더 효율적인 방법 고민해보기
    const tempTodos = {...todoList};
    tempTodos[key].category = !tempTodos[key].category;
    setTodoList(tempTodos);
  }

  const deleteTodo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      {text: "Cancel"},
      {
        text: "I'm Sure",
        onPress: () => {
          const tempTodos = {...todoList};
          delete tempTodos[key];
          setTodoList(tempTodos);
        }
      }
    ]);
  };

  const renderItems = () => {
    return filteredTodoList.map(key => {
      return (
        <Item
          key={key}
          swipingCheck={(swiping) => setSwiping(swiping)}
          message={todoList[key].message}
          id={key}
          checkedButtonPressed={() => DoneTodo(key)}
          deleteButtonPressed={() => deleteTodo(key)}
          editButtonPressed={() => console.log('edit')}
        />
      );
    });
  }

  return (
    //scrollEnabled가 false면 터치 인터랙션을 통해서 스크롤할 수 없게 된다.
    //이미 스크롤 중일 때 false로 값을 받게 되므로 화면이 여러방향으로 움직이는 것을 방지한다.
    <ScrollView scrollEnabled={!(swipingState)}>
      <View style={styles.container}>{renderItems()}</View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  }
})