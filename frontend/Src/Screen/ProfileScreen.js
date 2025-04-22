import React, { useState, useEffect } from 'react';
import {
  View,  
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    bio: '',
  });
  const [editedData, setEditedData] = useState({ ...userData });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const user = my_auth.currentUser;
      if (user) {
        const initialData = {
          name: user.displayName || 'صارف',
          email: user.email || '',
          bio: '',
        };
        
        setUserData(initialData);
        setEditedData(initialData);
        
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const firestoreData = userDoc.data();
          const updatedData = {
            ...initialData,
            name: firestoreData.name || initialData.name,
            bio: firestoreData.bio || '',
          };
          
          setUserData(updatedData);
          setEditedData(updatedData);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      alert('پروفائل ڈیٹا لوڈ کرنے میں ناکامی');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const user = my_auth.currentUser;
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          name: editedData.name,
          bio: editedData.bio,
        });
        
        setUserData(editedData);
        setIsEditing(false);
        alert('پروفائل کامیابی سے اپڈیٹ ہو گیا');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('پروفائل اپڈیٹ کرنے میں ناکامی');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    alert(
      'کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟',
      [
        {
          text: 'منسوخ کریں',
          style: 'cancel',
        },
        {
          text: 'لاگ آؤٹ',
          onPress: async () => {
            try {
              await signOut(my_auth);

              // After successful logout, reset the navigation stack to Login screen
              navigation.replace('Login');  // Replaces the current screen with Login
            } catch (error) {
              console.error('Error signing out:', error);
              alert('لاگ آؤٹ کرنے میں ناکامی');
            }
          },
        },
      ]
    );
  };

  if (loading && !isEditing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>پروفائل لوڈ ہو رہا ہے...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>پروفائل</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            if (isEditing) {
              setEditedData(userData); // Reset to original data
            }
            setIsEditing(!isEditing);
          }}
          disabled={loading}
        >
          <Text style={styles.editButtonText}>
            {isEditing ? 'منسوخ کریں' : 'ترمیم کریں'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/150' }}
              style={styles.avatar}
            />
            {isEditing && (
              <TouchableOpacity style={styles.changeAvatarButton}>
                <Ionicons name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.userName}>
            {isEditing ? (
              <TextInput
                style={styles.input}
                value={editedData.name}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, name: text })
                }
                placeholder="آپ کا نام"
              />
            ) : (
              userData.name
            )}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ذاتی معلومات</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>ای میل</Text>
            <Text style={styles.infoValue}>{userData.email}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>بائیو</Text>
            {isEditing ? (
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={editedData.bio}
                onChangeText={(text) =>
                  setEditedData({ ...editedData, bio: text })
                }
                placeholder="اپنے بارے میں بتائیں"
                multiline
                numberOfLines={3}
              />
            ) : (
              <Text style={styles.infoValue}>
                {userData.bio || 'ابھی تک کوئی بائیو شامل نہیں کیا گیا'}
              </Text>
            )}
          </View>
        </View>

        {isEditing && (
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSave}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.saveButtonText}>تبدیلیاں محفوظ کریں</Text>
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>لاگ آؤٹ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007AFF',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  infoItem: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#FF3B30',
  },
});

export default ProfileScreen;
