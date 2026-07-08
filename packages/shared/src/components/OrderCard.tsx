import React, { type ReactNode } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/tokens';

/**
 * Presentational card component — knows nothing about Orders, Trips, or
 * PendingActions. Each app has an adapter that maps domain data → these props.
 *
 * Design contract:
 * - `leading`  — caller-supplied badge/icon (sequence number, check icon, etc.)
 * - `trailing` — optional CTA button (caller-supplied, e.g. "Open", "Approve")
 * - `bordered` — draws brand-coloured border (driver's active stop treatment)
 * - `statusTone` — drives status label colour
 */
export type StatusTone = 'success' | 'neutral' | 'warning' | 'danger' | 'info';

export interface OrderCardProps {
  id: string;
  title: string;
  subtitle: string;
  meta?: string;        // right-side small text (date, distance, age)
  statusLabel?: string; // colour-coded status text below title
  statusTone?: StatusTone;
  leading: ReactNode;
  trailing?: ReactNode;
  bordered?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

const STATUS_TONE_MAP: Record<StatusTone, string> = {
  success: Colors.brand,
  neutral: Colors.textSecondary,
  warning: Colors.warning,
  danger: Colors.danger,
  info: Colors.info,
};

export function OrderCard({
  id,
  title,
  subtitle,
  meta,
  statusLabel,
  statusTone = 'neutral',
  leading,
  trailing,
  bordered = false,
  onPress,
  style,
  testID,
}: OrderCardProps): React.JSX.Element {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      testID={testID}
      onPress={onPress}
      style={({ pressed }: { pressed: boolean }) => [
        styles.card,
        bordered && styles.cardBordered,
        typeof pressed === 'boolean' && pressed && styles.cardPressed,
        style,
      ]}
    >
      {/* Leading slot */}
      <View style={styles.leading}>{leading}</View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.id} numberOfLines={1}>
          {id}
        </Text>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
        {statusLabel ? (
          <Text
            style={[styles.statusLabel, { color: STATUS_TONE_MAP[statusTone] }]}
            numberOfLines={1}
          >
            {statusLabel}
          </Text>
        ) : null}
      </View>

      {/* Right side: meta + optional trailing CTA */}
      <View style={styles.right}>
        {meta ? <Text style={styles.meta}>{meta}</Text> : null}
        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  cardBordered: {
    borderWidth: 2,
    borderColor: Colors.brand,
  },
  cardPressed: {
    opacity: 0.85,
  },
  leading: {
    // sized by content — badge/icon determines dimensions
  },
  content: {
    flex: 1,
    gap: 2,
  },
  right: {
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  id: {
    fontSize: FontSize.xs,
    fontFamily: 'monospace',
    fontWeight: FontWeight.bold,
    color: Colors.textMuted,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  statusLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    marginTop: 2,
  },
  meta: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  trailing: {
    marginTop: Spacing.xs,
  },
});
