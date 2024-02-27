import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import feriados from './dataFeriados2024.json';
import Cronometro from './Cronometro';
import { SafeAreaView } from 'react-native-safe-area-context';


const CalculadoraDiasUteis = ({cargaHoraria}) => {
    const [diasUteis, setDiasUteis] = useState(0);
    
    useEffect(() => {
        const dataAtual = new Date();
        calcularDiasUteis(dataAtual.getFullYear(), dataAtual.getMonth());
    }, [cargaHoraria]); // Adicionado cargaHoraria como dependência

    const calcularDiasUteis = (ano, mes) => {
        let contadorDiasUteis = 0;
        const dataInicio = new Date(ano, mes - 1, 15);
        const dataFim = new Date(ano, mes, 16);
        


        for (let data = new Date(dataInicio); data <= dataFim; data.setDate(data.getDate() + 1)) {
            const diaSemana = data.getDay();
            const dataFormatada = `${data.getDate().toString().padStart(2, '0')}-${(data.getMonth() + 1).toString().padStart(2, '0')}-${ano}`;
            const ehFeriado = feriados.nacionais.some(feriado => feriado.data === dataFormatada);

            if (diaSemana !== 0 && diaSemana !== 6 && !ehFeriado) {
                contadorDiasUteis++;
            }
        }

        setDiasUteis(contadorDiasUteis);
    };

    const cargaHorariaDecimal = diasUteis > 0 ? cargaHoraria / diasUteis : 0; // Removido parseInt pois cargaHoraria já é um número
    const horas = Math.floor(cargaHorariaDecimal);
    let minutos = Math.round((cargaHorariaDecimal - horas) * 60);

    if (minutos >= 60) {
        minutos -= 60;
        horas += 1;
    }

    const cargaHorariaFormatada = `${horas}h e ${minutos}min`;
    console.log('cargaHoraria recebida em CalculadoraDiasUteis:', cargaHoraria);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text>Dias úteis no período: {diasUteis}</Text>
                <Text style={styles.textCargaH}>A carga horária/dia é de: {cargaHorariaFormatada}</Text>
                <Cronometro cargaHorariaFormatada={cargaHorariaFormatada} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    textCargaH: {
        marginBottom: 10,
    },
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
});

export default CalculadoraDiasUteis;
