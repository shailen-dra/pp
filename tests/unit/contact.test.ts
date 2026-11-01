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
