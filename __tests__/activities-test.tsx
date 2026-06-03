/// <reference types="jest" />

jest.mock("react-native", () => {
  const InlineReact = require("react");

  const createSafeComponent = (name: string) => {
    const MockedComponent = InlineReact.forwardRef((props: any, ref: any) => {
      return InlineReact.createElement(name, { ...props, ref }, props.children);
    });
    MockedComponent.displayName = name;
    return MockedComponent;
  };

  return {
    Text: createSafeComponent("Text"),
    View: createSafeComponent("View"),
    Pressable: createSafeComponent("Pressable"),
    ScrollView: createSafeComponent("ScrollView"),

    Platform: {
      OS: "ios",
      select: (objs: any) => objs.ios || objs.default,
    },
    StyleSheet: {
      create: (styles: any) => styles,
      flatten: (style: any) => style,
    },

    AppRegistry: {
      registerComponent: jest.fn(),
      registerRunnable: jest.fn(),
      getAppKeys: jest.fn(() => []),
    },
    LogBox: {
      ignoreLogs: jest.fn(),
      ignoreAllLogs: jest.fn(),
    },

    Animated: {
      View: createSafeComponent("Animated.View"),
      Text: createSafeComponent("Animated.Text"),
      Value: class {
        setValue() {}
      },
      timing: () => ({ start: (cb: any) => cb && cb() }),
    },
    Dimensions: {
      get: () => ({ width: 375, height: 812, scale: 3, fontScale: 1 }),
      addEventListener: () => ({ remove: () => {} }),
    },
  };
});

import Activities from "@/app/(app)/index";

import "@testing-library/jest-native/extend-expect";
import { render, screen } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";
jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    addListener: jest.fn(() => () => {}),
  }),
  useLocalSearchParams: () => ({}),
}));

jest.mock("@/services/authService", () => ({
  createUserWithEmailAndPassword: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({ uid: "mock-user-123", email: "test@stemmlab.com" });
    return () => {}; // Return unsubscribe function
  }),
  sendPasswordResetEmail: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@/context/authContext", () => {
  const InlineReact = require("react");
  return {
    AuthProvider: ({ children }: { children: any }) => children,
    useAuth: () => ({
      user: { uid: "mock-user-123", email: "test@stemmlab.com" },
      loading: false,
    }),
  };
});

jest.mock("@/services/firestoreService", () => ({
  addDoc: jest.fn(() => Promise.resolve({ id: "mock-doc-id" })),
  collection: jest.fn(),
  doc: jest.fn(),
  getDoc: jest.fn(() =>
    Promise.resolve({ exists: () => true, data: () => ({}) }),
  ),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  updateDoc: jest.fn(() => Promise.resolve()),
  deleteDoc: jest.fn(() => Promise.resolve()),
}));

jest.mock("@/viewmodel/teamViewModel", () => {
  return {
    TeamViewModel: class {
      teams = [];
      loading = false;
      error = null;
      fetchTeams = jest.fn(() => Promise.resolve([]));
      createTeam = jest.fn(() => Promise.resolve());
      handleRestore = jest.fn(() => Promise.resolve());
    },
  };
});

// Mock re-native-ui components to prevent the 'undefined' composite component error
jest.mock("re-native-ui", () => {
  const InlineReact = require("react");

  const createSafeComponent = (name: string) => {
    const MockedComponent = InlineReact.forwardRef((props: any, ref: any) => {
      return InlineReact.createElement(name, { ...props, ref }, props.children);
    });
    MockedComponent.displayName = name;
    return MockedComponent;
  };

  return {
    Text: createSafeComponent("Text"),
    View: createSafeComponent("View"),
    ScrollView: createSafeComponent("ScrollView"),
    Pressable: createSafeComponent("Pressable"),

    // Mock the useTheme hook so style attributes like color and background compile cleanly
    useTheme: () => ({
      colors: {
        background: "#ffffff",
        text: "#000000",
        primary: "#007aff",
      },
    }),
  };
});

const ALL_LABS = {
  lab1: { id: "1", title: "Activity 1: Parachute Drop Challenge" },
  lab2: { id: "2", title: "Activity 2: Sound Pollution Hunter" },
  lab3: { id: "3", title: "Activity 3: Hand Fan Challenge" },
  lab4: { id: "4", title: "Activity 4: Earthquake-Resistant Structure" },
  lab5: { id: "5", title: "Activity 5: Human Performance Lab" },
  lab6: { id: "6", title: "Activity 6: Reaction Board Challenge" },
  lab7: { id: "7", title: "Activity 7: Breathing Pace Trainer" },
};

describe("<Activities />", () => {
  //check text output

  beforeEach(() => {
    //before each test
  });

  test("Text renders correctly on activities", () => {
    render(<Activities />);
    expect(
      screen.getAllByText(/Activity 1: Parachute Drop Challenge*/i),
    ).toBeDefined();
    expect(
      screen.getAllByText(/Activity 1: Parachute Drop Challenge*/),
    ).toBeDefined();
    expect(
      screen.getAllByText(/Activity 2: Sound Pollution Hunter*/),
    ).toBeDefined();
    expect(
      screen.getAllByText(/Activity 3: Hand Fan Challenge*/),
    ).toBeDefined();
    expect(
      screen.getAllByText(/Activity 4: Earthquake-Resistant Structure*/i),
    ).toBeDefined();
    expect(
      screen.getAllByText(/Activity 5: Human Performance Lab*/),
    ).toBeDefined();
    expect(
      screen.getAllByText(/Activity 6:Reaction Board Challenge*/),
    ).toBeDefined();
    expect(
      screen.getAllByText(/Activity 7:Breathing Pace Trainer*/),
    ).toBeDefined();
  });

  //check text colour
  test("Text renders check style", async () => {
    const screen = render(<Activities />);
    const t = await screen.findByTestId("t1");
    expect(t).toHaveStyle({ rowGap: 15, columnGap: 20 });

    const c = await screen.findByTestId("b4");
    expect(c).toHaveStyle({ flex: 1, alignItems: "center" });
    const e = await screen.findByTestId("c4");
    expect(e).toHaveStyle({ padding: 20, fontSize: 20 });
  });
});
describe("Pressable Rendering", () => {
  test("CustomText renders correctly inside the map loop", () => {
    render(
      <>
        {Object.keys(ALL_LABS).map((labKey) => {
          const lab = ALL_LABS[labKey as keyof typeof ALL_LABS];
          return (
            <Pressable key={lab.id}>
              <Text testID={`lab-text-${lab.id}`}>{lab.title}</Text>
            </Pressable>
          );
        })}
      </>,
    );

    const textElement = screen.getByTestId("lab-text-1");
    expect(textElement).toBeDefined();
    expect(
      screen.getByText("Activity 1: Parachute Drop Challenge"),
    ).toBeDefined();
    expect(
      screen.getByText("Activity 7: Breathing Pace Trainer"),
    ).toBeDefined();

    // 4. Take a clean layout snapshot of just this mapped output
    const tree = screen.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
