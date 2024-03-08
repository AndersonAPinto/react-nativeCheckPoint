import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableWithoutFeedback, Alert, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';


const DadosSalvos = () => {
    const [dadosSalvos, setDadosSalvos] = useState({});
    //console.log(dadosSalvos)
    let pressTimer;

    useFocusEffect(
        useCallback(() => {
            const buscarDadosSalvos = async () => {
                try {
                    const dadosSalvos = await AsyncStorage.getItem('dadosSalvos');
                    if (dadosSalvos !== null) {
                        setDadosSalvos(JSON.parse(dadosSalvos));
                    } else {
                        console.log("Nenhum dado salvo encontrado");
                    }
                } catch (error) {
                    console.log("Erro ao buscar dados salvos", error);
                }
            };
            buscarDadosSalvos();
        }, [])
    );
    const onLongPress = async (data) => {
        pressTimer = setTimeout(async () => {
            const updatedDadosSalvos = { ...dadosSalvos };
            delete updatedDadosSalvos[data];
            await AsyncStorage.setItem('dadosSalvos', JSON.stringify(updatedDadosSalvos));
            setDadosSalvos(updatedDadosSalvos);
            Alert.alert("Dado excluído", `O dado de ${data} foi excluído.`);
        }, 1000);
        return pressTimer;
    };
    const onPressOut = () => {
        clearTimeout(pressTimer);
    };
    const datasSalvamento = Object.keys(dadosSalvos);
    console.log(dadosSalvos);
    return (
        <>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={{ flex: 1, backgroundColor:'#0D101B' }}>
            <ScrollView style={styles.container}>

                <Text style={styles.textExtrato}>
                    <Icon
                        name="list"
                        size={30}
                        color="#c2c1cc" /> Extratos</Text>
                <Text style={styles.linha}></Text>

                {datasSalvamento.length > 0 ? datasSalvamento.reverse().map((data, index) => {
                    return (
                        <TouchableWithoutFeedback
                            key={index}
                            onPressIn={() => onLongPress(data)}
                            onPressOut={onPressOut}
                        >
                            <View style={styles.dataContainer}>
                                <Text style={styles.dataTitle}>Data: {data}</Text>
                                {dadosSalvos[data].map((evento, idx) => (
                                    <Text key={idx} style={styles.eventoText}>
                                        {evento.tipo} às {new Date(evento.momento).toLocaleTimeString()}
                                    </Text>
                                ))}
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }) : (
                    <View >
                        <Text style={styles.noDataContainer}>Sem dados salvos!</Text>
                    </View>
                )}


            </ScrollView>
            </SafeAreaView>
            </>

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        margin: 0,
        backgroundColor: '#0C2134',
    },
    textExtrato: {
        color: '#C2C1CC',
        fontSize: 30,
        marginLeft: 10,
    },
    linha: {
        borderBottomColor: '#C2C1CC', // Cor da linha
        borderBottomWidth: 2, // Espessura da linha
        marginVertical: 20, // Espaço vertical acima e abaixo da linha
    },
    dataContainer: {
        backgroundColor: '#C2C1CC',
        marginVertical: 10,
        borderRadius: 10,
        padding: 5,
    },
    dataTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'blue',
        marginBottom: 2,

    },
    eventoText: {
        fontSize: 16,
    },
    noDataContainer: {
        color: '#C2C1CC',
        fontSize: 20,
    },
});
export default DadosSalvos;

