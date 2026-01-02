import { left, right, type Either } from "../../../../core/either"
import { AnswersCommentsRepository } from "../repositories/answers-comment-repository"
import { NotAllowedError } from "./errors/not-allowed-error"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface DeleteCommentAnswerUseCaseRequest {
  answerCommentId: string
  authorId: string
}

type DeleteCommentAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {}
>

export class DeleteCommentAnswerUseCase {
  constructor(private answerCommentsRepository: AnswersCommentsRepository) {}
  async execute({
    answerCommentId,
    authorId,
  }: DeleteCommentAnswerUseCaseRequest): Promise<DeleteCommentAnswerUseCaseResponse> {
    const answerComment = await this.answerCommentsRepository.findById(
      answerCommentId
    )

    if (!answerComment) {
      return left(new ResourceNotFoundError())
    }

    if (answerComment.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answerCommentsRepository.delete(answerComment)

    return right({}) // success
  }
}
