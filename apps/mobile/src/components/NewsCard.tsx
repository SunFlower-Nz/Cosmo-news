import { View, Text, Image, TouchableOpacity } from "react-native";

type NewsCardProps = {
  article: {
    id: string;
    title: string;
    description?: string;
    imageUrl?: string;
    source?: { name: string };
  };
};

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <TouchableOpacity className="bg-white dark:bg-neutral-900 rounded-2xl shadow p-3 mb-3">
      {article.imageUrl ? (
        <Image
          source={{ uri: article.imageUrl }}
          className="h-48 w-full rounded-xl mb-3"
          resizeMode="cover"
        />
      ) : null}

      <Text className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">
        {article.title}
      </Text>

      {article.source?.name && (
        <Text className="text-sm text-neutral-500">
          {article.source.name}
        </Text>
      )}
    </TouchableOpacity>
  );
}