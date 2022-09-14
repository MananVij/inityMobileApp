import EncryptedStorage from 'react-native-encrypted-storage';

export async function storeDataLocally(dataName, data) {
  try {
    await EncryptedStorage.setItem(String(dataName), JSON.stringify(data));
  } catch (error) {
    console.log('erorr:', error, error.code);
  }
}

export async function retrieveData(dataName) {
  try {
    const session = await EncryptedStorage.getItem(String(dataName));
    if (session !== undefined) {
      return ([JSON.parse(session)]);
    }
  } catch (error) {
    console.log('error in accessing the transactions from storage: ', error);
  }
}

export async function clearStorage() {
    try {
        await EncryptedStorage.clear();
        const data = await retrieveData('userData')
    } catch (error) {
        console.log('error in clearing storage', error)
        // There was an error on the native side
    }
}
