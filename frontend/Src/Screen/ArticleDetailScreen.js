import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ArticleDetailScreen = ({ route, navigation }) => {
  const { article } = route.params;

  // Sample full article content - replace with actual content from your backend
  const fullContent = `
    ${article.title}

    Introduction:
    Mental health is an essential part of our overall well-being. Taking care of your mental health is just as important as taking care of your physical health.

    Main Content:
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.

    Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget aliquam nisl nisl sit amet nisl.

    Conclusion:
    Taking care of your mental health is an ongoing process. By implementing these strategies, you can improve your overall well-being and lead a more balanced life.
  `;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.articleHeader}>
          <Text style={styles.articleTitle}>{article.title}</Text>
          <View style={styles.articleMeta}>
            <View
              style={[
                styles.moodTag,
                { backgroundColor: '#E8F2FF' },
              ]}
            >
              <Text style={[styles.moodTagText, { color: '#007AFF' }]}>
                {article.mood}
              </Text>
            </View>
            <Text style={styles.dateText}>March 18, 2024</Text>
          </View>
        </View>

        <Text style={styles.articleContent}>{fullContent}</Text>

        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Articles</Text>
          <TouchableOpacity style={styles.relatedItem}>
            <Text style={styles.relatedItemTitle}>
              Understanding Depression
            </Text>
            <Text style={styles.relatedItemPreview}>
              Learn about the signs and symptoms of depression and how to seek help.
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.relatedItem}>
            <Text style={styles.relatedItemTitle}>
              Stress Management Techniques
            </Text>
            <Text style={styles.relatedItemPreview}>
              Effective strategies to reduce stress in your daily life.
            </Text>
          </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 34,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  articleHeader: {
    marginBottom: 20,
  },
  articleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  moodTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  articleContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 30,
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