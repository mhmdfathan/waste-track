import { getDistanceFromLatLonInKm } from './distance';
import { getCoordinatesFromAddress } from './geocode';

interface Location {
  latitude: number;
  longitude: number;
}

interface DeliveryFeeConfig {
  deliveryRadius: number;
  deliveryFeeBase: number;
  feePerKm: number;
}

interface DeliveryCalculation {
  distance: number;
  fee: number;
  isFree: boolean;
  error?: string;
}

// Calculate delivery fee using coordinates
export function calculateDeliveryFee(
  buyerLocation: Location,
  sellerLocation: Location,
  config: DeliveryFeeConfig,
): DeliveryCalculation {
  const distance = getDistanceFromLatLonInKm(
    buyerLocation.latitude,
    buyerLocation.longitude,
    sellerLocation.latitude,
    sellerLocation.longitude,
  );

  const isFree = distance <= config.deliveryRadius;

  if (isFree) {
    return {
      distance,
      fee: 0,
      isFree: true,
    };
  }

  // Calculate fee for distance beyond free delivery radius
  const extraDistance = distance - config.deliveryRadius;
  const fee =
    config.deliveryFeeBase + Math.ceil(extraDistance) * config.feePerKm;

  return {
    distance,
    fee,
    isFree: false,
  };
}

// Calculate delivery fee using addresses
export async function calculateDeliveryFeeFromAddresses(
  buyerAddress: string,
  sellerAddress: string,
  config: DeliveryFeeConfig,
): Promise<DeliveryCalculation> {
  try {
    // Get coordinates for both addresses
    const [buyerCoords, sellerCoords] = await Promise.all([
      getCoordinatesFromAddress(buyerAddress),
      getCoordinatesFromAddress(sellerAddress),
    ]);

    // Check for geocoding errors
    if (buyerCoords.error) {
      throw new Error(`Buyer address error: ${buyerCoords.error}`);
    }
    if (sellerCoords.error) {
      throw new Error(`Seller address error: ${sellerCoords.error}`);
    }

    // Calculate using the coordinates
    return calculateDeliveryFee(
      { latitude: buyerCoords.latitude, longitude: buyerCoords.longitude },
      { latitude: sellerCoords.latitude, longitude: sellerCoords.longitude },
      config,
    );
  } catch (error) {
    console.error('Delivery fee calculation error:', error);
    return {
      distance: 0,
      fee: 0,
      isFree: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to calculate delivery fee',
    };
  }
}

// Helper function to format the delivery fee in Rupiah
export function formatDeliveryFee(fee: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(fee);
}
