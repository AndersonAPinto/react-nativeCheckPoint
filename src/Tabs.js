import {React} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TemplateTeste from './TemplateTeste';
import DadosSalvos from './DadosSalvos';

const Tab = createBottomTabNavigator();

export default function Tabs() {
   

    return (
        <Tab.Navigator>
            <Tab.Screen name='TemplateTeste' component={TemplateTeste} />
            <Tab.Screen name='DadosSalvos' component={DadosSalvos} />
        </Tab.Navigator>
    )
}

