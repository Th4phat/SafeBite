import i18n from "@/languages/i18n";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { FC, useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View
} from "react-native";
import { FoodItem } from "../api/mockApi";

// Props for the FoodItemCard component
interface FoodItemCardProps {
  item: FoodItem;
  index: number;
}


const getAllergenColor = (allergenKey: string): string => {
  const allergenColors: { [key: string]: string } = {
    "Dairy": "#FF6B6B",
    "Egg": "#FFE66D",
    "Fish": "#4ECDC4",
    "Shellfish": "#45B7D1",
    "Nuts": "#F39C12",
    "Peanuts": "#E67E22",
    "Soy": "#9B59B6",
    "Gluten": "#E74C3C",
    "Wheat": "#D68910",
  };
  return allergenColors[allergenKey] || "#FF6B6B"; // Default color
};

const getAllergenIcon = (allergenKey: string): string => {
  const allergenIcons: { [key: string]: string } = {
    "Dairy": "water",
    "Egg": "egg",
    "Fish": "fish",
    "Shellfish": "fish",
    "Nuts": "leaf",
    "Peanuts": "leaf",
    "Soy": "leaf",
    "Gluten": "nutrition",
    "Wheat": "nutrition",
  };
  return allergenIcons[allergenKey] || "alert-circle";
};

const FoodItemCard: FC<FoodItemCardProps> = ({ item, index }) => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const slideAnimation = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const delay = index * 200;
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnimation, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);
  });

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnimation,
          transform: [{ translateY: slideAnimation }],
        },
      ]}
    >
      <LinearGradient
        colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.9)"]}
        style={styles.cardGradient}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.foodName}>{item.name}</Text>
          <View style={styles.foodIcon}>
            <Text style={styles.foodEmoji}>🍽️</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning" size={20} color="#FF6B6B" />
            <Text style={styles.sectionTitle}>{i18n.t('analysis.potentialAllergens')}</Text>
          </View>
          <View style={styles.allergensContainer}>
            {item.allergens.map((allergen, index) => (
              <View
                key={index}
                style={[
                  styles.allergenChip,
                  { backgroundColor: getAllergenColor(allergen) },
                ]}
              >
                <Ionicons
                  name={getAllergenIcon(allergen) as any}
                  size={16}
                  color="white"
                />
                <Text style={styles.allergenChipText}>{allergen}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={20} color="#4ECDC4" />
            <Text style={styles.sectionTitle}>{i18n.t('analysis.detectedIngredients')}</Text>
          </View>
          <View style={styles.ingredientsContainer}>
            {item.ingredients.map((ingredient, index) => (
              <View key={index} style={styles.ingredientChip}>
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  cardGradient: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingBottom: 15,
  },
  foodName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    flex: 1,
  },
  foodIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(102, 126, 234, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  foodEmoji: {
    fontSize: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  allergensContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  allergenChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  allergenChipText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  ingredientsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  ingredientChip: {
    backgroundColor: "rgba(78, 205, 196, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(78, 205, 196, 0.3)",
  },
  ingredientText: {
    color: "#4ECDC4",
    fontSize: 14,
    fontWeight: "500",
  },
});

export { FoodItemCard, FoodItemCardProps, getAllergenColor, getAllergenIcon, styles };
