type Report = {
  created_at: Date,
  fullness: number,
  fullnessInSM?: number,
  temperature: number,
  humidity: number,
  battery: number
}

export default Report;
