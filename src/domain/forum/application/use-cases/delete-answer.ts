import { Either, left, right } from "../../../../core/either"
import { AnswersRepository } from "../repositories/answers-repository"
import { Answer } from "../../enterprise/entities/answer"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"
import { NotAllowedError } from "./errors/not-allowed-error"

interface DeleteAnswerUseCaseRequest {
  id: string
  authorId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}
  async execute({
    id,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(id)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return right({ answer })
  }
}
