// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
export type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  // Navigation icons
  'house.fill': 'home',
  'square.grid.2x2.fill': 'apps',
  'cart.fill': 'shopping-cart',
  'cart': 'shopping-cart',
  'heart.fill': 'favorite',
  'heart': 'favorite-border',
  'person.fill': 'person',
  
  // UI icons
  'chevron.right': 'chevron-right',
  'chevron.left': 'chevron-left',
  'chevron.up': 'keyboard-arrow-up',
  'chevron.down': 'keyboard-arrow-down',
  'arrow.up': 'north',
  'arrow.down': 'south',
  'plus': 'add',
  'minus': 'remove',
  'xmark.circle.fill': 'cancel',
  'xmark': 'close',
  'checkmark': 'check',
  'magnifyingglass': 'search',
  'bell': 'notifications',
  'trash': 'delete',
  'star.fill': 'star',
  'star': 'star-border',
  'sparkles': 'auto-awesome',
  
  // Login/Auth icons
  'envelope': 'email',
  'envelope.fill': 'email',
  'lock': 'lock',
  'lock.fill': 'lock',
  'eye': 'visibility',
  'eye.slash': 'visibility-off',
  'key': 'vpn-key',
  
  // Profile icons
  'gearshape': 'settings',
  'person.circle': 'account-circle',
  'creditcard': 'credit-card',
  'location': 'location-on',
  'bag': 'shopping-bag',
  'arrow.clockwise': 'refresh',
  'truck.box': 'local-shipping',
  'globe': 'language',
  'moon': 'dark-mode',
  'sun.max': 'wb-sunny',
  'questionmark.circle': 'help',
  'message': 'message',
  'rectangle.portrait.and.arrow.right': 'logout',
  'slider.horizontal.3': 'tune',
  
  // Social icons
  'g.circle': 'g-translate', // Google fallback
  'f.circle': 'facebook', // Facebook
  'apple.logo': 'apple', // Apple fallback
  
  // Other icons
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
