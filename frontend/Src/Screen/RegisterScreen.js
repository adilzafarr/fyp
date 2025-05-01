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

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert('براہ کرم تمام فیلڈز بھریں');
      return;
    }
  
    if (!validateEmail(email)) {
      alert('براہ کرم درست ای میل ایڈریس درج کریں');
      return;
    }
  
    if (password.length < 6) {
      alert('پاس ورڈ کم از کم 6 حروف کا ہونا چاہیے');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('پاس ورڈز مماثل نہیں ہیں');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await api.post('/auth/signup', { email, password, name });
      const data = response.data;
      alert('اکاؤنٹ کامیابی سے بن گیا!');
      console.log("check");
      navigation.replace('Login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('سرور سے کنکشن نہیں ہو سکا۔ دوبارہ کوشش کریں');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>رجسٹر کریں</Text>

        <TextInput
          style={styles.input}
          placeholder="پورا نام"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          editable={!loading}
          placeholderTextColor="#666666"
        />

        <TextInput
          style={styles.input}
          placeholder="ای میل"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
          placeholderTextColor="#666666"
        />

        <TextInput
          style={styles.input}
          placeholder="پاس ورڈ"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
          placeholderTextColor="#666666"
        />

        <TextInput
          style={styles.input}
          placeholder="پاس ورڈ کی تصدیق کریں"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          editable={!loading}
          placeholderTextColor="#666666"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>رجسٹر کریں</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
          disabled={loading}
        >
          <Text style={styles.loginText}>
            پہلے سے اکاؤنٹ ہے؟ <Text style={styles.loginTextBold}>لاگ ان</Text>
          </Text>
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333333',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4DC6BB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#A5E4DE',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
  },
  loginText: {
    color: '#666666',
    fontSize: 14,
  },
  loginTextBold: {
    color: '#4DC6BB',
    fontWeight: '600',
  },
});

export default RegisterScreen;
