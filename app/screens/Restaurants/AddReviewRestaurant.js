import React, { useState, useRef } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { AirbnbRating, Button, Input } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import { Loading } from '../../components'
import { firebaseApp } from '../../utils/firebase'
import firebase from 'firebase/app'
import 'firebase/firestore'

const db = firebase.firestore(firebaseApp)

const AddReviewRestaurant = ({
	navigation,
	route: {
		params: { idRestaurant },
	},
}) => {
	const [rating, setRating] = useState(null)
	const [title, setTitle] = useState('')
	const [review, setReview] = useState('')
	const [loading, setLoading] = useState(false)
	const toastRef = useRef()

	const addReview = () => {
		if (!rating) {
			toastRef.current.show('Select a rating')
		} else if (!title.trim()) {
			toastRef.current.show('Write a title')
		} else if (!review.trim()) {
			toastRef.current.show('Write a review')
		} else {
			setLoading(true)
			const user = firebase.auth().currentUser
			const payload = {
				idUser: user.uid,
				avatarUser: user.photoURL,
				idRestaurant: idRestaurant,
				title: title,
				review: review,
				rating: rating,
				createdAt: new Date(),
			}
			db.collection('reviews')
				.add(payload)
				.then(() => {
					updateRestaurant()
				})
				.catch(() => {
					toastRef.current.show('Error sending review')
					setLoading(false)
				})
		}
	}

	const updateRestaurant = () => {
		const restaurantRef = db.collection('restaurants').doc(idRestaurant)

		restaurantRef.get().then((res) => {
			const restaurantData = res.data()
			const ratingTotal = restaurantData.ratingTotal + rating
			const quantityVoting = restaurantData.quantityVoting + 1
			const ratingResult = ratingTotal / quantityVoting
			restaurantRef
				.update({
					rating: ratingResult,
					ratingTotal,
					quantityVoting,
				})
				.then(() => {
					setLoading(false)
					navigation.goBack()
				})
		})
	}

	return (
		<View style={styles.viewBody}>
			<View style={styles.viewRating}>
				<AirbnbRating
					count={5}
					defaultRating={0}
					size={35}
					onFinishRating={(value) => {
						setRating(value)
					}}
				/>
			</View>
			<View style={styles.formReview}>
				<Input
					placeholder='title'
					style={styles.input}
					onChange={(e) => setTitle(e.nativeEvent.text)}
				/>
				<Input
					placeholder='Review'
					multiline={true}
					inputContainerStyle={styles.textArea}
					onChange={(e) => setReview(e.nativeEvent.text)}
				/>
				<Button
					title='Send review'
					containerStyle={styles.btnContainer}
					buttonStyle={styles.btn}
					onPress={addReview}
				/>
			</View>
			<Toast ref={toastRef} position='center' opacity={0.9} />
			<Loading isVisible={loading} text='Sending review...' />
		</View>
	)
}

const styles = StyleSheet.create({
	viewBody: {
		flex: 1,
	},
	viewRating: {
		height: 110,
		backgroundColor: '#f2f2f2',
	},
	formReview: {
		flex: 1,
		alignItems: 'center',
		margin: 10,
		marginTop: 40,
	},
	input: {
		marginBottom: 10,
	},
	textArea: {
		height: 150,
		width: 100,
		padding: 0,
		margin: 0,
	},
	btnContainer: {
		flex: 1,
		justifyContent: 'flex-end',
		marginTop: 20,
		marginBottom: 10,
		width: '95%',
	},
	btn: {
		backgroundColor: '#00a680',
	},
})

export default AddReviewRestaurant
