import {
  Text,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  Animated
} from 'react-native';
import { useRef, useEffect } from 'react'
import { PhoneDimentionsContext } from '../utils/context'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const AnalogClock = ({ backColor, fullTime, currentTime }) => {
  const currentDeg = 360 / fullTime * currentTime;
  const restTime = fullTime - currentTime;
  const clockAni = useRef(new Animated.Value(currentDeg)).current;
  const clockRotate = () => {
    Animated.timing(clockAni, {
      toValue: 360,
      duration: restTime,
      useNativeDriver: false,
    }).start();
  }
  useEffect(() => {
    clockRotate();
    const inter = setInterval(() => {
      console.log('interval')
      console.log(clockAni)
    }, 500)
    return (clearInterval(inter))
  });
  return (
    <View style={ [analogStyle.container, { backgroundColor: backColor }] }>
      <ImageBackground
	style={ analogStyle.axis }
	source={ require('../images/analog_clock_1.png') }>
	<Image
	  style={ [analogStyle.needle, { transform: [{rotateZ: clockAni._value + 'deg'}] }] }
	  source={ require('../images/analog_clock_2.png') }/>
      </ImageBackground>
    </View>
  );
}

export const DigitalClock = ({ milliseconds }) => {
  return (
    <Text 
      style={ digitalStyle.text }>
      20:30
    </Text>
  );
}

const digitalStyle = StyleSheet.create({
  text: {
    fontSize: 30
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
