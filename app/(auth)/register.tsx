import { registerWithEmail } from "@/services/authService";
import { debug } from "@/services/firestoreService";
import { useTheme } from "@/theme";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword)
      return setError("Both email and password are required.");
    if (password.length < 8)
      return setError("Password must be at least 8 characters long.");
    if (password != confirmPassword) return setError("Passwords do not match.");
    setLoading(true);
    setError("");
    try {
      await registerWithEmail(email, password);
      debug("createUserWithEmailAndPassword: ", "success: " + email);
    } catch (e: any) {
      debug("createUserWithEmailAndPassword: ", e.code + " " + e.message);
      setError(`Error logging in: ${getError(e.code)}`);
    } finally {
      setLoading(false);
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
        />
        <TextInput
          style={{
            ...styles.input,
            borderColor: colors.border,
            color: colors.text,
          }}
          placeholder="Confirm Password"
          placeholderTextColor={colors.text}
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        {error ? (
          <Text style={{ ...styles.error, color: colors.error }}>{error}</Text>
        ) : null}

        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: colors.primary }}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={{ ...styles.buttonText, color: colors.light }}>
              Register
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Map Firebase error codes to user-friendly messages
function getError(code: string): string {
  switch (code) {
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
