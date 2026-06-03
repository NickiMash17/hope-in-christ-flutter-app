import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { NativeTabs, Icon, Label } from "expo-router/unstable-native-tabs";
import { AnimatedTabBar } from "@/components/AnimatedTabBar";

function NativeTabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="sermons">
        <Icon sf={{ default: "book", selected: "book.fill" }} />
        <Label>Sermons</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="give">
        <Icon sf={{ default: "heart", selected: "heart.fill" }} />
        <Label>Give</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="events">
        <Icon sf={{ default: "calendar", selected: "calendar" }} />
        <Label>Events</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="community">
        <Icon sf={{ default: "bubble.left.and.bubble.right", selected: "bubble.left.and.bubble.right.fill" }} />
        <Label>Community</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <AnimatedTabBar {...props} />}
    >
      <Tabs.Screen name="index"     options={{ title: "Home"      }} />
      <Tabs.Screen name="sermons"   options={{ title: "Sermons"   }} />
      <Tabs.Screen name="give"      options={{ title: "Give"      }} />
      <Tabs.Screen name="events"    options={{ title: "Events"    }} />
      <Tabs.Screen name="community" options={{ title: "Community" }} />
      <Tabs.Screen name="settings"  options={{ title: "Settings"  }} />
      {/* Keep about accessible as a route but hide from the tab bar */}
      <Tabs.Screen name="about"     options={{ href: null         }} />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
