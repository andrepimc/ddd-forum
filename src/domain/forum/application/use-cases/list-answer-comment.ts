import { AnswersCommentsRepository } from "../repositories/answers-comment-repository"

interface ListAnswerCommentsUseCaseRequest {
  answerId: string
}

export class ListAnswerCommentsUseCase {
  constructor(private answerCommentsRepository: AnswersCommentsRepository) {}
  async execute({ answerId }: ListAnswerCommentsUseCaseRequest) {
    const answerComments = await this.answerCommentsRepository.listAll(answerId)

    return answerComments
  }
}
