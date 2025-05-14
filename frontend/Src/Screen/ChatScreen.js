import React, { useState, useEffect, useRef, use } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  I18nManager,
  Pressable,
  Keyboard,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Force RTL layout
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

// Custom alert function
const alert = (statement) => {
  Alert.alert('توجہ دیں', statement, [{ text: 'ٹھیک ہے' }]);
};

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
const [inputText, setInputText] = useState('');
const [isLoading, setIsLoading] = useState(false);
const [userId, setUserId] = useState(-1);
const [convId, setConvId] = useState(-1);
const [isNewChat, setIsNewChat] = useState(true);
const [userName, setUserName] = useState('');
const flatListRef = useRef(null);

// Merge keyboard visibility and tabBar control
useEffect(() => {
  const showSub = Keyboard.addListener('keyboardDidShow', () => {
    navigation.setOptions({ tabBarStyle: { display: 'none' } });
  });
  const hideSub = Keyboard.addListener('keyboardDidHide', () => {
    navigation.setOptions({ tabBarStyle: { display: 'flex' } });
  });

  navigation.setOptions({ tabBarStyle: { display: 'flex' } });

  return () => {
    showSub.remove();
    hideSub.remove();
  };
}, [navigation]);

// Load user info once
useEffect(() => {
  loadInfo();
}, []);

const loadInfo = async () => {
  const id = await AsyncStorage.getItem('usersId');
  setUserId(id);

  if (convId == -1 && id) {
    getConversationID(id);
  }
};

const getConversationID = async (id) => {
  const response = await api.post('/chat/new-conversation', {
    userId: id,
  });
  setConvId(response.data.convID);
  await AsyncStorage.setItem('convID', convId);
};

  const saveMessageToDB = async ({userId, conversationId,sender,text,timestamp}) => {
    const message = await api.post('/chat/save-message', {
      userId,
      conversationId,
      sender,
      text,
      timestamp
    })
  };

  const createNewChat = async () => {
    try {
      setConvId(-1);
      await AsyncStorage.setItem('convID', -1);
      setMessages([]);
      getConversationID();
    } catch (error) {
      console.error('Error creating new chat:', error);
      alert('نئی چیٹ بنانے میں مسئلہ آیا۔ دوبارہ کوشش کریں۔');
    }
  };

  const loadChat = async (id) => {
    
  };

  const saveChatToLocalStorage = async () => {
    await AsyncStorage.setItem('currentChat', messages);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      userId: userId,
      conversationId: convId,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toISOString(),
    };
    try{
      await saveMessageToDB(userMessage);

      setMessages((prev) => [...prev, userMessage]);
      setInputText('');
      setIsLoading(true);
    }catch (error) {
      console.error('Error saving message:', error);
    }

    //call model
    try {
      const aiResponse = await callPuterAI(inputText);

      const aiMessage = {
        userId: userId,
        conversationId: convId,
        sender: 'bot',
        text: aiResponse,
        timestamp: new Date().toISOString(),
      };

      await saveMessageToDB(aiMessage);

      setMessages((prev) => [...prev, aiMessage]);
      saveChatToLocalStorage();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const callPuterAI = async (userInput) => {
    try {
      const reply = await api.post('/chat/bot-reply', {
        message: userInput,
      });
      return reply.data.response.content;
    } catch (error) {
      console.error('Error calling AI:', error);
      return "معذرت، میں اس وقت مدد فراہم نہیں کر پا رہا۔";
    }
  };

  const handleClearChat = () => {
    alert('چیٹ صاف کرنے سے صرف موجودہ اسکرین پر پیغامات غائب ہوں گے۔ چیٹ ہسٹری میں باقی رہیں گے۔');
    setMessages([]);
    
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender=='user' ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender=='user' ? styles.userMessageText : styles.aiMessageText,
          { textAlign: 'right' }
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <View style={styles.header}>
          <Pressable
            style={styles.historyButton}
            onPress={() => navigation.navigate('ChatHistory')}
          >
            <Ionicons name="time-outline" size={24} color="#333" />
          </Pressable>

          <Text style={[styles.headerTitle, { textAlign: 'right' }]}>بات چیت</Text>

          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.newChatButton}
              onPress={() => {
                // Make sure tab bar is visible
                navigation.setOptions({ tabBarStyle: { display: 'flex' } });
                // Clear messages and create new chat
                setMessages([]);
                createNewChat();
              }}
            >
              <Text style={styles.newChatButtonText}>نئی چیٹ</Text>
            </TouchableOpacity>
            
            <Pressable
              style={styles.clearButton}
              onPress={handleClearChat}
            >
              <Ionicons name="trash-outline" size={24} color="#006A71" />
            </Pressable>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.flatList}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          keyboardShouldPersistTaps="handled"
        />

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#007AFF" />
          </View>
        )}

        <View style={styles.inputWrapper}>
          <View style={styles.inputContainer}>
            <Pressable
              style={styles.sendButton}
              onPress={handleSend}
              disabled={!inputText.trim()}
            >
              <Ionicons
                name="send"
                size={24}
                color={inputText.trim() ? '#4DC6BB' : '#999'}
              />
            </Pressable>

            <TextInput
              style={[styles.input, { backgroundColor: '#48A6A7', textAlign: 'right' }]}
              value={inputText}
              onChangeText={setInputText}
              placeholder="یہاں لکھیں "
              placeholderTextColor="#FFFFFF"
              multiline
              onFocus={() => {
                setTimeout(() => {
                  flatListRef.current?.scrollToEnd();
                }, 100);
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
    color: '#006A71',
  },
  historyButton: {
    padding: 5,
  },
  clearButton: {
    padding: 5,
  },
  flatList: {
    flex: 1,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 16,
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
    textAlign: 'right',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#006A71',
  },
  loadingContainer: {
    padding: 10,
    alignItems: 'center',
  },
  inputWrapper: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 10,
    fontSize: 16,
    maxHeight: 100,
    color: '#FFFFFF',
    textAlign: 'right',
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newChatButton: {
    backgroundColor: '#006A71',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
  },
  newChatButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default ChatScreen;