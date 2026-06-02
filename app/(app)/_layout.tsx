import { useAuth } from "@/context/authContext";
import { useTheme } from "@/theme";
import { TeamViewModel } from "@/viewmodel/teamViewModel";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { logout } from "../../services/authService";

const team = new TeamViewModel();

export default function AppLayout() {
  const router = useRouter();
  const { user } = useAuth();
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const DRAWER_WIDTH = SCREEN_WIDTH * 0.75;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Call to log out the user
  async function handleLogout() {
    await logout();
  }

  // Theme management states
  const { isDark, setScheme, colors } = useTheme();
  const styles = createStyles(colors);

  // Animation values
  const slideAnim = useRef(new Animated.Value(-DRAWER_WIDTH)).current;

  const changeTheme = () => {
    isDark ? setScheme("light") : setScheme("dark");
  };

  const [isTeamVisible, setIsTeamVisible] = useState(false);
  const loadTeam = async () => {
    if (user) await team.handleRestore(user.uid);
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const toggleMenu = () => {
    if (isMenuOpen) {
      // Close side-drawer
      Animated.timing(slideAnim, {
        toValue: DRAWER_WIDTH,
        duration: 250,
        useNativeDriver: true,
      }).start(() => setIsMenuOpen(false));
    } else {
      // Open side-drawer
      setIsMenuOpen(true);
      Animated.timing(slideAnim, {
        toValue: 150,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleNavigateHome = () => {
    toggleMenu();
    router.dismissAll();
    router.replace("/");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerBackButtonDisplayMode: "minimal",
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: colors.title,
          headerTitle: "STEMM Labs Games",
          headerTitleAlign: "center",
          headerTitleStyle: { fontWeight: "700", fontSize: 18 },
          headerRight: () => (
            <Pressable
              onPress={toggleMenu}
              accessibilityRole="button"
              accessibilityLabel="Open sidebar menu"
              style={{ paddingHorizontal: 4 }}
            >
              <Ionicons name="menu" size={26} color={colors.light} />
            </Pressable>
          ),
        }}
      />

      {/*  GLOBAL FLOATING TEAM CARD LAYER */}
      {isTeamVisible && (
        <View style={styles.floatingCardContainer}>
          <View style={[styles.box, { backgroundColor: colors.surface }]}>
            {/* Header with Close Button for UI */}
            <View style={styles.cardHeaderRow}>
              <Text
                style={[
                  styles.menuHeading,
                  { color: colors.text, marginBottom: 0 },
                ]}
              >
                Active Team Profile
              </Text>
              <TouchableOpacity
                onPress={() => setIsTeamVisible(false)}
                accessibilityLabel="Close team view overview"
                accessibilityRole="button"
              >
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={colors.text}
                  style={{ opacity: 0.6 }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.separator,
                { backgroundColor: colors.border, marginBottom: 15 },
              ]}
            />

            <View style={styles.info}>
              <View style={styles.row}>
                <Text style={[styles.bold_text, { color: colors.text }]}>
                  Team ID:
                </Text>
                <Text style={[styles.large_font, { color: colors.text }]}>
                  {team.teamID}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.bold_text, { color: colors.text }]}>
                  Team name:
                </Text>
                <Text style={[styles.large_font, { color: colors.text }]}>
                  {team.teamName}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.bold_text, { color: colors.text }]}>
                  Year:
                </Text>
                <Text style={[styles.large_font, { color: colors.text }]}>
                  {team.year}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={[styles.bold_text, { color: colors.text }]}>
                  Members:
                </Text>
                <View style={styles.members}>
                  {team.members.map((item, index) => (
                    <Text
                      key={index}
                      style={[
                        styles.large_font,
                        styles.members_text,
                        { color: colors.text },
                      ]}
                    >
                      • {item}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* ACCESSIBLE SLIDING DRAWER LAYER */}
      <Modal
        transparent
        visible={isMenuOpen}
        onRequestClose={toggleMenu}
        animationType="none"
      >
        <View style={styles.modalOverlay}>
          {/* Backdrop Tap to Close Dismiss Layer */}
          <TouchableWithoutFeedback onPress={toggleMenu}>
            <View style={styles.backdropDismiss} />
          </TouchableWithoutFeedback>

          {/* Actual Animated Side Menu Body */}
          <Animated.View
            style={[
              styles.drawerBody,
              {
                width: DRAWER_WIDTH,
                backgroundColor: colors.surface || "#1e1e1e",
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
            <Text style={[styles.menuHeading, { color: colors.text }]}>
              Options Menu
            </Text>
            <View
              style={[styles.separator, { backgroundColor: colors.border }]}
            />

            {/* NEW: Navigation Back to Main */}
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: colors.background }]}
              onPress={handleNavigateHome}
              accessibilityRole="link"
              accessibilityLabel="Go back to the main home dashboard"
              accessibilityHint="Closes the drawer menu and returns you to the start page"
            >
              <Ionicons
                name="home-outline"
                size={22}
                color={colors.text}
                style={styles.itemIcon}
              />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                Home Screen
              </Text>
            </TouchableOpacity>

            {/*  View Team Interactive Node */}
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: colors.background }]}
              onPress={async () => {
                const nextVisibilityState = !isTeamVisible;

                if (nextVisibilityState) {
                  await loadTeam();
                }

                setIsTeamVisible(nextVisibilityState);
                toggleMenu();
              }}
              accessibilityRole="button"
              accessibilityLabel="View or switch current active team summary card"
              accessibilityState={{ checked: isTeamVisible }}
            >
              <Ionicons
                name="people-outline"
                size={22}
                color={colors.text}
                style={styles.itemIcon}
              />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                {isTeamVisible ? "Hide Team Info" : "View Team Info"}
              </Text>
            </TouchableOpacity>
            {/* Change Team */}
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: colors.background }]}
              onPress={() => {
                router.push("/(app)/team");
                toggleMenu();
              }}
              accessibilityRole="button"
              accessibilityLabel="Change your team details"
            >
              <Ionicons
                name="people-outline"
                size={22}
                color={colors.text}
                style={styles.itemIcon}
              />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                Change Team
              </Text>
            </TouchableOpacity>

            {/* Toggle Theme Interactive Node */}
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: colors.background }]}
              onPress={changeTheme}
              accessibilityRole="togglebutton"
              accessibilityLabel="Toggle app interface appearance color mode"
              accessibilityHint={`Switches app environment display theme to ${isDark ? "Light Mode" : "Dark Mode"}`}
            >
              <Ionicons
                name={isDark ? "sunny-outline" : "moon-outline"}
                size={22}
                color={colors.text}
                style={styles.itemIcon}
              />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                {isDark ? "Light Theme" : "Dark Theme"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.menuItem, { backgroundColor: colors.background }]}
              onPress={() => {
                handleLogout();
                toggleMenu();
              }}
              accessibilityRole="button"
              accessibilityLabel="Logs out of the app"
              accessibilityHint={`Logs out and returns to the login screen`}
            >
              <Ionicons
                name={"log-out-outline"}
                size={22}
                color={colors.text}
                style={styles.itemIcon}
              />
              <Text style={[styles.menuItemText, { color: colors.text }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: 90,
      paddingTop: 45,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      borderBottomWidth: 1,
    },
    menuButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    contentBody: {
      flex: 1,
    },
    modalOverlay: {
      flex: 1,
      flexDirection: "row",
      backgroundColor:
        colors.background === "#f2f2f2" || colors.background === "#25292e"
          ? "rgba(0, 0, 0, 0.70)"
          : "rgba(0, 0, 0, 0.40)",
    },
    backdropDismiss: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    drawerBody: {
      height: "100%",
      paddingTop: 60,
      paddingHorizontal: 20,
      shadowColor: "#000",
      shadowOffset: { width: 4, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 16,
    },
    menuHeading: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
    },
    separator: {
      height: 1,
      marginBottom: 20,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 8,
      marginBottom: 12,
    },
    itemIcon: {
      marginRight: 14,
    },
    menuItemText: {
      fontSize: 16,
      fontWeight: "600",
    },
    floatingCardContainer: {
      position: "absolute",
      top: 100,
      left: 16,
      right: 16,
      zIndex: 99,
    },
    box: {
      padding: 16,
      borderRadius: 12,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 6,
      elevation: 8,
    },
    cardHeaderRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: 8,
    },
    info: {
      gap: 10,
    },
    row: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    bold_text: {
      fontWeight: "700",
      width: 100,
      fontSize: 15,
    },
    large_font: {
      fontSize: 15,
      flex: 1,
    },
    members: {
      flexDirection: "column",
      flex: 1,
      gap: 4,
    },
    members_text: {
      fontWeight: "500",
    },
  });
