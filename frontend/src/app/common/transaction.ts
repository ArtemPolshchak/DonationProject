export class Transaction {
    id!: number;
    donatorEmail!: string;
    serverName!: string;
    dateCreated!: Date;
    dateApproved?: Date;
    imageUrl!: string;
    createdBy!: string;
    approvedBy?: number;
    state!: string;
    contributionAmount!: number;
    totalAmount!: number;
    comment!: string;
    adminBonus: number = 0;
}
