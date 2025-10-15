import { tablesDB } from "@/lib/appwrite";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StatusBar, View } from "react-native";
import { Query } from "react-native-appwrite";
import "./globals.css";


const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          setIsLoggedIn(false);
          return;
        }

        const res = await tablesDB.listRows({
          databaseId: DATABASE_ID,
          tableId: "users",
          queries: [Query.equal("userId", userId)],
        });

        setIsLoggedIn(res.total > 0);
      } catch (err) {
        console.error("Auth check error:", err);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#1E40AF" />
      </View>
    );
  }

  // 🔹 Instead of putting conditional <Stack.Screen>, we render separate stacks
  return (
    <>
      <StatusBar hidden={true} />
      {isLoggedIn ? <AuthenticatedLayout /> : <AuthLayout />}
    </>
  );
}

// --- Authenticated Layout (tabs, etc.) ---
function AuthenticatedLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="movie/[id]" />
    </Stack>
  );
}

// --- Auth Layout (login/signup) ---
function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/signup" />
    </Stack>
  );
}
