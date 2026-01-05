import { QuestionAttachmentsRepository } from "../../src/domain/forum/application/repositories/question-attachments-repository"
import { QuestionAttachment } from "../../src/domain/forum/enterprise/entities/question-attachment"

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  items: QuestionAttachment[] = []

  async findManyByQuestionId(questionId: string) {
    return this.items.filter(
      (item) => item.questionId.toString() === questionId
    )
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId
    )
  }
}
