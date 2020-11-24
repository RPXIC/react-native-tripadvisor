import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Input, Icon, Button } from 'react-native-elements'
import { isEmpty } from 'lodash'
import { useNavigation } from '@react-navigation/native'
import * as firebase from 'firebase'
import { Loading } from '../../components'
import { validateEmail } from '../../utils/validations'

const LoginForm = ({ toastRef }) => {
	const [showPassword, setShowPassword] = useState(false)
	const [formData, setFormData] = useState(defaultFormValues())
	const [loading, setLoading] = useState(false)
	const navigation = useNavigation()

	const onChange = (e, type) =>
		setFormData({ ...formData, [type]: e.nativeEvent.text })

	const onSubmit = () => {
		if (isEmpty(formData.email) || isEmpty(formData.password)) {
			toastRef.current.show('All labels are required')
		} else if (!validateEmail(formData.email)) {
			toastRef.current.show('Invalid email')
		} else {
			setLoading(true)
			firebase
				.auth()
				.signInWithEmailAndPassword(formData.email, formData.password)
				.then(() => {
					setLoading(false)
					navigation.navigate('account')
				})
				.catch(() => {
					setLoading(false)
					toastRef.current.show('Incorrect mail or password')
				})
		}
	}

	return (
		<View style={styles.formContainer}>
			<Input
				placeholder='Email'
				containerStyle={styles.inputForm}
				onChange={(e) => onChange(e, 'email')}
				rightIcon={
					<Icon
						type='material-community'
						name='at'
						iconStyle={styles.iconRight}
					/>
				}
			/>
			<Input
				placeholder='Password'
				containerStyle={styles.inputForm}
				password={true}
				secureTextEntry={!showPassword}
				onChange={(e) => onChange(e, 'password')}
				rightIcon={
					<Icon
						type='material-community'
						name={showPassword ? 'eye-off-outline' : 'eye-outline'}
						iconStyle={styles.iconRight}
						onPress={() => setShowPassword(!showPassword)}
					/>
				}
			/>
			<Button
				title='Log In'
				containerStyle={styles.btnContainerLogin}
				buttonStyle={styles.btnLogin}
				onPress={onSubmit}
			/>
			<Loading isVisible={loading} text='Login...' />
		</View>
	)
}

function defaultFormValues() {
	return {
		email: '',
		password: '',
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
	btnContainerLogin: {
		marginTop: 20,
		width: '95%',
	},
	btnLogin: {
		backgroundColor: '#00a680',
	},
	iconRight: {
		color: '#c1c1c1',
	},
})

export default LoginForm
