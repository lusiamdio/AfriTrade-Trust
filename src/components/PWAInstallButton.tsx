import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../i18n/translations';

interface PWAInstallButtonProps {
  currentLang?: LanguageCode;
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  currentLang = 'en',
  compact = false,
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already running as installed standalone app, suppress prompt
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => setInstallSuccess(false), 4000);
    }
  };

  const labels = {
    en: {
      installApp: 'Install Offline App',
      installIOS: 'Add to Home Screen',
      installSuccess: 'App Installed!',
      iosInstructionsTitle: 'Install AfriTrade on iPhone / iPad',
      step1: 'Tap the Share icon in the Safari toolbar.',
      step2: 'Scroll down and select "Add to Home Screen".',
      close: 'Got it',
    },
    fr: {
      installApp: 'Installer l’application hors-ligne',
      installIOS: 'Ajouter à l’écran d’accueil',
      installSuccess: 'Application installée !',
      iosInstructionsTitle: 'Installer AfriTrade sur iPhone / iPad',
      step1: 'Appuyez sur le bouton Partager dans la barre Safari.',
      step2: 'Faites défiler vers le bas et sélectionnez "Sur l’écran d’accueil".',
      close: 'Fermer',
    },
    pt: {
      installApp: 'Instalar App Offline',
      installIOS: 'Adicionar ao Ecrã Principal',
      installSuccess: 'App Instalada!',
      iosInstructionsTitle: 'Instalar AfriTrade no iPhone / iPad',
      step1: 'Toque no ícone Partilhar na barra do Safari.',
      step2: 'Deslize para baixo e selecione "Adicionar ao Ecrã Principal".',
      close: 'Entendido',
    },
    sw: {
      installApp: 'Sakinisha App Bila Mtandao',
      installIOS: 'Weka kwenye Skrini ya Kwanza',
      installSuccess: 'App Imesakinishwa!',
      iosInstructionsTitle: 'Sakinisha AfriTrade kwenye iPhone / iPad',
      step1: 'Gusa kitufe cha Shiriki (Share) katika Safari.',
      step2: 'Shuka chini kisha chagua "Ongeza kwenye Skrini ya Kwanza".',
      close: 'Sawa',
    },
    ar: {
      installApp: 'تثبيت التطبيق للعمل دون اتصال',
      installIOS: 'إضافة إلى الشاشة الرئيسية',
      installSuccess: 'تم التثبيت بنجاح!',
      iosInstructionsTitle: 'تثبيت AfriTrade على الآيفون والآيباد',
      step1: 'اضغط على زر المشاركة في شريط متصفح سفاري.',
      step2: 'مرر لأسفل واختر "إضافة إلى الشاشة الرئيسية".',
      close: 'فهمت',
    },
  }[currentLang] || {
    installApp: 'Install Offline App',
    installIOS: 'Add to Home Screen',
    installSuccess: 'App Installed!',
    iosInstructionsTitle: 'Install AfriTrade on iPhone / iPad',
    step1: 'Tap the Share icon in the Safari toolbar.',
    step2: 'Scroll down and select "Add to Home Screen".',
    close: 'Got it',
  };

  if (installSuccess) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-black font-semibold text-xs shadow-md">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>{labels.installSuccess}</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (compact) {
      return (
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center cursor-pointer transition-colors shadow-md"
          title={labels.installApp}
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={handleInstallClick}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer transition-all shadow-md group"
      >
        <div className="flex items-center gap-2">
          <Download className="w-3.5 h-3.5 text-neutral-300 group-hover:scale-110 transition-transform" />
          <span>{labels.installApp}</span>
        </div>
        <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
          PWA
        </span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        {compact ? (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="w-8 h-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white flex items-center justify-center cursor-pointer transition-colors shadow-md"
            title={labels.installIOS}
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowIOSGuide(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-white cursor-pointer transition-all shadow-md"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-3.5 h-3.5 text-neutral-300" />
              <span>{labels.installIOS}</span>
            </div>
            <span className="text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
              iOS
            </span>
          </button>
        )}

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="w-full max-w-sm rounded-3xl bg-neutral-950 p-6 shadow-2xl border border-neutral-800 space-y-4 text-white">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">{labels.iosInstructionsTitle}</h3>
                <button
                  type="button"
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-neutral-300 space-y-2.5 leading-relaxed">
                <div className="flex items-start gap-2.5 bg-neutral-900 p-3 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-white text-black font-bold flex items-center justify-center shrink-0 text-[11px]">
                    1
                  </span>
                  <span>{labels.step1}</span>
                </div>
                <div className="flex items-start gap-2.5 bg-neutral-900 p-3 rounded-xl">
                  <span className="w-5 h-5 rounded-full bg-white text-black font-bold flex items-center justify-center shrink-0 text-[11px]">
                    2
                  </span>
                  <span>{labels.step2}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 bg-white text-black font-bold text-xs rounded-xl hover:bg-neutral-200 cursor-pointer transition-colors"
              >
                {labels.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
