import {
  Text,
  Heading,
  SafeAreaView,
  Box,
  VStack,
  Input,
  InputField,
  useToast,
  Toast,
} from "@gluestack-ui/themed";
import { useAuth } from "@/components/providers/AuthProvider";
import { useForm, Controller } from "react-hook-form";
import KeyboardDismiss from "@/components/forms/KeyboardDismiss";
import Button from "@/components/ui/button";
import { FormControl } from "@/components/forms/Controller";
import { authApi } from "@/api";
import { useState } from "react";

interface FormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export default function Register() {
  const { login } = useAuth();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setLoading(true);
      await authApi.authControllerRegister(data);
      await login(data.email, data.password);
    } catch (error) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <VStack gap="$2">
              <Toast.Title>Registration Error</Toast.Title>
              <Toast.Description>
                There was an error registering your account. Please try again.
              </Toast.Description>
            </VStack>
          </Toast>
        ),
      });
      console.error(error);
    }
    setLoading(false);
  });

  return (
    <KeyboardDismiss>
      <SafeAreaView flex={1} bg="$warmGray100">
        <Box px="$4">
          <Heading mb="$1" textAlign="center">
            Welcome to Mobile
          </Heading>
          <Text mb="$4">
            Please enter your information to create an account and get started.
          </Text>
          <VStack
            gap="$4"
            p="$4"
            bg="$white"
            sx={{
              shadowColor: "$black",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Controller
              control={control}
              name="first_name"
              rules={{ required: "First Name is required" }}
              render={({ field }) => (
                <FormControl
                  labelText="First Name"
                  isInvalid={!!errors.first_name}
                  errorText={errors.first_name?.message}
                  isDisabled={loading}
                >
                  <Input>
                    <InputField
                      placeholder="First Name"
                      autoCapitalize="words"
                      autoCorrect={false}
                      onChangeText={field.onChange}
                    />
                  </Input>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="last_name"
              rules={{ required: "Last Name is required" }}
              render={({ field }) => (
                <FormControl
                  labelText="Last Name"
                  isInvalid={!!errors.last_name}
                  errorText={errors.last_name?.message}
                  isDisabled={loading}
                >
                  <Input>
                    <InputField
                      placeholder="Last Name"
                      autoCapitalize="words"
                      autoCorrect={false}
                      onChangeText={field.onChange}
                    />
                  </Input>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                validate: (value) =>
                  value.includes("@") || "Please enter a valid email address",
              }}
              render={({ field }) => (
                <FormControl
                  labelText="Email"
                  isInvalid={!!errors.email}
                  errorText={errors.email?.message}
                  isDisabled={loading}
                >
                  <Input>
                    <InputField
                      placeholder="Email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={field.onChange}
                    />
                  </Input>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <FormControl
                  labelText="Password"
                  errorText={errors.password?.message}
                  isInvalid={!!errors.password}
                  isDisabled={loading}
                >
                  <Input>
                    <InputField
                      placeholder="Password"
                      secureTextEntry
                      autoCapitalize="none"
                      autoCorrect={false}
                      onChangeText={field.onChange}
                    />
                  </Input>
                </FormControl>
              )}
            />
          </VStack>
          <Button
            mt="$4"
            onPress={onSubmit}
            text="Register"
            loading={loading}
          />
        </Box>
      </SafeAreaView>
    </KeyboardDismiss>
  );
}
