import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore/lite';
import moment from 'moment';
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

const previousTotal = async () => {
  const totalExpenseCol = collection(db, 'total_expense');
  const totalExpenseSnapshot = await getDocs(totalExpenseCol);
  const expenseList = totalExpenseSnapshot.docs.map(doc => doc.data());
  const hello = expenseList.filter(item => {
    return item.userId === userId;
  });
  return hello[0].totalExpense;
};

export const updateTotalExpense = async newExpense => {
  const newTotalExpense = newExpense + (await previousTotal());
  const frankDocRef = doc(db, 'total_expense', userId);
  console.log('frankDocRef', frankDocRef);
  try {
    await updateDoc(frankDocRef, {
      totalExpense: newTotalExpense,
    });
  } catch (error) {
    console.log('error in updating', error);
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
    if (category == 'education') {
      await updateDoc(frankDocRef, {
        education: newTotalCategoryExpense,
      });
    } else if (category == 'grocery') {
      await updateDoc(frankDocRef, {
        grocery: newTotalCategoryExpense,
      });
    } else if (category == 'transportation') {
      await updateDoc(frankDocRef, {
        transportation: newTotalCategoryExpense,
      });
    } else if (category == 'party') {
      await updateDoc(frankDocRef, {
        party: newTotalCategoryExpense,
      });
    } else if (category == 'medicines') {
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

export const getUserTotalExpenses = async () => {
  var totalExpenseCol = collection(db, 'total_expense');
  var totalExpenseSnapshot = await getDocs(totalExpenseCol);
  var expenseList = totalExpenseSnapshot.docs.map(doc => doc.data());
  var hello = expenseList.map(item => {
    if (item.userId === userId) {
      return item;
    }
  });

  var pieChartData = hello[0]
  var totalExpense = hello[0].totalExpense
  delete pieChartData.totalExpense
  delete pieChartData.userId

  var flatListData = pieChartData

  let count = 0
  let obj2 = []
  var keyNa = Object.keys(flatListData)
  var colorPallete = ['#e4572e', '#17bebb', '#ffc914', '#4700D8', '#76b041', '#9a348e']

  keyNa.map((item, index) => {
    obj2.push({id: ++count, title: item, expense: flatListData[item], expensePer: ((flatListData[item]*100)/totalExpense).toFixed(2), color: colorPallete[index]})
  })

  var keyNames = Object.keys(pieChartData);
  let obj = [];
  keyNames.map(item => {
    obj.push({x: item, y: pieChartData[item]});
  });
  return [obj, totalExpense, obj2];
};

export const getTwoDaysExpenses = async () => {
  const expenseCol = collection(db, 'expenses');
  const expenseSnapshot = await getDocs(expenseCol);
  const expenseList = expenseSnapshot.docs.map(doc => doc.data());
  const hello = expenseList.map(item => {
    if (item.userId === userId) {
      return item;
    }
  });
  const yesterdayExpense = hello.filter(item => {
    return (
      date_diff_indays(item.date, moment(new Date()).format('MM/DD/YYYY')) == 1
    );
  });
  const todayExpense = hello.filter(item => {
    return (
      date_diff_indays(item.date, moment(new Date()).format('MM/DD/YYYY')) == 0
    );
  });
  const twoDaysExpenses = [todayExpense, yesterdayExpense];
  return(twoDaysExpenses);
};

var date_diff_indays = function (date1, date2) {
  var dt1 = new Date(date1);
  var dt2 = new Date(date2);
  return Math.floor(
    (Date.UTC(dt2.getFullYear(), dt2.getMonth(), dt2.getDate()) -
      Date.UTC(dt1.getFullYear(), dt1.getMonth(), dt1.getDate())) /
      (1000 * 60 * 60 * 24),
  );
};
