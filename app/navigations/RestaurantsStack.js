import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Restaurants from '../screens/Restaurants/Restaurants'
import AddRestaurant from '../screens/Restaurants/AddRestaurant'
import Restaurant from '../screens/Restaurants/Restaurant'

const Stack = createStackNavigator()

const RestaurantsStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='restaurants'
				component={Restaurants}
				options={{ title: 'restaurants' }}
			/>
			<Stack.Screen
				name='add-restaurant'
				component={AddRestaurant}
				options={{ title: 'Add new restaurant' }}
			/>
			<Stack.Screen name='restaurant' component={Restaurant} />
		</Stack.Navigator>
	)
}

export default RestaurantsStack
