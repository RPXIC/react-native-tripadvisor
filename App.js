import React, { useEffect } from 'react'
import Navigation from './app/navigations/Navigation'
import { firebasApp } from './app/utils/firebase'
import * as firebase from 'firebase'

export default function App() {
	useEffect(() => {
		firebase.auth().onAuthStateChanged(user => {
			console.log(user)
		})
	}, [])

	return <Navigation />
}
