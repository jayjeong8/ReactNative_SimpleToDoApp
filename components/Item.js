import {View, Text, Dimensions, Animated, PanResponder, TouchableOpacity, Easing, StyleSheet} from 'react-native';
import {AntDesign} from "@expo/vector-icons";
import {useState, useRef} from "react";
import {theme} from "../theme";


//유저가 스와이프를 확실히 원하는지에 대한 한계값 설정.
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCROLL_THRESHOLD = SCREEN_WIDTH / 15;
const FORCE_TO_OPEN_THRESHOLD = SCREEN_WIDTH / 3.5;
const LEFT_BUTTONS_THRESHOLD = SCREEN_WIDTH / 7;
const FORCING_DURATION = 350;

export default function Item({
                               swipingCheck,
                               message,
                               id,
                               checkedButtonPressed,
                               deleteButtonPressed,
                               editButtonPressed
                             }) {
  //Animated API로 이동시킬 구성요소의 초기 위치를 정의한다.
  const position = useRef(new Animated.ValueXY(0, 0)).current;
  const [scrollStopped, setScrollStopped] = useState(false);
  const categoryState = useRecoilValue(TodoListFilterState);

  //PanResponder : 여러 터치를 단일 제스처로 조정. 멀티터치 제스처를 인식할 수 있음.
  //포착된 제스처를 기반으로 Animated API를 작동시킬 수 있음
  const panResponder = useRef(
    PanResponder.create({
    onStartShouldSetPanResponder: () => false, //단일 터치에는 반응하지 않는다.
    onMoveShouldSetPanResponder: () => true,//스와이프같은 연속적인 움직임에는 반응한다.
    onPanResponderTerminationRequest: () => false, //애니메이션이 진행중인 경우 애니메이션이 우선순위 이므로 다른 구성요소에는 반응하지 않는다.

    onPanResponderGrant: () => { //panResponder가 응답을 시작한다. (승인)
      //승인 전까지 이동된 값을 offset으로 설정하고, 새 제스처를 위해 초기화된 값을 넣어준다.
      position.setOffset({x: position.x._value, y: 0});
      position.setValue({x: 0, y: 0});
    },

    onPanResponderMove: (event, gesture) => { //유저가 손가락을 계속 움직일 경우
      // 부드러운 움직임을 위해 손가락의 위치를 x값에 계속해서 반영해준다.
      if (gesture.dx >= SCROLL_THRESHOLD) {
        enableScrollView(true);
        const x = gesture.dx - SCROLL_THRESHOLD;
        position.setValue({x, y: 0});
      } else if (gesture.dx <= -SCROLL_THRESHOLD) {
        enableScrollView(true);
        const x = gesture.dx + SCROLL_THRESHOLD;
        position.setValue({x, y: 0});
      }
    },

    onPanResponderRelease: (event, gesture) => { //유저가 터치를 중지할 경우
      position.flattenOffset();//오프셋에 있는 값을 애니메이션 값에 추가하고 오프셋 값은 초기화시킨다.
      if (gesture.dx > 0) {
        userSwipedRight(gesture);
      } else if (gesture.dx < 0) {
        userSwipedLeft(gesture);
      } else {
        resetPosition();
      }
    },

    onPanResponderTerminate: () => {
      Animated.spring(position, {
        toValue: {x: 0, y: 0}
      }).start();
    }
  })
  ).current;


  const enableScrollView = (isEnabled) => {
    if (scrollStopped !== isEnabled) {
      swipingCheck(isEnabled);
      setScrollStopped(isEnabled)
    }
  }

  const userSwipedRight = (gesture) => {
    if (gesture.dx >= FORCE_TO_OPEN_THRESHOLD) {
      completeSwipe('right', checkedButtonPressed);
    } else if (gesture.dx >= LEFT_BUTTONS_THRESHOLD && gesture.dx < FORCE_TO_OPEN_THRESHOLD) {
      showButton('right');
    } else {
      resetPosition();
    }
  }

  const userSwipedLeft = (gesture) => {
    console.log(gesture.dx);
  if (gesture.dx <= - LEFT_BUTTONS_THRESHOLD) {
      showButton('left');
    } else {
      resetPosition();
    }
  }

  const completeSwipe = (dimension, callback) => {
    const x = dimension === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
    Animated.timing(position, {
      toValue: {x, y: 0},
      duration: FORCING_DURATION
    }).start();
    callback();
  }

  const resetPosition = () => {
    Animated.timing(position, {
      toValue: {x: 0, y: 0},
      duration: 200
    }).start();
  }

  const showButton = (side) => {
    const x = side === 'right' ? SCREEN_WIDTH / 4 : -SCREEN_WIDTH / 2.5;
    Animated.timing(position, {
      toValue: {x, y: 0},
      duration: 400,
      easing: Easing.out(Easing.quad)
    }).start(() => enableScrollView(false));
  }

  const getRightButtonProps = () => {
    const opacity = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH, -120, -35],
      outputRange: [0, 1, 0]
    });
    return {
      opacity,
    };
  }

  const getLeftButtonProps = () => {
    const opacity = position.x.interpolate({
      inputRange: [35, 75, 320],
      outputRange: [0, 1, 0.25]
    });
    const width = position.x.interpolate({
      inputRange: [0, 70],
      outputRange: [0, 70]
    });
    return {
      opacity,
      width
    };
  }


  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.leftButtonContainer, {backgroundColor: categoryState ? theme.positive : theme.neutral}, getLeftButtonProps()]}>
        {
          categoryState ? (
            <TouchableOpacity onPress={() => completeSwipe('right', () => checkedButtonPressed())}>
              <AntDesign name="check" size={20} color={"black"}/>
              <Text style={styles.textStyle} numberOfLines={1} ellipsizeMode={'clip'}>Done</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => completeSwipe('right', () => checkedButtonPressed())}>
              <AntDesign name="reload1" size={20} color={"black"}/>
              <Text style={styles.textStyle} numberOfLines={1} ellipsizeMode={'clip'}>Add ToDo</Text>
            </TouchableOpacity>
          )
        }
      </Animated.View>

      {/*position.getLayout()에서 포지션을 가져온다.*/}
      <Animated.View style={[styles.textContainer, position.getLayout()]} {...panResponder.panHandlers} >
        <Text style={styles.textStyle}>{message}</Text>
      </Animated.View>

      <Animated.View // Right Button  1
        style={[styles.rightButtonContainer, {left: SCREEN_WIDTH / 1.7}, getRightButtonProps()]}
      >
        <TouchableOpacity onPress={() => completeSwipe('left', () => deleteButtonPressed())}>
          <AntDesign name="delete" size={20}/>
          <Text style={styles.textStyle}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View // Right Button 2
        style={[styles.rightButtonContainer, {backgroundColor: theme.neutral}, getRightButtonProps()]}
      >
        <TouchableOpacity onPress={() => editButtonPressed()}>
          <AntDesign name="edit" size={20}/>
          <Text style={styles.textStyle}>Edit</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 8,
    // marginHorizontal: 5,
    elevation: 3 //그림자, 안드로이드 전용?
  },
  textContainer: {
    // width: SCREEN_WIDTH / 1.11,
    flex: 1,
    marginHorizontal: theme.gapM,
    paddingHorizontal: theme.gapM,
    paddingVertical: 32,
    borderRadius: 7,
    backgroundColor: theme.grey,
    elevation: 3,
    zIndex: 2,
  },
  textStyle: {
    color: theme.white,
  },
  rightButtonContainer: {
    position: 'absolute',
    left: SCREEN_WIDTH / 1.24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    borderRadius: 7,
    paddingHorizontal: 18,
    paddingVertical: 23,
    elevation: 3,
    backgroundColor: theme.negative,
    zIndex: 1
  },
  leftButtonContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
    borderRadius: 7,
    paddingHorizontal: 18,
    paddingVertical: 23,
    elevation: 3,
  }
});