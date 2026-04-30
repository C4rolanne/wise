import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const { isAuthenticated, loading, error, signInWithGoogle } = useAuth();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/(tabs)/home");
    }
  }, [isAuthenticated, loading]);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.appName}>FoodWise</Text>

      {loading ? <ActivityIndicator color="black" /> : null}

      {!loading && !isAuthenticated ? (
        <TouchableOpacity style={styles.loginButton} onPress={signInWithGoogle}>
          <Text style={styles.loginButtonText}>Entrar com Google</Text>
        </TouchableOpacity>
      ) : null}

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFB74D",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 3,
    resizeMode: "contain",
  },
  appName: {
    color: "black",
    fontSize: 55,
    fontWeight: "bold",
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: "black",
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  loginButtonText: {
    color: "white",
    fontWeight: "800",
    fontSize: 16,
  },
  errorText: {
    color: "#7f1d1d",
    textAlign: "center",
    marginTop: 16,
  },
});
