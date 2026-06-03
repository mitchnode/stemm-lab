import Activities from "@/app/(app)/index";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { render, screen } from "@testing-library/react-native";
import "jest-styled-components";
import "jest-styled-components/native";

//this mocks the safe-area-View and Safe-Area-Provider
jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);
//without this line the test will always fail as it is a provider function (like firebase and others)
//you could remove the <SafeAreaView \> <SafeAreaProvider \> with Views in Index.tsx

describe("<Activities />", () => {
  //check text output

  beforeEach(() => {
    //before each test
  });

  test("Text renders correctly on activities", () => {
    render(<Activities />);
    expect(screen.getAllByText(/Activity 1: Parachute Drop Challenge*/i));
    expect(screen.getAllByText(/Activity 2: Sound Pollution Hunter*/i));
    expect(screen.getAllByText(/Activity 3: Hand Fan Challenge*/i));
    expect(screen.getAllByText(/Activity 4: Earthquake-Resistant Structure*/i));
    expect(screen.getAllByText(/Activity 5: Human Performance Lab*/));
    expect(screen.getAllByText(/Activity 6:Reaction Board Challenge*/));
    expect(screen.getAllByText(/Activity 7:Breathing Pace Trainer*/));
  });

  //check text colour
  test("Text renders check style", async () => {
    // index.tsx Line 61 add: testID = "t1"
    // Looks like: <View testID = "t1" style = {styles.rowContainer}>
    // index.tsx Between Line 101-102 add: color: "#fff",

    //Note: open issue - "ToHaveStyle" and "toHaveStyleRule" doesn't work with props (e.g. <View><View> ...) use "testID" instead (as there is no other way to grab it.)
    const screen = render(<Activities />);
    const t = await screen.findByTestId("t1");
    expect(t).toHaveStyle({ rowGap: 15, columnGap: 20 });
    const b = await screen.findByTestId("b3");
  });

  //screenshots of a component
  test("CustomText renders correctly", () => {
    const tree = render(
      <IconSymbol
        size={310}
        color="#808080"
        name="chevron.left.forwardslash.chevron.right"
        style={{ backgroundColor: "red" }}
      />,
    ).toJSON();
    expect(tree).toMatchSnapshot(); //matches previously taken snapshot (if no previous takes one)
  });
});
