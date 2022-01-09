import {
  Modal,
  View,
  StyleSheet,
  Text,
  Pressable,
  TextInput
} from 'react-native';
import {
  UilArrowLeft,
  UilSave,
  UilTrashAlt,
  UilTimes,
  UilPlus,
  UilAngleLeft,
  UilAngleRight,
  UilMobileVibrate,
  UilMultiply,
} from '@iconscout/react-native-unicons';
import { useState, useContext, useEffect, updateState } from 'react';
import { GlobalButtons, PButton } from '../components/Buttons'
import { PhoneDimentionsContext, ProfileContext } from '../utils/context';
import { Picker } from '@react-native-picker/picker';
import { openDatabase, removeProfile, createRecord, changeActive, updateProfile } from '../utils/database';
import { NavigationContainer, useIsFocused } from '@react-navigation/native';

const db = openDatabase();

export default function Settings({ isOpen, toggleMotal, navigation }) {
  const currentP = useContext(ProfileContext);
  const [profile, setProfile] = useState('java');
  const [toggleModal, setToggleModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [togglePomodoroColorModal, setTogglePomodoroColorModal] = useState(false)
  const [toggleShortColorModal, setToggleShortColorModal] = useState(false)
  const [toggleLongColorModal, setToggleLongColorModal] = useState(false)
  const [pomodoroConf, setPomodoroConf] = useState({
    confColor: currentP.user.pomodoro_color,
    value: currentP.user.pomodoro_value,
  });
  const [shrotRestConf, setShortRestConf] = useState({
    confColor: currentP.user.short_rest_color,
    value: currentP.user.short_rest_value,
  });
  const [longRestConf, setLongRestConf] = useState({
    confColor: currentP.user.long_rest_color,
    value: currentP.user.long_rest_value,
  });
  const [soundAndVibrate, setSoundAndVibrate] = useState({
    vibrate: 1,
    sound: 'noting',
    // vibrate: currentP.user.vibrate,
    // sound: currentP.user.sound
  });

  useEffect(() => {
    restart();
  }, [currentP]);

  const restart = () => {
    setPomodoroConf({
      value: currentP.user.pomodoro_value,
      confColor: currentP.user.pomodoro_color
    });
    setShortRestConf({
      confColor: currentP.user.short_rest_color,
      value: currentP.user.short_rest_value,
    });
    setLongRestConf({
      confColor: currentP.user.long_rest_color,
      value: currentP.user.long_rest_value,
    });
    setSoundAndVibrate({
      vibrate: currentP.user.sound,
      sound: currentP.user.vibrate
    });
  }

  const newProfile = () => {
    setToggleModal(!toggleModal);
    createRecord(newName, 0, pomodoroConf.confColor, pomodoroConf.value, 4, shrotRestConf.confColor, shrotRestConf.value, 3, longRestConf.confColor, longRestConf.value, 1, soundAndVibrate.sound, soundAndVibrate.vibrate).then((record, err) => {
      changeActive(record.insertId).then((result, err) => {
	const currentPrifile = result.rows._array[0]
	currentP.updateUser(currentPrifile);
      });
    });
  }

  const writeProfile = () => {
    updateProfile(currentP.user.id, currentP.user.name, 0, pomodoroConf.confColor, pomodoroConf.value, 4, shrotRestConf.confColor, shrotRestConf.value, 3, longRestConf.confColor, longRestConf.value, 1, soundAndVibrate.sound, soundAndVibrate.vibrate).then((result, err) => {
      db.transaction((tx) => {
	tx.executeSql(
	  "SELECT * FROM profile WHERE id = ?", [currentP.user.id],
	  (_, result) => {
	    const userData = result.rows._array[0];+
	    currentP.updateUser(userData);
	  }
	);
      });
    });
  }

  const deleteProfile = () => {
    removeProfile(currentP.user.id).then((newCurrent) => {
      const userData = newCurrent.rows._array[0];
      currentP.updateUser(userData);
    });
  }

  const select = (itemValue) => {
    changeActive(itemValue).then((result, err) => {
      const currentPrifile = result.rows._array[0]
      currentP.updateUser(currentPrifile);
    });
  }

  return (
    <View style={ styles.layout }>
      <View style={ styles.container }>
	<View>
	  <GlobalButtons>
	    <PButton
	      action={ () => navigation.goBack() }>
	      <UilArrowLeft size="60" color="#4A4A4A"/>
	    </PButton>
	    <PButton
	      action={ () => writeProfile() }>
	      <UilSave size="60" color="#4A4A4A"/>
	    </PButton>
	  </GlobalButtons>
	</View>
	<View style={{ flex: 1 }}>
	  <View style={ commonConfigStyles.paddingSection }>
	    <ListItemConfig
	      btnIcon={ <UilPlus size='20' color='#4a4a4a'/> }
	      text='Perfil'
	      confValues={ currentP.users }
	      confValue={ currentP.user.id }
	      action={ () => newProfile() }
	      actionSelect={ (itemValue) => select(itemValue) }
	      mainColor={ pomodoroConf.confColor }
	      secundaryColor={ shrotRestConf.confColor }/>
	  </View>
	  <View style={ commonConfigStyles.paddingSection }>
	    <RangeItemConfig
	      text='Pomodoro'
	      mainColor={ currentP.pomodoro_color }
	      confColor={ pomodoroConf.confColor }
	      mainColor={ pomodoroConf.confColor }
	      confValue={ pomodoroConf.value }
	      toggleModal={ () => setTogglePomodoroColorModal(!togglePomodoroColorModal) }
	      leftAction={ () => setPomodoroConf(Object.assign({}, {...pomodoroConf, value: pomodoroConf.value - 1})) }
	      rightAction={ () => setPomodoroConf(Object.assign({}, {...pomodoroConf, value: pomodoroConf.value + 1})) }
	      secundaryColor={ shrotRestConf.confColor }/>
	  </View>
	  <View style={ commonConfigStyles.paddingSection }>
	    <RangeItemConfig
	      text='Descanso corto'
	      confColor={ shrotRestConf.confColor }
	      confValue={ shrotRestConf.value }
	      mainColor={ pomodoroConf.confColor }
	      toggleModal={ () => setToggleShortColorModal(!toggleShortColorModal) }
	      leftAction={ () => setShortRestConf(Object.assign({}, {...shrotRestConf, value: shrotRestConf.value - 1})) }
	      rightAction={ () => setShortRestConf(Object.assign({}, {...shrotRestConf, value: shrotRestConf.value + 1})) }
	      secundaryColor={ shrotRestConf.confColor }/>
	  </View>
	  <View style={ commonConfigStyles.paddingSection }>
	    <RangeItemConfig
	      text='Descanso largo'
	      mainColor={ pomodoroConf.confColor }
	      confValue={ longRestConf.value }
	      secundaryColor={ shrotRestConf.confColor }
	      leftAction={ () => setLongRestConf(Object.assign({}, {...longRestConf, value: longRestConf.value - 1})) }
	      rightAction={ () => setLongRestConf(Object.assign({}, {...longRestConf, value: longRestConf.value + 1})) }
	      toggleModal={ () => setToggleLongColorModal(!toggleLongColorModal) }
	      confColor={ longRestConf.confColor }/>
	  </View>
	  <View style={ commonConfigStyles.paddingSection }>
	    {/* <ListItemConfig */}
	      {/* text='Sonido y vibración' */}
	      {/* btnIcon={ <UilMobileVibrate size='20' color='#4a4a4a'/> } */}
	      {/* mainColor={ pomodoroConf.confColor } */}
	      {/* secundaryColor={ shrotRestConf.confColor }/> */}
	  </View>
	</View>
	<View>
	  <GlobalButtons>
	    <PButton
	      action={ () => deleteProfile() }>
	      <UilTrashAlt size="60" color="#4A4A4A"/>
	    </PButton>
	    <PButton
	      action={ () => restart() }>
	      <UilTimes size="60" color="#4A4A4A"/>
	    </PButton>
	  </GlobalButtons>
	</View>
      </View>
      <SelectModal 
	visible={ toggleModal }
	toggleModal={ () => newProfile() }>
	<TextInput 
	  value={ newName }
	  onChangeText={ (text) => setNewName(text) }
	  style={selectModalStyle.inputTextStyle}/>
      </SelectModal>
      <SelectModal 
	visible={ togglePomodoroColorModal }
	toggleModal={ () => setTogglePomodoroColorModal(!togglePomodoroColorModal) }>
	<SelectColor
	  action={ (color) => setPomodoroConf({ confColor: color, value: pomodoroConf.value }) }/>
      </SelectModal>
      <SelectModal 
	visible={ toggleShortColorModal }
	toggleModal={ () => setToggleShortColorModal(!toggleShortColorModal) }>
	<SelectColor
	  action={ (color) => setShortRestConf({ confColor: color, value: shrotRestConf.value }) }/>
      </SelectModal>
      <SelectModal 
	visible={ toggleLongColorModal }
	toggleModal={ () => setToggleLongColorModal(!toggleLongColorModal) }>
	<SelectColor
	  action={ (color) => setLongRestConf({ confColor: color, value: longRestConf.value }) }/>
      </SelectModal>
    </View>
  );
}

const SelectColor = ({ action }) => {
  return (
    <View style={ selectorColorStyles.content }>
      <Pressable style={ [selectorColorStyles.square, { backgroundColor: '#5E8ED7' }] } onPress={ () => action('#5E8ED7') }></Pressable>
      <Pressable style={ [selectorColorStyles.square, { backgroundColor: '#E54881' }] } onPress={ () => action('#E54881') }></Pressable>
      <Pressable style={ [selectorColorStyles.square, { backgroundColor: '#86DCEF' }] } onPress={ () => action('#86DCEF') }></Pressable>
      <Pressable style={ [selectorColorStyles.square, { backgroundColor: '#FB738E' }] } onPress={ () => action('#FB738E') }></Pressable>
      <Pressable style={ [selectorColorStyles.square, { backgroundColor: '#A09FE6' }] } onPress={ () => action('#A09FE6') }></Pressable>
      <Pressable style={ [selectorColorStyles.square, { backgroundColor: '#4FAAA1' }] } onPress={ () => action('#4FAAA1') }></Pressable>
      <Pressable style={ [selectorColorStyles.square, { backgroundColor: '#FBFA93' }] } onPress={ () => action('#FBFA93') }></Pressable>
      <Pressable style={ [selectorColorStyles.square, { backgroundColor: '#FFD380' }] } onPress={ () => action('#FFD380') }></Pressable>
      <Pressable style={ [selectorColorStyles.square, { backgroundColor: '#FD88E0' }] } onPress={ () => action('#FD88E0') }></Pressable>
    </View>
  );
}

const selectorColorStyles = StyleSheet.create({
  square: {
    height: 80,
    width: 80,
    margin: 10,
    borderRadius: 10
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});

const SelectModal = ({ children, visible, toggleModal }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={ visible }>
      <View style={selectModalStyle.centeredView}>
	<View style={selectModalStyle.modalView}>
	  { children }
	  <Pressable
	    style={[selectModalStyle.button, selectModalStyle.buttonClose]}
	    onPress={ () => toggleModal() }
	  >
	    <Text style={ selectModalStyle.textStyle }>Aceptar</Text>
	  </Pressable>
	</View>
      </View>
    </Modal>
  );
}

const ListItemConfig = ({ text, mainColor, secundaryColor, confValue, confValues, action, actionSelect, btnIcon }) => {
  const items = confValues.map((profile) => {
    return (
      <Picker.Item key={ profile.id } label={ profile.name } value={ profile.id } />
    );
  });
  return (
    <View>
      <Text 
	style={ commonConfigStyles.text }>{ text }</Text>
      <View style={ listConfigStyles.configSection }>
	<View
	  style={ [listConfigStyles.common, listConfigStyles.picker, { backgroundColor: mainColor }] }>
	  <Picker
	    onValueChange={ (itemValue, itemIndex) => actionSelect(itemValue) }
	    selectedValue={ confValue }>
	    { items }
	  </Picker>
	</View>
	<View style={{ flex: 1 }}>
	  <Pressable 
	    style={ [listConfigStyles.common, listConfigStyles.button, { backgroundColor: secundaryColor }] }
	    onPress={ () => action() }>
	    { btnIcon }
	  </Pressable>
	</View>
      </View>
    </View>
  );
}

const RangeItemConfig = ({ text, mainColor, secundaryColor, confColor, rightAction, leftAction, confValue, toggleModal }) => {
  return (
    <View>
      <View style={ rangeConfigStyles.titleContainer }>
	<Text 
	  style={ commonConfigStyles.text }>{ text }</Text>
	<View style={ [rangeConfigStyles.textColorContainer, { backgroundColor: confColor }] }>
	  <Pressable 
	    onPress={ () => toggleModal() }>
	    <Text>{ confColor }</Text>
	  </Pressable>
	</View>
      </View>
      <View style={ listConfigStyles.configSection }>
	<View style={{ flex: 1 }}>
	  <Pressable 
	    style={ [listConfigStyles.common, listConfigStyles.button, { backgroundColor: secundaryColor }] }
	    onPress={ () => leftAction() }>
	    <UilAngleLeft size="60" color="#4A4A4A"/>
	  </Pressable>
	</View>
	<View
	  style={ [listConfigStyles.common, rangeConfigStyles.confValue, { backgroundColor: mainColor }] }>
	  <Text style={ commonConfigStyles.text }>{ confValue }</Text>
	</View>
	<View style={{ flex: 1 }}>
	  <Pressable 
	    style={ [listConfigStyles.common, listConfigStyles.button, { backgroundColor: secundaryColor }] }
	    onPress={ () => rightAction() }>
	    <UilAngleRight size="60" color="#4A4A4A"/>
	  </Pressable>
	</View>
      </View>
    </View>
  );
}

const selectModalStyle = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  inputTextStyle: {
    height: 40,
    width: 300,
    borderColor: 'black',
    borderBottomWidth: 1,
    marginBottom: 30
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 300,
    height: 50
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

const commonConfigStyles = StyleSheet.create({
  text: {
    marginBottom: 10,
    fontSize: 20
  },
  paddingSection: {
    paddingBottom: 25
  }
});

const rangeConfigStyles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textColorContainer: {
    padding: 3,
    backgroundColor: 'aqua',
    borderRadius: 10,
    marginLeft: 10
  },
  confValue: {
    borderRadius: 20,
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 15, 
    height: 55
  }
});

const listConfigStyles = StyleSheet.create({
  picker: {
    borderRadius: 20,
    flex: 6,
    marginRight: 15,
  },
  common: {
    borderRadius: 20,
  },
  button: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  configSection: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
});
