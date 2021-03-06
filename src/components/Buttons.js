import {
  View,
  Text,
  StyleSheet,
  Pressable
} from 'react-native';

export const GlobalButtons = ({ children }) => {
  /**
    * Componenete para definir como estarán
    * ordenados los botónes globales
    * */
  return (
    <View style={ styles.globalContainer }>
      { children }
    </View>
  );
}

export const PButton = ({ children, action }) => {
  /**
    * Define la forma de los botodes globales
    * */
  return (
    <Pressable
      onPress={ () => action() }>
      { children }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  globalContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
