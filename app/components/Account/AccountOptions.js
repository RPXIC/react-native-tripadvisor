import React, { useState } from 'react'
import { View } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'
import { map } from 'lodash'
import {
	Modal,
	ChangeDisplayNameForm,
	ChangeEmailForm,
	ChangePasswordForm,
} from '../../components'
import { accountOptionsGenerator } from '../../utils'

const AccountOptions = ({ userInfo, toastRef, setReloadUserInfo }) => {
	const [renderComponent, setRenderComponent] = useState(null)
	const [showModal, setShowModal] = useState(false)

	const selectedComponent = (key) => {
		switch (key) {
			case 'displayName':
				setRenderComponent(
					<ChangeDisplayNameForm
						displayName={userInfo.displayName}
						setShowModal={setShowModal}
						toastRef={toastRef}
						setReloadUserInfo={setReloadUserInfo}
					/>
				)
				setShowModal(true)
				break
			case 'email':
				setRenderComponent(
					<ChangeEmailForm
						email={userInfo.email}
						setShowModal={setShowModal}
						toastRef={toastRef}
						setReloadUserInfo={setReloadUserInfo}
					/>
				)
				setShowModal(true)
				break
			case 'password':
				setRenderComponent(
					<ChangePasswordForm
						setShowModal={setShowModal}
						toastRef={toastRef}
					/>
				)
				setShowModal(true)
				break
			default:
				setRenderComponent(null)
				setShowModal(false)
				break
		}
	}

	const menuOptions = accountOptionsGenerator(selectedComponent)

	return (
		<View>
			{map(menuOptions, (menu, index) => (
				<ListItem key={index} onPress={menu.onPress} bottomDivider>
					<Icon
						type={menu.iconType}
						name={menu.iconNameLeft}
						color={menu.iconColorLeft}
					/>
					<ListItem.Content>
						<ListItem.Title>{menu.title}</ListItem.Title>
					</ListItem.Content>
					<Icon
						type={menu.iconType}
						name={menu.iconNameRight}
						color={menu.iconColorRight}
					/>
				</ListItem>
			))}
			{renderComponent && (
				<Modal isVisible={showModal} setIsVisible={setShowModal}>
					{renderComponent}
				</Modal>
			)}
		</View>
	)
}

export default AccountOptions
