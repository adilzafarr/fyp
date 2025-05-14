// Updated MoodTrackerScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Dimensions,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Asset from 'expo-asset';
import { Asset as ExpoAsset } from 'expo-asset';
import { my_auth, db } from '../components/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';

const MoodTrackerScreen = () => {
  const [moodHistory, setMoodHistory] = useState([]);
  const [topEmotion, setTopEmotion] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [currentMonthEmotions, setCurrentMonthEmotions] = useState([]);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [userID, setUserID] = useState(-1);

  const moods = [
    { name: 'Neutral', icon: 'leaf', color: '#B0BEC5', int:0 },
    { name: 'Angry', icon: 'flame', color: '#E57373', int:1 },
    { name: 'Frustrated', icon: 'warning', color: '#BA68C8', int:2 },
    { name: 'Dissatisfied', icon: 'close-circle', color: '#FFB74D', int:3 },
    { name: 'Happy', icon: 'happy', color: '#81C784', int:4 }
  ];

  useEffect(() => {
    clearCache();
    const init = async () => {
      const id = await loadUserName(); // get user ID directly
      if (id !== -1) {
        await loadData(id); // pass userId explicitly
      }
      checkAndAddRandomMoodForToday();
    };
    init();
  }, []);
  

  // Load user name from storage or API
  const loadUserName = async () => {
    try {
      const username = await AsyncStorage.getItem('usersName');
      const usersId = await AsyncStorage.getItem('usersId');
      const parsedId = Number(usersId);
      setUserID(parsedId); // still update state for other UI use
      setUserName(username || "صارف");
      return parsedId;
    } catch (error) {
      console.error("Error loading user name:", error);
      setUserName("صارف");
      return -1;
    }
  };
  
  

  const loadData = async (userId) => {
    try {
      setIsLoading(true);
      const response = await api.post('/mood/get-mood-history', { userId });
      const data = response.data;
  
      const mappedData = data.map(entry => {
        const moodObj = moods.find(m => m.int === entry.mood);
        const formattedDate = new Date(entry.date).toISOString().split('T')[0]; // "YYYY-MM-DD"
  
        return {
          mood: moodObj ? moodObj.name : 'Unknown',
          date: formattedDate
        };
      });
  
      console.log('Mapped data:', mappedData);
  
      await AsyncStorage.setItem('moodHistory', JSON.stringify(mappedData));
      setMoodHistory(mappedData);
      calculateTopEmotion(mappedData);
      updateCurrentMonthEmotions(mappedData);
    } catch (e) {
      console.error('Error loading data:', e);
    } finally {
      setIsLoading(false);
    }
  };
  
  
  

  // Check if today's mood exists in the data, if not add a random one
  const checkAndAddRandomMoodForToday = () => {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // Check if mood already exists for today in the data
    const existingIndex = moodHistory.findIndex(item => item.date === dateStr);
    
    if (existingIndex < 0) {
      // Select a random mood
      const randomMood = moods[Math.floor(Math.random() * moods.length)].name;
      
      // Add new entry
      const newMoodHistory = [...moodHistory, { date: dateStr, mood: randomMood }];
      setMoodHistory(newMoodHistory);
      calculateTopEmotion(newMoodHistory);
      updateCurrentMonthEmotions(newMoodHistory);
    }
  };

  const calculateTopEmotion = (history) => {
    const moodCounts = {};
    history.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    const topMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0];
    if (topMood) {
      setTopEmotion(topMood[0]);
    }
  };

  // Update emotions for the current month
  const updateCurrentMonthEmotions = (history) => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    
    const monthEmotions = history.filter(entry => {
      const [year, month] = entry.date.split('-').map(Number);
      return year === currentYear && month === currentMonth;
    });
    
    setCurrentMonthEmotions(monthEmotions);
  };

  const groupByMonth = () => {
    const monthly = {};
    moodHistory.forEach(entry => {
      const [year, month] = entry.date.split('-');
      const key = `${year}-${month}`;
      if (!monthly[key]) monthly[key] = [];
      monthly[key].push(entry.mood);
    });
    return monthly;
  };

  const openMonthDetail = (monthKey) => {
    const grouped = groupByMonth();
    const moods = grouped[monthKey];
    const count = moods.reduce((acc, mood) => {
      acc[mood] = (acc[mood] || 0) + 1;
      return acc;
    }, {});
    const chartData = Object.entries(count).map(([mood, value]) => ({ mood, value }));
    setMonthlyData(chartData);
    setPopupVisible(true);
  };

  const renderMonthlyHistory = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4DC6BB" />
        </View>
      );
    }

    const grouped = groupByMonth();
    const sortedMonths = Object.keys(grouped).sort((a, b) => {
      const [yearA, monthA] = a.split('-').map(Number);
      const [yearB, monthB] = b.split('-').map(Number);
      return yearB - yearA || monthB - monthA;
    });

    return sortedMonths.map((month, index) => {
      const moods = grouped[month];
      const top = moods.sort((a, b) =>
        moods.filter(v => v === a).length - moods.filter(v => v === b).length
      ).pop();
      
      return (
        <TouchableOpacity 
          key={index} 
          onPress={() => openMonthDetail(month)}
          style={styles.historyItem}
        >
          <View style={styles.historyItemContent}>
            <Text style={styles.historyDate}>
              {new Date(month + '-01').toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Text>
            <Text style={[styles.historyMood, { color: getMoodColor(top) }]}>
              {top}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      );
    });
  };

  const getMoodColor = (moodName) => {
    const mood = moods.find(m => m.name === moodName);
    return mood ? mood.color : '#CCCCCC';
  };

  // Simple bar chart component to replace VictoryBar
  const SimpleBarChart = ({ data }) => {
    const maxValue = Math.max(...data.map(item => item.value));
    const barWidth = 30;
    const maxHeight = 200;
    
    return (
      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const height = (item.value / maxValue) * maxHeight;
          return (
            <View key={index} style={styles.barContainer}>
              <View style={[styles.bar, { height, backgroundColor: getMoodColor(item.mood) }]} />
              <Text style={styles.barLabel}>{item.mood}</Text>
              <Text style={styles.barValue}>{item.value}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  // Simple calendar component
  const SimpleCalendar = () => {
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    
    // Get mood for a specific date
    const getMoodForDate = (day) => {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const entry = moodHistory.find(item => item.date === dateStr);
      return entry ? entry.mood : null;
    };

    const handleDateClick = (day) => {
      const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const entry = moodHistory.find(item => item.date === dateStr);
      
      if (entry) {
        alert(`On ${dateStr} you were feeling ${entry.mood}`);
      } else {
        alert(`No mood recorded for ${dateStr}`);
      }
    };

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.calendarTitle}>
            {selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Text>
          <TouchableOpacity onPress={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}>
            <Ionicons name="chevron-forward" size={24} color="#333" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekdayHeader}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <Text key={day} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.daysContainer}>
          {Array(firstDayOfMonth).fill(null).map((_, index) => (
            <View key={`empty-${index}`} style={styles.dayCell} />
          ))}
          
          {days.map(day => {
            const mood = getMoodForDate(day);
            return (
              <TouchableOpacity 
                key={day} 
                style={[
                  styles.dayCell,
                  mood && { backgroundColor: getMoodColor(mood) + '20' } // Add 20 for 20% opacity
                ]}
                onPress={() => handleDateClick(day)}
              >
                <Text style={styles.dayText}>{day}</Text>
                {mood && (
                  <View style={[styles.moodIndicator, { backgroundColor: getMoodColor(mood) }]} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  // Emotion color bar component
  const EmotionColorBar = () => {
    // Get unique emotions for the current month
    const uniqueEmotions = [...new Set(currentMonthEmotions.map(entry => entry.mood))];
    
    return (
      <View style={styles.emotionColorBar}>
        {uniqueEmotions.map((emotion, index) => (
          <View 
            key={index} 
            style={[
              styles.emotionColor, 
              { backgroundColor: getMoodColor(emotion) }
            ]} 
          />
        ))}
      </View>
    );
  };

  // Get the top emotion for the current month
  const getCurrentMonthTopEmotion = () => {
    if (currentMonthEmotions.length === 0) return "No data";
    
    const moodCounts = {};
    currentMonthEmotions.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    const topMood = Object.entries(moodCounts).sort(([, a], [, b]) => b - a)[0];
    return topMood ? topMood[0] : "No data";
  };

  const clearCache = async () => {
    try {
      await AsyncStorage.removeItem('moodHistory');
      console.log('Cache cleared successfully');
    } catch (e) {
      console.error('Error clearing cache:', e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Top Emotion of the Month: {getCurrentMonthTopEmotion()}</Text>
        
        {/* Credit Card Style Display */}
        <View style={styles.creditCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Mood Tracker</Text>
            <Text style={styles.userName}>{userName || "User"}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardSubtitle}>This Month's Emotions</Text>
            <EmotionColorBar />
          </View>
          <View style={styles.cardFooter}>
            <Text style={styles.cardDate}>
              {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.calendarButton}
          onPress={() => setCalendarVisible(!calendarVisible)}
        >
          <Text style={styles.calendarButtonText}>
            {calendarVisible ? 'Hide Calendar' : 'Show Calendar'}
          </Text>
        </TouchableOpacity>
        
        {calendarVisible && <SimpleCalendar />}
        
        <Text style={styles.sectionTitle}>Mood History by Month</Text>
        {renderMonthlyHistory()}

        <Modal visible={popupVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.sectionTitle}>Monthly Mood Breakdown</Text>
              <SimpleBarChart data={monthlyData} />
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setPopupVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff',
    marginTop: 0,
    paddingTop: 0,
  },
  content: { 
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginVertical: 10,
    marginTop: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  historyItemContent: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  historyMood: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  // New styles for the simple bar chart
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 250,
    marginVertical: 20,
  },
  barContainer: {
    alignItems: 'center',
    width: 40,
  },
  bar: {
    width: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  barLabel: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
  },
  barValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  calendarButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Calendar styles
  calendarContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekdayText: {
    width: 40,
    textAlign: 'center',
    fontWeight: '500',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 5,
  },
  dayText: {
    fontSize: 14,
  },
  moodIndicator: {
    position: 'absolute',
    bottom: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  // Credit Card Styles
  creditCard: {
    backgroundColor: '#1a237e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  cardBody: {
    marginBottom: 20,
  },
  cardSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardDate: {
    color: 'white',
    fontSize: 14,
  },
  // Emotion Color Bar
  emotionColorBar: {
    flexDirection: 'row',
    height: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  emotionColor: {
    flex: 1,
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  closeButton: {
    backgroundColor: '#4DC6BB',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MoodTrackerScreen;
