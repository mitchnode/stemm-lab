import { ThemeProvider, useTheme } from "@/theme";
import { Stack } from "expo-router";
import { Button } from "react-native";

export default function RootLayout() {
  const { colors } = useTheme();
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: colors.title,
          headerTitle: "STEMM Labs Games",
          headerTitleAlign: "center",
          headerRight: () => (
            <Button onPress={() => console.log("Menu Pressed")} title="Menu" />
          ),
        }}
      >
        <Stack.Screen
          name="index"
          options={{ headerBackVisible: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="team"
          options={{ presentation: "pageSheet", headerShown: false }}
        />
        <Stack.Screen name="team-view" />
      </Stack>
    </ThemeProvider>
  );
}
