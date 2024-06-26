
export class Transaction {
    id!: number;
    donatorEmail!: string;
    serverId?: number;
    serverName!: string;
    dateCreated!: Date;
    dateApproved?: Date;
    imagePreview: string | null = null;
    image: string | null = null;
    createdBy!: string;
    approvedBy?: number;
    state!: string;
    paymentMethod!: string;
    contributionAmount!: number;
    serverBonusPercentage!: number;
    personalBonusPercentage!: number;
    totalAmount!: number;
    comment!: string;
    adminBonus: number = 0;
    color?: string ;
}
