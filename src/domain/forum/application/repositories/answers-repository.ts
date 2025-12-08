import type { Answer } from "../../../forum/enterprise/entities/answer"

export interface AnswersRespository {
  create(answer: Answer): Promise<void>
  findById(id: string): Promise<Answer | null>
  delete(answer: Answer): Promise<void>
}
