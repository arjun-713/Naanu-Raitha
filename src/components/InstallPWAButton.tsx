import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Check, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { toast } from 'sonner';

interface InstallPWAButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const InstallPWAButton: React.FC<InstallPWAButtonProps> = ({ 
  variant = 'default', 
  size = 'default',
  className 
}) => {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast.success('App installed successfully!');
    } else {
      toast.error('Installation cancelled or failed');
    }
  };

  if (isInstalled) {
    return (
      <Button 
        variant="outline" 
        size={size}
        className={className}
        disabled
      >
        <Check className="w-4 h-4 mr-2" />
        Installed
      </Button>
    );
  }

  if (!isInstallable) {
    return null;
  }

  return (
    <Button 
      onClick={handleInstall}
      variant={variant}
      size={size}
      className={className}
    >
      <Download className="w-4 h-4 mr-2" />
      Install App
    </Button>
  );
};

// Alternative compact version for mobile
export const InstallPWAIcon: React.FC<{ className?: string }> = ({ className }) => {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();

  if (isInstalled || !isInstallable) return null;

  return (
    <Button
      onClick={installApp}
      size="sm"
      variant="ghost"
      className={`p-2 ${className}`}
    >
      <Smartphone className="w-5 h-5" />
    </Button>
  );
};

export default InstallPWAButton;
