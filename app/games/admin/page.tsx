'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { dummyParticipants, dummyGame, currentUser } from '@/lib/dummy-data';
import { Lock, Unlock, DollarSign, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { PaymentStatus } from '@/types/database';

export default function AdminPage() {
  const [isLocked, setIsLocked] = useState(dummyGame.is_locked);
  const [participants, setParticipants] = useState(dummyParticipants);

  const isAdmin = dummyGame.admin_id === currentUser.id;

  if (!isAdmin) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="card text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
            <p className="text-stone-600">You must be the game admin to view this page.</p>
          </div>
        </main>
      </>
    );
  }

  const handleToggleLock = () => {
    setIsLocked(!isLocked);
    alert(`Game ${!isLocked ? 'locked' : 'unlocked'} successfully!`);
  };

  const handleUpdatePaymentStatus = (participantId: string, newStatus: PaymentStatus) => {
    setParticipants(participants.map(p =>
      p.id === participantId ? { ...p, payment_status: newStatus } : p
    ));
    alert(`Payment status updated to ${newStatus}!`);
  };

  const verifiedCount = participants.filter(p => p.payment_status === 'verified').length;
  const pendingCount = participants.filter(p => p.payment_status === 'pending').length;
  const unpaidCount = participants.filter(p => p.payment_status === 'unpaid').length;
  const totalCollected = verifiedCount * dummyGame.entry_fee;

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-stone-600">{dummyGame.name}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <Users className="w-6 h-6 text-masters-green mb-2" />
            <div className="text-2xl font-bold">{participants.length}</div>
            <div className="text-sm text-stone-600">Total Participants</div>
          </div>
          <div className="card">
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <div className="text-2xl font-bold text-green-600">{verifiedCount}</div>
            <div className="text-sm text-stone-600">Verified Payments</div>
          </div>
          <div className="card">
            <Clock className="w-6 h-6 text-yellow-600 mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-stone-600">Pending Review</div>
          </div>
          <div className="card">
            <DollarSign className="w-6 h-6 text-masters-green mb-2" />
            <div className="text-2xl font-bold text-masters-green">${totalCollected}</div>
            <div className="text-sm text-stone-600">Collected</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Manage Participants</h2>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold">{participant.user?.display_name}</h3>
                        <p className="text-sm text-stone-500">{participant.user?.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm font-semibold ${
                        participant.payment_status === 'verified' ? 'bg-green-100 text-green-800' :
                        participant.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {participant.payment_status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-stone-600">Team Status:</span>
                      {participant.selections && participant.selections.length === 7 ? (
                        <span className="text-sm font-medium text-green-600">✓ Complete</span>
                      ) : (
                        <span className="text-sm font-medium text-red-600">Incomplete ({participant.selections?.length || 0}/7)</span>
                      )}
                    </div>

                    {!isLocked && (
                      <div className="mt-3 flex gap-2">
                        {participant.payment_status !== 'unpaid' && (
                          <button
                            onClick={() => handleUpdatePaymentStatus(participant.id, 'unpaid')}
                            className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition"
                          >
                            Mark Unpaid
                          </button>
                        )}
                        {participant.payment_status !== 'pending' && (
                          <button
                            onClick={() => handleUpdatePaymentStatus(participant.id, 'pending')}
                            className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded hover:bg-yellow-200 transition"
                          >
                            Mark Pending
                          </button>
                        )}
                        {participant.payment_status !== 'verified' && (
                          <button
                            onClick={() => handleUpdatePaymentStatus(participant.id, 'verified')}
                            className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded hover:bg-green-200 transition"
                          >
                            Verify Payment
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <div className="card">
                <h3 className="font-bold text-lg mb-4">Game Settings</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Game Status</span>
                      {isLocked ? (
                        <Lock className="w-5 h-5 text-red-600" />
                      ) : (
                        <Unlock className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-stone-600 mb-3">
                      {isLocked
                        ? 'Game is locked. Participants cannot make changes.'
                        : 'Game is open. Participants can edit their teams.'}
                    </p>
                    <button
                      onClick={handleToggleLock}
                      className={`w-full ${
                        isLocked
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      } text-white font-semibold py-2 px-4 rounded-lg transition`}
                    >
                      {isLocked ? 'Unlock Game' : 'Lock Game'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-bold text-lg mb-3">Entry Code</h3>
                <div className="text-center p-4 bg-masters-green/10 rounded-lg">
                  <div className="text-3xl font-bold text-masters-green tracking-wider">
                    {dummyGame.entry_code}
                  </div>
                  <p className="text-xs text-stone-600 mt-2">Share with new participants</p>
                </div>
              </div>

              <div className="card bg-blue-50 border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-2">Payment Info</h3>
                <p className="text-sm text-blue-800">
                  {dummyGame.payment_info || 'No payment instructions provided'}
                </p>
              </div>

              <div className="card">
                <h3 className="font-bold text-lg mb-3">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-600">Entry Fee:</span>
                    <span className="font-semibold">${dummyGame.entry_fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Potential Pool:</span>
                    <span className="font-semibold">${dummyGame.entry_fee * participants.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600">Uncollected:</span>
                    <span className="font-semibold text-red-600">
                      ${dummyGame.entry_fee * (participants.length - verifiedCount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
