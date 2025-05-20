import { CompanyProfile, UserRole, WasteType } from '@prisma/client';

export type CompanyProfileWithWasteTypes = CompanyProfile & {
  acceptedWasteTypes: WasteType[];
};

export type TimbangDataType = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  weight: number;
  wasteType: WasteType;
  value: number;
  nasabahId: string;
  transactionId: string;
};

export type UserRoleWithRelations = UserRole & {
  companyProfile: CompanyProfileWithWasteTypes | null;
  timbangData: TimbangDataType[];
};
