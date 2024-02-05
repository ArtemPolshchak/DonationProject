export class Transaction {
    id!: number;
    donatorEmail!: string;
    serverId!: number;
    dateCreated!: Date;
    dateApproved?: Date;
    imageUrl!: string;
    createdByUserId!: number;
    approvedByUserId?: number;
    state!: string;
    contributionAmount!: number;
    totalAmount!: number;
    comment!: string;
}
