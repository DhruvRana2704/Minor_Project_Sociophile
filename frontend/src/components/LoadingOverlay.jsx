import React from 'react';
import { useLoading } from '../contexts/LoadingContext';
import './LoadingOverlay.css';

export default function LoadingOverlay() {
  const { loading } = useLoading();
  if (!loading) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-box">
        <div className="spinner-border text-danger" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  );
}
