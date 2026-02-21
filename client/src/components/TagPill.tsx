import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, radius, tagColors } from '../theme';
import type { TagPillProps } from '../types';

export default function TagPill({ label, active, onPress }: TagPillProps) {
  const tc = tagColors[label] || { bg: 'rgba(245,158,11,0.12)', text: '#D97706' };
  return (
    <TouchableOpacity
      style={[styles.pill, active && { backgroundColor: tc.bg, borderColor: tc.text }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, active && { color: tc.text, fontWeight: '600' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.pill,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white,
  },
  text: { fontSize: 13, fontWeight: '500', color: colors.barkLight },
});
