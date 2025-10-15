import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function AuthLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack
        screenOptions={{
          headerShown: false, // hide headers for login/signup
          contentStyle: { backgroundColor: "#F3F4F6" }, // optional: light background
        }}
      >
        {/* Screens inside (auth) folder will be rendered here */}
      </Stack>
    </>
  );
}
