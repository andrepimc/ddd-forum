import { Either, right } from "../../../../core/either"
import { QuestionComment } from "../../enterprise/entities/question-comment"
import { QuestionsCommentsRepository } from "../repositories/questions-comments-repository"

interface ListQuestionCommentsUseCaseRequest {
  questionId: string
}

type ListQuestionCommentsUseCaseResponse = Either<
  null,
  { questionComments: QuestionComment[] }
>

export class ListQuestionCommentsUseCase {
  constructor(
    private questionCommentsRepository: QuestionsCommentsRepository
  ) {}
  async execute({
    questionId,
  }: ListQuestionCommentsUseCaseRequest): Promise<ListQuestionCommentsUseCaseResponse> {
    const questionComments = await this.questionCommentsRepository.listAll(
      questionId
    )

    return right({ questionComments })
  }
}
