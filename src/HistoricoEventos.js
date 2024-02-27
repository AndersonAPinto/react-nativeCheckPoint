import React from 'react';
import { View, Text } from 'react-native';


const HistoricoEventos = ({ historicoEventos }) => {
  console.log('historico de eventos',historicoEventos);
  return (
      <View>
        {historicoEventos.map((evento, index) => (
          <Text key={index}>{evento.tipo}: {evento.momento.toLocaleString()}</Text>
        ))}
        <Text>Historico Eventos</Text>
      </View>
  );
};


export default HistoricoEventos;
