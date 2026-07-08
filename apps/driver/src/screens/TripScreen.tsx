import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import {
  TripStop,
  OrderCard,
  LoadingState,
  EmptyState,
  ErrorState,
  Colors,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
  fetchTrips,
  queryKeys,
} from '@clear-energy/shared';
import { stopToCardProps } from '../adapters/stopToCard';
import { StopBadge } from '../components/StopBadge';

const DRIVER_ID = 'd-101';

export function TripScreen(): React.JSX.Element {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: queryKeys.trips(DRIVER_ID),
    queryFn: ({ signal }) => fetchTrips({ driverId: DRIVER_ID, signal }),
    staleTime: 30_000,
  });

  const activeStop = data?.find((s) => s.status === 'active');

  // Stops are already sorted by `seq` from the API, but we sort defensively
  const sortedStops = data
    ? [...data].sort((a, b) => a.seq - b.seq)
    : [];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.backIcon}>←</Text>
        <Text style={styles.headerTitle}>Today's route</Text>
        {data ? (
          <View style={styles.stopChip}>
            <Text style={styles.stopChipText}>{data.length} stops</Text>
          </View>
        ) : null}
      </View>

      {/* Map placeholder */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapLabel}>🗺  Route map</Text>
        {activeStop?.etaMin != null ? (
          <View style={styles.etaBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.etaText}>
              ETA next stop · <Text style={styles.etaHighlight}>{activeStop.etaMin} min</Text>
            </Text>
          </View>
        ) : null}
      </View>

      {/* Stop list */}
      {isPending ? (
        <LoadingState message="Loading your route…" />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : sortedStops.length === 0 ? (
        <EmptyState
          title="No stops today"
          body="Your deliveries for today will appear here."
          icon="🚚"
        />
      ) : (
        <FlatList
          data={sortedStops}
          keyExtractor={(item) => item.orderId}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <OrderCard
              {...stopToCardProps(item)}
              leading={<StopBadge stop={item} />}
              trailing={
                item.status === 'active' ? (
                  <OpenButton stop={item} />
                ) : undefined
              }
              testID={`stop-card-${item.orderId}`}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

function OpenButton({ stop }: { stop: TripStop }): React.JSX.Element {
  return (
    <Pressable
      style={styles.openButton}
      onPress={() => {
        // Future: navigate to stop detail / launch navigation
        console.log('Open stop', stop.orderId);
      }}
    >
      <Text style={styles.openButtonText}>Open</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  backIcon: {
    fontSize: FontSize.xl,
    color: Colors.textSecondary,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  stopChip: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  stopChipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.brandDark,
  },
  mapPlaceholder: {
    height: 180,
    backgroundColor: '#f0fdf4',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mapLabel: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  etaBadge: {
    position: 'absolute',
    top: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    gap: Spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  etaText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  etaHighlight: {
    color: Colors.brand,
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  separator: {
    height: Spacing.sm,
  },
  openButton: {
    backgroundColor: Colors.brand,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  openButtonText: {
    color: Colors.surface,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
  },
});
