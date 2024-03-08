import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, AppState } from 'react-native';
import HistoricoEventos from './HistoricoEventos';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import * as Notifications from 'expo-notifications';

function Cronometro({ cargaHorariaFormatada }) {
    //console.log(cargaHorariaFormatada)
    const navigation = useNavigation();
    const [isRunning, setIsRunning] = useState(false);
    const [tempoDecorrido, setTempoDecorrido] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [historicoEventos, setHistoricoEventos] = useState([]);
    const [UltimoStop, setUltimoStop] = useState(false);
    const [historicoStop, setHistoricoStop] = useState(false);
    const [mensagemTempoRestante, setMensagemTempoRestante] = useState("");
    const [appState, setAppState] = useState(AppState.currentState);

    const horasDecorridas = Math.floor(tempoDecorrido / 3600);
    const minutosDecorridos = Math.floor((tempoDecorrido % 3600) / 60);
    const segundosDecorridos = tempoDecorrido % 60;
    const tempoDecorridoFormatado = [
        { texto: ` ${horasDecorridas}h ${minutosDecorridos}min  `, style: { color: '#C2C7CC', fontSize: 50 } },
        { texto: `${segundosDecorridos}s`, style: { color: '#C2C7CC', fontSize: 15 } },
    ];


    useEffect(() => {
        const subscription = AppState.addEventListener("change", nextAppState => {
            if (appState.match(/inactive|background/) && nextAppState === "active") {
                console.log("App has come to the foreground!");
                recalcularTempoDecorrido();
            }
            setAppState(nextAppState);
        });

        return () => {
            subscription.remove();
        };
    }, [appState]);

    const recalcularTempoDecorrido = async () => {
        const estadoSalvo = await AsyncStorage.getItem('estadoCronometro');
        if (estadoSalvo) {
            const { isRunning, startTime } = JSON.parse(estadoSalvo);
            if (isRunning) {
                const startTimeDate = new Date(startTime).getTime();
                const now = new Date().getTime();
                const diffInSeconds = Math.round((now - startTimeDate) / 1000);
                setTempoDecorrido(diffInSeconds);
                // Se o cronômetro deveria estar rodando, recomece-o aqui se necessário
                // Por exemplo, se você pausa o cronômetro automaticamente quando o app vai para o background
                if (!intervalId) {
                    iniciarCronometro();
                }
            }
        }
    };

    async function atualizarNotificacaoTempoDecorrido(tempoDecorridoFormatado) {
        // Primeiro, cancela todas as notificações anteriores para evitar duplicatas
        await Notifications.cancelAllScheduledNotificationsAsync();
        // Agendar uma nova notificação com o tempo decorrido atualizado
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Cronômetro Rodando",
                body: `Tempo decorrido: ${tempoDecorridoFormatado}`, // Atualize isso conforme necessário
            },
            trigger: null, // Imediatamente
        });
    }
    useEffect(() => {
        Notifications.requestPermissionsAsync();
    }, []);


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
                    const [horas, minutos] = cargaHorariaFormatada.replace(' minutos', '').split('horas e ').map(part => parseInt(part, 10));
                    const cargaTotalMinutos = (horas * 60) + minutos;
                    //console.log(cargaTotalMinutos)
                    //console.log(novoTempo)
                    // Verifica para pausas necessárias a cada 4 horas
                    if (novoTempo % 14400 === 0) { // A cada 240 "minutos" (neste exemplo, segundos simulando minutos)
                        clearInterval(id);
                        setIsRunning(false);
                        playAudio().then(sound => {
                            Alert.alert('Intervalo Necessário', 'Faça um intervalo de no mínimo 15 minutos.', [
                                { text: "OK", onPress: () => sound.stopAsync() } // Para a reprodução ao tocar em OK
                            ]);
                        });
                        //Alert.alert('Pausa Necessária', 'Faça uma pausa de no mínimo 15 minutos.');
                    }
                    // Verifica se o tempo decorrido atingiu a carga total de 9h:50min
                    if (novoTempo === 35400) {
                        clearInterval(id); // Para o cronômetro
                        setIsRunning(false); // Atualiza o estado para pausar o cronômetro
                        playAudio().then(sound => {
                            Alert.alert('Tempo Concluído', 'Você concluiu a carga horária máxima permitida.', [
                                { text: "OK", onPress: () => sound.stopAsync() } // Para a reprodução ao tocar em OK
                            ]);
                        });
                        //Alert.alert('Tempo Concluído', 'Você concluiu a carga horária máxima permitida.');
                        return prevTempo; // Retorna o tempo atual sem incrementar, pois atingiu a carga total
                    }
                    // Verifica se o tempo decorrido atingiu a carga total
                    if (novoTempo === (cargaTotalMinutos * 60)) {
                        clearInterval(id); // Para o cronômetro
                        setIsRunning(false); // Atualiza o estado para pausar o cronômetro
                        playAudio().then(sound => {
                            Alert.alert('Tempo Concluído', 'Você concluiu a carga horária planejada.', [
                                { text: "OK", onPress: () => sound.stopAsync() } // Para a reprodução ao tocar em OK
                            ]);
                        });
                        if (novoTempo % 300 === 0) { // 300 segundos = 5 minutos
                            const tempoDecorridoFormatado = `${Math.floor(novoTempo / 3600)}h ${Math.floor((novoTempo % 3600) / 60)}min ${novoTempo % 60}s`;
                            atualizarNotificacaoTempoDecorrido(tempoDecorridoFormatado);
                        }
                    }
                    return novoTempo; // Incrementa o tempo decorrido
                });
            }, 1000); // 60000 ms = 1 minuto
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

                if (diferencaHora < tempoDePausa) {
                    const horasRestantes = Math.floor((tempoDePausa - diferencaHora) / 3600000);
                    const minutosRestantes = Math.floor(((tempoDePausa - diferencaHora) % 3600000) / 60000);
                    const segundosRestantes = Math.floor(((tempoDePausa - diferencaHora) % 60000) / 1000);

                    //setMensagemTempoRestante(`... Aguarde ... ${horasRestantes}h ${minutosRestantes}min ${segundosRestantes}s para reiniciar o cronômetro`);
                    setMensagemTempoRestante([
                        { texto: "!!! Aguarde !!!", style: { color: 'tomato', fontSize: 30 } },
                        { texto: `${horasRestantes}h : ${minutosRestantes}min ${segundosRestantes}s`, style: { color: 'white', fontSize: 35 } },
                        { texto: "para o iniciar novo Registro Ponto", style: { color: '#C2C1CC' } },
                    ]);
                } else {
                    setMensagemTempoRestante("");
                    clearInterval(intervalId);
                }
            }, 1000); //1000ms === 1 segundo ou 60000 === 1 minuto
        }
        return () => clearInterval(intervalId);
    }, [UltimoStop, isRunning]);


    useEffect(() => {
        const recuperarDados = async () => {
            const estadoSalvo = await AsyncStorage.getItem('estadoCronometro');
            if (estadoSalvo) {
                const { isRunning, startTime } = JSON.parse(estadoSalvo);
                if (isRunning) {
                    const startTimeDate = new Date(startTime);
                    const now = new Date();
                    const diffInSeconds = Math.round((now - startTimeDate) / 1000);
                    setTempoDecorrido(diffInSeconds);
                    setIsRunning(true);
                    // Continue a contagem a partir daqui
                }
            }
        };
        recuperarDados();
    }, []);

    const handlePlay = async () => {
        const startTime = new Date();
        setIsRunning(true);
        await AsyncStorage.setItem('estadoCronometro', JSON.stringify({ isRunning: true, startTime }));

        if (!historicoStop) {
            setIsRunning(true);
            setHistoricoEventos(historicoAtual => [...historicoAtual, { tipo: "Início", momento: new Date() }]);
        } else {
            console.log("Ação de Início bloqueada devido a uma Parada recente.");
        }
        const tempoDecorridoFormatado = `${horasDecorridas}h ${minutosDecorridos}min ${segundosDecorridos}s`;
        atualizarNotificacaoTempoDecorrido(tempoDecorridoFormatado);
    };

    const handlePause = () => {
        if (isRunning) {
            setIsRunning(false);
            setHistoricoEventos(historicoAtual => [...historicoAtual, { tipo: "Intervalo", momento: new Date() }]);
        }
        const tempoDecorridoFormatado = `${horasDecorridas}h ${minutosDecorridos}min ${segundosDecorridos}s`;
        atualizarNotificacaoTempoDecorrido(tempoDecorridoFormatado);
    };

    const handleStop = async () => {
        setIsRunning(false);
        await AsyncStorage.setItem('estadoCronometro', JSON.stringify({ isRunning: false }));

        const eventoStop = new Date();
        setHistoricoEventos(historicoAtual => [...historicoAtual, { tipo: " Término", momento: eventoStop }]);
        await new Promise(resolve => setTimeout(resolve, 100));
        const eventosSalvos = [...historicoEventos, { tipo: "-Término", momento: eventoStop }];
        const dataSalvamento = new Date().toLocaleString('pt-BR');
        //console.log(eventosSalvos)
        try {
            const dadosAtuais = await AsyncStorage.getItem('dadosSalvos');
            const dadosAtualizados = dadosAtuais ? JSON.parse(dadosAtuais) : {};
            dadosAtualizados[dataSalvamento] = eventosSalvos;

            await AsyncStorage.setItem('dadosSalvos', JSON.stringify(dadosAtualizados));
            Alert.alert("Trabalho Finalizado", "Carga horária do dia salva");
            //
            navigation.navigate('Extratos');

        } catch (error) {
            console.log("Erro ao salvar dados", error);
        }
        setIsRunning(false);
        setTempoDecorrido(0);
        setUltimoStop(eventoStop);
        setHistoricoStop(true)

        setTimeout(() => {
            setHistoricoEventos([]);
            setHistoricoStop(false);
        }, 1000);
        atualizarNotificacaoTempoDecorrido(tempoDecorridoFormatado);
    };

    {/*const salvarEvento = async (evento) => {
        try {
            const eventosExistentes = await AsyncStorage.getItem('eventosSalvos');
            const eventosAtualizados = eventosExistentes ? JSON.parse(eventosExistentes) : [];
            eventosAtualizados.push(evento);
            await AsyncStorage.setItem('eventosSalvos', JSON.stringify(eventosAtualizados));
        } catch (error) {
            console.log("Erro ao salvar evento", error);
        }
    };*/}
    // Formatação do tempo decorrido para exibição
    return (
        <View style={styles.telaInformacoes}>
            {mensagemTempoRestante && mensagemTempoRestante.length > 0 ? (
                <View style={styles.segmentoContainer}>
                    {mensagemTempoRestante.map((segmento, index) => (
                        <Text key={index} style={segmento.style}>
                            {segmento.texto}
                        </Text>
                    ))}
                </View>
            ) : (
                // Caso contrário, exibe o tempo decorrido
                <View style={styles.horaFormatada}>
                    {tempoDecorridoFormatado.map((segmento, index) => (
                        <Text key={index} style={segmento.style}>
                            {segmento.texto}
                        </Text>
                    ))}
                </View>
            )}
            <View style={styles.btnInicioEIntervalo}>
                {!isRunning && <Button
                    icon={
                        <Icon
                            name="play"
                            size={25}
                            color="green"
                        />
                    }

                    title=" Iníciar"
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    onPress={handlePlay}
                    disabled={!!mensagemTempoRestante} //Converte a string para booleano
                />}
                {isRunning && <Button
                    icon={
                        <Icon
                            name="pause"
                            size={25}
                            color="yellow"
                        />
                    }
                    title=" Intervalo"
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    onPress={handlePause} />}
                <Button
                    icon={
                        <Icon
                            name="flag-checkered"
                            size={25}
                            color="red"
                        />
                    }
                    title=" Finalizar"
                    buttonStyle={{ backgroundColor: 'transparent' }}
                    disabled={historicoEventos.length === 0}
                    onPress={() => {
                        handleStop();
                        //console.log(JSON.stringify(dadosSalvos));
                    }} />
            </View>
            <HistoricoEventos historicoEventos={historicoEventos} />
        </View>
    );
};

const styles = StyleSheet.create({
    telaInformacoes: {
        width: 'auto',
        height: 'auto',
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
        borderRadius: 10,
        backgroundColor: '#383c4c',
        flexDirection: 'column',
        alignItems: 'center',
        paddingVertical: 30,
    },
    segmentoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    msgTempoRestante: {
        fontSize: 40,
        color: '#C2C7CC',
        margin: 20,

        paddingLeft: 1,
        paddingRight: 1,
    },
    btnInicioEIntervalo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: 300,
        marginTop: 10,
        marginBottom: 10,
    },
    horaFormatada: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
});

export default Cronometro

