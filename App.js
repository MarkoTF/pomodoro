import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AnalogClock, DigitalClock } from './src/components/Clock';

export default function App() {
  return (
    <View style={styles.container}>
      <AnalogClock
	backColor='aqua'/>
      <DigitalClock/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
