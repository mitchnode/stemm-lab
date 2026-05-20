# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

# Using the theme

All colours for Light Mode and Dark Mode are in theme/colors.tsx

To use the theme in the code use:

```javascript
import { useTheme } from "@/theme";

const { colors } = useTheme();

return (
<View styles={{backgroundColor: colors.background}}>
   <Text styles={{color: colors.text}}>
</View>
);
```

To toggle the theme between Dark and Light:

```javascript
const { colors, setScheme, isDark } = useTheme();
const changeTheme = () => {
   isDark ? setScheme("light") : setScheme("dark");
};

return (
   <Button onPress={changeTheme}>
);
```

# Building a View with ResultViewModel

## Setup

Instantiate `ResultViewModel` at the screen level and wrap your component in MobX's `observer` so it re-renders when observable fields change.

```tsx
import { observer } from "mobx-react-lite";
import { ResultViewModel } from "@/viewmodel/ResultViewModel";

const viewModel = new ResultViewModel();

const ResultScreen = observer(() => {
  return (
    // Your JSX here
  );
});
```

> Create the ViewModel **outside** the component so it isn't re-instantiated on every render. If using multiple screens, pass it via props or a React context.

---

## Reading State

Bind directly to the ViewModel's observable properties. MobX will re-render the component automatically when they change.

```tsx
<Text>{viewModel.resultValue}</Text>
<Text>{viewModel.resultDateTime}</Text>
<Text>{viewModel.resultType}</Text>
```

---

## Writing State

Use the setter methods to update individual fields.

```tsx
result.setTeamID(teamID);
result.setActivityID(ACTIVITY_ID);
result.setResultDateTime(new Date().toLocaleString());
result.setResultType("Acceleration");
result.setResultValue("10m/s^2");
result.setResultData(data);
```

---

## Triggering Actions

Call the `handle` methods to perform operations. These coordinate the Model and handle all storage/navigation internally.

```tsx
// Save a new result to local storage, returns the resultID to be used to retrieve the result from another screen
const onRecord = async () => {
  viewModel.setTeamID("team-123");
  viewModel.setActivityID(1);
  viewModel.setResultDateTime(new Date().toLocaleString());
  viewModel.setResultType("time");
  viewModel.setResultValue("45.2");
  const resultID = await viewModel.handleRecord();
};

// Load an existing result (e.g. from navigation params)
const onLoad = async (resultID: string) => {
  await viewModel.handleRestore(resultID);
  // viewModel fields are now populated — observer() handles the re-render
};

// Upload result saves the result into a list in local storage list and uploads to firestore
const onUpload = () => {
  viewModel.handleUpload(); // shows alert and navigates home on completion
};
```
