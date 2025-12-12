import { AnswerComment } from "../../enterprise/entities/answer-comment"

export interface AnswersCommentsRepository {
  create(answerComment: AnswerComment): Promise<void>
  findById(id: string): Promise<AnswerComment | null>
  delete(answerComment: AnswerComment): Promise<void>
  listAll(answerId: string): Promise<AnswerComment[]>
}
