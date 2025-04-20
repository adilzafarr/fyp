import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatDetailScreen = ({ route, navigation }) => {
  const { chatId } = route.params;

  // Sample chat messages - replace with actual data from your backend
  const chatMessages = [
    {
      id: '1',
      text: 'Hi, I\'ve been feeling anxious lately. Can you help me?',
      isUser: true,
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      text: 'Of course, I\'m here to help. Can you tell me more about what\'s causing your anxiety?',
      isUser: false,
      timestamp: '10:31 AM',
    },
    {
      id: '3',
      text: 'I have a big presentation at work tomorrow and I\'m really nervous about it.',
      isUser: true,
      timestamp: '10:32 AM',
    },
    {
      id: '4',
      text: 'That\'s a common source of anxiety. Let\'s talk about some techniques that might help you manage this feeling.',
      isUser: false,
      timestamp: '10:33 AM',
    },
    {
      id: '5',
      text: 'What kind of techniques?',
      isUser: true,
      timestamp: '10:34 AM',
    },
    {
      id: '6',
      text: 'Deep breathing exercises can be very effective. Try inhaling for 4 counts, holding for 4, and exhaling for 4. This helps calm your nervous system.',
      isUser: false,
      timestamp: '10:35 AM',
    },
    {
      id: '7',
      text: 'I\'ll try that. Any other suggestions?',
      isUser: true,
      timestamp: '10:36 AM',
    },
    {
      id: '8',
      text: 'Yes, visualization can help too. Imagine yourself giving the presentation successfully. Also, remember that some anxiety is normal and can actually improve performance.',
      isUser: false,
      timestamp: '10:37 AM',
    },
  ];

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text style={[
        styles.messageText,
        item.isUser ? styles.userMessageText : styles.aiMessageText,
      ]}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat History</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            // TODO: Implement delete functionality
            navigation.goBack();
          }}
        >
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={chatMessages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    padding: 5,
  },
  messagesList: {
    padding: 15,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#333',
  },
  timestamp: {
    fontSize: 10,
    color: '#999',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default ChatDetailScreen; 