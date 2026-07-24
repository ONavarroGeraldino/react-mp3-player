const styles = ['FISICO', 'GLASS', 'NEON', 'RETRO', 'CHROME', 'LAVA'];

const StyleSwitcher = ({ currentStyle, onChange }) => {
  const next = () => {
    onChange((currentStyle + 1) % styles.length);
  };

  return (
    <button
      onClick={next}
      className="fixed top-4 left-4 z-50 btn-bevel bg-[#2a2a3a] hover:bg-[#3d3d52] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] hover:text-white transition-colors"
      title="Cambiar estilo"
    >
      {styles[currentStyle]}
    </button>
  );
};

export default StyleSwitcher;
