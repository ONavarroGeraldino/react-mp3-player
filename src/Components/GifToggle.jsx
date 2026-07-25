const GifToggle = ({ active, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-28 left-4 z-50 btn-bevel bg-[#2a2a3a] hover:bg-[#3d3d52] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors"
      style={{ color: active ? '#00ff88' : '#64748b' }}
      title="Toggle pixel pets"
    >
      PETS {active ? 'ON' : 'OFF'}
    </button>
  );
};

export default GifToggle;
