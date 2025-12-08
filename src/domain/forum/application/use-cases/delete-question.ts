import type { QuestionsRespository } from "../repositories/questions-repository"

interface DeleteQuestionUseCaseRequest {
  id: string
  authorId: string
}

export class DeleteQuestionUseCase {
  constructor(private questionsRepository: QuestionsRespository) {}
  async execute({ id, authorId }: DeleteQuestionUseCaseRequest) {
    const question = await this.questionsRepository.findById(id)

    if (!question) {
      throw new Error("Question not found.")
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error("You are not allowed to delete this question.")
    }

    await this.questionsRepository.delete(question)

    return { question }
  }
}
