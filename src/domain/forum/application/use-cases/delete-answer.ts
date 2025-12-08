import { AnswersRespository } from "../repositories/answers-repository"

interface DeleteAnswerUseCaseRequest {
  id: string
  authorId: string
}

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRespository) {}
  async execute({ id, authorId }: DeleteAnswerUseCaseRequest) {
    const answer = await this.answersRepository.findById(id)

    if (!answer) {
      throw new Error("answer not found.")
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error("You are not allowed to delete this answer.")
    }

    await this.answersRepository.delete(answer)

    return { answer }
  }
}
