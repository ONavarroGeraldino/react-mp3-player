const shapes = ['ESFERA', 'TORO', 'HELICE', 'VORTEX', 'ONDA', 'CUBO'];

const ShapeSwitcher = ({ currentShape, onChange }) => {
  const next = () => {
    onChange((currentShape + 1) % shapes.length);
  };

  return (
    <button
      onClick={next}
      className="fixed top-16 left-4 z-50 btn-bevel bg-[#2a2a3a] hover:bg-[#3d3d52] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#94a3b8] hover:text-white transition-colors"
      title="Cambiar figura"
    >
      {shapes[currentShape]}
    </button>
  );
};

export default ShapeSwitcher;
