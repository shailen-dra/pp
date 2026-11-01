export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export function whatsappHref(phone: string): string {
  return `https://wa.me/${phone.replace(/\D/g, '')}`;
}

export function mailtoHref(email: string): string {
  return `mailto:${email}`;
}

/** Dotted paths of every string value containing a `TBC_` token. */
export function findPlaceholders(value: unknown, path = ''): string[] {
  if (typeof value === 'string') {
    return /\bTBC_/.test(value) ? [path] : [];
  }
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      findPlaceholders(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}
