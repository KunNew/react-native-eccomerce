import { IconSymbol, type IconSymbolName } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useStore } from '@/store/useStore';
import { router } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuItemProps {
  icon: IconSymbolName;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  showArrow?: boolean;
  color?: string;
}

function MenuItem({ icon, title, subtitle, onPress, showArrow = true, color }: MenuItemProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.menuItem, { 
        backgroundColor: colors.background,
        borderBottomColor: colors.text + '10'
      }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <View style={[styles.iconContainer, { backgroundColor: (color || colors.tint) + '20' }]}>
          <IconSymbol name={icon} size={20} color={color || colors.tint} />
        </View>
        <View style={styles.menuItemText}>
          <Text style={[styles.menuItemTitle, { color: colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.menuItemSubtitle, { color: colors.text + '60' }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {showArrow && (
        <IconSymbol name="chevron.right" size={16} color={colors.text + '40'} />
      )}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const toggleTheme = useStore((s) => s.toggleTheme);
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.View entering={FadeIn.duration(300)} style={{ flex: 1 }}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: Math.max(80, insets.bottom + 60) }}
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Profile
          </Text>
          <TouchableOpacity>
            <IconSymbol name="gearshape" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={[styles.userSection, { 
          backgroundColor: colors.background,
          borderColor: colors.text + '15'
        }]}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              John Doe
            </Text>
            <Text style={[styles.userEmail, { color: colors.text + '60' }]}>
              john.doe@example.com
            </Text>
            <TouchableOpacity style={[styles.editButton, { borderColor: colors.tint }]}>
              <Text style={[styles.editButtonText, { color: colors.tint }]}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Sections */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text + '60' }]}>
            ACCOUNT
          </Text>
          <View style={[styles.menuContainer, { backgroundColor: colors.background, borderColor: colors.text + '15' }]}>
            <MenuItem
              icon="person.circle"
              title="Personal Information"
              subtitle="Name, email, phone"
              onPress={() => console.log('Personal Info')}
            />
            <MenuItem
              icon="creditcard"
              title="Payment Methods"
              subtitle="Manage your payment options"
              onPress={() => console.log('Payment Methods')}
            />
            <MenuItem
              icon="location"
              title="Addresses"
              subtitle="Shipping and billing addresses"
              onPress={() => console.log('Addresses')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text + '60' }]}>
            ORDERS
          </Text>
          <View style={[styles.menuContainer, { backgroundColor: colors.background, borderColor: colors.text + '15' }]}>
            <MenuItem
              icon="bag"
              title="Order History"
              subtitle="View your past orders"
              onPress={() => console.log('Order History')}
            />
            <MenuItem
              icon="arrow.clockwise"
              title="Returns & Refunds"
              subtitle="Track returns and refunds"
              onPress={() => console.log('Returns')}
            />
            <MenuItem
              icon="truck.box"
              title="Track Orders"
              subtitle="Track your current orders"
              onPress={() => console.log('Track Orders')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text + '60' }]}>
            PREFERENCES
          </Text>
          <View style={[styles.menuContainer, { backgroundColor: colors.background, borderColor: colors.text + '15' }]}>
            <MenuItem
              icon="bell"
              title="Notifications"
              subtitle="Push notifications, email"
              onPress={() => console.log('Notifications')}
            />
            <MenuItem
              icon="globe"
              title="Language & Region"
              subtitle="English (US)"
              onPress={() => console.log('Language')}
            />
            <MenuItem
              icon="moon"
              title="Dark Mode"
              subtitle={colorScheme === 'dark' ? 'Enabled' : 'Disabled'}
              onPress={toggleTheme}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text + '60' }]}>
            SUPPORT
          </Text>
          <View style={[styles.menuContainer, { backgroundColor: colors.background, borderColor: colors.text + '15' }]}>
            <MenuItem
              icon="questionmark.circle"
              title="Help Center"
              subtitle="FAQs and support articles"
              onPress={() => console.log('Help Center')}
            />
            <MenuItem
              icon="message"
              title="Contact Us"
              subtitle="Get in touch with support"
              onPress={() => console.log('Contact Us')}
            />
            <MenuItem
              icon="star"
              title="Rate App"
              subtitle="Share your feedback"
              onPress={() => console.log('Rate App')}
            />
          </View>
        </View>

        {/* Testing Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text + '60' }]}>
            TESTING
          </Text>
          <View style={[styles.menuContainer, { backgroundColor: colors.background, borderColor: colors.text + '15' }]}>
            <MenuItem
              icon="key"
              title="Test Login Screen"
              subtitle="Try the new login form"
              onPress={() => router.push('/login')}
              color="#4CAF50"
            />
          </View>
        </View>

        {/* Logout */}
        <View style={styles.section}>
          <View style={[styles.menuContainer, { backgroundColor: colors.background, borderColor: colors.text + '15' }]}>
            <MenuItem
              icon="rectangle.portrait.and.arrow.right"
              title="Sign Out"
              onPress={() => console.log('Sign Out')}
              showArrow={false}
              color="#FF6B6B"
            />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.text + '40' }]}>
            Version 1.0.0
          </Text>
        </View>
        </ScrollView>
      </Animated.View>
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
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  menuContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 12,
  },
});
