import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radius, tagColors, recipeGradients } from '../theme';
import type { RecipeCardProps } from '../types';

export default function RecipeCard({ recipe, onPress }: RecipeCardProps): React.JSX.Element {
  const gradientIndex = (recipe.id || 0) % recipeGradients.length;
  const [color1] = recipeGradients[gradientIndex];

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.imageArea, { backgroundColor: color1 }]} />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={1}>{recipe.title}</Text>
        <View style={styles.tags}>
          {(recipe.tags || []).slice(0, 3).map(tag => {
            const tc = tagColors[tag] || { bg: 'rgba(245,158,11,0.12)', text: '#D97706' };
            return (
              <View key={tag} style={[styles.miniTag, { backgroundColor: tc.bg }]}>
                <Text style={[styles.miniTagText, { color: tc.text }]}>{tag}</Text>
              </View>
            );
          })}
        </View>
        <View style={styles.meta}>
          <Text style={styles.metaText}>🍳 Cooked {recipe.cookCount || 0}x</Text>
          {recipe.avgRating != null && (
            <Text style={styles.metaText}>⭐ {recipe.avgRating}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.card, backgroundColor: 'rgba(255,255,255,0.7)',
    overflow: 'hidden', marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 12, elevation: 2,
  },
  imageArea: { height: 140 },
  body: { padding: 14 },
  title: { fontFamily: 'DMSerifDisplay', fontSize: 18, color: colors.charcoal, marginBottom: 6 },
  tags: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  miniTag: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  miniTagText: { fontSize: 11, fontWeight: '600' },
  meta: { flexDirection: 'row', gap: 16 },
  metaText: { fontSize: 12, color: colors.barkLight },
});
