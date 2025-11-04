export const onlyDigits = (value: string) => value.replace(/\D/g, '');

export const isValidCPFLength = (value: string) => onlyDigits(value).length === 11;

export const isValidTelefoneLength = (value: string) => {
  const len = onlyDigits(value).length;
  return len === 11;
};
