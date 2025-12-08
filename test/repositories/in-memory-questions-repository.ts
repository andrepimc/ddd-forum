import type { QuestionsRespository } from "../../src/domain/forum/application/repositories/questions-repository"
import type { Question } from "../../src/domain/forum/enterprise/entities/question"

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
  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)
    if (!question) {
      return null
    }
    return question
  }
  async delete(question: Question) {
    this.items.splice(this.items.indexOf(question), 1)
  }
  async save(question: Question) {
    const itemIndex = this.items.findIndex((item) => item.id === question.id)
    this.items[itemIndex] = question
  }
}
