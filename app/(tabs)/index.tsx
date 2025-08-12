import CategoryCard from "@/components/CategoryCard";
import NotificationDrawer, { NotificationDrawerHandle } from "@/components/NotificationDrawer";
import ProductCard from "@/components/ProductCard";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { categories, products } from "@/data/mockData";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useStore } from "@/store/useStore";
import React, { useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const notificationDrawerRef = useRef<NotificationDrawerHandle>(null);
  const {
    products: storeProducts,
    categories: storeCategories,
    setProducts,
    setCategories,
  } = useStore();

  useEffect(() => {
    // Initialize store with mock data
    setProducts(products);
    setCategories(categories);
  }, [setProducts, setCategories]);

  const featuredProducts = storeProducts.slice(0, 8);
  const onSaleProducts = storeProducts.filter((p) => p.discount);

  const renderProductCard = ({ item }: { item: any }) => (
    <ProductCard product={item} />
  );

  const renderCategoryCard = ({ item }: { item: any }) => (
    <CategoryCard
      category={item}
      onPress={() => {
        // Navigate to category screen
        console.log("Navigate to category:", item.name);
      }}
    />
  );

  return (
    <NotificationDrawer ref={notificationDrawerRef}>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />

      {/* Fixed Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.text + "80" }]}>
            Good morning
          </Text>
          <Text style={[styles.userName, { color: colors.text }]}>
            Welcome to Shop!
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => notificationDrawerRef.current?.openDrawer()}
        >
          <IconSymbol name="bell" size={24} color={colors.text} />
          <View style={[
            styles.notificationBadge, 
            { 
              backgroundColor: colors.tint,
              borderColor: colors.background // Dynamic border for dark mode
            }
          ]}>
            <Text style={[
              styles.badgeText, 
              { color: colorScheme === "dark" ? colors.background : "white" }
            ]}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Fixed Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.text + "10" },
        ]}
      >
        <IconSymbol
          name="magnifyingglass"
          size={20}
          color={colors.text + "60"}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search products..."
          placeholderTextColor={colors.text + "60"}
        />
      </View>

      <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(80, insets.bottom + 60) },
          ]}
        >
          {/* Categories Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Categories
              </Text>
              <TouchableOpacity>
                <Text style={[styles.seeAll, { color: colors.tint }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={storeCategories}
              renderItem={renderCategoryCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          {/* Featured Products */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Featured Products
              </Text>
              <TouchableOpacity>
                <Text style={[styles.seeAll, { color: colors.tint }]}>
                  View More
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.productsGrid}>
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </View>
          </View>

          {/* On Sale Products */}
          {onSaleProducts.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  🔥 On Sale
                </Text>
                <TouchableOpacity>
                  <Text style={[styles.seeAll, { color: colors.tint }]}>
                    View More
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={onSaleProducts}
                renderItem={renderProductCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
                ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
              />
            </View>
          )}
        </ScrollView>
      </Animated.View>
      </SafeAreaView>
    </NotificationDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  greeting: {
    fontSize: 14,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
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
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    fontSize: 14,
    fontWeight: "600",
  },
  horizontalList: {
    paddingLeft: 20,
    paddingRight: 4,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
});
