import React, { useState, useEffect, useRef } from 'react';
import { 
    Folder, FileText, Image as ImageIcon, Search as SearchIcon, 
    Mail, BookOpen, Lightbulb, File, Download, Trash2, Eye, X,
    GitBranch, Loader2, CheckSquare, Square, BarChart3
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import mermaid from 'mermaid';

const StorageView = ({ searchQuery }) => {
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [viewingItem, setViewingItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isBulkMode, setIsBulkMode] = useState(false);

    const folders = [
        { id: 'flowcharts', label: 'Flowcharts', icon: GitBranch, color: 'text-blue-500' },
        { id: 'images', label: 'Images', icon: ImageIcon, color: 'text-purple-500' },
        { id: 'plots', label: 'Charts & Plots', icon: BarChart3, color: 'text-emerald-500' },
        { id: 'research', label: 'Research', icon: SearchIcon, color: 'text-indigo-500' },
        { id: 'documents', label: 'Documents', icon: FileText, color: 'text-green-500' },
        { id: 'case_studies', label: 'Case Studies', icon: BookOpen, color: 'text-pink-500' },
        { id: 'brainstorm', label: 'Brainstorm', icon: Lightbulb, color: 'text-yellow-500' },
        { id: 'summaries', label: 'Summaries', icon: FileText, color: 'text-cyan-500' },
        { id: 'emails', label: 'Emails', icon: Mail, color: 'text-orange-500' },
    ];

    useEffect(() => {
        if (selectedFolder) {
            fetchItems(selectedFolder);
        }
    }, [selectedFolder]);

    useEffect(() => {
        if (searchQuery && selectedFolder) {
            // Filter items by search query
            const filtered = items.filter(item => 
                item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase())
            );
            // This will be handled in render
        }
    }, [searchQuery]);

    const fetchItems = async (folderType) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5001/api/storage?folder=${folderType}`);
            const data = await response.json();
            setItems(data.items || []);
        } catch (error) {
            console.error('Error fetching items:', error);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (item) => {
        setItemToDelete(item);
        setShowDeleteConfirm(true);
    };

    const handleBulkDeleteClick = () => {
        if (selectedItems.size === 0) return;
        setItemToDelete({ title: `${selectedItems.size} items`, isBulk: true });
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;
        
        try {
            if (itemToDelete.isBulk) {
                // Bulk delete
                const deletePromises = Array.from(selectedItems).map(itemId => {
                    const item = items.find(i => i.id === itemId);
                    if (!item) return Promise.resolve();
                    return fetch(`http://localhost:5001/api/storage/${item.type}/${item.id}`, {
                        method: 'DELETE'
                    });
                });
                
                await Promise.all(deletePromises);
                setItems(items.filter(i => !selectedItems.has(i.id)));
                setSelectedItems(new Set());
                setIsBulkMode(false);
            } else {
                // Single delete
                const response = await fetch(`http://localhost:5001/api/storage/${itemToDelete.type}/${itemToDelete.id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setItems(items.filter(i => i.id !== itemToDelete.id));
                    setSelectedItems(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(itemToDelete.id);
                        return newSet;
                    });
                }
            }
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item(s)');
        } finally {
            setShowDeleteConfirm(false);
            setItemToDelete(null);
        }
    };

    const toggleItemSelection = (itemId) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(itemId)) {
                newSet.delete(itemId);
            } else {
                newSet.add(itemId);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedItems.size === filteredItems.length) {
            setSelectedItems(new Set());
        } else {
            setSelectedItems(new Set(filteredItems.map(item => item.id)));
        }
    };

    const handleDownload = (item) => {
        if (item.type === 'flowcharts' && item.mermaid_code) {
            // Download flowchart as SVG/PNG
            downloadFlowchart(item.mermaid_code || item.preview, item.title);
        } else if (item.url) {
            const link = document.createElement('a');
            link.href = `http://localhost:5001${item.url}`;
            link.download = item.filename || item.title;
            link.click();
        }
    };

    const downloadFlowchart = async (mermaidCode, title) => {
        try {
            // Initialize mermaid if needed
            if (!window.mermaidInitialized) {
                mermaid.initialize({ 
                    startOnLoad: false,
                    theme: 'default',
                    securityLevel: 'loose',
                    flowchart: {
                        useMaxWidth: true,
                        htmlLabels: true
                    }
                });
                window.mermaidInitialized = true;
            }

            const uniqueId = `mermaid-download-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const { svg } = await mermaid.render(uniqueId, mermaidCode);
            
            // Convert SVG to PNG
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svg, 'image/svg+xml');
            const svgElement = svgDoc.querySelector('svg');
            
            if (!svgElement) {
                // Fallback to SVG download
                const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${title || 'flowchart'}.svg`;
                link.click();
                URL.revokeObjectURL(url);
                return;
            }

            const width = parseInt(svgElement.getAttribute('width')) || 1200;
            const height = parseInt(svgElement.getAttribute('height')) || 800;
            
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const padding = 40;
            canvas.width = width + padding * 2;
            canvas.height = height + padding * 2;
            
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const img = new Image();
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
            
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                try {
                    ctx.drawImage(img, padding, padding, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const downloadUrl = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = downloadUrl;
                            link.download = `${title || 'flowchart'}.png`;
                            link.click();
                            URL.revokeObjectURL(downloadUrl);
                        }
                    }, 'image/png', 1.0);
                } catch (e) {
                    // Fallback to SVG
                    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(svgBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${title || 'flowchart'}.svg`;
                    link.click();
                    URL.revokeObjectURL(url);
                }
            };
            
            img.onerror = () => {
                // Fallback to SVG
                const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${title || 'flowchart'}.svg`;
                link.click();
                URL.revokeObjectURL(url);
            };
            
            img.src = svgDataUrl;
        } catch (error) {
            console.error('Error downloading flowchart:', error);
            alert('Failed to download flowchart');
        }
    };

    const handleView = (item) => {
        setViewingItem(item);
        setIsModalOpen(true);
    };

    const getFolderIcon = (folderId) => {
        const folder = folders.find(f => f.id === folderId);
        return folder ? folder.icon : Folder;
    };

    const getFolderColor = (folderId) => {
        const folder = folders.find(f => f.id === folderId);
        return folder ? folder.color : 'text-gray-500';
    };

    const filteredItems = searchQuery 
        ? items.filter(item => 
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : items;

    if (!selectedFolder) {
        return (
            <div className="w-full max-w-[1400px] mx-auto p-6">
                <h2 className="text-xl font-semibold mb-6 px-2">Storage Folders</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                    {folders.map((folder) => {
                        const Icon = folder.icon;
                        return (
                            <button
                                key={folder.id}
                                onClick={() => setSelectedFolder(folder.id)}
                                className="group p-6 bg-card hover:bg-secondary/50 border border-border rounded-xl transition-all text-left"
                            >
                                <div className="flex flex-col items-center gap-3">
                                    <div className={`p-4 rounded-xl bg-secondary/30 group-hover:bg-secondary/50 transition-colors ${folder.color}`}>
                                        <Icon size={32} />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-medium text-foreground">{folder.label}</div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full max-w-[1400px] mx-auto p-6">
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => {
                            setSelectedFolder(null);
                            setSelectedItems(new Set());
                            setIsBulkMode(false);
                        }}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Folder size={18} />
                        <span>Back to Folders</span>
                    </button>
                    <h2 className="text-xl font-semibold px-2">
                        {folders.find(f => f.id === selectedFolder)?.label || 'Items'}
                    </h2>
                    <div className="flex items-center gap-2">
                        {isBulkMode ? (
                            <>
                                <span className="text-sm text-muted-foreground">
                                    {selectedItems.size} selected
                                </span>
                                {selectedItems.size > 0 && (
                                    <button
                                        onClick={handleBulkDeleteClick}
                                        className="px-3 py-1.5 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Trash2 size={16} />
                                        Delete Selected
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setIsBulkMode(false);
                                        setSelectedItems(new Set());
                                    }}
                                    className="px-3 py-1.5 bg-secondary hover:bg-muted rounded-lg text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsBulkMode(true)}
                                className="px-3 py-1.5 bg-secondary hover:bg-muted rounded-lg text-sm transition-colors flex items-center gap-2"
                            >
                                <CheckSquare size={16} />
                                Select
                            </button>
                        )}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 size={32} className="animate-spin text-primary" />
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="flex flex-col justify-center items-center h-64 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
                        <File size={48} className="mb-4 opacity-20" />
                        <p>No items found</p>
                    </div>
                ) : (
                    <>
                        {isBulkMode && filteredItems.length > 0 && (
                            <div className="mb-4 flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-border">
                                <button
                                    onClick={toggleSelectAll}
                                    className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors"
                                >
                                    {selectedItems.size === filteredItems.length ? (
                                        <CheckSquare size={18} className="text-primary" />
                                    ) : (
                                        <Square size={18} />
                                    )}
                                    <span>Select All</span>
                                </button>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredItems.map((item) => {
                                const Icon = getFolderIcon(item.type);
                                const color = getFolderColor(item.type);
                                const isSelected = selectedItems.has(item.id);
                                
                                return (
                                    <div
                                        key={item.id}
                                        className={`group relative bg-card hover:bg-secondary/40 border rounded-xl p-4 transition-all ${
                                            isSelected 
                                                ? 'border-primary bg-primary/5' 
                                                : 'border-border/50 hover:border-border'
                                        }`}
                                    >
                                        {isBulkMode && (
                                            <div className="absolute top-2 left-2 z-10">
                                                <button
                                                    onClick={() => toggleItemSelection(item.id)}
                                                    className="p-1.5 bg-background/90 rounded-full hover:bg-background shadow-sm"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare size={16} className="text-primary" />
                                                    ) : (
                                                        <Square size={16} className="text-muted-foreground" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                        <div className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ${isBulkMode ? 'opacity-100' : ''}`}>
                                            {(item.url || item.type === 'flowcharts') && (
                                                <button
                                                    onClick={() => handleDownload(item)}
                                                    className="p-1.5 bg-background/80 rounded-full hover:bg-background hover:text-primary shadow-sm"
                                                    title="Download"
                                                >
                                                    <Download size={14} />
                                                </button>
                                            )}
                                            {!isBulkMode && (
                                                <>
                                                    <button
                                                        onClick={() => handleView(item)}
                                                        className="p-1.5 bg-background/80 rounded-full hover:bg-background hover:text-primary shadow-sm"
                                                        title="View"
                                                    >
                                                        <Eye size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(item)}
                                                        className="p-1.5 bg-background/80 rounded-full hover:bg-background hover:text-destructive shadow-sm"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                    <div className="flex items-start gap-3">
                                        <div className={`p-3 rounded-lg bg-secondary/30 ${color}`}>
                                            <Icon size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-foreground truncate" title={item.title}>
                                                {item.title}
                                            </h3>
                                            {item.description && (
                                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                            {item.created_at && (
                                                <p className="text-[10px] text-muted-foreground mt-2">
                                                    {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    </>
                )}
            </div>

            {/* View Modal */}
            {isModalOpen && viewingItem && (
                <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-background rounded-2xl border border-border max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
                            <h3 className="text-lg font-semibold text-foreground">{viewingItem.title}</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-6">
                            {viewingItem.type === 'flowcharts' && (viewingItem.mermaid_code || viewingItem.preview) && (
                                <div className="w-full overflow-auto min-h-full">
                                    <FlowchartViewer 
                                        mermaidCode={viewingItem.mermaid_code || viewingItem.preview}
                                        title={viewingItem.title}
                                    />
                                </div>
                            )}
                            {viewingItem.type === 'images' && viewingItem.url && (
                                <img 
                                    src={`http://localhost:5001${viewingItem.url}`} 
                                    alt={viewingItem.title}
                                    className="w-full h-auto rounded-lg max-w-full"
                                />
                            )}
                            {viewingItem.type === 'research' && (viewingItem.summary || viewingItem.preview) && (
                                <ResearchViewer 
                                    summary={viewingItem.summary || viewingItem.preview || ''}
                                    sources={viewingItem.sources || []}
                                    query={viewingItem.query || ''}
                                    isPreview={!viewingItem.summary || (viewingItem.summary && viewingItem.summary.length <= 200)}
                                />
                            )}
                            {viewingItem.type === 'case_studies' && (viewingItem.document || viewingItem.preview) && (
                                <CaseStudyViewer 
                                    document={viewingItem.document || viewingItem.preview || ''}
                                    isPreview={!viewingItem.document || (viewingItem.document && viewingItem.document.length <= 200)}
                                />
                            )}
                            {viewingItem.type === 'summaries' && (viewingItem.summary || viewingItem.preview) && (
                                <SummaryViewer 
                                    summary={viewingItem.summary || viewingItem.preview || ''}
                                    originalFilename={viewingItem.original_filename}
                                    isPreview={!viewingItem.summary || (viewingItem.summary && viewingItem.summary.length <= 200)}
                                />
                            )}
                            {viewingItem.type !== 'flowcharts' && viewingItem.type !== 'images' && viewingItem.type !== 'research' && viewingItem.type !== 'case_studies' && viewingItem.type !== 'summaries' && viewingItem.preview && (
                                <div className="whitespace-pre-wrap text-foreground/90 bg-secondary/30 p-4 rounded-lg">
                                    {viewingItem.preview}
                                </div>
                            )}
                        </div>
                        {viewingItem.type === 'flowcharts' && (
                            <div className="sticky bottom-0 bg-background border-t border-border p-4 flex justify-end">
                                <button
                                    onClick={() => handleDownload(viewingItem)}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                                >
                                    <Download size={16} />
                                    Download PNG
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && itemToDelete && (
                <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-background rounded-2xl border border-border max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-destructive/10 rounded-lg">
                                <Trash2 size={24} className="text-destructive" />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground">Confirm Deletion</h3>
                        </div>
                        <p className="text-muted-foreground mb-6">
                            {itemToDelete.isBulk 
                                ? `Are you sure you want to delete ${itemToDelete.title}? This action cannot be undone.`
                                : `Are you sure you want to delete "${itemToDelete.title}"? This action cannot be undone.`
                            }
                        </p>
                        <div className="flex items-center justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false);
                                    setItemToDelete(null);
                                }}
                                className="px-4 py-2 bg-secondary hover:bg-muted rounded-lg text-foreground transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-lg transition-colors font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Markdown to HTML converter (same as in FastMode)
const markdownToHtml = (markdown) => {
    if (!markdown) return '';
    
    let html = markdown;
    
    // Remove any file references that might be embedded
    html = html.replace(/\b\w+_result\.(md|txt)\b/gi, '');
    html = html.replace(/\bresearch_result\.md\b/gi, '');
    html = html.replace(/\bdocument\.md\b/gi, '');
    html = html.replace(/\bcase_study\.md\b/gi, '');
    
    // Process tables first
    const tableRegex = /(\|.+\|\s*\n\|[:\s\-|]+\|\s*\n(?:\|.+\|\s*\n?)+)/g;
    html = html.replace(tableRegex, (match) => {
        const lines = match.trim().split('\n').filter(line => line.trim());
        if (lines.length < 2) return match;
        
        const headerRow = lines[0];
        const separatorRow = lines[1];
        const dataRows = lines.slice(2);
        
        const headers = headerRow.split('|')
            .map(cell => cell.trim())
            .filter(cell => cell && !cell.match(/^[\s\-:]+$/));
        
        if (headers.length === 0) return match;
        
        let tableHtml = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-border">';
        
        tableHtml += '<thead><tr class="bg-secondary/50">';
        headers.forEach(header => {
            tableHtml += `<th class="border border-border px-4 py-2 text-left font-semibold text-foreground">${header}</th>`;
        });
        tableHtml += '</tr></thead>';
        
        if (dataRows.length > 0) {
            tableHtml += '<tbody>';
            dataRows.forEach(row => {
                const cells = row.split('|')
                    .map(cell => cell.trim())
                    .filter(cell => cell && !cell.match(/^[\s\-:]+$/));
                
                if (cells.length > 0) {
                    tableHtml += '<tr class="hover:bg-secondary/30">';
                    for (let i = 0; i < headers.length; i++) {
                        const cellContent = cells[i] || '';
                        tableHtml += `<td class="border border-border px-4 py-2 text-foreground/90">${cellContent}</td>`;
                    }
                    tableHtml += '</tr>';
                }
            });
            tableHtml += '</tbody>';
        }
        tableHtml += '</table></div>';
        
        return tableHtml;
    });
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2 text-foreground">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3 text-foreground">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4 text-foreground">$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">$1</a>');
    
    // Images - handle before other processing
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
        // Handle relative URLs by prepending the backend URL
        const imageUrl = url.startsWith('http') ? url : `http://localhost:5001${url}`;
        return `<img src="${imageUrl}" alt="${alt || ''}" class="max-w-full h-auto rounded-lg my-4 border border-border" />`;
    });
    
    // Mermaid code blocks - extract and render
    html = html.replace(/```mermaid\n([\s\S]*?)```/g, (match, mermaidCode) => {
        const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        // Store the code in a data attribute and display it in a pre tag
        const code = mermaidCode.trim();
        // Escape HTML entities in the code for display, but keep it in data attribute for rendering
        const escapedForDisplay = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<div class="mermaid-container my-4" data-mermaid-code="${code.replace(/"/g, '&quot;')}"><pre class="mermaid bg-secondary/30 p-4 rounded-lg border border-border overflow-x-auto">${escapedForDisplay}</pre></div>`;
    });
    
    // Bullet points
    html = html.replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">$1</li>');
    html = html.replace(/(<li.*<\/li>)/s, '<ul class="list-disc ml-6 mb-3 space-y-1">$1</ul>');
    
    // Numbered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1">$1</li>');
    
    // Paragraphs
    html = html.split('\n').map(line => {
        const trimmed = line.trim();
        if (!trimmed || 
            line.match(/^<[hult]/) || 
            line.match(/^<\/[hult]/) || 
            line.match(/^<li/) ||
            line.match(/^<table/) ||
            line.match(/^<\/table/) ||
            line.match(/^<thead/) ||
            line.match(/^<\/thead/) ||
            line.match(/^<tbody/) ||
            line.match(/^<\/tbody/) ||
            line.match(/^<tr/) ||
            line.match(/^<\/tr/) ||
            line.match(/^<th/) ||
            line.match(/^<\/th/) ||
            line.match(/^<td/) ||
            line.match(/^<\/td/) ||
            line.match(/^\|.*\|$/)
        ) {
            return line;
        }
        return `<p class="mb-3 leading-relaxed">${line}</p>`;
    }).join('\n');
    
    html = html.replace(/(<\/p>\s*)+/g, '</p>');
    
    return html;
};

const ResearchViewer = ({ summary, sources, query, isPreview = false }) => {
    const renderedContent = markdownToHtml(summary || '');
    
    return (
        <div className="space-y-4 w-full">
            {query && (
                <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Query</div>
                    <p className="text-sm text-foreground/90">{query}</p>
                </div>
            )}
            {isPreview && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        ⚠️ This is a preview. The full research content may not be available for older items.
                    </p>
                </div>
            )}
            <div 
                className="max-w-none text-foreground/90 bg-secondary/30 p-6 rounded-lg w-full"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
                style={{
                    lineHeight: '1.7',
                    color: 'inherit',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}
            />
            {sources && sources.length > 0 && (
                <div className="mt-6 p-4 bg-secondary/30 rounded-lg border border-border w-full">
                    <div className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">References</div>
                    <div className="space-y-2">
                        {sources.map((source, idx) => {
                            const sourceUrl = typeof source === 'string' ? source : source.url || source;
                            const sourceTitle = typeof source === 'object' ? source.title || sourceUrl : sourceUrl;
                            return (
                                <div key={idx} className="text-sm text-foreground/80 flex items-start gap-2">
                                    <span className="text-muted-foreground font-medium">{idx + 1}.</span>
                                    <a 
                                        href={sourceUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-500 hover:underline break-all"
                                    >
                                        {sourceTitle}
                                    </a>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const CaseStudyViewer = ({ document, isPreview = false }) => {
    const contentRef = useRef(null);
    const renderedContent = markdownToHtml(document || '');
    
    // Render mermaid diagrams
    useEffect(() => {
        if (!contentRef.current) return;
        
        const mermaidContainers = contentRef.current.querySelectorAll('.mermaid-container');
        
        mermaidContainers.forEach(async (container) => {
            const mermaidCode = container.getAttribute('data-mermaid-code');
            if (!mermaidCode) return;
            
            if (container.querySelector('.mermaid-rendered')) return;
            
            try {
                if (!window.mermaidInitialized) {
                    mermaid.initialize({ 
                        startOnLoad: false,
                        theme: 'default',
                        securityLevel: 'loose',
                        flowchart: {
                            useMaxWidth: true,
                            htmlLabels: true
                        }
                    });
                    window.mermaidInitialized = true;
                }
                
                const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(uniqueId, mermaidCode);
                
                const svgDiv = document.createElement('div');
                svgDiv.innerHTML = svg;
                svgDiv.className = 'mermaid-rendered bg-white rounded-lg p-4 border border-border overflow-auto my-4';
                container.innerHTML = '';
                container.appendChild(svgDiv);
            } catch (error) {
                console.error('Error rendering mermaid:', error);
            }
        });
    }, [renderedContent]);
    
    return (
        <div className="space-y-4 w-full">
            {isPreview && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        ⚠️ This is a preview. The full case study content may not be available for older items.
                    </p>
                </div>
            )}
            <div 
                ref={contentRef}
                className="max-w-none text-foreground/90 bg-secondary/30 p-6 rounded-lg w-full"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
                style={{
                    lineHeight: '1.7',
                    color: 'inherit',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}
            />
        </div>
    );
};

const SummaryViewer = ({ summary, originalFilename, isPreview = false }) => {
    const renderedContent = markdownToHtml(summary || '');
    
    return (
        <div className="space-y-4 w-full">
            {originalFilename && (
                <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                    <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Original File</div>
                    <p className="text-sm text-foreground/90">{originalFilename}</p>
                </div>
            )}
            {isPreview && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                        ⚠️ This is a preview. The full summary content may not be available for older items.
                    </p>
                </div>
            )}
            <div 
                className="max-w-none text-foreground/90 bg-secondary/30 p-6 rounded-lg w-full"
                dangerouslySetInnerHTML={{ __html: renderedContent }}
                style={{
                    lineHeight: '1.7',
                    color: 'inherit',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}
            />
        </div>
    );
};

const FlowchartViewer = ({ mermaidCode, title }) => {
    const containerRef = React.useRef(null);
    const [svgContent, setSvgContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        const renderFlowchart = async () => {
            try {
                setLoading(true);
                
                // Initialize mermaid if not already done
                if (!window.mermaidInitialized) {
                    mermaid.initialize({ 
                        startOnLoad: false,
                        theme: 'default',
                        securityLevel: 'loose',
                        flowchart: {
                            useMaxWidth: true,
                            htmlLabels: true
                        }
                    });
                    window.mermaidInitialized = true;
                }
                
                if (!mermaidCode || !isMounted) return;
                
                const uniqueId = `mermaid-viewer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(uniqueId, mermaidCode);
                
                if (isMounted) {
                    setSvgContent(svg);
                }
            } catch (error) {
                console.error('Error rendering flowchart:', error);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        
        renderFlowchart();
        
        return () => {
            isMounted = false;
        };
    }, [mermaidCode]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    if (!svgContent) {
        return null;
    }

    return (
        <div 
            ref={containerRef}
            className="bg-white rounded-lg p-6 overflow-auto"
            style={{ 
                minWidth: '100%', 
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start'
            }}
        >
            <div 
                dangerouslySetInnerHTML={{ __html: svgContent }}
                style={{ 
                    display: 'inline-block',
                    maxWidth: '100%',
                    height: 'auto'
                }}
            />
        </div>
    );
};

export default StorageView;

