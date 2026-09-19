// Le webhook route importe supabase au niveau module (qui lit les env vars).
// On le mocke pour éviter l'erreur à l'import.
jest.mock('../lib/supabase', () => ({
  supabase: { from: jest.fn() },
}));

import crypto from 'crypto';
import { verifyWaveSignature } from '../app/api/checkout/webhook/route';

function sign(body, secret) {
  return crypto.createHmac('sha256', secret).update(body).digest('hex');
}

const body = '{"type":"checkout.session.completed"}';
const validSig = sign(body, 'test_secret');

describe('verifyWaveSignature', () => {
  it('accepte une signature HMAC-SHA256 valide', () => {
    expect(verifyWaveSignature(body, validSig, 'test_secret')).toBe(true);
  });

  it('rejette un body altéré (même signature, body différent)', () => {
    expect(verifyWaveSignature(body + 'x', validSig, 'test_secret')).toBe(false);
  });

  it('rejette une mauvaise clé secrète', () => {
    const badSig = sign(body, 'wrong_secret');
    expect(verifyWaveSignature(body, badSig, 'test_secret')).toBe(false);
  });

  it('rejette une signature null', () => {
    expect(verifyWaveSignature(body, null, 'test_secret')).toBe(false);
  });

  it('rejette une signature undefined', () => {
    expect(verifyWaveSignature(body, undefined, 'test_secret')).toBe(false);
  });

  it('rejette une signature vide', () => {
    expect(verifyWaveSignature(body, '', 'test_secret')).toBe(false);
  });

  it('rejette un secret null', () => {
    expect(verifyWaveSignature(body, validSig, null)).toBe(false);
  });
});
