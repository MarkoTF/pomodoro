import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AnalogClock, DigitalClock } from './src/components/Clock';
import { Times } from './src/components/Times';
import { GlobalButtons, PButton } from './src/components/Buttons';
import { UilSkipForward, UilSetting, UilRefresh, UilStopwatchSlash } from '@iconscout/react-native-unicons';

export default function App() {
  return (
    <View style={ styles.layout }>
      <StatusBar style="auto" />
      <View style={ styles.container }>
	<View>
	  <GlobalButtons>
	    <PButton>
	      <UilSkipForward size="60" color="#61DAFB"/>
	    </PButton>
	    <PButton>
	      <UilSetting size="60" color="#61DAFB"/>
	    </PButton>
	  </GlobalButtons>
	</View>
	<View>
	  <View style={ styles.clocks }>
	    <AnalogClock
	      backColor='aqua'/>
	    <DigitalClock/>
	  </View>
	  <Times/>
	</View>
	<View>
	  <GlobalButtons>
	    <PButton>
	      <UilRefresh size="60" color="#61DAFB"/>
	    </PButton>
	    <PButton>
	      <UilStopwatchSlash size="60" color="#61DAFB"/>
	    </PButton>
	  </GlobalButtons>
	</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  clocks: {
    // borderWidth: 2,
    // borderColor: 'black',
    marginBottom: 50,
    alignItems: 'center'
  },
  layout: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  }
});
