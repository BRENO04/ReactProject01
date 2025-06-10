import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import Detalhes from './src/screens/Detalhes';
import Sacola from './src/screens/Sacola';
import FinalizacaoPedido from './src/screens/FinalizacaoPedido';
import SplashScreen from './src/screens/SplashScreen';
import CategoriaScreen from './src/screens/CategoriaScreen';
import { CartProvider } from './context/CartContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: 'black' }
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Detalhes" component={Detalhes} />
          <Stack.Screen name="Sacola" component={Sacola} />
          <Stack.Screen name="FinalizacaoPedido" component={FinalizacaoPedido} />
          <Stack.Screen name="Categoria" component={CategoriaScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}
