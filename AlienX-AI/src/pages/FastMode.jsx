import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Paperclip, ArrowUp, ChevronDown, Check, Loader2, Maximize2, Download, X, FileText, BookOpen, Search as SearchIcon, File, Eye, LogIn, Image as ImageIcon, Mail, Send, Edit2, Save, Upload, Calendar, Clock, MapPin, MessageSquare, AlertCircle } from 'lucide-react';
import MagneticMorphingNav from '../components/MagneticMorphingNav';
import DesignedAtSymbol from '../components/DesignedAtSymbol';
import mermaid from 'mermaid';

const FlowchartRenderer = ({ flowchart, index, mermaidInitialized, onModalToggle }) => {
    const containerRef = useRef(null);
    const [svgContent, setSvgContent] = useState(null);
    const [error, setError] = useState(null);
    const [isRendering, setIsRendering] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleModalOpen = () => {
        setIsModalOpen(true);
        if (onModalToggle) onModalToggle(true);
    };
    
    const handleModalClose = () => {
        setIsModalOpen(false);
        if (onModalToggle) onModalToggle(false);
    };

    useEffect(() => {
        let isMounted = true;

        const renderDiagram = async () => {
            try {
                setIsRendering(true);
                setError(null);
                
                // Use the flowchart code EXACTLY as received - no cleaning at all
                const codeToRender = flowchart.trim();
                
                const uniqueId = `mermaid-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                
                console.log(`[FlowchartRenderer] Rendering diagram ${index}, code length: ${codeToRender.length}`);
                
                // Suppress Mermaid's error output
                const originalError = console.error;
                console.error = (...args) => {
                    const msg = args.join(' ');
                    if (msg.includes('Syntax error') || msg.includes('mermaid')) {
                        return; // Suppress
                    }
                    originalError.apply(console, args);
                };
                
                try {
                    // Mermaid should already be initialized by TaskTimeline, but ensure it anyway
                    if (mermaidInitialized && !mermaidInitialized.current) {
                        mermaid.initialize({ 
                            startOnLoad: false,
                            theme: 'default',
                            securityLevel: 'loose',
                            flowchart: {
                                useMaxWidth: true,
                                htmlLabels: true,
                                curve: 'basis'
                            },
                            logLevel: 'error'
                        });
                        if (mermaidInitialized) mermaidInitialized.current = true;
                    }
                    
                    const { svg } = await mermaid.render(uniqueId, codeToRender);
                    
                    console.log(`[FlowchartRenderer] Successfully rendered SVG, length: ${svg.length}`);
                    
                    if (isMounted) {
                        setSvgContent(svg);
                        setIsRendering(false);
                    }
                } catch (renderError) {
                    console.error(`[FlowchartRenderer] Mermaid render error:`, renderError);
                    if (isMounted) {
                        setError(renderError.message || renderError.toString());
                        setIsRendering(false);
                    }
                } finally {
                    console.error = originalError;
                }
            } catch (e) {
                console.error(`[FlowchartRenderer] Error:`, e);
                if (isMounted) {
                    setError(e.message || e.toString());
                    setIsRendering(false);
                }
            }
        };

        renderDiagram();
        
        return () => {
            isMounted = false;
        };
    }, [flowchart, index, mermaidInitialized]);

    const downloadAsPNG = async () => {
        if (!svgContent || !containerRef.current) return;
        
        try {
            // Extract SVG element from the content
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
            const svgElement = svgDoc.querySelector('svg');
            
            if (!svgElement) {
                throw new Error('No SVG element found');
            }
            
            // Get the actual rendered SVG element from the DOM
            const renderedSvg = containerRef.current?.querySelector('svg');
            let width, height;
            
            if (renderedSvg) {
                // Use getBBox() to get the actual bounding box of the rendered content
                try {
                    const bbox = renderedSvg.getBBox();
                    width = bbox.width || parseInt(renderedSvg.getAttribute('width')) || 1200;
                    height = bbox.height || parseInt(renderedSvg.getAttribute('height')) || 800;
                } catch (e) {
                    // Fallback to attributes if getBBox fails
                    width = parseInt(renderedSvg.getAttribute('width')) || 1200;
                    height = parseInt(renderedSvg.getAttribute('height')) || 800;
                }
            } else {
                // Fallback to parsed SVG attributes
                width = parseInt(svgElement.getAttribute('width')) || 1200;
                height = parseInt(svgElement.getAttribute('height')) || 800;
            }
            
            // Set maximum dimensions to keep it reasonable (maintain aspect ratio)
            const maxWidth = 2400; // Max width for readable PNG
            const maxHeight = 1800; // Max height for readable PNG
            const aspectRatio = width / height;
            
            if (width > maxWidth) {
                width = maxWidth;
                height = width / aspectRatio;
            }
            if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatio;
            }
            
            // Ensure minimum dimensions
            if (width < 400) width = 400;
            if (height < 300) height = 300;
            
            // Remove width/height attributes from SVG to let it scale naturally
            const svgClone = svgElement.cloneNode(true);
            svgClone.removeAttribute('width');
            svgClone.removeAttribute('height');
            const viewBox = svgElement.getAttribute('viewBox') || svgElement.getAttribute('viewbox');
            if (viewBox) {
                svgClone.setAttribute('viewBox', viewBox);
            } else {
                svgClone.setAttribute('viewBox', `0 0 ${width} ${height}`);
            }
            
            // Create a canvas element
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size with padding
            const padding = 40;
            canvas.width = Math.round(width) + padding * 2;
            canvas.height = Math.round(height) + padding * 2;
            
            // Fill white background
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Create an image from the SVG using data URL to avoid CORS issues
            const img = new Image();
            const svgData = new XMLSerializer().serializeToString(svgClone);
            // Use data URL instead of blob URL to avoid CORS taint issues
            const svgDataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
            
            img.crossOrigin = 'anonymous';
            
            img.onload = () => {
                try {
                    // Draw the image on canvas, maintaining aspect ratio
                    const drawWidth = Math.round(width);
                    const drawHeight = Math.round(height);
                    ctx.drawImage(img, padding, padding, drawWidth, drawHeight);
                    
                    // Convert to PNG and download
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const downloadUrl = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = downloadUrl;
                            link.download = `flowchart-${index}-${Date.now()}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            URL.revokeObjectURL(downloadUrl);
                        }
                    }, 'image/png', 1.0);
                } catch (canvasError) {
                    console.error('Canvas error:', canvasError);
                    // Fallback to SVG download
                    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(svgBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `flowchart-${index}-${Date.now()}.svg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }
            };
            
            img.onerror = () => {
                console.error('Failed to load SVG image, falling back to SVG download');
                // Fallback: download as SVG
                const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `flowchart-${index}-${Date.now()}.svg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            };
            
            img.src = svgDataUrl;
        } catch (e) {
            console.error('Error downloading PNG:', e);
            // Fallback: download as SVG
            try {
                const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `flowchart-${index}-${Date.now()}.svg`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } catch (fallbackError) {
                console.error('Failed to download SVG as fallback:', fallbackError);
            }
        }
    };

    return (
        <>
            <div className="flowchart-container bg-background p-4 rounded border border-border">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Flowchart Diagram</span>
                    {svgContent && !error && (
                        <div className="flex gap-2">
                            <button
                                onClick={handleModalOpen}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg border border-blue-500/30 transition-all shadow-md hover:shadow-blue-500/20 font-medium"
                                title="View fullscreen"
                            >
                                <Maximize2 size={14} />
                                <span>View</span>
                            </button>
                            <button
                                onClick={downloadAsPNG}
                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg border border-green-500/30 transition-all shadow-md hover:shadow-green-500/20 font-medium"
                                title="Download as PNG"
                            >
                                <Download size={14} />
                                <span>Download</span>
                            </button>
                        </div>
                    )}
                </div>
                <div 
                    ref={containerRef}
                    className="mermaid-diagram"
                    style={{ 
                        minHeight: '200px', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        overflow: 'auto',
                        maxWidth: '100%',
                        cursor: svgContent && !error ? 'pointer' : 'default'
                    }}
                    onClick={() => svgContent && !error && handleModalOpen()}
                >
                    {isRendering && (
                        <div className="text-muted-foreground text-sm">Rendering flowchart...</div>
                    )}
                    {error && (
                        <div style={{ color: '#ef4444', padding: '10px', background: '#fee2e2', borderRadius: '4px', maxWidth: '100%' }}>
                            <div>Unable to render flowchart.</div>
                            <div style={{ fontSize: '10px', marginTop: '5px', opacity: 0.8 }}>Error: {error}</div>
                        </div>
                    )}
                    {svgContent && !error && (
                        <div 
                            className="bg-white rounded-lg p-4 shadow-lg w-full"
                            style={{ 
                                display: 'flex', 
                                justifyContent: 'center',
                                overflow: 'auto'
                            }}
                        >
                            <div 
                                dangerouslySetInnerHTML={{ __html: svgContent }}
                                style={{ 
                                    width: '100%', 
                                    display: 'flex', 
                                    justifyContent: 'center'
                                }}
                            />
                        </div>
                    )}
                </div>
                <details className="mt-3 text-xs">
                    <summary className="cursor-pointer text-muted-foreground hover:text-foreground">View Code</summary>
                    <pre className="mt-2 p-2 bg-secondary rounded text-xs overflow-x-auto whitespace-pre-wrap">
                        {flowchart}
                    </pre>
                </details>
            </div>

            {/* Fullscreen Modal */}
            {isModalOpen && svgContent && (
                <div 
                    className="fixed inset-0 z-[99999] bg-black/90 backdrop-blur-md flex items-center justify-center"
                    onClick={handleModalClose}
                    style={{ backdropFilter: 'blur(8px)', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <div 
                        className="bg-[#0a0a0a] rounded-xl border border-zinc-800 shadow-2xl w-[98vw] h-[98vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                        style={{ marginTop: '1vh', marginBottom: '1vh' }}
                    >
                        <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-[#111111] sticky top-0 z-10 rounded-t-xl">
                            <h3 className="font-semibold text-white text-lg">Flowchart - Full View</h3>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={downloadAsPNG}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg border border-blue-500/30 transition-all shadow-lg hover:shadow-blue-500/20 font-medium"
                                    title="Download as PNG"
                                >
                                    <Download size={18} />
                                    <span>Download</span>
                                </button>
                                <button
                                    onClick={handleModalClose}
                                    className="p-2 hover:bg-zinc-800 rounded-lg transition-colors text-zinc-400 hover:text-white"
                                    title="Close"
                                >
                                    <X size={22} />
                                </button>
                            </div>
                        </div>
                        <div 
                            className="p-8 overflow-auto flex-1 bg-[#0a0a0a] flex justify-center items-start"
                            style={{ maxHeight: 'calc(98vh - 80px)', minHeight: 0 }}
                        >
                            <div 
                                className="bg-white rounded-lg p-6 shadow-2xl"
                                style={{ 
                                    maxWidth: '90%',
                                    width: 'fit-content',
                                    display: 'inline-block'
                                }}
                            >
                                <div 
                                    dangerouslySetInnerHTML={{ __html: svgContent }}
                                    className="flex justify-center items-center"
                                    style={{ 
                                        width: '100%',
                                        height: 'auto',
                                        maxWidth: '100%'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// Skeleton loading components
const FlowchartSkeleton = () => (
    <div className="w-full max-w-[300px] h-[200px] bg-secondary/50 rounded-lg border border-border animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-muted-foreground animate-spin" />
            <span className="text-xs text-muted-foreground">Generating flowchart...</span>
        </div>
    </div>
);

const ImageSkeleton = () => (
    <div className="w-full max-w-[300px] h-[200px] bg-secondary/50 rounded-lg border border-border animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-muted-foreground animate-spin" />
            <span className="text-xs text-muted-foreground">Generating image...</span>
        </div>
    </div>
);

const ChartSkeleton = () => (
    <div className="w-full max-w-[600px] h-[300px] bg-secondary/50 rounded-lg border border-border animate-pulse flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-muted-foreground animate-spin" />
            <span className="text-xs text-muted-foreground">Creating charts...</span>
        </div>
    </div>
);

// WhatsApp Preview Component
const WhatsAppPreviewWithState = ({ previewData, taskIndex }) => {
    const [message, setMessage] = useState(previewData?.message || '');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [cancelled, setCancelled] = useState(false);
    const [error, setError] = useState(null);
    const [rewriting, setRewriting] = useState(false);
    
    const handleSend = async (data) => {
        setSending(true);
        setError(null);
        try {
            const sendPayload = {
                operation: 'send_message',
                phone_number: data.recipient,
                message: data.message
            };
            
            const response = await fetch('http://localhost:5001/api/whatsapp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sendPayload)
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                console.log('✅ WhatsApp sent successfully!', result);
                setSent(true);
            } else {
                console.error('❌ WhatsApp send failed:', result);
                setError(result.message || 'Failed to send');
            }
        } catch (error) {
            console.error('Error sending WhatsApp:', error);
            setError('Network error. Please try again.');
        } finally {
            setSending(false);
        }
    };
    
    return <WhatsAppPreview 
        previewData={{ ...previewData, message }} 
        onSend={(data) => handleSend({ ...data, message })}
        onCancel={() => setCancelled(true)}
        sending={sending}
        sent={sent}
        cancelled={cancelled}
        error={error}
        onRewrite={async () => {
            setRewriting(true);
            try {
                const response = await fetch('http://localhost:5001/api/whatsapp/rewrite', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message, tone: 'friendly' })
                });
                const data = await response.json();
                if (data.status === 'success') {
                    setMessage(data.rewritten);
                }
            } catch (error) {
                console.error('Rewrite failed:', error);
            } finally {
                setRewriting(false);
            }
        }}
        rewriting={rewriting}
        message={message}
        setMessage={setMessage}
    />;
};

const WhatsAppPreview = ({ previewData, onSend, onCancel, onRewrite, sending = false, sent = false, cancelled = false, error = null, rewriting = false, message, setMessage }) => {
    
    // If cancelled, show minimal cancelled state
    if (cancelled) {
        return (
            <div className="p-4 bg-secondary/30 rounded-lg border border-border space-y-3">
                <div className="flex items-center gap-2 p-2 bg-muted rounded text-muted-foreground text-sm">
                    <X size={16} />
                    <span>WhatsApp message cancelled</span>
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-4 bg-secondary/30 rounded-lg border border-border space-y-3">
            <div className="flex items-center gap-2">
                <MessageSquare size={16} className="text-green-500" />
                <span className="text-sm font-medium">WhatsApp Message Preview</span>
            </div>
            
            {/* Recipient Info */}
            <div className="p-2 bg-background rounded border border-border/50">
                <div className="text-xs text-muted-foreground">To:</div>
                <div className="text-sm font-medium">
                    {previewData?.recipient_name || previewData?.recipient || 'Unknown'}
                </div>
                {previewData?.recipient && previewData?.recipient_name && (
                    <div className="text-xs text-muted-foreground">{previewData.recipient}</div>
                )}
            </div>
            
            {/* Message Content */}
            <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Message:</div>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 bg-background rounded border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    rows={4}
                    placeholder="Enter your message..."
                />
            </div>
            
            {/* Status Messages */}
            {sent && (
                <div className="flex items-center gap-2 p-2 bg-green-500/10 border border-green-500/30 rounded text-green-500 text-sm">
                    <Check size={16} />
                    <span>✓ Message sent successfully!</span>
                </div>
            )}
            
            {error && (
                <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-red-500 text-sm">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onSend({ ...previewData, message })}
                    disabled={sending || sent || !message.trim()}
                    className={`flex items-center gap-2 px-4 py-2 ${sent ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'} disabled:bg-green-500/50 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors`}
                >
                    {sending ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Sending...
                        </>
                    ) : sent ? (
                        <>
                            <Check size={14} />
                            Sent ✓
                        </>
                    ) : (
                        <>
                            <Send size={14} />
                            Send via WhatsApp
                        </>
                    )}
                </button>
                
                <button
                    onClick={onRewrite}
                    disabled={rewriting || sending || sent || !message.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground text-sm rounded-lg transition-colors"
                    title="Rewrite with AI"
                >
                    {rewriting ? (
                        <>
                            <Loader2 size={14} className="animate-spin" />
                            Rewriting...
                        </>
                    ) : (
                        <>
                            <Sparkles size={14} />
                            Rewrite
                        </>
                    )}
                </button>
                
                <button
                    onClick={onCancel}
                    disabled={sending || sent}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed text-red-500 text-sm rounded-lg transition-colors"
                    title="Cancel and dismiss"
                >
                    <X size={14} />
                    Cancel
                </button>
            </div>
            
            {/* Status Messages */}
            {!previewData?.service_ready && (
                <div className="text-xs text-orange-500 flex items-center gap-1">
                    <AlertCircle size={12} />
                    WhatsApp service not running. Start it with: cd Whatsapp-Agent && npm start
                </div>
            )}
        </div>
    );
};

// PPT Viewer Modal Component with Keyboard Navigation
const PPTViewerModal = ({ isOpen, onClose, pptUrl, title, slides }) => {
    const [currentSlide, setCurrentSlide] = useState(1);
    const totalSlides = slides || 10;
    
    useEffect(() => {
        if (!isOpen) return;
        
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                setCurrentSlide(prev => Math.min(prev + 1, totalSlides));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                setCurrentSlide(prev => Math.max(prev - 1, 1));
            }
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, totalSlides]);
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                title="Close (ESC)"
            >
                <X size={24} className="text-white" />
            </button>
            
            {/* Slide counter */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm z-10">
                <span className="text-white font-medium">
                    Slide {currentSlide} / {totalSlides}
                </span>
            </div>
            
            {/* Title */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 rounded-lg backdrop-blur-sm z-10">
                <span className="text-white font-medium">{title}</span>
            </div>
            
            {/* Main viewer area */}
            <div className="w-full max-w-7xl aspect-video bg-white rounded-lg shadow-2xl flex items-center justify-center relative">
                {/* Download button */}
                <a
                    href={`http://localhost:5001${pptUrl}?download=true`}
                    download
                    className="absolute top-4 right-4 p-2 bg-primary hover:bg-primary/90 rounded-full transition-colors z-10"
                    title="Download PPTX"
                >
                    <Download size={20} className="text-white" />
                </a>
                
                {/* Slide preview - showing embedded iframe */}
                <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(`http://localhost:5001${pptUrl}`)}`}
                    width="100%"
                    height="100%"
                    className="rounded-lg"
                    frameBorder="0"
                />
            </div>
            
            {/* Navigation controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 rounded-full px-6 py-3 backdrop-blur-sm">
                <button
                    onClick={() => setCurrentSlide(prev => Math.max(prev - 1, 1))}
                    disabled={currentSlide === 1}
                    className="p-2 hover:bg-white/10 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Previous (←)"
                >
                    <ChevronDown size={20} className="text-white rotate-90" />
                </button>
                
                <span className="text-white font-medium min-w-[100px] text-center">
                    {currentSlide} / {totalSlides}
                </span>
                
                <button
                    onClick={() => setCurrentSlide(prev => Math.min(prev + 1, totalSlides))}
                    disabled={currentSlide === totalSlides}
                    className="p-2 hover:bg-white/10 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Next (→)"
                >
                    <ChevronDown size={20} className="text-white -rotate-90" />
                </button>
            </div>
            
            {/* Instructions */}
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/60 text-sm">
                Use ← → arrows to navigate • ESC to close
            </div>
        </div>
    );
};

// Image component with loading skeleton
const ImageWithLoader = ({ src, alt, className, isChart = false }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    return (
        <div className="relative">
            {isLoading && !hasError && (
                <div className={`absolute inset-0 bg-secondary/30 rounded-lg animate-pulse flex items-center justify-center ${className}`}>
                    <Loader2 size={24} className="text-muted-foreground animate-spin" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`${className} transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
                style={{ display: hasError ? 'none' : 'block' }}
            />
            {hasError && (
                <div className={`flex items-center justify-center ${className} bg-secondary/50 rounded-lg border border-border`}>
                    <span className="text-xs text-muted-foreground">Failed to load {isChart ? 'chart' : 'image'}</span>
                </div>
            )}
        </div>
    );
};

// Function to download file properly
const downloadFile = async (url, filename) => {
    try {
        // Add download parameter to URL to force download on server side
        const downloadUrl = url.includes('?') ? `${url}&download=true` : `${url}?download=true`;
        
        // Try fetch approach with blob
        const response = await fetch(downloadUrl, {
            method: 'GET',
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        
        // Clean up after a short delay
        setTimeout(() => {
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        }, 100);
    } catch (error) {
        console.error('Download failed, trying alternative method:', error);
        
        // Fallback: Try using download attribute directly with server-side download
        try {
            const downloadUrl = url.includes('?') ? `${url}&download=true` : `${url}?download=true`;
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = filename;
            link.setAttribute('download', filename);
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
                document.body.removeChild(link);
            }, 100);
        } catch (fallbackError) {
            console.error('Both download methods failed:', fallbackError);
            // Last resort: open in new tab
            window.open(url, '_blank');
        }
    }
};

// Simple markdown to HTML converter with table support
const markdownToHtml = (markdown) => {
    if (!markdown) return '';
    
    let html = markdown;
    
    // Remove any file references that might be embedded (like "research_result.md" or similar)
    html = html.replace(/\b\w+_result\.(md|txt)\b/gi, '');
    html = html.replace(/\bresearch_result\.md\b/gi, '');
    html = html.replace(/\bdocument\.md\b/gi, '');
    html = html.replace(/\bcase_study\.md\b/gi, '');
    
    // Process tables first (before other markdown processing)
    // Match markdown tables: | col1 | col2 | col3 |
    // This regex matches: header row, separator row (with dashes), and data rows
    const tableRegex = /(\|.+\|\s*\n\|[:\s\-|]+\|\s*\n(?:\|.+\|\s*\n?)+)/g;
    html = html.replace(tableRegex, (match) => {
        const lines = match.trim().split('\n').filter(line => line.trim());
        if (lines.length < 2) return match;
        
        // First line is header
        const headerRow = lines[0];
        const separatorRow = lines[1];
        const dataRows = lines.slice(2);
        
        // Parse header - split by | and filter out empty cells
        const headers = headerRow.split('|')
            .map(cell => cell.trim())
            .filter(cell => cell && !cell.match(/^[\s\-:]+$/)); // Filter out separator-like cells
        
        if (headers.length === 0) return match;
        
        // Build table HTML
        let tableHtml = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-border">';
        
        // Header row
        tableHtml += '<thead><tr class="bg-secondary/50">';
        headers.forEach(header => {
            tableHtml += `<th class="border border-border px-4 py-2 text-left font-semibold text-foreground">${header}</th>`;
        });
        tableHtml += '</tr></thead>';
        
        // Data rows
        if (dataRows.length > 0) {
            tableHtml += '<tbody>';
            dataRows.forEach(row => {
                const cells = row.split('|')
                    .map(cell => cell.trim())
                    .filter(cell => cell && !cell.match(/^[\s\-:]+$/)); // Filter out separator-like cells
                
                if (cells.length > 0) {
                    tableHtml += '<tr class="hover:bg-secondary/30">';
                    // Ensure we have the same number of cells as headers
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
    
    // Mermaid code blocks - extract and render (handle before other processing)
    html = html.replace(/```mermaid\n([\s\S]*?)```/g, (match, mermaidCode) => {
        const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        // Store the code in a data attribute and display it in a pre tag
        // We'll render it properly in the useEffect
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
    
    // Paragraphs (lines that aren't already wrapped and aren't table rows)
    html = html.split('\n').map(line => {
        const trimmed = line.trim();
        // Skip if it's a table row, header, list item, or empty
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
            line.match(/^\|.*\|$/) // Markdown table row
        ) {
            return line;
        }
        return `<p class="mb-3 leading-relaxed">${line}</p>`;
    }).join('\n');
    
    // Clean up multiple consecutive <p> tags
    html = html.replace(/(<\/p>\s*)+/g, '</p>');
    
    return html;
};

// Component to render markdown content with mermaid support
const MarkdownContent = ({ content, renderedContent, isMarkdown }) => {
    const contentRef = useRef(null);
    
    useEffect(() => {
        if (!isMarkdown || !contentRef.current) return;
        
        // Find all mermaid containers and render them
        const mermaidContainers = contentRef.current.querySelectorAll('.mermaid-container');
        
        mermaidContainers.forEach(async (container) => {
            // Get the code from data attribute
            const mermaidCode = container.getAttribute('data-mermaid-code');
            if (!mermaidCode) return;
            
            // Check if already rendered
            if (container.querySelector('.mermaid-rendered')) return;
            
            try {
                const uniqueId = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                const { svg } = await mermaid.render(uniqueId, mermaidCode);
                
                // Replace the container content with the rendered SVG
                const svgDiv = document.createElement('div');
                svgDiv.innerHTML = svg;
                svgDiv.className = 'mermaid-rendered bg-white rounded-lg p-4 border border-border overflow-auto';
                container.innerHTML = '';
                container.appendChild(svgDiv);
            } catch (error) {
                console.error('Error rendering mermaid:', error);
                // Keep the original pre element if rendering fails
            }
        });
    }, [isMarkdown, renderedContent]);
    
    return (
        <div className="px-3 pb-3 border-t border-border pt-3">
            <div className={`text-sm text-foreground/90 max-h-[600px] overflow-y-auto p-4 bg-background/50 rounded border border-border ${
                isMarkdown ? 'prose prose-sm max-w-none' : 'whitespace-pre-wrap'
            }`}>
                {isMarkdown ? (
                    <div 
                        ref={contentRef}
                        dangerouslySetInnerHTML={{ __html: renderedContent }}
                        className="markdown-content"
                        style={{
                            lineHeight: '1.7',
                            color: 'inherit'
                        }}
                    />
                ) : (
                    content
                )}
            </div>
        </div>
    );
};

const FileBox = ({ type, filename, content }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const getIcon = () => {
        switch(type) {
            case 'research': return <SearchIcon size={20} className="text-indigo-500" />;
            case 'case_study': return <BookOpen size={20} className="text-pink-500" />;
            case 'document': return <FileText size={20} className="text-purple-500" />;
            case 'summary': return <FileText size={20} className="text-cyan-500" />;
            case 'brainstorm': return <FileText size={20} className="text-orange-500" />;
            default: return <File size={20} className="text-muted-foreground" />;
        }
    };
    
    const getExtension = () => {
        if (filename.includes('.')) {
            return filename.split('.').pop();
        }
        return type === 'case_study' || type === 'document' || type === 'research' ? 'md' : 'txt';
    };
    
    const isMarkdown = type === 'research' || type === 'case_study' || type === 'document' || type === 'summary' || filename.endsWith('.md');
    const renderedContent = isMarkdown ? markdownToHtml(content) : content;
    
    return (
        <div className="border border-border rounded-lg bg-card hover:bg-secondary/50 transition-colors">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-3 flex items-center gap-3 text-left"
            >
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">{filename}</div>
                    <div className="text-xs text-muted-foreground">.{getExtension()}</div>
                </div>
                <ChevronDown 
                    size={16} 
                    className={`text-muted-foreground transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                />
            </button>
            {isExpanded && (
                <MarkdownContent 
                    content={content}
                    renderedContent={renderedContent}
                    isMarkdown={isMarkdown}
                />
            )}
        </div>
    );
};

const EventViewer = ({ eventData }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return 'Not specified';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: eventData.all_day ? undefined : '2-digit',
                minute: eventData.all_day ? undefined : '2-digit'
            });
        } catch (e) {
            return dateStr;
        }
    };

    const getColorClass = (color) => {
        const colorMap = {
            'sky': 'bg-blue-500/20 border-blue-500/40 text-blue-600',
            'amber': 'bg-amber-500/20 border-amber-500/40 text-amber-600',
            'orange': 'bg-orange-500/20 border-orange-500/40 text-orange-600',
            'emerald': 'bg-emerald-500/20 border-emerald-500/40 text-emerald-600',
            'violet': 'bg-violet-500/20 border-violet-500/40 text-violet-600',
            'rose': 'bg-rose-500/20 border-rose-500/40 text-rose-600'
        };
        return colorMap[color] || colorMap['sky'];
    };

    return (
        <div className="space-y-3 w-full">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    <div className={`inline-block px-3 py-1.5 rounded-full border text-sm font-medium mb-3 ${getColorClass(eventData.color || 'sky')}`}>
                        {eventData.title || 'New Event'}
                    </div>
                </div>
            </div>

            <div className="bg-background border border-border rounded-lg overflow-hidden">
                <div className="p-4 space-y-3">
                    {eventData.description && (
                        <div>
                            <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Description</div>
                            <div className="text-sm text-foreground/90">{eventData.description}</div>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Start</div>
                            <div className="text-sm text-foreground font-medium">{formatDate(eventData.start_time)}</div>
                        </div>
                        <div>
                            <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">End</div>
                            <div className="text-sm text-foreground font-medium">{formatDate(eventData.end_time)}</div>
                        </div>
                    </div>

                    {eventData.all_day && (
                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-600 dark:text-blue-400">
                            📅 All-day event
                        </div>
                    )}

                    {eventData.location && (
                        <div>
                            <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase tracking-wide">Location</div>
                            <div className="text-sm text-foreground/90">📍 {eventData.location}</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const EmailViewer = ({ emailData }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedEmail, setEditedEmail] = useState(emailData);
    const [plainTextBody, setPlainTextBody] = useState('');
    const [originalPlainText, setOriginalPlainText] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [sendStatus, setSendStatus] = useState(null);
    
    // Extract HTML from body if it contains HTML tags
    const extractHTML = (text) => {
        if (!text) return '';
        
        // Remove code block markers first
        let cleaned = text.replace(/```html\n?/gi, '').replace(/```\n?/g, '');
        
        // Remove escaped HTML entities
        cleaned = cleaned.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        
        // Check if it contains HTML tags
        if (cleaned.includes('<html>') || cleaned.includes('<body>') || cleaned.includes('<p>') || cleaned.includes('<div>')) {
            // Try to extract the body content
            const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch) {
                return bodyMatch[1];
            }
            // Try to extract content between HTML tags (get the main content)
            const htmlMatch = cleaned.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
            if (htmlMatch) {
                // Remove head and style tags from the extracted content
                let content = htmlMatch[1];
                content = content.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
                content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
                return content;
            }
            // If it has HTML-like structure but no body tag, try to get content after <body> or between tags
            if (cleaned.includes('<p>') || cleaned.includes('<div>')) {
                // Extract content that looks like HTML
                const contentMatch = cleaned.match(/(<[^>]+>[\s\S]*)/);
                if (contentMatch) {
                    return contentMatch[1];
                }
            }
        }
        
        // If no HTML found, return as plain text
        return cleaned;
    };
    
    const cleanHTML = (html) => {
        if (!html) return '';
        
        // Remove code block markers
        let cleaned = html.replace(/```html\n?/gi, '').replace(/```\n?/g, '');
        
        // Remove escaped HTML entities
        cleaned = cleaned.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        
        // Remove style tags that might be in the content (but keep inline styles)
        cleaned = cleaned.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        
        // Remove DOCTYPE and html/head tags if present
        cleaned = cleaned.replace(/<!DOCTYPE[^>]*>/gi, '');
        cleaned = cleaned.replace(/<html[^>]*>/gi, '').replace(/<\/html>/gi, '');
        cleaned = cleaned.replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');
        
        return cleaned.trim();
    };
    
    const emailBody = cleanHTML(extractHTML(editedEmail.body));
    const hasHTML = emailBody.includes('<') && emailBody.includes('>');
    
    // Extract plain text from HTML for editing
    const extractPlainText = (html) => {
        if (!html) return '';
        // Remove code block markers
        let text = html.replace(/```html\n?/gi, '').replace(/```\n?/g, '');
        // Create a temporary DOM element to extract text
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        // Get text content and clean up
        let plainText = tempDiv.textContent || tempDiv.innerText || '';
        // Clean up extra whitespace
        plainText = plainText.replace(/\n{3,}/g, '\n\n').trim();
        return plainText;
    };
    
    // Initialize plain text when entering edit mode
    useEffect(() => {
        if (isEditing) {
            const text = extractPlainText(editedEmail.body);
            setPlainTextBody(text);
            setOriginalPlainText(text); // Store original to compare
        } else {
            // Reset when not editing
            setPlainTextBody('');
            setOriginalPlainText('');
        }
    }, [isEditing]);
    
    const handleSave = () => {
        // Only convert to HTML if text actually changed
        if (plainTextBody === originalPlainText) {
            // No changes, just close edit mode
            setIsEditing(false);
            return;
        }
        
        // Convert plain text to HTML only if changed
        const lines = plainTextBody.split('\n');
        const htmlLines = [];
        let lastWasEmpty = false;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            
            if (trimmed) {
                // Non-empty line - add as paragraph
                htmlLines.push(`<p style='margin: 0.5em 0;'>${trimmed}</p>`);
                lastWasEmpty = false;
            } else if (i < lines.length - 1) {
                // Empty line - only add break if next line has content
                if (!lastWasEmpty && i + 1 < lines.length && lines[i + 1].trim()) {
                    htmlLines.push('<br>');
                }
                lastWasEmpty = true;
            }
        }
        
        const htmlBody = htmlLines.join('');
        setEditedEmail({ ...editedEmail, body: htmlBody });
        setIsEditing(false);
    };
    
    const handleSend = async () => {
        if (!editedEmail.to || !editedEmail.subject || !editedEmail.body) {
            setSendStatus({
                type: 'error',
                message: 'Please fill in all fields (To, Subject, Body)'
            });
            return;
        }
        
        setIsSending(true);
        setSendStatus(null);
        
        try {
            const response = await fetch('http://localhost:5001/api/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: editedEmail.to,
                    subject: editedEmail.subject,
                    body: editedEmail.body
                }),
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                setIsSent(true);
                setSendStatus({
                    type: 'success',
                    message: 'Email sent successfully!'
                });
            } else {
                setSendStatus({
                    type: 'error',
                    message: data.error || 'Failed to send email. Please check if Mailgun is configured.'
                });
            }
        } catch (error) {
            setSendStatus({
                type: 'error',
                message: 'Error sending email: ' + error.message
            });
        } finally {
            setIsSending(false);
        }
    };
    
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                    <Mail size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">Email Draft</span>
                </div>
                <div className="flex items-center gap-2">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={() => {
                                    const text = extractPlainText(editedEmail.body);
                                    setPlainTextBody(text);
                                    setIsEditing(true);
                                    setIsSent(false); // Reset sent state when editing
                                }}
                                className="p-1.5 hover:bg-background rounded transition-colors text-muted-foreground hover:text-foreground"
                                title="Edit"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={isSending || !editedEmail.to || isSent}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity text-xs font-medium ${
                                    isSending || isSent
                                        ? 'bg-green-600 text-white cursor-wait' 
                                        : !editedEmail.to 
                                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed opacity-50' 
                                        : 'bg-blue-600 text-white'
                                }`}
                                title={!editedEmail.to ? 'Please enter recipient email' : isSending ? 'Sending...' : isSent ? 'Email sent!' : 'Send email'}
                            >
                                {isSending ? (
                                    <Loader2 size={14} className="animate-spin" />
                                ) : isSent ? (
                                    <Check size={14} />
                                ) : (
                                    <Send size={14} />
                                )}
                                <span>{isSent ? 'Sent' : 'Send'}</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:opacity-90 transition-opacity text-xs font-medium"
                        >
                            <Save size={14} />
                            <span>Save</span>
                        </button>
                    )}
                </div>
            </div>
            
            {sendStatus && (
                <div className={`p-2 rounded-lg text-xs ${
                    sendStatus.type === 'success' 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                }`}>
                    {sendStatus.message}
                </div>
            )}
            
            <div className="bg-background border border-border rounded-lg overflow-hidden">
                {isEditing ? (
                    <div className="p-4 space-y-3">
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">To:</label>
                            <input
                                type="email"
                                value={editedEmail.to}
                                onChange={(e) => setEditedEmail({ ...editedEmail, to: e.target.value })}
                                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="recipient@example.com"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Subject:</label>
                            <input
                                type="text"
                                value={editedEmail.subject}
                                onChange={(e) => setEditedEmail({ ...editedEmail, subject: e.target.value })}
                                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                placeholder="Email subject"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-muted-foreground mb-1 block">Body:</label>
                            <textarea
                                value={plainTextBody}
                                onChange={(e) => setPlainTextBody(e.target.value)}
                                className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary min-h-[200px]"
                                placeholder="Email body"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="p-4 space-y-3">
                        <div className="border-b border-border pb-2">
                            <div className="text-xs text-muted-foreground mb-1">To:</div>
                            <div className="text-sm text-foreground font-medium">{editedEmail.to || 'Not specified'}</div>
                        </div>
                        <div className="border-b border-border pb-2">
                            <div className="text-xs text-muted-foreground mb-1">Subject:</div>
                            <div className="text-sm text-foreground font-medium">{editedEmail.subject}</div>
                        </div>
                        <div className="pt-2">
                            <div className="text-xs text-muted-foreground mb-2">Preview:</div>
                            <div className="bg-white rounded-lg p-4 border border-border/50 max-w-full overflow-auto">
                                {hasHTML ? (
                                    <div 
                                        dangerouslySetInnerHTML={{ __html: emailBody }}
                                        className="email-preview"
                                        style={{
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                                            fontSize: '14px',
                                            color: '#333',
                                            lineHeight: '1.6'
                                        }}
                                    />
                                ) : (
                                    <div className="whitespace-pre-wrap text-foreground/90" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                                        {emailBody}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Clickable box for images/flowcharts/charts in compact view
const MediaBox = ({ type, onClick, onDownload, title }) => {
    const isFlowchart = type === 'flowchart';
    const isImage = type === 'image';
    const isChart = type === 'chart';
    
    return (
        <div className="border border-border rounded-lg bg-card hover:bg-secondary/50 transition-colors cursor-pointer group">
            <div
                onClick={onClick}
                className="w-full p-3 flex items-center gap-3"
            >
                <div className="flex-shrink-0">
                    {isFlowchart ? (
                        <FileText size={20} className="text-blue-500" />
                    ) : isChart ? (
                        <ImageIcon size={20} className="text-green-500" />
                    ) : (
                        <ImageIcon size={20} className="text-purple-500" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground truncate">
                        {title || (isFlowchart ? 'Flowchart' : isChart ? 'Chart' : 'Image')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {isFlowchart ? '.mermaid' : isChart ? '.png' : '.png'}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDownload();
                        }}
                        className="p-1.5 hover:bg-secondary rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Download"
                    >
                        <Download size={14} className="text-muted-foreground" />
                    </button>
                    <Eye size={16} className="text-muted-foreground" />
                </div>
            </div>
        </div>
    );
};

// Helper function to generate filename from task text
const generateFilename = (taskText, agentType, defaultName) => {
    if (!taskText || taskText.trim() === '') {
        return defaultName;
    }
    
    // Clean and sanitize the task text for filename
    let filename = taskText
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .replace(/_+/g, '_') // Replace multiple underscores with single
        .substring(0, 50); // Limit length
    
    // Remove trailing underscores
    filename = filename.replace(/_+$/, '');
    
    if (!filename || filename.length < 3) {
        return defaultName;
    }
    
    // Add appropriate extension based on agent type
    const extension = agentType === 'research' || agentType === 'document' || agentType === 'case_study' ? 'md' : 'txt';
    return `${filename}.${extension}`;
};

const TaskTimeline = ({ tasks, results, isProcessing, onModalToggle, setMediaModalContent, setMediaModalOpen, setPptViewerData, setPptViewerOpen }) => {
    const [completedTasks, setCompletedTasks] = useState(new Set());
    const [processingTasks, setProcessingTasks] = useState(new Set());
    const [expandedTasks, setExpandedTasks] = useState(new Set());
    const mermaidInitialized = useRef(false);
    
    const toggleTaskExpansion = (index) => {
        setExpandedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    };

    useEffect(() => {
        // Initialize Mermaid once
        if (!mermaidInitialized.current) {
            // Suppress Mermaid error messages
            const originalLogError = console.error;
            console.error = (...args) => {
                // Filter out Mermaid syntax error messages
                const message = args.join(' ');
                if (message.includes('Syntax error') && message.includes('mermaid')) {
                    return; // Suppress Mermaid syntax errors
                }
                originalLogError.apply(console, args);
            };
            
            mermaid.initialize({ 
                startOnLoad: false,
                theme: 'default',
                securityLevel: 'loose',
                flowchart: {
                    useMaxWidth: true,
                    htmlLabels: true,
                    curve: 'basis'
                },
                logLevel: 'error' // Only show critical errors
            });
            mermaidInitialized.current = true;
        }
    }, []);

    useEffect(() => {
        if (isProcessing && tasks.length > 0) {
            // Show tasks as processing immediately
            setProcessingTasks(new Set(tasks.map((_, i) => i)));
            
            // Simulate sequential processing start
        tasks.forEach((_, index) => {
                setTimeout(() => {
                    // Task starts processing (already in processingTasks)
                }, index * 300); // Stagger start by 300ms
            });
        }
    }, [tasks, isProcessing]);

    useEffect(() => {
        // When results come in, mark tasks as completed
        if (results && Object.keys(results).length > 0) {
            tasks.forEach((task, index) => {
                const agentName = task.agent === 'flowchart' ? 'Flowchart Agent' :
                                  task.agent === 'email' ? 'Email Agent' :
                                  task.agent === 'research' ? 'Research Agent' :
                                  task.agent === 'image' ? 'Image Agent' :
                                  task.agent === 'summary' ? 'Summary Agent' :
                                  task.agent === 'brainstorm' ? 'Brainstorm Agent' :
                                  task.agent === 'document' ? 'Document Agent' :
                                  task.agent === 'case_study' ? 'Case Study Agent' :
                                  task.agent === 'plotting' ? 'Plotting Agent' :
                                  task.agent === 'checklist' ? 'Checklist Agent' :
                                  task.agent === 'calendar' ? 'Calendar Agent' :
                                  task.agent === 'daily_digest' ? 'Daily Digest Agent' :
                                  task.agent === 'call' ? 'Call Agent' :
                                  task.agent === 'whatsapp' ? 'WhatsApp Agent' :
                                  task.agent === 'presentation' ? 'Presentation Agent' : 'AI Agent';
                
                const resultKey = agentName;
                const result = results[resultKey];
                
                if (result && !result.error) {
                    // Mark as completed with a slight delay for visual effect
                    setTimeout(() => {
                        setCompletedTasks(prev => new Set([...prev, index]));
                        setProcessingTasks(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(index);
                            return newSet;
                        });
                        
                        // Auto-expand if single task with image or flowchart
                        if (tasks.length === 1 && (task.agent === 'image' || task.agent === 'flowchart')) {
                            if (result.image_url || result.flowchart) {
                                setExpandedTasks(prev => new Set([...prev, index]));
                            }
                        }
                    }, index * 400 + 200); // Stagger completion by 400ms
                }
            });
        }
    }, [results, tasks]);


    return (
        <div className="flex flex-col gap-0 mt-2">
            {tasks.map((task, index) => {
                const isCompleted = completedTasks.has(index);
                const isProcessing = processingTasks.has(index) && !isCompleted;
                const isLast = index === tasks.length - 1;
                const agentName = task.agent === 'flowchart' ? 'Flowchart Agent' :
                                  task.agent === 'email' ? 'Email Agent' :
                                  task.agent === 'research' ? 'Research Agent' :
                                  task.agent === 'image' ? 'Image Agent' :
                                  task.agent === 'summary' ? 'Summary Agent' :
                                  task.agent === 'brainstorm' ? 'Brainstorm Agent' :
                                  task.agent === 'document' ? 'Document Agent' :
                                  task.agent === 'case_study' ? 'Case Study Agent' :
                                  task.agent === 'plotting' ? 'Plotting Agent' :
                                  task.agent === 'checklist' ? 'Checklist Agent' :
                                  task.agent === 'calendar' ? 'Calendar Agent' :
                                  task.agent === 'daily_digest' ? 'Daily Digest Agent' :
                                  task.agent === 'call' ? 'Call Agent' :
                                  task.agent === 'whatsapp' ? 'WhatsApp Agent' :
                                  task.agent === 'presentation' ? 'Presentation Agent' : 'AI Agent';
                
                // Find result for this agent
                // Note: The API returns results keyed by "Agent Name" (e.g. "Email Agent"), 
                // but tasks have "agent": "email". We need to match them.
                // The API code does: display_name = agent_name_map.get(agent_name, agent_name.title() + ' Agent')
                const resultKey = agentName; 
                const result = results && results[resultKey];

                return (
                    <div key={index} className="flex gap-4 relative">
                        {/* Timeline Line */}
                        {!isLast && (
                            <div className="absolute left-[11px] top-8 bottom-[-16px] w-[2px] bg-border" />
                        )}

                        {/* Icon */}
                        <div className="relative z-10 shrink-0">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 ${
                                isCompleted 
                                    ? 'bg-green-500/10 border-green-500/50 text-green-500' 
                                    : isProcessing
                                    ? 'bg-blue-500/10 border-blue-500/50 text-blue-500'
                                    : 'bg-secondary border-border text-muted-foreground'
                            }`}>
                                {isCompleted ? (
                                    <Check size={14} />
                                ) : (
                                    <Loader2 size={14} className="animate-spin" />
                                )}
                            </div>
                        </div>

                        {/* Content */}
                        <div className={`flex flex-col pb-6 transition-opacity duration-500 ${isCompleted ? 'opacity-100' : isProcessing ? 'opacity-90' : 'opacity-60'}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-foreground">{agentName}</span>
                                {isCompleted && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-500 font-medium">Done</span>}
                                {isProcessing && !isCompleted && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-500 font-medium animate-pulse">Processing...</span>}
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{task.task}</p>
                            
                            {/* Skeleton Loading for Processing */}
                            {isProcessing && !isCompleted && (
                                <div className="mt-2">
                                    {(task.agent === 'flowchart' || task.agent === 'image' || task.agent === 'plotting') && (
                                        <div className="p-3 bg-secondary/50 rounded-lg border border-border/50">
                                            {task.agent === 'flowchart' ? (
                                                <FlowchartSkeleton />
                                            ) : task.agent === 'plotting' ? (
                                                <ChartSkeleton />
                                            ) : (
                                                <ImageSkeleton />
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {/* Result Preview (Only if completed) */}
                            {isCompleted && result && (
                                <div className="mt-2">
                                    {!expandedTasks.has(index) ? (
                                        // Compact Summary View - Show clickable boxes for media, FileBox for text content
                                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
                                            {result.image_urls && Array.isArray(result.image_urls) && result.image_urls.length > 0 ? (
                                                // Multiple separate charts
                                                result.image_urls.map((imageUrl, imgIndex) => (
                                                    <MediaBox
                                                        key={imgIndex}
                                                        type="chart"
                                                        title={result.chart_types?.[imgIndex] ? `${result.chart_types[imgIndex].charAt(0).toUpperCase() + result.chart_types[imgIndex].slice(1)} Chart` : `Chart ${imgIndex + 1}`}
                                                        onClick={() => {
                                                            setMediaModalContent({
                                                                type: 'chart_image',
                                                                url: `http://localhost:5001${imageUrl}`,
                                                                title: `${result.title || 'Chart'} - ${result.chart_types?.[imgIndex] || 'Chart'} ${imgIndex + 1}`
                                                            });
                                                            setMediaModalOpen(true);
                                                        }}
                                                        onDownload={() => {
                                                            const url = `http://localhost:5001${imageUrl}`;
                                                            const filename = imageUrl.split('/').pop() || `chart_${imgIndex + 1}.png`;
                                                            downloadFile(url, filename);
                                                        }}
                                                    />
                                                ))
                                            ) : (result.flowchart || result.image_url || result.chart_html || result.chart_url) ? (
                                                <MediaBox
                                                    type={result.flowchart ? 'flowchart' : (result.chart_html || result.chart_url || result.image_url) ? 'chart' : 'image'}
                                                    onClick={() => {
                                                        // Open in modal instead of expanding task
                                                        if (result.flowchart) {
                                                            toggleTaskExpansion(index);
                                                        } else if (result.chart_url || result.chart_html || result.image_url) {
                                                            // Open chart in modal
                                                            if (result.chart_html && result.chart_html.trim()) {
                                                                setMediaModalContent({
                                                                    type: 'chart_html',
                                                                    html: result.chart_html,
                                                                    url: result.chart_url,
                                                                    title: result.title || 'Chart'
                                                                });
                                                            } else {
                                                                setMediaModalContent({
                                                                    type: 'chart_image',
                                                                    url: `http://localhost:5001${result.chart_url || result.image_url}`,
                                                                    title: result.title || 'Chart'
                                                                });
                                                            }
                                                            setMediaModalOpen(true);
                                                        } else if (result.image_url) {
                                                            // Open image in modal
                                                            setMediaModalContent({
                                                                type: 'image',
                                                                url: `http://localhost:5001${result.image_url}`,
                                                                title: result.topic || 'Generated Image'
                                                            });
                                                            setMediaModalOpen(true);
                                                        }
                                                    }}
                                                    onDownload={() => {
                                                        if (result.flowchart) {
                                                            toggleTaskExpansion(index);
                                                        } else if (result.chart_url || result.image_url) {
                                                            const url = `http://localhost:5001${result.chart_url || result.image_url}`;
                                                            const filename = (result.chart_url || result.image_url).split('/').pop() || 'chart.png';
                                                            downloadFile(url, filename);
                                                        }
                                                    }}
                                                />
                                            ) : task.agent === 'presentation' && result.pptx_url ? (
                                                // Presentation Download Card
                                                <div className="w-full p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
                                                    <div className="flex items-center justify-between gap-3 mb-3">
                                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                                            <FileText size={24} className="text-blue-500 flex-shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-foreground truncate">
                                                                    {result.topic || 'PowerPoint Presentation'}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                                    {result.slides} slides • {result.template} template
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const url = `http://localhost:5001${result.pptx_url}`;
                                                            const filename = result.filename || result.pptx_url.split('/').pop() || 'presentation.pptx';
                                                            downloadFile(url, filename);
                                                        }}
                                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
                                                    >
                                                        <Download size={14} />
                                                        Download Presentation
                                                    </button>
                                                </div>
                                            ) : task.agent === 'whatsapp' && result.preview_data ? (
                                                // WhatsApp Preview
                                                <WhatsAppPreviewWithState 
                                                    previewData={result.preview_data}
                                                    taskIndex={index}
                                                />
                                            ) : (result.result || result.ideas || result.content || result.summary || result.document || result.message) ? (
                                                // Show FileBox for research, brainstorm, document, summary, case study
                                                // For checklist/calendar/daily_digest, show a simple success card
                                                <div onClick={() => toggleTaskExpansion(index)}>
                                                    {result.message && (task.agent === 'checklist' || task.agent === 'calendar' || task.agent === 'daily_digest') ? (
                                                        <button
                                                            onClick={() => toggleTaskExpansion(index)}
                                                            className="w-full p-3 bg-green-500/10 hover:bg-green-500/20 rounded-lg border border-green-500/20 text-left transition-all group"
                                                        >
                                                            <div className="flex items-center justify-between gap-3">
                                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                    <Check size={16} className="text-green-500 flex-shrink-0" />
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="text-sm font-medium text-foreground truncate">
                                                                            {result.message.split('\n')[0]}
                                                                        </div>
                                                                        <div className="text-xs text-muted-foreground mt-0.5">
                                                                            Click to view details
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <Eye size={16} className="text-muted-foreground flex-shrink-0" />
                                                            </div>
                                                        </button>
                                                    ) : (
                                                        <FileBox
                                                            type={result.result ? 'research' : 
                                                                  result.ideas ? 'brainstorm' :
                                                                  result.content ? 'document' :
                                                                  result.summary ? 'summary' :
                                                                  result.document ? 'case_study' : 'file'}
                                                            filename={result.result ? generateFilename(task.task, 'research', 'research.md') :
                                                                     result.ideas ? generateFilename(task.task, 'brainstorm', 'brainstorm.txt') :
                                                                     result.content ? generateFilename(task.task, 'document', 'document.md') :
                                                                     result.summary ? generateFilename(task.task, 'summary', 'summary.txt') :
                                                                     result.document ? generateFilename(task.task, 'case_study', 'case_study.md') : 'file.txt'}
                                                            content={result.result || result.ideas?.join('\n') || result.content || result.summary || result.document || ''}
                                                        />
                                                    )}
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => toggleTaskExpansion(index)}
                                                    className="w-full p-3 bg-secondary/50 hover:bg-secondary rounded-lg border border-border/50 text-left transition-all group"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                                            <Check size={16} className="text-green-500 flex-shrink-0" />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-foreground truncate">
                                                                    {result.body && `Email drafted: ${result.subject || 'Untitled'}`}
                                                                    {result.response && "Response generated"}
                                                                    {result.error && "Error occurred"}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                                    Click to view details
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Eye size={16} className="text-muted-foreground flex-shrink-0" />
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        // Expanded Full View
                                        <div className="p-3 bg-secondary/50 rounded-lg border border-border/50 text-sm overflow-hidden animate-in fade-in slide-in-from-top-2 duration-500">
                                            <button
                                                onClick={() => toggleTaskExpansion(index)}
                                                className="w-full mb-3 flex items-center justify-between p-2 bg-background/50 hover:bg-background rounded border border-border transition-colors"
                                            >
                                                <span className="text-xs font-medium text-muted-foreground">Click to collapse</span>
                                                <ChevronDown size={14} className="text-muted-foreground rotate-180" />
                                            </button>
                                            
                                            {result.flowchart && (
                                                <FlowchartRenderer 
                                                    flowchart={result.flowchart} 
                                                    index={index}
                                                    mermaidInitialized={mermaidInitialized}
                                                    onModalToggle={onModalToggle}
                                                />
                                            )}
                                            {result.image_urls && Array.isArray(result.image_urls) && result.image_urls.length > 0 && (
                                                <div className="space-y-4">
                                                    {result.image_urls.map((imageUrl, imgIndex) => (
                                                        <div key={imgIndex} className="bg-white rounded-lg p-4 border border-border/50 overflow-auto max-h-[500px] relative group">
                                                            <div 
                                                                className="cursor-pointer hover:opacity-90 transition-opacity"
                                                                onClick={() => {
                                                                    setMediaModalContent({
                                                                        type: 'chart_image',
                                                                        url: `http://localhost:5001${imageUrl}`,
                                                                        title: `${result.title || 'Chart'} - ${result.chart_types?.[imgIndex] || 'Chart'} ${imgIndex + 1}`
                                                                    });
                                                                    setMediaModalOpen(true);
                                                                }}
                                                            >
                                                                <ImageWithLoader
                                                                    src={`http://localhost:5001${imageUrl}`}
                                                                    alt={`Chart ${imgIndex + 1}`}
                                                                    className="w-full rounded-lg"
                                                                    isChart={true}
                                                                />
                                                            </div>
                                                            <div className="mt-2 flex justify-between items-center">
                                                                <span className="text-xs text-muted-foreground">
                                                                    {result.chart_types?.[imgIndex] ? `${result.chart_types[imgIndex].charAt(0).toUpperCase() + result.chart_types[imgIndex].slice(1)} Chart` : `Chart ${imgIndex + 1}`} - Click to view full size
                                                                </span>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        const url = `http://localhost:5001${imageUrl}`;
                                                                        const filename = imageUrl.split('/').pop() || `chart_${imgIndex + 1}.png`;
                                                                        downloadFile(url, filename);
                                                                    }}
                                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                                                                >
                                                                    <Download size={14} />
                                                                    Download
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                            {(result.chart_html || result.chart_url) && (
                                                <div className="bg-white rounded-lg p-4 border border-border/50 overflow-auto max-h-[500px] relative group">
                                                    <div 
                                                        className="cursor-pointer hover:opacity-90 transition-opacity"
                                                        onClick={() => {
                                                            // Check if it's an HTML chart or image chart
                                                            if (result.chart_html) {
                                                                setMediaModalContent({
                                                                    type: 'chart_html',
                                                                    html: result.chart_html,
                                                                    url: result.chart_url,
                                                                    title: result.title || 'Chart'
                                                                });
                                                            } else {
                                                                setMediaModalContent({
                                                                    type: 'chart_image',
                                                                    url: `http://localhost:5001${result.chart_url || result.image_url}`,
                                                                    title: result.title || 'Chart'
                                                                });
                                                            }
                                                            setMediaModalOpen(true);
                                                        }}
                                                    >
                                                        {result.chart_html ? (
                                                            <div dangerouslySetInnerHTML={{ __html: result.chart_html }} />
                                                        ) : (
                                                            <ImageWithLoader
                                                                src={`http://localhost:5001${result.chart_url || result.image_url}`}
                                                                alt="Chart"
                                                                className="w-full rounded-lg"
                                                                isChart={true}
                                                            />
                                                        )}
                                                    </div>
                                                    <div className="mt-2 flex justify-between items-center">
                                                        <span className="text-xs text-muted-foreground">Click to view full size</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const url = `http://localhost:5001${result.chart_url || result.image_url}`;
                                                                const filename = (result.chart_url || result.image_url).split('/').pop() || 'chart.png';
                                                                downloadFile(url, filename);
                                                            }}
                                                            className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                                                        >
                                                            <Download size={14} />
                                                            Download
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            {result.image_url && (
                                                <div className="relative group">
                                                    <div
                                                        className="cursor-pointer hover:opacity-90 transition-opacity"
                                                        onClick={() => {
                                                            setMediaModalContent({
                                                                type: 'image',
                                                                url: `http://localhost:5001${result.image_url}`,
                                                                title: result.topic || 'Generated Image'
                                                            });
                                                            setMediaModalOpen(true);
                                                        }}
                                                    >
                                                        <ImageWithLoader
                                                            src={`http://localhost:5001${result.image_url}`}
                                                            alt="Generated"
                                                            className="rounded-md w-full max-w-[300px] border border-border"
                                                            isChart={false}
                                                        />
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            const url = `http://localhost:5001${result.image_url}`;
                                                            const filename = result.image_url.split('/').pop() || 'image.png';
                                                            downloadFile(url, filename);
                                                        }}
                                                        className="absolute top-2 right-2 p-2 bg-background/80 hover:bg-background rounded-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity"
                                                        title="Download"
                                                    >
                                                        <Download size={16} className="text-foreground" />
                                                    </button>
                                                </div>
                                            )}
                                            {result.body && (
                                                <EmailViewer 
                                                    emailData={{
                                                        to: result.to || '',
                                                        subject: result.subject || 'Untitled',
                                                        body: result.body || ''
                                                    }}
                                                />
                                            )}
                                            {result.event_preview && task.agent === 'calendar' && (
                                                <EventViewer 
                                                    eventData={{
                                                        title: result.event_preview.title || 'New Event',
                                                        description: result.event_preview.description || '',
                                                        start_time: result.event_preview.start_time || '',
                                                        end_time: result.event_preview.end_time || '',
                                                        all_day: result.event_preview.all_day || false,
                                                        location: result.event_preview.location || '',
                                                        color: result.event_preview.color || 'sky'
                                                    }}
                                                />
                                            )}
                                            {result.result && (
                                                <div className="space-y-3">
                                                    <FileBox 
                                                        type="research" 
                                                        filename={generateFilename(task.task, 'research', 'research.md')}
                                                        content={result.result}
                                                    />
                                                    {result.sources && result.sources.length > 0 && (
                                                        <div className="mt-4 p-3 bg-secondary/30 rounded-lg border border-border">
                                                            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">References</div>
                                                            <div className="space-y-1.5">
                                                                {result.sources.map((source, idx) => (
                                                                    <div key={idx} className="text-xs text-foreground/80 flex items-start gap-2">
                                                                        <span className="text-muted-foreground font-medium">{idx + 1}.</span>
                                                                        <a 
                                                                            href={source} 
                                                                            target="_blank" 
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-500 hover:underline break-all"
                                                                        >
                                                                            {source}
                                                                        </a>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {result.ideas && (
                                                <FileBox 
                                                    type="brainstorm" 
                                                    filename={generateFilename(task.task, 'brainstorm', 'brainstorm.txt')}
                                                    content={result.ideas.join('\n')}
                                                />
                                            )}
                                            {result.content && (
                                                <FileBox 
                                                    type="document" 
                                                    filename={generateFilename(task.task, 'document', 'document.md')}
                                                    content={result.content}
                                                />
                                            )}
                                            {result.summary && (
                                                <FileBox 
                                                    type="summary" 
                                                    filename={generateFilename(task.task || 'summary', 'summary', 'summary.md')}
                                                    content={result.summary}
                                                />
                                            )}
                                            {result.document && (
                                                <FileBox 
                                                    type="case_study" 
                                                    filename={generateFilename(task.task, 'case_study', 'case_study.md')}
                                                    content={result.document}
                                                />
                                            )}
                                            {result.message && (task.agent === 'checklist' || task.agent === 'calendar' || task.agent === 'daily_digest') && (
                                                <div className="space-y-2">
                                                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                                                        <div className="text-sm text-foreground/90 whitespace-pre-wrap">
                                                            {result.message}
                                                        </div>
                                                    </div>
                                                    {result.details && result.details.length > 0 && (
                                                        <div className="p-3 bg-secondary/30 rounded-lg border border-border">
                                                            <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Details</div>
                                                            <div className="space-y-1 text-sm text-foreground/80">
                                                                {result.details.map((detail, idx) => (
                                                                    <div key={idx} className="whitespace-pre-wrap">{detail}</div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {task.agent === 'checklist' && (
                                                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-600 dark:text-blue-400">
                                                            💡 Your todos are synced with the Todos page. Navigate there to see all your tasks!
                                                        </div>
                                                    )}
                                                    {task.agent === 'calendar' && (
                                                        <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-600 dark:text-blue-400">
                                                            📅 Your events are synced with the Calendar page. Navigate there to see your full schedule!
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {result.response && (
                                                <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                                                    {result.response}
                                                </div>
                                            )}
                                            {result.error && (
                                                <div className="text-red-400">Error: {result.error}</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Image/Media Modal Component
const MediaModal = ({ isOpen, onClose, children, title }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="relative max-w-6xl max-h-[90vh] w-full mx-4 bg-background rounded-xl border border-border shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
                    <h3 className="text-lg font-semibold text-foreground">{title || 'Preview'}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Press ESC to close</span>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>
                
                {/* Content */}
                <div className="overflow-auto max-h-[calc(90vh-64px)] p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

const FastMode = ({ navigateOnly, user, messages, setMessages, onAuthClick }) => {
    // messages state is now lifted to App.jsx

    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showFileOptions, setShowFileOptions] = useState(false);
    const [summaryFocus, setSummaryFocus] = useState('general');
    const [summaryLength, setSummaryLength] = useState('medium');
    const [isUploading, setIsUploading] = useState(false);
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [mediaModalContent, setMediaModalContent] = useState(null);
    const [pptViewerOpen, setPptViewerOpen] = useState(false);
    const [pptViewerData, setPptViewerData] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messages.length > 2) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = ['.pdf', '.txt', '.md', '.docx', '.doc'];
            const fileExt = '.' + file.name.split('.').pop().toLowerCase();
            
            if (!allowedTypes.includes(fileExt)) {
                alert(`Unsupported file type. Allowed: ${allowedTypes.join(', ')}`);
                return;
            }
            
            setSelectedFile(file);
            setShowFileOptions(true);
            
            // Clear file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleCancelFile = () => {
        setSelectedFile(null);
        setShowFileOptions(false);
        setSummaryFocus('general');
        setSummaryLength('medium');
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;
        
        if (!user) {
            const authPromptMsg = {
                id: Date.now(),
                role: 'ai',
                content: "Please sign up or sign in to use AI agents. Click the button below to get started!",
                requiresAuth: true
            };
            setMessages(prev => [...prev, authPromptMsg]);
            return;
        }

        setIsUploading(true);
        
        const userMsg = { 
            id: Date.now(), 
            role: 'user', 
            content: `Uploaded: ${selectedFile.name} (Focus: ${summaryFocus}, Length: ${summaryLength})` 
        };
        setMessages(prev => [...prev, userMsg]);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('focus', summaryFocus);
            formData.append('max_length', summaryLength);

            const response = await fetch('http://localhost:5001/api/summary/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.status === 'success') {
                const aiMsg = {
                    id: Date.now() + 1,
                    role: 'ai',
                    content: "File summarized successfully.",
                    data: {
                        tasks: [{ agent: 'summary', task: `Summarize ${selectedFile.name}` }],
                        results: {
                            'Summary Agent': {
                                summary: data.result?.summary || ''
                            }
                        }
                    },
                    isProcessing: false
                };
                setMessages(prev => [...prev, aiMsg]);
            } else {
                const errorMsg = {
                    id: Date.now() + 1,
                    role: 'ai',
                    content: `Error: ${data.error || 'Failed to summarize file'}`
                };
                setMessages(prev => [...prev, errorMsg]);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            const errorMsg = {
                id: Date.now() + 1,
                role: 'ai',
                content: "Sorry, I encountered an error uploading the file. Please try again."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsUploading(false);
            setSelectedFile(null);
            setShowFileOptions(false);
            setSummaryFocus('general');
            setSummaryLength('medium');
        }
    };

    const handleSend = async () => {
        if (!inputValue.trim()) return;

        // Check if user is authenticated
        if (!user) {
            // Show sign-in prompt message
            const authPromptMsg = {
                id: Date.now(),
                role: 'ai',
                content: "Please sign up or sign in to use AI agents. Click the button below to get started!",
                requiresAuth: true
            };
            setMessages(prev => [...prev, authPromptMsg]);
            return;
        }

        const userMsg = { id: Date.now(), role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");
        
        // Reset textarea height
        const textarea = document.querySelector('textarea[placeholder*="What can I do"]');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = '60px';
        }
        
        setIsLoading(true);

        try {
            // First, show a routing/planning message immediately
            const planningMsg = {
                id: Date.now() + 0.5,
                role: 'ai',
                content: "Analyzing your request and routing to appropriate agents...",
                isPlanning: true
            };
            setMessages(prev => [...prev, planningMsg]);

            // Use streaming endpoint for progressive results
            const response = await fetch('http://localhost:5001/api/process-stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    prompt: userMsg.content,
                    user: user?.user_metadata?.username || user?.email || null
                }),
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let tasksData = null;
            let resultsData = {};
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop(); // Keep incomplete line in buffer
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            
                            if (data.type === 'tasks') {
                                tasksData = data.tasks;
                                // Remove planning, show initial AI message with tasks
                                setMessages(prev => {
                                    const filtered = prev.filter(msg => !msg.isPlanning);
                                    return [...filtered, {
                                        id: Date.now() + 1,
                                        role: 'ai',
                                        content: "Processing your request...",
                                        data: { tasks: data.tasks, results: {} },
                                        isProcessing: true
                                    }];
                                });
                            } else if (data.type === 'result') {
                                // Update results incrementally
                                resultsData[data.agent] = data.data || { error: data.error };
                                
                                setMessages(prev => {
                                    const lastMsg = prev[prev.length - 1];
                                    if (lastMsg && lastMsg.role === 'ai' && lastMsg.data) {
                                        return [
                                            ...prev.slice(0, -1),
                                            {
                                                ...lastMsg,
                                                data: {
                                                    tasks: tasksData,
                                                    results: {...resultsData}
                                                }
                                            }
                                        ];
                                    }
                                    return prev;
                                });
                            } else if (data.type === 'complete') {
                                // Mark as complete
                                setMessages(prev => {
                                    const lastMsg = prev[prev.length - 1];
                                    if (lastMsg && lastMsg.role === 'ai') {
                                        return [
                                            ...prev.slice(0, -1),
                                            { ...lastMsg, isProcessing: false, content: "Task completed." }
                                        ];
                                    }
                                    return prev;
                                });
                            } else if (data.type === 'error') {
                                throw new Error(data.error);
                            }
                        } catch (parseError) {
                            console.error("Error parsing SSE data:", parseError);
                        }
                    }
                }
            }
        } catch (error) {
            console.error("Error calling API:", error);
            // Remove planning message on error
            setMessages(prev => prev.filter(msg => !msg.isPlanning));
            const errorMsg = {
                id: Date.now() + 1,
                role: 'ai',
                content: "Sorry, I encountered an error connecting to the agent server. Is it running on port 5000?"
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="feed-page min-h-screen bg-background relative pb-40">
            <div className="content-overlay content-area pt-24 max-w-2xl mx-auto px-4">
                <div className="relative flex flex-col items-center mb-10 mt-8 py-6 px-6 rounded-3xl border border-border/40 shadow-lg backdrop-blur-md bg-secondary/10 w-full max-w-3xl mx-auto">
                    {user && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs text-muted-foreground bg-background/50 px-3 py-1.5 rounded-full border border-border/50 shadow-sm">
                            <span className="flex items-center gap-1 font-medium text-foreground">
                                <DesignedAtSymbol size={12} />
                                {user.user_metadata?.username || user.email?.split('@')[0]}
                            </span>
                            <span>has {user.user_metadata?.credits ?? 0} credits</span>
                        </div>
                    )}
                    <div className="p-2.5 rounded-xl bg-background/80 mb-3 shadow-sm border border-border/50">
                        <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400/20" />
                    </div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">Fast Mode</h1>
                    <p className="text-muted-foreground text-center text-sm">
                        Chat with AI agents to get things done quickly.
                    </p>
                </div>

                <div className="sticky-nav-container mb-8">
                    <MagneticMorphingNav
                        activeTab="fastmode"
                        onTabChange={(id) => navigateOnly(id)}
                        user={user}
                    />
                </div>

                <div className="chat-container space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {msg.role === 'ai' && (
                                <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 shadow-sm">
                                    <Sparkles size={14} className="text-yellow-400" />
                                </div>
                            )}
                            {msg.role === 'user' && user?.user_metadata?.avatar_url && (
                                <img src={user.user_metadata.avatar_url} alt="User" className="w-8 h-8 rounded-full object-cover shrink-0" />
                            )}
                            {msg.role === 'user' && !user?.user_metadata?.avatar_url && (
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                                    {user ? user.email[0].toUpperCase() : 'U'}
                                </div>
                            )}

                            <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`relative px-5 py-3 text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-secondary text-secondary-foreground rounded-2xl rounded-tr-sm'
                                    : msg.requiresAuth
                                    ? 'bg-yellow-500/10 border border-yellow-500/20 rounded-2xl'
                                    : 'text-muted-foreground'
                                    }`}>
                                    {msg.role === 'ai' ? (
                                        msg.requiresAuth ? (
                                            <div className="flex flex-col gap-3">
                                                <div className="whitespace-pre-wrap text-foreground">
                                                    {msg.content}
                                                </div>
                                                <button
                                                    onClick={() => onAuthClick && onAuthClick(0, 'default')}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                                                >
                                                    <LogIn size={16} />
                                                    Sign In / Sign Up
                                                </button>
                                            </div>
                                        ) : msg.data && msg.data.tasks && msg.data.tasks.length === 1 && msg.data.tasks[0].agent === 'general' && msg.data.results && msg.data.results['Assistant'] ? (
                                            // For simple greetings/general responses, just show the text
                                            <div className="whitespace-pre-wrap text-foreground">
                                                {msg.data.results['Assistant'].response || msg.content}
                                            </div>
                                        ) : msg.data && msg.data.tasks ? (
                                            <TaskTimeline 
                                                tasks={msg.data.tasks} 
                                                results={msg.data.results} 
                                                isProcessing={msg.isProcessing || false}
                                                onModalToggle={setIsModalOpen}
                                                setMediaModalContent={setMediaModalContent}
                                                setMediaModalOpen={setMediaModalOpen}
                                                setPptViewerData={setPptViewerData}
                                                setPptViewerOpen={setPptViewerOpen}
                                            />
                                        ) : (
                                            <div className="whitespace-pre-wrap">
                                                {msg.content}
                                            </div>
                                        )
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center shrink-0 shadow-sm">
                                <Sparkles size={14} className="text-yellow-400 animate-pulse" />
                            </div>
                            <div className="flex flex-col max-w-[80%] items-start">
                                <div className="text-muted-foreground px-5 py-3 text-sm">
                                    <span className="animate-pulse">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-2xl z-50 transition-all duration-300 ${isModalOpen ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
                <div className="relative rounded-3xl bg-card border border-border p-4 shadow-2xl">
                    {/* Top Badge */}
                    {/* <div className="flex justify-between items-center mb-4 px-2">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-white flex items-center gap-1">AI <Sparkles size={12} className="text-yellow-400" /></span>
                            <span className="text-zinc-400 text-sm">is free this weekend!</span>
                        </div>
                        <span className="text-zinc-500 text-xs font-medium cursor-pointer hover:text-white transition-colors">Ship Now!</span>
                    </div> */}

                    {/* File Options Panel */}
                    {showFileOptions && selectedFile && (
                        <div className="mb-4 p-4 bg-secondary/30 rounded-xl border border-border">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <FileText size={18} className="text-primary" />
                                    <span className="text-sm font-medium text-foreground">{selectedFile.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        ({(selectedFile.size / 1024).toFixed(1)} KB)
                                    </span>
                                </div>
                                <button
                                    onClick={handleCancelFile}
                                    className="p-1 hover:bg-background rounded transition-colors text-muted-foreground hover:text-foreground"
                                    title="Remove file"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1.5 block">Summary Focus:</label>
                                    <select
                                        value={summaryFocus}
                                        onChange={(e) => setSummaryFocus(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="general">General (All key points)</option>
                                        <option value="key_points">Key Points Only</option>
                                        <option value="action_items">Action Items & Tasks</option>
                                        <option value="decisions">Decisions & Outcomes</option>
                                        <option value="timeline">Chronological Timeline</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="text-xs text-muted-foreground mb-1.5 block">Summary Length:</label>
                                    <select
                                        value={summaryLength}
                                        onChange={(e) => setSummaryLength(e.target.value)}
                                        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                    >
                                        <option value="short">Short (3-5 bullet points, ~50 words)</option>
                                        <option value="medium">Medium (8-12 bullet points, ~150 words)</option>
                                        <option value="long">Long (15-20 bullet points, ~300 words)</option>
                                    </select>
                                </div>
                                
                                <button
                                    onClick={handleFileUpload}
                                    disabled={isUploading}
                                    className={`w-full px-4 py-2 rounded-lg font-medium transition-opacity flex items-center justify-center gap-2 ${
                                        isUploading
                                            ? 'bg-primary/50 text-primary-foreground cursor-wait'
                                            : 'bg-primary text-primary-foreground hover:opacity-90'
                                    }`}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Summarizing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FileText size={16} />
                                            <span>Summarize File</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    {!user && (
                        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-3xl flex items-center justify-center z-10 border border-border/50">
                            <div className="text-center px-6 py-4">
                                <p className="text-foreground font-medium mb-2">Sign in required</p>
                                <p className="text-muted-foreground text-sm mb-4">Please sign up or sign in to use AI agents</p>
                                <button
                                    onClick={() => onAuthClick && onAuthClick(0, 'default')}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium mx-auto"
                                >
                                    <LogIn size={16} />
                                    Sign In / Sign Up
                                </button>
                            </div>
                        </div>
                    )}
                    <textarea
                        placeholder={user ? (showFileOptions ? "File selected. Configure options above or type a message..." : "What can I do for you?") : "Sign in to use AI agents"}
                        className="w-full bg-transparent text-xl text-foreground placeholder:text-muted-foreground outline-none pb-8 px-2 resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={!user || isUploading}
                        rows={1}
                        style={{ 
                            height: 'auto',
                            minHeight: '60px'
                        }}
                        onInput={(e) => {
                            e.target.style.height = 'auto';
                            e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
                        }}
                    />

                    {/* Bottom Controls */}
                    <div className="flex items-center justify-between px-2">
                        <button className="flex items-center gap-2 bg-secondary hover:bg-muted transition-colors rounded-full px-3 py-1.5 text-sm text-secondary-foreground border border-border">
                            <span className="font-semibold text-foreground">Ax</span> Bianca-v1 <ChevronDown size={14} />
                        </button>

                        <div className="flex items-center gap-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept=".pdf,.txt,.md,.docx,.doc"
                                onChange={handleFileSelect}
                                disabled={!user || isUploading}
                            />
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                disabled={!user || isUploading || showFileOptions}
                                className={`p-2 transition-all rounded-lg border border-border ${!user || isUploading || showFileOptions
                                    ? 'text-muted-foreground cursor-not-allowed opacity-50'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                    }`}
                                title="Upload file to summarize (PDF, DOCX, TXT, MD)"
                            >
                                <Upload size={20} />
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={!user || isUploading}
                                className={`p-2 transition-all rounded-xl border border-border ${!user || isUploading
                                    ? 'bg-secondary text-muted-foreground cursor-not-allowed opacity-50'
                                    : inputValue.trim()
                                    ? 'bg-foreground text-background hover:opacity-90'
                                    : 'bg-secondary text-muted-foreground hover:bg-muted'
                                    }`}
                            >
                                <ArrowUp size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Modal */}
            <MediaModal
                isOpen={mediaModalOpen}
                onClose={() => {
                    setMediaModalOpen(false);
                    setMediaModalContent(null);
                }}
                title={mediaModalContent?.title || 'Preview'}
            >
                {mediaModalContent?.type === 'image' && (
                    <div className="flex flex-col items-center gap-4">
                        <ImageWithLoader
                            src={mediaModalContent.url}
                            alt={mediaModalContent.title}
                            className="max-w-full max-h-[70vh] object-contain rounded-lg"
                            isChart={false}
                        />
                        <button
                            onClick={() => {
                                const filename = mediaModalContent.url.split('/').pop() || 'image.png';
                                downloadFile(mediaModalContent.url, filename);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Download size={16} />
                            Download Image
                        </button>
                    </div>
                )}
                {mediaModalContent?.type === 'chart_html' && (
                    <div className="flex flex-col gap-4">
                        <div className="bg-white rounded-lg p-6">
                            <div dangerouslySetInnerHTML={{ __html: mediaModalContent.html }} />
                        </div>
                        {mediaModalContent.url && (
                            <div className="flex justify-center">
                                <button
                                    onClick={() => {
                                        window.open(`http://localhost:5001${mediaModalContent.url}`, '_blank');
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                                >
                                    <Download size={16} />
                                    Open Full Chart in New Tab
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {mediaModalContent?.type === 'chart_image' && (
                    <div className="flex flex-col items-center gap-4">
                        <ImageWithLoader
                            src={mediaModalContent.url}
                            alt={mediaModalContent.title}
                            className="max-w-full max-h-[70vh] object-contain rounded-lg bg-white p-4"
                            isChart={true}
                        />
                        <button
                            onClick={() => {
                                const filename = mediaModalContent.url.split('/').pop() || 'chart.png';
                                downloadFile(mediaModalContent.url, filename);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Download size={16} />
                            Download Chart
                        </button>
                    </div>
                )}
            </MediaModal>
            
            <PPTViewerModal
                isOpen={pptViewerOpen}
                onClose={() => {
                    setPptViewerOpen(false);
                    setPptViewerData(null);
                }}
                pptUrl={pptViewerData?.url}
                title={pptViewerData?.title}
                slides={pptViewerData?.slides}
            />
        </div>
    );
};

export default FastMode;
