import { CloseModalButton, CreateModal } from '@components/Modal/styles';
import React, { FC, useCallback } from 'react';

// TypeScript에서는 Props에 대한 타입을 명시해주어야 에러 안뜸 (=리액트의 propTypes)
interface Props {
  show: boolean;
  onCloseModal: () => void;
}
// Props로 넘겨받은것들을 매개변수로 명시 
const Modal: FC<Props> = ({ show, children, onCloseModal }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  // show변수가 false면, 화면에서 안보이도록 
  if (!show) return null;
  
  return (
    <CreateModal onClick={onCloseModal}>
      <div onClick={stopPropagation}>
        <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>
        {children}
      </div>
    </CreateModal>
  );
};

export default Modal;
