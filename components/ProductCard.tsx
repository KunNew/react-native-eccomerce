import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Product, useStore } from '@/store/useStore';
import { router } from 'expo-router';
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
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 48 for margins and gap

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
  isHorizontalLayout?: boolean;
}

export default function ProductCard({ product, onPress, isHorizontalLayout = false }: ProductCardProps) {
  const colorScheme = useColorScheme();
  const { addToCart, addToFavorites, removeFromFavorites, isFavorite } = useStore();
  const isProductFavorite = isFavorite(product.id);
  const colors = Colors[colorScheme ?? 'light'];

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: '/product-detail',
        params: { productId: product.id }
      });
    }
  };

  const handleAddToCart = (e: any) => {
    e.stopPropagation();
    addToCart(product);
    Toast.show({
      type: 'success',
      text1: 'Added to Cart',
      text2: `${product.name} added to your cart`,
      position: 'bottom',
      bottomOffset: 100,
    });
  };

  const handleToggleFavorite = (e: any) => {
    e.stopPropagation();
    if (isProductFavorite) {
      removeFromFavorites(product.id);
      Toast.show({
        type: 'info',
        text1: 'Removed from Favorites',
        text2: `${product.name} removed from favorites`,
        position: 'bottom',
        bottomOffset: 100,
      });
    } else {
      addToFavorites(product);
      Toast.show({
        type: 'success',
        text1: 'Added to Favorites',
        text2: `${product.name} added to favorites`,
        position: 'bottom',
        bottomOffset: 100,
      });
    }
  };

  if (isHorizontalLayout) {
    return (
      <TouchableOpacity
        style={[
          styles.horizontalContainer,
          { backgroundColor: colors.background },
          Platform.OS === 'android' && { 
            borderWidth: 1, 
            borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
          }
        ]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.horizontalImageContainer}>
          <Image source={{ uri: product.image }} style={styles.horizontalImage} />
          {product.discount && (
            <View style={styles.horizontalDiscountBadge}>
              <Text style={styles.discountText}>-{product.discount}%</Text>
            </View>
          )}
        </View>

        <View style={styles.horizontalContent}>
          <View style={styles.horizontalContentTop}>
            <Text
              style={[styles.horizontalProductName, { color: colors.text }]}
              numberOfLines={2}
            >
              {product.name}
            </Text>
            
            <TouchableOpacity
              style={[
                styles.horizontalFavoriteButton, 
                { backgroundColor: colors.background },
                Platform.OS === 'android' && { 
                  borderWidth: 1, 
                  borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
                }
              ]}
              onPress={handleToggleFavorite}
            >
              <IconSymbol
                name={isProductFavorite ? "heart.fill" : "heart"}
                size={20}
                color={isProductFavorite ? "#FF6B6B" : colors.text}
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.ratingContainer}>
            <IconSymbol name="star.fill" size={14} color="#FFD700" />
            <Text style={[styles.horizontalRating, { color: colors.text }]}>
              {product.rating}
            </Text>
            <Text style={[styles.horizontalReviews, { color: colors.text + '80' }]}>
              ({product.reviews})
            </Text>
          </View>

          <View style={styles.horizontalBottom}>
            <View style={styles.priceContainer}>
              <Text style={[styles.horizontalPrice, { color: colors.tint }]}>
                ${product.price}
              </Text>
              {product.originalPrice && (
                <Text style={[styles.horizontalOriginalPrice, { color: colors.text + '60' }]}>
                  ${product.originalPrice}
                </Text>
              )}
            </View>

            <TouchableOpacity
              style={[styles.horizontalAddButton, { backgroundColor: colors.tint }]}
              onPress={handleAddToCart}
            >
              <IconSymbol name="plus" size={16} color={colorScheme === 'dark' ? colors.background : 'white'} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

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
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <TouchableOpacity
          style={[
            styles.favoriteButton, 
            { backgroundColor: colors.background },
            Platform.OS === 'android' && { 
              borderWidth: 1, 
              borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
            }
          ]}
          onPress={handleToggleFavorite}
        >
          <IconSymbol
            name={isProductFavorite ? "heart.fill" : "heart"}
            size={24}
            color={isProductFavorite ? "#FF6B6B" : colors.text}
          />
        </TouchableOpacity>
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.productName, { color: colors.text }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        
        <View style={styles.ratingContainer}>
          <IconSymbol name="star.fill" size={16} color="#FFD700" />
          <Text style={[styles.rating, { color: colors.text }]}>
            {product.rating}
          </Text>
          <Text style={[styles.reviews, { color: colors.text + '80' }]}>
            ({product.reviews})
          </Text>
        </View>

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

        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.tint }]}
          onPress={handleAddToCart}
        >
          <IconSymbol name="plus" size={18} color={colorScheme === 'dark' ? colors.background : 'white'} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    borderRadius: 12,
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
    position: 'relative',
    width: '100%',
    height: cardWidth * 0.8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        // No shadow, border will be added dynamically
      },
    }),
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    padding: 12,
    position: 'relative',
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  reviews: {
    fontSize: 10,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  addButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Horizontal layout styles
  horizontalContainer: {
    width: width - 40, // Full width minus padding
    height: 120,
    flexDirection: 'row',
    borderRadius: 12,
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
  horizontalImageContainer: {
    width: 120,
    height: '100%',
    position: 'relative',
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  horizontalDiscountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  horizontalContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  horizontalContentTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  horizontalProductName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
    lineHeight: 20,
  },
  horizontalFavoriteButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        // No shadow, border will be added dynamically
      },
    }),
  },
  horizontalRating: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  horizontalReviews: {
    fontSize: 10,
    marginLeft: 4,
  },
  horizontalBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  horizontalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  horizontalOriginalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  horizontalAddButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
