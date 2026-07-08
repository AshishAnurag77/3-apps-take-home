import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Radius } from '@clear-energy/shared';

/**
 * Decorative LPG cylinder icon badge.
 * Lives in the customer app — it's a customer-domain visual, not a shared primitive.
 */
export function CylinderBadge(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🛢️</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 48,
    height: 48,
    borderRadius: Radius.lg,
    backgroundColor: '#fff7ed', // orange-50
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
});
