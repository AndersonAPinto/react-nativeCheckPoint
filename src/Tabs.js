import { React } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TemplateTeste from './TemplateTeste';
import DadosSalvos from './DadosSalvos';
import Icon from 'react-native-vector-icons/FontAwesome';


const Tab = createBottomTabNavigator();

export default function Tabs() {

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Início') {
                        iconName = focused ? 'briefcase' : 'suitcase';
                    } else if (route.name === 'Extratos') {
                        iconName = focused ? 'folder-open' : 'folder';
                    } else if (route.name === 'Configurações') {
                        iconName = focused ? 'sliders' : 'sliders';
                    }

                    // Você pode retornar qualquer componente que desejar aqui!
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle:{
                    borderTopWidth: 0,
                    backgroundColor: '#0D101B',
                    elevation: 0,
                    shadowOpacity: 0,
                },
            })}
            tabBarStyle={{
                borderTopWidth: 0,
                backgroundColor: '#0D101B',
                elevation: 0,
                shadowOpacity: 0,
            }}


        >
            <Tab.Screen
                name='Início'
                component={TemplateTeste}
                options={{
                    headerShown: false,

                }}
            />
            <Tab.Screen
                name='Extratos'
                component={DadosSalvos}
                options={{
                    headerShown: false,
                }}
            />
            {/*<Tab.Screen
                name='Configurações'
                component={Tela}
                options={{
                    headerShown: false,
                }}
            />*/}
        </Tab.Navigator>
    )
}

