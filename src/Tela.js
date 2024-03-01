import { Verified } from '@mui/icons-material';
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
const Tela = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container__principal}>
        <Text style={styles.textPrincipal}>App Check Point</Text>
        <View style={styles.telaInformacoes}>
          <Text style={styles.text_telaInformacoes}>29/02/2024</Text>
          <Text style={styles.number_telaInformacoes}> 09:02<Text style={styles.number_telaInformacoesSeg}>02</Text> </Text>
          <Text style={styles.text_inicio}>
            <Icon name="work-history" size={20} color="green" /> Início
          </Text>
        </View>
        <View style={styles.icons}>
          <TouchableOpacity style={styles.icon}>
            <Icon name="work-history" size={50} color="green" marginTop={10} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Icon name="hourglass-top" size={50} color="yellow" marginTop={10} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <Icon name="sports-score" size={50} color="white" marginTop={10} />
          </TouchableOpacity>
        </View>
        <Text style={styles.textRegistros}>Registros do dia ...</Text>
        <View style = {styles.viewRegistros}>
            <Text> 29 / 02 /2024</Text>
            <Text> 08:00  12:00  13:30  18:18</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container__principal: {
    flex: 1,
    padding: 0,
    margin: 0,
    backgroundColor: '#0C2134'
  },
  textPrincipal:{
    textAlign:'center',
    color: '#C2C7CC',
    margin: 5,
    fontSize: 20,
  },
  telaInformacoes: {
    width: 'auto',
    height: 300,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 15,
    borderRadius: 30,
    backgroundColor: '#383c4c',
  },
  text_telaInformacoes: {
    color: '#C2C7CC',
    margin: 25,
    fontSize: 15,
  },
  number_telaInformacoes: {
    flex: 1,
    color: '#C2C7CC',
    textAlign: 'center',
    fontSize: 100,
  },
  number_telaInformacoesSeg:{
    fontSize: 30
  },
  text_inicio: {
    color: '#C2C7CC',
    textAlign: 'center',
    fontSize: 25,
    marginBottom: 20,
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, 
    padding: 0,
    marginLeft: 15,
    marginRight: 15,
  },
  icon: {
    borderRadius: 100,
    backgroundColor: '#383c4c',
    height: 70,
    width: 70,
    alignItems: 'center',
  },
  textRegistros:{
    color: '#C2C7CC',
    marginLeft: 17,
    marginBottom: 10,
  },
  viewRegistros:{
    marginLeft: 15,
    marginRight: 15,
    backgroundColor: '#A1A2A7',
    borderRadius: 10,
    padding: 10,

  }
})

export default Tela;
