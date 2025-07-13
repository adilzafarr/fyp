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
        <TouchableOpacity
          style={styles.headerSettingsButton}
          onPress={() => navigation.navigate('AccountSettings')}
        >
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>پروفائل</Text>
      </View>

      <View style={styles.userNameContainer}>
        <Text style={styles.userName}>{userData.name}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <View style={styles.infoItem}>
            <Text style={styles.infoValue}>{userData.email}</Text>
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
    alignItems: 'center',
    padding: 8,
    paddingTop: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerSettingsButton: {
    marginRight: 10,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006A71',
    textAlign: 'right',
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
    color: '#006A71',
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
    textAlign: 'center',
    alignSelf: 'stretch',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    margin: 200,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 18,
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
