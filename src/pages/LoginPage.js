import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Container = styled(motion.div)`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Form = styled.form`
  background: white;
  padding: 3rem 4rem;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  width: 400px;
  max-width: 90%;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  color: #333;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  border-radius: 8px;
  border: 1.5px solid #ddd;
  font-size: 1rem;
  transition: border-color 0.3s;
  &:focus {
    outline: none;
    border-color: #764ba2;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.85rem;
  background: #764ba2;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  &:hover {
    background: #5e3688;
  }
`;

const ErrorText = styled.p`
  color: #e63946;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
`;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate('/');
  };

  return (
    <Container
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Form onSubmit={handleLogin}>
        <Title>Family Budget Login</Title>
        {error && <ErrorText>{error}</ErrorText>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Log In</Button>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#555' }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: '#764ba2', fontWeight: '600', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>
      </Form>
    </Container>
  );
}