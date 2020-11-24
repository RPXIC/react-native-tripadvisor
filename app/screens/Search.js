import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, FlatList, Image } from 'react-native'
import { SearchBar, ListItem, Icon, Avatar } from 'react-native-elements'
import { FireSQL } from 'firesql'
import firebase from 'firebase/app'

const fireSQL = new FireSQL(firebase.firestore(), { includeId: 'id' })

const Search = ({ navigation }) => {
	const [search, setSearch] = useState('')
	const [restaurants, setRestaurants] = useState([])

	useEffect(() => {
		if (search) {
			fireSQL
				.query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
				.then((res) => {
					setRestaurants(res)
				})
		}
	}, [search])

	return (
		<View>
			<SearchBar
				placeholder='Search a restaurant...'
				onChangeText={(e) => setSearch(e)}
				value={search}
				containerStyle={StyleSheet.searchBar}
			/>
			{restaurants.length === 0 ? (
				<NoFoundRestaurants />
			) : (
				<FlatList
					data={restaurants}
					keyExtractor={(item, index) => index.toString()}
					renderItem={(restaurant) => (
						<Restaurant
							restaurant={restaurant}
							navigation={navigation}
						/>
					)}
				/>
			)}
		</View>
	)
}

function NoFoundRestaurants() {
	return (
		<View style={{ flex: 1, alignItems: 'center' }}>
			<Image
				source={require('../../assets/img/no-result-found.png')}
				resizeMode='cover'
				style={{ width: 200, height: 200 }}
			/>
		</View>
	)
}

function Restaurant({ restaurant, navigation }) {
	const { id, name, images } = restaurant.item

	return (
		<ListItem
			bottomDivider
			onPress={() =>
				navigation.navigate('restaurants', {
					screen: 'restaurant',
					params: { id, name },
				})
			}>
			<Avatar
				source={
					images[0]
						? { uri: images[0] }
						: require('../../assets/img/no-image.png')
				}
			/>
			<ListItem.Content>
				<ListItem.Title>{name}</ListItem.Title>
			</ListItem.Content>
			<ListItem.Chevron />
		</ListItem>
	)
}

export default Search
