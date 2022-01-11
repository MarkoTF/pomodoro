import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  Animated
} from 'react-native';
import { useRef, useEffect, useState } from 'react'
import { PhoneDimentionsContext } from '../utils/context'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const AnalogClock = ({ backColor, fullTime, currentTime }) => {
  /**
    * Define la forma del reloj analógico
    * */
  const currentDeg = 360 / fullTime * currentTime;
  // const restTime = fullTime - currentTime;

  // const clockAni = useRef(new Animated.Value(0)).current;
  // const interpolateRotating = clockAni.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [currentDeg + 'deg', '360deg'],
  // });

  // useEffect(() => {
  //   Animated.timing(clockAni, {
  //     toValue: 1,
  //     duration: restTime,
  //     useNativeDriver: true,
  //   }).start();
  // });

  return (
    <View style={ [analogStyle.container, { backgroundColor: backColor }] }>
      <ImageBackground
	style={ analogStyle.axis }
	source={ require('../images/analog_clock_1.png') }>
	<Animated.Image
	  style={ [analogStyle.needle, { transform: [{rotateZ: currentDeg + 'deg'}] }] }
	  source={ require('../images/analog_clock_2.png') }/>
      </ImageBackground>
    </View>
  );
}

export const DigitalClock = ({ time }) => {
  /**
    * Define la forma del reloj digital
    * */
  const [currentTime, setCurrentTime] = useState(time);
  const [timeString, setTimeString] = useState('0:0');

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     const current = currentTime - 1000;
  //     const calculateT = calcultateTime(current);
  //     let currentString = calculateT.minutes + ':' + calculateT.seconds;
  //     if (current <= 0) {
	// currentString = '0:0'
	// setTimeString(currentString);
	// return () => clearInterval(timer);
  //     }
  //     setTimeString(currentString);
  //     setCurrentTime(current);
  //   }, 1000);
  //   return () => clearInterval(timer);
  // });

  return (
    <Text 
      style={ digitalStyle.text }>
      { time }
    </Text>
  );
}

const calcultateTime = (milliseconds) => {
  const sec_num = milliseconds / 1000;
  let seconds_used = 0;
  const minutes = Math.floor(sec_num / 60);
  if (minutes > 0) seconds_used += (minutes * 60);
  const seconds = sec_num - seconds_used;
  return { seconds: seconds, minutes: minutes }
}

const digitalStyle = StyleSheet.create({
  text: {
    fontSize: 35
  }
});

const analogStyle = StyleSheet.create({
  container: {
    width: windowWidth * 0.60,
    height: windowWidth * 0.60,
    borderRadius: windowHeight / 2,
    padding: 5
  },
  axis: {
    borderRadius: windowHeight / 2,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  needle: {
    borderRadius: windowHeight / 2,
    width: '90%',
    height: '90%',
  }
});
