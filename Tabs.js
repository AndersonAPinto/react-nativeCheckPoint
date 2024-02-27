import {React} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TemplateTeste from './src/TemplateTeste';
import Teste from './src/Teste';

const Tab = createBottomTabNavigator();

export default function Tabs() {
   

    return (
        <Tab.Navigator>
            <Tab.Screen name='TemplateTeste' component={TemplateTeste} />
            <Tab.Screen name='Teste' component={Teste} />
        </Tab.Navigator>
    )
}

