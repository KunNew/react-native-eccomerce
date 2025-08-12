import ConfirmModal from "@/components/ConfirmModal";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { CartItem, useStore } from "@/store/useStore";
import React, { useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CartScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [clearAllModalVisible, setClearAllModalVisible] = useState(false);

  // Dynamic calculations for different device sizes
  const isSmallDevice = screenHeight < 700;
  const tabBarHeight =
    Platform.OS === "ios" ? (screenHeight > 800 ? 83 : 49) : 60;
  const checkoutSectionHeight = isSmallDevice ? 140 : 160;

  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useStore();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      const item = cartItems.find((item) => item.id === productId);
      if (item) {
        setItemToRemove(item);
        setModalVisible(true);
      }
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (item: CartItem) => {
    setItemToRemove(item);
    setModalVisible(true);
  };

  const confirmRemoveItem = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove.id);
      setModalVisible(false);
      setItemToRemove(null);
    }
  };

  const cancelRemoveItem = () => {
    setModalVisible(false);
    setItemToRemove(null);
  };

  const handleClearAll = () => {
    setClearAllModalVisible(true);
  };

  const confirmClearAll = () => {
    clearCart();
    setClearAllModalVisible(false);
  };

  const cancelClearAll = () => {
    setClearAllModalVisible(false);
  };

  const renderRightActions = (
    item: CartItem,
    progress: Animated.AnimatedAddition<number>,
    dragX: Animated.AnimatedAddition<number>
  ) => {
    const trans = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [0, 50, 100],
      extrapolate: "clamp",
    });

    const scale = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <View style={styles.rightActions}>
        <Animated.View
          style={[
            styles.deleteAction,
            { transform: [{ translateX: trans }, { scale }] },
          ]}
        >
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleRemoveItem(item)}
          >
            <IconSymbol name="trash" size={24} color="white" />
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    Alert.alert(
      "Checkout",
      `Total: $${getCartTotal().toFixed(2)}\n\nProceed to checkout?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Checkout",
          onPress: () => {
            Alert.alert("Success!", "Order placed successfully!");
            clearCart();
          },
        },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(item, progress, dragX)
      }
      rightThreshold={40}
    >
      <View
        style={[
          styles.cartItem,
          {
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor:
              colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
          },
        ]}
      >
        <Image source={{ uri: item.image }} style={styles.productImage} />

        <View style={styles.productInfo}>
          <Text
            style={[styles.productName, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.name}
          </Text>
          <Text style={[styles.productPrice, { color: colors.tint }]}>
            ${item.price}
          </Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={[
                styles.quantityButton,
                { backgroundColor: colors.text + "10" },
              ]}
              onPress={() => handleQuantityChange(item.id, item.quantity - 1)}
            >
              <IconSymbol name="minus" size={16} color={colors.text} />
            </TouchableOpacity>

            <Text style={[styles.quantity, { color: colors.text }]}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={[styles.quantityButton, { backgroundColor: colors.tint }]}
              onPress={() => handleQuantityChange(item.id, item.quantity + 1)}
            >
              <IconSymbol
                name="plus"
                size={16}
                color={colorScheme === "dark" ? colors.background : "white"}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.itemActions}>
          <Text style={[styles.itemTotal, { color: colors.text }]}>
            ${(item.price * item.quantity).toFixed(2)}
          </Text>
        </View>
      </View>
    </Swipeable>
  );

  const EmptyCart = () => (
    <View style={styles.emptyContainer}>
      <IconSymbol name="cart" size={64} color={colors.text + "40"} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        Your cart is empty
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.text + "60" }]}>
        Add some products to get started
      </Text>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, paddingTop: insets.top },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Shopping Cart
          </Text>
        </View>
        <EmptyCart />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Shopping Cart ({cartItems.length})
        </Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={[styles.clearButton, { color: "#FF6B6B" }]}>
            Clear All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cart Items */}
      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.cartList,
          {
            paddingBottom: checkoutSectionHeight + 20,
          },
        ]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />

      {/* Checkout Section */}
      <View
        style={[
          styles.checkoutSection,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.text + "20",
            paddingBottom: Platform.OS === "android" 
              ? Math.max(insets.bottom, 16)  // Minimum 16px padding on Android
              : insets.bottom,
            minHeight: checkoutSectionHeight,
            bottom: tabBarHeight,
            left: 0,
            right: 0,
          },
        ]}
      >
        <View style={styles.totalContainer}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text + "80" }]}>
              Subtotal (
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)
            </Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              ${getCartTotal().toFixed(2)}
            </Text>
          </View>

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: colors.text + "80" }]}>
              Shipping
            </Text>
            <Text style={[styles.totalValue, { color: colors.text }]}>
              Free
            </Text>
          </View>

          <View
            style={[
              styles.totalRow,
              styles.finalTotal,
              { borderTopColor: colors.text + "20" },
            ]}
          >
            <Text style={[styles.finalTotalLabel, { color: colors.text }]}>
              Total
            </Text>
            <Text style={[styles.finalTotalValue, { color: colors.tint }]}>
              ${getCartTotal().toFixed(2)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.checkoutButton,
            {
              backgroundColor: colors.tint,
              paddingVertical: isSmallDevice ? 12 : 16,
              marginHorizontal: screenWidth * 0.02, // 2% of screen width for side margins
            },
          ]}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.checkoutButtonText,
              {
                color: colorScheme === "dark" ? colors.background : "white",
                fontSize: isSmallDevice ? 15 : 16,
              },
            ]}
          >
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modals */}
      <ConfirmModal
        isVisible={modalVisible}
        title="Remove Item"
        message={`Are you sure you want to remove "${itemToRemove?.name}" from your cart?`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemoveItem}
        onCancel={cancelRemoveItem}
        type="danger"
      />

      <ConfirmModal
        isVisible={clearAllModalVisible}
        title="Clear Cart"
        message="Are you sure you want to remove all items from your cart? This action cannot be undone."
        confirmText="Clear All"
        cancelText="Cancel"
        onConfirm={confirmClearAll}
        onCancel={cancelClearAll}
        type="warning"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  clearButton: {
    fontSize: 14,
    fontWeight: "600",
  },
  cartList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: "row",
    padding: 16,
    paddingVertical: 20,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    resizeMode: "cover",
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 20,
    minWidth: 24,
    textAlign: "center",
  },
  itemActions: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginLeft: 16,
  },
  removeButton: {
    padding: 8,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  separator: {
    height: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  checkoutSection: {
    position: "absolute",
    borderTopWidth: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  totalContainer: {
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  finalTotal: {
    paddingTop: 8,
    borderTopWidth: 1,
    marginBottom: 0,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  checkoutButton: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48, // Minimum touch target size for accessibility
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rightActions: {
    alignItems: "center",
    justifyContent: "center",
    width: 100,
    backgroundColor: "#FF6B6B",
  },
  deleteAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: "100%",
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
});
