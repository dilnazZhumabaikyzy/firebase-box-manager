type ReportDto= {
    st: number,
}

type FullnessItem = {
    name: string,
    fullness: number,
    fullnessInSM: number | null,
    created_at: Date,
};

export {ReportDto, FullnessItem};
