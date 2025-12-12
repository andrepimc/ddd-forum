import { QuestionsCommentsRepository } from "../repositories/questions-comments-repository"

interface ListQuestionCommentsUseCaseRequest {
  questionId: string
}

export class ListQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: QuestionsCommentsRepository
  ) {}
  async execute({ questionId }: ListQuestionCommentsUseCaseRequest) {
    const questionComments = await this.questionCommentsRepository.listAll(
      questionId
    )

    return questionComments
  }
}
