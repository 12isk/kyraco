// Integration test: POST /api/checkout — Supabase et Wave mockés.

jest.mock('../lib/supabase', () => ({
  supabase: { from: jest.fn() },
}));

jest.mock('../lib/waveApi', () => ({
  createCheckoutSession: jest.fn(),
}));

import { POST } from '../app/api/checkout/route';
import { supabase } from '../lib/supabase';
import { createCheckoutSession } from '../lib/waveApi';

const VALID_BODY = {
  customer: {
    firstName: 'Ibrahima',
    lastName: 'Keita',
    email: 'ib@maat.ci',
    phone: '+2250101020304',
    address: '12 Rue des Fleurs',
    suite: 'Apt 3',
    city: 'Abidjan',
  },
  amount: 15000,
  phoneNumber: '+2250101020304',
  items: [{ slug: 'kayak-pro', qty: 1, price: 15000 }],
};

function makeRequest(body = VALID_BODY) {
  return new Request('http://localhost/api/checkout', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      origin: 'http://localhost:3000',
    },
  });
}

let mockSingle, mockInsert, mockUpdate, mockEq;

beforeEach(() => {
  jest.clearAllMocks();

  mockSingle = jest.fn().mockResolvedValue({ data: { id: 'order-99' }, error: null });
  const mockSelect = jest.fn().mockReturnValue({ single: mockSingle });
  mockInsert = jest.fn().mockReturnValue({ select: mockSelect });
  mockEq = jest.fn().mockResolvedValue({ error: null });
  mockUpdate = jest.fn().mockReturnValue({ eq: mockEq });

  supabase.from.mockReturnValue({
    insert: mockInsert,
    update: mockUpdate,
  });

  createCheckoutSession.mockResolvedValue({
    id: 'wave-sess-abc',
    wave_launch_url: 'https://checkout.wave.com/pay/wave-sess-abc',
  });
});

describe('POST /api/checkout', () => {
  it('retourne 200 avec orderId, session_id et wave_launch_url', async () => {
    const res = await POST(makeRequest());
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.orderId).toBe('order-99');
    expect(data.session_id).toBe('wave-sess-abc');
    expect(data.wave_launch_url).toBe('https://checkout.wave.com/pay/wave-sess-abc');
  });

  it('passe orderId comme clientReference à createCheckoutSession', async () => {
    await POST(makeRequest());
    expect(createCheckoutSession).toHaveBeenCalledWith(
      15000,
      '+2250101020304',
      expect.objectContaining({ clientReference: 'order-99' })
    );
  });

  it("inclut orderId dans les URLs de succès et d'erreur", async () => {
    await POST(makeRequest());
    const args = createCheckoutSession.mock.calls[0][2];
    expect(args.successUrl).toContain('order-99');
    expect(args.errorUrl).toContain('order-99');
  });

  it('concatène address + suite dans shipping_address', async () => {
    await POST(makeRequest());
    const insertPayload = mockInsert.mock.calls[0][0][0];
    expect(insertPayload.shipping_address).toBe('12 Rue des Fleurs, Apt 3');
  });

  it("utilise l'address seule quand suite est absent", async () => {
    const body = { ...VALID_BODY, customer: { ...VALID_BODY.customer, suite: '' } };
    await POST(makeRequest(body));
    const insertPayload = mockInsert.mock.calls[0][0][0];
    expect(insertPayload.shipping_address).toBe('12 Rue des Fleurs');
  });

  it('insère la commande avec payment_status=processing et total correct', async () => {
    await POST(makeRequest());
    const insertPayload = mockInsert.mock.calls[0][0][0];
    expect(insertPayload.payment_status).toBe('processing');
    expect(insertPayload.total).toBe(15000);
  });

  it('retourne 500 quand Supabase insert échoue', async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: 'DB constraint violated' } });
    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
    const data = await res.json();
    expect(data.error).toBe('DB constraint violated');
  });

  it("retourne 500 quand l'API Wave lève une exception", async () => {
    createCheckoutSession.mockRejectedValue(new Error('Wave unreachable'));
    const res = await POST(makeRequest());
    expect(res.status).toBe(500);
  });
});
