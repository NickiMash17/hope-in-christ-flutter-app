import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function isNotificationsEnabled(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const { status } = await Notifications.getPermissionsAsync();
  return status === "granted";
}

const SERVICE_REMINDERS = [
  { id: "sunday", weekday: 1, hour: 8, minute: 30, title: "Sunday Service Today 🙏", body: "Main service starts at 10:00 AM. Join us for worship, prayer & the Word!" },
  { id: "wednesday", weekday: 4, hour: 17, minute: 0, title: "Bible Study Tonight 📖", body: "Wednesday Bible study at 18:30. Come ready to dig into the Word!" },
  { id: "friday", weekday: 6, hour: 17, minute: 0, title: "Youth Service Tonight 🔥", body: "Friday youth service at 18:30. Bring a friend!" },
];

export async function scheduleServiceReminders(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  for (const s of SERVICE_REMINDERS) {
    await Notifications.scheduleNotificationAsync({
      identifier: `service-${s.id}`,
      content: { title: s.title, body: s.body, sound: true },
      trigger: { weekday: s.weekday, hour: s.hour, minute: s.minute, repeats: true } as any,
    });
  }
}

export async function cancelServiceReminders(): Promise<void> {
  for (const s of SERVICE_REMINDERS) {
    await Notifications.cancelScheduledNotificationAsync(`service-${s.id}`);
  }
}
