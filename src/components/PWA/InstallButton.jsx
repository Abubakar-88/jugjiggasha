import React from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

const InstallButton = () => {
  const { isInstallable, install } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <button
      onClick={install}
      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors bangla-text"
    >
      <Download className="h-4 w-4" />
      <span>অ্যাপ ইন্সটল করুন</span>
    </button>
  );
};

export default InstallButton;