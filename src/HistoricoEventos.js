import React from 'react';
import { View, Text } from 'react-native';

const HistoricoEventos = ({ historicoEventos, historicoPlay, historicoPause, historicoStop }) => {
    return (
        <View>
            {/*{historicoPlay.map((play, index) => (
        <Text key={`play-${index}`}>Play {index + 1}: {play.toLocaleString()}</Text>
      ))}
      {historicoPause.map((pause, index) => (
        <Text key={`pause-${index}`}>Pause {index + 1}: {pause.toLocaleString()}</Text>
      ))}
      {historicoStop.map((stop, index) => (
        <Text key={`stop-${index}`}>Stop {index + 1}: {stop.toLocaleString()}</Text>
      ))}*/}
            {historicoEventos.map((evento, index) => (
                <Text key={index}>{evento.tipo}: {evento.momento.toLocaleString()}</Text>
            ))}
        </View>
    );
};

export default HistoricoEventos;
