/// <reference types="jest" />
import Activities from "@/app/(app)/index";
import { render, screen } from "@testing-library/react-native";
import "jest-styled-components";
import "jest-styled-components/native";
import React from "react";

import { Pressable, Text } from "react-native";

//this mocks the safe-area-View and Safe-Area-Provider
jest.mock(
  "react-native-safe-area-context",
  () => require("react-native-safe-area-context/jest/mock").default,
);
//without this line the test will always fail as it is a provider function (like firebase and others)
//you could remove the <SafeAreaView \> <SafeAreaProvider \> with Views in Index.tsx

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
    const screen = render(<Activities />);
    const t = await screen.findByTestId("t1");
    expect(t).toHaveStyle({ rowGap: 15, columnGap: 20 });
    const b = await screen.findByTestId("b3");
    expect(b).toHaveStyle({ color: "#fff" });
    const c = await screen.findByTestId("b4");
    expect(c).toHaveStyle({ flex: 1, alignItems: "center" });
    const e = await screen.findByTestId("c4");
    expect(e).toHaveStyle({ color: "#fff" });
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
              <Text testID="4">{lab.title}</Text>
            </Pressable>
          );
        })}
      </>,
    );

    const textElement = screen.getByTestId("4");
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
