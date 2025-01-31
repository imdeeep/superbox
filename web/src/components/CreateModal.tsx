import { X } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from '@/constant/data';
interface Organisation {
  _id: string;
  OrgId: string;
  OrgName: string;
  OrgDes: string;
  createdAt: string;
}
interface CreateModalProps {
  setShowModal: (show: boolean) => void;
  onOrganisationCreated: (org: Organisation) => void;
}
interface User {
  _id: string;
}

const CreateModal: React.FC<CreateModalProps> = ({
  setShowModal,
  onOrganisationCreated,
}) => {
  const { user } = useAuth() as { user: User | null };
  const [orgName, setOrgName] = useState<string>('');
  const [orgDes, setOrgDes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleCreateOrganisation = async () => {
    if (!orgName || !orgDes) {
      alert('Please fill out both fields.');
      return;
    }

    if (!user) {
      console.error('User not found.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${BASE_URL}api/v1/organisation/create/`,
        {
          OrgName: orgName,
          OrgDes: orgDes,
          user_Id: user._id,
        }
      );
      console.log('Organisation created successfully:', response.data);
      onOrganisationCreated(response.data);
      setShowModal(false);
    } catch (error) {
      console.error('Error creating organisation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-primary bg-opacity-60 z-[9]">
      <div className="flex flex-col bg-secondary/80 border border-tertiary/55 p-6 rounded-lg shadow-lg max-w-md w-full space-y-3 relative">
        <h1 className="text-2xl">Create Organisation</h1>
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-0 right-3 bg-primary/80 p-2 rounded-full border border-tertiary/40"
        >
          <X size={15} />
        </button>
        <input
          type="text"
          placeholder="Organisation Name"
          className="p-2 border border-tertiary/40 rounded-md outline-none text-sm text-white bg-primary"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Organisation Description"
          className="p-2 border border-tertiary/40 rounded-md outline-none text-sm text-white bg-primary"
          value={orgDes}
          onChange={(e) => setOrgDes(e.target.value)}
        />
        <button
          onClick={handleCreateOrganisation}
          disabled={isSubmitting}
          className="mt-4 p-2 text-sm bg-zinc-200 text-black rounded-md hover:bg-zinc-100 ease-in-out transition-all"
        >
          {isSubmitting ? 'Creating...' : 'Create'}
        </button>
      </div>
    </div>
  );
};

export default CreateModal;
