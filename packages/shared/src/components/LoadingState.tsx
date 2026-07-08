import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Colors, FontSize, Spacing } from '../constants/tokens';

interface LoadingStateProps {
  message?: string;
  testID?: string;
}

export function LoadingState({
  message = 'Loading…',
  testID = 'loading-state',
}: LoadingStateProps): React.JSX.Element {
  return (
    <View style={styles.container} testID={testID}>
      <ActivityIndicator size="large" color={Colors.brand} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xxl,
  },
  message: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
});
