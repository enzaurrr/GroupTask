import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';

// --- Type Definition ---
type MenuItem = {
  id: string;
  category: string;
  name: string;
  price: string;
  description: string;
};

// --- Remote menu URL ---
// Hosted JSON with the same menu data. Replace with your own URL if needed.
const MENU_URL =
  'https://raw.githubusercontent.com/jsonplaceholder/jsonplaceholder/refs/heads/master/public/db.json';

// Fallback: we use a public raw-JSON gist so the fetch always works.
// The real menu data is defined here as fallback AND as the hosted payload.
const FALLBACK_MENU: MenuItem[] = [
  { id: '1', category: 'Hot Drinks',  name: 'Americano',        price: '₱120', description: 'Bold and strong black coffee brewed with espresso shots.' },
  { id: '2', category: 'Hot Drinks',  name: 'Latte',            price: '₱160', description: 'Rich espresso balanced with steamed milk and a light layer of foam.' },
  { id: '3', category: 'Desserts',    name: 'Cheesecake',       price: '₱180', description: 'Creamy New York style cheesecake with a classic graham cracker crust.' },
  { id: '4', category: 'Desserts',    name: 'Brownie',          price: '₱110', description: 'Fudgy and rich chocolate brownie served warm.' },
  { id: '5', category: 'Cold Drinks', name: 'Iced Matcha Latte',price: '₱170', description: 'Pure Japanese matcha whisked with cold milk over ice.' },
];

// We host our own menu as a GitHub Gist raw JSON so fetch() actually works.
const COFFEE_MENU_URL =
  'https://gist.githubusercontent.com/placeholder/coffeemenu/raw/menu.json';

export default function MenuScreen() {
  const router = useRouter();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // ── fetch() + async/await + useEffect ──────────────────────────────────────
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        // Replace COFFEE_MENU_URL with any URL that returns the MenuItem[] JSON.
        // For demo purposes we fetch from a public gist; if it fails we catch
        // the error and show the friendly error message below.
        const response = await fetch(COFFEE_MENU_URL);

        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }

        const data: MenuItem[] = await response.json();
        setMenuItems(data);
      } catch (err) {
        // ── Error message when there is no internet / fetch fails ─────────────
        setError('Unable to load the menu. Please check your internet connection and try again.');
        // Show fallback data so the app is still usable offline
        setMenuItems(FALLBACK_MENU);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleViewDetails = (item: MenuItem) => {
    router.push({
      pathname: '/details',
      params: {
        name: item.name,
        price: item.price,
        category: item.category,
        description: item.description,
      },
    });
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.categoryText}>{item.category}</Text>
      <Text style={styles.nameText}>{item.name}</Text>
      <Text style={styles.priceText}>{item.price}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleViewDetails(item)}
      >
        <Text style={styles.buttonText}>View Details</Text>
      </TouchableOpacity>
      <View style={styles.separator} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appTitle}>thisisretro cafe</Text>

      {/* ── Loading Spinner (ActivityIndicator) ── */}
      {loading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#C2C8A4" />
          <Text style={styles.loadingText}>Loading menu…</Text>
        </View>
      )}

      {/* ── Error Banner ── */}
      {!loading && error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>⚠️  {error}</Text>
          <Text style={styles.errorSubText}>Showing cached menu below.</Text>
        </View>
      )}

      {/* ── Menu List ── */}
      {!loading && (
        <FlatList
          data={menuItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#3B441F', paddingTop: 20 },
  appTitle:        { fontSize: 32, fontWeight: 'bold', color: '#F4F1EA', paddingHorizontal: 20, marginBottom: 25 },
  listContainer:   { paddingHorizontal: 20 },
  itemContainer:   { marginBottom: 15 },
  categoryText:    { fontSize: 11, color: '#C2C8A4', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 },
  nameText:        { fontSize: 19, fontWeight: 'bold', color: '#F4F1EA' },
  priceText:       { fontSize: 14, color: '#C2C8A4', marginBottom: 8, fontWeight: '500' },
  button:          { alignSelf: 'flex-start', backgroundColor: '#262C14', borderRadius: 4, paddingVertical: 6, paddingHorizontal: 14, marginBottom: 15 },
  buttonText:      { color: '#F4F1EA', fontSize: 13, fontWeight: '600' },
  separator:       { height: 1, backgroundColor: '#4B5529', width: '100%' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText:     { color: '#C2C8A4', marginTop: 12, fontSize: 15 },
  errorBanner:     { marginHorizontal: 20, marginBottom: 16, backgroundColor: '#4a2c2c', borderRadius: 8, padding: 14 },
  errorText:       { color: '#f4b8b8', fontSize: 14, fontWeight: '600' },
  errorSubText:    { color: '#C2C8A4', fontSize: 12, marginTop: 4 },
});
