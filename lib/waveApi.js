// lib/waveApi.js
const BASE_URL = "https://api.wave.com/v1/checkout/sessions";
const API_KEY  = process.env.WAVE_API_KEY;

// async function waveFetch(path = "", options = {}) {
//   const url = `${BASE_URL}${path}`;
//   const res = await fetch(url, {
//     ...options,
//     headers: {
//       "Content-Type":  "application/json",
//       "Authorization": `Bearer ${API_KEY}`,
//       ...(options.headers || {}),
//     },
//   });

//   if (!res.ok) {
//     let errMsg = `HTTP ${res.status}`;
//     try {
//       const errBody = await res.json();
//       errMsg = errBody.error?.message || errMsg;
//     } catch {}
//     throw new Error(`Wave API error: ${errMsg}`);
//   }

//   // Return parsed JSON (or empty object)
//   const text = await res.text();
//   return text ? JSON.parse(text) : {};
// }

// lib/waveApi.js
async function waveFetch(path = "", options = {}) {
  const url     = `${BASE_URL}${path}`;
  const payload = options.body && JSON.parse(options.body);
  console.log("▶︎ Wave request:", url, payload);

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${API_KEY}`,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    let errMsg = `HTTP ${res.status}`;
    try {
      const errBody = await res.json();
      console.error("◀︎ Wave responded:", errBody);
      errMsg = errBody.error?.message || errMsg;
    } catch {}
    throw new Error(`Wave API error: ${errMsg}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : {};
}


export function createCheckoutSession(amount, phoneNumber, opts = {}) {
  return waveFetch("", {
    method: "POST",
    body: JSON.stringify({
      amount:                String(amount),
      currency:              "XOF",
      restrict_payer_mobile: phoneNumber,
      error_url:             opts.errorUrl,   // pass in from client or API route
      success_url:           opts.successUrl, // ditto
    }),
  });
}

export function retrieveCheckoutBySessionId(id) {
  return waveFetch(`/${id}`, { method: "GET" });
}

export function retrieveCheckoutByTransactionId(id) {
  return waveFetch(`/${id}`, { method: "GET" });
}

export function searchCheckout(clientRef) {
  return waveFetch(`/search?client_reference=${encodeURIComponent(clientRef)}`, { method: "GET" });
}

export function refundCheckoutSession(id) {
  return waveFetch(`/${id}/refund`, { method: "POST", body: null });
}

export function expireCheckoutSession(id) {
  return waveFetch(`/${id}/expire`, { method: "POST", body: null });
}
