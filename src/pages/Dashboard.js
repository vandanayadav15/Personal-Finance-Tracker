import React, { useEffect, useState } from "react";
import Header from "../components/Header/Index";
import Cards from "../components/Cards/Index";
import AddExpensesModal from "../components/Modal/AddExpenses";
import AddIncomeModal from "../components/Modal/AddIncome";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionTable from "../components/TransactionTable/Index";
import ChartCoponent from "../components/Charts/Index";
import NoTransactions from "../components/NoTransaction";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isExpensesModalVisible, setIsExpensesModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };
  const showExpenceModal = () => {
    setIsExpensesModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpensesModalVisible(false);
  };
  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransactions(newTransaction);
  };

  async function addTransactions(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document writen with id :", docRef.uid);
      if (!many) toast.success("Tracsaction added ");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.log("error adding document", e);
      if (!many) toast.error("Coudn't added Transactione");
    }
  }

  useEffect(() => {
    fetchTransaction();
  }, [user]);

  async function fetchTransaction() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
      toast.success("Transaction fetched");
    }
    setLoading(false);
  }

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  function calculateBalance() {
    let incomeTotal = 0;
    let expenceTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenceTotal += transaction.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenceTotal);
    setCurrentBalance(incomeTotal - expenceTotal);
  }

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      {loading ? (
        <p>loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            currentBalance={currentBalance}
            showIncomeModal={showIncomeModal}
            showExpenceModal={showExpenceModal}
          />
          {sortedTransactions && sortedTransactions.length !== 0 ? (
            <ChartCoponent sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
          <AddExpensesModal
            isExpensesModalVisible={isExpensesModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <TransactionTable
            transactions={transactions}
            addTransactions={addTransactions}
            fetchTransaction={fetchTransaction}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
