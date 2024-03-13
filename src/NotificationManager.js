import * as Notifications from 'expo-notifications';

export async function enviarNotificacao() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Intervalo Necessário!",
      body: 'Acesse o App para mais informações',
      data: { data: new Date().toLocaleString('pt-BR') },
    },
    trigger: { seconds: 1 },
  });
}
