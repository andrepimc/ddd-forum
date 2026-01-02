import { Either, left, right } from "../../../../core/either"
import { Answer } from "../../enterprise/entities/answer"
import { AnswersRepository } from "../repositories/answers-repository"
import { NotAllowedError } from "./errors/not-allowed-error"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface EditAnswerUseCaseRequest {
  id: string
  authorId: string
  content: string
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { answer: Answer }
>

export class EditAnswerUseCase {
  constructor(private AnswersRepository: AnswersRepository) {}
  async execute({
    id,
    authorId,
    content,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.AnswersRepository.findById(id)

    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    answer.content = content

    await this.AnswersRepository.save(answer)

    return right({ answer })
  }
}
