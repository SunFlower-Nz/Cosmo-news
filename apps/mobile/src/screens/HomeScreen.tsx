import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useFeed } from "../hooks/useFeed";
import { NewsCard } from "../components/NewsCard";

export default function HomeScreen() {
  const { data, isLoading, error } = useFeed();

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );

  if (error)
  return (
    <View className="flex-1 justify-center items-center bg-white p-5">
      <Text className="text-red-500 text-lg font-semibold mb-3">Erro ao carregar notícias 😢</Text>
      <Text className="text-neutral-500 text-center">
        {(error as any).message}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-white dark:bg-neutral-950 p-4">
      <Text className="text-3xl font-bold mb-4 text-neutral-900 dark:text-white">
        Cosmo News 🌎
      </Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NewsCard
            title={item.title}
            image={item.imageUrl}
            source={item.source?.name || "Desconhecida"}
            publishedAt={new Date(item.publishedAt).toLocaleDateString()}
          />
        )}
      />
    </View>
  );
}
