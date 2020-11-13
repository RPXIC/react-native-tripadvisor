import React from 'react'
import { View, Text, Button } from 'react-native'
import * as firebase from 'firebase'

const UserLogged = () => {
	return (
		<View>
			<Text>User Logged</Text>
			<Button title="Logout" onPress={() => firebase.auth().signOut()} />
		</View>
	)
}

export default UserLogged
