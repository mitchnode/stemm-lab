import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <head>
        <title>STEMM Lab Games</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <CssBaseline />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
