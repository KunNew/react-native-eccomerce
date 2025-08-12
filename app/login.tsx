import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useStore } from "@/store/useStore";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}
 
export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const toggleTheme = useStore((s) => s.toggleTheme);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock success - in real app, handle actual authentication
      Alert.alert("Login Successful!", `Welcome back, ${formData.email}!`, [
        {
          text: "Continue",
          onPress: () => router.back(), // or navigate to main app
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    Alert.alert("Social Login", `${provider} login coming soon!`);
  };

  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset coming soon!");
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const renderInput = (
    field: keyof FormData,
    placeholder: string,
    icon: string,
    secureTextEntry = false
  ) => {
    const isFocused = focusedField === field;
    const hasError = !!errors[field];
    const hasValue = !!formData[field];

    return (
      <View style={styles.inputContainer}>
        <View
          style={[
            styles.inputWrapper,
            {
              borderColor: hasError
                ? "#FF6B6B"
                : isFocused
                ? colors.tint
                : colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(0, 0, 0, 0.1)",
              backgroundColor:
                colorScheme === "dark"
                  ? "rgba(255, 255, 255, 0.05)"
                  : "rgba(0, 0, 0, 0.02)",
            },
          ]}
        >
          <IconSymbol
            name={icon as any}
            size={20}
            color={
              hasError
                ? "#FF6B6B"
                : isFocused || hasValue
                ? colors.tint
                : colors.text + "60"
            }
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder={placeholder}
            placeholderTextColor={colors.text + "60"}
            value={formData[field]}
            onChangeText={(value) => updateFormData(field, value)}
            onFocus={() => setFocusedField(field)}
            onBlur={() => setFocusedField(null)}
            secureTextEntry={secureTextEntry && !showPassword}
            autoCapitalize={field === "email" ? "none" : "sentences"}
            keyboardType={field === "email" ? "email-address" : "default"}
            autoCorrect={false}
            textContentType={field === "email" ? "emailAddress" : "password"}
          />
          {field === "password" && (
            <TouchableOpacity
              style={styles.passwordToggle}
              onPress={() => setShowPassword(!showPassword)}
            >
              <IconSymbol
                name={showPassword ? "eye.slash" : "eye"}
                size={20}
                color={colors.text + "60"}
              />
            </TouchableOpacity>
          )}
        </View>
        {hasError && (
          <Animated.View style={[styles.errorContainer, { opacity: fadeAnim }]}>
            <IconSymbol name="xmark.circle.fill" size={16} color="#FF6B6B" />
            <Text style={styles.errorText}>{errors[field]}</Text>
          </Animated.View>
        )}
      </View>
    );
  };

  const renderFloatingThemeToggle = () => {
    const isDark = colorScheme === "dark";

    return (
      <Animated.View
        style={[
          styles.floatingToggle,
          {
            backgroundColor:
              colorScheme === "dark"
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.05)",
            opacity: fadeAnim,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.floatingToggleButton,
            {
              backgroundColor: isDark ? colors.tint : colors.text + "15",
            },
          ]}
          onPress={toggleTheme}
          activeOpacity={0.8}
        >
          <Animated.View
            style={[
              styles.floatingToggleThumb,
              {
                backgroundColor: colors.background,
                transform: [
                  {
                    translateX: isDark ? 18 : 1,
                  },
                ],
                shadowColor: isDark ? colors.tint : colors.text,
              },
            ]}
          >
            <IconSymbol
              name={isDark ? "moon" : "sun.max"}
              size={10}
              color={isDark ? colors.tint : colors.text + "70"}
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.title, { color: colors.text }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: colors.text + "70" }]}>
              Sign in to your account
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={[styles.form, { opacity: fadeAnim }]}>
            {renderInput("email", "Email Address", "envelope")}
            {renderInput("password", "Password", "lock", true)}

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handleForgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: colors.tint }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor: colors.tint,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator
                  color={colorScheme === "dark" ? colors.background : "white"}
                  size="small"
                />
              ) : (
                <Text
                  style={[
                    styles.loginButtonText,
                    {
                      color:
                        colorScheme === "dark" ? colors.background : "white",
                    },
                  ]}
                >
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Divider */}
          <Animated.View
            style={[styles.dividerContainer, { opacity: fadeAnim }]}
          >
            <View
              style={[
                styles.divider,
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                },
              ]}
            />
            <Text style={[styles.dividerText, { color: colors.text + "60" }]}>
              Or continue with
            </Text>
            <View
              style={[
                styles.divider,
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.1)"
                      : "rgba(0, 0, 0, 0.1)",
                },
              ]}
            />
          </Animated.View>

          {/* Social Login */}
          <Animated.View
            style={[styles.socialContainer, { opacity: fadeAnim }]}
          >
            <TouchableOpacity
              style={[
                styles.socialButton,
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                  borderColor:
                    colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(0, 0, 0, 0.1)",
                },
              ]}
              onPress={() => handleSocialLogin("Google")}
            >
              <IconSymbol name="g.circle" size={20} color="#4285F4" />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>
                Google
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.socialButton,
                {
                  backgroundColor:
                    colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.08)"
                      : "rgba(0, 0, 0, 0.04)",
                  borderColor:
                    colorScheme === "dark"
                      ? "rgba(255, 255, 255, 0.15)"
                      : "rgba(0, 0, 0, 0.1)",
                },
              ]}
              onPress={() => handleSocialLogin("Apple")}
            >
              <IconSymbol name="apple.logo" size={20} color={colors.text} />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>
                Apple
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Sign Up Link */}
          <Animated.View
            style={[styles.signupContainer, { opacity: fadeAnim }]}
          >
            <Text style={[styles.signupText, { color: colors.text + "70" }]}>
              Don't have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => Alert.alert("Sign Up", "Sign up coming soon!")}
            >
              <Text style={[styles.signupLink, { color: colors.tint }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>

        {/* Floating Theme Toggle */}
        {renderFloatingThemeToggle()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    minHeight: 56,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    lineHeight: 20,
  },
  passwordToggle: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginLeft: 4,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 14,
    marginLeft: 6,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: "500",
  },
  loginButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 12,
    minHeight: 56,
  },
  socialButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
  },
  floatingToggle: {
    position: "absolute",
    top: 20,
    right: 20,
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  floatingToggleButton: {
    width: 40,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    position: "relative",
  },
  floatingToggleThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
