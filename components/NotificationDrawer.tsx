import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Drawer } from "react-native-drawer-layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NotificationItem, { Notification } from "./NotificationItem";

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Order Confirmed",
    message: "Your order #12345 has been confirmed and is being prepared.",
    type: "order",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    read: false,
  },
  {
    id: "2",
    title: "Special Offer",
    message: "Get 20% off on all electronics! Limited time offer.",
    type: "info",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
  },
  {
    id: "3",
    title: "Order Delivered",
    message: "Your order #12344 has been successfully delivered.",
    type: "success",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
  },
  {
    id: "4",
    title: "Payment Failed",
    message: "Payment for order #12346 failed. Please update your payment method.",
    type: "error",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: false,
  },
  {
    id: "5",
    title: "Stock Alert",
    message: "Item in your wishlist is running low on stock. Order now!",
    type: "warning",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
  },
];

export interface NotificationDrawerHandle {
  openDrawer: () => void;
  closeDrawer: () => void;
}

interface NotificationDrawerProps {
  children: React.ReactNode;
}

const NotificationDrawer = forwardRef<
  NotificationDrawerHandle,
  NotificationDrawerProps
>(({ children }, ref) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    openDrawer: () => setIsOpen(true),
    closeDrawer: () => setIsOpen(false),
  }));

  const handleNotificationPress = (notification: Notification) => {
    // Handle notification tap - you can navigate to relevant screen
    console.log("Notification pressed:", notification.title);
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notif) => ({ ...notif, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderHeader = () => (
    <View style={[
      styles.header, 
      { 
        paddingTop: insets.top + 16,
        borderBottomColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"
      }
    ]}>
      <View style={styles.headerContent}>
        <View style={styles.headerTitle}>
          <Text style={[styles.title, { color: colors.text }]}>
            Notifications
          </Text>
          {unreadCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.tint }]}>
              <Text style={[styles.badgeText, { color: colorScheme === "dark" ? colors.background : "white" }]}>
                {unreadCount}
              </Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={() => setIsOpen(false)}
          style={styles.closeButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <IconSymbol name="xmark" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {notifications.length > 0 && (
        <View style={styles.actionButtons}>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              style={[styles.actionButton, { borderColor: colors.tint }]}
            >
              <Text style={[styles.actionButtonText, { color: colors.tint }]}>
                Mark all read
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={clearAllNotifications}
            style={[styles.actionButton, { borderColor: "#FF6B6B" }]}
          >
            <Text style={[styles.actionButtonText, { color: "#FF6B6B" }]}>
              Clear all
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="bell.slash" size={64} color={colors.text + "40"} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No notifications
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.text + "60" }]}>
        You're all caught up! New notifications will appear here.
      </Text>
    </View>
  );

  const renderDrawerContent = () => (
    <View
      style={[
        styles.drawerContent,
        { backgroundColor: colors.background }
      ]}
    >
      {renderHeader()}
      
      {notifications.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              notification={item}
              onPress={handleNotificationPress}
              onMarkAsRead={markAsRead}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );

  return (
    <Drawer
      open={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      renderDrawerContent={renderDrawerContent}
      drawerPosition="right"
      drawerStyle={styles.drawer}
      overlayStyle={styles.overlay}
      swipeEnabled={false} // Only open via button tap
    >
      {children}
    </Drawer>
  );
});

NotificationDrawer.displayName = "NotificationDrawer";

export default NotificationDrawer;

const styles = StyleSheet.create({
  drawer: {
    width: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawerContent: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    // borderBottomColor is set dynamically in component
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    // color is set dynamically in component
    fontSize: 12,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  listContent: {
    flexGrow: 1,
  },
  emptyState: {
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
    lineHeight: 24,
  },
});
