import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Icon } from 'react-native-elements'
import {
	RestaurantsStack,
	FavoritesStack,
	TopRestaurantsStack,
	SearchStack,
	AccountStack,
} from '../navigations'

const Tab = createBottomTabNavigator()

const Navigation = () => {
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName="restaurant"
				tabBarOptions={{
					inactiveTintColor: '#646464',
					activeTintColor: '#00a680',
				}}
				screenOptions={({ route }) => ({
					tabBarIcon: ({ color }) => screenOptions(route, color),
				})}
			>
				<Tab.Screen name="restaurants" component={RestaurantsStack} />
				<Tab.Screen name="favorites" component={FavoritesStack} />
				<Tab.Screen
					name="top-restaurants"
					component={TopRestaurantsStack}
					options={{ title: 'Top 5' }}
				/>
				<Tab.Screen name="search" component={SearchStack} />
				<Tab.Screen name="account" component={AccountStack} />
			</Tab.Navigator>
		</NavigationContainer>
	)
}

function screenOptions(route, color) {
	let iconName

	switch (route.name) {
		case 'restaurants':
			iconName = 'compass-outline'
			break
		case 'favorites':
			iconName = 'heart-outline'
			break
		case 'top-restaurants':
			iconName = 'star-outline'
			break
		case 'search':
			iconName = 'magnify'
			break
		case 'account':
			iconName = 'home-outline'
			break
		default:
			break
	}
	return (
		<Icon
			type="material-community"
			name={iconName}
			size={22}
			color={color}
		/>
	)
}

export default Navigation
