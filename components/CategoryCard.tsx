import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Category } from '@/store/useStore';
import React from 'react';
import {
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = 120;

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
}

export default function CategoryCard({ category, onPress }: CategoryCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[
        styles.container, 
        { backgroundColor: colors.background },
        Platform.OS === 'android' && { 
          borderWidth: 1, 
          borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: category.image }} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text
          style={[styles.categoryName, { color: colors.text }]}
          numberOfLines={1}
        >
          {category.name}
        </Text>
        <Text style={[styles.productCount, { color: colors.text + '80' }]}>
          {category.productCount} items
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    borderRadius: 12,
    marginRight: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        // No shadow, border will be added dynamically
      },
    }),
  },
  imageContainer: {
    width: '100%',
    height: 80,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 12,
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  productCount: {
    fontSize: 12,
    textAlign: 'center',
  },
});
