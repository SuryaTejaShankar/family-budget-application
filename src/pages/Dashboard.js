import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import { supabase } from '../supabaseClient';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Container = styled.div`
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
`;

const Title = styled.h1`
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Button = styled.button`
  background: #764ba2;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #5e3688;
  }
`;

const Summary = styled.div`
  background: #f7f5ff;
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-around;
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 3rem;
`;

const SummaryItem = styled.div`
  text-align: center;
`;

export default function Dashboard() {
  const navigate = useNavigate();

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    async function fetchSummary() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: incomeData, error: incomeError } = await supabase
        .from('incomes')
        .select('amount, created_at')
        .eq('user_id', user.id);

      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('amount, created_at')
        .eq('user_id', user.id);

      if (incomeError || expenseError) {
        setTotalIncome(0);
        setTotalExpense(0);
        setChartData([]);
        setLoading(false);
        return;
      }

      const incomeTotal = incomeData.reduce((acc, curr) => acc + curr.amount, 0);
      const expenseTotal = expenseData.reduce((acc, curr) => acc + curr.amount, 0);

      setTotalIncome(incomeTotal);
      setTotalExpense(expenseTotal);

      // Prepare chart data by month
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyData = {};

      incomeData.forEach(item => {
        const date = new Date(item.created_at);
        const month = months[date.getMonth()];
        if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 };
        monthlyData[month].income += item.amount;
      });

      expenseData.forEach(item => {
        const date = new Date(item.created_at);
        const month = months[date.getMonth()];
        if (!monthlyData[month]) monthlyData[month] = { month, income: 0, expense: 0 };
        monthlyData[month].expense += item.amount;
      });

      const sortedChartData = months
        .filter(m => monthlyData[m])
        .map(m => monthlyData[m]);

      setChartData(sortedChartData);
      setLoading(false);
    }

    fetchSummary();
  }, []);

  // New useEffect to insert recurring transactions once on load
  useEffect(() => {
    async function insertRecurringTransactions() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];

      // Fetch recurring transactions active today
      const { data: recurring, error } = await supabase
        .from("recurring_transactions")
        .select("*")
        .eq("user_id", user.id)
        .lte("start_date", today)
        .or(`end_date.gte.${today},end_date.is.null`);

      if (error) {
        console.error("Error fetching recurring transactions:", error);
        return;
      }

      for (const rt of recurring) {
        const tableName = rt.type === "income" ? "incomes" : "expenses";

        // Check if record already exists today for this recurring entry
        const { data: existing, error: checkError } = await supabase
          .from(tableName)
          .select("*")
          .eq("user_id", user.id)
          .eq("date", today)
          .eq("category_id", rt.category_id)
          .eq("amount", rt.amount)
          .eq("description", rt.description);

        if (checkError) {
          console.error("Error checking existing transaction:", checkError);
          continue;
        }

        if (existing.length === 0) {
          // Insert today's transaction
          await supabase.from(tableName).insert([
            {
              user_id: user.id,
              category_id: rt.category_id,
              amount: rt.amount,
              description: rt.description,
              date: today,
            },
          ]);
        }
      }
    }

    insertRecurringTransactions();
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <Title>Welcome to Family Budget Dashboard</Title>
        <ButtonGroup>
          <Button onClick={() => navigate('/add-income')}>Add Income</Button>
          <Button onClick={() => navigate('/add-expense')}>Add Expense</Button>
          <Button onClick={() => navigate('/add-recurring')}>Add Recurring</Button>
        </ButtonGroup>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Loading summary...</p>
        ) : (
          <>
            <Summary>
              <SummaryItem>
                Total Income<br />
                ₹{totalIncome.toFixed(2)}
              </SummaryItem>
              <SummaryItem>
                Total Expense<br />
                ₹{totalExpense.toFixed(2)}
              </SummaryItem>
              <SummaryItem>
                Balance<br />
                ₹{(totalIncome - totalExpense).toFixed(2)}
              </SummaryItem>
            </Summary>

            {chartData.length > 0 && (
              <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#4caf50" strokeWidth={3} />
                    <Line type="monotone" dataKey="expense" stroke="#f44336" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
