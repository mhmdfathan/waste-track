interface GeocodingResult {
  latitude: number;
  longitude: number;
  displayName: string;
  error?: string;
}

export async function getCoordinatesFromAddress(
  address: string,
): Promise<GeocodingResult> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address,
      )}&format=json&limit=1`,
      {
        headers: {
          'User-Agent': 'WasteTrack App (waste.track@example.com)', // Best practice to identify your application
          'Accept-Language': 'id', // Prefer Indonesian results
        },
      },
    );

    if (!res.ok) {
      throw new Error(`Geocoding failed with status: ${res.status}`);
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      return {
        latitude: 0,
        longitude: 0,
        displayName: '',
        error: 'Address not found',
      };
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch (error) {
    console.error('Geocoding error:', error);
    return {
      latitude: 0,
      longitude: 0,
      displayName: '',
      error: error instanceof Error ? error.message : 'Geocoding failed',
    };
  }
}
