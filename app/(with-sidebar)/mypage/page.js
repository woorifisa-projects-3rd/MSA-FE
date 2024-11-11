'use client';
import { useState } from 'react';
import WorkplaceModal from '@/components/modal/workplace-registration.js/workplace-registration';
import Button from '@/components/button/button';
import DeleteConfirmModal from '@/components/modal/delete-confirm.js/delete-confirm';

export default function Home() {
  const [isWorkplaceModalOpen, setIsWorkplaceModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);

  const openWorkplaceModal = () => setIsWorkplaceModalOpen(true);
  const closeModal = () => setIsWorkplaceModalOpen(false);
  const openDeleteConfirmModal = () => setIsDeleteConfirmModalOpen(true);
  const closeDeleteConfirmModal = () => setIsDeleteConfirmModalOpen(false);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Button
        text="사업장 등록 모달창" 
        color="red" 
        onClick={openWorkplaceModal}
      />
      <WorkplaceModal 
        isOpen={isWorkplaceModalOpen} 
        onClose={closeModal}
      />
      <Button
        text="삭제 확인 모달창" 
        color="blue" 
        onClick={openDeleteConfirmModal}
      />
      <DeleteConfirmModal
        isOpen={isDeleteConfirmModalOpen} 
        onClose={closeDeleteConfirmModal}
      />
    </div>
  );
}