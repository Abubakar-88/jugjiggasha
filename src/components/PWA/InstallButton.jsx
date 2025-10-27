import React from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

const InstallButton = () => {
  const { isInstallable, install } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <button
      onClick={install}
      className="
        flex items-center justify-center space-x-1 sm:space-x-2
        bg-green-600 hover:bg-green-700 text-white
        px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base
        rounded-lg transition-colors bangla-text
      "
    >
      <Download className="h-4 w-4 sm:h-5 sm:w-5" />
      <span className="hidden sm:inline">অ্যাপ ইন্সটল করুন</span>
      <span className="inline sm:hidden">ইন্সটল</span>
    </button>
  );
};
export default InstallButton;