import { contact } from '../data/profile';

const SUCCESS_MESSAGE = "Thanks — I'll get back to you soon.";
const ERROR_MESSAGE = `Sorry, that didn't send. Please email me at ${contact.email}.`;

export async function submitContact(
  form: HTMLFormElement,
  fetchImpl: typeof fetch = fetch,
): Promise<{ ok: boolean; message: string }> {
  const data = Object.fromEntries(new FormData(form));
  const key = String(data.access_key ?? '');
  if (!key || key.startsWith('TBC_')) {
    return { ok: false, message: ERROR_MESSAGE };
  }

  try {
    const response = await fetchImpl(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await response.json().catch(() => null);
    if (response.ok && json?.success === true) {
      return { ok: true, message: SUCCESS_MESSAGE };
    }
  } catch {
    // Network failure: fall through to the error message.
  }
  return { ok: false, message: ERROR_MESSAGE };
}

export function initContactForm(form: HTMLFormElement): void {
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const status = form.querySelector<HTMLElement>('[data-testid="form-status"]');
  if (!button || !status) return;
  const idleLabel = button.textContent;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (button.disabled) return;

    button.disabled = true;
    button.textContent = 'Sending…';
    status.textContent = '';
    status.dataset.state = '';
    status.setAttribute('role', 'status');

    const result = await submitContact(form);

    status.textContent = result.message;
    status.dataset.state = result.ok ? 'success' : 'error';
    // Errors interrupt so screen-reader users learn the message was not sent.
    status.setAttribute('role', result.ok ? 'status' : 'alert');
    if (result.ok) form.reset();
    button.disabled = false;
    button.textContent = idleLabel;
  });
}
