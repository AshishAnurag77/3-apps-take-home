import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import {
  Colors,
  FontSize,
  FontWeight,
  Spacing,
  Radius,
} from '../constants/tokens';
import { ApiError } from '../api/ApiError';

interface ErrorStateProps {
  error: unknown;
  onRetry?: () => void;
  testID?: string;
}

function errorToMessage(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case 'network':
        return 'No internet connection. Please check your network.';
      case 'timeout':
        return 'The request timed out. Please try again.';
      case 'server':
        return 'Server error. Please try again in a moment.';
      case 'client':
        return error.statusCode === 404
          ? 'Data not found.'
          : 'Something went wrong with the request.';
      default:
        return 'An unexpected error occurred.';
    }
  }
  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred.';
}

export function ErrorState({
  error,
  onRetry,
  testID = 'error-state',
}: ErrorStateProps): React.JSX.Element {
  return (
    <View style={styles.container} testID={testID}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{errorToMessage(error)}</Text>
      {onRetry ? (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try again</Text>
        </Pressable>
      ) : null}
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
  message: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    marginTop: Spacing.sm,
    backgroundColor: Colors.brand,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  retryText: {
    color: Colors.surface,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.md,
  },
});
