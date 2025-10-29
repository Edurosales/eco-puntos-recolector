import React from 'react';
import { Card } from 'react-bootstrap';

const StatCard = ({ title, value, icon: Icon, gradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }) => {
  return (
    <Card className="h-100 border-0 shadow-sm" style={{
      background: gradient,
      color: 'white'
    }}>
      <Card.Body className="d-flex align-items-center justify-content-between">
        <div>
          <p className="mb-1 text-white-50 small">{title}</p>
          <h3 className="mb-0 fw-bold">{value}</h3>
        </div>
        {Icon && (
          <div style={{
            fontSize: '3rem',
            opacity: 0.3
          }}>
            <Icon />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default StatCard;
