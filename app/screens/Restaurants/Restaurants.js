import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Icon } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { firebaseApp } from '../../utils/firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { ListRestaurants } from '../../components'

const db = firebase.firestore(firebaseApp)

const Restaurants = ({ navigation }) => {
	const [user, setUser] = useState(null)
	const [restaurants, setRestaurants] = useState([])
	const [totalRestaurants, setTotalRestaurants] = useState(0)
	const [startRestaurants, setStartRestaurants] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const limitRestaurants = 9

	useEffect(() => {
		firebase.auth().onAuthStateChanged((userInfo) => {
			setUser(userInfo)
		})
	}, [])

	useFocusEffect(
		useCallback(() => {
			db.collection('restaurants')
				.get()
				.then((snap) => {
					setTotalRestaurants(snap.size)
				})
			const resultRestaurants = []
			db.collection('restaurants')
				.orderBy('createdAt', 'desc')
				.limit(limitRestaurants)
				.get()
				.then((res) => {
					setStartRestaurants(res.docs[res.docs.length - 1])
					res.forEach((doc) => {
						const restaurant = doc.data()
						restaurant.id = doc.id
						resultRestaurants.push(restaurant)
					})
					setRestaurants(resultRestaurants)
				})
		}, [])
	)

	const handleLoadMore = () => {
		const resultRestaurants = []
		restaurants.length < totalRestaurants && setIsLoading(true)

		db.collection('restaurants')
			.orderBy('createdAt', 'desc')
			.startAfter(startRestaurants.data().createdAt)
			.limit(limitRestaurants)
			.get()
			.then((res) => {
				if (res.docs.length > 0) {
					setStartRestaurants(res.docs[res.docs.length - 1])
				} else {
					setIsLoading(false)
				}
				res.forEach((doc) => {
					const restaurant = doc.data()
					restaurant.id = doc.id
					resultRestaurants.push(restaurant)
				})
				setRestaurants([...restaurants, ...resultRestaurants])
			})
	}

	return (
		<View style={styles.viewBody}>
			<ListRestaurants
				restaurants={restaurants}
				handleLoadMore={handleLoadMore}
				isLoading={isLoading}
			/>
			{user && (
				<Icon
					reverse
					type='material-community'
					name='plus'
					color='#00a680'
					containerStyle={styles.btnContainer}
					onPress={() => navigation.navigate('add-restaurant')}
				/>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1,
		backgroundColor: '#fff',
	},
	btnContainer: {
		position: 'absolute',
		bottom: 10,
		right: 10,
		shadowColor: 'black',
		shadowOffset: { width: 2, height: 2 },
		shadowOpacity: 0.5,
	},
})

export default Restaurants
