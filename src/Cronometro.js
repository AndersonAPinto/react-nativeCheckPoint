import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import HistoricoEventos from './HistoricoEventos';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';


function Cronometro({ cargaHorariaFormatada }) {
    const navigation = useNavigation();
    const [isRunning, setIsRunning] = useState(false);
    const [tempoDecorrido, setTempoDecorrido] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [historicoEventos, setHistoricoEventos] = useState([]);
    const [UltimoStop, setUltimoStop] = useState(false);
    const [historicoStop, setHistoricoStop] = useState(false);
    const [mensagemTempoRestante, setMensagemTempoRestante] = useState("");
    const [dadosSalvos, setDadosSalvos] = useState({});
    const horasDecorridas = Math.floor(tempoDecorrido / 3600);
    const minutosDecorridos = Math.floor((tempoDecorrido % 3600) / 60);
    const segundosDecorridos = tempoDecorrido % 60;
    const tempoDecorridoFormatado = `${horasDecorridas}h e ${minutosDecorridos}min ${segundosDecorridos}s`;

    async function playAudio() {
        const { sound } = await Audio.Sound.createAsync(
            require('../src/music/AlarmSlow.mp3'), // Substitua pela URL do seu áudio
            { shouldPlay: true }
        );
        await sound.playAsync();
        return sound;
    }

    useEffect(() => {
        if (isRunning) {
            const id = setInterval(() => {
                setTempoDecorrido(prevTempo => {
                    const novoTempo = prevTempo + 1;
                    const [horas, minutos] = cargaHorariaFormatada.split('h e ').map(part => parseInt(part, 10));
                    const cargaTotalMinutos = horas * 60 + minutos;

                    // Verifica para pausas necessárias a cada 4 horas
                    if (novoTempo % 14400 === 0) { // A cada 240 "minutos" (neste exemplo, segundos simulando minutos)
                        clearInterval(id);
                        setIsRunning(false);
                        playAudio().then(sound => {
                            Alert.alert('Pausa Necessária', 'Faça uma pausa de no mínimo 15 minutos.', [
                                { text: "OK", onPress: () => sound.stopAsync() } // Para a reprodução ao tocar em OK
                            ]);
                        });
                        //Alert.alert('Pausa Necessária', 'Faça uma pausa de no mínimo 15 minutos.');
                    }
                    // Verifica se o tempo decorrido atingiu a carga total de 9h:50min
                    if (novoTempo === 35400){
                        clearInterval(id); // Para o cronômetro
                        setIsRunning(false); // Atualiza o estado para pausar o cronômetro
                        // Exibe o alerta de carga horária completada
                        Alert.alert('Tempo Concluído', 'Você concluiu a carga horária máxima permitida.');
                        return prevTempo; // Retorna o tempo atual sem incrementar, pois atingiu a carga total
                    }
                    // Verifica se o tempo decorrido atingiu a carga total de minutos
                    if (novoTempo === cargaTotalMinutos * 60) {
                        clearInterval(id); // Para o cronômetro
                        setIsRunning(false); // Atualiza o estado para pausar o cronômetro
                        Alert.alert('Tempo Concluído', 'Você concluiu a carga horária planejada.');
                    }
                    return novoTempo; // Incrementa o tempo decorrido
                });
            }, 1); // 60000 ms = 1 minuto
            setIntervalId(id); // Salva o ID do intervalo para poder limpar depois
            return () => clearInterval(id); // Limpa o intervalo ao desmontar o componente ou quando pausar
        }
    }, [isRunning, cargaHorariaFormatada]);

    useEffect(() => {
        let intervalId;
        if (UltimoStop && !isRunning) {
            intervalId = setInterval(() => {
                const agora = new Date();
                const diferencaHora = agora.getTime() - new Date(UltimoStop).getTime();
                const tempoDePausa = 39600000; // 11 horas de Pausa

                if (diferencaHora < tempoDePausa){
                    const horasRestantes = Math.floor((tempoDePausa - diferencaHora) / 3600000);
                    const minutosRestantes = Math.floor(((tempoDePausa - diferencaHora) % 3600000) / 60000);
                    const segundosRestantes = Math.floor(((tempoDePausa - diferencaHora) % 60000) / 1000);

                    setMensagemTempoRestante(`Aguarde ${horasRestantes}h ${minutosRestantes}min ${segundosRestantes}s para reiniciar o cronômetro.`);
                } else {
                    setMensagemTempoRestante("");
                    clearInterval(intervalId);
                }
            },10000); //1000ms === 1 segundo ou 60000 === 1 minuto
        }

        return () => clearInterval(intervalId);
    }, [UltimoStop, isRunning]);

    const handlePlay = () => {
        if (!historicoStop) {
            setIsRunning(true);
            setHistoricoEventos(historicoAtual => [...historicoAtual, { tipo: "Play", momento: new Date() }]);
        } else {
            console.log("Ação de Play bloqueada devido a um Stop recente.");
        }
    };

    const handlePause = () => {
        if (isRunning) {
            setIsRunning(false);
            setHistoricoEventos(historicoAtual => [...historicoAtual, { tipo: "Pause", momento: new Date() }]);

        }

    };

    const handleStop = async () => {
        setIsRunning(false);
        setTempoDecorrido(0);
        setUltimoStop(new Date());
        setHistoricoStop(true);
        setHistoricoEventos(historicoAtual => [...historicoAtual, { tipo: "Stop", momento: new Date() }]);
        const eventoStop = { tipo: "Stop", momento: new Date().toLocaleDateString() };
        await salvarEvento(eventoStop);
        const dataSalvamento = new Date();
        const eventosSalvos = historicoEventos.filter(evento => evento.tipo === "Play" || evento.tipo === "Pause");
        try {
            const dadosAtuais = await AsyncStorage.getItem('dadosSalvos');
            const dadosAtualizados = dadosAtuais ? JSON.parse(dadosAtuais) : {};
            dadosAtualizados[dataSalvamento] = eventosSalvos;

            await AsyncStorage.setItem('dadosSalvos', JSON.stringify(dadosAtualizados));
            Alert.alert("Carga horária do dia salva");
            navigation.navigate('Teste');
        } catch (error) {
            console.log("Erro ao salvar dados", error);
        }
        setHistoricoEventos([]);
        setTimeout(() => {
            setHistoricoStop(false);
        }, 1000);
    };


    const salvarEvento = async (evento) => {
        try {
            const eventosExistentes = await AsyncStorage.getItem('eventosSalvos');
            const eventosAtualizados = eventosExistentes ? JSON.parse(eventosExistentes) : [];
            eventosAtualizados.push(evento);
            await AsyncStorage.setItem('eventosSalvos', JSON.stringify(eventosAtualizados));
        } catch (error) {
            console.log("Erro ao salvar evento", error);
        }
    };
    // Formatação do tempo decorrido para exibição
    return (
        <View>
            {mensagemTempoRestante ? (
                // Se existe uma mensagem de tempo restante, exibe ela
                <Text>{mensagemTempoRestante}</Text>
            ) : (
                // Caso contrário, exibe o tempo decorrido
                <Text>Tempo Decorrido: {tempoDecorridoFormatado}</Text>
            )}
            {!isRunning && <Button title="Play" 
                onPress={handlePlay}
                disabled = {!!mensagemTempoRestante} //Converte a string para booleano
                />}
            {isRunning && <Button title="Pause" onPress={handlePause} />}
            <Button title="Stop"
                disabled={historicoEventos.length === 0}
                onPress={() => {
                    handleStop();
                    console.log(JSON.stringify(dadosSalvos));
                }} />
            <HistoricoEventos historicoEventos={historicoEventos} />

        </View>

    );
};
export default Cronometro

