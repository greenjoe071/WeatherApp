import axios from 'axios';
import { API_KEY } from '@env'
import React, { useState, useEffect } from 'react'
import * as Location from 'expo-location'


// users current location - not searched-for city
const userCurrentLocationEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.lat} ${params.lon}&days=${params.days}&aqi=no`

const forecastEndpoint = params => `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${params.cityName} ${params.region}&days=${params.days}&aqi=no&alerts=no`

const locationEndpoint = params => `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${params.cityName}`


const apiCall = async (endpoint) => {
  
    const options = {
        method: 'GET',
        url: endpoint
    } 
    try {
        const response = await axios.request(options)
        return response.data; 
    } catch(err) {
        console.log("error!", err)
        return null;
    }
}
//trying to fetch userscurrent location via lat and lon
export const fetchUserCurrentLocation = params => {
    return apiCall(userCurrentLocationEndpoint(params))
}

export const fetchWeatherForecast = params => {
    return apiCall(forecastEndpoint(params))
}

export const fetchLocation = params => {
    return apiCall(locationEndpoint(params))
}              