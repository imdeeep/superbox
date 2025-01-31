'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Search, Trash } from 'lucide-react';
import CreateModal from '@/components/CreateModal';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from '@/constant/data';
import Link from 'next/link';

interface Organisation {
  _id: string;
  OrgId: string;
  OrgName: string;
  OrgDes: string;
  createdAt: string;
}

interface User {
  _id: string;
}

const Organisation: React.FC = () => {
  const { user } = useAuth() as { user: User | null };
  const [showModal, setShowModal] = useState<boolean>(false);
  const [organisations, setOrganisations] = useState<Organisation[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchOrganisations = useCallback(async () => {
    if (!user) return;

    try {
      const response = await axios.get(
        `${BASE_URL}api/v1/organisation/${user._id}`
      );
      setOrganisations(response.data as Organisation[]);
    } catch (error) {
      console.error('Error fetching organisations:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchOrganisations();
  }, [fetchOrganisations]);

  // Function to add new organisation to state
  const handleNewOrganisation = (newOrg: Organisation) => {
    setOrganisations((prevOrgs) => [newOrg, ...prevOrgs]);
    setShowModal(false);
  };

  const handleDelete = async (OrgId: string) => {
    try {
      await axios.delete(`${BASE_URL}api/v1/organisation/delete/${OrgId}`);
      setOrganisations(organisations.filter((org) => org.OrgId !== OrgId));
    } catch (error) {
      console.error('Error deleting organisation:', error);
    }
  };

  return (
    <>
      {showModal && (
        <CreateModal
          setShowModal={setShowModal}
          onOrganisationCreated={handleNewOrganisation}
        />
      )}
      <div className="px-10 mt-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <h1 className="text-3xl tracking-wide bg-gradient-to-r from-white to-secondary bg-clip-text text-transparent inline-block">
            Your Organisations
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border px-3 py-2 rounded-md border-tertiary/50 bg-[#161515]">
              <input
                type="text"
                className="bg-transparent text-white outline-none text-sm placeholder-gray-500 w-32 md:w-48"
                placeholder="Search Organisations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} className="text-gray-400" />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-zinc-800 text-zinc-400 hover:text-white px-3 py-2 text-sm border border-tertiary/50 rounded-md"
            >
              Create
              <Plus size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 py-2">
          {organisations
            .filter((org) =>
              org.OrgName.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((org) => (
              <Card
                key={org.OrgId}
                org={org}
                onDelete={() => handleDelete(org.OrgId)}
              />
            ))}
        </div>
      </div>
    </>
  );
};

export default Organisation;

interface CardProps {
  org: Organisation;
  onDelete: () => void;
}

const Card: React.FC<CardProps> = ({ org, onDelete }) => {
  return (
    <div className="bg-secondary/80 border border-tertiary/80 cursor-pointer hover:scale-105 transition-transform w-full sm:w-[48%] md:w-[30%] lg:w-[24%] p-4 rounded-lg shadow-md">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between text-zinc-400">
          <Link href="/org?id=23121" className="text-sm">
            {org.OrgName}
          </Link>
          <button className="hover:text-white" onClick={onDelete}>
            <Trash size={15} />
          </button>
        </div>
        <Link
          href={`/org?id=${org._id}&name=${org.OrgName}&orgId=${org.OrgId}`}
          className="text-sm text-white"
        >
          {org.OrgDes}
        </Link>
        <p className="text-xs text-zinc-400">
          {new Date(org.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};
