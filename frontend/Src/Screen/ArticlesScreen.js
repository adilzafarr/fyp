import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

const ArticlesScreen = ({ navigation }) => {
  // Sample articles data - replace with actual data from your backend
  const articles = [
    {
      id: '1',
      title: 'Understanding Anxiety',
      preview: 'Learn about the different types of anxiety and how to manage them effectively.',
      image: 'https://example.com/anxiety.jpg',
      mood: 'Calming',
    },
    {
      id: '2',
      title: 'Mindfulness Meditation',
      preview: 'Simple techniques to stay present and reduce stress in your daily life.',
      image: 'https://example.com/meditation.jpg',
      mood: 'Relaxing',
    },
    {
      id: '3',
      title: 'Building Healthy Habits',
      preview: 'Tips for developing and maintaining positive mental health habits.',
      image: 'https://example.com/habits.jpg',
      mood: 'Motivating',
    },
  ];

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => navigation.navigate('ArticleDetail', { article: item })}
    >
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articlePreview}>{item.preview}</Text>
        <View style={styles.articleFooter}>
          <Text style={styles.moodTag}>{item.mood}</Text>
          <Text style={styles.readMore}>Read More →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mental Health Articles</Text>
      </View>

      <FlatList
        data={articles}
        renderItem={renderArticle}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.articlesList}
      />
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
    marginTop: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 0,
  },
  content: {
    flex: 1,
    padding: 15,
    marginTop: 0,
    paddingTop: 0,
  },
  articlesList: {
    padding: 15,
  },
  articleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  articleContent: {
    padding: 15,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  articlePreview: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodTag: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#E8F2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  readMore: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default ArticlesScreen; 