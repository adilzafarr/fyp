import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChangePassword = ({ navigation }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isFormValid = () => {
    return (
      currentPassword.length > 0 &&
      newPassword.length >= 6 &&
      confirmPassword.length >= 6 &&
      newPassword === confirmPassword
    );
  };

  const handleSubmit = async () => {
    const email = await AsyncStorage.getItem('userEmail');
    if (!isFormValid()) {
      return;
    }

    // Check if all passwords are the same
    if (currentPassword === newPassword && newPassword === confirmPassword) {
      alert('تمام پاسورڈ ایک جیسے ہیں۔ براہ کرم دوبارہ کوشش کریں۔');
      navigation.replace('ChangePassword');
      return;
    }

    try {
      const stored_email = AsyncStorage.getItem('userEmail');

      const response = await api.post('/auth/change-password', {
        email,
        currentPassword,
        newPassword,
      });
      handleSuccess();

    } catch (error) {

      console.log('Error:', error);
      alert('پاسورڈ تبدیل کرنے میں ناکامی۔ براہ کرم دوبارہ کوشش کریں۔');
      navigation.replace('ChangePassword');
      
    }
  };

  const handleSuccess = async () => {
    alert('پاسورڈ کامیابی سے تبدیل کر دیا گیا ہے');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  const handleError = (error) => {
    console.log('Error:', error);
    // Reload the current page
    navigation.replace('ChangePassword');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#006A71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>پاسورڈ تبدیل کریں</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>موجودہ پاسورڈ</Text>
          <TextInput
            style={styles.input}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            placeholder="موجودہ پاسورڈ درج کریں"
            placeholderTextColor="#666"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>نیا پاسورڈ</Text>
          <TextInput
            style={styles.input}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            placeholder="نیا پاسورڈ درج کریں (کم از کم 6 حروف)"
            placeholderTextColor="#666"
          />
          {newPassword.length > 0 && newPassword.length < 6 && (
            <Text style={styles.errorText}>پاسورڈ کم از کم 6 حروف کا ہونا چاہیے</Text>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>نیا پاسورڈ دوبارہ درج کریں</Text>
          <TextInput
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="نیا پاسورڈ دوبارہ درج کریں"
            placeholderTextColor="#666"
          />
          {confirmPassword.length > 0 && newPassword !== confirmPassword && (
            <Text style={styles.errorText}>پاسورڈ ایک جیسے نہیں ہیں</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !isFormValid() && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid()}
        >
          <Text style={[styles.submitButtonText, !isFormValid() && styles.submitButtonTextDisabled]}>
            پاسورڈ تبدیل کریں
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    paddingTop: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006A71',
    marginTop: 0,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#006A71',
    marginBottom: 8,
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'right',
  },
  submitButton: {
    backgroundColor: '#006A71',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5E4DE',
  },
  submitButtonText: {
    color: '#F2EFE7',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#ffffff',
  },
});

export default ChangePassword; 