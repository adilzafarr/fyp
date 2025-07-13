import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../utils/api';

const ChatHistoryScreen = ({ navigation }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loadUserIdAndChats = async () => {
      const storedUserId = await AsyncStorage.getItem('usersId');
      if (storedUserId) {
        const parsedUserId = Number(storedUserId);
        setUserId(parsedUserId);
        fetchChatHistory(parsedUserId);
      } else {
        setLoading(false);
        Alert.alert('Error', 'User not logged in.');
      }
    };
    loadUserIdAndChats();
  }, []);

  const fetchChatHistory = async (currentUserId) => {
    console.log('Fetching chat history for user ID:', currentUserId);
    setLoading(true);
    try {
      const response = await api.post('/chat/history', { userId: currentUserId });
      const data = response.data;

      const formattedChatHistory = data.map(chat => ({
        id: chat.conversation_id,
        summary: chat.last_message ? chat.last_message.substring(0, 50) + (chat.last_message.length > 50 ? '...' : '') : 'New Chat',
        lastMessage: chat.last_message || 'No messages',
        timestamp: new Date(chat.created_at),
        messageCount: chat.message_count || 0,
      }));

      setChatHistory(formattedChatHistory.sort((a, b) => b.timestamp - a.timestamp));
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      setLoading(false);
      setRefreshing(false);
      Alert.alert('Error', 'Failed to load chat history.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    if (userId) {
      await fetchChatHistory(userId);
    } else {
      setRefreshing(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    console.log('Deleting chat with ID:', chatId);
    setChatHistory(prev => prev.filter(chat => chat.id !== chatId));

    try {
      await api.delete(`/chat/${chatId}`);
      console.log('Chat deleted successfully on backend.');
    } catch (error) {
      console.error('Error deleting chat on backend:', error);
      Alert.alert('Error', 'Failed to delete chat on server.');
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        navigation.navigate('ChatDetail', { chatId: item.id });
      }}
    >
      <View style={styles.chatContent}>
        <Text style={styles.chatSummary} numberOfLines={1}>
          {item.summary}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp instanceof Date && !isNaN(item.timestamp) ? item.timestamp.toLocaleDateString() : 'Invalid Date'} - {item.messageCount} messages
        </Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteChat(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#006A71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>پچھلی بات چیت</Text>
        <View style={styles.headerRight} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : chatHistory.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No chat history found</Text>
        </View>
      ) : (
        <FlatList
          data={chatHistory}
          renderItem={renderChatItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006A71',
  },
  headerRight: {
    width: 40,
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
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chatContent: {
    flex: 1,
    marginRight: 12,
  },
  chatSummary: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
  },
});

export default ChatHistoryScreen; 