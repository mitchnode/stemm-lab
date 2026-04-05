import { ThemeProvider } from "@/theme";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="team" options={{ presentation: "modal" }} />
        <Stack.Screen name="team-view" />
      </Stack>
    </ThemeProvider>
  );
}
