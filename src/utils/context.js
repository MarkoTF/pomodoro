import React from 'react';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export const PhoneDimentionsContext = React.createContext({width: windowWidth, height: windowHeight})
export const ProfileContext = React.createContext({
  user: null,
  updateUser: () => {},
});
