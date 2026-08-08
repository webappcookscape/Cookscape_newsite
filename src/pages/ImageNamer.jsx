import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GALLERY_COLLECTION } from '../data/siteData';

const ImageNamer = () => {
  // Load initial collection
  const [collection, setCollection] = useState(GALLERY_COLLECTION);
  const [activeCategory, setActiveCategory] = useState('Modular kitchen');
  const [newName, setNewName] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  // Identify generic items (excluding Bedroom, per user request)
  const genericItems = useMemo(() => {
    const genericRegex = /design\s+\d+|enscape|whatsapp|^\d+$|^[a-z]+$/i;
    return collection.filter(item => {
      if (item.category.toLowerCase() === 'bedroom') return false;
      return genericRegex.test(item.title) || genericRegex.test(item.url);
    });
  }, [collection]);

  // Categories with generic items remaining
  const categoriesWithGenerics = useMemo(() => {
    const cats = new Set(genericItems.map(item => item.category));
    return [...cats];
  }, [genericItems]);

  // Filter generic items for the currently selected category
  const filteredGenerics = useMemo(() => {
    return genericItems.filter(item => item.category === activeCategory);
  }, [genericItems, activeCategory]);

  // Select the first image in the active category list to name
  const currentImage = filteredGenerics[0] || null;

  const handleRename = async (e) => {
    e.preventDefault();
    if (!currentImage || !newName.trim()) return;

    setIsLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:6000/api/rename-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldUrl: currentImage.url,
          newName: newName.trim(),
          category: currentImage.category,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to rename image.');
      }

      // Update state locally
      setCollection(prev =>
        prev.map(item =>
          item.url === currentImage.url
            ? { ...item, url: data.newUrl, title: data.newTitle }
            : item
        )
      );

      setStatus({ type: 'success', message: `Successfully renamed to: ${data.newTitle}` });
      setNewName('');
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#faf9f6', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', fontFamily: 'Outfit, sans-serif' }}>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', letterSpacing: '0.3em', color: '#b81c22', fontWeight: 800, textTransform: 'uppercase' }}>
            ✦ Admin Utility Dashboard
          </span>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', margin: '10px 0 20px', color: '#1a1a1a' }}>
            Gallery Image Namer
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem' }}>
            Name the remaining balance unit images based on what they look like. This updates the local files and code config automatically.
          </p>
        </div>

        {/* Category Pills Selector */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
          {['Modular kitchen', 'TV unit', 'Crockery unit', 'Pooja Unit', 'Kids Furniture', 'Living Room', 'Foyer', 'Wardrobe'].map(cat => {
            const count = genericItems.filter(item => item.category === cat).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setStatus({ type: '', message: '' });
                  setNewName('');
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '100px',
                  border: isActive ? '1px solid #1a1a1a' : '1px solid rgba(0,0,0,0.1)',
                  background: isActive ? '#1a1a1a' : 'transparent',
                  color: isActive ? '#fff' : '#555',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                }}
              >
                <span>{cat}</span>
                <span style={{
                  fontSize: '0.75rem',
                  background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                  padding: '2px 8px',
                  borderRadius: '100px',
                  color: isActive ? '#fff' : '#b81c22',
                  fontWeight: 700
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status Message */}
        {status.message && (
          <div style={{
            maxWidth: '800px',
            margin: '0 auto 30px',
            padding: '16px 24px',
            borderRadius: '12px',
            background: status.type === 'success' ? '#eefcf5' : '#fdf2f2',
            border: status.type === 'success' ? '1px solid #22c55e' : '1px solid #ef4444',
            color: status.type === 'success' ? '#166534' : '#991b1b',
            fontSize: '0.95rem',
            textAlign: 'center'
          }}>
            {status.message}
          </div>
        )}

        {/* Namer Workspace Area */}
        <AnimatePresence mode="wait">
          {currentImage ? (
            <motion.div
              key={currentImage.url}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '40px',
                background: '#ffffff',
                borderRadius: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.05)',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.04)',
                maxWidth: '1100px',
                margin: '0 auto'
              }}
            >
              {/* Image Box */}
              <div style={{ background: '#f5f5f3', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', height: '550px' }}>
                <img
                  src={currentImage.url}
                  alt="Current design to rename"
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }}
                />
                <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem' }}>
                  {currentImage.url}
                </div>
              </div>

              {/* Form Box */}
              <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#b81c22', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Category: {currentImage.category}
                </span>
                <h2 style={{ fontSize: '2rem', margin: '10px 0 30px', color: '#1a1a1a', fontWeight: 600 }}>
                  Assign Descriptive Name
                </h2>

                <form onSubmit={handleRename} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>
                      Current Generic Title
                    </label>
                    <input
                      type="text"
                      disabled
                      value={currentImage.title}
                      style={{ padding: '16px', borderRadius: '12px', border: '1px solid #eee', background: '#fafafa', color: '#888', fontSize: '1rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label htmlFor="new-name-input" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#333' }}>
                      New Look-based Name (e.g. Modern Acrylic Teal Kitchen)
                    </label>
                    <input
                      id="new-name-input"
                      type="text"
                      required
                      placeholder="Describe what you see in the render..."
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', background: '#faf9f6', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={(e) => e.target.style.borderColor = '#b81c22'}
                      onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !newName.trim()}
                    style={{
                      background: '#1a1a1a',
                      color: '#fff',
                      border: 'none',
                      padding: '18px',
                      borderRadius: '100px',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease',
                      opacity: isLoading || !newName.trim() ? 0.6 : 1
                    }}
                  >
                    {isLoading ? 'Renaming...' : 'Save & Next Image ➔'}
                  </button>
                </form>

                <div style={{ marginTop: '40px', borderTop: '1px solid #eee', paddingTop: '20px', color: '#666', fontSize: '0.9rem' }}>
                  <strong>Progress Info:</strong> {filteredGenerics.length} generic images remaining in <em>{activeCategory}</em>.
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                textAlign: 'center',
                padding: '80px 40px',
                background: '#ffffff',
                borderRadius: '24px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.03)',
                maxWidth: '600px',
                margin: '0 auto',
                border: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🎉</div>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.2rem', color: '#1a1a1a', marginBottom: '15px' }}>
                All Clear!
              </h2>
              <p style={{ color: '#666', lineHeight: 1.6, fontSize: '1.1rem', marginBottom: '30px' }}>
                There are no more generic images left in the <strong>{activeCategory}</strong> category. All assets now have unique, descriptive names!
              </p>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <a href="/portfolio" style={{ padding: '14px 28px', borderRadius: '100px', background: '#b81c22', color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}>
                  View Live Gallery
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ImageNamer;
