import React, { useEffect, useState, useCallback } from 'react'
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native'
import { Rating, ListItem, Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { map } from 'lodash'
import { firebaseApp } from '../../utils/firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'
import Map from '../../components/Map'
import Loading from '../../components/Loading'
import Carousel from '../../components/Carousel'
import ListReviews from '../../components/Restaurants/ListReviews'

const db = firebase.firestore(firebaseApp)
const screenWidth = Dimensions.get('window').width

const Restaurant = ({
	navigation,
	route: {
		params: { id, name },
	},
}) => {
	const [restaurant, setRestaurant] = useState(null)
	const [rating, setRating] = useState(0)

	useEffect(() => {
		navigation.setOptions({ title: name })
	}, [])

	useFocusEffect(
		useCallback(() => {
			db.collection('restaurants')
				.doc(id)
				.get()
				.then((res) => {
					const data = res.data()
					data.id = res.id
					setRestaurant(data)
					setRating(data.rating)
				})
		}, [])
	)

	if (!restaurant) return <Loading isVisible={true} text='Loading...' />

	return (
		<ScrollView vertical style={styles.viewBody}>
			<Carousel
				arrayImages={restaurant.images}
				height={250}
				width={screenWidth}
			/>
			<TitleRestaurant
				name={restaurant.name}
				description={restaurant.description}
				rating={rating}
			/>
			<RestaurantInfo
				location={restaurant.location}
				name={restaurant.name}
				address={restaurant.address}
			/>
			<ListReviews navigation={navigation} idRestaurant={restaurant.id} />
		</ScrollView>
	)
}

function TitleRestaurant({ name, description, rating }) {
	return (
		<View style={styles.viewRestaurantTitle}>
			<View style={{ flexDirection: 'column' }}>
				<Text style={styles.nameRestaurant}>{name}</Text>
				<Rating
					style={styles.rating}
					imageSize={20}
					readonly
					startingValue={parseFloat(rating)}
				/>
				<Text style={styles.descriptionRestaurant}>{description}</Text>
			</View>
		</View>
	)
}

function RestaurantInfo({ location, name, address }) {
	const listInfo = [
		{
			text: address,
			iconName: 'map-marker',
			iconType: 'material-community',
			action: null,
		},
		{
			text: '111 222 333',
			iconName: 'phone',
			iconType: 'material-community',
			action: null,
		},
		{
			text: 'restaurant@gmail.com',
			iconName: 'at',
			iconType: 'material-community',
			action: null,
		},
	]

	return (
		<View style={styles.viewRestaurantInfo}>
			<Text style={styles.restaurantInfoTitle}>
				Information about restaurant
			</Text>
			<Map location={location} name={name} height={100} />
			{map(listInfo, (item, index) => (
				<ListItem key={index} containerStyle={styles.containerListItem}>
					<Icon
						name={item.iconName}
						type={item.iconType}
						color='#00a680'
					/>
					<ListItem.Title>{item.text}</ListItem.Title>
				</ListItem>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1,
		backgroundColor: '#fff',
	},
	viewRestaurantTitle: {
		padding: 15,
	},
	nameRestaurant: {
		fontSize: 20,
		fontWeight: 'bold',
	},
	descriptionRestaurant: {
		marginTop: 5,
		color: 'grey',
	},
	rating: {
		position: 'absolute',
		right: 0,
	},
	viewRestaurantInfo: {
		margin: 15,
		marginTop: 25,
	},
	restaurantInfoTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	containerListItem: {
		borderBottomColor: '#d8d8d8',
		borderBottomWidth: 1,
	},
})

export default Restaurant
