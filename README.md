# Welcome to STEMM Lab Games

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

There are some components in this app that are not compatible with Expo Go. You will need to run a development build.

```bash
  npx expo prebuild
  npx expo run:android
```

Please note this app has not been fuilly tested on iOS

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
const onUpload = async () => {
    await viewModel.handleUpload(); // shows alert and navigates home on completion
  };
};
```

## Uploading to Firestore

When uploading data to the cloud, it can sometimes take a small amount of time.
While this is happening, the screen should change to indicate something is happening.
Use a loading state, wrapping the upload call with setLoading calls, then use a conditional return to display an ActivityIndicator.

```tsx
import { ActivityIndicator, View, Button } from "react-native";

const App = () => {
  const [loading, setLoading] = useState(false);

  const onUpload = async () => {
    setLoading(true);
    await viewModel.handleUpload(); // shows alert and navigates home on completion
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View>
      <Button onPress={onUpload}>Upload</Button>
    </View>
  );
};
```

## Other Models

These concepts also apply to the TeamViewModel and ResultListModel

# Getting the logged in user

## useAuth hook

At the top of your component call the useAuth hook to get the {user} object.
This gives access to the user that has authenticated with Firebase.
uid: string is used to create or retrieve the Team, as only 1 team can be created per authenticated user.

```tsx
import { useAuth } from "@/context/authContext";

const App = () => {
  const { user } = useAuth();
  return (
    // Your JSX here
  );
};
```

# Loading the Team

## TeamViewModel

Instantiate the TeamViewModel outside your component so it doens't re-instantiate on re-render.
Call the useAuth hook to get the user.
In an async function, call `handleRestore` from the instatiated `team`, passing it the `user.uid`.
Call the function from useEffect() to load the Team data.

```tsx
import { TeamViewModel } from "@/viewmodel/TeamViewModel";
import { useAuth } from "@/context/authContext";

const team = new TeamViewModel();

const App = () => {
  const { user } = useAuth();

  const loadTeam = async () => {
    if (user) await team.handleRestore(user.uid);
  };

  useEffect(() => {
    loadTeam();
  });
};
```
