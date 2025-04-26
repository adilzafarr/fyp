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

const ChatHistoryScreen = ({ navigation }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setupChatListener();
    return () => {
      // Cleanup listener when component unmounts
    };
  }, []);

  const setupChatListener = async () => {
    try {
      const user = my_auth.currentUser;
      
      // First try to load from AsyncStorage
      const storageKey = `chat_data_${user?.uid || 'anonymous'}`;
      const storedData = await AsyncStorage.getItem(storageKey);
      let localChats = [];
      
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          localChats = data.map(chat => ({
            id: chat.chatId,
            summary: chat.messages[0]?.text?.substring(0, 50) + (chat.messages[0]?.text?.length > 50 ? '...' : '') || 'New Chat',
            lastMessage: chat.messages[chat.messages.length - 1]?.text || 'No messages',
            timestamp: new Date(chat.timestamp),
            messageCount: chat.messages.length
          }));
        } catch (parseError) {
          console.log('Error parsing local storage data:', parseError);
        }
      }

      // Set local chats first
      setChatHistory(localChats.sort((a, b) => b.timestamp - a.timestamp));
      setLoading(false);
      setRefreshing(false);

      // Only set up Firebase listener if user is authenticated
      if (user) {
        try {
          const chatsQuery = query(
            collection(db, 'chats'),
            where('userId', '==', user.uid),
            orderBy('updatedAt', 'desc')
          );

          const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
            const firebaseChats = [];
            querySnapshot.forEach((doc) => {
              const data = doc.data();
              firebaseChats.push({
                id: doc.id,
                summary: data.summary || 'No summary',
                lastMessage: data.messages?.[data.messages.length - 1]?.text || 'No messages',
                timestamp: data.updatedAt?.toDate() || new Date(),
                messageCount: data.messages?.length || 0
              });
            });

            // Merge local and Firebase chats, removing duplicates
            const mergedChats = [...localChats];
            firebaseChats.forEach(firebaseChat => {
              const existingIndex = mergedChats.findIndex(chat => chat.id === firebaseChat.id);
              if (existingIndex === -1) {
                mergedChats.push(firebaseChat);
              } else if (firebaseChat.timestamp > mergedChats[existingIndex].timestamp) {
                mergedChats[existingIndex] = firebaseChat;
              }
            });

            setChatHistory(mergedChats.sort((a, b) => b.timestamp - a.timestamp));
            setLoading(false);
            setRefreshing(false);
          }, (error) => {
            console.log('Firebase listener error:', error);
            // Don't show error to user, just use local data
            setLoading(false);
            setRefreshing(false);
          });

          return unsubscribe;
        } catch (firebaseError) {
          console.log('Firebase setup error:', firebaseError);
          // Don't show error to user, just use local data
          setLoading(false);
          setRefreshing(false);
        }
      }
    } catch (error) {
      console.error('Error setting up chat listener:', error);
      // Don't show error to user, just use local data
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await setupChatListener();
  };

  const handleDeleteChat = async (chatId) => {
    try {
      const user = my_auth.currentUser;
      
      // Delete from AsyncStorage
      const storageKey = `chat_data_${user?.uid || 'anonymous'}`;
      const storedData = await AsyncStorage.getItem(storageKey);
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          const updatedData = data.filter(chat => chat.chatId !== chatId);
          await AsyncStorage.setItem(storageKey, JSON.stringify(updatedData));
        } catch (parseError) {
          console.log('Error parsing local storage data:', parseError);
        }
      }

      // Update local state
      setChatHistory(prev => prev.filter(chat => chat.id !== chatId));

      // Only try to delete from Firebase if user is authenticated
      if (user) {
        try {
          await deleteDoc(doc(db, 'chats', chatId));
        } catch (firebaseError) {
          console.log('Firebase delete error:', firebaseError);
          // Don't show error to user, just continue with local deletion
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      // Don't show error to user
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => {
        navigation.navigate('ChatTab', { chatId: item.id });
      }}
    >
      <View style={styles.chatContent}>
        <Text style={styles.chatSummary} numberOfLines={1}>
          {item.summary}
        </Text>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {item.lastMessage}
        </Text>
        <Text style={styles.timestamp}>
          {item.timestamp.toLocaleDateString()} - {item.messageCount} messages
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
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat History</Text>
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
          keyExtractor={(item) => item.id}
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
    color: '#333',
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