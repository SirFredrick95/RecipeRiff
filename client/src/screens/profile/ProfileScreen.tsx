import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { colors, spacing, radius } from '../../theme';
import type { MenuItemProps } from '../../types';

export default function ProfileScreen(): React.JSX.Element {
  const { user, logout } = useAuth();

  function handleLogout(): void {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  }

  const initial = (user?.displayName || 'U')[0].toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <Text style={styles.name}>{user?.displayName || 'User'}</Text>
          <Text style={styles.email}>{user?.email || ''}</Text>
        </View>

        <View style={styles.menu}>
          <MenuItem icon="settings-outline" label="Settings" onPress={() => Alert.alert('Coming Soon', 'Settings will be available in a future update.')} />
          <MenuItem icon="leaf-outline" label="Dietary Preferences" onPress={() => Alert.alert('Coming Soon', 'Set dietary preferences in a future update.')} />
          <MenuItem icon="help-circle-outline" label="Help & Feedback" onPress={() => Alert.alert('Coming Soon', 'Help center coming soon.')} />
          <MenuItem icon="log-out-outline" label="Sign Out" onPress={handleLogout} danger />
        </View>

        <Text style={styles.version}>SubChef v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress, danger }: MenuItemProps): React.JSX.Element {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.6}>
      <View style={[styles.menuIcon, danger && { backgroundColor: 'rgba(231,76,60,0.08)' }]}>
        <Ionicons name={icon as 'settings-outline'} size={18} color={danger ? colors.danger : colors.amberDeep} />
      </View>
      <Text style={[styles.menuText, danger && { color: colors.danger }]}>{label}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.barkLighter} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  content: { padding: spacing.xl },
  header: { alignItems: 'center', paddingVertical: 24, marginBottom: 8 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, marginBottom: 12,
    backgroundColor: colors.amberDeep,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: 'DMSerifDisplay', fontSize: 32, color: colors.white },
  name: { fontFamily: 'DMSerifDisplay', fontSize: 24, color: colors.charcoal },
  email: { fontSize: 13, color: colors.barkLight, marginTop: 2 },
  menu: {
    backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: radius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  menuIcon: {
    width: 36, height: 36, borderRadius: 10, marginRight: 14,
    backgroundColor: 'rgba(245,158,11,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  menuText: { flex: 1, fontSize: 15, color: colors.charcoal },
  version: { textAlign: 'center', marginTop: 32, fontSize: 12, color: colors.barkLighter },
});
