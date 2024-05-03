import { Slot } from "expo-router";
import { AuthProvider, GluestackProvider } from "@/components/providers";

export default function RootLayout() {
  return (
    <AuthProvider>
      <GluestackProvider>
        <Slot />
      </GluestackProvider>
    </AuthProvider>
  );
}
