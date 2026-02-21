import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import type { IngredientRowProps } from '../types';

export default function IngredientRow({ ingredient, substitution, onPress }: IngredientRowProps): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.6}>
      <View style={styles.content}>
        {substitution ? (
          <>
            <Text style={styles.original}>
              <Text style={styles.strikeQty}>{ingredient.quantity} </Text>
              <Text style={styles.strikeName}>{ingredient.name}</Text>
            </Text>
            <Text style={styles.replacement}>
              <Text style={styles.replQty}>{substitution.quantity} </Text>
              <Text style={styles.replName}>{substitution.name}</Text>
            </Text>
          </>
        ) : (
          <Text style={styles.normal}>
            <Text style={styles.qty}>{ingredient.quantity} </Text>
            <Text style={styles.name}>{ingredient.name}</Text>
          </Text>
        )}
      </View>
      <Ionicons name="swap-horizontal" size={18} color={colors.sageDeep} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 10,
    marginBottom: 6, borderWidth: 1, borderColor: 'rgba(45,41,38,0.04)',
  },
  content: { flex: 1, marginRight: 12 },
  normal: { fontSize: 15 },
  qty: { color: colors.sageDeep, fontWeight: '500' },
  name: { color: colors.charcoal },
  original: { fontSize: 14, textDecorationLine: 'line-through', color: colors.barkLighter },
  strikeQty: { color: colors.barkLighter },
  strikeName: { color: colors.barkLighter },
  replacement: { fontSize: 15, marginTop: 2 },
  replQty: { color: colors.amberDeep, fontWeight: '600' },
  replName: { color: colors.amberDeep, fontWeight: '500' },
});
