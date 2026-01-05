import { AnswerAttachmentsRepository } from "../../src/domain/forum/application/repositories/answer-comments.repository"
import { AnswerAttachment } from "../../src/domain/forum/enterprise/entities/answer-attachment"

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  items: AnswerAttachment[] = []

  async findManyByAnswerId(answerId: string) {
    return this.items.filter((item) => item.answerId.toString() === answerId)
  }

  async deleteManyByAnswerId(answerId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.answerId.toString() !== answerId
    )
  }
}
