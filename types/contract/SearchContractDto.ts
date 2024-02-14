import { LocationDto } from './LocationDto';

export type SearchContractDto = {
    id: string;
    title: string;
    locations: LocationDto[];
    createdAt: string;
    updatedAt: string
};
