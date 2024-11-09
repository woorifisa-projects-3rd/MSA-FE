// pages/index.jsx 또는 app/page.jsx
'use client';
import { useState } from 'react';
import WorkplaceModal from '@/components/modal/workplace-registraion.js/workplace-registration';
import Button from '@/components/button/button';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Button
        text="button 클릭하면 modal창 열림" 
        color="red" 
        onClick={openModal}
      />
      <WorkplaceModal 
        isOpen={isModalOpen} 
        onClose={closeModal}
      />
    </div>
  );
}