import {
  View,
  Box,
  Text,
  Input,
  InputField,
  VStack,
  Toast,
  useToast,
} from "@gluestack-ui/themed";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FormControl } from "@/components/forms/Controller";
import Button from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { authApi } from "@/api";
import { useState } from "react";
import KeyboardDismiss from "@/components/forms/KeyboardDismiss";

interface FormData {
  password: string;
  confirmPassword: string;
  resetToken: string;
}

export default function ResetPassword() {
  const params = useLocalSearchParams<{ token?: string }>();
  const resetToken = params.token || "";
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    try {
      await authApi.authControllerResetPassword({
        password: data.password,
        reset_token: resetToken || data.resetToken,
      });
      router.push("/login");
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={id} action="success">
            <VStack gap="$2">
              <Toast.Title>Password Reset!</Toast.Title>
              <Toast.Description>
                Your password has been successfully reset.
              </Toast.Description>
            </VStack>
          </Toast>
        ),
      });
    } catch (error) {
      toast.show({
        placement: "bottom",
        render: ({ id }) => (
          <Toast nativeID={id} action="error">
            <VStack gap="$2">
              <Toast.Title>Error!</Toast.Title>
              <Toast.Description>
                There was an error resetting your password. Please verify your
                reset token and try again.
              </Toast.Description>
            </VStack>
          </Toast>
        ),
      });
      console.log("Error: ", error);
    }
    setLoading(false);
  });

  return (
    <KeyboardDismiss>
      <View bg="$warmGray100" p="$4" flex={1}>
        <Text mb="$4">
          {resetToken
            ? "Enter your new password"
            : "Enter your new password and reset token"}
        </Text>
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
          <VStack gap="$4">
            <Controller
              control={control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field }) => (
                <FormControl
                  isInvalid={!!errors.password}
                  errorText={errors.password?.message}
                  labelText="Password"
                >
                  <Input>
                    <InputField
                      type="password"
                      placeholder="Password"
                      onChangeText={field.onChange}
                    />
                  </Input>
                </FormControl>
              )}
            />
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Confirm Password is required",
                validate: (value) =>
                  value === watch("password") || "Passwords do not match",
              }}
              render={({ field }) => (
                <FormControl
                  isDisabled={loading}
                  isInvalid={!!errors.confirmPassword}
                  errorText={errors.confirmPassword?.message}
                  labelText="Confirm Password"
                >
                  <Input>
                    <InputField
                      type="password"
                      placeholder="Confirm Password"
                      onChangeText={field.onChange}
                    />
                  </Input>
                </FormControl>
              )}
            />
            {!resetToken && (
              <Controller
                control={control}
                name="resetToken"
                rules={{ required: "Reset Token is required" }}
                render={({ field }) => (
                  <FormControl
                    isDisabled={loading}
                    isInvalid={!!errors.resetToken}
                    errorText={errors.resetToken?.message}
                    labelText="Reset Token"
                  >
                    <Input>
                      <InputField
                        placeholder="Reset Token"
                        onChangeText={field.onChange}
                      />
                    </Input>
                  </FormControl>
                )}
              />
            )}
          </VStack>
        </Box>
        <Button isDisabled={loading} onPress={onSubmit} text="Reset Password" />
      </View>
    </KeyboardDismiss>
  );
}
