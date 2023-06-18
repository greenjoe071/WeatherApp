import { StatusBar, } from "expo-status-bar";
import React, { useCallback, useEffect, useState, } from "react";
import {
    Text,
    View,
    SafeAreaView,
    Image,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Animated
} from "react-native";

import { theme } from '../theme'
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Entypo, Feather } from '@expo/vector-icons';
import { weatherImages } from "../constants";

import { getData, storeData } from '../utils/asyncStorage';
import { debounce } from 'lodash';

import { fetchLocation, fetchWeatherForecast } from "../api/weather";



//Greeting
// const currentHour = new Date().getHours();
// let greeting = '';
// if (currentHour < 12) {
//     greeting = 'Good Morning! ';
// } else if (currentHour < 18) {
//     greeting = 'Good Afternoon';
// } else {
//     greeting = 'Good Evening';
// }

export default function HomeScreen() {
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([])
    const [weather, setWeather] = useState({})
    const [loading, setLoading] = useState(true)


    const getLocations = (loc) => {
        console.log("You entered: ", loc);
        setLocations([]);
        setLoading(true);
        fetchWeatherForecast({
            cityName: loc.name,
            days: "7"
        }).then(data => {
            setWeather(data)
            setLoading(false)
            storeData("city", loc.name)
            console.log("got forecast data: ", data)
        })
        toggleSearch(false)

    }

    const handleSearch = value => {
        if (value.length > 2) {
            fetchLocation({ cityName: value }).then(data => {
                setLocations(data)
            })
        }
    }

    useEffect(() => {
        initialWeatherData();
    }, [])

    // Data for fresh open
    const initialWeatherData = async () => {
        let savedCity = await getData("city")
        let cityName = "austin"
        if (savedCity) cityName = savedCity
        fetchWeatherForecast({
            cityName,
            days: "7"
        }).then(data => {
            setWeather(data)
            setLoading(false)
        })
    }


    // limiting api calls
    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])

    const { current, location } = weather
    // console.log("avg temp: ", weather.forecast.forecastday[0].day?.avgtemp_f)


    return (

        <View className="flex-1 relative">
            <StatusBar style="dark" />
            <Image blurRadius={20}
                source={require('../assets/images/bgimg.jpg')}
                className="absolute h-full w-full"
            />

            {
                loading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size={100} />
                    </View>

                ) : (
                    <SafeAreaView className="flex flex-1">

                        {/* SECTION: Search */}
                        
                            <View style={{ height: 55 }} className="my-10 mx-4 relative z-50">
                                <View className="flex-row justify-end items-center rounded-full"
                                    style={{ backgroundColor: showSearch ? theme.bgWhite(0.9) : "transparent" }}>

                                    {
                                        showSearch ? (
                                            <TextInput
                                                onChangeText={handleTextDebounce}
                                                placeholder="Search City"
                                                placeholderTextColor={"lightgray"}
                                                className="pl-6 h-10 flex-1 text-base text-black"
                                            />

                                        ) : null
                                    }

                                    <TouchableOpacity
                                        onPress={() => toggleSearch(!showSearch)}
                                        style={{ backgroundColor: theme.bgBlack(0.2) }}
                                        className="rounded-full p-3 m-1"
                                    >

                                        <Entypo name="magnifying-glass" size={24} color="black" />
                                    </TouchableOpacity>
                                </View>
                                
                                {
                                    locations.length > 0 && showSearch ? (
                                        <View className="absolute w-full bg-gray-200 top-16 rounded-2xl">
                                            {
                                                locations.map((loc, index) => {
                                                    let showBorder = index + 1 != locations.length;
                                                    let borderStyle = showBorder ? "border-b-2 border-b-gray-300" : ""
                                                    return (
                                                        <TouchableOpacity
                                                            key={index}
                                                            onPress={() => getLocations(loc)}
                                                            className={"flex-row items-center border-0 p-3 px- mb-1 " + borderStyle}
                                                        >
                                                            <Feather name="map-pin" size={15} color="gray" />
                                                            <Text className="ml-2">{loc?.name}, {loc?.country}, {loc?.region}</Text>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                            }
                                        </View>
                                    ) : null
                                }
                            </View>
                            <ScrollView contentContainerStyle={{ marginTop: 1 }} >

  {/* SECTION: Forecast */}

                            <View className="flex-col ">
                                <Text className="text-black text-center text-5xl  mb-3">{Math.floor(current?.temp_f)}°</Text>
                                <Text className="text-black text-center text-3xl font-bold">
                                    {location?.name}
                                    <Text className="text-lg font-semibold text-gray-600">
                                        {" " + location?.region}
                                    </Text>

                                </Text>
                                <View className="flex-row justify-center" >
                                    <Text className="text-black text-center text-sm font-bold text-black-600">{current?.condition?.text} </Text>
                                    <Text className="text-black text-center text-sm font-semibold text-gray-600">and feels like: {Math.round(current?.feelslike_f)}°</Text>

                                </View>
                               
                                
                            </View>

                            <View className="flex-row justify-center mt-1">
                                {/* <Image source={{uri: 'https://'+current?.condition?.icon}}
                    className="w-20 h-20"
                /> */}

                                <Image
                                    source={weatherImages[current?.condition?.text || 'other']}
                                    //  source={require('../assets/images/partlycloudy.png')}
                                    className="w-20 h-20"
                                />
                                <View className="my-3 ml-3">
                                    <Text className="font-medium text-base">H: {Math.floor(weather?.forecast?.forecastday[0]?.day?.maxtemp_f - 5)}°</Text>
                                    <Text className="font-medium text-base">L: {Math.floor(weather?.forecast?.forecastday[0]?.day?.mintemp_f)}°</Text>
                                </View>
                            </View>
                            {/* Other Stats                 */}
                            <View className="flex-row justify-between mb-3 mx-11 mt-5 ">
                                <View className="flex-row space-x-2 items-center">
                                    <View className="flex-col items-center">
                                        <Feather name="wind" size={20} color="gray" className="h-6 w-6" />
                                        <Text className="text-black font-semibold text-sm">Wind</Text>
                                        <Text className="text-black font-semibold text-base">
                                            {Math.round(current?.wind_mph)}
                                            <Text className="font-light text-sm">mph</Text>
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-row space-x-2 items-center">
                                    <View className="flex-col items-center">
                                        <Ionicons name="rainy-outline" size={20} color="gray" />
                                        <Text className="text-black font-semibold text-sm">Rain</Text>
                                        <Text className="text-black font-semibold text-base">
                                            {Math.round(weather?.forecast?.forecastday[0]?.day?.daily_chance_of_rain)}
                                            <Text className="font-light text-sm">%</Text>
                                        </Text>
                                    </View>
                                </View>
                                <View className="flex-row space-x-2 items-center">
                                    <View className="flex-col items-center">
                                        <Ionicons name="md-water-outline" size={20} color="gray" />
                                        <Text className="text-black font-semibold text-sm">Humidity</Text>
                                        <Text className="text-black font-semibold text-base">
                                            {Math.round(current?.humidity)}
                                            <Text className="font-light text-sm">%</Text>
                                        </Text>
                                    </View>
                                </View>
                            </View>

    {/* Hourly Forecast */}
    <View className="mb-2 space-y-3">
        <View className="flex-row items-center mx-5 space-x-2">

            <View className="flex-row items-center mx-5 space-x-2">
                <Ionicons name="ios-time-outline"  size={20} color="gray" />
                <Text className="text-sm text-gray-600">The Rest of Today...</Text>
            </View>
        </View>
        <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsHorizontalScrollIndicator={false}
        >
            {
                weather?.forecast?.forecastday[0]?.hour?.map((item, index) => {
                    // const today = new Date(); //trying this
                    // const tomorrow = new Date(today.getTime() + (1000 * 60 * 60 * 24));
                    const time = new Date(item.time);
                    const currentTime = new Date()
                    const hour = time.toLocaleTimeString([], {hour: 'numeric', hour12: true});
                    const chanceOfRain = item?.chance_of_rain

                    if (currentTime < time) { 
                         return (
                        <View
                            key={index}
                            className="flex justify-center items-center w-16 rounded-xl py-3 space-y-1 mr-3"
                            style={{ backgroundColor: theme.bgWhite(0.30) }}
                        >
                            <Text className="text-gray-500 text-sm font-semibold">{hour}</Text>
                            
                            <Ionicons name="rainy-outline" size={20} color="gray" />
                            <Text className="text-gray-500 text-sm font-semibold">{Math.floor(item?.chance_of_rain)}%</Text>
                            <Image
                                source={weatherImages[item?.condition?.text || 'other']}
                                className="w-9 h-9"
                            />
                            <Text className="text-black text-sm font-semibold">
                                {Math.floor(item?.temp_f)}°
                            </Text>
                        </View>
                    );

                    }

                  
                })
}
                  
                </ScrollView>
              </View>

       {/* Daily Forecast */}
                            <View className="ml-5 mt-1 space-y-3" >
                                <View className="flex-row items-center mx-5 space-x-2">
                                    <Ionicons name="ios-calendar-outline" size={20} color="gray" />
                                    <Text className="text-sm text-gray-600">Daily Forecast</Text>
                                </View>
                                {
                                    weather?.forecast?.forecastday?.map((item, index) => {
                                        const today = new Date(); //trying this
                                        const tomorrow = new Date(today.getTime() + (1000 * 60 * 60 * 24)); //trying this
                                        let date = new Date(item.date)  // original
                                        let options = { weekday: 'short' }
                                        let dayName = date.toLocaleDateString('en-US', options)
                                        dayName = dayName.split(',')[0]

                                        if (date >= tomorrow) {
                                            return (
                                                <View
                                                    key={index}
                                                    style={styles.forecastBox}>
                                                    <Text className="text-black font-semibold text-sm">{dayName}</Text>

                                                    <Image
                                                        // source={{uri: 'https:'+current?.condition?.icon}} 
                                                        source={weatherImages[item?.day?.condition?.text]}
                                                        style={{ width: 30, height: 30 }}
                                                    />
                                                    <Text> {item?.day?.condition?.text}</Text>
                                                    <Text >{Math.floor(item?.day?.maxtemp_f - 6)}° L: {Math.floor(item?.day?.mintemp_f)}° </Text>
                                                </View>

                                            )
                                        }
                                    })
                                }

                            </View>

                        </ScrollView>


                    </SafeAreaView>
                )
            }

        </View>

    )
};



const styles = StyleSheet.create({

    forecastBox: {
        opacity: .9,
        margin: 8,
        marginBottom: 1,
        padding: 10,
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'center',
    },

});