import { Either, left, right } from "../../../../core/either"
import { QuestionsCommentsRepository } from "../repositories/questions-comments-repository"
import { NotAllowedError } from "./errors/not-allowed-error"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface DeleteCommentQuestionUseCaseRequest {
  questionCommentId: string
  authorId: string
}

type DeleteCommentQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteCommentQuestionUseCase {
  constructor(
    private questionCommentsRepository: QuestionsCommentsRepository
  ) {}
  async execute({
    questionCommentId,
    authorId,
  }: DeleteCommentQuestionUseCaseRequest): Promise<DeleteCommentQuestionUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(
      questionCommentId
    )

    if (!questionComment) {
      return left(new ResourceNotFoundError())
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionCommentsRepository.delete(questionComment)

    return right({})
  }
}
