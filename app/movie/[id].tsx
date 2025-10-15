import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import { tablesDB } from "@/lib/appwrite";
import { fetchMovieDetails } from "@/services/api";
import useFetch from "@/services/usefetch";
import { Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);






const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current; // initial scale 1



  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  // Load logged-in user and check if movie is saved
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) return;

        const res = await tablesDB.listRows({
          databaseId: DATABASE_ID,
          tableId: "users",
          queries: [Query.equal("userId", userId)],
        });

        if (res.total > 0) {
          const u = res.rows[0];
          setUser(u);
          setSaved(u.movieIds?.includes(id as string) ?? false);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    loadUser();
  }, [id]);

  // Handle save toggle
  const handleSave = async () => {
    if (!user) return Alert.alert("Error", "User not found");

    try {
      const updatedMovieIds = saved
        ? user.movieIds.filter((mId: string) => mId !== id)
        : [...(user.movieIds || []), id];

      await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: "users",
        rowId: user.$id,
        data: { movieIds: updatedMovieIds },
      });

      // Animate button
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      setSaved(!saved);
      Alert.alert(
        "Success",
        saved ? "Movie removed from your saved list" : "Movie saved!"
      );

      setUser({ ...user, movieIds: updatedMovieIds });
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", "Could not update saved movies. Try again.");
    }
  };


  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          {/* 🔹 Saved button */}
          <Animated.View
            style={{ transform: [{ scale: scaleAnim }] }}
            className={`absolute bottom-5 right-5 rounded-full size-14 flex items-center justify-center ${saved ? "bg-primary" : "bg-white"
              }`}
          >
            <TouchableOpacity onPress={handleSave}>
              <Image source={icons.save} className="w-6 h-6" />
            </TouchableOpacity>
          </Animated.View>


        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round((movie?.revenue ?? 0) / 1_000_000)} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") || "N/A"
            }
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;
