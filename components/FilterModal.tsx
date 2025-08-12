import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { useRef, useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Modal from "react-native-modal";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height: screenHeight } = Dimensions.get("window");

export interface FilterOptions {
  sortBy: "popular" | "price-low" | "price-high" | "newest" | "rating";
  priceRange: { min: number; max: number };
  minRating: number;
}

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

const SORT_OPTIONS = [
  {
    id: "popular",
    label: "Most Popular",
    icon: "heart.fill",
  },
  {
    id: "price-low",
    label: "Price: Low to High",
    icon: "arrow.up",
  },
  {
    id: "price-high",
    label: "Price: High to Low",
    icon: "arrow.down",
  },
  {
    id: "newest",
    label: "Newest First",
    icon: "sparkles",
  },
  {
    id: "rating",
    label: "Highest Rated",
    icon: "star.fill",
  },
] as const;

const PRICE_RANGES = [
  { min: 0, max: 50, label: "Under $50" },
  { min: 50, max: 100, label: "$50 - $100" },
  { min: 100, max: 200, label: "$100 - $200" },
  { min: 200, max: 500, label: "$200 - $500" },
  { min: 500, max: Infinity, label: "$500+" },
];

const RATING_OPTIONS = [1, 2, 3, 4, 5];

export default function FilterModal({
  isVisible,
  onClose,
  onApply,
  currentFilters,
}: FilterModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();

  const [tempFilters, setTempFilters] = useState<FilterOptions>(currentFilters);
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleApply = () => {
    onApply(tempFilters);
    onClose();
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      sortBy: "popular",
      priceRange: { min: 0, max: Infinity },
      minRating: 0,
    };
    setTempFilters(defaultFilters);
  };

  const handleScrollTo = (p: {
    x?: number;
    y?: number;
    animated?: boolean;
  }) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo(p);
    }
  };

  const renderSortOptions = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Sort By</Text>
      {SORT_OPTIONS.map((option) => {
        const isSelected = tempFilters.sortBy === option.id;
        return (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionRow,
              {
                backgroundColor: isSelected
                  ? colorScheme === "dark"
                    ? colors.tint + "20"
                    : colors.tint + "15"
                  : colorScheme === "dark"
                  ? "rgba(255, 255, 255, 0.03)"
                  : "transparent",
              },
            ]}
            onPress={() =>
              setTempFilters((prev) => ({
                ...prev,
                sortBy: option.id,
              }))
            }
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isSelected
                      ? colors.tint
                      : colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : colors.text + "10",
                  },
                ]}
              >
                <IconSymbol
                  name={option.icon}
                  size={16}
                  color={
                    isSelected
                      ? colorScheme === "dark"
                        ? colors.background
                        : "white"
                      : colors.text + "80"
                  }
                />
              </View>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? colors.tint : colors.text,
                    fontWeight: isSelected ? "600" : "400",
                  },
                ]}
              >
                {option.label}
              </Text>
            </View>
            {isSelected && (
              <IconSymbol name="checkmark" size={20} color={colors.tint} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderPriceRange = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Price Range
      </Text>
      {PRICE_RANGES.map((range, index) => {
        const isSelected =
          tempFilters.priceRange.min === range.min &&
          tempFilters.priceRange.max === range.max;
        return (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionRow,
              {
                backgroundColor: isSelected
                  ? colorScheme === "dark"
                    ? colors.tint + "20"
                    : colors.tint + "15"
                  : colorScheme === "dark"
                  ? "rgba(255, 255, 255, 0.03)"
                  : "transparent",
              },
            ]}
            onPress={() =>
              setTempFilters((prev) => ({
                ...prev,
                priceRange: { min: range.min, max: range.max },
              }))
            }
          >
            <View style={styles.optionLeft}>
              <View
                style={[
                  styles.priceTag,
                  {
                    backgroundColor: isSelected
                      ? colors.tint
                      : colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : colors.text + "10",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.priceTagText,
                    {
                      color: isSelected
                        ? colorScheme === "dark"
                          ? colors.background
                          : "white"
                        : colors.text + "80",
                    },
                  ]}
                >
                  $
                </Text>
              </View>
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? colors.tint : colors.text,
                    fontWeight: isSelected ? "600" : "400",
                  },
                ]}
              >
                {range.label}
              </Text>
            </View>
            {isSelected && (
              <IconSymbol name="checkmark" size={20} color={colors.tint} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderRatingFilter = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Minimum Rating
      </Text>
      <View style={styles.ratingContainer}>
        {RATING_OPTIONS.map((rating) => {
          const isSelected = tempFilters.minRating >= rating;
          return (
            <TouchableOpacity
              key={rating}
              style={[
                styles.ratingOption,
                {
                  backgroundColor:
                    tempFilters.minRating === rating
                      ? colorScheme === "dark"
                        ? colors.tint + "20"
                        : colors.tint + "15"
                      : colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.03)"
                      : "transparent",
                  borderColor:
                    tempFilters.minRating === rating
                      ? colors.tint
                      : colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.15)"
                      : colors.text + "20",
                },
              ]}
              onPress={() =>
                setTempFilters((prev) => ({
                  ...prev,
                  minRating: prev.minRating === rating ? 0 : rating,
                }))
              }
            >
              <IconSymbol
                name="star.fill"
                size={16}
                color={
                  isSelected
                    ? colorScheme === "dark"
                      ? "#FFCC00"
                      : "#FFD700"
                    : colorScheme === "dark"
                    ? colors.text + "40"
                    : colors.text + "30"
                }
              />
              <Text
                style={[
                  styles.ratingText,
                  {
                    color:
                      tempFilters.minRating === rating
                        ? colors.tint
                        : colors.text,
                    fontWeight:
                      tempFilters.minRating === rating ? "600" : "400",
                  },
                ]}
              >
                {rating}+
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      swipeThreshold={100}
      style={styles.modal}
      backdropColor={
        colorScheme === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)"
      }
      animationIn="slideInUp"
      animationOut="slideOutDown"
      useNativeDriver={false} // Better for scrollable content
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true} // Performance enhancement
      propagateSwipe={true}
      scrollTo={handleScrollTo}
      scrollOffset={scrollOffset}
      scrollOffsetMax={200}
      avoidKeyboard={false}
    >
      <View
        style={[
          styles.modalContent,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        {/* Handle Bar */}
        <TouchableOpacity
          style={styles.handleContainer}
          activeOpacity={1}
          onPress={() => {}} // Prevent accidental close on tap
        >
          <View
            style={[
              styles.handle,
              {
                backgroundColor:
                  colorScheme === "dark"
                    ? "rgba(255, 255, 255, 0.3)"
                    : colors.text + "40",
              },
            ]}
          />
        </TouchableOpacity>

        {/* Header */}
        <View
          style={[
            styles.header,
            {
              borderBottomColor:
                colorScheme === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.05)",
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            Filter & Sort
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <IconSymbol name="xmark" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          bounces={true} // Allow natural bounce behavior
          alwaysBounceVertical={true}
          keyboardShouldPersistTaps="handled"
          onScroll={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            setScrollOffset(offsetY);
          }}
          scrollEventThrottle={1} // Smoother scroll tracking
          nestedScrollEnabled={true}
          decelerationRate="normal"
          overScrollMode="auto" // Android smooth overscroll
        >
          {renderSortOptions()}
          {renderPriceRange()}
          {renderRatingFilter()}
        </ScrollView>

        {/* Footer */}
        <View
          style={[
            styles.footer,
            {
              borderTopColor:
                colorScheme === "dark"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.1)",
              backgroundColor: colors.background,
              paddingBottom: Math.max(insets.bottom, 20),
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.resetButton,
              {
                borderColor:
                  colorScheme === "dark"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.2)",
                backgroundColor:
                  colorScheme === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.02)",
              },
            ]}
            onPress={handleReset}
          >
            <IconSymbol name="arrow.clockwise" size={16} color={colors.text} />
            <Text style={[styles.resetButtonText, { color: colors.text }]}>
              Reset
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.applyButton, { backgroundColor: colors.tint }]}
            onPress={handleApply}
          >
            <Text
              style={[
                styles.applyButtonText,
                { color: colorScheme === "dark" ? colors.background : "white" },
              ]}
            >
              Apply Filters
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight * 0.85,
    maxHeight: screenHeight * 0.85,
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexShrink: 0,
  },
  handle: {
    width: 50,
    height: 5,
    borderRadius: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    flexShrink: 0,
    // borderBottomColor is set dynamically in component
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    flexGrow: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  priceTag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  priceTagText: {
    fontSize: 14,
    fontWeight: "600",
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  ratingOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 60,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 4,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    borderTopWidth: 1,
    gap: 12,
    flexShrink: 0,
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 12,
    gap: 6,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  applyButton: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
