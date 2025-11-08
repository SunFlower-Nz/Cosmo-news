import { View, Text, Image, TouchableOpacity } from "react-native";

interface NewsCardProps {
  title: string;
  image?: string;
  source: string;
  publishedAt: string;
  category?: string;
  onPress?: () => void;
}

const categoryColors: { [key: string]: string[] } = {
  política: ['#d946ef', '#c026d3'],
  brasil: ['#06b6d4', '#0891b2'],
  mundo: ['#6366f1', '#4f46e5'],
  economia: ['#ec4899', '#db2777'],
  tecnologia: ['#8b5cf6', '#7c3aed'],
  esportes: ['#10b981', '#059669'],
  default: ['#0ea5e9', '#0284c7'],
};

export function NewsCard({ title, image, source, publishedAt, category, onPress }: NewsCardProps) {
  const colors = categoryColors[category?.toLowerCase() || 'default'] || categoryColors.default;
  
  return (
    <TouchableOpacity
      className="mb-3 rounded-3xl overflow-hidden active:opacity-95"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 24,
        elevation: 8,
      }}
      onPress={onPress}
    >
      <View className="p-4">
        <View className="flex-row items-start gap-3">
          {/* Category indicator dot */}
          <View 
            className="mt-1.5 h-3 w-3 rounded-full"
            style={{
              backgroundColor: colors[0],
              shadowColor: colors[0],
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.6,
              shadowRadius: 8,
            }}
          />
          
          <View className="flex-1">
            <Text 
              className="text-white font-semibold text-base leading-6 mb-3"
              numberOfLines={3}
              style={{
                letterSpacing: -0.3,
              }}
            >
              {title}
            </Text>
            
            <View className="flex-row items-center gap-2">
              <Text 
                className="text-xs font-medium"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                {source}
              </Text>
              <View 
                className="h-1 w-1 rounded-full"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
              />
              <Text 
                className="text-xs"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                {publishedAt}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}