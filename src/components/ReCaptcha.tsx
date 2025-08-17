import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export interface ReCaptchaRef {
  reset: () => void;
  getValue: () => string | null;
  execute: () => void;
}

interface ReCaptchaProps {
  onChange?: (token: string | null) => void;
  onExpired?: () => void;
  onError?: () => void;
}

const RECAPTCHA_SITE_KEY = '6LdYeqcrAAAAAFP8DwaRhxjSogUEQfh2WuayEJcz';

const ReCaptcha = forwardRef<ReCaptchaRef, ReCaptchaProps>(({
  onChange,
  onExpired,
  onError
}, ref) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // Check if recaptcha should be enabled based on hostname
  const isRecaptchaEnabled = () => {
    if (typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'psgames.app' || hostname === 'psgames.lovable.app';
  };

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (isRecaptchaEnabled()) {
        recaptchaRef.current?.reset();
      }
    },
    getValue: () => {
      if (isRecaptchaEnabled()) {
        return recaptchaRef.current?.getValue() || null;
      }
      return 'development-bypass';
    },
    execute: () => {
      if (isRecaptchaEnabled()) {
        recaptchaRef.current?.execute();
      } else {
        // In development, simulate recaptcha success
        setTimeout(() => onChange?.('development-bypass'), 100);
      }
    }
  }));

  // Don't render recaptcha in development
  if (!isRecaptchaEnabled()) {
    return null;
  }

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={RECAPTCHA_SITE_KEY}
      onChange={onChange}
      onExpired={onExpired}
      onError={onError}
      size="invisible"
    />
  );
});

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha;