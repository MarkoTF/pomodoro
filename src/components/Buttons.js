import {
  View,
  Text,
  StyleSheet,
  Pressable
} from 'react-native';

export const GlobalButtons = ({ children }) => {
  return (
    <View style={ styles.globalContainer }>
      { children }
    </View>
  );
}

export const PButton = ({ children }) => {
  return (
    <Pressable>
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
