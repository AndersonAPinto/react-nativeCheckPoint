import React, {useState} from 'react'
import { View, TextInput, SafeAreaView, StyleSheet  } from 'react-native';
import CalculadoraDiasUteis from './CalculadoraDiasUteis'

const TemplateTeste = () => {
    const [cargaHoraria, setCargaHoraria] = useState(0);
    return (



        <SafeAreaView style={styles.container}>
            
            <TextInput
                style={styles.input}
                placeholder="Digite a carga horária total"
                value={cargaHoraria.toString()}
                onChangeText={text => setCargaHoraria(parseInt(text) || 0)}
                keyboardType="numeric"
            />

            <CalculadoraDiasUteis cargaHoraria={cargaHoraria} />


        </SafeAreaView>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textCargaH: {
        marginBottom: 10,
    },
});
export default TemplateTeste
