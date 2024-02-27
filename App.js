import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Teste from './src/Teste';
import Tabs from './Tabs';

const Stack = createNativeStackNavigator();


export default function App() {
  return (

    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name='Tabs'
          component={Tabs}
          options={{
            headerShown: false,
          }}
        />
        
      </Stack.Navigator>
    </NavigationContainer>

  );
}
