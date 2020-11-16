import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button } from 'react-native-elements'
import * as firebase from 'firebase'

const ChangeDisplayNameForm = ({
	displayName,
	setShowModal,
	toastRef,
	setReloadUserInfo,
}) => {
	const [newDisplayName, setNewDisplayName] = useState(null)
	const [error, setError] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = () => {
		setError(null)
		if (!newDisplayName) {
			setError('Cannot be empty')
		} else if (displayName === newDisplayName) {
			setError('The current name cannot be the same as the previous one')
		} else {
			setIsLoading(true)
			const update = { displayName: newDisplayName }
			firebase
				.auth()
				.currentUser.updateProfile(update)
				.then(() => {
					setIsLoading(false)
					setReloadUserInfo(true)
					setShowModal(false)
				})
				.catch(() => {
					setIsLoading(false)
					setError('Update name error')
				})
		}
	}

	return (
		<View style={styles.view}>
			<Input
				placeholder='name and surname'
				containerStyle={styles.input}
				rightIcon={{
					type: 'material-community',
					name: 'account-circle-outline',
					color: '#c2c2c2',
				}}
				defaultValue={displayName || ''}
				onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
				errorMessage={error}
			/>
			<Button
				title='Save'
				containerStyle={styles.btnContainer}
				buttonStyle={styles.btn}
				onPress={onSubmit}
				loading={isLoading}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	view: {
		alignItems: 'center',
		paddingTop: 10,
		paddingBottom: 10,
	},
	input: {
		marginBottom: 10,
	},
	btnContainer: {
		marginTop: 20,
		width: '95%',
	},
	btn: {
		backgroundColor: '#00a680',
	},
})

export default ChangeDisplayNameForm
