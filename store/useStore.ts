import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  rating: number;
  reviews: number;
  originalPrice?: number;
  discount?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

interface StoreState {
  // Cart state
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;

  // Favorites state
  favorites: Product[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  // Products state
  products: Product[];
  categories: Category[];
  setProducts: (products: Product[]) => void;
  setCategories: (categories: Category[]) => void;
  getProductsByCategory: (categoryId: string) => Product[];
  searchProducts: (query: string) => Product[];

  // UI/Settings state
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      cartItems: [],
      favorites: [],
      products: [],
      categories: [],
      theme: 'light',

  // Cart actions
  addToCart: (product) => {
    const { cartItems } = get();
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      set({
        cartItems: cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      set({
        cartItems: [...cartItems, { ...product, quantity: 1 }],
      });
    }
  },

  removeFromCart: (productId) => {
    set({
      cartItems: get().cartItems.filter(item => item.id !== productId),
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    set({
      cartItems: get().cartItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ),
    });
  },

  clearCart: () => {
    set({ cartItems: [] });
  },

  getCartTotal: () => {
    return get().cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCartItemCount: () => {
    return get().cartItems.reduce((count, item) => count + item.quantity, 0);
  },

  // Favorites actions
  addToFavorites: (product) => {
    const { favorites } = get();
    if (!favorites.find(item => item.id === product.id)) {
      set({ favorites: [...favorites, product] });
    }
  },

  removeFromFavorites: (productId) => {
    set({
      favorites: get().favorites.filter(item => item.id !== productId),
    });
  },

  isFavorite: (productId) => {
    return get().favorites.some(item => item.id === productId);
  },

  // Products actions
  setProducts: (products) => {
    set({ products });
  },

  setCategories: (categories) => {
    set({ categories });
  },

  getProductsByCategory: (categoryId) => {
    return get().products.filter(product => product.category === categoryId);
  },

  searchProducts: (query) => {
    const { products } = get();
    const lowercaseQuery = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery)
    );
  },

      // UI/Settings actions
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
    }),
    {
      name: 'ecommerce-store', // unique name for the storage key
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist these specific fields (don't persist products/categories as they come from API)
      partialize: (state) => ({
        cartItems: state.cartItems,
        favorites: state.favorites,
        theme: state.theme,
      }),
      // Skip hydration on SSR (not needed for React Native but good practice)
      skipHydration: false,
    }
  )
);
