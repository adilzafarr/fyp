import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ArticleDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { article } = route.params;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article Detail</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.articleContainer}>
          <Text style={styles.title}>{article.title}</Text>
          <View style={styles.metaInfo}>
            <Text style={styles.category}>{article.category}</Text>
            <Text style={styles.date}>{article.dateCreated}</Text>
          </View>
          <Text style={styles.author}>By {article.author}</Text>
          <Text style={styles.text}>{article.text}</Text>
          <Text style={styles.text}>{article.content}</Text>
        </View>

      </ScrollView>
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  articleContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  author: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'right',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'right',
  },
  relatedSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  relatedItem: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  relatedItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  relatedItemPreview: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ArticleDetailScreen; 