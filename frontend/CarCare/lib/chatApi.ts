import { Platform } from 'react-native';

const DEV_CHAT_BASE =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080';

/** Base URL for `VinChatBotServer` (no trailing slash). Override on a physical device with your Mac’s LAN IP. */
export function chatBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_CHAT_API_URL;
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, '');
  }
  return DEV_CHAT_BASE;
}
