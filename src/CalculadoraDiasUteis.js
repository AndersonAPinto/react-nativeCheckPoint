import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import feriados from './dataFeriados2024.json';
import Cronometro from './Cronometro';
import { SafeAreaView } from 'react-native-safe-area-context';


const CalculadoraDiasUteis = ({ cargaHoraria }) => {
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

    const cargaHorariaFormatada = `${horas} horas : ${minutos} min`;
    console.log('cargaHoraria recebida em CalculadoraDiasUteis:', cargaHoraria);
    const [mesAtual, setMesAtual] = useState(new Date());
    const ano = mesAtual.getFullYear()
    const mes = mesAtual.getMonth();
    const mesAnterior = new Date(ano, mes - 1, 15);
    const mesQuinzenaAtual = new Date(ano, mes, 15);
    return (
            <View>
                <View style={styles.container}>
                    <Text style={styles.textDate}>Período: {mesAnterior.toLocaleDateString('pt-BR')} à {mesQuinzenaAtual.toLocaleDateString('pt-BR')}</Text>
                    <Text style={styles.textCargaUteis}>Dias Úteis: {diasUteis}</Text>
                    <Text style={styles.textCargaHoraria}>Carga horária/Dia: {cargaHorariaFormatada}</Text>
                </View>
                <Cronometro cargaHorariaFormatada={cargaHorariaFormatada} />
            </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        width: 'auto',
        height: 100,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 10,
        backgroundColor: '#383c4c',
        alignItems:'start',
        justifyContent:'center',
        marginBottom: '10%',
        paddingLeft: 20,
        
    },
    textDate:{
        color: '#C2C7CC',
        fontSize: 15,
    },
    textCargaHoraria:{
        color: '#C2C7CC',
        fontSize: 15,
    },
    textCargaUteis:{
        color: '#C2C7CC',
        fontSize: 15,
        
    }
});

export default CalculadoraDiasUteis;
