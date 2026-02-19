import { useState, useEffect, useMemo } from "react";
import "./App.css";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType("Income");
    setEditId(null);
  };

  const addOrUpdateTransaction = () => {
    if (!description || !amount || Number(amount) <= 0) return;

    if (editId) {
      setTransactions(
        transactions.map((t) =>
          t.id === editId
            ? { ...t, description, amount: Number(amount), type }
            : t
        )
      );
    } else {
      const newTransaction = {
        id: Date.now(),
        description,
        amount: Number(amount),
        type,
      };
      setTransactions([...transactions, newTransaction]);
    }

    resetForm();
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const editTransaction = (transaction) => {
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setType(transaction.type);
    setEditId(transaction.id);
  };

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "Income")
        .reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "Expense")
        .reduce((acc, t) => acc + t.amount, 0),
    [transactions]
  );

  const balance = totalIncome - totalExpenses;

  const filteredTransactions =
    filter === "All"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  return (
    <div className="container">
      <h1>Expense Tracker</h1>

      <div className="summary">
        <div className="card">
          <h3>Total Balance</h3>
          <p>₹ {balance}</p>
        </div>
        <div className="card income">
          <h3>Total Income</h3>
          <p>₹ {totalIncome}</p>
        </div>
        <div className="card expense">
          <h3>Total Expenses</h3>
          <p>₹ {totalExpenses}</p>
        </div>
      </div>

      <div className="filter">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
      </div>

      <div className="form">
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option>Income</option>
          <option>Expense</option>
        </select>

        <button onClick={addOrUpdateTransaction}>
          {editId ? "Update Transaction" : "Add Transaction"}
        </button>
      </div>

      <div className="list">
        {filteredTransactions.length === 0 && (
          <p className="empty">No transactions yet</p>
        )}

        {filteredTransactions.map((t) => (
          <div key={t.id} className="transaction">
            <div>
              <strong>{t.description}</strong>
              <p className={t.type === "Income" ? "green" : "red"}>
                ₹ {t.amount}
              </p>
            </div>
            <div>
              <button onClick={() => editTransaction(t)}>Edit</button>
              <button onClick={() => deleteTransaction(t.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
