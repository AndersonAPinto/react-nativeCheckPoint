import React, { useState } from 'react'
import { View, TextInput, StyleSheet } from 'react-native';
import CalculadoraDiasUteis from './CalculadoraDiasUteis'
import { SafeAreaView } from 'react-native-safe-area-context';

function TemplateTeste() {
    const [cargaHoraria, setCargaHoraria] = useState(0);
    console.log('cargaHoraria antes de passar para CalculadoraDiasUteis:', cargaHoraria);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <TextInput
                    style={styles.input}
                    //underlineColorAndroid="transparent"
                    selectionColor="transparent"
                    placeholder="Digite a carga horária total"
                    value={cargaHoraria.toString()}
                    onChangeText={text => setCargaHoraria(parseInt(text) || 0)}
                    keyboardType="numeric"
                />
                <CalculadoraDiasUteis cargaHoraria={cargaHoraria} />
            </View>
        </SafeAreaView>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginBottom: 20,
    },
    textCargaH: {
        marginBottom: 10,
    },
});

export default TemplateTeste
