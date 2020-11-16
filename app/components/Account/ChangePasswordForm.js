import React, { useState } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Input, Button } from 'react-native-elements'
import { size } from 'lodash'
import * as firebase from 'firebase'
import { reauthenticate } from '../../utils/api'

const ChangePasswordForm = ({ setShowModal, toastRef }) => {
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState(defaultValues())
	const [errors, setErrors] = useState({})
	const [isLoading, setIsLoading] = useState(false)

	const onChange = (e, type) => {
		setFormData({ ...formData, [type]: e.nativeEvent.text })
	}

	const onSubmit = async () => {
		setErrors({})
		if (
			!formData.password ||
			!formData.newPassword ||
			!formData.repeatNewPassword
		) {
			setErrors({
				password: !formData.password ? 'All fields are required' : '',
				newPassword: !formData.newPassword
					? 'All fields are required'
					: '',
				repeatNewPassword: !formData.repeatNewPassword
					? 'All fields are required'
					: '',
			})
		} else if (formData.newPassword !== formData.repeatNewPassword) {
			setErrors({
				newPassword: 'The new passwords are not the same',
				repeatNewPassword: 'The new passwords are not the same',
			})
		} else if (size(formData.newPassword) < 6) {
			setErrors({
				newPassword: 'Password must have at least 6 characters',
				repeatNewPassword: 'Password must have at least 6 characters',
			})
		} else {
			setIsLoading(true)
			await reauthenticate(formData.password)
				.then(async () => {
					await firebase
						.auth()
						.currentUser.updatePassword(formData.newPassword)
						.then(() => {
							setIsLoading(false)
							setShowModal(false)
							firebase.auth().signOut()
						})
						.catch(() => {
							setErrors({
								other: 'Error updating password',
							})
							setIsLoading(false)
						})
				})
				.catch(() => {
					setErrors({
						password: 'Incorrect password',
					})
					setIsLoading(false)
				})
		}
	}

	return (
		<View style={styles.view}>
			<Input
				placeholder='Current password'
				containerStyle={styles.input}
				password={true}
				secureTextEntry={!showPassword}
				rightIcon={{
					type: 'material-community',
					name: showPassword ? 'eye-off-outline' : 'eye-outline',
					color: '#c2c2c2',
					onPress: () => setShowPassword(!showPassword),
				}}
				onChange={(e) => onChange(e, 'password')}
				errorMessage={errors.password}
			/>
			<Input
				placeholder='New password'
				containerStyle={styles.input}
				password={true}
				secureTextEntry={!showPassword}
				rightIcon={{
					type: 'material-community',
					name: showPassword ? 'eye-off-outline' : 'eye-outline',
					color: '#c2c2c2',
					onPress: () => setShowPassword(!showPassword),
				}}
				onChange={(e) => onChange(e, 'newPassword')}
				errorMessage={errors.newPassword}
			/>
			<Input
				placeholder='Repeat new password'
				containerStyle={styles.input}
				password={true}
				secureTextEntry={!showPassword}
				rightIcon={{
					type: 'material-community',
					name: showPassword ? 'eye-off-outline' : 'eye-outline',
					color: '#c2c2c2',
					onPress: () => setShowPassword(!showPassword),
				}}
				onChange={(e) => onChange(e, 'repeatNewPassword')}
				errorMessage={errors.repeatNewPassword}
			/>
			<Button
				title='Save'
				containerStyle={styles.btnContainer}
				buttonStyle={styles.btn}
				onPress={onSubmit}
				loading={isLoading}
			/>
			<Text>{errors.other}</Text>
		</View>
	)
}

function defaultValues() {
	return {
		password: '',
		newPassword: '',
		repeatNewPassword: '',
	}
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

export default ChangePasswordForm
