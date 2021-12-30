import {
  View,
  Text,
  StyleSheet
} from 'react-native';

export const Times = ({ times }) => {
  const times_test = {
    pomodoro: {
      duration: 60000,
      color: 'green',
      times: 3,
    },
    shortBreak: {
      duration: 25000,
      color: 'blue',
      times: 2,
    },
    longBreak: {
      duration: 60000,
      color: 'red',
      times: 1
    }
  }
  return (
    <View style={ styles.boxContainer }>
      <View style={ styles.container }>
	<View style={ [styles.time, { width: 50 }] }>
	</View>
	<View style={ [styles.time, { width: 50 }] }>
	</View>
	<View style={ [styles.time, { width: 50 }] }>
	</View>
	<View style={ [styles.time, { width: 50 }] }>
	</View>
	<View style={ [styles.time, { width: 50 }] }>
	</View>
      </View>
      <View style={ styles.container }>
	<View style={ [styles.time, { width: '100%' }] }/>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  time: {
    backgroundColor: 'red',
    height: 20,
    borderRadius: 40,
  },
  boxContainer: {
    borderColor: 'black',
    borderWidth: 1,
    width: '95%',
    height: 50,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  }
})
