import { AuthProvider } from "@/context/authContext";
import { ThemeProvider } from "@/theme";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </AuthProvider>
  );
}
