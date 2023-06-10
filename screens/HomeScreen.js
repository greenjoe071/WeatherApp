import { StatusBar, setStatusBarBackgroundColor } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import {
    Text,
    View,
    SafeAreaView,
    Image,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    StyleSheet
} from "react-native";

import { theme } from '../theme'
import { Ionicons } from '@expo/vector-icons';
import { Entypo, Feather } from '@expo/vector-icons';

import { weatherImages } from "../constants";

import { API_KEY } from '@env';
import {debounce} from 'lodash';
import { fetchLocation, fetchWeatherForecast } from "../api/weather";


//Greeting
const currentHour = new Date().getHours();
let greeting = '';
if (currentHour < 12) {
    greeting = 'Good Morning!';
} else if (currentHour < 18) {
    greeting = 'Good Afternoon';
} else {
    greeting = 'Good Evening';
}

export default function HomeScreen() {
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([])
    const [weather, setWeather] =useState({})
    

    const getLocations = (loc) => {
        console.log("You entered: ", loc);
        setLocations([]);
        fetchWeatherForecast({
            cityName: loc.name,
            days: "7"
        }).then(data => {
            setWeather(data)
            console.log("got forecast data: ", data)
        })
        toggleSearch(false)
    }

    const handleSearch = value => {
        if(value.length>2) {
            fetchLocation({cityName: value}).then(data => {
                setLocations(data)
            })
        
        }
    }
    const handleTextDebounce = useCallback(debounce(handleSearch, 1200), [])

    const {current, location} = weather

    return (

        <View className="flex-1 relative">
            <StatusBar style="dark" />
            <Image blurRadius={20}
                source={require('../assets/images/bgimg.jpg')}
                className="absolute h-full w-full"
            />
            
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
                                                    onPress={() => getLocations(loc)}
                                                    key={index}
                                                    className={"flex-row items-center border-0 p-3 px- mb-1 " + borderStyle}
                                                >
                                                    <Feather name="map-pin" size={15} color="gray" />
                                                    <Text className="ml-2">{loc?.name}, {loc?.region}</Text>
                                                </TouchableOpacity>
                                            )
                                        })
                                    }
                                </View>
                            ) : null
                        }
                    </View>
                    {/* SECTION: Forecast */}

                    <View className="flex-col ">
                    <Text className="text-black text-center text-5xl  mb-3">{Math.round(current?.temp_f)}°</Text>
                        <Text className="text-black text-center text-3xl font-bold">
                            {location?.name}
                            <Text className="text-lg font-semibold text-gray-600">
                                {" " + location?.region}
                            </Text>

                        </Text>
                        <Text className="text-black text-center text-sm font-semibold">{current?.condition?.text}</Text>
                        {/* <Text className="text-black text-center text-3xl font-semibold">{current?.temp_f}°</Text> */}
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
                            <Text className="font-medium text-base">H:600°</Text>
                            <Text className="font-medium text-base">L: 33°</Text>
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
                                    14
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

  {/* Forecasted weather */}
  <ScrollView contentContainerStyle={{ marginTop: 1 }} >

                    <View className="ml-5 mt-5 mb-2 space-y-3" >

                        <View className="flex-row items-center mx-5 space-x-2">
                            <Ionicons name="ios-calendar-outline" size={20} color="gray" />
                            <Text className="text-sm text-gray-600">Daily Forecast</Text>
                        </View>
            {
                weather?.forecast?.forecastday?.map((item, index) => {
                    let date = new Date(item.date)
                    let options = {weekday: 'short'}
                    let dayName = date.toLocaleDateString('en-US', options)
                    dayName = dayName.split(',')[0]
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
                                <Text >{Math.round(item?.day?.maxtemp_f)}° L: {Math.round(item?.day?.mintemp_f)}° </Text>
                    </View>
                    
                    )
                })
            }
               

                </View>
                </ScrollView>
                    
                
            </SafeAreaView>
            

        </View>

    )
};



const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'flex-start',
        flex: 1,
    },

    image: {
        flex: 1,
        resizeMode: 'cover',
    },
    textInput: {
        marginTop: 10,
        height: 40,
        margin: 12,
        padding: 10,
        width: '90%',
        maxWidth: 500,
        backgroundColor: '#fff',
        borderRadius: 10,

    },
    tempText: {
        fontSize: 60,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        marginBottom: 1,
    },

    currentInfoWrapper: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: "space-between",

    },
    HiLowWrapper: {
        flexDirection: "column",
        // alignItems: 'center',
        // justifyContent: "center",
    },
    currentForecastBox: {
        //  opacity: .5,
        margin: 5,
        padding: 10,
        width: 100,
        // minWidth: 100,
        // maxWidth: 500,
        // backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: "column",
        justifyContent: "space-around",
        alignItems: 'center',
    },

    forecastBox: {
         opacity: .9,
        margin: 12,
        padding: 10,
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: 'center',
    },

    // '@media (min-width: 768px)': {
    //   forecastBox: {
    //     margin: 12,
    //     padding: 10,
    //     width: '90%',
    //     minWidth: 350,
    //     maxWidth: 500,
    //     backgroundColor: 'red',
    //     borderRadius: 10,
    //     flexDirection: "row",
    //     justifyContent: "space-around",
    //     alignItems: 'center',
    //   },
    // },



    infoWrapperColumn: {
        flexDirection: "column",
        marginHorizontal: 20,

    },
    infoWrapperTextLine1: {
        fontWeight: "bold",
    },
    infoWrapperTextLine2: {

    },
    forecastWrapper: {
        // opacity: .5,
        // margin: 12,
        // padding: 10,
        width: '90%',
        maxWidth: 500,
        backgroundColor: '#fff',
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: 'center',

    },
    forecastWrapperDay: {
        opacity: 1,
        fontWeight: "400",
        fontSize: 18,
    },

});