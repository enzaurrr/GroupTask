import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── AsyncStorage key ──────────────────────────────────────────────────────────
const PROFILE_NAME_KEY = '@profile_name';

export default function ProfileScreen() {
  const [nameInput, setNameInput]   = useState('');
  const [savedName, setSavedName]   = useState<string | null>(null);
  const [isEditing, setIsEditing]   = useState(false);

  // ── Load saved name on mount ───────────────────────────────────────────────
  useEffect(() => {
    const loadName = async () => {
      try {
        const name = await AsyncStorage.getItem(PROFILE_NAME_KEY);
        if (name !== null) {
          setSavedName(name);
        }
      } catch (e) {
        console.error('Failed to load profile name:', e);
      }
    };
    loadName();
  }, []);

  // ── Save name to AsyncStorage ──────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!nameInput.trim()) {
      Alert.alert('Empty Name', 'Please enter your name first.');
      return;
    }
    try {
      await AsyncStorage.setItem(PROFILE_NAME_KEY, nameInput.trim());
      setSavedName(nameInput.trim());
      setNameInput('');
      setIsEditing(false);
    } catch (e) {
      Alert.alert('Error', 'Could not save your name. Please try again.');
      console.error('Failed to save profile name:', e);
    }
  };

  // ── Clear saved name ───────────────────────────────────────────────────────
  const handleClearName = async () => {
    try {
      await AsyncStorage.removeItem(PROFILE_NAME_KEY);
      setSavedName(null);
      setIsEditing(true);
    } catch (e) {
      console.error('Failed to clear profile name:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* ── Header ── */}
          <Text style={styles.title}>Profile</Text>

          {/* ── Avatar ── */}
          <View style={styles.avatarContainer}>
            <Image
              source={require('@/assets/images/profile.jpg')}
              style={styles.avatar}
            />
            {savedName && (
              <Text style={styles.greetingText}>Hello, {savedName}! ☕</Text>
            )}
          </View>

          {/* ── Name Card ── */}
          <View style={styles.card}>
            <Text style={styles.label}>YOUR NAME</Text>

            {/* Show saved name OR the edit input */}
            {savedName && !isEditing ? (
              <>
                <View style={styles.savedNameBox}>
                  <Text style={styles.savedNameText}>{savedName}</Text>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => { setIsEditing(true); setNameInput(savedName); }}
                >
                  <Text style={styles.editButtonText}>Edit Name</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearButton} onPress={handleClearName}>
                  <Text style={styles.clearButtonText}>Clear Profile</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name…"
                  placeholderTextColor="#8a9a70"
                  value={nameInput}
                  onChangeText={setNameInput}
                  autoCapitalize="words"
                />
                <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
                  <Text style={styles.saveButtonText}>Save Name</Text>
                </TouchableOpacity>
                {isEditing && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => { setIsEditing(false); setNameInput(''); }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* ── Info note ── */}
          <Text style={styles.infoText}>
            Your name is saved to device storage and will still be here after you close the app.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:       { flex: 1, backgroundColor: '#3B441F' },
  scrollContent:   { padding: 20, paddingTop: 30 },
  title:           { fontSize: 32, fontWeight: 'bold', color: '#F4F1EA', marginBottom: 24 },

  avatarContainer: { alignItems: 'center', marginBottom: 28 },
  avatar:          { width: 96, height: 96, borderRadius: 48, borderWidth: 3, borderColor: '#C2C8A4' },
  greetingText:    { color: '#C2C8A4', fontSize: 16, fontWeight: '600', marginTop: 12 },

  card:            { backgroundColor: '#2e3618', borderRadius: 12, padding: 18, borderWidth: 1, borderColor: '#4B5529', marginBottom: 20 },
  label:           { fontSize: 10, color: '#C2C8A4', fontWeight: '700', letterSpacing: 1.2, marginBottom: 10, textTransform: 'uppercase' },

  input:           { backgroundColor: '#3B441F', borderRadius: 8, borderWidth: 1, borderColor: '#4B5529', color: '#F4F1EA', fontSize: 16, padding: 12, marginBottom: 14 },
  saveButton:      { backgroundColor: '#3d5a1e', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginBottom: 10 },
  saveButtonText:  { color: '#F4F1EA', fontWeight: '700', fontSize: 15 },

  savedNameBox:    { backgroundColor: '#3B441F', borderRadius: 8, borderWidth: 1, borderColor: '#4B5529', padding: 14, marginBottom: 14 },
  savedNameText:   { color: '#F4F1EA', fontSize: 18, fontWeight: '700' },

  editButton:      { backgroundColor: '#3d5a1e', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginBottom: 10 },
  editButtonText:  { color: '#F4F1EA', fontWeight: '700', fontSize: 14 },
  clearButton:     { backgroundColor: '#262C14', borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  clearButtonText: { color: '#C2C8A4', fontWeight: '600', fontSize: 14 },
  cancelButton:    { backgroundColor: '#262C14', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  cancelButtonText:{ color: '#C2C8A4', fontWeight: '600', fontSize: 14 },

  infoText:        { color: '#8a9a70', fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
