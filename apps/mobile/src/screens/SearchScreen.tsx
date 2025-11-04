import { useState } from "react";
import { View, TextInput, Text, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useSearchFeed } from "../hooks/useSearchFeed";
import { NewsCard } from "../components/NewsCard";

const categories = ["Mundo", "Tecnologia", "Esportes", "Saúde", "Ciência", "Entretenimento"];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const { data, isLoading, error, refetch } = useSearchFeed(query, category);

  const handleSearch = () => {
    refetch();
  };

  return (
    <View className="flex-1 bg-white p-4">
      {/* Campo de busca */}
      <View className="flex-row items-center mb-3">
        <TextInput
          placeholder="Buscar notícias..."
          value={query}
          onChangeText={setQuery}
          className="flex-1 border border-neutral-300 rounded-xl px-3 py-2 text-base text-neutral-800"
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} className="ml-2 bg-blue-600 rounded-xl px-4 py-2">
          <Text className="text-white font-semibold">Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros rápidos */}
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setCategory(item === category ? undefined : item)}
            className={`px-4 py-2 mr-2 rounded-full border ${
              item === category ? "bg-blue-600 border-blue-600" : "border-neutral-300"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                item === category ? "text-white" : "text-neutral-700"
              }`}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
        className="mb-4"
      />

      {/* Resultados */}
      {isLoading ? (
        <ActivityIndicator className="mt-10" size="large" color="#2563EB" />
      ) : error ? (
        <Text className="text-red-500 text-center mt-10">Erro ao buscar notícias 😢</Text>
      ) : data?.length ? (
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
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text className="text-neutral-500 text-center mt-10">
          {query ? "Nenhum resultado encontrado" : "Digite algo para buscar notícias"}
        </Text>
      )}
    </View>
  );
}
