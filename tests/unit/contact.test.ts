import { describe, expect, it } from 'vitest';
import { findPlaceholders, mailtoHref, telHref, whatsappHref } from '../../src/lib/contact';

describe('contact links', () => {
  it('builds a tel: link without spaces', () => {
    expect(telHref('+977 9843679155')).toBe('tel:+9779843679155');
  });

  it('builds a wa.me link with digits only', () => {
    expect(whatsappHref('+977 9843679155')).toBe('https://wa.me/9779843679155');
  });

  it('builds a mailto: link', () => {
    expect(mailtoHref('shailendra.matat@gmail.com')).toBe('mailto:shailendra.matat@gmail.com');
  });
});

describe('findPlaceholders', () => {
  it('returns dotted paths of TBC_ strings in objects and arrays', () => {
    expect(findPlaceholders({ a: 'TBC_X', b: ['ok', { c: 'TBC_Y' }] })).toEqual(['a', 'b.1.c']);
  });
});

describe('findPlaceholders inside text', () => {
  it('flags a TBC_ token embedded in a longer string', () => {
    expect(findPlaceholders({ name: 'Shailendra TBC_SURNAME' })).toEqual(['name']);
  });
});

describe('submitContact', () => {
  it('returns an error naming the contact email when the key is a placeholder', async () => {
    const { submitContact } = await import('../../src/scripts/contact-form');
    const { contact } = await import('../../src/data/profile');
    const form = {
      action: 'https://api.web3forms.com/submit',
      elements: [],
    } as unknown as HTMLFormElement;
    const fakeFormData = class {
      constructor() {
        return [['access_key', 'TBC_WEB3FORMS_KEY']][Symbol.iterator]();
      }
    };
    const original = globalThis.FormData;
    globalThis.FormData = fakeFormData as unknown as typeof FormData;
    try {
      const result = await submitContact(form, () => {
        throw new Error('fetch must not be called');
      });
      expect(result.ok).toBe(false);
      expect(result.message).toContain(contact.email);
    } finally {
      globalThis.FormData = original;
    }
  });
});
