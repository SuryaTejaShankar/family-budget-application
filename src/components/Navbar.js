import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';

const Nav = styled.nav`
  background: #764ba2;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Poppins', sans-serif;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: white;
  font-weight: 600;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LogoutButton = styled.button`
  background: transparent;
  border: 1.5px solid white;
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
  &:hover {
    background: white;
    color: #764ba2;
  }
`;

export default function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate('/login');
  }

  return (
    <Nav>
      <NavLinks>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/add-expense">Add Expense</NavLink>
        <NavLink to="/add-income">Add Income</NavLink>
      </NavLinks>
      <LogoutButton onClick={handleLogout}>Log Out</LogoutButton>
    </Nav>
  );
}
