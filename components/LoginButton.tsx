import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginButton() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[
        styles.loginButton,
        {
          backgroundColor: colors.tint,
          borderColor: colors.tint,
        },
      ]}
      onPress={() => router.push('/login')}
    >
      <View style={styles.buttonContent}>
        <IconSymbol
          name="person.circle"
          size={20}
          color={colorScheme === 'dark' ? colors.background : 'white'}
        />
        <Text
          style={[
            styles.buttonText,
            { color: colorScheme === 'dark' ? colors.background : 'white' },
          ]}
        >
          Login / Sign In
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
