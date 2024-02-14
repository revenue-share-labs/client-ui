import { Recipient } from './Recipient';
import { ControllerDto } from './ControllerDto';
import { DistributorDto } from './DistributorDto';
import { OwnerDto } from './OwnerDto';

export type ContractDto = {
  id?: string;
  title?: string;
  description?: string;
  version: string;
  chain?: string;
  type: string;

  immutableController?: boolean;
  visibility: string;
  controller?: ControllerDto;
  distributor?: DistributorDto;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  currencies?: any[];

  isRecipientsLocked?: boolean;
  recipients?: Recipient[];
  distribution?: string;
  autoNativeCurrencyDistribution?: boolean;
  minAutoDistributionAmount?: number;
  owner?: OwnerDto;
  author?: string;
  address?: string;
  visualizationUrl?: string;
  legalAgreementUrl?: string;
};
