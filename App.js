import {StatusBar} from 'expo-status-bar';
import {StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, LayoutAnimation} from 'react-native';
import {Fontisto} from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useState} from 'react';
import {theme} from './theme';
import List from "./components/List";

const STORAGE_KEY = "@toDos";
//TODO: 1 work나 travel 중 마지막에 열린 상태 기억하기
//TODO: 2 완료 기능 추가하기
//TODO: 3 유저가 텍스트 수정하게 하기

const DATA = {
  1:{message: 'Message #1'},
    2:{message: 'Message #2'},
    3:{message: 'Message #3'},
    4:{message: 'Message #4'},
    5:{message: 'Message #5'},
    6:{message: 'Message #6'},
    7:{message: 'Message #7'},
    8:{message: 'Message #8'},
};


export default function App() {
    const [workState, setWorkState] = useState(true);
    const [text, setText] = useState("");
    const [toDos, setToDos] = useState({});

    useEffect(() => {
        loadToDos();
    }, []);

    const travel = () => setWorkState(false);
    const work = () => setWorkState(true);
    const onChangeText = (payload) => setText(payload);

    const savedToDos = async (toSave) => {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    };
    const loadToDos = async () => {
        const s = await AsyncStorage.getItem(STORAGE_KEY);
        if(s !== null) {
            setToDos(JSON.parse(s))
        }
    }

    const addToDo = async () => {
        if (text === "") {
            return;
        }
        const newToDos = {...toDos, [Date.now()]: {text, workState}};
        setToDos(newToDos);
        await savedToDos(newToDos);
        setText("");
    };

    const deleteToDo = (key) => {
        Alert.alert("Delete To Do", "Are you sure?", [
            {text: "Cancel"},
            {
                text: "I'm Sure",
                onPress: () => {
                    const newToDos = {...toDos};
                    delete newToDos[key];
                    setToDos(newToDos);
                    savedToDos(newToDos);
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light"/>
            <View style={styles.header}>
                <TouchableOpacity onPress={work}>
                    <Text style={{...styles.btnText, color: workState ? theme.white : theme.grey}}>Work</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={travel}>
                    <Text style={{...styles.btnText, color: workState ? theme.grey : theme.white}}>Travel</Text>
                </TouchableOpacity>
            </View>
            <TextInput
                value={text}
                onSubmitEditing={addToDo}
                onChangeText={onChangeText}
                returnKeyType={"done"}
                placeholder={workState ? "What do you have to do?" : "Where do you want to go?"}
                style={styles.input}>
            </TextInput>
            {/*<ScrollView>
                {
                    Object.keys(toDos).map((key) =>
                        toDos[key].workState === workState ? (
                            <View style={styles.toDo} key={key}>
                                <Text style={styles.toDoText}>{toDos[key].text}</Text>
                                <TouchableOpacity onPress={() => deleteToDo(key)}>
                                    <Fontisto name={"trash"} size={18} color={theme.lightGrey} />
                                </TouchableOpacity>
                            </View>
                        ) : null
                    )
                }
            </ScrollView>*/}
            <List data={DATA} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.black,
        // paddingHorizontal: theme.gapM,
    },
    header: {
        flexDirection: "row",
        marginTop: 100,
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
        paddingVertical: theme.gapS,
        paddingHorizontal: theme.gapM,
        borderRadius: 4,
        marginVertical: 36,
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
