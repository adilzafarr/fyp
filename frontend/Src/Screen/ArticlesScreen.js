import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  ScrollView,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import articlesData from '../../Data/Articles/articles.json';

const ArticlesScreen = () => {
  const navigation = useNavigation();
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    setArticles(articlesData.articles);
  }, []);

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  const getFilteredAndSortedArticles = () => {
    let filteredData = articles;
    
    if (selectedCategories.length > 0) {
      filteredData = articles.filter(article => 
        selectedCategories.includes(article.category)
      );
    }

    filteredData.sort((a, b) => {
      const dateA = new Date(a.dateCreated);
      const dateB = new Date(b.dateCreated);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filteredData;
  };

  const renderArticle = ({ item }) => (
    <TouchableOpacity
      style={styles.articleCard}
      onPress={() => navigation.navigate('ArticleDetail', { article: item })}
    >
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle}>{item.title}</Text>
        <Text style={styles.articlePreview}>{item.preview}</Text>
        <View style={styles.articleFooter}>
          <Text style={styles.moodTag}>{item.category}</Text>
          <Text style={styles.readMore}>Read More →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const allCategories = [...new Set(articles.map(article => article.category))];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilterModal(true)}
          >
            <Text style={styles.filterButtonText}>Filter</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>مضامین</Text>
      </View>

      <FlatList
        data={getFilteredAndSortedArticles()}
        renderItem={renderArticle}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.articlesList}
      />

      <Modal
        visible={showFilterModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Category</Text>
            <ScrollView style={styles.categoryList}>
              {allCategories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryItem,
                    selectedCategories.includes(category) && styles.selectedCategory
                  ]}
                  onPress={() => toggleCategory(category)}
                >
                  <Text style={[
                    styles.categoryItemText,
                    selectedCategories.includes(category) && styles.selectedCategoryText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    paddingTop: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginTop: 0,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006A71',
    marginTop: 0,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  filterButton: {
    backgroundColor: '#006A71',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  sortButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  articlesList: {
    padding: 15,
  },
  articleCard: {
    backgroundColor: '#F5FBFB',
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
    color: '#006A71',
    marginBottom: 8,
    textAlign: 'right',
  },
  articlePreview: {
    fontSize: 14,
    color: '#006A71',
    marginBottom: 12,
    lineHeight: 20,
    textAlign: 'right',
  },
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodTag: {
    fontSize: 12,
    color: '#F2EFE7',
    backgroundColor: '#006A71',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  readMore: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  modalContainer: {
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
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  categoryList: {
    maxHeight: 300,
  },
  categoryItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default ArticlesScreen; 