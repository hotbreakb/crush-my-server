import React from 'react';
import styled from 'styled-components';

const Toast = ({ message, onClose }) => {
  return (
    <ToastWrapper>
      <ToastContent>
        <ErrorMessage>{message}</ErrorMessage>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </ToastContent>
    </ToastWrapper>
  );
};

const ToastWrapper = styled.div`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
`;

const ToastContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ff4d4f;
  color: white;
  padding: 12px 20px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const ErrorMessage = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
  margin-left: 10px;
  padding: 0;
  line-height: 1;
`;

export default Toast;
