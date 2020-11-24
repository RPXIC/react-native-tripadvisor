import React, { useEffect, useState, useCallback, useRef } from 'react'
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native'
import { Rating, ListItem, Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import Toast from 'react-native-easy-toast'
import { map } from 'lodash'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { firebaseApp } from '../../utils/firebase'
import { Map, Loading, Carousel, ListReviews } from '../../components'

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
	const [isFav, setIsFav] = useState(false)
	const [userLogged, setUserLoged] = useState(false)
	const toastRef = useRef()

	useEffect(() => {
		navigation.setOptions({ title: name })
	}, [])

	firebase.auth().onAuthStateChanged((user) => {
		user ? setUserLoged(true) : setUserLoged(false)
	})

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

	useEffect(() => {
		if (userLogged && restaurant) {
			db.collection('favorites')
				.where('idRestaurant', '==', restaurant.id)
				.where('idUser', '==', firebase.auth().currentUser.uid)
				.get()
				.then((res) => {
					if (res.docs.length === 1) {
						setIsFav(true)
					}
				})
		}
	}, [userLogged, restaurant])

	const toggleFav = () => {
		if (!userLogged) {
			toastRef.current.show('Login for add to favorites')
		} else if (!isFav) {
			const payload = {
				idUser: firebase.auth().currentUser.uid,
				idRestaurant: restaurant.id,
			}
			db.collection('favorites')
				.add(payload)
				.then(() => {
					setIsFav(true)
					toastRef.current.show('Added to favorites')
				})
				.catch(() => {
					toastRef.current.show('Error adding to favorites')
				})
		} else if (isFav) {
			db.collection('favorites')
				.where('idRestaurant', '==', restaurant.id)
				.where('idUser', '==', firebase.auth().currentUser.uid)
				.get()
				.then((res) => {
					res.forEach((doc) => {
						const idFav = doc.id
						db.collection('favorites')
							.doc(idFav)
							.delete()
							.then(() => {
								setIsFav(false)
								toastRef.current.show('Deleted from favorites')
							})
							.catch(() => {
								toastRef.current.show(
									'Error deleting from favorites'
								)
							})
					})
				})
		}
	}

	if (!restaurant) return <Loading isVisible={true} text='Loading...' />

	return (
		<ScrollView vertical style={styles.viewBody}>
			<View style={styles.viewFavorite}>
				<Icon
					type='material-community'
					name={isFav ? 'heart' : 'heart-outline'}
					onPress={toggleFav}
					color={isFav ? '#f00' : '#000'}
					size={35}
					underlayColor='transparent'
				/>
			</View>
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
			<Toast ref={toastRef} position='center' opacity={0.9} />
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
	viewFavorite: {
		position: 'absolute',
		top: 0,
		right: 0,
		zIndex: 2,
		backgroundColor: '#ffffff73',
		borderRadius: 50,
		margin: 5,
		marginLeft: 15,
		padding: 5,
	},
})

export default Restaurant
