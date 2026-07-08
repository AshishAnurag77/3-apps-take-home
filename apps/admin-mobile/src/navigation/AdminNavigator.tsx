import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@clear-energy/shared';
import { PendingScreen } from '../screens/PendingScreen';

export type AdminStackParamList = {
  Pending: undefined;
  // ActionDetail: { actionId: string }; — future screen
};

const Stack = createNativeStackNavigator<AdminStackParamList>();

export function AdminNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="Pending" component={PendingScreen} />
    </Stack.Navigator>
  );
}
