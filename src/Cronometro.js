import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, AppState } from 'react-native';
import HistoricoEventos from './HistoricoEventos';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Button } from 'react-native-elements';
import * as Notifications from 'expo-notifications';
//import * as MediaLibrary from 'expo-media-library';
import { enviarNotificacaoParaTempoEspecifico } from './NotificationManager';



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
    const [cargaTotal, setCargaTotal] = useState(0);
    const tempoDecorridoFormatado = [
        { texto: ` ${horasDecorridas}h ${minutosDecorridos}min  `, style: { color: '#C2C7CC', fontSize: 50 } },
        { texto: `${segundosDecorridos}s`, style: { marginTop: 15, color: '#C2C7CC', fontSize: 15 } },
    ];

    async function registerForPushNotificationsAsync() {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
            alert('Oi! Você não aceitou as notificações.');
            return false;
        }
        return true;
    }

    useEffect(() => {
        registerForPushNotificationsAsync();

    }, []);

    async function recalcularTempoDecorrido() {
        try {
            const estadoSalvo = await AsyncStorage.getItem('estadoCronometro');
            if (estadoSalvo) {
                const { isRunning: estadoSalvoRunning, startTime } = JSON.parse(estadoSalvo);
                if (estadoSalvoRunning) {
                    const startTimeDate = new Date(startTime).getTime();
                    const now = new Date().getTime();
                    const diffInSeconds = Math.round((now - startTimeDate) / 1000);
                    setTempoDecorrido(diffInSeconds);

                    await Notifications.cancelAllScheduledNotificationsAsync();
                    const tempoRestantePara4Horas = 14400 - diffInSeconds;
                    const cargaHorariaMaxima = 35400 - diffInSeconds;
                    const cargTotaMinutosEnd = cargaTotal - diffInSeconds
                    if (tempoRestantePara4Horas > 0) {
                        enviarNotificacaoParaTempoEspecifico(tempoRestantePara4Horas);
                        console.log(tempoRestantePara4Horas)
                    }else if(isRunning && cargaHorariaMaxima > 0){
                        enviarNotificacaoParaTempoEspecifico(cargaHorariaMaxima);
                    }else if(isRunning && cargTotaMinutosEnd > 0) {
                        enviarNotificacaoParaTempoEspecifico(cargTotaMinutosEnd)
                    }
                }
            }
        } catch (error) {
            console.log("Erro ao ler o estado do cronômetro", error);
        }
    }
    

    useEffect(() => {
        const appStateListener = AppState.addEventListener("change", (nextAppState) => {
            if (nextAppState === "active" ) {
                console.log(nextAppState);
                if (isRunning) {
                    recalcularTempoDecorrido();
                }
            }
        });
        return () => {
            appStateListener.remove();
        };
    }, [tempoDecorrido]); 


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
                    //Verifica para pausas necessárias a cada 4 horas
                    if (novoTempo % 14400 === 0) { // A cada 240 === 14400 "minutos" (neste exemplo, segundos simulando minutos)
                        clearInterval(id);
                        setIsRunning(false);
                        playAudio().then(sound => {
                            Alert.alert('Intervalo Necessário', 'Faça um intervalo de no mínimo 15 minutos.', [
                                { text: "OK", onPress: () => sound.stopAsync() }
                            ]);
                        });
                    }
                    // Verifica se o tempo decorrido atingiu a carga total de 9h:50min
                    if (novoTempo === 35400) {
                        clearInterval(id); // Para o cronômetro
                        setIsRunning(false); // Atualiza o estado para pausar o cronômetro
                        playAudio().then(sound => {
                            Alert.alert('Aviso!!', 'Você concluiu a carga horária máxima permitida.', [
                                { text: "OK", onPress: () => sound.stopAsync() } // Para a reprodução ao tocar em OK
                            ]);
                        });
                    }
                    // Verifica se o tempo decorrido atingiu a carga total
                    if (novoTempo === (cargaTotalMinutos * 60)) {
                        clearInterval(id); // Para o cronômetro
                        setIsRunning(false);
                        setCargaTotal(novoTempo);
                        // App está ativo, tocar áudio
                        playAudio().then(sound => {
                            Alert.alert('Aviso!!!', 'Você concluiu a carga horária planejada.', [
                                { text: "OK", onPress: () => sound.stopAsync() } // Para a reprodução ao tocar em OK
                            ]);
                        });
                    }
                    return novoTempo; // Incrementa o tempo decorrido
                });
            }, 700); // 60000 ms = 1 minuto
            setIntervalId(id); // Salva o ID do intervalo para poder limpar depois
            return () => clearInterval(id); // Limpa o intervalo ao desmontar o componente ou quando pausar
        }
    }, [isRunning, cargaHorariaFormatada, appState]);

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


    const handlePlay = async () => {
        const startTime = new Date();
        setIsRunning(true);
        setTempoDecorrido(prevTempo => {
            const updatedState = { isRunning: true, startTime: startTime.toISOString(), tempoDecorrido: prevTempo };
            AsyncStorage.setItem('estadoCronometro', JSON.stringify(updatedState));
            return prevTempo;
        });
        if (!historicoStop) {
            setHistoricoEventos(historicoAtual => [...historicoAtual, { tipo: "Início", momento: new Date() }]);
        } else {
            console.log("Ação de Início bloqueada devido a uma Parada recente.");
        }
        
        await Notifications.cancelAllScheduledNotificationsAsync();
        
        
    };
    const handlePause = async () => {
        if (isRunning) {
            setIsRunning(false);
            clearInterval(intervalId);
            setIntervalId(null);
            setTempoDecorrido(prevTempo => {
                const updatedState = { isRunning: false, tempoDecorrido: prevTempo };
                AsyncStorage.setItem('estadoCronometro', JSON.stringify(updatedState));
                return prevTempo;
            });
            setHistoricoEventos(historicoAtual => [...historicoAtual, { tipo: "Intervalo", momento: new Date() }]);
            await Notifications.cancelAllScheduledNotificationsAsync();
        }
    };
    const handleStop = async () => {
        setIsRunning(false);
        await Notifications.cancelAllScheduledNotificationsAsync();
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
    };

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

                    title=" Iniciar"
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
        paddingBottom: 20,
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

