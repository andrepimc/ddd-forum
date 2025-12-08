import type { QuestionsRespository } from "../../src/domain/forum/application/repositories/questions-repository";
import type { Question } from "../../src/domain/forum/enterprise/entities/question";


export class InMemoryQuestionsRepository implements QuestionsRespository {
  public items: Question[] = []
  async create(question: Question) {
    this.items.push(question)
  }
  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)
    if (!question) {
      return null
    }
    return question
  }
}