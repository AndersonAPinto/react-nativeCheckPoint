import React from 'react';
import { View, Text, StyleSheet} from 'react-native';


const HistoricoEventos = ({ historicoEventos }) => {
  return (
    <View>
      <Text style={styles.textRegistro}>Registros do dia...</Text>
      <View style={styles.viewHistoricaEventos}>
        {historicoEventos.map((evento, index) => (
          <Text style={styles.textHE} key={index}>{evento.tipo}: {evento.momento.toLocaleString('pt-BR')}</Text>
        ))}

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewHistoricaEventos: {
    backgroundColor: '#C2C1CC',
    padding:10,
    borderRadius: 5,
    width: 250,

  },
  textRegistro:{
    color: '#C2c2cc',
    marginTop: 10,
    marginBottom: 10,
  },
  textHE: {
    color: 'black',
  }
 
});

export default HistoricoEventos;
