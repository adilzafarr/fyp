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
import { my_auth } from '../components/Firebase';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';

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
      const user = my_auth.currentUser;
      if (!user || !user.email) {
        alert('صارف لاگ ان نہیں ہے');
        return;
      }

      // Create credentials with email and current password
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      // Reauthenticate the user
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await updatePassword(user, newPassword);

      // Show success message
      handleSuccess();
    } catch (error) {
      console.log('Error:', error);
      if (error.code === 'auth/wrong-password') {
        alert('موجودہ پاسورڈ غلط ہے۔ براہ کرم دوبارہ کوشش کریں۔');
        navigation.replace('ChangePassword');
      } else {
        alert('پاسورڈ تبدیل کرنے میں ناکامی۔ براہ کرم دوبارہ کوشش کریں۔');
        navigation.replace('ChangePassword');
      }
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
          <Ionicons name="arrow-back" size={24} color="#333" />
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
            {currentPassword.length > 0 && currentPassword.length < 6 && (
              <Text style={styles.errorText}>پاسورڈ کم از کم 6 حروف کا ہونا چاہیے</Text>
            )}
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
    paddingTop: 0,
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
    color: '#333',
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
    color: '#333',
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
    backgroundColor: '#4DC6BB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#A5E4DE',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: '#ffffff',
  },
});

export default ChangePassword; 