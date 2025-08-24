import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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

const MessageText = styled.p`
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 600;
  color: ${props => (props.error ? '#e63946' : '#2a9d8f')};
`;

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else {
      setMessage('Sign-up successful! Please check your email to confirm your account.');
      // Optionally redirect to login after some delay
      setTimeout(() => navigate('/login'), 4000);
    }
  };

  return (
    <Container
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      <Form onSubmit={handleSignup}>
        <Title>Family Budget Sign Up</Title>
        {error && <MessageText error>{error}</MessageText>}
        {message && <MessageText>{message}</MessageText>}
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <Button type="submit">Sign Up</Button>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#555' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#764ba2', fontWeight: '600', textDecoration: 'none' }}>
            Log In
          </Link>
        </p>
      </Form>
    </Container>
  );
}
