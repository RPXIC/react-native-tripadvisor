import React, { useState } from 'react'
import { View } from 'react-native'
import { Icon, ListItem } from 'react-native-elements'
import { map } from 'lodash'
import Modal from '../Modal'
import ChangeDisplayNameForm from './ChangeDisplayNameForm'
import ChangeEmailForm from './ChangeEmailForm'
import ChangePasswordForm from './ChangePasswordForm'

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
	const menuOptions = generateOptions(selectedComponent)

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

function generateOptions(selectedComponent) {
	return [
		{
			title: 'Change name and surname',
			iconType: 'material-community',
			iconNameLeft: 'account-circle',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectedComponent('displayName'),
		},
		{
			title: 'Change email',
			iconType: 'material-community',
			iconNameLeft: 'at',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectedComponent('email'),
		},
		{
			title: 'Change password',
			iconType: 'material-community',
			iconNameLeft: 'lock-reset',
			iconColorLeft: '#ccc',
			iconNameRight: 'chevron-right',
			iconColorRight: '#ccc',
			onPress: () => selectedComponent('password'),
		},
	]
}

export default AccountOptions
