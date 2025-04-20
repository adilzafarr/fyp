import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../Screen/HomeScreen';
import ChatScreen from '../Screen/ChatScreen';
import ArticlesScreen from '../Screen/ArticlesScreen';
import MoodTrackerScreen from '../Screen/MoodTrackerScreen';
import ProfileScreen from '../Screen/ProfileScreen';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ navigation }) => {
  const menuItems = [
    { name: 'Home', label: 'ہوم', icon: 'home' },
    { name: 'ChatTab', label: 'چیٹ', icon: 'chatbubble-ellipses' },
    { name: 'ArticlesTab', label: 'مضامین', icon: 'book' },
    { name: 'MoodTab', label: 'موڈ ٹریکر', icon: 'happy' },
    { name: 'Profile', label: 'پروفائل', icon: 'person' },
  ];

  return (
    <View style={styles.drawerContent}>
      <View style={styles.header}>
        <Text style={styles.title}>ہم دم</Text>
      </View>
      <View style={styles.menuItems}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => {
              navigation.navigate(item.name);
              navigation.closeDrawer();
            }}
          >
            <Text style={styles.menuText}>{item.label}</Text>
            <Ionicons name={item.icon} size={24} color="#2B7A78" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerStyle: {
          backgroundColor: '#ffffff',
          width: 280,
        },
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="ChatTab" component={ChatScreen} />
      <Drawer.Screen name="ArticlesTab" component={ArticlesScreen} />
      <Drawer.Screen name="MoodTab" component={MoodTrackerScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 10,
    backgroundColor: '#4DC6BB',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  menuItems: {
    padding: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 15,
    borderRadius: 10,
    marginBottom: 5,
    backgroundColor: '#F5FBFB',
  },
  menuText: {
    marginRight: 15,
    fontSize: 16,
    color: '#2B7A78',
    fontWeight: '600',
  },
}); 