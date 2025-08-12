# React Native E-commerce Mobile App

A modern, feature-rich e-commerce mobile application built with React Native and Expo. This app provides a smooth shopping experience with product browsing, favorites, cart management, and user authentication.

## 📱 Features

### 🛍️ Core Shopping Features
- **Product Catalog**: Browse products with beautiful card layouts
- **Categories**: Filter products by categories (Electronics, Fashion, Home & Garden, etc.)
- **Search**: Search products by name and description
- **Product Details**: Detailed product view with images, ratings, and descriptions
- **Shopping Cart**: Add/remove items with quantity management
- **Favorites**: Save products to favorites list
- **Filters**: Advanced filtering by price range, rating, and sorting options

### 🎨 UI/UX Features
- **Dark/Light Theme**: Automatic theme switching based on device settings
- **Layout Toggle**: Switch between grid and horizontal card layouts
- **Responsive Design**: Optimized for different screen sizes
- **Smooth Animations**: Haptic feedback and smooth transitions
- **Toast Notifications**: User feedback for actions (add to cart, favorites, etc.)

### 🔐 User Management
- **User Authentication**: Login/logout functionality
- **Profile Management**: User profile with settings
- **Persistent Storage**: Save user preferences and cart data

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router with file-based routing
- **State Management**: Zustand for global state
- **UI Components**: Custom components with themed styling
- **Icons**: SF Symbols for consistent iconography
- **Notifications**: React Native Toast Message
- **TypeScript**: Full type safety throughout the app

## 📂 Project Structure

```
eccomerce-mobile/
├── app/                    # App screens and navigation
│   ├── (tabs)/            # Tab-based screens
│   │   ├── index.tsx      # Home screen
│   │   ├── categories.tsx # Categories & products
│   │   ├── cart.tsx       # Shopping cart
│   │   ├── favorites.tsx  # Favorites list
│   │   └── profile.tsx    # User profile
│   ├── login.tsx          # Login screen
│   └── product-detail.tsx # Product detail screen
├── components/            # Reusable components
│   ├── ProductCard.tsx    # Product card with grid/horizontal layouts
│   ├── CategoryCard.tsx   # Category selection cards
│   ├── FilterModal.tsx    # Advanced filters modal
│   └── ui/               # UI components
├── store/                # Zustand store
│   └── useStore.ts       # Global state management
├── data/                 # Mock data and types
│   └── mockData.ts       # Sample products and categories
├── constants/            # App constants
│   └── Colors.ts         # Theme colors
└── hooks/               # Custom hooks
    └── useColorScheme.ts # Theme detection
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
```bash
git clone git@github.com:KunNew/react-native-eccomerce.git
cd react-native-eccomerce
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Start the development server**
```bash
npx expo start
```

4. **Run on device/simulator**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your device

## 📱 Screenshots

### Home Screen
- Featured products carousel
- Category quick access
- Search functionality

### Categories Screen
- Product grid/horizontal layout toggle
- Category filtering
- Advanced filters (price, rating, sorting)
- Search within categories

### Shopping Cart
- Quantity management
- Price calculations
- Checkout flow

### Favorites
- Saved products list
- Easy removal
- Empty state handling

## 🎯 Key Features Implementation

### Layout Toggle System
```typescript
// Switch between grid and horizontal product layouts
const [isHorizontalLayout, setIsHorizontalLayout] = useState(false);

// Grid: 2-column layout for compact browsing
// Horizontal: Full-width cards with image left, content right
```

### Advanced Filtering
```typescript
// Multi-criteria filtering system
const filters = {
  sortBy: 'popular' | 'price-low' | 'price-high' | 'rating' | 'newest',
  priceRange: { min: number, max: number },
  minRating: number
};
```

### State Management
```typescript
// Zustand store for global state
interface StoreState {
  products: Product[];
  cart: CartItem[];
  favorites: Product[];
  // ... actions
}
```

## 🔧 Development

### Adding New Features
1. Create components in `/components`
2. Add screens in `/app` directory
3. Update store in `/store/useStore.ts`
4. Add types in data files

### Styling
- Uses themed colors from `/constants/Colors.ts`
- Responsive design with device dimensions
- Platform-specific styling for iOS/Android

### Testing
```bash
# Run tests
npm test

# Run linting
npm run lint
```

## 📦 Build & Deployment

### Build for Production
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android
```

### Environment Configuration
Configure app settings in `app.json`:
- App name and version
- Icon and splash screen
- Permissions and capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Expo team for the excellent development platform
- React Native community for components and libraries
- Design inspiration from modern e-commerce apps

## 📞 Contact

For questions or support, please open an issue in the GitHub repository.

---

**Happy Shopping! 🛍️**