import React, { useState, useEffect } from 'react';
import { Database, ChevronDown, Search } from 'lucide-react';
import MagneticMorphingNav from '../components/MagneticMorphingNav';
import StorageView from '../components/StorageView';

const DataPage = ({ navigateOnly, user }) => {
    const navTabs = [
        { id: 'home', label: 'For you', icon: <ChevronDown size={14} fill="currentColor" /> },
        { id: 'todos', label: 'Todo' },
        { id: 'calendar', label: 'Calendar' },
        { id: 'data', label: 'Data' }
    ];

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Handle hash-based search
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                const query = decodeURIComponent(hash.substring(1));
                setSearchQuery(query);
            } else {
                setSearchQuery('');
            }
        };
        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    return (
        <div className="feed-page min-h-screen bg-background relative pb-20">
            <div className="content-overlay content-area pt-24 px-4 md:px-6">
                {/* Compact Header */}
                <div className="max-w-[1400px] mx-auto mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground mb-1">Data Storage</h1>
                            <p className="text-sm text-muted-foreground">View and manage your saved agent outputs</p>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="text"
                                placeholder="Search items..."
                                value={searchQuery}
                                onChange={(e) => {
                                    const newVal = e.target.value;
                                    setSearchQuery(newVal);
                                    if (newVal) {
                                        window.history.replaceState(null, null, `#${encodeURIComponent(newVal)}`);
                                    } else {
                                        window.history.replaceState(null, null, window.location.pathname);
                                    }
                                }}
                                className="w-full bg-secondary/50 border border-border rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                <div className="sticky-nav-container mb-8 flex justify-center">
                    <MagneticMorphingNav
                        activeTab="data"
                        onTabChange={navigateOnly}
                        tabs={navTabs}
                        user={user}
                    />
                </div>

                <StorageView searchQuery={searchQuery} />
            </div>
        </div>
    );
};

export default DataPage;
