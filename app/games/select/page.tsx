'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import GolferCard from '@/components/GolferCard';
import BucketCounter from '@/components/BucketCounter';
import { allGolfers, dummyParticipants, currentUser, top10Golfers, mid40Golfers, fieldGolfers } from '@/lib/dummy-data';
import { Golfer } from '@/types/database';
import { validateSelection, getGolferBucket } from '@/lib/utils';
import { Search, Filter } from 'lucide-react';

export default function SelectGolfersPage() {
  const router = useRouter();
  const myParticipation = dummyParticipants.find(p => p.user_id === currentUser.id);
  const existingSelections = myParticipation?.selections?.map(s => s.golfer!) || [];

  const [selectedGolfers, setSelectedGolfers] = useState<Golfer[]>(existingSelections);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBucket, setFilterBucket] = useState<'all' | 'top10' | 'mid40' | 'field'>('all');

  const toggleGolfer = (golfer: Golfer) => {
    if (selectedGolfers.find(g => g.id === golfer.id)) {
      setSelectedGolfers(selectedGolfers.filter(g => g.id !== golfer.id));
    } else {
      if (selectedGolfers.length < 7) {
        setSelectedGolfers([...selectedGolfers, golfer]);
      }
    }
  };

  const validation = validateSelection(selectedGolfers);

  const handleSubmit = () => {
    if (validation.valid) {
      alert('Team saved successfully!');
      router.push('/dashboard');
    }
  };

  const filteredGolfers = allGolfers.filter(golfer => {
    const matchesSearch = golfer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const bucket = getGolferBucket(golfer.current_rank);
    const matchesBucket = filterBucket === 'all' || bucket === filterBucket;
    return matchesSearch && matchesBucket;
  });

  const getBucketGolfers = (bucket: 'top10' | 'mid40' | 'field') => {
    const golfers = bucket === 'top10' ? top10Golfers : bucket === 'mid40' ? mid40Golfers : fieldGolfers;
    return golfers.filter(g => g.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Select Your Team</h1>
          <p className="text-stone-600">
            Choose 7 golfers: 2 from Top 10, 3 from Ranks 11-50, and 2 from the Field
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="card mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                      type="text"
                      placeholder="Search golfers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="input pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterBucket('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filterBucket === 'all' ? 'bg-masters-green text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterBucket('top10')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filterBucket === 'top10' ? 'bg-yellow-500 text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    Top 10
                  </button>
                  <button
                    onClick={() => setFilterBucket('mid40')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filterBucket === 'mid40' ? 'bg-blue-500 text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    11-50
                  </button>
                  <button
                    onClick={() => setFilterBucket('field')}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      filterBucket === 'field' ? 'bg-green-500 text-white' : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    Field
                  </button>
                </div>
              </div>
            </div>

            {filterBucket === 'all' ? (
              <>
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-yellow-500 rounded"></span>
                    Top 10
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getBucketGolfers('top10').map(golfer => (
                      <GolferCard
                        key={golfer.id}
                        golfer={golfer}
                        isSelected={!!selectedGolfers.find(g => g.id === golfer.id)}
                        onSelect={() => toggleGolfer(golfer)}
                        showBucket={false}
                      />
                    ))}
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-blue-500 rounded"></span>
                    Ranks 11-50
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getBucketGolfers('mid40').map(golfer => (
                      <GolferCard
                        key={golfer.id}
                        golfer={golfer}
                        isSelected={!!selectedGolfers.find(g => g.id === golfer.id)}
                        onSelect={() => toggleGolfer(golfer)}
                        showBucket={false}
                      />
                    ))}
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="w-2 h-8 bg-green-500 rounded"></span>
                    Field (51+)
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {getBucketGolfers('field').map(golfer => (
                      <GolferCard
                        key={golfer.id}
                        golfer={golfer}
                        isSelected={!!selectedGolfers.find(g => g.id === golfer.id)}
                        onSelect={() => toggleGolfer(golfer)}
                        showBucket={false}
                      />
                    ))}
                  </div>
                </section>
              </>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredGolfers.map(golfer => (
                  <GolferCard
                    key={golfer.id}
                    golfer={golfer}
                    isSelected={!!selectedGolfers.find(g => g.id === golfer.id)}
                    onSelect={() => toggleGolfer(golfer)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              <BucketCounter counts={validation.counts} />

              {selectedGolfers.length > 0 && (
                <div className="card">
                  <h3 className="font-bold text-lg mb-3">Your Team</h3>
                  <div className="space-y-2">
                    {selectedGolfers.map(golfer => (
                      <div
                        key={golfer.id}
                        className="flex items-center justify-between p-2 bg-stone-50 rounded"
                      >
                        <span className="text-sm font-medium">{golfer.name}</span>
                        <button
                          onClick={() => toggleGolfer(golfer)}
                          className="text-red-600 hover:text-red-800 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {validation.errors.length > 0 && (
                <div className="card bg-red-50 border border-red-200">
                  <h3 className="font-bold text-red-800 mb-2">Validation Errors</h3>
                  <ul className="space-y-1">
                    {validation.errors.map((error, i) => (
                      <li key={i} className="text-sm text-red-700">• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleSubmit}
                  disabled={!validation.valid}
                  className="btn-primary"
                >
                  Save Team
                </button>
                <button
                  onClick={() => router.back()}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
