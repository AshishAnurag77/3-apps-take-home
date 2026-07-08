import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing } from '../constants/tokens';

interface EmptyStateProps {
  title: string;
  body?: string;
  icon?: string; // emoji or unicode glyph — avoids icon-lib dependency in shared
  testID?: string;
}

export function EmptyState({
  title,
  body,
  icon = '📭',
  testID = 'empty-state',
}: EmptyStateProps): React.JSX.Element {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    gap: Spacing.md,
  },
  icon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
