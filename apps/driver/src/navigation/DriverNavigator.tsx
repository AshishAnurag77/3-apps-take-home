import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Colors } from '@clear-energy/shared';
import { TripScreen } from '../screens/TripScreen';

export type DriverStackParamList = {
  Trip: undefined;
  // StopDetail: { orderId: string }; — future screen
};

const Stack = createNativeStackNavigator<DriverStackParamList>();

export function DriverNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.background },
      }}
    >
      <Stack.Screen name="Trip" component={TripScreen} />
    </Stack.Navigator>
  );
}
