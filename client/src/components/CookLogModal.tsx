import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarRating from './StarRating';
import { colors, spacing, radius } from '../theme';
import type { CookLogModalProps } from '../types';

export default function CookLogModal({ visible, recipe, onClose, onSubmit }: CookLogModalProps) {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');

  function handleSubmit(): void {
    onSubmit({ recipeId: recipe!.id, rating: rating || null, notes: notes.trim() || null });
    setRating(0);
    setNotes('');
  }

  function handleClose(): void {
    setRating(0);
    setNotes('');
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>I Made This!</Text>
          <Text style={styles.subtitle}>{recipe?.title}</Text>

          {/* Photo placeholder */}
          <TouchableOpacity style={styles.photoPlaceholder} onPress={() => Alert.alert('Coming Soon', 'Photo upload will be available soon.')}>
            <Ionicons name="camera-outline" size={32} color={colors.barkLighter} />
            <Text style={styles.photoText}>Add a photo</Text>
          </TouchableOpacity>

          {/* Rating */}
          <Text style={styles.label}>How was it?</Text>
          <View style={styles.ratingWrap}>
            <StarRating value={rating} onChange={setRating} size={32} />
          </View>

          {/* Notes */}
          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any changes? How did it turn out?"
            placeholderTextColor={colors.barkLighter}
            multiline
          />

          {/* Actions */}
          <TouchableOpacity style={styles.logBtn} onPress={handleSubmit} activeOpacity={0.8}>
            <Text style={styles.logBtnText}>Log Cook</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.cream, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: spacing.xl, paddingTop: 12, maxHeight: '85%',
  },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.barkLighter, alignSelf: 'center', marginBottom: 16 },
  title: { fontFamily: 'DMSerifDisplay', fontSize: 24, color: colors.charcoal, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.barkLight, textAlign: 'center', marginBottom: 20 },
  photoPlaceholder: {
    height: 120, borderRadius: 14, borderWidth: 2, borderStyle: 'dashed',
    borderColor: colors.border, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20,
  },
  photoText: { fontSize: 13, color: colors.barkLighter, marginTop: 6 },
  label: { fontSize: 12, fontWeight: '600', color: colors.barkLight, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  ratingWrap: { alignItems: 'center', marginBottom: 20 },
  notesInput: {
    backgroundColor: colors.white, borderRadius: radius.md, padding: 12,
    fontSize: 14, color: colors.charcoal, borderWidth: 1.5, borderColor: colors.border,
    minHeight: 80, textAlignVertical: 'top', marginBottom: 20,
  },
  logBtn: {
    backgroundColor: colors.amberDeep, borderRadius: radius.md, padding: 16,
    alignItems: 'center', marginBottom: 10,
  },
  logBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cancelBtn: { alignItems: 'center', padding: 8 },
  cancelText: { fontSize: 14, color: colors.barkLight },
});
