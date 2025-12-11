import { PaginationParams } from "../../../../core/repositories/pagination-params"
import type { Answer } from "../../../forum/enterprise/entities/answer"

export interface AnswersRepository {
  create(answer: Answer): Promise<void>
  findById(id: string): Promise<Answer | null>
  findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams
  ): Promise<Answer[]>
  delete(answer: Answer): Promise<void>
  save(answer: Answer): Promise<void>
}
