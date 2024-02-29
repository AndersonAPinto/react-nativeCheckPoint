import React, { useState, useEffect } from 'react'
import { View, TextInput, StyleSheet } from 'react-native';
import CalculadoraDiasUteis from './CalculadoraDiasUteis'
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';


function TemplateTeste() {

    const [cargaHoraria, setCargaHoraria] = useState(0);
    //console.log('cargaHoraria antes de passar para CalculadoraDiasUteis:', cargaHoraria);
    const salvarCargaHoraria = async (valor) => {
        try {
          await AsyncStorage.setItem('@cargaHoraria', valor.toString());
        } catch (e) {
          console.error("Erro ao salvar a carga horária", e);// salvar erro
        }
      };

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
        <SafeAreaView style={styles.container}>
            <View>
                <TextInput
                    style={styles.input}
                    //underlineColorAndroid="transparent"
                    selectionColor="transparent"
                    placeholder="Digite a carga horária total"
                    value={cargaHoraria.toString()}
                    onChangeText={text => {
                        const valorNumerico = parseInt(text) || 0;
                        setCargaHoraria(valorNumerico);
                        salvarCargaHoraria(valorNumerico); // Salva no AsyncStorage
                      }}
                    keyboardType="numeric"
                />
                <CalculadoraDiasUteis cargaHoraria={cargaHoraria} />
            </View>
        </SafeAreaView>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        marginBottom: 20,
    },
    textCargaH: {
        marginBottom: 10,
    },
});

export default TemplateTeste
