import {React} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TemplateTeste from './TemplateTeste';
import DadosSalvos from './DadosSalvos';
import Tela from './Tela';

const Tab = createBottomTabNavigator();

export default function Tabs() {
   

    return (
        <Tab.Navigator>
            <Tab.Screen 
            name='TemplateTeste' 
            component={TemplateTeste}
            options={{
                headerShown: false,
            }}
            />
            <Tab.Screen 
            name='DadosSalvos' 
            component={DadosSalvos}
            options={{
                headerShown: false,
            }}
            />
            <Tab.Screen 
                name='Configurações' 
                component={Tela} 
                options={{
                    headerShown: false,
                }}
            />
        </Tab.Navigator>
    )
}

