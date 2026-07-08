import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import {
  PendingAction,
  OrderCard,
  LoadingState,
  EmptyState,
  ErrorState,
  Colors,
  Spacing,
  Radius,
  FontSize,
  FontWeight,
  fetchPendingActions,
  queryKeys,
} from '@clear-energy/shared';
import {
  groupByCategory,
  actionToCardProps,
  actionVerbLabel,
  CategoryGroup,
  isSlaBreached,
} from '../adapters/actionToCard';
import { CATEGORY_CONFIG } from '../adapters/categoryConfig';
import { ActionIdBadge } from '../components/ActionIdBadge';

const ADMIN_ID = 'a-201';

export function PendingScreen(): React.JSX.Element {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: queryKeys.pendingActions(ADMIN_ID),
    queryFn: ({ signal }) => fetchPendingActions({ adminId: ADMIN_ID, signal }),
    staleTime: 30_000,
  });

  const groups = data ? groupByCategory(data) : [];
  const categoryCount = groups.length;

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      {/* Gradient header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.backIcon}>←</Text>
          <Text style={styles.headerTitle}>⚡ Pending Actions</Text>
          <Text style={styles.filterIcon}>⚙</Text>
        </View>
        {data ? (
          <>
            <Text style={styles.count}>{data.length}</Text>
            <Text style={styles.countSub}>
              items across {categoryCount} categories
            </Text>
            <Text style={styles.sortLabel}>
              Sorted by SLA-breach risk · Banjara Hills
            </Text>
          </>
        ) : null}
      </View>

      {/* Content */}
      {isPending ? (
        <LoadingState message="Loading pending actions…" />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : groups.length === 0 ? (
        <EmptyState
          title="All clear!"
          body="No pending actions require your attention."
          icon="✅"
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {groups.map((group) => (
            <CategorySection key={group.category} group={group} />
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function CategorySection({ group }: { group: CategoryGroup }): React.JSX.Element {
  const cfg = CATEGORY_CONFIG[group.category];
  const slaText = group.actions[0]?.slaMinutes
    ? `SLA ${group.actions[0].slaMinutes}m`
    : '';

  return (
    <View style={[styles.categoryCard, { borderColor: cfg.color + '4D' }]}>
      {/* Category header */}
      <View style={[styles.categoryHeader, { backgroundColor: cfg.bgColor }]}>
        <View style={[styles.categoryIcon, { backgroundColor: cfg.bgColor }]}>
          <Text style={styles.categoryIconText}>{cfg.icon}</Text>
        </View>
        <View style={styles.categoryMeta}>
          <Text style={[styles.categoryLabel, { color: Colors.textPrimary }]}>
            {cfg.label}
          </Text>
          <Text style={styles.categorySub}>
            {slaText} · {group.actions.length} pending
            {group.breachedCount > 0 ? ` · ${group.breachedCount} breached` : ''}
          </Text>
        </View>
      </View>

      {/* Action rows */}
      {group.actions.map((action, idx) => (
        <View
          key={action.id}
          style={[
            styles.actionRow,
            idx < group.actions.length - 1 && styles.actionRowBorder,
          ]}
        >
          <ActionRow action={action} categoryColor={cfg.textColor} />
        </View>
      ))}
    </View>
  );
}

function ActionRow({
  action,
  categoryColor,
}: {
  action: PendingAction;
  categoryColor: string;
}): React.JSX.Element {
  const breached = isSlaBreached(action);
  const verbLabel = actionVerbLabel(action.action);

  return (
    <OrderCard
      {...actionToCardProps(action)}
      leading={<ActionIdBadge id={action.id} color={categoryColor} />}
      trailing={
        <ActionButton
          label={verbLabel}
          action={action}
          categoryColor={categoryColor}
        />
      }
      testID={`action-card-${action.id}`}
      style={styles.actionCard}
    />
  );
}

function ActionButton({
  label,
  action,
  categoryColor,
}: {
  label: string;
  action: PendingAction;
  categoryColor: string;
}): React.JSX.Element {
  return (
    <Pressable
      style={[styles.actionBtn, { backgroundColor: Colors.brand }]}
      onPress={() => {
        // Future: navigate to action detail or open bottom sheet
        console.log('Action', label, 'for', action.id);
      }}
    >
      <Text style={styles.actionBtnText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.brand,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backIcon: {
    color: '#fff',
    fontSize: FontSize.xl,
    marginRight: Spacing.md,
  },
  headerTitle: {
    color: '#fff',
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    flex: 1,
  },
  filterIcon: {
    color: '#fff',
    fontSize: FontSize.xl,
  },
  count: {
    color: '#fff',
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    lineHeight: 36,
  },
  countSub: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: FontSize.base,
    marginTop: 2,
  },
  sortLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
  },
  scrollContent: {
    padding: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xxxl,
  },
  categoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIconText: {
    fontSize: 18,
  },
  categoryMeta: {
    flex: 1,
  },
  categoryLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  categorySub: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actionRow: {
    paddingHorizontal: Spacing.sm,
  },
  actionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  actionCard: {
    borderRadius: 0,
    backgroundColor: 'transparent',
  },
  actionBtn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.md,
  },
  actionBtnText: {
    color: Colors.surface,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },
});
