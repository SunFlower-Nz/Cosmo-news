import { View, Text, StyleSheet } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        ✅ App funcionando! 
      </Text>
      <Text style={styles.subtext}>
        Configure o NativeWind amanhã
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
});