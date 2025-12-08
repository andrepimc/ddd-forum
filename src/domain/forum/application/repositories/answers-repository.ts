import type { Answer } from "../../../forum/enterprise/entities/answer";

export interface AnswersRespository {
  create(answer: Answer): Promise<void>
}