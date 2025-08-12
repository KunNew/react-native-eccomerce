import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "order";
  timestamp: Date;
  read: boolean;
}

interface NotificationItemProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationItem({
  notification,
  onPress,
  onMarkAsRead,
}: NotificationItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  const getNotificationIcon = () => {
    switch (notification.type) {
      case "order":
        return "cart";
      case "success":
        return "checkmark.circle";
      case "warning":
        return "exclamationmark.triangle";
      case "error":
        return "xmark.circle";
      default:
        return "bell";
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case "success":
        return "#4CAF50";
      case "warning":
        return "#FF9800";
      case "error":
        return "#F44336";
      case "order":
        return colors.tint;
      default:
        return colors.text;
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: notification.read
            ? colors.background
            : colorScheme === "dark"
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 0, 0, 0.02)",
          borderBottomColor: colorScheme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        },
      ]}
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconBackground,
            { backgroundColor: getNotificationColor() + "20" },
          ]}
        >
          <IconSymbol
            name={getNotificationIcon()}
            size={24}
            color={getNotificationColor()}
          />
        </View>
        {!notification.read && (
          <View style={[
            styles.unreadDot, 
            { 
              backgroundColor: colors.tint,
              borderColor: colors.background // Dynamic border color based on theme
            }
          ]} />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
                fontWeight: notification.read ? "500" : "600",
              },
            ]}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
          <Text style={[styles.timestamp, { color: colors.text + "60" }]}>
            {formatTimestamp(notification.timestamp)}
          </Text>
        </View>

        <Text
          style={[
            styles.message,
            {
              color: colors.text + "80",
              fontWeight: notification.read ? "400" : "500",
            },
          ]}
          numberOfLines={2}
        >
          {notification.message}
        </Text>

        {!notification.read && (
          <TouchableOpacity
            style={[styles.markReadButton, { borderColor: colors.tint }]}
            onPress={() => onMarkAsRead(notification.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={[styles.markReadText, { color: colors.tint }]}>
              Mark as read
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    alignItems: "flex-start",
  },
  iconContainer: {
    position: "relative",
    marginRight: 12,
  },
  iconBackground: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    // borderColor is set dynamically in component
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
  timestamp: {
    fontSize: 12,
    flexShrink: 0,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  markReadButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 12,
    marginTop: 4,
  },
  markReadText: {
    fontSize: 12,
    fontWeight: "500",
  },
});
