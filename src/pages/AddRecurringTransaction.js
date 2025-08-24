import React, { useState, useEffect } from "react";
import { supabase } from '../supabaseClient';
import { useAuth } from "../context/AuthContext";

function AddRecurringTransaction() {
  const { user } = useAuth();

  const [type, setType] = useState("income");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [repeatInterval, setRepeatInterval] = useState("monthly");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Fetch categories from Supabase
  useEffect(() => {
    const fetchCategories = async () => {
      let { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching categories:", error.message);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || !categoryId || !startDate) {
      alert("Please fill all required fields");
      return;
    }

    const { error } = await supabase.from("recurring_transactions").insert([
      {
        user_id: user.id,
        type,
        category_id: categoryId,
        amount,
        description,
        repeat_interval: repeatInterval,
        start_date: startDate,
        end_date: endDate || null,
      },
    ]);

    if (error) {
      console.error("Error adding recurring transaction:", error.message);
      alert("Failed to add transaction");
    } else {
      alert("Recurring transaction added successfully!");
      setAmount("");
      setDescription("");
      setCategoryId("");
      setStartDate("");
      setEndDate("");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto" }}>
      <h2>Add Recurring Transaction</h2>
      <form onSubmit={handleSubmit}>
        {/* Type */}
        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* Category */}
        <label>Category:</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Amount */}
        <label>Amount:</label>
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        {/* Description */}
        <label>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Repeat Interval */}
        <label>Repeat Interval:</label>
        <select
          value={repeatInterval}
          onChange={(e) => setRepeatInterval(e.target.value)}
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        {/* Start Date */}
        <label>Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        {/* End Date */}
        <label>End Date (optional):</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />

        <br />
        <button type="submit">Add Recurring Transaction</button>
      </form>
    </div>
  );
}

export default AddRecurringTransaction;
