import { useState, useEffect } from 'react';

let installPrompt = null;

export function setInstallPrompt(e) {
  e.preventDefault();
  installPrompt = e;
}

const InstallButton = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (installPrompt) {
      setVisible(true);
    }
    const handler = (e) => {
      installPrompt = e;
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setVisible(false);
    }
    installPrompt = null;
  };

  if (!visible) return null;

  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-4 right-4 z-50 btn-bevel bg-[#2a2a3a] hover:bg-[#3d3d52] px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#ff2d95] hover:text-white transition-all"
      title="Instalar como app"
    >
      <span className="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        INSTALAR APP
      </span>
    </button>
  );
};

export default InstallButton;
