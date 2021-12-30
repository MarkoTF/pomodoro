import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AnalogClock, DigitalClock } from './src/components/Clock';
import { Times } from './src/components/Times';
import { GlobalButtons, PButton } from './src/components/Buttons';
import UilReact from '@iconscout/react-native-unicons/icons/uil-react';

export default function App() {
  return (
    <View style={ styles.layout }>
      <View style={styles.container}>
	<GlobalButtons>
	  <PButton>
	    <UilReact size="140" color="#61DAFB"/>
	  </PButton>
	  <PButton>
	    <UilReact size="140" color="#61DAFB"/>
	  </PButton>
	</GlobalButtons>
	<AnalogClock
	  backColor='aqua'/>
	<DigitalClock/>
	<Times/>
	<StatusBar style="auto" />
      </View>
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
  layout: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  }
});
