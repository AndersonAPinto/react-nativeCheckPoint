import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, AppState } from 'react-native';
import feriados from './dataFeriados2024.json';
import Cronometro from './Cronometro';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import '../'

const CalculadoraDiasUteis = ({ cargaHoraria }) => {
    const [diasUteis, setDiasUteis] = useState(0);
    const [periodo, setPeriodo] = useState({ inicio: null, fim: null });

    // Esta função atualiza as datas de início e fim do período
    const atualizarDatas = () => {
        const agora = new Date();
        let inicio, fim;
    
        // Se o dia atual for maior que 16, ajuste o período para começar neste mês e terminar no próximo
        if (agora.getDate() > 16) {
            inicio = new Date(agora.getFullYear(), agora.getMonth(), 16); // Começa no dia 16 do mês atual
            fim = new Date(agora.getFullYear(), agora.getMonth() + 1, 15); // Termina no dia 15 do próximo mês
        } else {
            // Caso contrário, o período começa no mês anterior e termina neste mês
            inicio = new Date(agora.getFullYear(), agora.getMonth() - 1, 16); // Começa no dia 16 do mês anterior
            fim = new Date(agora.getFullYear(), agora.getMonth(), 15); // Termina no dia 15 do mês atual
        }
    
        setPeriodo({ inicio, fim });
    };
    
    useEffect(() => {
        atualizarDatas();
    }, [cargaHoraria]);

    useEffect(() => {
        const appStateListener = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                atualizarDatas();
                //console.log(nextAppState)
            }
        });

        atualizarDatas(); // Também atualiza as datas ao montar

        return () => {
            appStateListener.remove();
        };
    }, []);

    // Esta função calcula os dias úteis baseando-se no período atualizado
    useEffect(() => {
        const calcularDiasUteis = () => {
            let contadorDiasUteis = 0;
            for (let data = new Date(periodo.inicio); data <= periodo.fim; data.setDate(data.getDate() + 1)) {
                const diaSemana = data.getDay();
                const dataFormatada = `${data.getFullYear()}-${(data.getMonth() + 1).toString().padStart(2, '0')}-${data.getDate().toString().padStart(2, '0')}`;
                const ehFeriado = feriados.nacionais.some(feriado => feriado.data === dataFormatada);
                
                if (diaSemana !== 0 && diaSemana !== 6 && !ehFeriado) {
                    contadorDiasUteis++;
                }
            }
            setDiasUteis(contadorDiasUteis);
        };

        calcularDiasUteis();
    }, [periodo]);

    const cargaHorariaDecimal = diasUteis > 0 ? cargaHoraria / diasUteis : 0;
    const horas = Math.floor(cargaHorariaDecimal);
    let minutos = Math.round((cargaHorariaDecimal - horas) * 60);

    if (minutos >= 60) {
        minutos -= 60;
        horas += 1;
    }

    const cargaHorariaFormatada = `${horas} horas e ${minutos} minutos`;

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text style={styles.textDate}>
                    <Icon name="calendar" size={20} color="#c2c1cc" /> 
                    Período: {periodo.inicio?.toLocaleDateString('pt-BR')} à {periodo.fim?.toLocaleDateString('pt-BR')}
                </Text>
                <Text style={styles.textCargaUteis}>Dias Úteis: {diasUteis}</Text>
                <Text style={styles.textCargaHoraria}>Carga horária/Dia: {cargaHorariaFormatada}</Text>
            </View>
            <Cronometro cargaHorariaFormatada={cargaHorariaFormatada} />
           
        </SafeAreaView> 
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
            alignItems: 'start',
            justifyContent: 'center',
            marginBottom: 10,
            paddingLeft: 20,
        },
        textDate: {
            color: '#C2C7CC',
            fontSize: 15,
        },
        textCargaHoraria: {
            color: '#C2C7CC',
            fontSize: 15,
        },
        textCargaUteis: {
            color: '#C2C7CC',
            fontSize: 15,
        }
    });

export default CalculadoraDiasUteis;

