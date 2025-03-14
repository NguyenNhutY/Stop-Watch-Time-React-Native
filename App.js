import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Platform
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const screen = Dimensions.get("window");

const createArray = (length) =>
  Array.from({ length }, (_, i) => i.toString());

const AVAILABLE_MINUTES = createArray(10);
const AVAILABLE_SECONDS = createArray(60);

const formatNumber = (num) => `0${num}`.slice(-2);

const getRemaining = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return { minutes: formatNumber(minutes), seconds: formatNumber(seconds) };
};

export default function App() {
  const [remainingSeconds, setRemainingSeconds] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState("0");
  const [selectedSeconds, setSelectedSeconds] = useState("5");

  useEffect(() => {
    if (remainingSeconds === 0 && isRunning) {
      stop();
    }
  }, [remainingSeconds, isRunning]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => {
    setRemainingSeconds(
      parseInt(selectedMinutes, 10) * 60 + parseInt(selectedSeconds, 10)
    );
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    setRemainingSeconds(5);
  };

  const { minutes, seconds } = getRemaining(remainingSeconds);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {isRunning ? (
        <Text style={styles.timerText}>{`${minutes}:${seconds}`}</Text>
      ) : (
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            itemStyle={styles.pickerItem}
            selectedValue={selectedMinutes}
            onValueChange={setSelectedMinutes}
            mode="dropdown"
          >
            {AVAILABLE_MINUTES.map((value) => (
              <Picker.Item key={value} label={value} value={value} />
            ))}
          </Picker>
          <Text style={styles.pickerItem}>minutes</Text>
          <Picker
            style={styles.picker}
            itemStyle={styles.pickerItem}
            selectedValue={selectedSeconds}
            onValueChange={setSelectedSeconds}
            mode="dropdown"
          >
            {AVAILABLE_SECONDS.map((value) => (
              <Picker.Item key={value} label={value} value={value} />
            ))}
          </Picker>
          <Text style={styles.pickerItem}>seconds</Text>
        </View>
      )}
      <TouchableOpacity
        onPress={isRunning ? stop : start}
        style={[styles.button, isRunning && styles.buttonStop]}
      >
        <Text
          style={[styles.buttonText, isRunning && styles.buttonTextStop]}
        >
          {isRunning ? "Stop" : "Start"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07121B",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    borderWidth: 10,
    borderColor: "#89AAFF",
    width: screen.width / 2,
    height: screen.width / 2,
    borderRadius: screen.width / 2,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonStop: {
    borderColor: "#FF851B",
  },
  buttonText: {
    fontSize: 45,
    color: "#89AAFF",
  },
  buttonTextStop: {
    color: "#FF851B",
  },
  timerText: {
    color: "#fff",
    fontSize: 90,
  },
  picker: {
    flex: 1,
    maxWidth: 100,
    ...Platform.select({
      android: {
        color: "#fff",
        backgroundColor: "rgba(92, 92, 92, 0.206)",
      },
    }),
  },
  pickerItem: {
    color: "#fff",
    fontSize: 20,
    ...Platform.select({
      android: {
        marginLeft: 10,
        marginRight: 10,
      },
    }),
  },
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
