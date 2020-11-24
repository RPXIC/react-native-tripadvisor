import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Avatar, Accessory } from 'react-native-elements'
import AvatarDefault from '../../../assets/img/avatar-default.jpg'
import * as firebase from 'firebase'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'

const InfoUser = ({ userInfo, toastRef, setLoading, setLoadingText }) => {
	const { uid, displayName, email, photoURL } = userInfo

	const changeAvatar = async () => {
		const resultPermission = await Permissions.askAsync(
			Permissions.CAMERA_ROLL
		)
		const resultPermissionCamera =
			resultPermission.permissions.cameraRoll.status

		if (resultPermissionCamera === 'denied') {
			toastRef.current.show('You must accept the gallery permissions')
		} else {
			const result = await ImagePicker.launchImageLibraryAsync({
				allowsEditing: true,
				aspect: [4, 3],
			})
			if (result.cancelled) {
				toastRef.current.show('Cancelled')
			} else {
				uploadImage(result.uri)
					.then(() => updatePhotoUrl())
					.catch(() => toastRef.current.show('Error uploading image'))
			}
		}
	}

	const uploadImage = async (uri) => {
		setLoadingText('Updating avatar')
		setLoading(true)
		const response = await fetch(uri)
		const blob = await response.blob()
		const ref = firebase.storage().ref().child(`avatar/${uid}`)
		return ref.put(blob)
	}

	const updatePhotoUrl = () => {
		firebase
			.storage()
			.ref(`avatar/${uid}`)
			.getDownloadURL()
			.then(async (res) => {
				const update = { photoURL: res }
				await firebase.auth().currentUser.updateProfile(update)
				setLoading(false)
			})
			.catch(() => toastRef.current.show('Error uploading image'))
	}

	return (
		<View style={styles.viewUserInfo}>
			<Avatar
				rounded
				size='large'
				showEditButton
				onEditPress={changeAvatar}
				containerStyle={styles.userInfoAvatar}
				source={photoURL ? { uri: photoURL } : AvatarDefault}
				showAccessory={true}
				onPress={changeAvatar}>
				<Accessory size={20} onPress={changeAvatar} />
			</Avatar>
			<View>
				<Text style={styles.displayName}>
					{displayName ? displayName : 'Anonymous'}
				</Text>
				<Text>{email ? email : 'Social Login'}</Text>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	viewUserInfo: {
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'row',
		backgroundColor: '#f2f2f2',
		paddingTop: 30,
		paddingBottom: 30,
	},
	userInfoAvatar: {
		marginRight: 20,
	},
	displayName: {
		fontWeight: 'bold',
		paddingBottom: 5,
	},
})

export default InfoUser
