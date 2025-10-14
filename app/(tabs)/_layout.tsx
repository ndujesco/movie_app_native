import { images } from '@/constants/images'
import { Tabs } from 'expo-router'
import React from 'react'
import { ImageBackground, Text } from 'react-native'


const _Layout = () => {

    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                     title: 'Home',
                     tabBarIcon: ({focused}) => (
                        <>
                        <ImageBackground source={images.highlight} >

                            {/* <Image source={images.home} tintColor={"#151312"} className='size-5'/> */}
                            <Text>Home</Text>
                        </ImageBackground>
                        </>
                     )
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    // headerShown: false,
                    title: 'Search',
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    // headerShown: false,
                    title: 'Profile',
                }}
            />

            <Tabs.Screen
                name="saved"
                options={{
                    // headerShown: false,
                    title: 'Saved',
                }}
            />

        </Tabs>
    )
}


export default _Layout