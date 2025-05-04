import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


const AccountSettingsScreen = ({ navigation }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handlePasswordChange = () => {
    navigation.navigate('ChangePassword');
  };

  const handleAccountDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setShowDeleteModal(false);
    try {
      const deleteAccount = await api.post('/auth/delete-account',{
        email: await AsyncStorage.getItem('userEmail')});
      if (deleteAccount.status === 200) {
        // Successfully deleted account
        await AsyncStorage.clear(); // Clear all stored data
        alert('آپ کا اکاؤنٹ کامیابی سے حذف ہو گیا ہے');
        navigation.navigate('Auth');
      }
    } catch (error) {
      console.error('Account deletion error:', error);
      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert('اکاؤنٹ حذف کرنے میں مسئلہ آیا، دوبارہ کوشش کریں');
      }
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#006A71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>اکاؤنٹ سیٹنگز</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.optionItem}
          onPress={handlePasswordChange}
        >
          <View style={styles.optionContent}>
            <Ionicons name="log-out-outline" size={24} color="#333" />
            <Text style={styles.optionText}>پاسورڈ تبدیل کریں</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionItem, styles.deleteOption]}
          onPress={handleAccountDelete}
        >
          <View style={styles.optionContent}>
            <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            <Text style={[styles.optionText, styles.deleteText]}>اکاؤنٹ حذف کریں</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>اکاؤنٹ حذف کریں</Text>
            <Text style={styles.modalMessage}>
              کیا آپ واقعی اپنا اکاؤنٹ حذف کرنا چاہتے ہیں؟ یہ عمل واپس نہیں کیا جا سکتا۔
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelDelete}
              >
                <Text style={styles.modalButtonText}>منسوخ کریں</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmDelete}
              >
                <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>حذف کریں</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
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
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
    textAlign: 'right',
  },
  deleteOption: {
    marginTop: 20,
  },
  deleteText: {
    color: '#FF3B30',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006A71',
    marginBottom: 10,
    textAlign: 'right',
  },
  modalMessage: {
    fontSize: 16,
    color: '#006A71',
    marginBottom: 20,
    textAlign: 'right',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#e0e0e0',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  modalButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AccountSettingsScreen;
 