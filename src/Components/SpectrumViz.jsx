const SpectrumViz = ({ freqData, accentColor, accentRgb }) => {
  if (!freqData || freqData.length === 0) return null;

  const bars = Array.from(freqData).slice(0, 32);
  const maxVal = Math.max(...bars, 1);

  return (
    <div className="flex items-end justify-center gap-[1px] h-12 w-full px-1">
      {bars.map((val, i) => {
        const height = Math.max(2, (val / maxVal) * 100);
        return (
          <span
            key={i}
            className="flex-1 rounded-none transition-all duration-[50ms]"
            style={{
              height: `${height}%`,
              backgroundColor: accentColor,
              boxShadow: `0 0 4px rgba(${accentRgb},0.5), 0 0 2px rgba(${accentRgb},0.3)`,
              opacity: 0.4 + (val / maxVal) * 0.6,
            }}
          />
        );
      })}
    </div>
  );
};

export default SpectrumViz;
