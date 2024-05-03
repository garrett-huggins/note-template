import { Text, Card, Heading, Center } from "@gluestack-ui/themed";
import { useAuth } from "@/components/providers/AuthProvider";

export default function Home() {
  const { user } = useAuth();

  return (
    <Center flex={1} p="$4">
      <Card w="$full">
        <Heading textAlign="center">Welcome {user?.first_name}!</Heading>
        <Text textAlign="center">
          This is the first tab. You can start building your app here.
        </Text>
      </Card>
    </Center>
  );
}
