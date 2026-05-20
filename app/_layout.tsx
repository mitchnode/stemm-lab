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
<<<<<<< HEAD
        <Stack.Screen name="activity_detail" 
        options={{ title: "Activity Detail" }}/>
=======
        <Stack.Screen
          name="recordvideo"
          options={{
            headerShown: false,
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen
          name="videoresults"
          options={{
            headerShown: false,
            gestureEnabled: false,
            animation: "slide_from_bottom",
          }}
        />
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
            animation: "slide_from_bottom",
          }}
        />
>>>>>>> 6a9af5b8e43267bc5dadd874c0f97d3d6890aa70
      </Stack>
      
    </ThemeProvider>
  );
}
