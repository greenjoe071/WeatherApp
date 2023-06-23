import AsyncStorage from '@react-native-async-storage/async-storage'

// export const storeData = async (key, value) => {
//     try {
//         await AsyncStorage.setItem(key, value);
//     } catch (error) {
//         console.log("ERROR in storing value:  ", error);
//     }
//     console.log("The setItem value: ", value)
// }

// export const getData = async (key) => {
//     try {
//         const value = await AsyncStorage.getItem(key)
//         console.log("The getItem key: ", key)
//         return value
//     } catch (error) {
//         console.log("ERROR in retrieving value: ", error)
//     }
    
// };  // everything above is original.  don't want to lose this yet.


export const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.log("ERROR in storing value:  ", error);
    }
    console.log("The setItem value: ", value)
}

export const getData = async (key) => {
    const keys = ["city", "region"]
    try {
        const value = await AsyncStorage.getItem(key)
        console.log("getItem: ", key, ":", value)
        return JSON.parse(value)
    } catch (error) {
        console.log("ERROR in retrieving value: ", error)
    }
    
};

// export const getData = async (keys) => {
//     try {
//         const values = await Promise.all(keys.map(key => AsyncStorage.getItem(key)))
//         return values.reduce((obj, value, i) => {
//             obj[keys[i]] = value
//             return obj
//         }, {})
//     } catch (error) {
//         console.log("ERROR in retrieving value: ", error)
//     }
    
// };
