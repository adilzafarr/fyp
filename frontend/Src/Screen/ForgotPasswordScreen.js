import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    // Validate email
    if (!email || email.trim() === '') {
      alert("براہ کرم اپنا ای میل ایڈریس درج کریں");
      return;
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("براہ کرم درست ای میل ایڈریس درج کریں");
      return;
    }

    setLoading(true);

    try {
      // Send reset email
      await sendPasswordResetEmail(my_auth, email.trim());
      
      // Show success message
      alert("پاس ورڈ ری سیٹ کرنے والی ای میل بھیج دی گئی ہے۔ براہ کرم اپنی ای میل ان باکس اور اسپیم فولڈر چیک کریں۔");
      setEmail(''); // Clear the email field
      navigation.navigate('Login');
      
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = '';
      
      // Handle specific error cases
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'ای میل ایڈریس کا فارمیٹ غلط ہے';
          break;
        case 'auth/user-not-found':
          errorMessage = 'اس ای میل کے ساتھ کوئی اکاؤنٹ موجود نہیں ہے';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'کوششیں بہت زیادہ ہو گئی ہیں۔ براہ کرم کچھ دیر بعد دوبارہ کوشش کریں';
          break;
        default:
          errorMessage = 'ری سیٹ ای میل بھیجنے میں ناکامی۔ براہ کرم دوبارہ کوشش کریں';
      }
      
      alert(errorMessage);
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
