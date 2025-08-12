import { Tabs } from "expo-router";
import React from "react";
import { Easing, Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useStore } from "@/store/useStore";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const cartItemCount = useStore((state) => state.getCartItemCount());

  return (
    <Tabs
      screenOptions={{
        // Configure back behavior (optional)
        // backBehavior: 'history', // or 'initialRoute', 'order', etc.
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? "light"].tabIconDefault,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginTop: -2,
        },
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
            backgroundColor: "transparent",
            borderTopColor:
              colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            borderTopWidth: 0.5,
          },
          default: {
            backgroundColor: Colors[colorScheme ?? "light"].background,
            borderTopColor:
              colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            borderTopWidth: 0.5,
            elevation: colorScheme === "dark" ? 8 : 0,
            shadowOpacity: colorScheme === "dark" ? 0.3 : 0,
            shadowColor: colorScheme === "dark" ? "#000" : "transparent",
            shadowOffset: { width: 0, height: -2 },
            shadowRadius: 8,
          },
        }),
        sceneStyle: { backgroundColor: "transparent" },
        lazy: true,
        tabBarHideOnKeyboard: true,
        animation: "fade",
        // Optional: Add more sophisticated transition specs
        transitionSpec: {
          animation: "timing",
          config: {
            duration: 200,
            delay: 100,
            easing: Easing.ease,
          },
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categories",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="square.grid.2x2.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="cart.fill" color={color} />
          ),
          tabBarBadge: cartItemCount > 0 ? cartItemCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colorScheme === "dark" ? "#FF4757" : "#FF6B6B",
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: "600",
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 1,
            borderColor: Colors[colorScheme ?? "light"].background,
          },
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="heart.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
