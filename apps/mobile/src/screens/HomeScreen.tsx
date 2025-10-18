import { useQuery } from "@tanstack/react-query";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { getNews } from "../api/news";
import NewsCard from "../components/NewsCard";

export default function HomeScreen() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["feed"],
    queryFn: getNews,
  });

  if (isLoading)
    return (
      <View className="flex-1 justify-center items-center bg-neutral-100 dark:bg-neutral-950">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-neutral-600 mt-4">Carregando notícias...</Text>
      </View>
    );

  if (error)
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Erro ao carregar notícias 😢</Text>
      </View>
    );

  return (
    <View className="flex-1 bg-neutral-100 dark:bg-neutral-950 p-4">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NewsCard article={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}