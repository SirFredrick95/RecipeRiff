import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';
import type { SortPillProps } from '../types';

export default function SortPill({ label, icon, active, onPress }: SortPillProps) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.active]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10,
    borderWidth: 1.5, borderColor: 'rgba(45,41,38,0.08)',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  active: {
    backgroundColor: 'rgba(45,41,38,0.06)',
    borderColor: 'rgba(45,41,38,0.15)',
  },
  icon: { fontSize: 13 },
  text: { fontSize: 12, fontWeight: '500', color: colors.barkLight },
  activeText: { color: colors.charcoal, fontWeight: '600' },
});
