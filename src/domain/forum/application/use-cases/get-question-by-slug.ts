import type { QuestionsRespository } from "../repositories/questions-repository";

interface GetQuestionBySlugUseCaseRequest {
  slug: string
}

export class GetQuestionBySlugUseCase {
  constructor(
    private questionsRepository: QuestionsRespository
  ) { }
  async execute({ slug }: GetQuestionBySlugUseCaseRequest) {
    const question = await this.questionsRepository.findBySlug(slug)
    if (!question) {
      throw new Error('Question not found.')
    }
    return question
  }
}