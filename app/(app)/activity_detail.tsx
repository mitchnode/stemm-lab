import { useTheme } from "@/theme";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useLocalSearchParams, useRouter } from "expo-router";

import { ALL_LABS } from "@/labsData.js";
import { Text, useTheme as useRETheme } from "re-native-ui";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

interface LabActivity {
  id: string | number;
  title: string;
  description: {
    equipment: string[];
    instructions: string;
  };
  writeUp: {
    questions: string[];
    tableHeaders: string[];
    tableRows: { label: string }[];
    discussionTitle: string;
    discussionText: string;
    formulas: string;
    measurements: string[];
    curriculumLinks: string;
  };
}

const Tab = createMaterialTopTabNavigator();

interface TabProps {
  activity: LabActivity;
  themeContainer: any;
  themeText: any;
  themeCard?: any;
  isDark?: Boolean;
}

const DescriptionTab = ({ activity, themeContainer, themeText }: TabProps) => (
  <ScrollView style={[styles.tabContent, themeContainer]}>
    <Text style={[styles.sectionTitle, themeText]}>Equipment Required</Text>
    {activity.description.equipment.map((item, index) => (
      <View
        key={index}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={item}
      >
        <Text key={index} style={[styles.bodyText, themeText]}>
          • {item}
        </Text>
      </View>
    ))}

    <Text
      style={[styles.sectionTitle, themeText, styles.topMargin]}
      accessibilityRole="header"
    >
      Instructions
    </Text>

    <Text style={[styles.bodyText, themeText, { lineHeight: 24 }]}>
      {activity.description.instructions}
    </Text>
  </ScrollView>
);

interface WriteUpProps {
  activity: LabActivity;
  themeContainer: any;
  themeText: any;
  isDark: boolean;
}

const WriteUpTab = ({
  activity,
  themeContainer,
  themeText,
  isDark,
}: WriteUpProps) => {
  const data = activity.writeUp;
  const horizontalScrollRef = React.useRef<ScrollView>(null);
  const tableHeaderBg = isDark ? "#1e1e1e" : "#e0e0e0";
  const tableBorderColor = isDark ? "#333333" : "#cccccc";
  const cellStyle = [
    styles.tableCell,
    styles.standardColumnWidth,
    { borderRightWidth: 1, borderRightColor: tableBorderColor },
  ];
  const lastCellStyle = [styles.tableCell, styles.standardColumnWidth];

  return (
    <ScrollView style={[styles.tabContent, themeContainer]}>
      <Text style={[styles.sectionTitle, themeText]} accessibilityRole="header">
        Write-up (on paper):
      </Text>

      <View style={styles.questionsContainer}>
        {data.questions.map((question: string, index: number) => (
          <Text
            key={index}
            style={[styles.bodyText, themeText, styles.italicText]}
          >
            {question}
          </Text>
        ))}
      </View>

      <ScrollView
        ref={horizontalScrollRef}
        horizontal
        showsHorizontalScrollIndicator
        accessible={true} // Makes the scroll block contextually recognized
        accessibilityRole="none"
        accessibilityLabel="data table. up or down with your screen reader adjustment gesture to scroll horizontally."
        accessibilityActions={[
          { name: "scrollRight", label: "Scroll Table Right" },
          { name: "scrollLeft", label: "Scroll Table Left" },
        ]}
        onAccessibilityAction={(event) => {
          switch (event.nativeEvent.actionName) {
            case "scrollRight":
              horizontalScrollRef.current?.scrollTo({ x: 150, animated: true });
              break;
            case "scrollLeft":
              horizontalScrollRef.current?.scrollTo({ x: 0, animated: true });
              break;
          }
        }}
      >
        <View
          style={[styles.tableContainer, { borderColor: tableBorderColor }]}
          accessible={true}
          accessibilityLabel="Data Recording Reference Table"
        >
          {/* Table Headers */}
          <View
            style={[
              styles.tableRow,
              {
                backgroundColor: tableHeaderBg,
                borderBottomWidth: 1,
                borderBottomColor: tableBorderColor,
              },
            ]}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel={`Columns: ${data.tableHeaders.join(", ")}`}
          >
            <View
              style={[
                styles.tableCell,
                styles.firstColumnWidth,
                { borderRightWidth: 1, borderRightColor: tableBorderColor },
              ]}
            >
              <Text style={[styles.headerCellText, themeText]}>
                {data.tableHeaders[0]}
              </Text>
            </View>
            <View style={cellStyle}>
              <Text style={[styles.headerCellText, themeText]}>
                {data.tableHeaders[1]}
              </Text>
            </View>
            <View style={cellStyle}>
              <Text style={[styles.headerCellText, themeText]}>
                {data.tableHeaders[2]}
              </Text>
            </View>
            <View style={cellStyle}>
              <Text style={[styles.headerCellText, themeText]}>
                {data.tableHeaders[3]}
              </Text>
            </View>
            <View style={lastCellStyle}>
              <Text style={[styles.headerCellText, themeText]}>
                {data.tableHeaders[4]}
              </Text>
            </View>
          </View>

          {/* Table Data Rows */}
          {data.tableRows.map((row: any, rowIndex: number) => {
            const isLastRow = rowIndex === data.tableRows.length - 1;

            const rowAccessibilityText = `Row ${rowIndex + 1}: ${data.tableHeaders[0]} is ${row.label}. Contains blank recording cells for column 2: ${data.tableHeaders[1]}, column 3: ${data.tableHeaders[2]}, column 4: ${data.tableHeaders[3]}, and column 5: ${data.tableHeaders[4]}.`;
            return (
              <View
                key={rowIndex}
                style={[
                  styles.tableRow,
                  {
                    borderBottomWidth: isLastRow ? 0 : 1,
                    borderBottomColor: tableBorderColor,
                    minHeight: 80,
                  },
                ]}
                accessible={true}
                accessibilityRole="text"
                accessibilityLabel={rowAccessibilityText}
              >
                <View
                  style={[
                    styles.tableCell,
                    styles.firstColumnWidth,
                    {
                      borderRightWidth: 1,
                      borderRightColor: tableBorderColor,
                      backgroundColor: tableHeaderBg,
                    },
                  ]}
                >
                  <Text style={[styles.rowLabelText, themeText]}>
                    {row.label}
                  </Text>
                </View>

                <View
                  style={cellStyle}
                  importantForAccessibility="no"
                  aria-hidden={true}
                />
                <View
                  style={cellStyle}
                  importantForAccessibility="no"
                  aria-hidden={true}
                />
                <View
                  style={cellStyle}
                  importantForAccessibility="no"
                  aria-hidden={true}
                />
                <View
                  style={lastCellStyle}
                  importantForAccessibility="no"
                  aria-hidden={true}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.topMargin}>
        <Text
          style={[styles.sectionTitle, themeText]}
          accessibilityRole="header"
        >
          {data.discussionTitle}
        </Text>
        <Text style={[styles.bodyText, themeText, styles.justifyText]}>
          {data.discussionText}
        </Text>
      </View>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
};

const DiscussionTabContent = ({
  activity,
  themeContainer,
  themeText,
  themeCard,
  isDark,
}: TabProps) => {
  const [userNotes, setUserNotes] = useState("");
  return (
    <ScrollView style={[styles.tabContent, themeContainer]}>
      <View style={[styles.topMargin]}>
        <Text style={[styles.sectionTitle, themeText]} accessibilityRole="none">
          Your Discussion Observations
        </Text>
        <TextInput
          style={[
            styles.textArea,
            isDark ? styles.darkInput : styles.lightInput,
            { color: isDark ? "#ffffff" : "#000000" },
          ]}
          multiline
          numberOfLines={6}
          placeholder="Type your synthesis, findings, or thoughts here..."
          placeholderTextColor={isDark ? "#aaa" : "#555"}
          value={userNotes}
          onChangeText={setUserNotes}
          textAlignVertical="top"
          accessible={true}
          accessibilityLabel="Discussion observations input field"
        />
      </View>
    </ScrollView>
  );
};
// --- MAIN SCREEN ---
export default function ActivityDetail() {
  const router = useRouter();
  const { colors, setScheme, isDark } = useTheme();

  const theme = useRETheme();
  theme.colors.background = colors.background;
  theme.colors.primary = colors.primary;
  theme.colors.text = colors.text;
  theme.colors.border = colors.border;

  const { id } = useLocalSearchParams();
  const labKey = id as string;

  const activity = useMemo(() => {
    return labKey && labKey in ALL_LABS
      ? (ALL_LABS[labKey as keyof typeof ALL_LABS] as any as LabActivity)
      : null;
  }, [labKey]);

  if (!activity) {
    return (
      <View
        style={[
          styles.container,
          isDark ? styles.darkContainer : styles.lightContainer,
        ]}
      >
        <Text style={{ color: colors.text }}>Loading Activity...</Text>
      </View>
    );
  }

  const changeTheme = () => {
    setScheme(isDark ? "light" : "dark");
  };

  const themeContainer = isDark ? styles.darkContainer : styles.lightContainer;
  const themeText = isDark ? styles.darkText : styles.lightText;
  const themeCard = isDark ? styles.darkCard : styles.lightCard;

  return (
    <View style={[styles.container, themeContainer]}>
      <View style={styles.header}>
        <Text
          style={[styles.headerTitle, themeText]}
          accessibilityRole="header"
        >
          {activity.title}
        </Text>
        <TouchableOpacity
          onPress={changeTheme}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessible={true}
          accessibilityRole="none"
          accessibilityState={{ checked: isDark }}
          accessibilityLabel="Toggle Dark Mode"
        >
          <MaterialIcons
            name={isDark ? "wb-sunny" : "nights-stay"}
            size={28}
            color={isDark ? "#FFD700" : "#000"}
          />
        </TouchableOpacity>
      </View>

      {/* Material Top Tabs Navigation */}
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 13, fontWeight: "bold" },
          tabBarStyle: { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
          tabBarActiveTintColor: "#2196F3",
          tabBarInactiveTintColor: isDark ? "#aaa" : "#666",
          tabBarIndicatorStyle: { backgroundColor: "#2196F3" },
        }}
      >
        {/* Pass props using a callback pattern to keep components separated safely */}
        <Tab.Screen name="Description">
          {(props) => (
            <DescriptionTab
              activity={activity}
              themeContainer={themeContainer}
              themeText={themeText}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Write-up">
          {(props) => (
            <WriteUpTab
              activity={activity}
              themeContainer={themeContainer}
              themeText={themeText}
              isDark={isDark}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Discussion">
          {(props) => (
            <DiscussionTabContent
              activity={activity}
              themeContainer={themeContainer}
              themeText={themeText}
              themeCard={themeCard}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>

      <TouchableOpacity
        style={styles.list}
        onPress={() => {
          router.push({
            pathname: "/(app)/resultlist",
            params: { activity: activity.id },
          }); // Pass activity number to filter result list
        }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="View Results List"
      >
        <MaterialIcons name="list" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.leaderboard}
        onPress={() => {
          router.push({
            pathname: "/(app)/leaderboard",
            params: { activityId: activity.id },
          });
        }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="View Leaderboard"
      >
        <MaterialIcons name="leaderboard" size={30} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          router.push(`./record/recordactivity${activity.id}`);
        }}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Record New Activity Data"
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  lightContainer: { backgroundColor: "#f5f5f5" },
  darkContainer: { backgroundColor: "#121212" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", flex: 1, marginRight: 10 },
  lightText: { color: "#000" },
  darkText: { color: "#fff" },
  tabContent: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 8 },
  topMargin: { marginTop: 20 },
  bodyText: { fontSize: 15, lineHeight: 22, marginBottom: 4 },
  diagramImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: "#eee",
  },
  card: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  lightCard: { backgroundColor: "#fff" },
  darkCard: { backgroundColor: "#1e1e1e" },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  formulaText: {
    fontSize: 18,
    fontFamily: "monospace",
    fontStyle: "italic",
    color: "#2196F3",
    paddingVertical: 4,
  },
  questionsContainer: { marginBottom: 20, paddingLeft: 4 },
  italicText: { fontStyle: "italic", marginBottom: 4 },
  tableContainer: {
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 20,
  },
  tableRow: { flexDirection: "row" },
  tableCell: { padding: 8, justifyContent: "center" },
  firstColumnWidth: { width: 140 },
  standardColumnWidth: { width: 120 },
  headerCellText: { fontSize: 12, fontWeight: "bold", textAlign: "center" },
  rowLabelText: { fontSize: 12, fontWeight: "600" },
  justifyText: { textAlign: "justify", lineHeight: 22 },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    minHeight: 140,
    marginTop: 8,
  },
  lightInput: {
    borderColor: "#000000",
    backgroundColor: "#fff",
  },
  darkInput: {
    borderColor: "#ffffff",
    backgroundColor: "#1e1e1e",
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#2196F3",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  list: {
    position: "absolute",
    left: 20,
    bottom: 20,
    backgroundColor: "#179742",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  leaderboard: {
    position: "absolute",
    left: 20,
    bottom: 96,
    backgroundColor: "#c4a600",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
