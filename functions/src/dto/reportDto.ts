type ReportDto= {
    id: string,
    address: string,
    fullness: number,
    sleepTimeMinutes: number,
    fullnessInSM: number,
}

type FullnessItem = {
    name: string,
    fullness: number,
    fullnessInSM: number | null,
    created_at: Date,
};

export {ReportDto, FullnessItem};
