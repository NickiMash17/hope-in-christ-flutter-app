import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AudioProvider, useAudioPlayer } from "@/contexts/AudioContext";
import { MiniPlayer } from "@/components/MiniPlayer";
import { queryClient } from "@/lib/query-client";
import { useFonts } from "expo-font";
import { fonts } from "@/lib/fonts";
import { StatusBar } from "expo-status-bar";
import { SplashScreen as CustomSplashScreen } from "@/components/SplashScreen";

SplashScreen.preventAutoHideAsync();

function FloatingMiniPlayer() {
  const { currentTrack, isPlaying, play, pause, stop } = useAudioPlayer();
  if (!currentTrack) return null;
  return (
    <MiniPlayer
      title={currentTrack.title}
      speaker={currentTrack.speaker}
      isPlaying={isPlaying}
      onPlayPause={() => {
        if (isPlaying) {
          pause();
        } else {
          if (Platform.OS !== "web") Linking.openURL(currentTrack.url);
          play(currentTrack);
        }
      }}
      onClose={stop}
    />
  );
}

function RootLayoutNav() {
  return (
    <View style={styles.root}>
      <Stack screenOptions={{ headerBackTitle: "Back" }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="sermon/[id]"        options={{ headerShown: false }} />
        <Stack.Screen name="event/[id]"         options={{ headerShown: false }} />
        <Stack.Screen name="register/[id]"      options={{ headerShown: false }} />
        <Stack.Screen name="chat/[channel]"     options={{ headerShown: false }} />
        <Stack.Screen name="about"              options={{ headerShown: false }} />
        <Stack.Screen name="schedule"           options={{ headerShown: false }} />
        <Stack.Screen name="eft-details"        options={{ headerShown: false }} />
        <Stack.Screen name="donation-success"   options={{ headerShown: false }} />
        <Stack.Screen name="ministry-connect"   options={{ headerShown: false }} />
        <Stack.Screen name="live-stream"        options={{ headerShown: false }} />
      </Stack>
      <FloatingMiniPlayer />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fonts);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AudioProvider>
            <GestureHandlerRootView style={styles.fill}>
              <KeyboardProvider>
                <StatusBar style="auto" />
                {!fontsLoaded && !fontError ? null : showSplash ? (
                  <CustomSplashScreen onFinish={() => setShowSplash(false)} />
                ) : (
                  <RootLayoutNav />
                )}
              </KeyboardProvider>
            </GestureHandlerRootView>
          </AudioProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  root: { flex: 1 },
});
