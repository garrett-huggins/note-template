import {
  View,
  Box,
  Heading,
  VStack,
  Input,
  InputField,
  Image,
  LinkText,
  Text,
} from "@gluestack-ui/themed";
import { Link } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import Button from "@/components/ui/button";
import { FormControl } from "@/components/forms/Controller";
import { useAuth } from "@/components/providers/AuthProvider";
import { useState, useEffect } from "react";
import KeyboardDismiss from "@/components/forms/KeyboardDismiss";

interface FormData {
  email: string;
  password: string;
}

export default function Login() {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const { control, handleSubmit, watch } = useForm<FormData>();

  useEffect(() => {
    if (error && !loading) {
      setError(false);
    }
  }, [watch("email"), watch("password")]);

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    const success = await login(data.email, data.password);
    if (!success) {
      setError(true);
    }
    setLoading(false);
  });

  return (
    <KeyboardDismiss>
      <View flex={1} bg="$warmGray100">
        <Image
          source={require("../../assets/images/logo.webp")}
          alt="Logo"
          w="$full"
          h="$full"
          maxHeight="$1/3"
        />
        <Box px="$4" flex={1}>
          <Heading textAlign="center" fontSize="$3xl" py="$4">
            Mobile
          </Heading>
          <Box
            sx={{
              shadowColor: "$black",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <VStack w="$full" gap={12} bg="$white" p="$4">
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <FormControl
                    labelText="Email"
                    isInvalid={error}
                    isDisabled={loading}
                  >
                    <Input>
                      <InputField
                        autoCapitalize="none"
                        placeholder="email@example.com"
                        onChangeText={field.onChange}
                      />
                    </Input>
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <FormControl
                    labelText="Password"
                    isInvalid={error}
                    isDisabled={loading}
                  >
                    <Input>
                      <InputField
                        type="password"
                        autoCapitalize="none"
                        placeholder="password"
                        onChangeText={field.onChange}
                      />
                    </Input>
                  </FormControl>
                )}
              />
            </VStack>
            {error && (
              <Box bg="$red100" py="$3">
                <Text color="$red500" fontSize="$sm" textAlign="center">
                  Invalid email or password
                </Text>
              </Box>
            )}
          </Box>
          <Box alignItems="flex-end" mb="$6" mt="$2">
            <Link href="/password/forgot">
              <LinkText>Reset Password</LinkText>
            </Link>
          </Box>
          <Button mb="$2" onPress={onSubmit} text="Login" loading={loading} />
          <Text>
            Don't have an account?{" "}
            <Link href="/register">
              <LinkText>Register</LinkText>
            </Link>
          </Text>
        </Box>
      </View>
    </KeyboardDismiss>
  );
}
