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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <Image source={{ uri: article.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{article.title}</Text>
          <Text style={styles.content}>{fullContent}</Text>
        </View>

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
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  content: {
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