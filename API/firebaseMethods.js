import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore/lite';
import {storeDataLocally} from '../app/functions/localStorage';

import {db, userId} from '../config/keys';

export const getTotalExpense = async () => {
  const totalExpenseCol = collection(db, 'total_expense');
  const totalExpenseSnapshot = await getDocs(totalExpenseCol);
  const expenseList = totalExpenseSnapshot.docs.map(doc => doc.data());
  return expenseList.map(item => {
    if (item.userId === userId) {
      return item.totalExpense;
    }
  });
};
export const userData = async () => {
  const totalExpenseCol = collection(db, 'users');
  const totalExpenseSnapshot = await getDocs(totalExpenseCol);
  const expenseList = totalExpenseSnapshot.docs.map(doc => doc.data());
  console.log('expesne list: ', expenseList);
  return expenseList.filter((item, key) => {
    console.log(item);
    if (item.user_details.uid == userId) {
      return item.totalExpense;
    }
  });
};
export const createTotalExpenseDoc = async () => {
  try {
    const docRef = await setDoc(doc(db, 'total_expense', userId), {
      userId: userId,
      totalExpense: 0,
      grocery: 0,
      education: 0,
      transportation: 0,
      party: 0,
      medicines: 0,
      others: 0,
    });
    console.log('Document written with ID: ', docRef);
  } catch (e) {
    console.log('error in creating document: ', e);
  }
};

export const createSignupDoc = async user => {
  const signupData = {
    userDetails: {
      name: user.displayName,
      email: user.email,
      uid: userId ? userId : user.userId,
      gender: '',
    },
    monthlyExpense: {
      jan: '0',
      feb: '0',
      march: '0',
      april: '0',
      may: '0',
      june: '0',
      july: '0',
      aug: '0',
      sept: '0',
      oct: '0',
      nov: '0',
      dec: '0',
    },
    monthlyIncome: {
      jan: '0',
      feb: '0',
      march: '0',
      april: '0',
      may: '0',
      june: '0',
      july: '0',
      aug: '0',
      sept: '0',
      oct: '0',
      nov: '0',
      dec: '0',
    },
    categories: {
      Bills: '🧾',
      Clothing: '👕',
      "EMI's": '📃',
      Education: '📚',
      Food: '🍕',
      Grocery: '🥑',
      Gym: '🏋🏻‍♂️',
      Healhcare: '💊',
      Insurence: '💰',
      Investments: '📈',
      Miscelleneous: '🤷‍♂️',
      Party: '🎉',
      Shopping: '🛍',
      Taxes: '💸',
      Travel: '🚘',
    },
    expenses: {},
  };
  try {
    const docRef = await setDoc(
      doc(db, 'users', userId ? userId : user.userId),
      signupData,
    );
    // await storeDataLocally("userData", [signupData]);
    console.log('Signup Doc created');
    return signupData;
  } catch (e) {
    console.log('Error in creating signup doc: ', e);
  }
};

export const getUserData = async googleUserId => {
  try {
    const userCol = collection(db, 'users');
    const userSnapshot = await getDocs(userCol);
    const expenseList = userSnapshot.docs.map(doc => doc.data());
    if (googleUserId) {
      const data = expenseList.filter((item, key) => {
        if (item?.userDetails?.uid == googleUserId) {
          return item;
        }
      });
      return data;
    } else {
      const data = expenseList.filter((item, key) => {
        if (item?.userDetails?.uid == userId) {
          return item;
        }
      });
      return data;
    }
  } catch (error) {
    console.log(error, 'in fetching data');
  }
};

export const addExpense = async (userData, expenseData) => {
  const monthNames = [
    'jan',
    'feb',
    'march',
    'april',
    'may',
    'june',
    'july',
    'aug',
    'sept',
    'oct',
    'nov',
    'dec',
  ];

  const monthName = monthNames[Number(expenseData.date.split('-')[1]) - 1];

  const d = new Date();
  const thisMonthName = monthNames[d.getMonth()];
  const updatedMonthlyExpense = String(
    Number(userData[0].monthlyExpense[monthName]) + Number(expenseData.amount),
  );
  let date = expenseData.date;

  if (userData[0].expenses[date] === undefined) {
    userData[0].expenses[date] = Array(expenseData);
  } else {
    userData[0].expenses[date].push(expenseData);
  }
  userData[0].monthlyExpense[monthName] = updatedMonthlyExpense;

  try {
    const docRef = await setDoc(
      doc(db, 'users', userData[0].userDetails.uid),
      userData[0],
    );
    console.log('Expense Added');
  } catch (error) {
    console.log('Error in adding expense: ', error);
  }
};

export const chooseGender = async (userData, gender, avatarIndex, avatarLink) => {
  userData.userDetails = {
    ...userData.userDetails,
    gender: gender,
    avatarIndex: avatarIndex,
    avatarLink: avatarLink
  };

  try {
    const docRef = await setDoc(
      doc(db, 'users', userData.userDetails.uid),
      userData,
    );
    storeDataLocally('userData', userData);
    console.log('Gender Added');
    return 1
  } catch (error) {
    console.log('Error in adding gender: ', error);
    return 0
  }
};

export const addCategory = async (userData, categoryName, categoryEmoji) => {
  userData[0].categories = {
    ...userData[0].categories,
    [categoryName]: categoryEmoji,
  };
  try {
    const docRef = await setDoc(doc(db, 'users', userId), userData[0]);
    console.log('Category Added');
  } catch (error) {
    console.log('Error in adding category: ', error);
  }
};

const previousCategoryTotal = async category => {
  const totalExpenseCol = collection(db, 'total_expense');
  const totalExpenseSnapshot = await getDocs(totalExpenseCol);
  const expenseList = totalExpenseSnapshot.docs.map(doc => doc.data());
  const hello = expenseList.filter(item => {
    return item.userId === userId;
  });
  if (category == 'education') {
    return hello[0].education;
  } else if (category == 'grocery') {
    return hello[0].grocery;
  } else if (category == 'transportation') {
    return hello[0].transportation;
  } else if (category == 'party') {
    return hello[0].party;
  } else if (category == 'medicines') {
    return hello[0].medicines;
  } else {
    return hello[0].others;
  }
};

export const updateCategoryTotalExpense = async (newExpense, category) => {
  const newTotalCategoryExpense =
    newExpense + (await previousCategoryTotal(category));
  const frankDocRef = doc(db, 'total_expense', userId);
  try {
    if (category == 'Education') {
      await updateDoc(frankDocRef, {
        education: newTotalCategoryExpense,
      });
    } else if (category == 'Grocery') {
      await updateDoc(frankDocRef, {
        grocery: newTotalCategoryExpense,
      });
    } else if (category == 'Transportation') {
      await updateDoc(frankDocRef, {
        transportation: newTotalCategoryExpense,
      });
    } else if (category == 'Party') {
      await updateDoc(frankDocRef, {
        party: newTotalCategoryExpense,
      });
    } else if (category == 'Medicines') {
      await updateDoc(frankDocRef, {
        medicines: newTotalCategoryExpense,
      });
    } else {
      await updateDoc(frankDocRef, {
        others: newTotalCategoryExpense,
      });
    }
    console.log('doc updated');
  } catch (error) {
    console.log('error in updating', error);
  }
};
