import { Either, left, right } from "../../../../core/either"
import { Question } from "../../enterprise/entities/question"
import type { QuestionsRepository } from "../repositories/questions-repository"
import { NotAllowedError } from "./errors/not-allowed-error"
import { ResourceNotFoundError } from "./errors/resource-not-found-error"

interface DeleteQuestionUseCaseRequest {
  id: string
  authorId: string
}

type DeleteQuestionUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}
  async execute({
    id,
    authorId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(id)

    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.authorId.toString() !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionsRepository.delete(question)

    return right({ question })
  }
}
