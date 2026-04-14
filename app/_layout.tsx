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
          options={{
            presentation: "pageSheet",
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen name="team-view" />
        <Stack.Screen
          name="record"
          options={{
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="results"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
