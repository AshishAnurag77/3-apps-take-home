import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TripStop, Colors, Radius, FontWeight, FontSize } from '@clear-energy/shared';

interface StopBadgeProps {
  stop: TripStop;
}

export function StopBadge({ stop }: StopBadgeProps): React.JSX.Element {
  const isDone = stop.status === 'done';
  const isActive = stop.status === 'active';

  return (
    <View
      style={[
        styles.badge,
        isDone && styles.badgeDone,
        isActive && styles.badgeActive,
        !isDone && !isActive && styles.badgePending,
      ]}
    >
      {isDone ? (
        <Text style={[styles.icon, styles.iconDone]}>✓</Text>
      ) : (
        <Text style={[styles.seq, isActive && styles.seqActive]}>
          {stop.seq}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDone: {
    backgroundColor: Colors.successBg,
  },
  badgeActive: {
    backgroundColor: Colors.brand,
  },
  badgePending: {
    backgroundColor: Colors.border,
  },
  icon: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  iconDone: {
    color: Colors.brandDark,
  },
  seq: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textSecondary,
  },
  seqActive: {
    color: Colors.surface,
  },
});
