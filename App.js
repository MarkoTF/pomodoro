import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet,
  Text,
  View,
  Dimensions,
  Modal,
} from 'react-native';
import {
  UilSkipForward,
  UilSetting,
  UilRefresh,
  UilStopwatchSlash ,
  UilPlayCircle
} from '@iconscout/react-native-unicons';
import { useState, useContext, useEffect } from 'react';
import { AnalogClock, DigitalClock } from './src/components/Clock';
import { Times } from './src/components/Times';
import { GlobalButtons, PButton } from './src/components/Buttons';
import { PhoneDimentionsContext, ProfileContext } from './src/utils/context';
import { openDatabase, createRecord, getActivated } from './src/utils/database';
import Settings from './src/views/Settings';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';

const EXAMPLE_TIME = 2000;
const db = openDatabase();
const Stack = createNativeStackNavigator();

export default function App() {
  /**
    * Componente principal (root) de la app. Se encarga de colocar
    * los contextos necesario para que los compnentes hijos puedan consumirlos
    * desde cualquier parte y culquier profundidad
    *
    * También se asegura de que la base de datos no esté vacía.
    * Si no existe la tabla la crea y crea el primer perfil llamado
    * default
    *
    * En este componente de definen las pantallas y cómo
    * interactuarán entre ellas
    * */
  const [currentP, setCurrentP] = useState(null);

  useEffect(() => {
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
	db.transaction((tx) => {
	  tx.executeSql(
	    `SELECT * FROM profile`, [],
	    (tranx, profiles) => {
	      console.log(profiles.rows);
	      setCurrentP({
		user: currentPrifile,
		users: profiles.rows._array,
		updateUser: setUser
	      });
	    }
	  );
	});
      });
    });
  }, []);

  const setUser = (user) => {
    db.transaction((tx) => {
      tx.executeSql(
	`SELECT * FROM profile`, [],
	(tranx, profiles) => {
	  // console.log(profiles.rows);
	  // console.log(user);
	  setCurrentP({
	    user: user,
	    users: profiles.rows._array,
	    updateUser: setUser
	  });
	}
      );
    });
  }

  const toRender = currentP ? (
    <ProfileContext.Provider value={ currentP }>
      <NavigationContainer>
	<Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
	  <Stack.Screen name="Home" component={Home} />
	  <Stack.Screen name="Settings" component={ Settings } />
	</Stack.Navigator>
      </NavigationContainer>
    </ProfileContext.Provider>
  ) : (
    <View>
      <Text>Cargando...</Text>
    </View>
  );

  return (
    toRender
  );
}

const Home = ({ navigation }) => {
  /**
    * Pantalla home
    *
    * La gran mayoría de su estado depende del perfil
    * actual que se cuentra suministrado por el contexto
    * */
  const isFocused = useIsFocused();
  const currentP = useContext(ProfileContext);
  const dimensions = useContext(PhoneDimentionsContext)
  const [currentTimeItem, setCurrentTimeItem] = useState({num: 0, color: currentP.user.pomodoro_color});
  const [isPaused, setPaused] = useState(false);
  const [timeString, setTimeString] = useState('0:0');
  const [sound, setSound] = useState();
  const [timesItems, setTimesItems] = useState({
    works: {
      color: currentP.user.pomodoro_color,
      count: currentP.user.pomodoro_times,
      time: currentP.user.pomodoro_value
    },
    rests: {
      color: currentP.user.short_rest_color,
      count: currentP.user.short_rest_times,
      time: currentP.user.short_rest_value
    },
    longRest: {
      color: currentP.user.long_rest_color,
      count: currentP.user.long_rest_times,
      time: currentP.user.long_rest_value
    }
  });
  const [time, setTime] = useState({
    current: 0,
    currentInverse: currentP.user.pomodoro_value * 60000,
    full: currentP.user.pomodoro_value * 60000
  });

  // if (isFocused) {
  //   console.log('fousc');
  //   console.log(currentP.user)
  // }
  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync(); }
      : undefined;
  }, [sound]);

  useEffect(() => {
    setTimesItems({
      works: {
	color: currentP.user.pomodoro_color,
	count: currentP.user.pomodoro_times,
	time: currentP.user.pomodoro_value
      },
      rests: {
	color: currentP.user.short_rest_color,
	count: currentP.user.short_rest_times,
	time: currentP.user.short_rest_value
      },
      longRest: {
	color: currentP.user.long_rest_color,
	count: currentP.user.long_rest_times,
	time: currentP.user.long_rest_value
      }
    });
    setTime({
      current: 0,
      full: currentP.user.pomodoro_value * 60000,
      currentInverse: currentP.user.pomodoro_value * 60000,
    });
    setCurrentTimeItem({
      num: 0,
      color: currentP.user.pomodoro_color,
    });
    setPaused(true);
  }, [currentP.user]);

  useEffect(() => {
    const timer = setInterval(() => {
      console.log('here');
      console.log(isPaused)
      if (!isPaused) {
	console.log(isPaused)
	const current = time.current + 1000;
	const currentInverse = time.currentInverse - 1000;
	const calculateT = calcultateTime(currentInverse);
	let currentString = calculateT.minutes + ':' + calculateT.seconds;
	if (current >= time.full) {
	  currentString = '0:0'
	  setTimeString(currentString);
	  // return () => clearInterval(timer);
	  nextTime();
	  playTone();
	} else {
	  setTimeString(currentString);
	  setTime(Object.assign({}, {full: time.full, current: current, currentInverse: currentInverse}));
	}
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [time, isPaused]);

  const playTone = async () => {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync(
       require('./src/sounds/alarm-tone.wav')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  const nextTime = () => {
    console.log('-------------')
    const fullTimes = timesItems.works.count + timesItems.rests.count + timesItems.longRest.count - 1;
    let next = 0;
    if (currentTimeItem.num < fullTimes) {
      next = currentTimeItem.num + 1;
    } else {
      next = 0
    }
    const itemType = calculateType(next, fullTimes);
    console.log(next)
    console.log(itemType)
    if (itemType === 'pomodoro') {
      setCurrentTimeItem({
	num: next,
	color: timesItems.works.color,
      });
      setTime({
	current: 0,
	full: timesItems.works.time * 60000,
	currentInverse: timesItems.works.time * 60000,
      });
    } else if (itemType === 'shortR') {
      setCurrentTimeItem({
	num: next,
	color: timesItems.rests.color,
      });
      setTime({
	current: 0,
	currentInverse: timesItems.rests.time * 60000,
	full: timesItems.rests.time * 60000
      });
    } else {
      setCurrentTimeItem({
	num: next,
	color: timesItems.longRest.color,
      });
      setTime({
	current: 0,
	currentInverse: timesItems.longRest.time * 60000,
	full: timesItems.longRest.time * 60000
      });
    }
  }

  const calculateType = (position, fullItems) => {
    if (position === fullItems) {
      return 'longR';
    } else if (position % 2 === 0) {
      return 'pomodoro';
    } else {
      return 'shortR'
    }
  }

  const reestartPomodoro = () => {
    setCurrentTimeItem({
      num: 0,
      color: timesItems.works.color,
    });
    setTime({
      current: 0,
      full: timesItems.works.time * 60000,
      currentInverse: timesItems.works.time * 60000,
    });
  }

  return (
     <PhoneDimentionsContext.Provider value={{width: dimensions.width, height: dimensions.height}}>
      <View style={ styles.layout }>
	<StatusBar style="auto" />
	<View style={ styles.container }>
	  <View>
	    <GlobalButtons>
	      <PButton
		action={ () => nextTime() }>
		<UilSkipForward size="60" color="#4A4A4A"/>
	      </PButton>
	      <PButton
		action={ () => navigation.navigate('Settings') }>
		<UilSetting size="60" color="#4A4A4A"/>
	      </PButton>
	    </GlobalButtons>
	  </View>
	  <View>
	    <View style={ styles.clocks }>
	      <AnalogClock
		fullTime={ time.full }
		currentTime={ time.current }
		backColor={ currentTimeItem.color }/>
	      <DigitalClock
		time={ timeString }/>
	    </View>
	    <Times
	      works={ timesItems.works }
	      rests={ timesItems.rests }
	      longRest={ timesItems.longRest }
	      current={ currentTimeItem.num }/>
	  </View>
	  <View>
	    <GlobalButtons>
	      <PButton
		action={ () => reestartPomodoro() }>
		<UilRefresh size="60" color="#4A4A4A"/>
	      </PButton>
	      <PButton
		action={ () => setPaused(!isPaused) }>
		{isPaused ? (
		  <UilPlayCircle size="60" color="#4A4A4A"/>
		) : (
		  <UilStopwatchSlash size="60" color="#4A4A4A"/>
		)}
	
	      </PButton>
	    </GlobalButtons>
	  </View>
	</View>
      </View>
    </PhoneDimentionsContext.Provider>
  );
}

const calcultateTime = (milliseconds) => {
  /**
    * Función que permite hacer la transformacón de 
    * milesegundos a minutos y segundos en formato de String
    *
    * :parámetro milliseconds: milisegundos a convertir
    * :return: retorna una cade de texto*/
  const sec_num = milliseconds / 1000;
  let seconds_used = 0;
  const minutes = Math.floor(sec_num / 60);
  if (minutes > 0) seconds_used += (minutes * 60);
  const seconds = sec_num - seconds_used;
  return { seconds: seconds, minutes: minutes }
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
