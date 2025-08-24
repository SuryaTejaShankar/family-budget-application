// src/components/SummaryCard.js
import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(18, 25, 38, 0.06);
  border-left: 6px solid ${p => p.color || '#667eea'};
  display:flex;
  flex-direction:column;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 600;
`;

const Value = styled.div`
  margin-top: 0.5rem;
  font-size: 1.6rem;
  font-weight: 800;
  color: #111827;
`;

export default function SummaryCard({ title, value, color }) {
  return (
    <Card color={color}>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </Card>
  );
}
