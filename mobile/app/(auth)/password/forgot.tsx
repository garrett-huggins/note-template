import {
  Box,
  Text,
  Input,
  InputField,
  VStack,
  useToast,
  Toast,
  View,
} from "@gluestack-ui/themed";
import { FormControl } from "@/components/forms/Controller";
import Button from "@/components/ui/button";
import { useRouter } from "expo-router";
import { authApi } from "@/api";
import { useState } from "react";
import KeyboardDismiss from "@/components/forms/KeyboardDismiss";

interface ToastProps {
  action: "error" | "warning" | "success" | "info" | "attention";
  title: string;
  text: string;
}

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const toast = useToast();

  const ShowToast = ({ action, title, text }: ToastProps) => {
    toast.show({
      placement: "bottom",
      render: ({ id }) => {
        return (
          <Toast nativeID={id} action={action}>
            <VStack gap="$2">
              <Toast.Title>{title}</Toast.Title>
              <Toast.Description>{text}</Toast.Description>
            </VStack>
          </Toast>
        );
      },
    });
  };

  const handleChange = (value: string) => {
    if (error) {
      setError(false);
    }
    setEmail(value);
  };

  const onSubmit = async () => {
    if (!email) {
      setError(true);
      return;
    }

    try {
      await authApi.authControllerForgotPassword({
        email,
      });
      router.push("/password/reset");
      ShowToast({
        action: "success",
        title: "Success!",
        text: "We have sent you an email with your password reset token.",
      });
    } catch (error) {
      ShowToast({
        action: "error",
        title: "Error!",
        text: "An error occurred while sending the email.",
      });
      console.log("Error: ", error);
    }
  };

  return (
    <KeyboardDismiss>
      <View bg="$warmGray100" p="$4" flex={1}>
        <VStack gap="$4">
          <Text>Enter your email address to reset your password</Text>
          <Box
            sx={{
              shadowColor: "$black",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            w="$full"
            px="$4"
            bg="$white"
            py="$6"
            mb="$4"
          >
            <FormControl
              isInvalid={error}
              errorText="Please enter a valid email address"
              labelText="Email"
            >
              <Input>
                <InputField
                  autoCapitalize="none"
                  onChangeText={handleChange}
                  placeholder="user@example.com"
                />
              </Input>
            </FormControl>
          </Box>
        </VStack>
        <Button onPress={onSubmit} text="Reset Password" />
      </View>
    </KeyboardDismiss>
  );
}
