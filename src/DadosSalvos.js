import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableWithoutFeedback, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


const DadosSalvos = () => {
    const [dadosSalvos, setDadosSalvos] = useState({});

    console.log('Os dadosSalvos sao ', dadosSalvos)
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

    return (
        <ScrollView style={styles.container}>
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
                <View style={styles.noDataContainer}>
                  <Text>Sem dados salvos!</Text>
                </View>
            )}
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    dataContainer: {
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    dataTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    eventoText: {
        fontSize: 16,
    },
    noDataContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
});
export default DadosSalvos;

