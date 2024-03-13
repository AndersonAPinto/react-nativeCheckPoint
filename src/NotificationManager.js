import * as Notifications from 'expo-notifications';

export async function enviarNotificacao() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Intervalo Necessário!",
      body: 'Acesse o App para mais informações',
      data: { data: novoTempo },
    },
    trigger: { seconds: 1 },
  });
}
