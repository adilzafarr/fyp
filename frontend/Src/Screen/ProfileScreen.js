import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      const name = await AsyncStorage.getItem('usersName');
      const user = {
        name: name,
        email: email
      };
      setUserData(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('خرابی', 'پروفائل ڈیٹا لوڈ کرنے میں ناکامی');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear(); 
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('خرابی', 'لاگ آؤٹ ناکام ہوا، دوبارہ کوشش کریں۔');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>پروفائل لوڈ ہو رہا ہے...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>پروفائل</Text>
      </View>

      <View style={styles.userNameContainer}>
        <Text style={styles.userName}>{userData.name}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{userData.email}</Text>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate('AccountSettings')}
            >
              <View style={styles.settingsContent}>
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color="#333"
                  style={styles.settingsIcon}
                />
                <Text style={styles.settingsText}>اکاؤنٹ سیٹنگز</Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color="#888" />
            </TouchableOpacity>
          </View>
        </View>

        

        <TouchableOpacity
          style={[styles.logoutButton, styles.buttonWithShadow]}
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>لاگ آؤٹ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 8,
    paddingTop: 0,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 0,
  },
  userNameContainer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 5,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 10,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 10,
  },
  infoItem: {
    marginBottom: 10,
    alignItems: 'flex-end',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    alignSelf: 'stretch',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 8,
    borderTopWidth: 0,
  },
  settingsContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    marginRight: 8,
  },
  settingsText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    margin: 20,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    marginLeft: 10,
  },
  buttonWithShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default ProfileScreen;
