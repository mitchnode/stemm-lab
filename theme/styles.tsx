import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "red",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 100,
    margin: 30,
  },
  row: {
    flexDirection: "row",
    gap: 20,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
  },
  text: {
    fontSize: 12,
  },
  version: {
    fontSize: 12,
    color: "darkblue",
  },
  button: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 50,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: "white",
  },
});