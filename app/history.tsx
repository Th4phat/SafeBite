import { FoodItem } from '@/constants/Struct';
import i18n from '@/languages/i18n';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { deleteAnalysisResult, getAnalysisHistory, PhotoAnalysisResult } from '../api/historyStorage';
import { FoodItemCard } from '../components/FoodItemCard';


interface HistoryItemProps {
  item: PhotoAnalysisResult;
  isExpanded: boolean;
  onToggle: () => void;
  onDelete: (itemId: string) => void;
}

const HistoryItem: React.FC<HistoryItemProps> = ({ item, isExpanded, onToggle, onDelete }) => {
  const toggleExpanded = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  const totalAllergens = item.analysisData.foods.reduce(
    (total, food) => total + food.allergens.length,
    0
  );

  return (
    <View style={styles.historyItem}>
      <TouchableOpacity onPress={toggleExpanded} style={styles.historyHeader}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.summaryDetails}>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleString()}
          </Text>
          <Text style={styles.foodCount}>
            {item.analysisData.foods.length} {i18n.t('history.foodItem', { count: item.analysisData.foods.length })} {i18n.t('history.analyzed')}
          </Text>
          {totalAllergens > 0 && (
            <View style={styles.allergenSummary}>
              <Ionicons name="warning" size={16} color="#FF6B6B" />
              <Text style={styles.allergenCount}>
                {totalAllergens} {i18n.t('history.potentialAllergen', { count: totalAllergens })} {i18n.t('history.found')}
              </Text>
            </View>
          )}
          <View style={styles.foodNamesList}>
            {item.analysisData.foods.slice(0, 3).map((food, index) => (
              <Text key={food.id} style={styles.foodNamePreview}>
                {food.name}{index < Math.min(2, item.analysisData.foods.length - 1) ? ', ' : ''}
              </Text>
            ))}
            {item.analysisData.foods.length > 3 && (
              <Text style={styles.moreText}>+{item.analysisData.foods.length - 3} {i18n.t('history.more')}</Text>
            )}
          </View>
        </View>
        <View style={styles.expandIcon}>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#666"
          />
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          {item.analysisData.foods.length > 0 ? (
            item.analysisData.foods.map((foodItem: FoodItem, index: number) => (
              <View key={foodItem.id} style={styles.foodItemWrapper}>
                <FoodItemCard item={foodItem} index={index} />
              </View>
            ))
          ) : (
            <Text style={styles.noFoodText}>{i18n.t('history.noFoodItems')}</Text>
          )}
          <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
            <Text style={styles.deleteButtonText}>{i18n.t('history.deleteItem')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default function HistoryScreen() {
  const [history, setHistory] = useState<PhotoAnalysisResult[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadHistory = async () => {
      const storedHistory = await getAnalysisHistory();
      setHistory(storedHistory);
    };
    loadHistory();
  }, []);

  const handleDeleteItem = async (itemId: string) => {
    await deleteAnalysisResult(itemId);
    setHistory(prevHistory => prevHistory.filter(item => item.id !== itemId));
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const renderItem = ({ item }: { item: PhotoAnalysisResult }) => (
    <HistoryItem
      item={item}
      isExpanded={expandedItems.has(item.id)}
      onToggle={() => toggleExpanded(item.id)}
      onDelete={handleDeleteItem}
    />
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: i18n.t('history.photoHistoryTitle') }} />
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="camera-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>{i18n.t('history.noHistory')}</Text>
          <Text style={styles.emptySubtext}>{i18n.t('history.emptySubtext')}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContent: {
    padding: 16,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  summaryDetails: {
    flex: 1,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontWeight: '500',
  },
  foodCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  allergenSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  allergenCount: {
    fontSize: 14,
    color: '#FF6B6B',
    marginLeft: 4,
    fontWeight: '500',
  },
  foodNamesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  foodNamePreview: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  moreText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  expandIcon: {
    marginLeft: 12,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    paddingVertical: 10,
    marginTop: 20,
    width: '100%',
  },
  deleteButtonText: {
    color: '#FF6B6B',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  foodItemWrapper: {
    marginTop: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
  noFoodText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 16,
    padding: 20,
  },
});