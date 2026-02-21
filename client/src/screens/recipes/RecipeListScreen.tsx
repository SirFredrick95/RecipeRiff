import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ScrollView, StyleSheet,
  RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import SortPill from '../../components/SortPill';
import TagPill from '../../components/TagPill';
import RecipeCard from '../../components/RecipeCard';
import { useRecipes } from '../../hooks/useRecipes';
import { colors, spacing } from '../../theme';
import type { RecipesStackParamList } from '../../types/navigation';
import type { RecipeListItem } from '../../types';

const TAGS = ['All', 'Baking', 'Dinner', 'Quick', 'Healthy', 'Dessert', 'Spicy', 'Bread', 'Breakfast'] as const;

type RecipesNavProp = NativeStackNavigationProp<RecipesStackParamList>;

export default function RecipeListScreen(): React.JSX.Element {
  const navigation = useNavigation<RecipesNavProp>();
  const { recipes, loading, fetchRecipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortMode, setSortMode] = useState('default');
  const [activeTag, setActiveTag] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadRecipes = useCallback((search: string) => {
    fetchRecipes({ search: search || undefined, tag: activeTag, sort: sortMode });
  }, [fetchRecipes, activeTag, sortMode]);

  // Debounce search and reload on sort/tag change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => loadRecipes(searchQuery), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [searchQuery, loadRecipes]);

  // Reload on screen focus
  useFocusEffect(useCallback(() => { loadRecipes(searchQuery); }, [loadRecipes, searchQuery]));

  async function handleRefresh(): Promise<void> {
    setRefreshing(true);
    try { await fetchRecipes({ search: searchQuery || undefined, tag: activeTag, sort: sortMode }); }
    finally { setRefreshing(false); }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.container}>
        <Text style={styles.title}>Recipes</Text>

        <View style={styles.searchWrap}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        {/* Sort pills */}
        <View style={styles.sortRow}>
          <SortPill label="All" icon="☰" active={sortMode === 'default'} onPress={() => setSortMode('default')} />
          <SortPill label="Most Cooked" icon="🍳" active={sortMode === 'most-cooked'} onPress={() => setSortMode('most-cooked')} />
          <SortPill label="Recently Cooked" icon="🕐" active={sortMode === 'recently-cooked'} onPress={() => setSortMode('recently-cooked')} />
        </View>

        {/* Tag pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tagRow} style={styles.tagScroll}>
          {TAGS.map(tag => (
            <TagPill key={tag} label={tag} active={activeTag === tag} onPress={() => setActiveTag(tag)} />
          ))}
        </ScrollView>

        {/* Recipe list */}
        <FlatList<RecipeListItem>
          data={recipes}
          renderItem={({ item }) => (
            <RecipeCard recipe={item} onPress={() => navigation.navigate('RecipeDetail', { id: item.id })} />
          )}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={[styles.list, recipes.length === 0 && styles.listEmpty]}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            loading ? (
              <View style={styles.empty}><ActivityIndicator size="large" color={colors.amber} /></View>
            ) : (
              <View style={styles.empty}>
                <Ionicons name="book-outline" size={56} color={colors.barkLighter} />
                <Text style={styles.emptyText}>No recipes yet {'\u2014'} tap + to add your first</Text>
              </View>
            )
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.amber} colors={[colors.amber]} />
          }
        />

        {/* FAB */}
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('RecipeForm')} activeOpacity={0.85}>
          <View style={styles.fabInner}>
            <Ionicons name="add" size={28} color={colors.white} />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  container: { flex: 1, backgroundColor: colors.cream },
  title: { fontFamily: 'DMSerifDisplay', fontSize: 28, color: colors.charcoal, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, paddingBottom: spacing.sm },
  searchWrap: { paddingHorizontal: spacing.xl, marginBottom: spacing.md },
  sortRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, gap: 6, marginBottom: spacing.md },
  tagScroll: { marginBottom: spacing.md, maxHeight: 36 },
  tagRow: { paddingHorizontal: spacing.xl, gap: 8 },
  list: { paddingHorizontal: spacing.xl, paddingBottom: 100 },
  listEmpty: { flexGrow: 1, justifyContent: 'center' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 15, color: colors.barkLight, textAlign: 'center', marginTop: spacing.lg, lineHeight: 22, maxWidth: 240 },
  fab: {
    position: 'absolute', bottom: 24, right: 20, width: 56, height: 56, borderRadius: 28,
    shadowColor: colors.amberDeep, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  fabInner: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.amber,
    alignItems: 'center', justifyContent: 'center',
  },
});
