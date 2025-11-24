import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "grey",
        tabBarStyle: {
          backgroundColor: "#FFB74D",
          borderTopWidth: 0,
          position: "absolute",
          elevation: 0,
          height: 80,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ChatScreen"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="chatbubble-sharp" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
