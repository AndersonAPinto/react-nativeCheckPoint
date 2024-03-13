import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, StatusBar } from 'react-native';
import CalculadoraDiasUteis from './CalculadoraDiasUteis';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vibration } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

function TemplateTeste() {


  const isFocused = useIsFocused();
  const [cargaHoraria, setCargaHoraria] = useState(0);
  //console.log('cargaHoraria antes de passar para CalculadoraDiasUteis:', cargaHoraria);
  const salvarCargaHoraria = async (valor) => {
    try {
      await AsyncStorage.setItem('@cargaHoraria', valor.toString());
    } catch (e) {
      console.error("Erro ao salvar a carga horária", e);// salvar erro
    }
  };

  useEffect(()=>{
    if (isFocused){
      Vibration.vibrate(2);
    }
  }, [isFocused]);

  useEffect(() => {
    const carregarCargaHoraria = async () => {
      try {
        const valor = await AsyncStorage.getItem('@cargaHoraria');
        if (valor !== null) {
          // O valor existe, atualiza o estado
          setCargaHoraria(parseInt(valor));
        }
      } catch (e) {
        // erro ao ler o valor
        console.error("Erro ao carregar a carga horária", e);
      }
    };
    carregarCargaHoraria();
  }, []);

  return (
    <>
    <StatusBar barStyle="light-content" />
    <SafeAreaView style={{ flex: 1, backgroundColor:'#0D101B' }}>
      <View style={styles.container__principal}>
        
        <View style={styles.viewSettings}>
          <View style={styles.containerView}>
            <Text style={styles.textCarga}>CARGA HORARIA TOTAL: </Text>
            <TextInput
              style={styles.input}
              //underlineColorAndroid="transparent"
              selectionColor="transparent"
              value={cargaHoraria.toString()}
              placeholder=' '
              onChangeText={text => {
                const valorNumerico = parseInt(text) || 0;
                setCargaHoraria(valorNumerico);
                salvarCargaHoraria(valorNumerico); // Salva no AsyncStorage
              }}
              keyboardType="numeric"
            />

          </View>
        </View>
        <CalculadoraDiasUteis cargaHoraria={cargaHoraria} />
      </View>
    </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container__principal: {
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: '#0C2134',
  },
  viewSettings: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: 'auto',
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#383c4c',
    
  },
  containerView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },
  linha: {
    borderBottomColor: '#C2C1CC',
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  input: {
    color: '#99a700',
    marginLeft: 10,
  },
  textCarga: {
    color: '#C2C1CC',
    
  },
});

export default TemplateTeste
