import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal
} from 'react-native';
import {
  UilSkipForward,
  UilSetting,
  UilRefresh,
  UilStopwatchSlash 
} from '@iconscout/react-native-unicons';
import { useState, useContext, useEffect } from 'react';
import { AnalogClock, DigitalClock } from './src/components/Clock';
import { Times } from './src/components/Times';
import { GlobalButtons, PButton } from './src/components/Buttons';
import { PhoneDimentionsContext, ProfileContext } from './src/utils/context';
import { openDatabase, createRecord, getActivated } from './src/utils/database';
import Settings from './src/views/Settings';

const EXAMPLE_TIME = 2000;
const db = openDatabase();

export default function App() {
  const [currentP, setCurrentP] = useState(null);

  useEffect(() => {
    console.log(currentP);
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS profile (\
	  id INTEGER PRIMARY KEY NOT NULL,\
	  name TEXT,\
	  active INT,\
	  pomodoro_color TEXT,\
	  pomodoro_value INT,\
	  pomodoro_times INT,\
	  short_rest_color TEXT,\
	  short_rest_times INT,\
	  short_rest_value INT,\
	  long_rest_color TEXT,\
	  long_rest_times INT,\
	  long_rest_value INT,\
	  sound TEXT,\
	  vibrate INT\
	);"
      );
      getActivated().then(profile => {
	const currentPrifile = profile.rows._array[0]
	console.log(currentPrifile);
	setCurrentP(currentPrifile);
      });
    });
  }, []);
  
  const toRender = currentP ? (
    <Home/>
  ) : (
    <View>
      <Text>Cargando...</Text>
    </View>
  );

  return (
    <ProfileContext.Provider value={ currentP }>
      { toRender }
    </ProfileContext.Provider>
  );
}

const Home = () => {
  const dimensions = useContext(PhoneDimentionsContext)
  const [currentTime, setCurrentTime] = useState(7);
  const [toggleMotal, setToggleModal] = useState(true);
  const [timesItems, setTimesItems] = useState({
    works: {
      color: 'blue',
      count: 4,
      time: 2000
    },
    rests: {
      color: 'green',
      count: 3,
      time: 1000
    },
    longRest: {
      color: 'gray',
      count: 1,
      time: 5000
    }
  });
  const [time, setTime] = useState({
    current: 0,
    full: 120000
  });

  return (
    <PhoneDimentionsContext.Provider value={{width: dimensions.width, height: dimensions.height}}>
      <View style={ styles.layout }>
	<Settings
	  isOpen={ toggleMotal }
	  toggleMotal={ () => setToggleModal(!toggleMotal) }/>
	<StatusBar style="auto" />
	<View style={ styles.container }>
	  <View>
	    <GlobalButtons>
	      <PButton>
		<UilSkipForward size="60" color="#4A4A4A"/>
	      </PButton>
	      <PButton
		action={ () => setToggleModal(!toggleMotal) }>
		<UilSetting size="60" color="#4A4A4A"/>
	      </PButton>
	    </GlobalButtons>
	  </View>
	  <View>
	    <View style={ styles.clocks }>
	      <AnalogClock
		fullTime={ time.full }
		currentTime={ time.current }
		backColor='aqua'/>
	      <DigitalClock
		time={ time.full - time.current }/>
	    </View>
	    <Times
	      works={ timesItems.works }
	      rests={ timesItems.rests }
	      longRest={ timesItems.longRest }
	      current={ currentTime }/>
	  </View>
	  <View>
	    <GlobalButtons>
	      <PButton>
		<UilRefresh size="60" color="#4A4A4A"/>
	      </PButton>
	      <PButton>
		<UilStopwatchSlash size="60" color="#4A4A4A"/>
	      </PButton>
	    </GlobalButtons>
	  </View>
	</View>
      </View>
    </PhoneDimentionsContext.Provider>
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
