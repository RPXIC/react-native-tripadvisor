import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button } from 'react-native-elements'
import Toast from 'react-native-easy-toast'
import * as firebase from 'firebase'
import { InfoUser, Loading } from '../../components'
import AccountOptions from '../../components/Account/AccountOptions'

const UserLogged = () => {
	const [userInfo, setUserInfo] = useState(null)
	const [loading, setLoading] = useState(false)
	const [loadingText, setLoadingText] = useState('')
	const [reloadUserInfo, setReloadUserInfo] = useState(false)
	const toastRef = useRef()

	useEffect(() => {
		;(async () => {
			const user = await firebase.auth().currentUser
			setUserInfo(user)
		})()
		setReloadUserInfo(false)
	}, [reloadUserInfo])

	return (
		<View style={styles.viewUserInfo}>
			{userInfo && (
				<InfoUser
					userInfo={userInfo}
					toastRef={toastRef}
					setLoading={setLoading}
					setLoadingText={setLoadingText}
				/>
			)}
			<AccountOptions
				userInfo={userInfo}
				toastRef={toastRef}
				setReloadUserInfo={setReloadUserInfo}
			/>
			<Button
				title='Logout'
				buttonStyle={styles.btnLogout}
				titleStyle={styles.btnLogoutText}
				onPress={() => firebase.auth().signOut()}
			/>
			<Toast ref={toastRef} position='center' opacity={0.9} />
			<Loading text={loadingText} isVisible={loading} />
		</View>
	)
}

const styles = StyleSheet.create({
	viewUserInfo: {
		minHeight: '100%',
		backgroundColor: '#f2f2f2',
	},
	btnLogout: {
		marginTop: 30,
		borderRadius: 0,
		backgroundColor: '#fff',
		borderTopWidth: 1,
		borderTopColor: '#e3e3e3',
		borderBottomWidth: 1,
		borderBottomColor: '#e3e3e3',
		paddingTop: 10,
		paddingBottom: 10,
	},
	btnLogoutText: {
		color: '#00a680',
	},
})

export default UserLogged
