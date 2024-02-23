import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';

const Cronometro = ({ cargaHorariaFormatada }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [tempoDecorrido, setTempoDecorrido] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        let id;
        if (isRunning) {
            const id = setInterval(() => {
                setTempoDecorrido(prevTempo => {
                    const novoTempo = prevTempo + 1;
                    const [horas, minutos] = cargaHorariaFormatada.split('h e ').map(part => parseInt(part, 10));
                    const cargaTotalMinutos = horas * 60 + minutos;

                    // Verifica para pausas necessárias a cada 4 horas
                    if (novoTempo % 240 === 0) { // A cada 240 "minutos" (neste exemplo, segundos simulando minutos)
                        clearInterval(id);
                        setIsRunning(false);
                        Alert.alert('Pausa Necessária', 'Faça uma pausa de no mínimo 15 minutos.');
                    }
                    
                    // Verifica se o tempo decorrido atingiu a carga total de minutos
                    if (novoTempo >= cargaTotalMinutos) {
                        clearInterval(id); // Para o cronômetro
                        setIsRunning(false); // Atualiza o estado para pausar o cronômetro
                        // Exibe o alerta de carga horária completada
                        Alert.alert('Tempo Concluído', 'Você concluiu a carga horária planejada.');
                        return prevTempo; // Retorna o tempo atual sem incrementar, pois atingiu a carga total
                    }

                    return novoTempo; // Incrementa o tempo decorrido
                });
            }, 1); // 60000 ms = 1 minuto

            setIntervalId(id); // Salva o ID do intervalo para poder limpar depois

            return () => { clearInterval(id) }; // Limpa o intervalo ao desmontar o componente ou quando pausar
        }
    }, [isRunning, cargaHorariaFormatada]);


    const handlePlay = () => {
        if (!isRunning) {
            setIsRunning(true);
        }
    };


    const handlePause = () => {
            setIsRunning(false);
    };


    const handleStop = () => {
        setIsRunning(false);
        setTempoDecorrido(0);
    };


    // Formatação do tempo decorrido para exibição
    const horasDecorridas = Math.floor(tempoDecorrido / 60);
    const minutosDecorridos = tempoDecorrido % 60;
    const tempoDecorridoFormatado = `${horasDecorridas}h e ${minutosDecorridos}min`;

    return (
        <View>
            <Text>Tempo Decorrido: {tempoDecorridoFormatado}</Text>
            {!isRunning && <Button title="Play" onPress={handlePlay} />}
            {isRunning && <Button title="Pause" onPress={handlePause} />}
            <Button title="Stop" onPress={handleStop} />
        </View>
    );

};

export default Cronometro;
