import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";
import supabase from "../supabaseClient";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6666", "#9966FF"];

export default function Analytics() {
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [goalProgress, setGoalProgress] = useState(0);

  useEffect(() => {
    fetchCategoryBreakdown();
    fetchMonthlyTrend();
    calculateGoalProgress();
  }, []);

  async function fetchCategoryBreakdown() {
    let { data: expenses } = await supabase
      .from("expenses")
      .select("amount, category_id, categories(name)")
      .eq("user_id", (await supabase.auth.getUser()).data.user.id);

    if (!expenses) return;

    const categoryMap = {};
    expenses.forEach((e) => {
      const cat = e.categories.name;
      categoryMap[cat] = (categoryMap[cat] || 0) + e.amount;
    });

    const chartData = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value
    }));

    setCategoryData(chartData);
  }

  async function fetchMonthlyTrend() {
    let { data: allData } = await supabase
      .from("expenses")
      .select("amount, created_at")
      .eq("user_id", (await supabase.auth.getUser()).data.user.id);

    if (!allData) return;

    const monthMap = {};
    allData.forEach((item) => {
      const month = new Date(item.created_at).toLocaleString("default", { month: "short", year: "numeric" });
      monthMap[month] = (monthMap[month] || 0) + item.amount;
    });

    const chartData = Object.entries(monthMap).map(([month, value]) => ({
      month,
      value
    }));

    setMonthlyData(chartData);
  }

  function calculateGoalProgress() {
    const monthlyGoal = 50000; // example goal
    const currentSpent = monthlyData.reduce((acc, item) => acc + item.value, 0);
    setGoalProgress((currentSpent / monthlyGoal) * 100);
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Monthly Spending Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2>🥧 Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120}>
            {categoryData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <h2>🎯 Savings Goal Progress</h2>
      <div style={{
        height: "30px",
        background: "#eee",
        borderRadius: "10px",
        overflow: "hidden"
      }}>
        <div style={{
          width: `${goalProgress}%`,
          height: "100%",
          background: goalProgress > 100 ? "red" : "green",
          transition: "0.5s"
        }}></div>
      </div>
      <p>{goalProgress.toFixed(1)}% of monthly goal spent</p>
    </div>
  );
}
