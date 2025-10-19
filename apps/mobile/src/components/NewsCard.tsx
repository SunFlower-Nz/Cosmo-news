import { View, Text, Image, TouchableOpacity } from "react-native";

interface NewsCardProps {
  title: string;
  image?: string;
  source: string;
  publishedAt: string;
  onPress?: () => void;
}

export function NewsCard({ title, image, source, publishedAt, onPress }: NewsCardProps) {
  return (
    <TouchableOpacity
      className="bg-white dark:bg-neutral-900 p-3 mb-3 rounded-2xl shadow-sm active:opacity-80"
      onPress={onPress}
    >
      {image && (
        <Image
          source={{ uri: image }}
          className="w-full h-48 rounded-xl mb-3"
          resizeMode="cover"
        />
      )}
      <Text className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
        {title}
      </Text>
      <View className="flex-row justify-between">
        <Text className="text-sm text-neutral-500">{source}</Text>
        <Text className="text-sm text-neutral-500">{publishedAt}</Text>
      </View>
    </TouchableOpacity>
  );
}