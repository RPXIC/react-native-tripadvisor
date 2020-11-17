import React, { useState, useRef } from 'react'
import { View, Text } from 'react-native'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'
import AddRestaurantForm from '../../components/Restaurants/AddRestaurantForm'

const AddRestaurant = (props) => {
	const { navigation } = props
	const toastRef = useRef()
	const [isLoadding, setIsLoading] = useState(false)

	return (
		<View>
			<AddRestaurantForm
				toastRef={toastRef}
				setIsLoading={setIsLoading}
				navigation={navigation}
			/>
			<Toast ref={toastRef} position='center' opacity={0.9} />
			<Loading isVisible={isLoadding} text='Creating restaurant' />
		</View>
	)
}

export default AddRestaurant
