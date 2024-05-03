import { VStack, Text, Card, Heading, Center } from "@gluestack-ui/themed";
import Button from "@/components/ui/button";
import { useAuth } from "@/components/providers/AuthProvider";

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <Center flex={1} p="$4">
        <Card w="$full">
          <Heading textAlign="center">Profile Tab</Heading>
          <Text>Profile Info:</Text>
          <Text>No user found</Text>
        </Card>
      </Center>
    );
  }

  return (
    <Center flex={1} p="$4">
      <Card w="$full">
        <Heading textAlign="center">Profile Tab</Heading>
        <VStack gap="$4">
          <Text>Profile Info:</Text>
          <Text>Name: {user?.first_name + " " + user?.last_name}</Text>
          <Text>Email: {user?.email}</Text>
          <Text>Created: {user?.created_at}</Text>
          <Button onPress={logout} text="Logout"></Button>
        </VStack>
      </Card>
    </Center>
  );
}
