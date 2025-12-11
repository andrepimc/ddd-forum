import { AnswersCommentsRepository } from "../../src/domain/forum/application/repositories/answers-comment-repository"
import { AnswerComment } from "../../src/domain/forum/enterprise/entities/answer-comment"

export class InMemoryAnswersCommentsRepository
  implements AnswersCommentsRepository
{
  public items: AnswerComment[] = []

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }
}
