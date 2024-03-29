export interface UserDto {
    userId: string;
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
    walletAddress?: string | null;
    birthday?: string | null; // DateOnly in C# can be represented as string in TypeScript
    status: number;
    role: string;
    orchids: Orchid[]; // Assuming Orchid is another DTO
}

export interface Orchid {
    // Define properties of the Orchid DTO
}

export interface OrchidDto {
    orchidId: string;
    name: string;
    description?: string | null;
    imageUrl?: string | null;
    ownerId: string;
    depositedStatus: DepositStatus;
    owner: UserDto; // Assuming UserDto is already defined
}

// Define DepositStatus enum
export enum DepositStatus {
    // Define enum values based on your C# enum
}