import type { QuestionsRepository } from "../repositories/questions-repository"

interface FetchRecentQuestionsUseCaseRequest {
  page: number
}

export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({ page }: FetchRecentQuestionsUseCaseRequest) {
    const questions = await this.questionsRepository.findManyRecent({ page })
    return { questions }
  }
}
