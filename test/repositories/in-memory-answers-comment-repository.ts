import { AnswersCommentsRepository } from "../../src/domain/forum/application/repositories/answers-comment-repository"
import { AnswerComment } from "../../src/domain/forum/enterprise/entities/answer-comment"

export class InMemoryAnswersCommentsRepository
  implements AnswersCommentsRepository
{
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id)
    if (!answerComment) {
      return null
    }
    return answerComment
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === answerComment.id
    )
    this.items.splice(itemIndex, 1)
  }
}
