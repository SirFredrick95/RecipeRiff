import React, { useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, radius } from '../../theme';
import { useStats } from '../../hooks/useStats';

function getActivityLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4;
}

export default function StatsScreen(): React.JSX.Element {
  const { stats, loading, fetchStats } = useStats();

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [fetchStats])
  );

  if (loading && !stats) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator color={colors.amberDeep} size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (!stats) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Stats</Text>
        <View style={styles.center}>
          <Text style={styles.empty}>Start cooking to see your stats!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Stats</Text>

        {/* Streak */}
        <View style={styles.streakCard}>
          <Text style={{ fontSize: 36, marginBottom: 4 }}>🔥</Text>
          <Text style={styles.streakNum}>{stats.streak}</Text>
          <Text style={styles.streakLabel}>Day Cooking Streak</Text>
          {stats.streak > 0 && <Text style={styles.streakSub}>Keep it going!</Text>}
        </View>

        {/* Stat Grid */}
        <View style={styles.statGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{stats.mealsThisMonth}</Text>
            <Text style={styles.statLabel}>Meals This Month</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{stats.uniqueRecipesCooked}</Text>
            <Text style={styles.statLabel}>Unique Recipes</Text>
          </View>
        </View>

        {/* Most Cooked */}
        {stats.mostCooked.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Most Cooked</Text>
            {stats.mostCooked.map((item, i) => (
              <View key={item.recipeId} style={styles.mostCookedRow}>
                <Text style={styles.rankNum}>{i + 1}</Text>
                <Text style={styles.recipeName} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.countText}>{item.count}x</Text>
              </View>
            ))}
          </View>
        )}

        {/* Activity Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Month</Text>
          <View style={styles.activityGrid}>
            {(stats.activityGrid || []).map((day) => {
              const level = getActivityLevel(day.count);
              return (
                <View
                  key={day.date}
                  style={[
                    styles.activityDot,
                    level === 0 && styles.dotL0,
                    level === 1 && styles.dotL1,
                    level === 2 && styles.dotL2,
                    level === 3 && styles.dotL3,
                    level === 4 && styles.dotL4,
                  ]}
                />
              );
            })}
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.xl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: 'DMSerifDisplay', fontSize: 28, color: colors.charcoal, marginBottom: 16 },
  empty: { fontSize: 15, color: colors.barkLight },

  streakCard: {
    alignItems: 'center', padding: 20, borderRadius: radius.lg,
    backgroundColor: colors.amberLight, marginBottom: 16,
  },
  streakNum: { fontFamily: 'DMSerifDisplay', fontSize: 48, color: colors.amberDeep },
  streakLabel: { fontSize: 14, fontWeight: '600', color: colors.charcoal, marginTop: 2 },
  streakSub: { fontSize: 12, color: colors.clay, marginTop: 4 },

  statGrid: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statBox: {
    flex: 1, padding: 16, borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center',
  },
  statNum: { fontFamily: 'DMSerifDisplay', fontSize: 28, color: colors.charcoal },
  statLabel: { fontSize: 11, color: colors.barkLight, marginTop: 4 },

  section: { marginBottom: 20 },
  sectionTitle: { fontFamily: 'DMSerifDisplay', fontSize: 18, color: colors.charcoal, marginBottom: 12 },

  mostCookedRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
    paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.sm, marginBottom: 6,
  },
  rankNum: { width: 24, fontSize: 14, fontWeight: '600', color: colors.amberDeep },
  recipeName: { flex: 1, fontSize: 14, color: colors.charcoal },
  countText: { fontSize: 13, color: colors.barkLight, fontWeight: '500' },

  activityGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 4,
  },
  activityDot: {
    width: '13%', aspectRatio: 1, borderRadius: 4,
  },
  dotL0: { backgroundColor: 'rgba(45,41,38,0.06)' },
  dotL1: { backgroundColor: 'rgba(94,140,74,0.2)' },
  dotL2: { backgroundColor: 'rgba(94,140,74,0.4)' },
  dotL3: { backgroundColor: 'rgba(94,140,74,0.7)' },
  dotL4: { backgroundColor: 'rgba(94,140,74,1)' },
});
