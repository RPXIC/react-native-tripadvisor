import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { Input, Icon, Button } from 'react-native-elements'
import Loading from '../Loading'
import { validateEmail } from '../../utils/validations'
import { size, isEmpty } from 'lodash'
import * as firebase from 'firebase'

const RegisterForm = props => {
	const { toastRef } = props
	const [showPassword, setShowPassword] = useState(false)
	const [showRepeatPassword, setShowRepeatPassword] = useState(false)
	const [formData, setFormData] = useState(defaultFormValue())
	const [loading, setLoading] = useState(false)
	const navigation = useNavigation()

	const onSubmit = () => {
		if (
			isEmpty(formData.email) ||
			isEmpty(formData.password) ||
			isEmpty(formData.repeatPassword)
		) {
			toastRef.current.show('All labels are required')
		} else if (!validateEmail(formData.email)) {
			toastRef.current.show('Invalid email')
		} else if (formData.password !== formData.repeatPassword) {
			toastRef.current.show('Passwords must be the same')
		} else if (size(formData.password) < 6) {
			toastRef.current.show('Password must have at least 6 characters')
		} else {
			setLoading(true)
			firebase
				.auth()
				.createUserWithEmailAndPassword(
					formData.email,
					formData.password
				)
				.then(() => {
					setLoading(false)
					navigation.navigate('account')
				})
				.catch(err => {
					setLoading(false)
					toastRef.current.show(err.message)
				})
		}
	}

	const onChange = (e, type) => {
		setFormData({ ...formData, [type]: e.nativeEvent.text })
	}

	return (
		<View style={styles.formContainer}>
			<Input
				placeholder="Email"
				containerStyle={styles.inputForm}
				onChange={e => onChange(e, 'email')}
				rightIcon={
					<Icon
						type="material-community"
						name="at"
						iconStyle={styles.iconRight}
					/>
				}
			/>
			<Input
				placeholder="Password"
				containerStyle={styles.inputForm}
				onChange={e => onChange(e, 'password')}
				password={true}
				secureTextEntry={!showPassword}
				rightIcon={
					<Icon
						type="material-community"
						name={showPassword ? 'eye-off-outline' : 'eye-outline'}
						iconStyle={styles.iconRight}
						onPress={() => setShowPassword(!showPassword)}
					/>
				}
			/>
			<Input
				placeholder="Repeat password"
				containerStyle={styles.inputForm}
				onChange={e => onChange(e, 'repeatPassword')}
				password={true}
				secureTextEntry={!showRepeatPassword}
				rightIcon={
					<Icon
						type="material-community"
						name={
							showRepeatPassword
								? 'eye-off-outline'
								: 'eye-outline'
						}
						iconStyle={styles.iconRight}
						onPress={() =>
							setShowRepeatPassword(!showRepeatPassword)
						}
					/>
				}
			/>
			<Button
				title="Send"
				containerStyle={styles.btnContainerRegister}
				buttonStyle={styles.btnRegister}
				onPress={onSubmit}
			/>
			<Loading isVisible={loading} text="Creating account..." />
		</View>
	)
}

function defaultFormValue() {
	return {
		email: '',
		password: '',
		repeatPassword: '',
	}
}

const styles = StyleSheet.create({
	formContainer: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		marginTop: 30,
	},
	inputForm: {
		width: '100%',
		marginTop: 20,
	},
	btnContainerRegister: {
		marginTop: 20,
		width: '95%',
	},
	btnRegister: {
		backgroundColor: '#00a680',
	},
	iconRight: {
		color: '#c1c1c1',
	},
})

export default RegisterForm
