import { ThemeProvider, useTheme } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack } from "expo-router";
import { Pressable } from "react-native";

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
            <Pressable onPress={() => console.log("Menu Pressed")}>
              <Ionicons name="menu" size={24} color={colors.title} />
            </Pressable>
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
