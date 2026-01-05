import { PaginationParams } from "../../src/core/repositories/pagination-params"
import { AnswerAttachmentsRepository } from "../../src/domain/forum/application/repositories/answer-comments.repository"
import type { AnswersRepository } from "../../src/domain/forum/application/repositories/answers-repository"
import type { Answer } from "../../src/domain/forum/enterprise/entities/answer"

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository
  ) {}

  async create(answer: Answer) {
    this.items.push(answer)
  }
  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)
    if (!answer) {
      return null
    }
    return answer
  }
  async delete(answer: Answer) {
    this.items.splice(this.items.indexOf(answer), 1)
    //delete answer attachments
    this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
  }
  async save(answer: Answer) {
    const itemIndex = this.items.findIndex((item) => item.id === answer.id)
    this.items[itemIndex] = answer
  }
  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionAnswers = this.items.filter(
      (item) => item.questionId.toString() === questionId
    )
    return questionAnswers
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)
  }
}
