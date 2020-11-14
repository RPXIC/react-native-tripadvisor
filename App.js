import React from 'react'
import { LogBox } from 'react-native'
import Navigation from './app/navigations/Navigation'
import * as firebase from 'firebase'
import { firebasApp } from './app/utils/firebase'

LogBox.ignoreLogs(['Setting a timer'])

export default function App() {
	return <Navigation />
}
