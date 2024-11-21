/* eslint-disable prettier/prettier */
import { RandomValueGenerator } from './random-value-generator.interface';

const cities: string[] = [
    // Asia
    "Seoul", "Tokyo", "Beijing", "Shanghai", "Hong Kong", "Bangkok", 
    "Kuala Lumpur", "Singapore", "Jakarta", "New Delhi",

    // Europe
    "London", "Paris", "Berlin", "Madrid", "Rome", "Amsterdam", 
    "Barcelona", "Prague", "Lisbon", "Budapest",

    // North America
    "New York", "Los Angeles", "Chicago", "Toronto", "Vancouver", 
    "Washington D.C.", "Miami", "San Francisco", "Mexico City",

    // South America
    "São Paulo", "Rio de Janeiro", "Buenos Aires", "Bogotá", 
    "Santiago", "Caracas", "Lima", "Quito",

    // Africa
    "Cape Town", "Johannesburg", "Nairobi", "Cairo", "Lagos", 
    "Accra", "Abidjan", "Casablanca", "Algiers",

    // Oceania
    "Sydney", "Melbourne", "Brisbane", "Auckland", "Wellington"
];

export class CityGenerator extends RandomValueGenerator<string> {
  getRandomValue(): string {
    const cityIdx = Math.floor(Math.random() * cities.length);
    return cities[cityIdx];
  }
}
