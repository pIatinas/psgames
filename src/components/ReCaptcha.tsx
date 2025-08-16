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

  useImperativeHandle(ref, () => ({
    reset: () => {
      recaptchaRef.current?.reset();
    },
    getValue: () => {
      return recaptchaRef.current?.getValue() || null;
    },
    execute: () => {
      recaptchaRef.current?.execute();
    }
  }));

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