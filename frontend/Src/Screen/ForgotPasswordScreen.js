import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import api from '../../utils/api';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    // Validate email
    if (!email || email.trim() === '') {
      Alert.alert("فیلد ایمیل خالی است", "براہ کرم اپنا ای میل ایڈریس درج کریں");
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("فرمت ایمیل نامعتبر", "براہ کرم درست ای میل ایڈریس درج کریں");
      return;
    }

    setLoading(true);

    try {
      // --- Removed Firebase password reset code ---
      // await sendPasswordResetEmail(my_auth, email.trim());
      // --- New backend API call for password reset ---
      const response = await api.post('/auth/forgot-password', { email: email.trim() });

      if (response.status === 200) {
        // Navigate to OTP verification screen
        navigation.navigate('OTPVerification', { email: email.trim() });
      } else {
        // Handle non-200 responses from backend
        const errorMessage = response.data.error || 'ری سیٹ ای میل بھیجنے میں ناکامی۔ براہ کرم دوبارہ کوشش کریں';
        Alert.alert("خطا در ارسال ایمیل", errorMessage);
      }

    } catch (error) {
      console.error('Password reset error:', error);
      // Handle network errors or other exceptions
      let errorMessage = 'ری سیٹ ای میل بھیجنے میں ناکامی۔ براہ کرم دوبارہ کوشش کریں';

      // Check if the error is an Axios error with a response from the server
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        errorMessage = error.response.data.error || error.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error request:', error.request);
        errorMessage = 'سرور سے رابطہ نہیں ہو سکا۔ براہ کرم بعد میں دوبارہ کوشش کریں۔' + error.message;
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        errorMessage = 'ری سیٹ ای میل بھیجنے میں ناکامی: ' + error.message;
      }
      
      Alert.alert("خطا", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>پاس ورڈ دوبارہ سیٹ کریں</Text>
        <Text style={styles.subtitle}>
          اپنا ای میل ایڈریس درج کریں اور ہم آپ کو پاس ورڈ ری سیٹ کرنے کے لیے لنک بھیج دیں گے
        </Text>

        <TextInput
          style={[styles.input, loading && styles.inputDisabled]}
          placeholder="اپنا ای میل درج کریں"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
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
            <Text style={styles.buttonText}>ری سیٹ لنک بھیجیں</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>لاگ ان پر واپس جائیں</Text>
        </TouchableOpacity>
      </View>
    </View>
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

export default ForgotPasswordScreen;
