import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import feriados from './dataFeriados2024.json';
import Cronometro from './Cronometro';

const CalculadoraDiasUteis = () => {
    const [diasUteis, setDiasUteis] = useState(0);
    const [cargaHoraria, setCargaHoraria] = useState(160); // Exemplo de carga horária total

    useEffect(() => {
        const dataAtual = new Date();
        calcularDiasUteis(dataAtual.getFullYear(), dataAtual.getMonth());
    }, []);

    const calcularDiasUteis = (ano, mes) => {
        let contadorDiasUteis = 0;

        // Início: dia 15 do mês anterior
        const dataInicio = new Date(ano, mes - 1, 15);
        // Fim: dia 16 do mês atual
        const dataFim = new Date(ano, mes, 16);

        for (let data = new Date(dataInicio); data <= dataFim; data.setDate(data.getDate() + 1)) {
            const diaSemana = data.getDay();
            // Formatação da data para corresponder ao formato no arquivo JSON
            const dataFormatada = `${data.getDate().toString().padStart(2, '0')}-${(data.getMonth() + 1).toString().padStart(2, '0')}-${ano}`;

            // Verifica se a data é feriado
            const ehFeriado = feriados.nacionais.some(feriado => feriado.data === dataFormatada);
            // Contabiliza o dia se não for sábado, domingo ou feriado
            if (diaSemana !== 0 && diaSemana !== 6 && !ehFeriado) {
                contadorDiasUteis++;
            }
        }

        console.log(`Total de dias úteis: ${contadorDiasUteis}`);
        setDiasUteis(contadorDiasUteis);

        // Resetando a data para evitar efeitos colaterais do loop
        dataFim.setDate(dataFim.getDate() - 1);
    };
    
    const cargaHorariaDecimal = diasUteis > 0 ? parseInt(cargaHoraria) / diasUteis : 0;
    let horas = Math.floor(cargaHorariaDecimal);
    let minutos = Math.round((cargaHorariaDecimal - horas) * 60);

    if (minutos >= 60) {
        minutos -= 60;
        horas += 1;
    }

    const cargaHorariaFormatada = `${horas}h e ${minutos}min`;
    
    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Digite a carga horária total"
                value={cargaHoraria.toString()}
                onChangeText={text => setCargaHoraria(parseInt(text) || 0)}
                keyboardType="numeric"
            />
            <Text>Dias úteis no período: {diasUteis}</Text>
            <Text style={styles.textCargaH}>A carga horária/dia é de: {cargaHorariaFormatada}</Text>
            <Cronometro  cargaHorariaFormatada={cargaHorariaFormatada} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        width: '80%',
        padding: 10,
        marginBottom: 20,
    },
    textCargaH:{
        marginBottom:10,
    },
});

export default CalculadoraDiasUteis;
