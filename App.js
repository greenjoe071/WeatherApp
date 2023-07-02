
import HomeScreen from './screens/HomeScreen';
// import React, { useState, useEffect } from 'react'
// import * as Location from 'expo-location'


export default function App() {
  // const [location, setLocation] = useState(null)
  // const [error, setError] = useState(null)

  // useEffect(() => {
  //   (async() => {
  //     let { status } =await Location.requestForegroundPermissionsAsync()
  //     if (status !== 'granted') {
  //       setError('permission to access location was denied')
  //       return
  //     }
  //     let location = await Location.getCurrentPositionAsync({})
  //     setLocation(location)
  //   })()
  // }, [])

  // if (location) {
  //   console.log("lat: ", location.coords.latitude, "lon: ",location.coords.longitude)
  // }

  return (
   <HomeScreen />
  );
}