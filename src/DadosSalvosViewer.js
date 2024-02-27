// Em DadosSalvosViewer.js ou similar
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function DadosSalvosViewer({ dadosSalvos = {} }) {
  
  console.log('dadosSalvos recebido em DadosSalvosViewer:', dadosSalvos);
  const datasSalvamento = dadosSalvos ? Object.keys(dadosSalvos) : [];

  console.log('datasSalvamento de Object.keys:', datasSalvamento);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView >

        {datasSalvamento.length > 0 ? (
          datasSalvamento.map((data, index) => (
            <View key={data} style={styles.container}>
              <Text>Data: {data}</Text>
              {(dadosSalvos[data] || []).map((evento, idx) => (
                <Text key={idx}>
                  {evento.tipo} às {new Date(evento.momento).toLocaleString()}
                </Text>
              ))}
            </View>
          ))
        ) : (
          <View style={styles.container}>
            <Text>Nenhum dado salvo encontrado</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
});
export default DadosSalvosViewer;
