import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import api from '../../utils/api';

const OTPVerificationScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert('براہ کرم 6 ہندسوں کا تصدیقی کوڈ درج کریں');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/verify-otp', {
        email,
        otp,
      });
      if (response.data.message === 'OTP verified successfully') {
        navigation.navigate('ResetPassword', { email, otp });
      } else {
        alert('otp darusht nahih ha');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      let errorMessage = 'تصدیقی کوڈ کی تصدیق میں ناکام';
      
      if (error.response) {
        errorMessage = error.response.data.detail || error.response.data.error || errorMessage;
      } else if (error.request) {
        errorMessage = 'سرور سے رابطہ نہیں ہو سکا۔ براہ کرم بعد میں دوبارہ کوشش کریں۔';
      } else {
        errorMessage = 'تصدیقی کوڈ کی تصدیق میں ناکامی: ' + error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      if (response.status === 200) {
        alert('آپ کے ای میل پر ایک نیا تصدیقی کوڈ بھیج دیا گیا ہے');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      let errorMessage = 'تصدیقی کوڈ دوبارہ بھیجنے میں ناکام';
      
      if (error.response) {
        errorMessage = error.response.data.detail || error.response.data.error || errorMessage;
      } else if (error.request) {
        errorMessage = 'سرور سے رابطہ نہیں ہو سکا۔ براہ کرم بعد میں دوبارہ کوشش کریں۔';
      } else {
        errorMessage = 'تصدیقی کوڈ دوبارہ بھیجنے میں ناکامی: ' + error.message;
      }
      
      alert(errorMessage);
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
        <Text style={styles.title}>تصدیقی کوڈ کی تصدیق</Text>
        <Text style={styles.subtitle}>
          اپنے ای میل پر بھیجے گئے 6 ہندسوں کے تصدیقی کوڈ کو درج کریں
        </Text>

        <TextInput
          style={styles.input}
          placeholder="تصدیقی کوڈ درج کریں"
          value={otp}
          onChangeText={setOtp}
          keyboardType="number-pad"
          maxLength={6}
          editable={!loading}
          placeholderTextColor="#666"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerifyOTP}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>تصدیق کریں</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.resendButton}
          onPress={handleResendOTP}
          disabled={loading}
        >
          <Text style={styles.resendButtonText}>کوڈ دوبارہ بھیجیں</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>واپس جائیں</Text>
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
  resendButton: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  resendButtonText: {
    color: '#4DC6BB',
    fontSize: 16,
  },
  backButton: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  backButtonText: {
    color: '#4DC6BB',
    fontSize: 16,
  },
});

export default OTPVerificationScreen; 