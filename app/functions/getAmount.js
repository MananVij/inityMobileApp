export const getAmount = smsBody => {
  if (smsBody.includes('Rs.')) {
    const arr = smsBody.split('Rs.')[1]?.split(' ');
    return arr[0] == '' ? arr[1] : arr[0];
  } else if (smsBody.includes('Rs')) {
    const arr = smsBody.split('Rs')[1]?.split(' ');

    return arr[0] == '' ? arr[1] : arr[0];
  } else if (smsBody.includes('INR')) {
    const arr = smsBody.split('INR')[1]?.split(' ');
    return arr[0] == '' ? arr[1] : arr[0];
  }
};
