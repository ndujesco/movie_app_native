import { tablesDB } from "@/lib/appwrite";
import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from "bcryptjs";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View, } from "react-native";
import { Query } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthInput from "../../components/AuthInput";



const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

// Make sure this is set somewhere once in your app
bcrypt.setRandomFallback((len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(Math.floor(Math.random() * 256));
  }
  return arr;
});

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");



  const handleLogin = async () => {
    try {
      if (!email.trim()) return Alert.alert("Error", "Email is required");
      if (!password.trim()) return Alert.alert("Error", "Password is required");

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return Alert.alert("Error", "Please enter a valid email address");
      }

      // 1️⃣ Fetch user by email
      const res = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: "users",
        queries: [Query.equal("email", email)],
      });

      if (res.total === 0) {
        return Alert.alert("Error", "User not found");
      }

      const user = res.rows[0];

      const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);

      if (!isPasswordValid) {
        return Alert.alert("Error", "Incorrect password");
      }

      await AsyncStorage.setItem('userId', user.userId);
      await AsyncStorage.setItem('username', user.username);


      Alert.alert("Success", `Welcome back, ${user.username}!`);
      router.push("/");


    } catch (err) {
      console.error("Login error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };


  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 justify-center px-8">
        <Text className="text-3xl font-bold text-textPrimary mb-6 text-center">
          Welcome Back 👋
        </Text>

        <AuthInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
        />
        <AuthInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-primary rounded-xl py-4 mt-4"
        >
          <Text className="text-center text-white font-semibold text-base">
            Login
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-textSecondary">Don’t have an account? </Text>
          <Link href="/signup" className="text-primary font-semibold">
            Sign up
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
