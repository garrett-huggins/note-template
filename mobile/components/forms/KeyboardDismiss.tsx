import { TouchableWithoutFeedback, Keyboard } from "react-native";

export default function KeyboardDismiss({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      {children}
    </TouchableWithoutFeedback>
  );
}
