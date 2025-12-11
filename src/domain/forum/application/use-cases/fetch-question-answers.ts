import { AnswersRepository } from "../repositories/answers-repository"

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string
  page: number
}

export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}
  async execute({ questionId, page }: FetchQuestionAnswersUseCaseRequest) {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page }
    )
    return { answers }
  }
}
