import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, FontSize, FontWeight } from '@clear-energy/shared';

interface ActionIdBadgeProps {
  id: string;
  color: string;
}

export function ActionIdBadge({ id, color }: ActionIdBadgeProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color }]} numberOfLines={1}>
        {id}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 64,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  text: {
    fontSize: FontSize.xs,
    fontFamily: 'monospace',
    fontWeight: FontWeight.bold,
  },
});
