import Report from "../dto/reportDto";
import ReportModel from "../model/report";
import user from "../model/user";


type ResponsesRequests = {
  body: Report,
  params: { entryId: string },
}


type ReportResponse = {
  body: ReportModel,
};

type UserRequest = {
  body: user,
  params: { username: string },
}

export {ResponsesRequests, ReportResponse, UserRequest};
