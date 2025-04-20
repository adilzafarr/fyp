import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatHistoryScreen = ({ navigation }) => {
  // Sample chat history data - replace with actual data from your backend
  const chatHistory = [
    {
      id: '1',
      date: '2024-03-18',
      summary: 'Discussion about anxiety management techniques',
      sentiment: 'Positive',
      messages: 12,
    },
    {
      id: '2',
      date: '2024-03-17',
      summary: 'Talked about sleep improvement strategies',
      sentiment: 'Neutral',
      messages: 8,
    },
    {
      id: '3',
      date: '2024-03-16',
      summary: 'Explored mindfulness meditation practices',
      sentiment: 'Positive',
      messages: 15,
    },
  ];

  const getSentimentColor = (sentiment) => {
    switch (sentiment.toLowerCase()) {
      case 'positive':
        return '#34C759';
      case 'neutral':
        return '#FF9500';
      case 'negative':
        return '#FF3B30';
      default:
        return '#999';
    }
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatDetail', { chatId: item.id })}
    >
      <View style={styles.chatHeader}>
        <Text style={styles.chatDate}>{item.date}</Text>
        <View
          style={[
            styles.sentimentTag,
            { backgroundColor: getSentimentColor(item.sentiment) },
          ]}
        >
          <Text style={styles.sentimentText}>{item.sentiment}</Text>
        </View>
      </View>

      <Text style={styles.chatSummary}>{item.summary}</Text>

      <View style={styles.chatFooter}>
        <View style={styles.messageCount}>
          <Ionicons name="chatbubble-outline" size={16} color="#666" />
          <Text style={styles.messageCountText}>{item.messages} messages</Text>
        </View>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            // TODO: Implement delete functionality
          }}
        >
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chat History</Text>
      </View>

      <FlatList
        data={chatHistory}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
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
  chatList: {
    padding: 15,
  },
  chatItem: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chatDate: {
    fontSize: 14,
    color: '#666',
  },
  sentimentTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sentimentText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '500',
  },
  chatSummary: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageCountText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 5,
  },
});

export default ChatHistoryScreen; 