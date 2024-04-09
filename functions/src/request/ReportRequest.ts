import ReportDto from "../dto/reportDto";


type ReportRequest = {
  body: ReportDto,
  params: { entryId: string },
}

export default ReportRequest