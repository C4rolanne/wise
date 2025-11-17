export default function TabsLayout() {
  return (
    // <Stack>
    //   <Stack.Screen name="index" options={{ headerShown: false }} />
    //   <Stack.Screen name="home" options={{ headerShown: false }} />
    //   <Stack.Screen name="login" options={{ title: "" }} />
    // </Stack>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#FFB74D",
          borderWidth: 0,
          position: "absolute",
          height: 80,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="game-controller" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
