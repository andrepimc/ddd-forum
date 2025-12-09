import { AnswersRespository } from "../repositories/answers-repository"

interface EditAnswerUseCaseRequest {
  id: string
  authorId: string
  content: string
}

export class EditAnswerUseCase {
  constructor(private AnswersRepository: AnswersRespository) {}
  async execute({ id, authorId, content }: EditAnswerUseCaseRequest) {
    const answer = await this.AnswersRepository.findById(id)

    if (!answer) {
      throw new Error("Answer not found.")
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error("You are not allowed to delete this Answer.")
    }

    answer.content = content

    await this.AnswersRepository.save(answer)

    return { answer }
  }
}
