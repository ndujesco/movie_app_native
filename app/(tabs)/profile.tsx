import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) setUsername(storedUsername);
      } catch (err) {
        console.error("Failed to load user:", err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.clear();
            router.replace("/(auth)/login");
          } catch (err) {
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#AB8BFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
      />

      <View className="flex-1 justify-center items-center px-8">
        <Image
          source={icons.person}
          className="w-24 h-24 mb-4 rounded-full border-2 border-accent"
          tintColor="#fff"
        />

        <Text className="text-2xl text-white font-semibold text-center mb-1">
          Hey, <Text className="text-accent">{username || "User"}</Text>
        </Text>

        <Text className="text-light-200 text-center text-sm mb-10">
          Glad to have you back 🍿
        </Text>

        <TouchableOpacity
          onPress={handleLogout}
          className="bg-accent rounded-lg px-8 py-3 mt-5 w-3/4"
        >
          <Text className="text-white text-center font-semibold text-base">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
