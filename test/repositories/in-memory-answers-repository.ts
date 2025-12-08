import type { AnswersRespository } from "../../src/domain/forum/application/repositories/answers-repository"
import type { Answer } from "../../src/domain/forum/enterprise/entities/answer"

export class InMemoryAnswersRepository implements AnswersRespository {
  public items: Answer[] = []
  async create(answer: Answer) {
    this.items.push(answer)
  }
}