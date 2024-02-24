import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';

const Cronometro = ({ cargaHorariaFormatada }) => {
    const [isRunning, setIsRunning] = useState(false);
    const [tempoDecorrido, setTempoDecorrido] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [ultimoStop, setUltimoStop] = useState(null);
    const [ultimoPlay, setUltimoPlay] = useState(null);
    const [mensagemTempoRestante, setMensagemTempoRestante] = useState("");


    useEffect(() => {
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
                    // Verifica se o tempo decorrido atingiu a carga total de 9h:50min
                    if (novoTempo === 590) {
                        clearInterval(id); // Para o cronômetro
                        setIsRunning(false); // Atualiza o estado para pausar o cronômetro
                        // Exibe o alerta de carga horária completada
                        Alert.alert('Tempo Concluído', 'Você concluiu a carga horária máxima permitida.');
                        return prevTempo; // Retorna o tempo atual sem incrementar, pois atingiu a carga total
                    }
                    // Verifica se o tempo decorrido atingiu a carga total de minutos
                    if (novoTempo === cargaTotalMinutos) {
                        clearInterval(id); // Para o cronômetro
                        setIsRunning(false); // Atualiza o estado para pausar o cronômetro
                        Alert.alert('Tempo Concluído', 'Você concluiu a carga horária planejada.');
                    }
                    return novoTempo; // Incrementa o tempo decorrido
                });
            }, 60000); // 60000 ms = 1 minuto
            setIntervalId(id); // Salva o ID do intervalo para poder limpar depois
            return () => clearInterval(id); // Limpa o intervalo ao desmontar o componente ou quando pausar
        }
    }, [isRunning, cargaHorariaFormatada]);

    useEffect(() => {
        let intervalId;
        if (ultimoStop && !isRunning) {
            intervalId = setInterval(() => {
                const agora = new Date();
                const diferencaHora = agora.getTime() - new Date(ultimoStop).getTime();

                if (diferencaHora < 39600000) {
                    const horasRestantes = Math.floor((39600000 - diferencaHora) / 3600000);
                    const minutosRestantes = Math.floor(((39600000 - diferencaHora) % 3600000) / 60000);

                    setMensagemTempoRestante(`Aguarde ${horasRestantes}h e ${minutosRestantes}min para reiniciar o cronômetro.`);
                } else {
                    setMensagemTempoRestante("");
                    clearInterval(intervalId);
                }
            }, 1000); //1000ms === 1 segundo ou 60000 === 1 minuto
        }

        return () => clearInterval(intervalId);
    }, [ultimoStop, isRunning]);

    const handlePlay = () => {
        if (ultimoStop) {
            const agora = new Date();
            const diferencaHora = agora.getTime() - new Date(ultimoStop).getTime();

            if (diferencaHora < 39600000) {
                // Se ainda não passou o tempo mínimo desde o último "Stop", não faz nada
                return;
            }
        }
        setIsRunning(true);
        setUltimoPlay(new Date());
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleStop = () => {
        setIsRunning(false);
        setTempoDecorrido(0);
        setUltimoStop(new Date());
    };

    // Formatação do tempo decorrido para exibição
    const horasDecorridas = Math.floor(tempoDecorrido / 60);
    const minutosDecorridos = tempoDecorrido % 60;
    const tempoDecorridoFormatado = `${horasDecorridas}h e ${minutosDecorridos}min`;

    return (
        <View>
            {mensagemTempoRestante ? (
                // Se existe uma mensagem de tempo restante, exibe ela
                <Text>{mensagemTempoRestante}</Text>
            ) : (
                // Caso contrário, exibe o tempo decorrido
                <Text>Tempo Decorrido: {tempoDecorridoFormatado}</Text>
            )}
            {!isRunning && <Button title="Play" onPress={handlePlay} />}
            {isRunning && <Button title="Pause" onPress={handlePause} />}
            <Button title="Stop" onPress={handleStop} />
            {ultimoPlay && (
                <Text>Último Play: {ultimoPlay.toLocaleString()}</Text>)}
            {ultimoStop && (
                <Text>Último Stop: {ultimoStop.toLocaleString()}</Text>)}
        </View>
    );

};

export default Cronometro;
