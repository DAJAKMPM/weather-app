import Constants from "expo-constants";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useLoadAssets } from "@app/hooks";
import { RootNavigation } from "@app/navigation";
import { InitialState, NavigationContainer } from "@react-navigation/native";
import React, { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useMount from "src/hooks/useMount";
import * as SplashScreen from "expo-splash-screen";
import { internetCheck } from "@app/utils";

const fonts = {
  "SFProText-Bold": require("./assets/fonts/SF-Pro-Text-Bold.otf"),
  "SFProText-Semibold": require("./assets/fonts/SF-Pro-Text-Semibold.otf"),
  "SFProText-Regular": require("./assets/fonts/SF-Pro-Text-Regular.otf"),
};

const NAVIGATION_STATE_KEY = `NAVIGATION_STATE_KEY-${Constants.manifest?.sdkVersion}`;

export default function App() {
  const [isNavigationReady, setIsNavigationReady] = useState(!__DEV__);
  const [initialState, setInitialState] = useState<InitialState | undefined>();
  const ready = useLoadAssets([], fonts || {});

  const onInitialLoad = () => {
    internetCheck();

    (async () => {
      await SplashScreen.preventAutoHideAsync();
    })();
  };

  useMount(onInitialLoad);

  useEffect(() => {
    (async () => {
      if (ready) await SplashScreen.hideAsync();
    })();
  }, [isNavigationReady, ready]);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const savedStateString = await AsyncStorage.getItem(
          NAVIGATION_STATE_KEY
        );
        const state = savedStateString
          ? JSON.parse(savedStateString)
          : undefined;
        setInitialState(state);
      } finally {
        setIsNavigationReady(true);
      }
    };
    if (!isNavigationReady) {
      restoreState();
    }
  }, [isNavigationReady]);

  const onStateChange = useCallback(
    (state) =>
      AsyncStorage.setItem(NAVIGATION_STATE_KEY, JSON.stringify(state)),
    []
  );

  if (!ready || !isNavigationReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer {...{ onStateChange, initialState }}>
        <RootNavigation />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
