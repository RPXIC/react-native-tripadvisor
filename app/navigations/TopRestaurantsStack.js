import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import TopRestaurants from '../screens/TopRestaurants'

const Stack = createStackNavigator()

const TopRestaurantsStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name="top-restaurants"
				component={TopRestaurants}
				options={{ title: 'The best restaurants' }}
			/>
		</Stack.Navigator>
	)
}

export default TopRestaurantsStack
