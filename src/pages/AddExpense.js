import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Container = styled.div`
  max-width: 480px;
  margin: 3rem auto;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0,0,0,0.1);
  font-family: 'Poppins', sans-serif;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 700;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  padding: 0.7rem 1rem;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    border-color: #764ba2;
    outline: none;
  }
`;

const Select = styled.select`
  padding: 0.7rem 1rem;
  border: 1.5px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  &:focus {
    border-color: #764ba2;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 0.85rem;
  background: #764ba2;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.3s ease;
  &:hover {
    background: #5e3688;
  }
`;

const Message = styled.p`
  margin-top: 1rem;
  text-align: center;
  color: ${props => (props.error ? '#e63946' : '#2a9d8f')};
  font-weight: 600;
`;

export default function AddExpense() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    setError('Failed to load categories');
    console.error(error);
  } else {
    console.log('Fetched categories:', data);
    setCategories(data);
  }
}


  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setError('User not authenticated');
      return;
    }

    const { error } = await supabase.from('expenses').insert({
      amount: parseFloat(amount),
      category_id: category || null,
      description,
      user_id: user.id,
      date: new Date().toISOString().split('T')[0],
    });

    if (error) setError(error.message);
    else {
      setMessage('Expense added successfully!');
      setAmount('');
      setCategory('');
      setDescription('');
      setTimeout(() => navigate('/'), 2000);
    }
  }

  return (
    <>
      <Navbar />
      <Container>
        <Title>Add Expense</Title>
        <Form onSubmit={handleSubmit}>
          <Label>Amount (₹)</Label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
          />

          <Label>Category</Label>
          <select
  value={category}
  onChange={e => setCategory(e.target.value)}
  required
>
  <option value="">Select Category</option>
  {categories.map(cat => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</select>


          <Label>Description</Label>
          <Input
            type="text"
            placeholder="Optional"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <Button type="submit">Add Expense</Button>
        </Form>
        {message && <Message>{message}</Message>}
        {error && <Message error>{error}</Message>}
      </Container>
    </>
  );
}
