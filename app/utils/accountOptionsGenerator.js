const accountOptionsGenerator = (selectedComponent) => {
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
export default accountOptionsGenerator
