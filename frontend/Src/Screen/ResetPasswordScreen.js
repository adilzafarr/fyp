import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../../utils/api';

const ResetPasswordScreen = ({ route, navigation }) => {
  const { email, otp } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    // Validate passwords
    if (!newPassword || newPassword.trim() === '') {
      alert("فیلد پاس ورڈ خالی ہے", "براہ کرم نیا پاس ورڈ درج کریں");
      return;
    }

    if (newPassword.length < 6) {
      alert("پاس ورڈ بہت چھوٹا ہے", "پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("پاس ورڈز مماثل نہیں ہیں", "براہ کرم دونوں پاس ورڈز ایک جیسے درج کریں");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/reset-password', {
        email,
        code: otp,
        newPassword: newPassword.trim(),
      });

      console.log('Reset password response:', response.data);
      
              // Check for success (either status 200 or success message)
        if (response.status === 200 || response.data.message) {
          alert(
            "آپ کا پاس ورڈ کامیابی سے تبدیل کر دیا گیا ہے",
            [
              {
                text: "ٹھیک ہے",
                onPress: () => {
                  console.log('Navigating to Home screen');
                  try {
                    // Navigate to Main stack which contains the Home screen
                    navigation.reset({
                      index: 0,
                      routes: [{ name: 'Main' }],
                    });
                  } catch (error) {
                    console.error('Navigation error:', error);
                    // Fallback - try to navigate to Main
                    navigation.navigate('Main');
                  }
                }
              }
            ]
          );
        } else {
          throw new Error('Unexpected response format');
        }
    } catch (error) {
      console.error('Reset password error:', error);
      let errorMessage = 'پاس ورڈ ری سیٹ کرنے میں ناکامی۔ براہ کرم دوبارہ کوشش کریں';

      if (error.response) {
        errorMessage = error.response.data.detail || error.response.data.error || errorMessage;
      } else if (error.request) {
        errorMessage = 'سرور سے رابطہ نہیں ہو سکا۔ براہ کرم بعد میں دوبارہ کوشش کریں۔';
      } else {
        errorMessage = 'پاس ورڈ ری سیٹ کرنے میں ناکامی: ' + error.message;
      }
      
      alert("خطا", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>نیا پاس ورڈ سیٹ کریں</Text>
        <Text style={styles.subtitle}>
          اپنا نیا پاس ورڈ درج کریں
        </Text>

        <TextInput
          style={[styles.input, loading && styles.inputDisabled]}
          placeholder="نیا پاس ورڈ"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
          editable={!loading}
          placeholderTextColor="#666"
        />

        <TextInput
          style={[styles.input, loading && styles.inputDisabled]}
          placeholder="پاس ورڈ کی تصدیق کریں"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
          placeholderTextColor="#666"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleResetPassword}
          
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.buttonText}>پاس ورڈ تبدیل کریں</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>لاگ ان پر جائیں</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  inputDisabled: {
    opacity: 0.7,
  },
  button: {
    backgroundColor: '#4DC6BB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#A5E4DE',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
    padding: 10,
  },
  backButtonText: {
    color: '#4DC6BB',
    fontSize: 16,
  },
});

export default ResetPasswordScreen; 