import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MoodTrackerScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([
    { date: '2024-03-18', mood: 'Happy', note: 'Had a great day at work' },
    { date: '2024-03-17', mood: 'Calm', note: 'Meditation helped a lot' },
    { date: '2024-03-16', mood: 'Anxious', note: 'Stressed about upcoming presentation' },
  ]);

  const moods = [
    { name: 'Happy', icon: 'happy', color: '#FFD700' },
    { name: 'Calm', icon: 'leaf', color: '#4CAF50' },
    { name: 'Sad', icon: 'sad', color: '#2196F3' },
    { name: 'Anxious', icon: 'alert', color: '#FF9800' },
    { name: 'Angry', icon: 'flame', color: '#F44336' },
  ];

  const handleSaveMood = () => {
    if (!selectedMood) return;

    const today = new Date().toISOString().split('T')[0];
    const newEntry = {
      date: today,
      mood: selectedMood.name,
      note: note,
    };

    setMoodHistory([newEntry, ...moodHistory]);
    setSelectedMood(null);
    setNote('');
  };

  const renderMoodOption = (mood) => (
    <TouchableOpacity
      key={mood.name}
      style={[
        styles.moodOption,
        selectedMood?.name === mood.name && styles.selectedMood,
        { borderColor: mood.color },
      ]}
      onPress={() => setSelectedMood(mood)}
    >
      <Ionicons name={mood.icon} size={32} color={mood.color} />
      <Text style={styles.moodName}>{mood.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mood Tracker</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling today?</Text>
          <View style={styles.moodOptions}>
            {moods.map(renderMoodOption)}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add a note (optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="What's on your mind?"
            value={note}
            onChangeText={setNote}
            multiline
          />
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            !selectedMood && styles.disabledButton,
          ]}
          onPress={handleSaveMood}
          disabled={!selectedMood}
        >
          <Text style={styles.saveButtonText}>Save Mood</Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Mood History</Text>
          {moodHistory.map((entry, index) => (
            <View key={index} style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>{entry.date}</Text>
                <View
                  style={[
                    styles.moodTag,
                    {
                      backgroundColor:
                        moods.find((m) => m.name === entry.mood)?.color + '20',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.moodTagText,
                      {
                        color:
                          moods.find((m) => m.name === entry.mood)?.color,
                      },
                    ]}
                  >
                    {entry.mood}
                  </Text>
                </View>
              </View>
              {entry.note && (
                <Text style={styles.historyNote}>{entry.note}</Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  moodOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  selectedMood: {
    borderStyle: 'solid',
    backgroundColor: '#f9f9f9',
  },
  moodName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  noteInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 14,
    color: '#666',
  },
  moodTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  historyNote: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});

export default MoodTrackerScreen; 