import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

export interface ReCaptchaRef {
  reset: () => void;
  getValue: () => string | null;
}

interface ReCaptchaProps {
  onChange?: (token: string | null) => void;
  onExpired?: () => void;
  onError?: () => void;
  size?: 'compact' | 'normal';
  theme?: 'light' | 'dark';
}

const RECAPTCHA_SITE_KEY = '6LdYeqcrAAAAAFP8DwaRhxjSogUEQfh2WuayEJcz';

const ReCaptcha = forwardRef<ReCaptchaRef, ReCaptchaProps>(({
  onChange,
  onExpired,
  onError,
  size = 'normal',
  theme = 'dark'
}, ref) => {
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      recaptchaRef.current?.reset();
    },
    getValue: () => {
      return recaptchaRef.current?.getValue() || null;
    }
  }));

  return (
    <ReCAPTCHA
      ref={recaptchaRef}
      sitekey={RECAPTCHA_SITE_KEY}
      onChange={onChange}
      onExpired={onExpired}
      onError={onError}
      size={size}
      theme={theme}
    />
  );
});

ReCaptcha.displayName = 'ReCaptcha';

export default ReCaptcha;