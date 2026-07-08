import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@clear-energy/shared';
import { OrdersScreen } from '../screens/OrdersScreen';

export type CustomerStackParamList = {
  Orders: undefined;
  // OrderDetail: { orderId: string }; — future screen
};

const Stack = createNativeStackNavigator<CustomerStackParamList>();

export function CustomerNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="Orders" component={OrdersScreen} />
    </Stack.Navigator>
  );
}
