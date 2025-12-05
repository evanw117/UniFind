"use client";

import { useState, useMemo, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { X, Search, Smartphone, Watch, BookOpen, Key, DollarSign, LocateFixed, Clock, Filter, Layers, Zap, ChevronDown, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

// --- CATEGORY & LOCATION OPTIONS ---
const CATEGORIES = [
    { id: 'electronics', name: 'Electronics', icon: Smartphone, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { id: 'accessories', name: 'Wearables/Watches', icon: Watch, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: 'books', name: 'Books & Stationery', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: 'keys', name: 'Keys & IDs', icon: Key, color: 'text-sky-600', bg: 'bg-sky-50' },
    { id: 'wallets', name: 'Wallets & Money', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: 'other', name: 'Miscellaneous', icon: Layers, color: 'text-slate-600', bg: 'bg-slate-50' },
];

const LOCATIONS = [
    'Canteen', 'Library', 'IT Center', 'Sports Hall', 'CR4'
];


interface LostItem {
    id: string;
    created_at: string;
    campus_slug: string;
    title: string;
    description: string;
    category: string;
    location: string;
    date_reported: string;
    status: boolean; // true = lost, false = found
    image_url: string | null;
}

interface Filters {
    category: string[];
    location: string;
    status: 'lost' | 'found';
    searchTerm: string;
}

const initialFilters: Filters = {
    category: [],
    location: 'all',
    status: 'lost',
    searchTerm: '',
};

// --- FILTER BAR COMPONENT ---
const TopFilterBar: React.FC<{ filters: Filters, setFilters: React.Dispatch<React.SetStateAction<Filters>> }> = ({ filters, setFilters }) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const categoryRef = useRef<HTMLDivElement>(null);

    const handleCategoryChange = (categoryId: string) => {
        setFilters(prev => ({
            ...prev,
            category: prev.category.includes(categoryId)
                ? prev.category.filter(id => id !== categoryId)
                : [...prev.category, categoryId]
        }));
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClearFilters = () => {
        setFilters(prev => ({ ...initialFilters, status: prev.status }));
    };

    const selectedCount = filters.category.length;

    return (
        <div className="sticky top-0 z-30 bg-white shadow-md p-4 rounded-xl mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center ring-1 ring-slate-200">
            
            {/* Search Bar */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search by title or description..."
                    value={filters.searchTerm}
                    onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                    className="w-full rounded-lg p-3 pl-10 pr-4 bg-slate-50 border border-slate-200 text-slate-700 focus:ring-2 focus:ring-[#F5B700] transition"
                />
            </div>

            {/* Lost / Found Buttons */}
            <div className="flex space-x-2">
                <button
                    onClick={() => setFilters(prev => ({ ...prev, status: 'lost' }))}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ring-1 ${
                        filters.status === 'lost'
                        ? 'bg-[#4B7C9B] text-white ring-[#4B7C9B]/50'
                        : 'bg-white text-slate-700 ring-slate-200'
                    }`}
                >
                    Lost
                </button>
                <button
                    onClick={() => setFilters(prev => ({ ...prev, status: 'found' }))}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold ring-1 ${
                        filters.status === 'found'
                        ? 'bg-[#F5B700] text-slate-900 ring-[#F5B700]/50'
                        : 'bg-white text-slate-700 ring-slate-200'
                    }`}
                >
                    Found
                </button>
            </div>

            {/* Category Filter */}
            <div className="relative" ref={categoryRef}>
                <button
                    onClick={() => setIsCategoryOpen(prev => !prev)}
                    className="w-full lg:w-40 flex items-center justify-between p-3 rounded-lg bg-white text-slate-700 ring-1 ring-slate-200"
                >
                    <Filter className="w-4 h-4 mr-2 text-[#4B7C9B]" />
                    {selectedCount > 0 ? `${selectedCount} Selected` : 'Category'}
                    <ChevronDown className={`w-4 h-4 transition ${isCategoryOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoryOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl p-4 ring-1 ring-slate-200">
                        {CATEGORIES.map(cat => (
                            <label key={cat.id} className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.category.includes(cat.id)}
                                    onChange={() => handleCategoryChange(cat.id)}
                                    className="form-checkbox text-[#4B7C9B]"
                                />
                                <cat.icon className={`w-4 h-4 ${cat.color}`} />
                                <span>{cat.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Location Filter */}
            <div className="relative">
                <LocateFixed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full lg:w-40 bg-white border border-slate-200 rounded-lg py-3 pl-8"
                >
                    <option value="all">All Locations</option>
                    {LOCATIONS.map(loc => <option key={loc}>{loc}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>

            {/* Clear Filters */}
            {(filters.category.length > 0 || filters.location !== 'all') && (
                <button
                    onClick={handleClearFilters}
                    className="p-3 rounded-lg bg-white text-red-500 ring-1 ring-slate-200"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};


// --- MAIN PAGE ---
export default function CampusLostItemsPage() {
    const params = useParams();
    const campusSlug = params.slug as string;

    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [items, setItems] = useState<LostItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch Supabase Data
    const fetchItems = async (slug: string) => {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabase
            .from('lost_and_found_items')
            .select('*')
            .eq('campus_slug', slug)
            .order('date_reported', { ascending: false });

        if (error) {
            setError(error.message);
            setItems([]);
        } else {
            setItems(data as LostItem[]);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        if (campusSlug) {
            fetchItems(campusSlug);
        }
    }, [campusSlug]);

    // Filter Logic
    const filteredItems = useMemo(() => {
        return items.filter(item => {
            const search = filters.searchTerm.toLowerCase();

            if (search) {
                if (!item.title.toLowerCase().includes(search) &&
                    !item.description.toLowerCase().includes(search)) return false;
            }

            if (filters.category.length > 0 && !filters.category.includes(item.category)) return false;

            if (filters.location !== 'all' && item.location !== filters.location) return false;

            if (filters.status === 'lost' && item.status !== true) return false;
            if (filters.status === 'found' && item.status !== false) return false;

            return true;
        })
        .sort((a, b) => new Date(b.date_reported).getTime() - new Date(a.date_reported).getTime());
    }, [filters, items]);

    const campusName = campusSlug === 'atu-galway' ? 'ATU Galway' :
                       campusSlug === 'nuig-galway' ? 'University of Galway' :
                       'Campus Lost & Found';

    const fallbackImage = 'https://placehold.co/200x120/E5E7EB/374151?text=No+Image';

    return (
        <div className="bg-[#F6FAFD] min-h-screen">
            <main className="max-w-7xl mx-auto p-4">

                {/* Title */}
                <header className="mb-8 relative">
                    <button onClick={() => window.history.back()} className="absolute left-0 p-2">
                        <ChevronLeft className="w-5 h-5 text-slate-500" />
                    </button>

                    <div className="text-center">
                        <h1 className="text-3xl font-extrabold text-slate-800">
                            Items {filters.status === 'lost' ? 'Reported Lost' : 'Found'} at 
                            <span className="text-[#4B7C9B]"> {campusName}</span>
                        </h1>
                        <p className="mt-2 text-slate-500">
                            {isLoading ? 'Loading items...' : `${filteredItems.length} items listed.`}
                            <Link href={`/campus/${campusSlug}/report`} className="ml-3 text-[#F5B700] font-semibold">
                                + Report New Item
                            </Link>
                        </p>
                    </div>
                </header>

                <TopFilterBar filters={filters} setFilters={setFilters} />

                {/* Error */}
                {error && (
                    <div className="py-16 text-center text-red-500 bg-red-50 rounded-xl">
                        <Zap className="w-10 h-10 mx-auto mb-4" />
                        <p className="text-xl font-medium">Database Error</p>
                        <p className="mt-2">{error}</p>
                    </div>
                )}

                {/* Loading */}
                {isLoading && !error && (
                    <div className="py-16 text-center bg-white rounded-xl shadow">
                        <Layers className="w-10 h-10 mx-auto mb-4 animate-bounce text-[#80AFC3]" />
                        <p className="text-xl font-medium">Loading items...</p>
                    </div>
                )}

                {/* Items Grid */}
                {!isLoading && !error && (
                    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredItems.map(item => {
                            const category = CATEGORIES.find(c => c.id === item.category);
                            const isLost = item.status === true;

                            return (
                                <article key={item.id} className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden flex">
                                    
                                    {/* Image */}
                                    <div className="w-1/3 h-40 bg-slate-100 relative">
                                        <img 
                                            src={item.image_url || fallbackImage}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.currentTarget.src = fallbackImage }}
                                        />
                                        <div className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold text-white ${
                                            isLost ? 'bg-red-600' : 'bg-emerald-600'
                                        }`}>
                                            {isLost ? 'MISSING' : 'FOUND'}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 flex-1">
                                        <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>

                                        <div className="flex items-center text-sm text-slate-600 mb-1">
                                            <LocateFixed className="w-4 h-4 mr-1" />
                                            {item.location}
                                        </div>

                                        <div className="flex items-center text-sm text-slate-600 mb-3">
                                            {category && <category.icon className={`w-4 h-4 ${category.color} mr-1`} />}
                                            {category?.name || 'Other'}
                                        </div>

                                        <div className="flex justify-between items-center border-t pt-2 text-xs text-slate-500">
                                            <span className="flex items-center">
                                                <Clock className="w-3 h-3 mr-1" />
                                                Reported {new Date(item.date_reported).toLocaleDateString()}
                                            </span>

                                            <button className={`px-4 py-1 rounded-full text-sm font-semibold ${
                                                isLost ? 'bg-[#4B7C9B] text-white' : 'bg-[#F5B700] text-slate-900'
                                            }`}>
                                                {isLost ? 'I Found This' : 'Claim Item'}
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}

                        {/* No Results */}
                        {filteredItems.length === 0 && (
                            <div className="col-span-full py-16 text-center bg-white rounded-xl shadow text-slate-600">
                                <Search className="w-10 h-10 mx-auto mb-4 text-[#80AFC3]" />
                                <p className="text-xl font-medium">No items found</p>
                            </div>
                        )}
                    </section>
                )}
            </main>
        </div>
    );
}
