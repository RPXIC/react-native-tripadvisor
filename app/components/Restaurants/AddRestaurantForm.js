import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, Dimensions } from 'react-native'
import { Icon, Avatar, Image, Input, Button } from 'react-native-elements'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'
import * as Location from 'expo-location'
import { map, size, filter } from 'lodash'
import MapView from 'react-native-maps'
import { firebaseApp } from '../../utils/firebase'
import firebase from 'firebase/app'
import 'firebase/storage'
import 'firebase/firestore'
import uuid from 'random-uuid-v4'
import { Modal } from '../../components'
const db = firebase.firestore(firebaseApp)

const widthScreen = Dimensions.get('window').width

const AddRestaurantForm = ({ toastRef, setIsLoading, navigation }) => {
	const [restaurantName, setRestaurantName] = useState('')
	const [restaurantAddress, setRestaurantAddress] = useState('')
	const [restaurantDescription, setRestaurantDescription] = useState('')
	const [imagesSelected, setImagesSelected] = useState([])
	const [isVisibleMap, setIsVisibleMap] = useState(false)
	const [locationRestaurant, setLocationRestaurant] = useState(null)

	const addRestaurant = () => {
		if (!restaurantName || !restaurantAddress || !restaurantDescription) {
			toastRef.current.show('All fields are required')
		} else if (size(imagesSelected) === 0) {
			toastRef.current.show('At least one image is required')
		} else if (!locationRestaurant) {
			toastRef.current.show('Add a location')
		} else {
			setIsLoading(true)
			uploadImageStorage().then((response) => {
				db.collection('restaurants')
					.add({
						name: restaurantName,
						address: restaurantAddress,
						description: restaurantDescription,
						location: locationRestaurant,
						images: response,
						rating: 0,
						ratingTotal: 0,
						quantityVoting: 0,
						createdAt: new Date(),
						createdBy: firebase.auth().currentUser.uid,
					})
					.then(() => {
						setIsLoading(false)
						navigation.navigate('restaurants')
					})
					.catch(() => {
						setIsLoading(false)
						toastRef.current.show('Error uploading restaurant')
					})
			})
		}
	}

	const uploadImageStorage = async () => {
		const imageBlob = []

		await Promise.all(
			map(imagesSelected, async (image) => {
				const response = await fetch(image)
				const blob = await response.blob()
				const ref = firebase.storage().ref('restaurants').child(uuid())
				await ref.put(blob).then(async (result) => {
					await firebase
						.storage()
						.ref(`restaurants/${result.metadata.name}`)
						.getDownloadURL()
						.then((photUrl) => imageBlob.push(photUrl))
				})
			})
		)
		return imageBlob
	}

	return (
		<ScrollView style={styles.scrollView}>
			<ImageRestaurant imageRestaurant={imagesSelected[0]} />
			<FormAdd
				setRestaurantName={setRestaurantName}
				setRestaurantAddress={setRestaurantAddress}
				setRestaurantDescription={setRestaurantDescription}
				setIsVisibleMap={setIsVisibleMap}
				locationRestaurant={locationRestaurant}
			/>
			<UploadImage
				toastRef={toastRef}
				imagesSelected={imagesSelected}
				setImagesSelected={setImagesSelected}
			/>
			<Button
				title='Save'
				onPress={addRestaurant}
				buttonStyle={styles.btnAddRestaurant}
			/>
			<Map
				isVisibleMap={isVisibleMap}
				setIsVisibleMap={setIsVisibleMap}
				setLocationRestaurant={setLocationRestaurant}
				toastRef={toastRef}
			/>
		</ScrollView>
	)
}

function ImageRestaurant({ imageRestaurant }) {
	return (
		<View style={styles.viewPhoto}>
			<Image
				source={
					imageRestaurant
						? { uri: imageRestaurant }
						: require('../../../assets/img/no-image.png')
				}
				style={{ width: widthScreen, height: 200 }}
			/>
		</View>
	)
}

function FormAdd(props) {
	const {
		setRestaurantName,
		setRestaurantAddress,
		setRestaurantDescription,
		setIsVisibleMap,
		locationRestaurant,
	} = props
	return (
		<View style={styles.viewForm}>
			<Input
				placeholder='Restaurant name'
				containerStyle={styles.input}
				onChange={(e) => setRestaurantName(e.nativeEvent.text)}
			/>
			<Input
				placeholder='Address'
				containerStyle={styles.input}
				onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
				rightIcon={{
					type: 'material-community',
					name: 'google-maps',
					color: locationRestaurant ? '#00a680' : '#c2c2c2',
					onPress: () => setIsVisibleMap(true),
				}}
			/>
			<Input
				placeholder='Description'
				multiline={true}
				inputContainerStyle={styles.textArea}
				onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
			/>
		</View>
	)
}

function Map({
	isVisibleMap,
	setIsVisibleMap,
	setLocationRestaurant,
	toastRef,
}) {
	const [location, setLocation] = useState(null)

	useEffect(() => {
		;(async () => {
			const resultPermissions = await Permissions.askAsync(
				Permissions.LOCATION
			)
			const statusPermissions =
				resultPermissions.permissions.location.status
			if (statusPermissions !== 'granted') {
				toastRef.current.show(
					'You have to accept the location permissions',
					3000
				)
			} else {
				const loc = await Location.getCurrentPositionAsync({})
				setLocation({
					latitude: loc.coords.latitude,
					longitude: loc.coords.longitude,
					latitudeDelta: 0.001,
					longitudeDelta: 0.001,
				})
			}
		})()
	}, [])

	const confirmLocation = () => {
		setLocationRestaurant(location)
		toastRef.current.show('Location saved')
		setIsVisibleMap(false)
	}

	return (
		<Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
			<View>
				{location && (
					<MapView
						style={styles.mapStyle}
						initialRegion={location}
						showsUserLocation={true}
						onRegionChange={(region) => setLocation(region)}>
						<MapView.Marker
							coordinate={{
								latitude: location.latitude,
								longitude: location.longitude,
							}}
							draggable
						/>
					</MapView>
				)}
				<View style={styles.viewMapBtn}>
					<Button
						title='Save location'
						containerStyle={styles.viewMapBtnContainerSave}
						buttonStyle={styles.viewMapBtnSave}
						onPress={confirmLocation}
					/>
					<Button
						title='Cancel'
						containerStyle={styles.viewMapBtnContainerCancel}
						buttonStyle={styles.viewMapBtnCancel}
						onPress={() => setIsVisibleMap(false)}
					/>
				</View>
			</View>
		</Modal>
	)
}

function UploadImage({ toastRef, setImagesSelected, imagesSelected }) {
	const removeImage = (image) => {
		Alert.alert(
			'Delete Image',
			'Are you sure to delete the image ?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Delete',
					onPress: () => {
						setImagesSelected(
							filter(
								imagesSelected,
								(imageUrl) => imageUrl !== image
							)
						)
					},
				},
			],
			{ cancelable: false }
		)
	}

	const imageSelect = async () => {
		const resultPermission = await Permissions.askAsync(
			Permissions.CAMERA_ROLL
		)
		if (resultPermission === 'denied') {
			toastRef.current.show(
				'You have to accept the permissions to the image gallery',
				3000
			)
		} else {
			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [4, 3],
			})

			if (result.cancelled) {
				toastRef.current.show('Cancelled', 2000)
			} else {
				setImagesSelected([...imagesSelected, result.uri])
			}
		}
	}

	return (
		<View style={styles.viewImages}>
			{size(imagesSelected) < 5 && (
				<Icon
					type='material-community'
					name='camera'
					color='#7a7a7a'
					containerStyle={styles.containerIcon}
					onPress={imageSelect}
				/>
			)}
			{map(imagesSelected, (imageRestaurant, i) => (
				<Avatar
					key={i}
					style={styles.miniatureStyle}
					source={{ uri: imageRestaurant }}
					onPress={() => removeImage(imageRestaurant)}
				/>
			))}
		</View>
	)
}

const styles = StyleSheet.create({
	scrollView: {
		height: '100%',
	},
	viewForm: {
		marginLeft: 10,
		marginRight: 10,
	},
	input: {
		marginBottom: 10,
	},
	textArea: {
		height: 100,
		width: '100%',
		padding: 0,
		margin: 0,
	},
	btnAddRestaurant: {
		backgroundColor: '#00a680',
		margin: 20,
	},
	viewImages: {
		flexDirection: 'row',
		marginLeft: 20,
		marginRight: 20,
		marginTop: 30,
	},
	containerIcon: {
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
		height: 70,
		width: 70,
		backgroundColor: '#e3e3e3',
	},
	miniatureStyle: {
		width: 70,
		height: 70,
		marginRight: 10,
	},
	viewPhoto: {
		alignItems: 'center',
		height: 200,
		marginBottom: 20,
	},
	mapStyle: {
		width: '100%',
		height: 550,
	},
	viewMapBtn: {
		flexDirection: 'row',
		justifyContent: 'center',
		marginTop: 10,
	},
	viewMapBtnContainerCancel: {
		paddingLeft: 5,
	},
	viewMapBtnCancel: {
		backgroundColor: '#a60d0d',
	},
	viewMapBtnContainerSave: {
		paddingRight: 5,
	},
	viewMapBtnSave: {
		backgroundColor: '#00a680',
	},
})

export default AddRestaurantForm
