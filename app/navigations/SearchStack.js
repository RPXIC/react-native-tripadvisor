import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { Search } from '../screens'

const Stack = createStackNavigator()

const SearchStack = () => {
	return (
		<Stack.Navigator>
			<Stack.Screen
				name='search'
				component={Search}
				options={{ title: 'Search' }}
			/>
		</Stack.Navigator>
	)
}

export default SearchStack
