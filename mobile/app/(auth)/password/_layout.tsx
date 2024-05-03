import { Stack, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#A5DEE8",
        },
      }}
    >
      <Stack.Screen
        name="forgot"
        options={{
          title: "",
          headerRight: Cancel,
        }}
      />
      <Stack.Screen
        name="reset"
        options={{
          title: "Reset Password",
          headerLeft: GoBack,
        }}
      />
    </Stack>
  );
}

function Cancel() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.push("/login")}>
      <AntDesign name="close" size={24} />
    </TouchableOpacity>
  );
}

function GoBack() {
  const router = useRouter();
  return (
    <TouchableOpacity onPress={() => router.back()}>
      <AntDesign name="arrowleft" size={24} />
    </TouchableOpacity>
  );
}
