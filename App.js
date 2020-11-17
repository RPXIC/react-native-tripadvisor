import React from 'react'
import { LogBox } from 'react-native'
import Navigation from './app/navigations/Navigation'
import * as firebase from 'firebase'
import { firebasApp } from './app/utils/firebase'
import { decode, encode } from 'base-64'

LogBox.ignoreLogs(['Setting a timer'])

if (!global.btoa) global.btoa = encode
if (!global.atob) global.atob = decode

export default function App() {
	return <Navigation />
}
