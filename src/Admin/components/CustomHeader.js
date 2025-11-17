import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import FontAwesome from "@react-native-vector-icons/fontawesome";
import Feather from "@react-native-vector-icons/feather";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomHeader = ({ navigation }) => {
  const [selectedBell, setSelectedBell] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState(false);
  const [selectedSun, setSelectedSun] = useState(false);
   const insets = useSafeAreaInsets();

  const handlePressBell = () => setSelectedBell(!selectedBell);
  const handlePressActivities = () => setSelectedActivities(!selectedActivities);
  const handlePressSelected = () => setSelectedSun(!selectedSun);

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top + 10 }]}>
      <View style={styles.leftContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <FontAwesome name="bars" color={'black'} size={20} />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <Feather name="search" color={'lightgray'} size={16} />
          <TextInput
            placeholder="Search"
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.rightIconsContainer}>
        {/* <TouchableOpacity onPress={handlePressSelected}>
          <View style={[styles.iconContainer, selectedSun && styles.selectedContainer]}>
            <Feather name="sun" color={selectedSun ? '#fff' : '#000'} size={16} />
          </View>
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handlePressActivities}>
          <View style={[styles.iconContainer, selectedActivities && styles.selectedContainer]}>
            <FontAwesome name="history" color={selectedActivities ? '#fff' : '#000'} size={16} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePressBell}>
          <View style={[styles.iconContainer, selectedBell && styles.selectedContainer]}>
            <FontAwesome name="bell-o" size={16} color={selectedBell ? '#fff' : '#000'} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: "center",
    justifyContent: 'space-around',
    paddingHorizontal: GlobalStyles.padding.medium,
    paddingVertical: GlobalStyles.padding.small,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    borderRadius: GlobalStyles.borderRadius.medium * 2,
    width: GlobalStyles.windowWidth /1.8,
    paddingHorizontal: 7,
    alignItems: 'center',
    marginLeft: GlobalStyles.margin.medium,
  },
  searchInput: {
    fontSize: 12,
    height: 35,
  },
  rightIconsContainer: {
    flexDirection: "row",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  selectedContainer: {
    backgroundColor: '#000',
    borderRadius: 16,
  },
});

export default CustomHeader;
