type ReportDto= {
    id: string,
    address: string,
    fullness: number,
    battery: number,
    network: number,
    sleepTimeMinutes: number,
}

type FullnessItem = {
    name: string,
    fullness: number,
    created_at: Date,
};

export {ReportDto, FullnessItem};
