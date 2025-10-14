import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      className="flex-1 justify-center items-center">
      <Text className="text-4xl text-dark-200 font-bold">Hi! My name is Ugo!</Text>
      <Link href='/onboarding'>Onboarding</Link>
      <Link
        href={{
          pathname: "/movie/[id]", // The actual file path template
          params: { id: 'avengers' } // The parameter value
        }}
      >
        Go to Avengers
      </Link>

    </View>
  );
}
