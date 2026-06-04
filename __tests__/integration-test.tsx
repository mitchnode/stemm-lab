const mockPush = jest.fn();

jest.mock("expo-router", () => ({
  router: { push: mockPush },
  useRouter: () => ({ push: mockPush }),
  useLocalSearchParams: jest.fn(),
}));

import Activities from "@/app/(app)/activities";
import ActivityDetail from "@/app/(app)/activity_detail";
import Login from "@/app/(auth)/login"; // Adjust path to your Login file
import { loginWithEmail } from "@/services/authService";
import { NavigationContainer } from "@react-navigation/native";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";
import { useLocalSearchParams } from "expo-router";

import { router } from "expo-router";
const mockedRouterPush = (router as any).push as jest.Mock;

(global as any).__DEV__ = true;

jest.mock("@/labsData.js", () => ({
  __esModule: true,
  ALL_LABS: {
    "1": {
      id: "1",
      title: "Activity 1: Parachute Drop Challenge",

      description: {
        summary:
          "Students design, build, and test a parachute for a small toy to reduce its landing speed and impact force. Teams iterate their designs under time and material constraints, aiming to achieve the slowest and safest landing within a target area.",

        equipment: [
          "Mobile phone with STEMM Lab app",
          "Small toy (e.g. army toy soldier)",
          "Table or elevated surface",
          "Paper or plastic",
          "String",
          "Scissors",
          "Tape",
        ],

        instructions: `1.Drop the toy without a parachute and record the fall (baseline test).
2.Build a parachute using provided materials. 
3.Drop the toy from the same height and record the fall.
4.Review speed and landing accuracy results in the app. 
5.Redesign and test up to three prototypes within 20 minutes.
6.Upload videos, results, and team reflections.`,
      },
      writeUp: {
        questions: [
          "Predict which parachute design was the best.",
          "Sketch each of the designs.",
          "Record the times of the design.",
          "Were you correct in timings?",
          "What design was the easiest to make?",
        ],
        tableHeaders: [
          "", // Top-left blank spacer cell over rows
          "How long will it take to hit the ground?",
          "Time (time to first hit the ground)",
          "Were you right?",
          "Time (time from first hitting the ground and stop moving) – need slow motion.",
        ],
        tableRows: [
          { label: "Action 1\n(e.g. No parachute as the baseline)" },
          {
            label:
              "Action 2\n(e.g. use plastic with four corners tied to the toy)",
          },
          { label: "Action 3" },
        ],
        discussionTitle: "Discussion: Parachutes and Forces (Plain Language)",
        discussionText:
          "Gravity pulls objects downward, causing them to speed up as they fall. A parachute increases air resistance (also called drag). Drag acts upward, opposing the motion and slowing the fall. A slower fall reduces the force when the toy hits the ground, making the landing safer. Engineers improve parachute designs through repeated testing and redesign.",
      },
    },
  },
}));

const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (/TypeError|Error/.test(args[0])) return;
    originalError.call(console, ...args);
  };
});

jest.mock("re-native-ui", () => {
  const React = require("react");

  const View = (props: any) =>
    React.createElement("View", props, props.children);
  const Text = (props: any) =>
    React.createElement("Text", props, props.children);

  return {
    ...jest.requireActual("re-native-ui"),
    View,
    Text,
  };
});

jest.mock("@/services/authService", () => ({
  loginWithEmail: jest.fn(),
  resetPassword: jest.fn(),
}));

jest.mock("@/services/firestoreService", () => ({
  debug: jest.fn(),
}));

jest.mock("@/theme", () => ({
  useTheme: () => ({
    colors: {
      background: "#fff",
      text: "#000",
      surface: "#eee",
      primary: "blue",
    },
  }),
}));

jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

const renderWithNavigation = (ui: React.ReactElement) => {
  return render(<NavigationContainer>{ui}</NavigationContainer>);
};

const mockedLoginWithEmail = loginWithEmail as jest.MockedFunction<
  typeof loginWithEmail
>;

describe("Login Integration Flow", () => {
  it("navigates to activities after successful login", async () => {
    // Setup mock resolution
    mockedLoginWithEmail.mockResolvedValueOnce({} as any);

    const { getByLabelText, getByText } = render(<Login />);

    fireEvent.changeText(
      getByLabelText("Email input field"),
      "lukefletcher668@gmail.com",
    );
    fireEvent.changeText(getByLabelText("Password input field"), "Luke27018?");

    fireEvent.press(getByLabelText("robo_login_button"));

    await waitFor(() => {
      expect(loginWithEmail).toHaveBeenCalledWith(
        "lukefletcher668@gmail.com",
        "Luke27018?",
      );
    });
  });
});
describe("activity selection 1 page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("navigates to activity detail when a lab button is pressed", async () => {
    const { findByText } = renderWithNavigation(<Activities />);

    const labButtonText = await findByText(/Parachute Drop Challenge/i);

    await act(async () => {
      fireEvent.press(labButtonText);
    });

    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/(app)/activity_detail",
      params: { id: "1" },
    });
  });

  describe("navigate to record ", () => {
    it("navigates to record activity page when FAB is pressed", async () => {
      (useLocalSearchParams as jest.Mock).mockReturnValue({ id: "1" });

      const utils = await renderWithNavigation(<ActivityDetail />);

      const { findByLabelText } = utils;

      const recordButton = await findByLabelText("Record New Activity Data");

      await act(async () => {
        fireEvent.press(recordButton);
      });

      expect(mockPush).toHaveBeenCalledWith("./record/recordactivity1");
    });
  });
});
