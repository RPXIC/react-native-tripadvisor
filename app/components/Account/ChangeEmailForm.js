import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Button } from 'react-native-elements'
import * as firebase from 'firebase'
import { validateEmail } from '../../utils/validations'
import { reauthenticate } from '../../utils/api'

const ChangeEmailForm = ({
	email,
	setShowModal,
	toastRef,
	setReloadUserInfo,
}) => {
	const [formData, setFormData] = useState(defaultValues())
	const [showPassword, setShowPassword] = useState(false)
	const [errors, setErrors] = useState({})
	const [isLoading, setIsLoading] = useState(false)

	const onChange = (e, type) => {
		setFormData({ ...formData, [type]: e.nativeEvent.text })
	}

	const onSubmit = () => {
		setErrors({})
		if (!formData.email || email === formData.email) {
			setErrors({
				email: 'Change email',
			})
		} else if (!validateEmail(formData.email)) {
			setErrors({
				email: 'Invalid email',
			})
		} else if (!formData.password) {
			setErrors({
				password: 'Write your password',
			})
		} else {
			setIsLoading(true)
			reauthenticate(formData.password)
				.then(() => {
					firebase
						.auth()
						.currentUser.updateEmail(formData.email)
						.then(() => {
							setIsLoading(false)
							setReloadUserInfo(true)
							toastRef.current.show('Email changed')
							setShowModal(false)
						})
						.catch(() => {
							setErrors({
								email: 'Error updating email',
							})
							setIsLoading(false)
						})
				})
				.catch(() => {
					setIsLoading(false)
					setErrors({
						password: 'Incorrect password',
					})
				})
		}
	}

	return (
		<View style={styles.view}>
			<Input
				placeholder='email'
				containerStyle={styles.input}
				defaultValue={email || ''}
				rightIcon={{
					type: 'material-community',
					name: 'at',
					color: '#c2c2c2',
				}}
				onChange={(e) => onChange(e, 'email')}
				errorMessage={errors.email}
			/>
			<Input
				placeholder='password'
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

function defaultValues() {
	return {
		email: '',
		password: '',
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

export default ChangeEmailForm
