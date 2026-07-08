import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import {
  Order,
  OrderStatus,
  OrderCard,
  LoadingState,
  EmptyState,
  ErrorState,
  Colors,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
  fetchOrders,
  queryKeys,
} from '@clear-energy/shared';
import { orderToCardProps } from '../adapters/orderToCard';
import { CylinderBadge } from '../components/CylinderBadge';

// Hard-coded for demo — in production comes from auth context
const CUSTOMER_ID = 'c-001';

type FilterKey = 'all' | 'active' | 'delivered' | 'returns';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'active',    label: 'Active' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'returns',   label: 'Returns' },
];

const ACTIVE_STATUSES: OrderStatus[] = ['placed', 'assigned', 'out_for_delivery'];

function applyFilter(orders: Order[], filter: FilterKey): Order[] {
  switch (filter) {
    case 'all':       return orders;
    case 'active':    return orders.filter((o) => ACTIVE_STATUSES.includes(o.status));
    case 'delivered': return orders.filter((o) => o.status === 'delivered');
    case 'returns':   return orders.filter((o) => o.status === 'cancelled' || o.status === 'returned');
  }
}

export function OrdersScreen(): React.JSX.Element {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: queryKeys.orders(CUSTOMER_ID),
    queryFn: ({ signal }) => fetchOrders({ customerId: CUSTOMER_ID, signal }),
    staleTime: 30_000,
  });

  const filtered = data ? applyFilter(data, activeFilter) : [];

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Orders</Text>
        <Text style={styles.headerIcon}>🔍</Text>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterBar}
        contentContainerStyle={styles.filterBarContent}
      >
        {FILTERS.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setActiveFilter(f.key)}
            style={[
              styles.chip,
              activeFilter === f.key ? styles.chipActive : styles.chipInactive,
            ]}
          >
            <Text
              style={[
                styles.chipText,
                activeFilter === f.key ? styles.chipTextActive : styles.chipTextInactive,
              ]}
            >
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Content */}
      {isPending ? (
        <LoadingState message="Loading your orders…" />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No orders yet"
          body="Your orders will appear here once placed."
          icon="🛢️"
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <OrderCard
              {...orderToCardProps(item)}
              leading={<CylinderBadge />}
              testID={`order-card-${item.id}`}
            />
          )}
        />
      )}
    </SafeAreaView>
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
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    flex: 1,
  },
  headerIcon: {
    fontSize: 20,
  },
  filterBar: {
    backgroundColor: Colors.surface,
    flexGrow: 0,
  },
  filterBarContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
  },
  chipActive: {
    backgroundColor: Colors.brand,
  },
  chipInactive: {
    backgroundColor: Colors.border,
  },
  chipText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
  },
  chipTextActive: {
    color: Colors.surface,
  },
  chipTextInactive: {
    color: Colors.textSecondary,
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  separator: {
    height: Spacing.md,
  },
});
