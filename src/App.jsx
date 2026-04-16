import { useState, useEffect, useMemo } from "react";
import "./App.css";

const API_URL = "/api/transactions";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch transactions from MongoDB
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Failed to fetch transactions");
      const data = await response.json();
      setTransactions(data);
      setError("");
    } catch (err) {
      setError("Error loading transactions: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setType("Income");
    setEditId(null);
  };

  const addOrUpdateTransaction = async () => {
    if (!description || !amount || Number(amount) <= 0) {
      setError("Please fill in all fields with valid values");
      return;
    }

    try {
      const payload = {
        description,
        amount: Number(amount),
        type,
      };

      if (editId) {
        // Update existing transaction
        const response = await fetch(`${API_URL}/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to update transaction");
      } else {
        // Create new transaction
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!response.ok) throw new Error("Failed to add transaction");
      }

      await fetchTransactions();
      resetForm();
      setError("");
    } catch (err) {
      setError("Error: " + err.message);
      console.error(err);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete transaction");
      await fetchTransactions();
      setError("");
    } catch (err) {
      setError("Error: " + err.message);
      console.error(err);
    }
  };

  const editTransaction = (transaction) => {
    setDescription(transaction.description);
    setAmount(transaction.amount);
    setType(transaction.type);
    setEditId(transaction._id);
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

      {error && <div className="error-message">{error}</div>}
      {loading && <p>Loading transactions...</p>}

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
          <div key={t._id} className="transaction">
            <div>
              <strong>{t.description}</strong>
              <p className={t.type === "Income" ? "green" : "red"}>
                ₹ {t.amount}
              </p>
            </div>
            <div>
              <button onClick={() => editTransaction(t)}>Edit</button>
              <button onClick={() => deleteTransaction(t._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
