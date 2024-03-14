import * as Notifications from 'expo-notifications';

export async function enviarNotificacaoParaTempoEspecifico(segundosRestantes) {
  // Cancela todas as notificações agendadas anteriores para evitar duplicatas
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Agendar uma nova notificação com base em 'segundosRestantes'
  await Notifications.scheduleNotificationAsync({
      content: {
          title: "Intervalo Necessário!",
          body: 'Acesse o App para mais informações.',
      },
      trigger: { seconds: segundosRestantes },
  });
}
