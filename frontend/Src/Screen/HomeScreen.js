import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      const usersName = await api.post('/auth/get-name', {
        email
      });
      await AsyncStorage.setItem('usersName', usersName.data.name);
      await AsyncStorage.setItem('usersId', usersName.data.id);
      setUserName(usersName.data.name);

    } catch (error) {
      console.error('Error fetching user data:', error);
      setUserName('صارف'); // Default fallback name
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DC6BB" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView style={styles.scrollView}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <Text style={styles.userName}>{userName}</Text>
          <Ionicons name="person-circle" size={28} color="#4DC6BB" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Title */}
        <Text style={styles.title}>ہم دم</Text>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcome}>خوش آمدید!</Text>
          <Text style={styles.description}>
            یہ جگہ ہے جہاں آپ اپنے جذبات کو آزادانہ طور پر ظاہر کر سکتے ہیں۔
          </Text>
        </View>

        {/* Cards */}
        <View style={styles.cardContainer}>
          {/* Chat Bot */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ChatTab')}>
            <View style={styles.row}>
              <Ionicons name="chatbubble-ellipses" size={32} color="#2B7A78" />
              <View style={styles.textBlock}>
                <Text style={styles.cardTitle}>چیٹ بوٹ</Text>
                <Text style={styles.cardDesc}>اپنے جذبات کے بارے میں بات کریں</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Articles */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ArticlesTab')}>
            <View style={styles.row}>
              <Ionicons name="book" size={32} color="#2B7A78" />
              <View style={styles.textBlock}>
                <Text style={styles.cardTitle}>مضامین</Text>
                <Text style={styles.cardDesc}>مختلف جذبات کے بارے میں پڑھیں</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Mood Tracker */}
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MoodTab')}>
            <View style={styles.row}>
              <Ionicons name="happy" size={32} color="#2B7A78" />
              <View style={styles.textBlock}>
                <Text style={styles.cardTitle}>موڈ ٹریکر</Text>
                <Text style={styles.cardDesc}>دیکھیں وقت کے ساتھ آپ کے جذبات کیسے بدلے</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4DC6BB',
    marginRight: 5,
  },
  scrollContainer: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2B7A78',
    textAlign: 'center',
    marginBottom: 6,
  },
  welcomeSection: {
    marginTop: 15,
    marginBottom: 30,
  },
  welcome: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2B7A78',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#2B7A78',
    textAlign: 'center',
    lineHeight: 20,
  },
  cardContainer: {
    gap: 14,
  },
  card: {
    backgroundColor: '#F5FBFB',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  textBlock: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2B7A78',
    textAlign: 'right',
    marginBottom: 2,
  },
  cardDesc: {
    fontSize: 12,
    color: '#333',
    textAlign: 'right',
    lineHeight: 16,
  },
});