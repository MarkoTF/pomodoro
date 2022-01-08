import {
  Modal,
  View,
  StyleSheet,
  Text,
  Pressable
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
import { useState, useContext } from 'react';
import { GlobalButtons, PButton } from '../components/Buttons'
import { PhoneDimentionsContext } from '../utils/context';
import { Picker } from '@react-native-picker/picker';

export default function Settings({ isOpen, toggleMotal }) {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}>
        <View style={ styles.layout }>
	  <View style={ styles.container }>
	    <View>
	      <GlobalButtons>
		<PButton
		  action={ () => toggleMotal() }>
		  <UilArrowLeft size="60" color="#4A4A4A"/>
		</PButton>
		<PButton>
		  <UilSave size="60" color="#4A4A4A"/>
		</PButton>
	      </GlobalButtons>
	    </View>
	    <View style={{ flex: 1 }}>
	      <ListItemConfig
		btnIcon={ <UilPlus size='20' color='#4a4a4a'/> }
		text='Perfil'
		mainColor='blue'
		secundaryColor='green'/>
	      <RangeItemConfig
		text='Pomodoro'
		mainColor='blue'
		secundaryColor='green'
		confColor='blue'/>
	      <RangeItemConfig
		text='Descanso corto'
		mainColor='blue'
		secundaryColor='green'
		confColor='blue'/>
	      <RangeItemConfig
		text='Descanso largo'
		mainColor='blue'
		secundaryColor='green'
		confColor='blue'/>
	      <ListItemConfig
		text='Sonido y vibración'
		btnIcon={ <UilMobileVibrate size='20' color='#4a4a4a'/> }
		mainColor='blue'
		secundaryColor='green'/>
	    </View>
	    <View>
	      <GlobalButtons>
		<PButton>
		  <UilTrashAlt size="60" color="#4A4A4A"/>
		</PButton>
		<PButton>
		  <UilTimes size="60" color="#4A4A4A"/>
		</PButton>
	      </GlobalButtons>
	    </View>
	  </View>
        </View>
      </Modal>
    </View>
  );
}

const ListItemConfig = ({ text, mainColor, secundaryColor, confValue, confValues, action, btnIcon }) => {
  return (
    <View>
      <Text 
	style={ commonConfigStyles.text }>{ text }</Text>
      <View style={ listConfigStyles.configSection }>
	<View
	  style={ [listConfigStyles.common, listConfigStyles.picker] }>
	  <Picker
	    selectedValue={ confValue }
	    onValueChange={(itemValue, itemIndex) =>
	      setSelectedLanguage(itemValue)
	    }>
	    <Picker.Item label="Java" value="java" />
	    <Picker.Item label="JavaScript" value="js" />
	  </Picker>
	</View>
	<View style={{ flex: 1 }}>
	  <Pressable style={ [listConfigStyles.common, listConfigStyles.button] }>
	    { btnIcon }
	  </Pressable>
	</View>
      </View>
    </View>
  );
}

const RangeItemConfig = ({ text, mainColor, secundaryColor, confColor, rightAction, leftAction, confValue }) => {
  return (
    <View>
      <View style={ rangeConfigStyles.titleContainer }>
	<Text 
	  style={ commonConfigStyles.text }>{ text }</Text>
	<View style={ rangeConfigStyles.textColorContainer }>
	  <Text>#E54881</Text>
	</View>
      </View>
      <View style={ listConfigStyles.configSection }>
	<View style={{ flex: 1 }}>
	  <Pressable style={ [listConfigStyles.common, listConfigStyles.button] }>
	    <UilAngleLeft size="60" color="#4A4A4A"/>
	  </Pressable>
	</View>
	<View
	  style={ [listConfigStyles.common, rangeConfigStyles.confValue] }>
	  <Text style={ commonConfigStyles.text }>50</Text>
	</View>
	<View style={{ flex: 1 }}>
	  <Pressable style={ [listConfigStyles.common, listConfigStyles.button] }>
	    <UilAngleRight size="60" color="#4A4A4A"/>
	  </Pressable>
	</View>
      </View>
    </View>
  );
}

const commonConfigStyles = StyleSheet.create({
  text: {
    marginBottom: 10,
    fontSize: 20
  },
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
    borderWidth: 1,
    borderColor: 'black',
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
