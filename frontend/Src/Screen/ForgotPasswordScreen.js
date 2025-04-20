import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('خرابی', 'براہ کرم اپنا ای میل ایڈریس درج کریں');
      return;
    }

    // TODO: Implement actual password reset logic
    Alert.alert(
      'کامیابی',
      'پاس ورڈ ری سیٹ کرنے کی ہدایات آپ کے ای میل پر بھیج دی گئی ہیں',
      [
        {
          text: 'ٹھیک ہے',
          onPress: () => navigation.navigate('Login'),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>کوئی بات نہیں،</Text>
        <Text style={styles.subtitle}>
          ہم آپ کی مدد کریں گے۔
          براہِ کرم اپنا ای میل درج کریں تاکہ
          ہم آپ کو پاس ورڈ ری سیٹ کرنے
          کا لنک بھیج سکیں۔
        </Text>

        <TextInput
          style={styles.input}
          placeholder="ای میل"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#666666"
        />

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>ری سیٹ لنک بھیجیں</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4DC6BB',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4DC6BB',
    fontSize: 16,
  },
});

export default ForgotPasswordScreen; 