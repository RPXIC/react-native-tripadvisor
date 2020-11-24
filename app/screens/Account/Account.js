import React, { useState, useEffect } from 'react'
import * as firebase from 'firebase'
import { Loading } from '../../components'
import { UserLogged, UserGuest } from '../../screens'

const Account = () => {
	const [login, setLogin] = useState(null)

	useEffect(() => {
		firebase.auth().onAuthStateChanged((user) => {
			!user ? setLogin(false) : setLogin(true)
		})
	}, [])

	if (login === null) return <Loading isVisible={true} text={'Loading...'} />

	return login ? <UserLogged /> : <UserGuest />
}

export default Account
