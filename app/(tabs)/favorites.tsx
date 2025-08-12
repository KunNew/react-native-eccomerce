import ProductCard from '@/components/ProductCard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';
import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { favorites, removeFromFavorites } = useStore();

  const renderProductCard = ({ item }: { item: any }) => (
    <ProductCard product={item} />
  );

  const EmptyFavorites = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="heart" size={64} color={colors.text + '40'} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No favorites yet
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.text + '60' }]}>
        Add products to your favorites to see them here
      </Text>
    </View>
  );

  const clearAllFavorites = () => {
    const count = favorites.length;
    favorites.forEach(product => removeFromFavorites(product.id));
    Toast.show({
      type: 'info',
      text1: 'Favorites Cleared',
      text2: `${count} items removed from favorites`,
      position: 'bottom',
      bottomOffset: 100,
    });
  };

  if (favorites.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Favorites
          </Text>
        </View>
        <View style={styles.emptyWrapper}>
          <EmptyFavorites />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Favorites ({favorites.length})
        </Text>
        <TouchableOpacity onPress={clearAllFavorites}>
          <Text style={[styles.clearButton, { color: '#FF6B6B' }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Favorites Grid */}
      <FlatList
        data={favorites}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.favoritesContainer, { paddingBottom: Math.max(80, insets.bottom + 60) }]}
        columnWrapperStyle={styles.productRow}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  favoritesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
});
