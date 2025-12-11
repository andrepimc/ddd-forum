import { QuestionsCommentsRepository } from "../../src/domain/forum/application/repositories/questions-comments-repository"
import { QuestionComment } from "../../src/domain/forum/enterprise/entities/question-comment"

export class InMemoryQuestionsCommentsRepository
  implements QuestionsCommentsRepository
{
  public items: QuestionComment[] = []

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }
}
