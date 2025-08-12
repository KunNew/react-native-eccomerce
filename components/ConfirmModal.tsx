import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Modal from 'react-native-modal';
import { IconSymbol } from './ui/IconSymbol';

const { width } = Dimensions.get('window');

interface ConfirmModalProps {
  isVisible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'warning' | 'danger' | 'info';
}

export default function ConfirmModal({
  isVisible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'warning'
}: ConfirmModalProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getIconAndColor = () => {
    switch (type) {
      case 'danger':
        return { icon: 'trash', color: '#FF6B6B' };
      case 'warning':
        return { icon: 'exclamationmark.triangle', color: '#FFB800' };
      case 'info':
        return { icon: 'info.circle', color: colors.tint };
      default:
        return { icon: 'questionmark.circle', color: colors.tint };
    }
  };

  const { icon, color } = getIconAndColor();

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onCancel}
      onBackButtonPress={onCancel}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.5}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
    >
      <View style={[
        styles.modalContainer, 
        { backgroundColor: colors.background },
        Platform.OS === 'android' && { 
          borderWidth: 1, 
          borderColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' 
        }
      ]}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <IconSymbol name={icon as any} size={32} color={color} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: colors.text + '80' }]}>
            {message}
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, { backgroundColor: colors.text + '10' }]}
            onPress={onCancel}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              {cancelText}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.confirmButton, { backgroundColor: color }]}
            onPress={onConfirm}
            activeOpacity={0.8}
          >
            <Text style={styles.confirmButtonText}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
      },
      android: {
        // No shadow, border will be added dynamically
      },
    }),
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  confirmButton: {
    backgroundColor: '#FF6B6B',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
