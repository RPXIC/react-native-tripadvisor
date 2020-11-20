import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native'
import { Rating } from 'react-native-elements'
import { firebaseApp } from '../../utils/firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'
import Loading from '../../components/Loading'
import Carousel from '../../components/Carousel'

const db = firebase.firestore(firebaseApp)
const screenWidth = Dimensions.get('window').width

const Restaurant = ({ navigation, route: { params: { id, name } } }) => {
	const [restaurant, setRestaurant] = useState(null)
	const [rating, setRating] = useState(0)

	useEffect(() => {
		navigation.setOptions({ title: name })
	}, [])

	useEffect(() => {
		db.collection('restaurants').doc(id).get().then(res => {
			const data = res.data()
			data.id = res.id
			setRestaurant(data)
			setRating(data.rating)
		})
	},[])

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
		</ScrollView>
	)
}

function TitleRestaurant({ name, description, rating }){
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

const styles = StyleSheet.create({
	viewBody:{
		flex: 1,
		backgroundColor: '#fff'
	},
	viewRestaurantTitle: {
		padding: 15
	},
	nameRestaurant: {
		fontSize: 20,
		fontWeight: 'bold'
	},
	descriptionRestaurant: {
		marginTop: 5,
		color: 'grey'
	},
	rating: {
		position: 'absolute',
		right: 0
	}
})

export default Restaurant
