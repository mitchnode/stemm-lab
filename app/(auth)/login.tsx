import { loginWithEmail, resetPassword } from "@/services/authService";
import { debug } from "@/services/firestoreService";
import { useTheme } from "@/theme";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!email || !password)
      return setError("Both email and password are required.");
    setLoading(true);
    setError("");
    try {
      await loginWithEmail(email, password);
      debug("signinEmailPassword: ", "success: " + email);
    } catch (e: any) {
      debug("signinEmailPassword: ", e.code + " " + e.message);
      setError(`Error logging in: ${getError(e.code)}`);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return setError("Enter yoiur email above first.");
    try {
      await resetPassword(email);
      debug("sendPasswordResetEmail: ", "success: " + email);
      setError("Password reset email sent.");
    } catch (e: any) {
      debug("sendPasswordResetEmail: ", e.code + " " + e.message);
      setError(`Error reseting your password: ${getError(e.code)}`);
    }
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <Text style={{ ...styles.title, color: colors.text }}>
        STEMM Lab Games
      </Text>
      <View style={{ ...styles.box, backgroundColor: colors.surface }}>
        <TextInput
          style={{
            ...styles.input,
            borderColor: colors.border,
            color: colors.text,
          }}
          placeholder="Email"
          placeholderTextColor={colors.text}
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          accessibilityLabel="Email input field"
          accessibilityHint="Enter your registered account email address"
        />
        <TextInput
          style={{
            ...styles.input,
            borderColor: colors.border,
            color: colors.text,
          }}
          placeholder="Password"
          placeholderTextColor={colors.text}
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          accessibilityLabel="Password input field"
          accessibilityHint="Enter your secret account password"
        />
        {error ? (
          <Text style={{ ...styles.error, color: colors.error }}>{error}</Text>
        ) : null}

        <TouchableOpacity
          accessibilityRole="none"
          accessibilityLabel="Login"
          accessibilityState={{ disabled: loading }}
          style={{ ...styles.button, backgroundColor: colors.primary }}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={{ ...styles.buttonText, color: colors.light }}>
              Login
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="none"
          accessibilityLabel="Forgot password"
          accessibilityHint="Triggers an email reset process using the input address provided above"
          onPress={handleForgotPassword}
        >
          <Text style={{ ...styles.link, color: colors.primary }}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="none"
          accessibilityLabel="Register"
          accessibilityHint="Register new account"
          onPress={() => router.push("/register")}
        >
          <Text style={{ ...styles.link, color: colors.primary }}>
            Register Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Map Firebase error codes to user-friendly messages
function getError(code: string): string {
  switch (code) {
    case "auth/user-not-found":
      return "Email is not registered";
    case "auth/wrong-password":
      return "Invalid password";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later.";
    case "auth/invalid-email":
      return "Please enter a valid email.";
    default:
      return "Something went wrong. Please try again.";
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, gap: 50 },
  box: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "stretch",
    padding: 20,
  },
  title: {
    textAlign: "center",
    marginTop: 100,
    fontSize: 24,
    fontWeight: "bold",
  },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { fontWeight: "600" },
  error: { marginBottom: 8 },
  link: { marginTop: 16, textAlign: "center" },
});
