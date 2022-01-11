import React from 'react';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

/**
  * definición de los contextos que se utilizaran en
  * la palicación
  * */
export const PhoneDimentionsContext = React.createContext({width: windowWidth, height: windowHeight})
export const ProfileContext = React.createContext({
  user: null,
  users: null,
  updateUser: () => {},
});
