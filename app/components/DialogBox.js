import {
  Button,
  Portal,
  Dialog,
  Paragraph,
  TextInput,
  Text,
} from 'react-native-paper';
import React, {useState, useEffect} from 'react';
import {addCategory} from '../../API/firebaseMethods';

export default function DialogBox(
  userData,
  visibleVal,
  newCategoryName,
  newCategoryEmoji,
  setNewCategoryName,
  setNewCategoryEmoji,
) {
  const [visible, setVisible] = useState(visibleVal);
  const hideDialog = () => setVisible(false);
  useEffect(() => {
    setVisible(visibleVal);
  }, [visibleVal]);

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Paragraph>Add New Category</Paragraph>
          <TextInput
            label={'Name'}
            mode="outlined"
            value={newCategoryName}
            onChangeText={categoryName =>
              setNewCategoryName(categoryName)
            }></TextInput>
          <TextInput
            label={'Emoji'}
            mode="outlined"
            value={newCategoryEmoji}
            onChangeText={categoryEmoji =>
              setNewCategoryEmoji(categoryEmoji)
            }></TextInput>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              addCategory(userData, newCategoryName, newCategoryEmoji);
              hideDialog();
            }}>
            Done
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
