import {
  View,
  Text,
  StyleSheet
} from 'react-native';
import { PhoneDimentionsContext } from '../utils/context'
import { useMemo, useContext } from 'react';

export const Times = ({ longRest, works, rests, current }) => {
  const dimentions = useContext(PhoneDimentionsContext)
  const total_items = works.count + rests.count
  const times = useMemo(() => {
    const items = [];
    const itemWidth = ((dimentions.width - 40) / (total_items)) - 3;
    const itemTemplate = (i, color, current) => {
      return (
	<View key={ i }>
	  <View style={{ paddingBottom: 3, borderBottomWidth: current ? 1 : 0 }}>
	    <View style={ [styles.time, { backgroundColor: color, width: itemWidth }] }/>
	  </View>
	</View>
      );
    }
    for (let i = 0; i <= total_items - 1; i++) {
      if (i % 2 === 0) {
	items.push(itemTemplate(i, works.color, (i === current) ? true : false));
      } else {
	items.push(itemTemplate(i, rests.color, (i === current) ? true : false));
      }
    }
    return items;
  }, [works, rests]);

  return (
    <View style={ styles.boxContainer }>
      <View style={ styles.container }>
	{ times }
      </View>
      <View style={ styles.container }>
	<View style={{ width: '100%', height: 'auto' }}>
	  <View style={[
	    styles.time, 
	    {
	      paddingBottom: 3, 
	      borderBottomWidth: (total_items === current) ? 1 : 0, 
	      width: '100%', 
	      height: 'auto' 
	    }
	  ]}>
	    <View style={ [styles.time, { width: '100%', backgroundColor: longRest.color }] }/>
	  </View>
	</View>
      </View>
    </View>
  )
}

const containerW = 80;

const styles = StyleSheet.create({
  time: {
    height: containerW - 50,
    borderRadius: 40,
  },
  boxContainer: {
    width: '100%',
    height: containerW,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  }
})
