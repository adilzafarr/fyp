import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';

const ChatDetailScreen = ({ route, navigation }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMessages = async () => {
      console.log('Starting to fetch messages for chat ID:', chatId);
      setLoading(true);
      try {
        // Log the full API URL being called
        const apiUrl = `/chat/messages/${chatId}`;
        console.log('Calling API endpoint:', apiUrl);
        
        const response = await api.get(apiUrl);
        console.log('API Response received:', response);
        console.log('Response data:', response.data);
        
        const fetchedMessages = response.data;
        console.log('Raw fetched messages:', fetchedMessages);

        if (!Array.isArray(fetchedMessages)) {
          console.error('Fetched messages is not an array:', fetchedMessages);
          Alert.alert('Error', 'Invalid message data received from server');
          setLoading(false);
          return;
        }

        const formattedMessages = fetchedMessages.map(message => {
  const createdAt = message.created_at ? new Date(message.created_at) : null;
  return {
    id: message.id || message.message_id,
    text: message.content || message.text,
    isUser: message.sender === 'user' || message.sender === 'User',
    createdAt, // keep Date object for sorting
    timestamp: createdAt
      ? createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : 'Unknown time',
  };
});

// Sort using the createdAt field
const sortedMessages = formattedMessages.sort((a, b) => a.createdAt - b.createdAt);
setMessages(sortedMessages);


        console.log('Formatted messages:', formattedMessages);
        setMessages(formattedMessages.sort((a, b) => a.timestamp - b.timestamp));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        setLoading(false);
        Alert.alert('Error', `Failed to load messages: ${error.message}`);
      }
    };

    if (chatId) {
      console.log('Chat ID available, starting fetch:', chatId);
      fetchMessages();
    } else {
      console.error('No chat ID provided');
      Alert.alert('Error', 'No chat ID provided');
      setLoading(false);
    }
  }, [chatId]);

  const renderMessage = ({ item }) => {
    console.log('Rendering message:', item);
    return (
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
        <Text style={[
          styles.timestamp,
          item.isUser ? styles.userTimestamp : styles.aiTimestamp,
        ]}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Conversation History</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : messages.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No messages found</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id?.toString() || Math.random().toString()}
          contentContainerStyle={styles.messagesList}
        />
      )}
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
    paddingTop: 20,
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
    backgroundColor: '#006A71',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 5,
  },
  aiMessage: {
    backgroundColor: '#F2EFE7',
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
    color: '#006A71',
  },
  timestamp: {
    fontSize: 10,
    color: '#ffffffff',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  ueserTimestamp: {
    fontSize: 10,
    color: '#ffffffff',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  aiTimestamp: {
    fontSize: 10,
    color: '#006A71',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default ChatDetailScreen; 