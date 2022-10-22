import EncryptedStorage from 'react-native-encrypted-storage';
import RNFetchBlob from 'rn-fetch-blob';
const {config, fs} = RNFetchBlob;

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
      return [JSON.parse(session)];
    }
  } catch (error) {
    console.log('error in accessing the transactions from storage: ', error);
  }
}

export async function storeTransaction(smsList) {
  try {
    await EncryptedStorage.setItem(
      'user_online_transactions',
      JSON.stringify({
        ...smsList,
      }),
    );
  } catch (error) {
    // There was an error on the native side
  }
}

export async function storeTxn(list, name) {
  let prevMsgs = await findTxn(name);
  if (prevMsgs != null) {
    prevMsgs.push(list);
  } else {
    prevMsgs = [list];
  }
  try {
    await EncryptedStorage.setItem(name, JSON.stringify(prevMsgs));
    return prevMsgs;
  } catch (error) {
    // There was an error on the native side
  }
}

export async function removeTxn() {
  let prevMsgs = await findTxn('txn');
  prevMsgs.shift();
  if (prevMsgs.length == 0) {
    //remove the session
    try {
      await EncryptedStorage.removeItem('txn');
    } catch (error) {
      // There was an error on the native side
    }
  } else {
    try {
      await EncryptedStorage.setItem('txn', JSON.stringify(prevMsgs));
    } catch (error) {
      // There was an error on the native side
    }
  }
}

export async function findTxn(name) {
  try {
    const session = await EncryptedStorage.getItem(name);

    if (session !== undefined) {
      return JSON.parse(session);
    }
  } catch (error) {
    console.log('error in accessing the transactions from storage: ', error);
  }
}

export async function retrieveUserSession() {
  try {
    const session = await EncryptedStorage.getItem('user_online_transactions');

    if (session !== undefined) {
      return JSON.parse(session);
    }
  } catch (error) {
    console.log('error in accessing the transactions from storage: ', error);
  }
}

export async function clearStorage() {
  try {
    await EncryptedStorage.clear();
    const data = await retrieveData('userData');
  } catch (error) {
    console.log('error in clearing storage', error);
    // There was an error on the native side
  }
}

export async function storeAvatar(avatarLink) {
  let PictureDir = fs.dirs.PictureDir;
  await RNFetchBlob.config({
    fileCache: true,
    appendExt: 'image/png',
    addAndroidDownloads: {
      useDownloadManager: true,
      path: PictureDir + '/inity_avatar.png',
      mediaScannable: true,
    },
  })
    .fetch('GET', avatarLink)
    .then(res => {
      console.log('Avatar Downloaded Successfully.');
    })
    .catch(e => {
      console.log(e, 'error');
    });
}

export async function ifAvatarExists() {
  return await RNFetchBlob.fs
    .exists('file:///storage/emulated/0/Pictures/inity_avatar.png')
    .then(res => {
      return res;
    })
    .catch(e => {
      console.log('error', e);
    });
}
