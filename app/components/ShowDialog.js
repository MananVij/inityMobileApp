import {View, Text} from 'react-native';
import {Dialog, Paragraph, Text} from 'react-native-paper';
import React from 'react';

export default function ShowDialog(dialogMsg) {
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Paragraph>{dialogMsg}</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
