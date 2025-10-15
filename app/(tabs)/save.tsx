import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { tablesDB } from "@/lib/appwrite";
import { fetchMovieDetails } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Query } from "react-native-appwrite";
import { SafeAreaView } from "react-native-safe-area-context";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

const Save = () => {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [savedMovies, setSavedMovies] = useState<any[]>([]);

  const loadSavedMovies = useCallback(async () => {
    setLoading(true);
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) throw new Error("User not found");

      const res = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: "users",
        queries: [Query.equal("userId", userId)],
      });

      const user = res.rows[0];
      if (!user) throw new Error("User not found in database");

      setUsername(user.username || "User");

      const movieIds: string[] = user.movieIds || [];
      if (movieIds.length === 0) {
        setSavedMovies([]);
        return;
      }

      const moviesData = await Promise.all(
        movieIds.map(async (id) => {
          try {
            return await fetchMovieDetails(id);
          } catch {
            return null;
          }
        })
      );

      setSavedMovies(moviesData.filter(Boolean));
    } catch (err) {
      console.error("Error loading saved movies:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // 👇 Run every time the tab/page is focused
  useFocusEffect(
    useCallback(() => {
      loadSavedMovies();
    }, [loadSavedMovies])
  );

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

      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-col items-center justify-center mt-20 mb-5">
          <Image source={icons.save} className="w-10 h-10 mb-3" tintColor="#AB8BFF" />
          <Text className="text-2xl text-white font-semibold text-center">
            Hey, <Text className="text-accent">{username}</Text>
          </Text>
          <Text className="text-light-200 text-base mt-2">
            Here are your saved movies 🎬
          </Text>
        </View>

        {savedMovies.length === 0 ? (
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-gray-400 text-base">
              You haven’t saved any movies yet.
            </Text>
          </View>
        ) : (
          <>
            <Text className="text-lg text-white font-bold mt-5 mb-3">
              Saved Movies
            </Text>

            <FlatList
              data={savedMovies}
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              scrollEnabled={false}
              className="mt-2 pb-32"
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Save;
