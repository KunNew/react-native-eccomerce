import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Product, useStore } from '@/store/useStore';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { productId } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const { 
    products, 
    addToCart, 
    addToFavorites, 
    removeFromFavorites, 
    isFavorite 
  } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId && products.length > 0) {
      const foundProduct = products.find(p => p.id === productId);
      setProduct(foundProduct || null);
    }
  }, [productId, products]);

  if (!product) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <IconSymbol name="chevron.left" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Product not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isProductFavorite = isFavorite(product.id);

  const handleToggleFavorite = () => {
    if (isProductFavorite) {
      removeFromFavorites(product.id);
      Toast.show({
        type: 'info',
        text1: 'Removed from Favorites',
        text2: `${product.name} removed from favorites`,
        position: 'bottom',
        bottomOffset: 120,
      });
    } else {
      addToFavorites(product);
      Toast.show({
        type: 'success',
        text1: 'Added to Favorites',
        text2: `${product.name} added to favorites`,
        position: 'bottom',
        bottomOffset: 120,
      });
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${quantity} ${product.name} added to your cart`,
      position: 'bottom',
      bottomOffset: 120,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/(tabs)/cart');
  };

  // Mock additional images for demonstration
  const productImages = [
    product.image,
    product.image,
    product.image,
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.left" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggleFavorite}>
          <IconSymbol
            name={isProductFavorite ? "heart.fill" : "heart"}
            size={24}
            color={isProductFavorite ? "#FF6B6B" : colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageSection}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {productImages.map((imageUri, index) => (
              <Image
                key={index}
                source={{ uri: imageUri }}
                style={styles.productImage}
              />
            ))}
          </ScrollView>
          
          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {productImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  {
                    backgroundColor: index === selectedImageIndex 
                      ? colors.tint 
                      : colors.text + '30'
                  }
                ]}
              />
            ))}
          </View>

          {/* Discount Badge */}
          {product.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{product.discount}%</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={[styles.productName, { color: colors.text }]}>
            {product.name}
          </Text>

          {/* Rating */}
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconSymbol
                  key={star}
                  name={star <= Math.floor(product.rating) ? "star.fill" : "star"}
                  size={16}
                  color="#FFD700"
                />
              ))}
              <Text style={[styles.ratingText, { color: colors.text }]}>
                {product.rating} ({product.reviews} reviews)
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.tint }]}>
              ${product.price}
            </Text>
            {product.originalPrice && (
              <Text style={[styles.originalPrice, { color: colors.text + '60' }]}>
                ${product.originalPrice}
              </Text>
            )}
          </View>

          {/* Description */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: colors.text + '80' }]}>
            {product.description}
          </Text>

          {/* Quantity Selector */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Quantity
          </Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: colors.text + '10' }]}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <IconSymbol name="minus" size={20} color={colors.text} />
            </TouchableOpacity>
            
            <Text style={[styles.quantity, { color: colors.text }]}>
              {quantity}
            </Text>
            
            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: colors.tint }]}
              onPress={() => setQuantity(quantity + 1)}
            >
              <IconSymbol name="plus" size={20} color={colorScheme === 'dark' ? colors.background : 'white'} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={[
        styles.bottomActions, 
        { 
          backgroundColor: colors.background, 
          borderTopColor: colors.text + '20',
          paddingBottom: Math.max(16, insets.bottom + 8)
        }
      ]}>
        <View style={styles.totalPrice}>
          <Text style={[styles.totalLabel, { color: colors.text + '60' }]}>
            Total Price
          </Text>
          <Text style={[styles.totalValue, { color: colors.tint }]}>
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.addToCartButton, { backgroundColor: colors.text + '10' }]}
            onPress={handleAddToCart}
          >
            <IconSymbol name="cart" size={20} color={colors.text} />
            <Text style={[styles.addToCartText, { color: colors.text }]}>
              Add to Cart
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.buyNowButton, { backgroundColor: colors.tint }]}
            onPress={handleBuyNow}
          >
            <Text style={[styles.buyNowText, { color: colorScheme === 'dark' ? colors.background : 'white' }]}>
              Buy Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  imageSection: {
    position: 'relative',
  },
  productImage: {
    width,
    height: width,
    resizeMode: 'cover',
  },
  imageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  ratingContainer: {
    marginBottom: 16,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 12,
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantity: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 24,
    minWidth: 40,
    textAlign: 'center',
  },
  bottomActions: {
    borderTopWidth: 1,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  totalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buyNowButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  buyNowText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
