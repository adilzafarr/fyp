import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import api from '../../utils/api'; // <-- your axios instance
import { Ionicons } from '@expo/vector-icons';

const ChatScreen = ({ route }) => {
  const { userId } = route.params; // assuming you're passing userId from navigation
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const flatListRef = useRef(null);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputMessage,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    try {
      const response = await api.post('/chat', {
        userId,
        message: userMessage.content,
        conversationId, // might be null initially
      });

      const botMessage = {
        id: Date.now().toString() + '_bot',
        sender: 'bot',
        content: response.data.reply,
      };

      setMessages(prev => [...prev, botMessage]);

      if (!conversationId) {
        setConversationId(response.data.conversationId); // save it after first response
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage = {
        id: Date.now().toString() + '_error',
        sender: 'bot',
        content: 'Something went wrong. Please try again later.',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: item.sender === 'user' ? '#007AFF' : '#E5E5EA',
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
        maxWidth: '80%',
      }}
    >
      <Text style={{ color: item.sender === 'user' ? 'white' : 'black' }}>
        {item.content}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 10 }}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 20,
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginRight: 10,
          }}
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage}>
          <Ionicons name="send" size={28} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
