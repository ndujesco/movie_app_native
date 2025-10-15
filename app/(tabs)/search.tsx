import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

import { fetchMovies } from "@/services/api";
import useFetch from "@/services/usefetch";

import MovieDisplayCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [username, setUsername] = useState<string>("");

  // Load username from AsyncStorage
  useEffect(() => {
    const loadUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) setUsername(storedUsername);
    };
    loadUsername();
  }, []);

  const {
    data: movies = [],
    loading,
    error,
    refetch: loadMovies,
    reset,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      } else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <FlatList
        className="px-5"
        data={movies as Movie[]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieDisplayCard {...item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {/* Greeting */}
            {username ? (
              <Text className="text-2xl text-white font-semibold text-center mt-20 mb-2">
                Hi, <Text className="text-accent">{username}</Text>
              </Text>
            ) : null}

            {/* Logo */}
            <View className="w-full flex-row justify-center items-center">
              <Image source={icons.logo} className="w-12 h-10" />
            </View>

            {/* Search Bar */}
            <View className="my-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {/* Loading & Error */}
            {loading && (
              <ActivityIndicator size="large" color="#AB8BFF" className="my-3" />
            )}
            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {/* Search results title */}
            {!loading && !error && searchQuery.trim() && movies?.length! > 0 && (
              <Text className="text-xl text-white font-bold">
                Search Results for{" "}
                <Text className="text-accent">{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim()
                  ? "No movies found"
                  : "Start typing to search for movies"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
