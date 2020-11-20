import React from 'react'
import {
	StyleSheet,
	View,
	Text,
	FlatList,
	ActivityIndicator,
	TouchableOpacity,
} from 'react-native'
import { Image } from 'react-native-elements'
import { size } from 'lodash'
import { useNavigation } from '@react-navigation/native'

const ListRestaurants = ({ restaurants, handleLoadMore, isLoading }) => {
	const navigation = useNavigation()

	return (
		<View>
			{size(restaurants) > 0 ? (
				<FlatList
					data={restaurants}
					renderItem={(restaurant) => (
						<Restaurant
							restaurant={restaurant}
							navigation={navigation}
						/>
					)}
					keyExtractor={(item, index) => index.toString()}
					onEndReachedThreshold={0.5}
					onEndReached={handleLoadMore}
					ListFooterComponent={<FooterList isLoading={isLoading} />}
				/>
			) : (
				<View style={styles.loaderRestaurants}>
					<ActivityIndicator size='large' color='#e1e1e1' />
					<Text>Loading...</Text>
				</View>
			)}
		</View>
	)
}

function Restaurant({
	restaurant: {
		item: { id, images, name, description, address },
	},
	navigation,
}) {
	const goToRestaurant = () => {
		navigation.navigate('restaurant', {
			id,
			name,
		})
	}

	return (
		<TouchableOpacity onPress={goToRestaurant}>
			<View style={styles.viewRestaurant}>
				<View style={styles.viewRestaurantImage}>
					<Image
						style={styles.imageRestaurant}
						resizeMode='cover'
						PlaceholderContent={<ActivityIndicator color='#fff' />}
						source={
							images[0]
								? { uri: images[0] }
								: require('../../../assets/img/no-image.png')
						}
					/>
				</View>
				<View>
					<Text style={styles.restaurantName}>{name}</Text>
					<Text style={styles.restaurantAddress}>{address}</Text>
					<Text style={styles.restaurantDescription}>
						{description.substr(0, 60)}...
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	)
}

function FooterList({ isLoading }) {
	if (isLoading) {
		return (
			<View style={styles.loaderRestaurants}>
				<ActivityIndicator size='large' />
			</View>
		)
	} else {
		return (
			<View style={styles.notFoundRestaurants}>
				<Text>There are no more restaurants</Text>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	loaderRestaurants: {
		marginTop: 10,
		marginBottom: 10,
		alignItems: 'center',
	},
	viewRestaurant: {
		flexDirection: 'row',
		margin: 10,
	},
	viewRestaurantImage: {
		marginRight: 20,
	},
	imageRestaurant: {
		width: 80,
		height: 80,
	},
	restaurantName: {
		fontWeight: 'bold',
	},
	restaurantAddress: {
		paddingTop: 2,
		color: 'grey',
	},
	restaurantDescription: {
		paddingTop: 2,
		color: 'grey',
		width: 300,
	},
	notFoundRestaurants: {
		marginTop: 10,
		marginBottom: 20,
		alignItems: 'center',
	},
})

export default ListRestaurants
