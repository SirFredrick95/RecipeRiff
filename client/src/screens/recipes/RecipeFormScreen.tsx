import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors, spacing, radius, tagColors } from '../../theme';
import { useRecipes } from '../../hooks/useRecipes';
import type { RecipesStackParamList } from '../../types/navigation';
import type { FormIngredient, FormDirection } from '../../types';

type Props = NativeStackScreenProps<RecipesStackParamList, 'RecipeForm'>;

const ALL_TAGS = ['Baking', 'Dinner', 'Quick', 'Healthy', 'Dessert', 'Spicy', 'Bread', 'Breakfast'] as const;

export default function RecipeFormScreen({ navigation, route }: Props) {
  const editRecipe = route.params?.recipe || null;
  const isEdit = !!editRecipe;

  const { createRecipe, updateRecipe } = useRecipes();
  const [saving, setSaving] = useState(false);
  const nextKeyRef = useRef(100);

  function getNextKey(prefix: string): string {
    nextKeyRef.current += 1;
    return `${prefix}-${nextKeyRef.current}`;
  }

  const [title, setTitle] = useState(editRecipe?.title || '');
  const [prepTime, setPrepTime] = useState(editRecipe?.prepTime || '');
  const [cookTime, setCookTime] = useState(editRecipe?.cookTime || '');
  const [servings, setServings] = useState(editRecipe?.servings || '');
  const [notes, setNotes] = useState(editRecipe?.notes || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(editRecipe?.tags || []);

  const [ingredients, setIngredients] = useState<FormIngredient[]>(
    editRecipe?.ingredients?.length
      ? editRecipe.ingredients.map((i, idx) => ({ key: `ing-${idx}`, quantity: i.quantity || '', name: i.name }))
      : [{ key: 'ing-0', quantity: '', name: '' }]
  );

  const [directions, setDirections] = useState<FormDirection[]>(
    editRecipe?.directions?.length
      ? editRecipe.directions.map((d, idx) => ({ key: `dir-${idx}`, text: d.text }))
      : [{ key: 'dir-0', text: '' }]
  );

  function toggleTag(tag: string): void {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  }

  function updateIngredient(index: number, field: keyof FormIngredient, value: string): void {
    const updated = [...ingredients];
    updated[index] = { ...updated[index], [field]: value };
    setIngredients(updated);
  }

  function addIngredient(): void {
    setIngredients([...ingredients, { key: getNextKey('ing'), quantity: '', name: '' }]);
  }

  function removeIngredient(index: number): void {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  }

  function updateDirection(index: number, value: string): void {
    const updated = [...directions];
    updated[index] = { ...updated[index], text: value };
    setDirections(updated);
  }

  function addDirection(): void {
    setDirections([...directions, { key: getNextKey('dir'), text: '' }]);
  }

  function removeDirection(index: number): void {
    if (directions.length <= 1) return;
    setDirections(directions.filter((_, i) => i !== index));
  }

  async function handleSave(): Promise<void> {
    if (!title.trim()) {
      Alert.alert('Missing title', 'Please enter a recipe title.');
      return;
    }

    const validIngredients = ingredients.filter(i => i.name.trim());
    const validDirections = directions.filter(d => d.text.trim());

    if (validIngredients.length === 0) {
      Alert.alert('Missing ingredients', 'Please add at least one ingredient.');
      return;
    }

    setSaving(true);
    try {
      const recipeData = {
        title: title.trim(),
        prepTime: prepTime.trim() || null,
        cookTime: cookTime.trim() || null,
        servings: servings.trim() || null,
        notes: notes.trim() || null,
        tags: selectedTags,
        ingredients: validIngredients.map(i => ({
          quantity: i.quantity.trim() || null,
          name: i.name.trim(),
        })),
        directions: validDirections.map((d, i) => ({
          stepNumber: i + 1,
          text: d.text.trim(),
        })),
      };

      if (isEdit && editRecipe) {
        await updateRecipe(editRecipe.id, recipeData);
      } else {
        await createRecipe(recipeData);
      }
      navigation.goBack();
    } catch (err: unknown) {
      Alert.alert('Error', 'Failed to save recipe. Please try again.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEdit ? 'Edit Recipe' : 'Add Recipe'}</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving}>
            {saving ? (
              <ActivityIndicator color={colors.amberDeep} size="small" />
            ) : (
              <Text style={styles.saveText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Classic Banana Bread"
            placeholderTextColor={colors.barkLighter}
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Prep Time</Text>
              <TextInput
                style={styles.input}
                value={prepTime}
                onChangeText={setPrepTime}
                placeholder="15 min"
                placeholderTextColor={colors.barkLighter}
              />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Cook Time</Text>
              <TextInput
                style={styles.input}
                value={cookTime}
                onChangeText={setCookTime}
                placeholder="55 min"
                placeholderTextColor={colors.barkLighter}
              />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Servings</Text>
              <TextInput
                style={styles.input}
                value={servings}
                onChangeText={setServings}
                placeholder="8"
                placeholderTextColor={colors.barkLighter}
              />
            </View>
          </View>

          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagWrap}>
            {ALL_TAGS.map(tag => {
              const active = selectedTags.includes(tag);
              const tc = tagColors[tag] || tagColors.Baking;
              return (
                <TouchableOpacity
                  key={tag}
                  style={[
                    styles.tagOption,
                    active && { backgroundColor: tc.bg, borderColor: tc.text },
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagOptionText, active && { color: tc.text, fontWeight: '600' }]}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Ingredients</Text>
          {ingredients.map((ing, i) => (
            <View key={ing.key} style={styles.ingRow}>
              <TextInput
                style={[styles.input, styles.qtyInput]}
                value={ing.quantity}
                onChangeText={(v) => updateIngredient(i, 'quantity', v)}
                placeholder="Qty"
                placeholderTextColor={colors.barkLighter}
              />
              <TextInput
                style={[styles.input, styles.nameInput]}
                value={ing.name}
                onChangeText={(v) => updateIngredient(i, 'name', v)}
                placeholder="Ingredient"
                placeholderTextColor={colors.barkLighter}
              />
              {ingredients.length > 1 && (
                <TouchableOpacity onPress={() => removeIngredient(i)} style={styles.removeBtn}>
                  <Ionicons name="close-circle" size={20} color={colors.barkLighter} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={addIngredient} style={styles.addBtn}>
            <Ionicons name="add" size={16} color={colors.amberDeep} />
            <Text style={styles.addBtnText}>Add ingredient</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Directions</Text>
          {directions.map((dir, i) => (
            <View key={dir.key} style={styles.dirRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>{i + 1}</Text>
              </View>
              <TextInput
                style={[styles.input, styles.dirInput]}
                value={dir.text}
                onChangeText={(v) => updateDirection(i, v)}
                placeholder={`Step ${i + 1}...`}
                placeholderTextColor={colors.barkLighter}
                multiline
              />
              {directions.length > 1 && (
                <TouchableOpacity onPress={() => removeDirection(i)} style={styles.removeBtn}>
                  <Ionicons name="close-circle" size={20} color={colors.barkLighter} />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity onPress={addDirection} style={styles.addBtn}>
            <Ionicons name="add" size={16} color={colors.amberDeep} />
            <Text style={styles.addBtnText}>Add step</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Optional tips, variations, or personal notes..."
            placeholderTextColor={colors.barkLighter}
            multiline
          />

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  cancelText: { fontSize: 15, color: colors.barkLight },
  headerTitle: { fontFamily: 'DMSerifDisplay', fontSize: 18, color: colors.charcoal },
  saveText: { fontSize: 15, color: colors.amberDeep, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.xl },
  label: {
    fontSize: 12, fontWeight: '600', color: colors.barkLight,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, marginTop: 16,
  },
  input: {
    backgroundColor: colors.white, borderRadius: radius.sm, padding: 12,
    fontSize: 14, color: colors.charcoal,
    borderWidth: 1.5, borderColor: colors.border,
  },
  row: { flexDirection: 'row', gap: 8 },
  rowItem: { flex: 1 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagOption: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.pill,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white,
  },
  tagOptionText: { fontSize: 13, color: colors.barkLight },
  ingRow: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'center' },
  qtyInput: { width: 70 },
  nameInput: { flex: 1 },
  dirRow: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'flex-start' },
  stepBadge: {
    width: 24, height: 24, borderRadius: 12, marginTop: 10,
    backgroundColor: 'rgba(245,158,11,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  stepBadgeText: { fontSize: 12, fontWeight: '600', color: colors.amberDeep },
  dirInput: { flex: 1, minHeight: 44 },
  removeBtn: { padding: 4, marginTop: 8 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 8 },
  addBtnText: { fontSize: 14, color: colors.amberDeep, fontWeight: '600' },
  notesInput: { minHeight: 80, textAlignVertical: 'top' },
});
