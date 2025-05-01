import React, { useState, useEffect, useRef } from 'react';
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
import { my_auth, db } from '../components/Firebase';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
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
const [chatId, setChatId] = useState(null);
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
  const loadUserName = async () => {
    const user = my_auth.currentUser;
    if (!user) {
      alert('یوزر لاگ ان نہیں ہے۔');
      navigation.goBack();
      return;
    }

    try {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      const userData = docSnap.exists() ? docSnap.data() : null;
      setUserName(userData?.name || user.displayName || "User");
    } catch (err) {
      console.error("Error loading user name:", err);
      setUserName(user.displayName || "User");
    }
  };

  loadUserName();
}, []);

// Handle chat initialization & focus-based reload
useEffect(() => {
  const determineChatId = () =>
    route.params?.chatId ||
    navigation.getState().routes.find(r => r.name === 'ChatTab')?.params?.chatId;

  const initializeChat = async () => {
    const currentChatId = determineChatId();

    if (currentChatId) {
      setChatId(currentChatId);
      setIsNewChat(false);
      await loadChat(currentChatId);
    } else {
      await createNewChat();
    }
  };

  initializeChat();

  const unsubscribe = navigation.addListener('focus', async () => {
    const newChatId = determineChatId();
    if (newChatId && newChatId !== chatId) {
      setChatId(newChatId);
      setIsNewChat(false);
      await loadChat(newChatId);
    }
  });

  return () => {
    if (messages.length > 0) saveChat();
    unsubscribe();
  };
}, [route.params?.chatId, chatId]);

  const createNewChat = async () => {
    try {
      const user = my_auth.currentUser;
      if (!user) return;

      const chatData = {
        userId: user.uid,
        userName: userName,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messages: [],
        summary: 'New Chat',
        sentiment: 'Neutral',
      };

      const chatRef = await addDoc(collection(db, 'chats'), chatData);
      setChatId(chatRef.id);
      setMessages([]);
      setIsNewChat(true);

      // Don't save empty chats to local storage
      // await saveChatToLocalStorage(chatRef.id, []);
    } catch (error) {
      console.error('Error creating new chat:', error);
      alert('نئی چیٹ بنانے میں مسئلہ آیا۔ دوبارہ کوشش کریں۔');
    }
  };

  const loadChat = async (id) => {
    try {
      setIsLoading(true);
      console.log('Loading chat with ID:', id);
      
      // Try to load from local storage first
      const storageKey = `chat_data_${my_auth.currentUser?.uid || 'anonymous'}`;
      const storedData = await AsyncStorage.getItem(storageKey);
      
      if (storedData) {
        try {
          const data = JSON.parse(storedData);
          const chatData = data.find(item => item.chatId === id);
          
          if (chatData && chatData.messages && chatData.messages.length > 0) {
            console.log('Loaded messages from local storage:', chatData.messages.length);
            setMessages(chatData.messages);
            setIsLoading(false);
            return;
          }
        } catch (parseError) {
          console.error('Error parsing local storage data:', parseError);
        }
      }
      
      // If local storage fails or has no data, try Firebase
      const user = my_auth.currentUser;
      if (user) {
        try {
          const chatDoc = await getDoc(doc(db, 'chats', id));
          if (chatDoc.exists()) {
            const chatData = chatDoc.data();
            console.log('Loaded messages from Firebase:', chatData.messages?.length || 0);
            setMessages(chatData.messages || []);
            
            // Save to local storage for future use
            await saveChatToLocalStorage(id, chatData.messages || []);
          } else {
            console.log('No chat found with ID:', id);
            setMessages([]);
          }
        } catch (firebaseError) {
          console.error('Firebase error:', firebaseError);
          setMessages([]);
        }
      } else {
        console.log('User not authenticated, cannot load from Firebase');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveChatToLocalStorage = async (chatId, messages) => {
    try {
      const user = my_auth.currentUser;
      const storageKey = `chat_data_${user?.uid || 'anonymous'}`;
      let existingData = [];

      try {
        const storedData = await AsyncStorage.getItem(storageKey);
        if (storedData) {
          existingData = JSON.parse(storedData);
        }
      } catch (parseError) {
        console.log('Error parsing existing data:', parseError);
        existingData = [];
      }

      const chatData = {
        chatId: chatId,
        timestamp: new Date().toISOString(),
        messages: messages
      };

      const chatIndex = existingData.findIndex(chat => chat.chatId === chatId);
      if (chatIndex === -1) {
        existingData.push(chatData);
      } else {
        existingData[chatIndex] = chatData;
      }

      await AsyncStorage.setItem(storageKey, JSON.stringify(existingData));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  };

  const saveChat = async () => {
    if (!chatId || messages.length === 0) return;

    try {
      // Always save to local storage first
      await saveChatToLocalStorage(chatId, messages);

      // Only try Firebase if user is authenticated
      const user = my_auth.currentUser;
      if (user) {
        try {
          const chatData = {
            userId: user.uid,
            userName: userName,
            messages: messages,
            updatedAt: serverTimestamp(),
            summary: messages[0]?.text?.substring(0, 50) + (messages[0]?.text?.length > 50 ? '...' : '') || 'New Chat',
            sentiment: 'Neutral',
          };

          await setDoc(doc(db, 'chats', chatId), chatData, { merge: true });
        } catch (firebaseError) {
          console.log('Firebase save error:', firebaseError);
        }
      }
    } catch (error) {
      console.error('Error saving chat:', error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const updatedMessages = [...messages, userMessage];
      
      // Save to local storage first
      await saveChatToLocalStorage(chatId, updatedMessages);

      // Only try Firebase if user is authenticated
      const user = my_auth.currentUser;
      if (user) {
        try {
          await setDoc(doc(db, 'chats', chatId), {
            userId: user.uid,
            userName: userName,
            messages: updatedMessages,
            updatedAt: serverTimestamp(),
            summary: inputText.substring(0, 50) + (inputText.length > 50 ? '...' : ''),
          }, { merge: true });
        } catch (firebaseError) {
          console.log('Firebase save error:', firebaseError);
        }
      }

      const aiResponse = await callPuterAI(inputText);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);

      // Save final messages to local storage
      await saveChatToLocalStorage(chatId, finalMessages);

      // Only try Firebase if user is authenticated
      if (user) {
        try {
          await setDoc(doc(db, 'chats', chatId), {
            userId: user.uid,
            userName: userName,
            messages: finalMessages,
            updatedAt: serverTimestamp(),
          }, { merge: true });
        } catch (firebaseError) {
          console.log('Firebase save error:', firebaseError);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const callPuterAI = async (userInput) => {
    try {
      return `I understand you're asking about "${userInput}". As a mental health assistant, I'm here to help. Would you like to talk more about this topic?`;
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
        item.isUser ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.isUser ? styles.userMessageText : styles.aiMessageText,
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

          <Text style={[styles.headerTitle, { textAlign: 'right' }]}>اے آئی سے بات چیت</Text>

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
              <Ionicons name="trash-outline" size={24} color="#333" />
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
              style={[styles.input, { backgroundColor: '#4DC6BB', textAlign: 'right' }]}
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
    color: '#333',
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
    textAlign: 'right',
  },
  userMessageText: {
    color: '#ffffff',
  },
  aiMessageText: {
    color: '#333333',
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
    backgroundColor: '#4DC6BB',
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
//ok bye