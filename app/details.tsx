import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function DetailScreen() {
  const router = useRouter();
  // route.params working: gathering parameters passed from the menu screen
  const { name, price, category, description } = useLocalSearchParams();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.categoryText}>{category}</Text>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.priceText}>{price}</Text>
        <Text style={styles.descriptionText}>{description}</Text>

        {/* navigation.goBack working: button pops back down the stack layer */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back to Menu</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#3B441F', justifyContent: 'center' },
  contentContainer: { paddingHorizontal: 30 },
  categoryText: { fontSize: 12, color: '#C2C8A4', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },
  nameText: { fontSize: 32, fontWeight: 'bold', color: '#F4F1EA', marginBottom: 5 },
  priceText: { fontSize: 20, color: '#C2C8A4', fontWeight: '600', marginBottom: 20 },
  descriptionText: { fontSize: 16, color: '#F4F1EA', lineHeight: 24, marginBottom: 40 },
  backButton: { backgroundColor: '#262C14', borderRadius: 6, paddingVertical: 12, alignItems: 'center', width: '100%' },
  backButtonText: { color: '#F4F1EA', fontSize: 15, fontWeight: '600' },
});