import {StyleSheet, ScrollView, LayoutAnimation, Platform, UIManager, View} from "react-native";
import Item from "./Item";
import {useEffect, useState} from "react";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function List({data, swiping}) {
  const [dataState, setData] = useState({});
  const [swipingState, setSwiping] = useState(false);

  useEffect(() => {
    setData(data);
  }, []);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  }, [dataState]);

  const cleanFromScreen = (key) => {
    const tempData = {...dataState};
    delete tempData[key];
    setData(tempData);
  }

  const renderItems = () => {
    return Object.keys(dataState).map(key => {
      return (
        <Item
          key={key}
          swipingCheck={(swiping) => setSwiping(swiping)}
          message={dataState[key].message}
          id={key}
          cleanFromScreen={key => cleanFromScreen(key)}
          leftButtonPressed={() => console.log('left')}
          deleteButtonPressed={() => console.log('delete')}
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