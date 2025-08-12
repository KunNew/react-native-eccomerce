import FilterModal, { FilterOptions } from '@/components/FilterModal';
import ProductCard from '@/components/ProductCard';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { categories, products } from '@/data/mockData';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CategoriesScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { 
    products: storeProducts, 
    categories: storeCategories,
    setProducts, 
    setCategories,
    getProductsByCategory 
  } = useStore();

  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isFilterModalVisible, setIsFilterModalVisible] = React.useState(false);
  const [isHorizontalLayout, setIsHorizontalLayout] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [filters, setFilters] = React.useState<FilterOptions>({
    sortBy: 'popular',
    priceRange: { min: 0, max: Infinity },
    minRating: 0,
  });

  const gridOpacity = useRef(new Animated.Value(1)).current;
  const horizontalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initialize store with mock data
    if (storeProducts.length === 0) {
      setProducts(products);
      setCategories(categories);
    }
  }, [setProducts, setCategories, storeProducts.length]);

  // Initialize opacity states based on layout
  useEffect(() => {
    gridOpacity.setValue(isHorizontalLayout ? 0 : 1);
    horizontalOpacity.setValue(isHorizontalLayout ? 1 : 0);
  }, []);

  const filteredProducts = React.useMemo(() => {
    let filtered = selectedCategory 
      ? getProductsByCategory(selectedCategory)
      : storeProducts;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Price range filter
    if (filters.priceRange.min > 0 || filters.priceRange.max < Infinity) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange.min && 
        product.price <= filters.priceRange.max
      );
    }

    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.minRating);
    }

    // Sort products
    const sortedProducts = [...filtered].sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          // Assuming newer products have higher IDs
          return b.id.localeCompare(a.id);
        case 'popular':
        default:
          // Sort by rating * reviews for popularity
          return (b.rating * b.reviews) - (a.rating * a.reviews);
      }
    });

    return sortedProducts;
  }, [selectedCategory, searchQuery, storeProducts, getProductsByCategory, filters]);

  const handleLayoutToggle = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    if (isHorizontalLayout) {
      // Switch from horizontal to grid
      Animated.parallel([
        Animated.timing(horizontalOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(gridOpacity, {
          toValue: 1,
          duration: 250,
          delay: 50,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsHorizontalLayout(false);
        setIsTransitioning(false);
      });
    } else {
      // Switch from grid to horizontal
      Animated.parallel([
        Animated.timing(gridOpacity, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(horizontalOpacity, {
          toValue: 1,
          duration: 250,
          delay: 50,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsHorizontalLayout(true);
        setIsTransitioning(false);
      });
    }
  };

  const renderGridProductCard = ({ item }: { item: any }) => (
    <ProductCard product={item} isHorizontalLayout={false} />
  );

  const renderHorizontalProductCard = ({ item }: { item: any }) => (
    <ProductCard product={item} isHorizontalLayout={true} />
  );

  const renderCategoryCard = ({ item }: { item: any }) => {
    const isSelected = selectedCategory === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.categoryChip,
          { 
            backgroundColor: isSelected ? colors.tint : colors.text + '10',
            borderColor: isSelected ? colors.tint : 'transparent'
          }
        ]}
        onPress={() => setSelectedCategory(isSelected ? null : item.id)}
      >
        <Text
          style={[
            styles.categoryChipText,
            { color: isSelected ? (colorScheme === 'dark' ? colors.background : 'white') : colors.text }
          ]}
        >
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Categories
        </Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={[
              styles.layoutButton,
              { opacity: isTransitioning ? 0.5 : 1 }
            ]}
            onPress={handleLayoutToggle}
            disabled={isTransitioning}
          >
            <IconSymbol 
              name={isHorizontalLayout ? "rectangle.grid.1x2" : "square.grid.2x2"} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <IconSymbol name="slider.horizontal.3" size={24} color={colors.text} />
            {(filters.sortBy !== 'popular' || filters.minRating > 0 || filters.priceRange.min > 0 || filters.priceRange.max < Infinity) && (
              <View style={[styles.filterBadge, { backgroundColor: colors.tint }]}>
                <View style={[styles.filterDot, { backgroundColor: colorScheme === 'dark' ? colors.background : 'white' }]} />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.text + '10' }]}>
        <IconSymbol name="magnifyingglass" size={20} color={colors.text + '60'} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search in categories..."
          placeholderTextColor={colors.text + '60'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <IconSymbol name="xmark.circle.fill" size={20} color={colors.text + '60'} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
      <View style={styles.categoryFilters}>
        <TouchableOpacity
          style={[
            styles.categoryChip,
            { 
              backgroundColor: !selectedCategory ? colors.tint : colors.text + '10',
              borderColor: !selectedCategory ? colors.tint : 'transparent'
            }
          ]}
          onPress={() => setSelectedCategory(null)}
        >
          <Text
            style={[
              styles.categoryChipText,
              { color: !selectedCategory ? (colorScheme === 'dark' ? colors.background : 'white') : colors.text }
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        <FlatList
          data={storeCategories}
          renderItem={renderCategoryCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Products Grid */}
      <View style={styles.productsGridContainer}>
        {/* Grid Layout */}
        <Animated.View 
          style={[
            styles.flatListContainer,
            { 
              opacity: gridOpacity,
              transform: [{ 
                scale: gridOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1]
                })
              }]
            }
          ]}
          pointerEvents={isHorizontalLayout ? 'none' : 'auto'}
        >
          <FlatList
            data={filteredProducts}
            renderItem={renderGridProductCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.productsContainer, { paddingBottom: Math.max(80, insets.bottom + 60) }]}
            columnWrapperStyle={styles.productRow}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <IconSymbol name="magnifyingglass" size={48} color={colors.text + '40'} />
                <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
                  No products found
                </Text>
              </View>
            }
          />
        </Animated.View>

        {/* Horizontal Layout */}
        <Animated.View 
          style={[
            styles.flatListContainer,
            { 
              opacity: horizontalOpacity,
              transform: [{ 
                scale: horizontalOpacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.95, 1]
                })
              }]
            }
          ]}
          pointerEvents={!isHorizontalLayout ? 'none' : 'auto'}
        >
          <FlatList
            data={filteredProducts}
            renderItem={renderHorizontalProductCard}
            keyExtractor={(item) => item.id}
            numColumns={1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.productsContainer, { paddingBottom: Math.max(80, insets.bottom + 60) }]}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <IconSymbol name="magnifyingglass" size={48} color={colors.text + '40'} />
                <Text style={[styles.emptyText, { color: colors.text + '60' }]}>
                  No products found
                </Text>
              </View>
            }
          />
        </Animated.View>
      </View>

      {/* Filter Modal */}
      <FilterModal
        isVisible={isFilterModalVisible}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={(newFilters) => setFilters(newFilters)}
        currentFilters={filters}
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  layoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  categoryFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 20,
  },
  categoryList: {
    paddingLeft: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  productsGridContainer: {
    flex: 1,
    position: 'relative',
  },
  flatListContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  productsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});
