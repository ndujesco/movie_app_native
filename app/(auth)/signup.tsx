import { tablesDB } from "@/lib/appwrite";
import bcrypt from 'bcryptjs';
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";
import AuthInput from "../../components/AuthInput";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

// Set fallback for React Native / TypeScript
bcrypt.setRandomFallback((len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(Math.floor(Math.random() * 256));
  }
  return arr;
});

export default function SignupScreen() {
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 const handleSignup = async () => {
  try {
    if (!username.trim()) return Alert.alert("Error", "Name is required");
    if (!email.trim()) return Alert.alert("Error", "Email is required");
    if (!password.trim()) return Alert.alert("Error", "Password is required");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return Alert.alert("Error", "Please enter a valid email address");
    }

    // 1️⃣ Check if user already exists
    const existing = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: "users",
      queries: [Query.equal("email", email)],
    });

    if (existing.total > 0) {
      return Alert.alert("Error", "Email already registered");
    }

    // 2️⃣ Generate a userId (can be UUID or timestamp-based)
    const userId = `user_${Date.now()}`;

    // 3️⃣ Hash the password
    const salt = bcrypt.genSaltSync(5);
    const passwordHash = bcrypt.hashSync(password, salt);

    // 4️⃣ Insert the new user into your DB

    await tablesDB.createRow({
      databaseId: DATABASE_ID,
      rowId: userId,
      tableId: "users",
      data: {
        username,
        userId,
        email,
        passwordHash,
      }
    })

    Alert.alert("Success", "Account created successfully!");
    router.push("/login");
  } catch (err) {
    console.error("Signup error:", err);
    Alert.alert("Error", "Something went wrong. Please try again.");
  }
};




  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1, // Keep this to allow the container to grow
              // REMOVED: justifyContent: "center"
              paddingHorizontal: 32,
              paddingBottom: 40,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {/* ADDED: This wrapper View now handles the centering */}
            <View className="flex-1 justify-center">
              <View>
                <Text className="text-3xl font-bold text-textPrimary mb-6 text-center">
                  Create Account ✨
                </Text>

                <AuthInput
                  label="Username"
                  placeholder="John Doe"
                  value={username}
                  onChangeText={setName}
                />
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
                  onPress={handleSignup}
                  className="bg-primary rounded-xl py-4 mt-4"
                >
                  <Text className="text-center text-white font-semibold text-base">
                    Sign Up
                  </Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6">
                  <Text className="text-textSecondary">
                    Already have an account?{" "}
                  </Text>
                  <Link href="/login" className="text-primary font-semibold">
                    Log in
                  </Link>
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}