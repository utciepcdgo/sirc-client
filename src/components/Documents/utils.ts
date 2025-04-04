// Definition: Contains utility functions for the Documents component.

// Get current time as Unix timestamp
import { Registration } from '@/types/types';

export const currentUnixTime = () => Math.floor(new Date().getTime() / 1000);

// Get current date as sentence
export const currentDateToText = (): string => {
  const date = new Date();
  const day = date.getDate();
  const month = date.toLocaleString('es-ES', { month: 'long' });
  const year = date.getFullYear();

  return `Victoria de Durango, Dgo., a ${day} de ${month} de ${year}.`;
};

// Define the sex of the registration in the PDF form
export const defineSex = (registration: Registration) =>
  registration.sex.id === '1' ? 'woman' : registration.sex.id === '2' ? 'man' : 'queer';

// Define age range, possible values are 18-30, 31-40, 41-50, 51-60, 60+
export const defineAgeRange = (age: number) => {
  if (age >= 18 && age <= 30) {
    return '18to30';
  } else if (age >= 31 && age <= 40) {
    return '31to40';
  } else if (age >= 41 && age <= 50) {
    return '41to50';
  } else if (age >= 51 && age <= 60) {
    return '51to60';
  } else {
    return '60plus';
  }
};

// Aprendiendo a odiar Chrome y sus basados.
export async function loadRemoteFontBase64(url: string): Promise<string> {
  const response = await fetch(url);
  const fontBytes = await response.arrayBuffer();
  const uint8Array = new Uint8Array(fontBytes);

  let binaryString = "";
  const chunkSize = 8192; // Se divide en partes (chunks) de 8KB. Chrome no soporta strings de más de 8KB.

  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    binaryString += String.fromCharCode(...uint8Array.slice(i, i + chunkSize));
  }

  return btoa(binaryString);
}
