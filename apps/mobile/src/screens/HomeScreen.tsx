import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Dimensions } from "react-native";
import { useFeed } from "../hooks/useFeed";
import { NewsCard } from "../components/NewsCard";
import { useState } from "react";

const { width } = Dimensions.get('window');

// Starfield component for cosmic background
const Starfield = () => {
  const stars = Array.from({ length: 80 }, (_, i) => {
    const size = Math.random() * 2 + 0.5;
    return {
      left: Math.random() * width,
      top: Math.random() * 800,
      width: size,
      height: size,
      opacity: Math.random() * 0.7 + 0.1,
    };
  });

  return (
    <View className="absolute inset-0 opacity-30" pointerEvents="none">
      {stars.map((star, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            left: star.left,
            top: star.top,
            width: star.width,
            height: star.height,
            borderRadius: star.width / 2,
            backgroundColor: 'white',
            opacity: star.opacity,
          }}
        />
      ))}
    </View>
  );
};

export default function HomeScreen() {
  const { data, isLoading, error, refetch } = useFeed();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return (
      <View 
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: '#0C0F1F',
        }}
      >
        <Starfield />
        <View className="items-center">
          <View 
            className="rounded-full p-6 mb-4"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            <ActivityIndicator size="large" color="#06b6d4" />
          </View>
          <Text 
            className="font-medium text-base"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Carregando notícias...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View 
        className="flex-1 justify-center items-center p-6"
        style={{
          backgroundColor: '#0C0F1F',
        }}
      >
        <Starfield />
        <View 
          className="rounded-3xl p-8 items-center max-w-sm"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <Text className="text-6xl mb-4">😢</Text>
          <Text 
            className="text-xl font-bold mb-3 text-center"
            style={{ color: '#ef4444' }}
          >
            Erro ao carregar notícias
          </Text>
          <Text 
            className="text-center mb-4"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            {(error as any).message || "Tente novamente mais tarde"}
          </Text>
          <TouchableOpacity 
            onPress={() => refetch()}
            className="px-6 py-3 rounded-full"
            style={{
              backgroundColor: '#06b6d4',
            }}
          >
            <Text className="text-white font-semibold">Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View 
      className="flex-1"
      style={{
        backgroundColor: '#0C0F1F',
      }}
    >
      <Starfield />
      
      {/* Cosmic Header - Liquid Glass Effect */}
      <View 
        className="pt-12 pb-4 px-5"
        style={{
          backgroundColor: 'transparent',
        }}
      >
        <View 
          className="rounded-2xl p-4 mb-3"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.45,
            shadowRadius: 40,
          }}
        >
          <View className="flex-row items-center justify-between mb-2">
            <View className="flex-1">
              <Text 
                className="text-3xl font-semibold tracking-tight"
                style={{ color: '#fff' }}
              >
                Cosmo{' '}
                <Text style={{ color: '#67e8f9' }}>
                  News
                </Text>
                {' '}🌍
              </Text>
              <Text 
                className="text-xs mt-1"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                Explorar o universo das notícias
              </Text>
            </View>
          </View>
        </View>

        {/* Greeting Card */}
        <View 
          className="rounded-2xl p-4"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.1)',
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 30,
          }}
        >
          <Text 
            className="text-sm"
            style={{ color: 'rgba(255, 255, 255, 0.7)' }}
          >
            Hoje
          </Text>
          <Text 
            className="text-lg font-semibold mt-1"
            style={{ color: '#fff' }}
          >
            Boa noite, Cosmonauta 🚀
          </Text>
          <Text 
            className="text-xs mt-1"
            style={{ color: 'rgba(255, 255, 255, 0.6)' }}
          >
            Resumo cósmico: {data?.length || 0} manchetes em destaque
          </Text>
        </View>
      </View>

      {/* News List */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NewsCard
            title={item.title}
            image={item.imageUrl}
            source={item.source?.name || "Fonte desconhecida"}
            publishedAt={new Date(item.publishedAt).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'short',
            })}
            category={item.categories?.[0]?.category?.name}
          />
        )}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={["#06b6d4"]}
            tintColor="#06b6d4"
          />
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-6xl mb-4">📭</Text>
            <Text 
              className="text-lg font-medium"
              style={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              Nenhuma notícia disponível
            </Text>
          </View>
        }
      />
    </View>
  );
}
