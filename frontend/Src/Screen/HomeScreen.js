import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4DC6BB" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <Text style={styles.userName}>عادل ظفر</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FAF6EF',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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