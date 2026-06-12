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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── AsyncStorage keys ─────────────────────────────────────────────────────────
const CART_NOTE_KEY    = '@cart_special_instruction';
const CART_NOTE_TS_KEY = '@cart_special_instruction_ts';

export default function OrdersScreen() {
  const [instruction, setInstruction]     = useState('');
  const [savedNote, setSavedNote]         = useState<string | null>(null);
  const [savedNoteTime, setSavedNoteTime] = useState<string | null>(null);

  // ── Load persisted note on mount (AsyncStorage.getItem) ───────────────────
  useEffect(() => {
    const loadNote = async () => {
      try {
        const note      = await AsyncStorage.getItem(CART_NOTE_KEY);
        const timestamp = await AsyncStorage.getItem(CART_NOTE_TS_KEY);
        if (note !== null) {
          setSavedNote(note);
          setSavedNoteTime(timestamp);
        }
      } catch (e) {
        console.error('Failed to load cart note:', e);
      }
    };
    loadNote();
  }, []);

  // ── Save note to AsyncStorage (JSON.stringify for timestamp object) ────────
  const handleSaveNote = async () => {
    if (!instruction.trim()) {
      Alert.alert('Empty Note', 'Please enter a special instruction first.');
      return;
    }
    try {
      const now = new Date();
      // JSON.stringify / JSON.parse used for the timestamp data
      const timeString = JSON.stringify({
        hour:   now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
      });

      await AsyncStorage.setItem(CART_NOTE_KEY, instruction.trim());
      await AsyncStorage.setItem(CART_NOTE_TS_KEY, timeString);

      // Parse back the saved time to display it
      const parsed = JSON.parse(timeString);
      const formattedTime = formatTime(parsed.hour, parsed.minute, parsed.second);

      setSavedNote(instruction.trim());
      setSavedNoteTime(formattedTime);
      setInstruction('');
    } catch (e) {
      Alert.alert('Error', 'Could not save the note. Please try again.');
      console.error('Failed to save cart note:', e);
    }
  };

  const formatTime = (h: number, m: number, s: number): string => {
    const period  = h >= 12 ? 'PM' : 'AM';
    const hour12  = h % 12 === 0 ? 12 : h % 12;
    const mm      = String(m).padStart(2, '0');
    const ss      = String(s).padStart(2, '0');
    return `${hour12}:${mm}:${ss} ${period}`;
  };

  const handleViewOrderSummary = () => {
    Alert.alert('Order Summary', savedNote ? `Special instruction:\n"${savedNote}"` : 'No special instructions saved.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* ── Header ── */}
          <View style={styles.header}>
            <Text style={styles.cartIcon}>🛒</Text>
            <Text style={styles.titleText}>Cart Screen</Text>
          </View>

          {/* ── Special Instructions Input ── */}
          <View style={styles.card}>
            <Text style={styles.label}>SPECIAL INSTRUCTIONS:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Extra sugar, no ice…"
              placeholderTextColor="#8a9a70"
              value={instruction}
              onChangeText={setInstruction}
              multiline
            />
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveNote}>
              <Text style={styles.saveButtonText}>Save Note</Text>
            </TouchableOpacity>

            {/* ── Persisted note display ── */}
            {savedNote !== null && (
              <View style={styles.savedNoteBox}>
                <Text style={styles.savedNoteLabel}>LAST SAVED NOTE:</Text>
                <Text style={styles.savedNoteText}>{savedNote}</Text>
                {savedNoteTime && (
                  <Text style={styles.savedNoteTimestamp}>Saved at {savedNoteTime}</Text>
                )}
              </View>
            )}

            <TouchableOpacity style={styles.summaryButton} onPress={handleViewOrderSummary}>
              <Text style={styles.summaryButtonText}>View Order Summary</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#3B441F' },
  scrollContent:      { padding: 20, paddingTop: 30 },
  header:             { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  cartIcon:           { fontSize: 22, marginRight: 8 },
  titleText:          { fontSize: 28, fontWeight: 'bold', color: '#F4F1EA' },

  card:               { backgroundColor: '#2e3618', borderRadius: 12, padding: 18, borderWidth: 1, borderColor: '#4B5529' },
  label:              { fontSize: 10, color: '#C2C8A4', fontWeight: '700', letterSpacing: 1.2, marginBottom: 8, textTransform: 'uppercase' },
  input:              { backgroundColor: '#3B441F', borderRadius: 8, borderWidth: 1, borderColor: '#4B5529', color: '#F4F1EA', fontSize: 15, padding: 12, minHeight: 48, marginBottom: 14 },

  saveButton:         { backgroundColor: '#3d5a1e', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginBottom: 16 },
  saveButtonText:     { color: '#F4F1EA', fontWeight: '700', fontSize: 15 },

  savedNoteBox:       { borderWidth: 1, borderColor: '#4B5529', borderRadius: 8, padding: 12, marginBottom: 16, backgroundColor: '#323c1a' },
  savedNoteLabel:     { fontSize: 9, color: '#C2C8A4', fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 4 },
  savedNoteText:      { color: '#F4F1EA', fontSize: 15, fontWeight: '600' },
  savedNoteTimestamp: { color: '#8a9a70', fontSize: 11, marginTop: 4 },

  summaryButton:      { backgroundColor: '#262C14', borderRadius: 8, paddingVertical: 14, alignItems: 'center' },
  summaryButtonText:  { color: '#C2C8A4', fontWeight: '700', fontSize: 14 },
});
