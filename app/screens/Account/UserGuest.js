import React from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native'
import { Button } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native'

const UserGuest = () => {
	const navigation = useNavigation()

	return (
		<ScrollView centerContent={true} style={styles.viewBody}>
			<Image
				source={require('../../../assets/img/user-guest.jpg')}
				resizeMode="contain"
				style={styles.image}
			/>
			<Text style={styles.title}>Check your profile of 5 forks</Text>
			<Text style={styles.description}>
				Find the best restaurant. Vote and describe how your experience
				has been in one of them
			</Text>
			<View style={styles.viewBtn}>
				<Button
					title="See your profile"
					buttonStyle={styles.btnStyle}
					containerStyle={styles.btnContainer}
					onPress={() => navigation.navigate('login')}
				/>
			</View>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	viewBody: {
		marginLeft: 30,
		marginRight: 30,
	},
	image: {
		height: 300,
		width: '100%',
		marginBottom: 40,
	},
	title: {
		fontWeight: 'bold',
		fontSize: 19,
		marginBottom: 10,
		textAlign: 'center',
	},
	description: {
		textAlign: 'center',
		marginBottom: 20,
	},
	viewBtn: {
		flex: 1,
		alignItems: 'center',
	},
	btnStyle: {
		backgroundColor: '#00a680',
	},
	btnContainer: {
		width: '70%',
	},
})

export default UserGuest
